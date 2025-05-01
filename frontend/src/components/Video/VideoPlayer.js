import styles from "./VideoSection.module.css";

const VideoPlayer = ({ stream, nickname, muted = false }) => {
  return (
    <div className={styles.videoContainer}>
      <video
        className={styles.video}
        ref={(video) => {
          if (video) {
            video.srcObject = stream;
            video.play().catch(() => {});
          }
        }}
        muted={muted}
        autoPlay
        playsInline
      />
      <div className={styles.nickname}>{nickname}</div>
    </div>
  );
};

export default VideoPlayer;
