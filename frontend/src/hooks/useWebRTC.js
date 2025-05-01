import { useEffect, useRef, useState } from "react";
import { apiGet } from "../utils/api";

export const useWebRTC = (roomId, user, localStream, stompClientRef, isConnected) => {
  const peerConnections = useRef({});
  const [remoteStreams, setRemoteStreams] = useState([]);
  const pendingCandidates = useRef({});
  
  // 방에 있는 기존 사용자 목록을 가져와서 연결
  const fetchExistingUsersAndConnect = async () => {
    try {
      const res = await apiGet(`/rooms/${roomId}/members`);
      console.log("기존 방 사용자 불러오기 성공", res);
      for (const member of res) {
        if (member.userId === user.id) continue; // 나 자신은 스킵
        await createPeerConnection(member.userId, member.nickname, true); // 내가 initiator
      }
    } catch (e) {
      console.error("기존 방 사용자 불러오기 실패", e);
    }
  };
  
  // 시그널 전송 함수
  const sendSignal = (type, data, targetId = null) => {
    if (!user || !isConnected) return;

    console.log(`[sendSignal] ${type} ${targetId ? `to ${targetId}` : ""}`, data);

    stompClientRef.current?.publish({
      destination: "/pub/signal",
      body: JSON.stringify({
        type,
        roomId,
        senderId: user.id,
        senderNickname: user.nickname,
        targetId,
        data,
      }),
    });
  };

  const removePeer = (peerId) => {
    const pc = peerConnections.current[peerId];
    if (pc) {
      console.log(`[removePeer] 피어 연결 종료 및 제거 - peerId: ${peerId}`);
      pc.close();
      delete peerConnections.current[peerId];
      setRemoteStreams((prev) => {
        const next = prev.filter((s) => s.peerId !== peerId);
        if (next.length === 0) {
          console.log("[removePeer] 모든 피어 연결 종료");
        } else {
          console.log("[removePeer] 피어 연결 종료", next);
        }
        return next;
      });
    } else {
      console.warn(`[removePeer] 피어 연결이 존재하지 않음 - peerId: ${peerId}`);
    }
  };

  const createPeerConnection = async (peerId, nickname, isInitiator) => {
    if (peerConnections.current[peerId]) {
      console.warn(`[createPeerConnection] 이미 연결이 존재함 : ${peerId}`);
      return;
    }

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnections.current[peerId] = pc;

    console.log(`[createPeerConnection] → ${peerId} (${nickname}), initiator: ${isInitiator}`);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignal("ice", event.candidate, peerId);
      }
    };

    pc.ontrack = (event) => {
      const stream = event.streams?.[0];
      if (!stream) return;
      setRemoteStreams((prev) => {
        const filtered = prev.filter((s) => s.peerId !== peerId);
        return [...filtered, { peerId, stream, nickname }];
      });
    };

    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });

    if (isInitiator) {
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        sendSignal("offer", offer, peerId);
      } catch (e) {
        console.error(`[createPeerConnection] offer 생성 실패: ${peerId}`, e);
      }
    }
  };

  const handleOffer = async (peerId, nickname, offer) => {
    const existing = peerConnections.current[peerId];
    if (existing && existing.signalingState !== "stable") {
      console.warn(`[handleOffer] ${peerId} 이미 stable 아님, offer 무시`);
      return;
    }

    removePeer(peerId);
    console.log(`[handleOffer] from: ${peerId} (${nickname})`);

    await createPeerConnection(peerId, nickname, false);
    const newPc = peerConnections.current[peerId];

    try {
      await newPc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await newPc.createAnswer();
      await newPc.setLocalDescription(answer);
      sendSignal("answer", answer, peerId);

      if (pendingCandidates.current[peerId]) {
        for (const c of pendingCandidates.current[peerId]) {
          await newPc.addIceCandidate(new RTCIceCandidate(c));
        }
        delete pendingCandidates.current[peerId];
      }
    } catch (err) {
      console.error(`[handleOffer] 처리 실패 (${peerId}):`, err);
      removePeer(peerId);
    }
  };

  const handleAnswer = async (peerId, answer) => {
    console.log(`[handleAnswer] from: ${peerId}`);
    const pc = peerConnections.current[peerId];
    if (!pc) return;

    if (pc.signalingState !== "have-local-offer") {
      console.warn(`[handleAnswer] ${peerId} 상태가 ${pc.signalingState}, answer 무시`);
      return;
    }

    try {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
      if (pendingCandidates.current[peerId]) {
        for (const c of pendingCandidates.current[peerId]) {
          await pc.addIceCandidate(new RTCIceCandidate(c));
        }
        delete pendingCandidates.current[peerId];
      }
    } catch (err) {
      console.error(`[handleAnswer] setRemoteDescription 실패 (${peerId}):`, err);
      removePeer(peerId);
    }
  };

  const handleIce = async (peerId, candidate) => {
    console.log(`[handleIce] from: ${peerId}`, candidate);
    const pc = peerConnections.current[peerId];

    if (pc?.remoteDescription) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    } else {
      pendingCandidates.current[peerId] ??= [];
      pendingCandidates.current[peerId].push(candidate);
    }
  };

  useEffect(() => {
    if (!user || !roomId || !isConnected) return;
    const client = stompClientRef.current;
    if (!client) return;

    let userSubscription;
    let roomSubscription;

    const handleSignal = async (msg) => {
      const { type, senderId, senderNickname, targetId, data } = JSON.parse(msg.body);
      if (senderId === user.id) return;
      // 1:1 메시지는 targetId 필터링
      if (["offer", "answer", "ice"].includes(type)) {
        if (targetId !== user.id) return;
      }

      switch (type) {
        case "offer":
          await handleOffer(senderId, senderNickname, data);
          break;
        case "answer":
          await handleAnswer(senderId, data);
          break;
        case "ice":
          await handleIce(senderId, data);
          break;
        case "join":
          if (!peerConnections.current[senderId]) {
            await createPeerConnection(senderId, senderNickname, false); // 내가 initiator
          }
          break;
        case "leave":
          console.log(`[handleSignal] leave: ${senderId}`);
          removePeer(senderId);
          break;
        default:
          break;
      }
    };

    userSubscription = client.subscribe(`/sub/user/${user.id}`, handleSignal);
    roomSubscription = client.subscribe(`/sub/room/${roomId}`, handleSignal);

    fetchExistingUsersAndConnect();
    sendSignal("join", {});

    return () => {
      console.log("[WebRTC Cleanup] 컴포넌트 언마운트 or 의존성 변경");

      if (user && isConnected) {
        console.log("[WebRTC Cleanup] leave 시그널 전송");

        sendSignal("leave", {});
      }
      console.log("[WebRTC Cleanup] stomp 구독 해제");

      userSubscription?.unsubscribe();
      roomSubscription?.unsubscribe();
    };
  }, [user, roomId, stompClientRef, isConnected]);

  useEffect(() => {
    return () => {
      Object.keys(peerConnections.current).forEach((peerId) => {
        removePeer(peerId);
      });
    };
  }, []);

  return { remoteStreams };
};
