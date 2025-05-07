import styles from "./Header.module.css";
import { useState, useEffect } from "react";
import { removeToken } from "../utils/auth";
import { apiGet } from "../utils/api";
import { FiClock, FiMenu } from "react-icons/fi";
import MobileSidebar from "./MobileSidebar";

const Header = () => {
  const [studyTime, setStudyTime] = useState("00시간 00분");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [nickname, setNickname] = useState(localStorage.getItem("nickname") || "");

  useEffect(() => {
    if (!localStorage.getItem("nickname")) {
      apiGet("/users/me").then((res) => {
        localStorage.setItem("nickname", res.nickname);
        setNickname(res.nickname);
      });
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include", // refresh token 쿠키 전송
      });

      // 서버 로그아웃 성공 후 클라이언트 정리
      removeToken(); // access token 제거
      localStorage.removeItem("nickname"); // 닉네임 제거
      window.location.href = "/";
    } catch (error) {
      console.error("로그아웃 실패", error);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
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
