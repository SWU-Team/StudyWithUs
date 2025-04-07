import React, { useState } from "react";
import styles from "./Login.module.css";
import googleLogo from "../../assets/images/googlelogo.png";
import kakaoLogo from "../../assets/images/kakaologo.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Login() {
  const [id, setId] = useState(""); // 아이디 값 저장
  const [password, setPassword] = useState(""); // 비밀번호 값 저장
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부 상태
  const navigate = useNavigate();

  // 일반 로그인 (아이디, 비밀번호 입력 후 확인 버튼)
  const handleLogin = async () => {
    if (!id || !password) {
      alert("아이디와 비밀번호를 입력해주세요");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/auth/login", {
        method: "POST", //데이터를 서버에 전달할때 사용용
        headers: {
          "Content-Type": "application/json", //json형식으로
        },
        body: JSON.stringify({
          //문자열로 바꿔서 서버에 보냄냄
          email: id,
          password: password,
        }),
      });

      const result = await res.json();
      console.log("로그인 응답:", result);

      if (res.ok && result.status === 200) {
        alert("로그인 성공!");
        setIsLoggedIn(true);
        navigate("/StudyRoomList");
      } else {
        alert("로그인 실패: " + result.message);
      }
    } catch (error) {
      console.error("서버 오류:", error);
      alert("서버 오류: " + error.message);
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
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // 입력 값 상태에 저장
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
