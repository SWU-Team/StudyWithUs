import React from "react";
import styles from "./VideoSection.module.css";
import userImg from "../../assets/images/user.png";

const VideoPlayer = ({ stream, nickname, muted = false, isHost = false, isVideoOn }) => {
  return (
    <div className={styles.videoContainer}>
      {isHost && <span className={styles.hostBadge}>👑</span>}
      {isVideoOn ? (
        <video
          className={styles.video}
          ref={(videoEl) => {
            if (videoEl && stream) {
              videoEl.srcObject = stream;
              videoEl.play().catch(() => {});
            }
          }}
          muted
          autoPlay
        />
      ) : (
        <div className={styles.videoPlaceholder}>
          <img src={userImg} alt="비디오 꺼짐" />
        </div>
      )}
      <div className={styles.nickname}>{nickname}</div>
    </div>
  );
};

export default React.memo(VideoPlayer);
