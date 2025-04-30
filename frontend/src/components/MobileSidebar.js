import { Link, useLocation } from "react-router-dom";
import { FaChalkboardTeacher, FaCalendarAlt, FaBookOpen, FaUserCircle } from "react-icons/fa";
import styles from "./MobileSidebar.module.css";
import logoImage from "../assets/images/StudywithusLogo.png";

const MobileSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  if (!isOpen) return null;

  const isActive = (path) => (location.pathname === path ? styles.active : "");

  const menuLinks = [
    { path: "/rooms", label: "스터디룸", icon: <FaChalkboardTeacher size={22} /> },
    { path: "/planer", label: "플래너", icon: <FaCalendarAlt size={22} /> },
    { path: "/diary", label: "다이어리", icon: <FaBookOpen size={22} /> },
    { path: "/mypage", label: "마이페이지", icon: <FaUserCircle size={22} /> },
  ];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.sidebar} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>
        <img src={logoImage} alt="StudyWithUs Logo" className={styles.logo} />
        <ul className={styles.menuList}>
          {menuLinks.map((menu) => (
            <li key={menu.path}>
              <Link
                to={menu.path}
                className={`${styles.menuLink} ${isActive(menu.path)}`}
                onClick={onClose}
              >
                <div className={styles.icon}>{menu.icon}</div>
                <span className={styles.label}>{menu.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MobileSidebar;
