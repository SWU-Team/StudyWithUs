import { useEffect, useRef } from "react";
import styles from "./Chat.module.css";

const ChatMessages = ({ chatMessages, user }) => {
  const scrollRef = useRef();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  return (
    <div className={styles.chatMessages}>
      {chatMessages.map((msg, idx) => {
        const isMe = msg.senderId === user?.id;

        return (
          <div
            key={idx}
            className={`${styles.chatMessageWrapper} ${
              isMe ? styles.myMessage : styles.otherMessage
            }`}
          >
            {!isMe && <div className={styles.nickname}>{msg.senderNickname}</div>}
            <div className={styles.chatBubble}>{msg.message}</div>
          </div>
        );
      })}
      <div ref={scrollRef} />
    </div>
  );
};

export default ChatMessages;
