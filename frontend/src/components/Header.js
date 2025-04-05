import styles from "./Header.module.css";
import { useState, useEffect } from "react";

const Header = () => {
  // 공부 시간을 표시할 상태 (실제 기능 없이 UI만 표시)
  const [studyTime, setStudyTime] = useState("3시간 45분");
  const [currentTime, setCurrentTime] = useState(new Date());

  // 현재 시간 업데이트 (UI 목적으로만 사용)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 1분마다 업데이트

    return () => clearInterval(timer);
  }, []);

  // 시간 표시 포맷
  const formattedTime = currentTime.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <header className={styles.header}>
      <div className={styles.clockSection}>
        <div className={styles.clockIcon}>🕓</div>
        <div className={styles.timeInfo}>
          <div className={styles.currentTime}>{formattedTime}</div>
          <div className={styles.studyTime}>오늘 공부시간: {studyTime}</div>
        </div>
      </div>
    </header>
  );
};

export default Header;
