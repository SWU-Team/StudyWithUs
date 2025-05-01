import styles from "./Chat.module.css";

const ChatInput = ({ chatInput, handleSendChat }) => {
  return (
    <div className={styles.chatInput}>
      <input
        type="text"
        placeholder="메시지 입력..."
        ref={chatInput}
        onKeyUp={(e) => e.key === "Enter" && handleSendChat()}
      />
      <button onClick={handleSendChat}>전송</button>
    </div>
  );
};

export default ChatInput;
