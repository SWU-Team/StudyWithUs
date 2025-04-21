import { Link, useLocation } from "react-router-dom";
import {
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaBookOpen,
  FaUserCircle,
} from "react-icons/fa";
import styles from "./Sidebar.module.css";
import logoImage from "../assets/images/StudywithusLogo.png";
import { removeToken } from "../utils/auth";

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? styles.active : "";
  };

  const handleLogout = () => {
    removeToken();
    window.location.href = "/";
  };
  
  const menuLinks = [
    { path: "/rooms",label: "스터디룸", icon: <FaChalkboardTeacher size={28} />},
    { path: "/planer", label: "플래너", icon: <FaCalendarAlt size={28} /> },
    { path: "/diary", label: "다이어리", icon: <FaBookOpen size={28} /> },
    { path: "/mypage", label: "마이페이지", icon: <FaUserCircle size={28} /> },
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
      <div className={styles.authLinks}>
        <button className={styles.authLink} onClick={handleLogout}>
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
