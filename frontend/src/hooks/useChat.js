import { useEffect, useRef, useState } from "react";

/**
 * 채팅 웹소켓 연결 및 메시지 송수신을 담당하는 커스텀 훅
 */
export const useChat = (roomId, user, stompClientRef, isConnected ) => {
  const [chatMessages, setChatMessages] = useState([]); 
  const chatInputRef = useRef();

  const sendChat = (msg) => {
    if (stompClientRef.current?.connected) {
      stompClientRef.current.publish({
        destination: "/pub/chat/message",
        body: JSON.stringify(msg),
      });
    } else {
      console.warn("채팅 전송 실패: STOMP 연결 안됨");
    }
  };

  const handleSendChat = () => {
    const message = chatInputRef.current?.value.trim();
    if (!message || !user) return;

    if (message.length > 200) {
      alert("메시지는 200자 이내로 입력해주세요.");
      chatInputRef.current.value = "";
      return;
    }

    console.log("💬 채팅 전송:", message);
    sendChat({
      type: "TALK",
      roomId: Number(roomId),
      senderId: user.id,
      senderNickname: user.nickname,
      message,
    });

    chatInputRef.current.value = "";
  };

  useEffect(() => {
    const client = stompClientRef.current;
    if (!client || !isConnected || !user) return;

    const subscription = client.subscribe(`/sub/chat/room/${roomId}`, (msg) => {
      const payload = JSON.parse(msg.body);
      console.log("💬 채팅 수신:", payload);
      setChatMessages((prev) => [...prev, payload]);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [stompClientRef, user, roomId, isConnected]);

  useEffect(() => {
    if (!isConnected || !user) return;
  
    // 입장 메시지
    sendChat({
      type: "ENTER",
      roomId: Number(roomId),
      senderId: user.id,
      senderNickname: user.nickname,
      message: `${user.nickname}님이 입장하셨습니다.`,
    });
  
    // 클린업 시 퇴장 메시지 전송
    return () => {
      sendChat({
        type: "EXIT",
        roomId: Number(roomId),
        senderId: user.id,
        senderNickname: user.nickname,
        message: `${user.nickname}님이 퇴장하셨습니다.`,
      });
    };
  }, [isConnected, user]);
  

  return { chatMessages, chatInputRef, handleSendChat };
};
