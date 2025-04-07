import { Link, useLocation } from "react-router-dom";
import {
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaBookOpen,
  FaUserCircle,
} from "react-icons/fa";
import styles from "./Sidebar.module.css";
import logoImage from "../assets/images/StudywithusLogo.png";

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? styles.active : "";
  };

  const menuLinks = [
    {
      path: "/StudyRoomList",
      label: "스터디룸",
      icon: <FaChalkboardTeacher size={28} />,
    },
    { path: "/Planer", label: "플래너", icon: <FaCalendarAlt size={28} /> },
    { path: "/Diary", label: "다이어리", icon: <FaBookOpen size={28} /> },
    { path: "/Mypage", label: "마이페이지", icon: <FaUserCircle size={28} /> },
  ];

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <img
          src={logoImage}
          alt="Study Planner Logo"
          className={styles.logoImg}
        />
      </div>

      <nav className={styles.navigation}>
        <ul className={styles.navList}>
          {menuLinks.map((menu) => (
            <li key={menu.path}>
              <Link
                to={menu.path}
                className={`${styles.navLink} ${isActive(menu.path)}`}
              >
                <div className={styles.iconBox}>{menu.icon}</div>
                <span className={styles.linkLabel}>{menu.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
