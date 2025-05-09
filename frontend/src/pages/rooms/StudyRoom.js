import React, { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useCurrentUser from "../../hooks/useCurrentUser";
import { useWebRTC } from "../../hooks/useWebRTC";
import { useChat } from "../../hooks/useChat";
import { apiGet, apiPost, extractErrorInfo } from "../../utils/api";
import { useStompClient } from "../../hooks/useStompClient";

import styles from "./StudyRoom.module.css";
import ChatSection from "../../components/Chat/ChatSection";
import VideoSection from "../../components/Video/VideoSection";
import { toast } from "react-toastify";

const StudyRoom = () => {
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  const { roomId } = useParams();
  const hasExitedRef = useRef(false);

  const [room, setRoom] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const isReadyForWebRTC = !!user && !!localStream;

  const { stompClientRef, isConnected } = useStompClient();

  useEffect(() => {
    if (!roomId || !isConnected) return;

    apiGet(`/rooms/${roomId}`)
      .then(setRoom)
      .catch((err) => {
        console.error("방 정보 조회 실패", err);
        toast.error("방 정보 조회 실패");
        navigate("/rooms");
      });

    return () => {
      if (!roomId || !isConnected) return;
      handleExitRoom();
    };
  }, [roomId, isConnected]);

  useEffect(() => {
    const initStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        setLocalStream(stream);
      } catch (err) {
        console.error("로컬 스트림 획득 실패", err);
      }
    };

    initStream();
  }, []);

  const handleExitRoom = async () => {
    if (hasExitedRef.current) return;
    hasExitedRef.current = true;

    try {
      await apiPost(`/rooms/${roomId}/exit`);
      navigate("/rooms");
    } catch (err) {
      const { status, data } = extractErrorInfo(err);
      if (status === 409) {
        console.warn("이미 퇴장된 사용자여서 무시.", data);
        navigate("/rooms");
      } else {
        toast.error("퇴장 중 오류가 발생했습니다.");
      }
    }
  };

  const toggleVideo = () => {
    if (!localStream) return;
    const videoTrack = localStream.getVideoTracks()[0];
    videoTrack.enabled = !videoTrack.enabled;
    setIsVideoOn(videoTrack.enabled);
  };

  const { remoteStreams } = useWebRTC(
    roomId,
    isReadyForWebRTC ? user : null,
    isReadyForWebRTC ? localStream : null,
    stompClientRef,
    isConnected
  );

  const { chatMessages, chatInputRef, handleSendChat } = useChat(
    roomId,
    user,
    stompClientRef,
    isConnected
  );

  return (
    <div className={styles.roomLayout}>
      <VideoSection
        myStream={localStream}
        others={remoteStreams}
        user={user}
        room={room}
        isVideoOn={isVideoOn}
        toggleVideo={toggleVideo}
        handleExitRoom={handleExitRoom}
      />
      <ChatSection
        chatMessages={chatMessages}
        chatInput={chatInputRef}
        handleSendChat={handleSendChat}
        user={user}
      />
    </div>
  );
};

export default StudyRoom;
