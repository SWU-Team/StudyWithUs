import { Link, useLocation } from "react-router-dom";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  const location = useLocation();

  // 현재 페이지에 따라 액티브 클래스 부여
  const isActive = (path: string) => {
    return location === path ? styles.active : "";
  };
  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <Link href="/">
          <a className={styles.logoLink}>Study Planner</a>
        </Link>
      </div>

      <nav className={styles.navigation}>
        <ul className={styles.navList}>
          <li>
            <Link href="/StudyRoomList">
              <a className={`${styles.navLink} ${isActive("/StudyRoomList")}`}>
                스터디룸
              </a>
            </Link>
          </li>
          <li>
            <Link href="/Planer">
              <a className={`${styles.navLink} ${isActive("/Planer")}`}>
                플래너
              </a>
            </Link>
          </li>
          <li>
            <Link href="/Diary">
              <a className={`${styles.navLink} ${isActive("/Diary")}`}>
                다이어리
              </a>
            </Link>
          </li>
          <li>
            <Link href="/Mypage">
              <a className={`${styles.navLink} ${isActive("/Mypage")}`}>
                마이페이지
              </a>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
