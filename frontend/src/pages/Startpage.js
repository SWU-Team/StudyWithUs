import React, { useState } from "react";
import { Link } from "react-router-dom";
import logoImage from "../assets/Study with us Logo.png";
import styles from "../Styles/Startpage.module.css";

function Startpage() {
  return (
    <div>
      <img src={logoImage} alt="Study with us Logo" className={styles.image} />
      <Link to="/Login">로그인</Link>
    </div>
  );
}

export default Startpage;
