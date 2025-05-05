import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import styles from "./Chat.module.css";

const ChatSection = ({ chatMessages, chatInput, handleSendChat, user }) => {
  return (
    <div className={styles.chatSection}>
      <div className={styles.chatHeader}>Chats</div>
      <ChatMessages chatMessages={chatMessages} user={user} />
      <ChatInput chatInput={chatInput} handleSendChat={handleSendChat} />
    </div>
  );
};

export default ChatSection;
