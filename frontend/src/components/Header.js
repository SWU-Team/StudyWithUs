import styles from "./Header.module.css";
import { useState, useEffect } from "react";
import { getAuthHeader } from "../utils/auth";

const Header = () => {
  // 공부 시간을 표시할 상태 (실제 기능 없이 UI만 표시)
  const [studyTime, setStudyTime] = useState("3시간 45분");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userName, setUserName] = useState("");

  // 현재 시간 업데이트 (UI 목적으로만 사용)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 1분마다 업데이트

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/me`, {
          headers: {
            Authorization: getAuthHeader(),
          },
        });
        if (!res.ok) throw new Error("유저 정보 조회 실패");

        const data = await res.json();
        setUserName(data.data.nickname); // nickname만 추출
      } catch (err) {
        console.error(err);
        setUserName("유저");
      }
    };

    fetchUserInfo();
  }, []);
  // 시간 표시 포맷
  const formattedTime = currentTime.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <div className={styles.clockSection}>
          <div className={styles.clockIcon}>🕓</div>
          <div className={styles.timeInfo}>
            <div className={styles.currentTime}>{formattedTime}</div>
            <div className={styles.studyTime}>오늘 공부시간: {studyTime}</div>
          </div>
        </div>
      </div>
      <div className={styles.rightSection}>
        <div className={styles.greeting}>
          <span className={styles.userName}>{userName}</span>님
        </div>
      </div>
    </header>
  );
};

export default Header;
