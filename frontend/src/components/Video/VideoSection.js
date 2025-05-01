import styles from "./VideoSection.module.css";
import VideoPlayer from "./VideoPlayer";

const VideoSection = ({ myStream, others, myNickname, room }) => {
  const participantCount = (myStream ? 1 : 0) + others.length;

  let gridClass = styles.grid2x2; // 기본은 2x2
  if (participantCount <= 1) {
    gridClass = styles.grid1x1;
  } else if (participantCount === 2) {
    gridClass = styles.grid1x2;
  } else if (participantCount <= 4) {
    gridClass = styles.grid2x2;
  } else if (participantCount <= 6) {
    gridClass = styles.grid2x3;
  }

  return (
    <div className={styles.section}>
      {room && (
        <div className={styles.roomHeader}>
          <div>
            <h2 className={styles.roomTitle}>방 제목: {room.title}</h2>
            <p className={styles.roomMeta}>인원 제한: {room.maxCapacity}명</p>
          </div>
          <div>
            {/* <div className={styles.timer}>
              <h3>타이머 섹션 = 구현 예정</h3>
            </div> */}
          </div>
        </div>
      )}
      <div className={`${styles.videoGrid} ${gridClass}`}>
        {myStream && <VideoPlayer stream={myStream} nickname={myNickname} muted={true} />}
        {others.map((other) => (
          <VideoPlayer key={other.peerId} stream={other.stream} nickname={other.nickname} />
        ))}
      </div>
      <div className={styles.videoControls}>
        <button className={styles.controlButton}>비디오 끄기</button>
        <button className={styles.controlButtonExit}>방 나가기</button>
      </div>
    </div>
  );
};

export default VideoSection;
