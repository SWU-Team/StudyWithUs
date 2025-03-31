import React, { useState } from "react";
import styles from "../Styles/Login.module.css";
import googleLogo from "../assets/googlelogo.png";
import kakaoLogo from "../assets/kakaologo.png";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google"; // Google OAuth Login 컴포넌트 import
import { jwtDecode } from "jwt-decode"; // JWT 토큰 디코딩용 라이브러리 import

function Login() {
  const [id, setId] = useState(""); // 아이디 값 저장
  const [password, setPassword] = useState(""); // 비밀번호 값 저장
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부 상태
  const navigate = useNavigate();

  // 일반 로그인 (아이디, 비밀번호 입력 후 확인 버튼)
  const handleLogin = () => {
    if (id && password) {
      // 아이디와 비밀번호가 입력되었을 경우
      alert("로그인 성공!");
      navigate("/StudyRoomList"); // StudyRoomList 페이지로 이동
    } else {
      alert("아이디와 비밀번호를 입력해주세요");
    }
  };

  return (
    <div className={styles.div}>
      <div>
        <h1 className={styles.LoginText}>Login</h1>
      </div>
      <div className={styles.Loginbox}>
        <input
          className={styles.IDbox}
          placeholder="email"
          value={id}
          onChange={(e) => setId(e.target.value)} // 입력 값 상태에 저장
        />
        <input
          className={styles.IDbox}
          placeholder="passward"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // 입력 값 상태에 저장
        />
      </div>
      <button className={styles.ok} onClick={handleLogin}>
        Login now
      </button>
      <div className={styles.divider}></div>
      <h2>Login with Others</h2>
      <div className={styles.Loginbox}>
        {/* 구글 로그인 */}
        <div className={`${styles.social} ${styles.google}`}>
          <img src={googleLogo} alt="google" />
          <h4>구글로 로그인</h4>
        </div>

        {/* 카카오 로그인 */}
        <div className={`${styles.social} ${styles.kakao}`}>
          <img src={kakaoLogo} alt="kakao" />
          <h4>카카오톡으로 로그인</h4>
        </div>
      </div>
    </div>
  );
}

export default Login;
