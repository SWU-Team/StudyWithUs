import { useEffect, useRef } from "react";
import styles from "./Chat.module.css";

const ChatMessages = ({ chatMessages }) => {
  const scrollRef = useRef();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  return (
    <div className={styles.chatMessages}>
      {chatMessages.map((msg, idx) => (
        <div key={idx}>
          <strong>{msg.senderNickname}</strong>: {msg.message}
        </div>
      ))}
      <div ref={scrollRef} />
    </div>
  );
};

export default ChatMessages;
