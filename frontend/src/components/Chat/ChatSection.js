import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import styles from "./Chat.module.css";

const ChatSection = ({ chatMessages, chatInput, handleSendChat }) => {
  return (
    <div className={styles.chatSection}>
      <div className={styles.chatHeader}>채팅</div>
      <ChatMessages chatMessages={chatMessages} />
      <ChatInput chatInput={chatInput} handleSendChat={handleSendChat} />
    </div>
  );
};

export default ChatSection;
