import { Link, useLocation } from "react-router-dom";
import { FaChalkboardTeacher, FaCalendarAlt, FaBookOpen, FaUserCircle } from "react-icons/fa";
import styles from "./Sidebar.module.css";
import logoImage from "../assets/images/StudywithusLogo.png";

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? styles.active : "";
  };

  const menuLinks = [
    { path: "/rooms", label: "스터디룸", icon: <FaChalkboardTeacher size={28} /> },
    { path: "/planer", label: "플래너", icon: <FaCalendarAlt size={28} /> },
    { path: "/diaries", label: "다이어리", icon: <FaBookOpen size={28} /> },
    { path: "/mypage", label: "마이페이지", icon: <FaUserCircle size={28} /> },
  ];

  return (
    <div className={styles.sidebar}>
      <img src={logoImage} alt="Study_With_Us_Logo" className={styles.logo} />

      <nav>
        <ul className={styles.menuList}>
          {menuLinks.map((menu) => (
            <li key={menu.path}>
              <Link to={menu.path} className={`${styles.menuLink} ${isActive(menu.path)}`}>
                <div className={styles.icon}>{menu.icon}</div>
                <span className={styles.label}>{menu.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
