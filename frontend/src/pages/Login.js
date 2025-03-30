import React, { useState } from "react";
import styles from "../Styles/Login.module.css";
import logoImage from "../assets/Study with us Logo.png";
import { useNavigate } from "react-router-dom";

function Login() {
  const [id, setId] = useState(""); // ID 상태
  const [password, setPassword] = useState(""); // PW 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부
  const navigate = useNavigate();

  const handleLogin = () => {
    if (id && password) {
      alert("로그인 성공!");
      navigate("/StudyRoomList"); // 로그인 성공 시 StudyRoomList로 이동
    } else {
      alert("아이디와 비밀번호를 입력해주세요");
    }
  };

  if (isLoggedIn) {
    return (
      <div className={styles.div}>
        <h1>어서오세요, {id}님!</h1>
      </div>
    );
  }
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
        <input
          className={styles.IDbox}
          placeholder="아이디"
          value={id}
          onChange={(e) => setId(e.target.value)}
        ></input>
        <input
          className={styles.PSbox}
          placeholder="비밀번호"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <div>
          <button className={styles.ok} onClick={handleLogin}>
            확인
          </button>
        </div>
        <div>
          <h2>Login with Others</h2>
        </div>
        <div>
          <div className={styles.OAuth}>
            <h4>구글 로그인</h4>
          </div>
          <div className={styles.OAuth}>
            <h4>카카오톡로그인</h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
