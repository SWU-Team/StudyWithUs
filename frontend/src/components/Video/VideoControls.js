import { FaVideo, FaVideoSlash, FaSignOutAlt } from "react-icons/fa";
import styles from "./VideoSection.module.css";

const VideoControls = ({ isVideoOn, toggleVideo, handleExit }) => {
  return (
    <div className={styles.videoControls}>
      <button className={styles.iconButton} title="비디오 토글" onClick={toggleVideo}>
        {isVideoOn ? <FaVideo /> : <FaVideoSlash />}
      </button>
      <button className={styles.iconButtonExit} title="방 나가기" onClick={handleExit}>
        <FaSignOutAlt />
      </button>
    </div>
  );
};

export default VideoControls;
