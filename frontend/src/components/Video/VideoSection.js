import React, { useEffect, useState } from "react";
import styles from "./VideoSection.module.css";
import { apiGet } from "../../utils/api";
import VideoPlayer from "./VideoPlayer";
import VideoControls from "./VideoControls";
import TimerBox from "./TimerBox";
import FaceDetector from "./FaceDetector";

const VideoSection = ({
  myStream,
  others,
  user,
  room,
  isVideoOn,
  toggleVideo,
  handleExitRoom,
  sendChat,
}) => {
  const participantCount = (myStream ? 1 : 0) + others.length;
  const [roomMembers, setRoomMembers] = useState([]);
  const [hostId, setHostId] = useState(null);

  useEffect(() => {
    const fetchRoomMembers = async () => {
      try {
        const data = await apiGet(`/rooms/${room.id}/members`);
        setRoomMembers(data);

        const host = data.find((m) => m.isHost);
        if (host) setHostId(host.userId);
      } catch (error) {
        console.error("방 멤버 조회 실패", error);
      }
    };

    if (room?.id) {
      fetchRoomMembers();
    }
  }, [room?.id]);

  return (
    <div className={styles.section}>
      {room && (
        <div className={styles.roomHeader}>
          <div className={styles.roomInfoLeft}>
            <div className={styles.roomTitle}>📚 {room.title}</div>
            <div className={styles.roomDetails}>
              🧑‍🤝‍🧑 {room.maxCapacity}명 정원 &nbsp;&nbsp;|&nbsp;&nbsp; 🟢 현재 {participantCount}명
              참여 중
            </div>
          </div>
          <div className={styles.roomInfoRight}>
            <TimerBox
              createdAt={room.createdAt}
              focusMinute={room.focusMinute}
              breakMinute={room.breakMinute}
            />
          </div>
        </div>
      )}

      <div className={styles.videoAreaWrapper}>
        <div className={styles.myVideoWrapper}>
          {myStream && (
            <div className={styles.myVideoItem}>
              <VideoPlayer
                stream={myStream}
                nickname={user?.nickname}
                muted={true}
                isHost={user?.id === hostId}
              />
              <FaceDetector
                stream={myStream}
                onKick={handleExitRoom}
                notifyKicked={() =>
                  sendChat({
                    type: "KICK",
                    roomId: Number(room.id),
                    senderId: user.id,
                    senderNickname: "BOT",
                    message: `${user.nickname}님이 비인식으로 퇴장당했습니다.`,
                  })
                }
              />
            </div>
          )}
        </div>
        <div className={styles.otherVideosWrapper}>
          {others.map((other) => (
            <div key={other.peerId} className={styles.otherVideoItem}>
              <VideoPlayer
                stream={other.stream}
                nickname={other.nickname}
                isHost={other?.peerId === hostId}
              />
            </div>
          ))}
        </div>
      </div>
      <VideoControls isVideoOn={isVideoOn} toggleVideo={toggleVideo} handleExit={handleExitRoom} />
    </div>
  );
};

export default React.memo(VideoSection);
