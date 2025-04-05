import { Link, useLocation } from "react-router-dom";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? styles.active : "";
  }; //주소가 같으면 스타일을 active로로

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <Link to="/" className={styles.logoLink}>
          Study Planner
        </Link>
      </div>

      <nav className={styles.navigation}>
        <ul className={styles.navList}>
          <li>
            <Link
              to="/StudyRoomList"
              className={`${styles.navLink} ${isActive("/StudyRoomList")}`}
            >
              스터디룸
            </Link>
          </li>
          <li>
            <Link
              to="/Planer"
              className={`${styles.navLink} ${isActive("/Planer")}`}
            >
              플래너
            </Link>
          </li>
          <li>
            <Link
              to="/Diary"
              className={`${styles.navLink} ${isActive("/Diary")}`}
            >
              다이어리
            </Link>
          </li>
          <li>
            <Link
              to="/Mypage"
              className={`${styles.navLink} ${isActive("/Mypage")}`}
            >
              마이페이지
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
