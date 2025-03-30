import React, { useState } from "react";
import styles from "../Styles/Login.module.css";
import logoImage from "../assets/Study with us Logo.png";

function Login() {
  return (
    <div className={styles.div}>
      <div className={styles.left}>
        <h1>"Small habits create big changes. Let’s grow together!"</h1>
        <img
          src={logoImage}
          alt="Study with us Logo"
          className={styles.image}
        />
      </div>
      <div className={styles.right}>
        <h1 className={styles.LoginText}>Login</h1>
        <input className={styles.IDbox} placeholder="아이디"></input>
        <input className={styles.PSbox} placeholder="비밀번호"></input>
        <div>
          <button className={styles.ok}>확인</button>
        </div>
        <div>
          <h2>Login with Others</h2>
        </div>
      </div>
    </div>
  );
}

export default Login;
