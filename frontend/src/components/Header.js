import styles from "./Header.module.css";
import { useState, useEffect } from "react";
import { getNicknameFromToken, removeToken } from "../utils/auth";
import { FiClock, FiMenu } from "react-icons/fi";
import MobileSidebar from "./MobileSidebar";

const Header = () => {
  const [studyTime, setStudyTime] = useState("00시간 00분");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const nickname = getNicknameFromToken();

  const handleLogout = () => {
    removeToken();
    window.location.href = "/";
  };

  // 현재 시간
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // 시간 표시 포맷
  const formattedTime = currentTime.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <>
      <header className={styles.header}>
        <div className={styles.leftSection}>
          <button className={styles.menuButton} onClick={() => setIsSidebarOpen(true)}>
            <FiMenu size={28} />
          </button>
          <FiClock style={{ fontSize: "2.2rem" }} />
          <div className={styles.timeInfo}>
            <div className={styles.currentTime}>{formattedTime}</div>
            <div className={styles.studyTime}>오늘 공부시간: {studyTime}</div>
          </div>
        </div>
        <div className={styles.rightSection}>
          {nickname ? (
            <>
              <span className={styles.userName}>{nickname}님</span>
              <span className={styles.logout} onClick={handleLogout}>
                로그아웃
              </span>
            </>
          ) : (
            <span className={styles.guestMessage}>로그인이 필요합니다</span>
          )}
        </div>
      </header>
      <MobileSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
};

export default Header;
