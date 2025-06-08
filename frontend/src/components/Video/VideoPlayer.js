import React from "react";
import styles from "./VideoSection.module.css";
import userImg from "../../assets/images/user.png";

const VideoPlayer = ({ stream, nickname, muted = false, isHost = false }) => {
  const isVideoTrackOn = stream.getVideoTracks()[0]?.enabled ?? true;

  return (
    <div className={styles.videoContainer}>
      {isHost && <span className={styles.hostBadge}>👑</span>}
      {isVideoTrackOn ? (
        <video
          className={styles.video}
          ref={(videoEl) => {
            if (videoEl && stream) {
              videoEl.srcObject = stream;
              videoEl.play().catch(() => {});
            }
          }}
          muted={muted}
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

export default VideoPlayer;
