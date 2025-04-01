import React, { useState } from "react";
import logoImage from "../../assets/images/StudywithusLogo.png";
import styles from "./Startpage.module.css";
import { useNavigate } from "react-router-dom";

function Startpage() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/Login");
  };
  return (
    <div className={styles.div}>
      <img src={logoImage} alt="StudywithusLogo" className={styles.image} />
      <button onClick={handleClick} className={styles.btn}>
        study now
      </button>
    </div>
  );
}

export default Startpage;
