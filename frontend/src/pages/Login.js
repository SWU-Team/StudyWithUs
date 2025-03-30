import React, { useState } from "react";
import styles from "../Styles/Login.module.css";

function Login() {
  return (
    <div className={styles.div}>
      <h1>hello</h1>
      <input className={styles.IDinput} placeholder="아이디"></input>
    </div>
  );
}

export default Login;
