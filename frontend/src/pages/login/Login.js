import React, { useState } from "react";
import styles from "./Login.module.css";
import googleLogo from "../../assets/images/googlelogo.png";
import kakaoLogo from "../../assets/images/kakaologo.png";
import { Link, useNavigate } from "react-router-dom";
import { setToken, extractTokenFromHeader } from "../../utils/auth";
import axios from "axios";

function Login() {
  const [id, setId] = useState(""); // 아이디 값 저장
  const [password, setPassword] = useState(""); // 비밀번호 값 저장
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!id || !password) {
      alert("아이디와 비밀번호를 입력해주세요");
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/auth/login`,
        {
          email: id,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.code === 0) {
        const token = extractTokenFromHeader(res);
        if (token) {
          setToken(token);
          navigate("/rooms");
        } else {
          alert("로그인 처리 중 문제가 발생했습니다. 다시 시도해주세요.");
        }
      } else {
        alert("로그인 실패: " + res.data.message);
      }
    } catch (error) {
      console.error("서버 오류:", error);
      alert("이메일 또는 비밀번호가 올바르지 않습니다.");
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
          onChange={(e) => setId(e.target.value)}
        />
        <input
          className={styles.IDbox}
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button className={styles.ok} onClick={handleLogin}>
        Login now
      </button>
      <div className={styles.search}>
        <Link to="/Signup" className={styles.Signup}>
          회원가입
        </Link>
        <div className={styles.rightLinks}>
          <Link to="/SearchID" className={styles.IDfind}>
            아이디 찾기
          </Link>
          <Link to="/SearchPW" className={styles.IDfind}>
            비밀번호 찾기
          </Link>
        </div>
      </div>
      <div className={styles.divider}></div>
      <h2>Login with Others</h2>
      <div className={styles.Loginbox}>
        {/* 구글 로그인 */}
        <div
          className={`${styles.social} ${styles.google}`}
          onClick={() => alert("구글 로그인 기능은 준비 중입니다.")}
        >
          <img src={googleLogo} alt="google" />
          <h4>구글로 로그인</h4>
        </div>

        {/* 카카오 로그인 */}
        <div
          className={`${styles.social} ${styles.kakao}`}
          onClick={() => alert("카카오톡 로그인 기능은 준비 중입니다.")}
        >
          <img src={kakaoLogo} alt="kakao" />
          <h4>카카오톡으로 로그인</h4>
        </div>
      </div>
    </div>
  );
}

export default Login;
