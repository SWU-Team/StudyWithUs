// hooks/useStompClient.js
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getAuthHeader } from "../utils/auth";
import { useEffect, useRef, useState } from "react";

/**
 * 전역 STOMP 클라이언트를 생성하고 재사용하는 훅
 * - 하나의 웹소켓 클라이언트를 앱 전체에서 공유
 * - 최초 1회만 소켓 연결을 생성하고, 이후에는 재사용
 * - 연결 상태도 반환 (isConnected)
 */

let sharedClient = null; // 전역 공유 클라리언트

export const useStompClient = () => {
  const clientRef = useRef(null); // 이 훅의 반환값으로 사용할 참조
  const [isConnected, setIsConnected] = useState(false); // 연결 상태

  // 최초 한 번만 클라이언트 생성
  if (!sharedClient) {
    const socket = new SockJS(`${process.env.REACT_APP_WS_BASE_URL}/ws`);
    const client = new Client({
      webSocketFactory: () => socket, 
      connectHeaders: {
        Authorization: getAuthHeader(),
      },
      reconnectDelay: 3000, // 연결 끊겼을 때 재시도 간격(ms)
      onConnect: () => {
        console.log("STOMP 클라이언트 연결됨");
        setIsConnected(true);
      },
      onDisconnect: () => {
        console.log("STOMP 클라이언트 연결 끊김");
        setIsConnected(false);
      },
      onStompError: (frame) => {
        console.error("STOMP 에러", frame.headers.message);
        setIsConnected(false);
      },
    });

    sharedClient = client;
    client.activate(); // 연결 시작
  }

  useEffect(() => {
    clientRef.current = sharedClient; // 현재 훅에 클라이언트 주입

    return () => {
      sharedClient.deactivate(); // 연결 종료
      sharedClient = null; // 전역 클라 제거
      console.log("STOMP 연결 종료됨");   
     };
  }, []);

  return { stompClientRef: clientRef, isConnected }; // 클라이언트와 연결 상태 반환
};
