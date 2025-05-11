import React from "react";
import styles from "./PopupBox.module.css";

const PopupBox = ({ title, onClose, children }) => {
  return (
    <div className={styles.popup}>
      <button className={styles.closeButton} onClick={onClose}>
        &times;
      </button>
      <div className={styles.popupHeader}>{title}</div>
      <div className={styles.popupContent}>{children}</div>
    </div>
  );
};

export default PopupBox;
