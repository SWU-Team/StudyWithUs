import React, { useState } from "react"; // React와 useState 훅 import
import styles from "../Styles/Login.module.css"; // CSS 모듈 import
import logoImage from "../assets/Study with us Logo.png"; // 로고 이미지 import
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 useNavigate import
import { GoogleLogin } from "@react-oauth/google"; // Google OAuth Login 컴포넌트 import
import { jwtDecode } from "jwt-decode"; // JWT 토큰 디코딩용 라이브러리 import

function Login() {
  // 상태 변수 선언
  const [id, setId] = useState(""); // 아이디 값 저장
  const [password, setPassword] = useState(""); // 비밀번호 값 저장
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부 상태
  const navigate = useNavigate(); // 라우팅(페이지 이동) 훅

  // 일반 로그인 (아이디, 비밀번호 입력 후 확인 버튼)
  const handleLogin = () => {
    if (id && password) {
      // 아이디와 비밀번호가 입력되었을 경우
      alert("로그인 성공!");
      navigate("/StudyRoomList"); // StudyRoomList 페이지로 이동
    } else {
      alert("아이디와 비밀번호를 입력해주세요"); // 미입력시 경고
    }
  };

  // 로그인 완료 후 보여줄 화면 (현재는 사용되지 않음)
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
          onChange={(e) => setId(e.target.value)} // 입력 값 상태에 저장
        />
        <input
          className={styles.PSbox}
          placeholder="비밀번호"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // 입력 값 상태에 저장
        />
        <div>
          <button className={styles.ok} onClick={handleLogin}>
            확인
          </button>
        </div>
        <div>
          <h2>Login with Others</h2>
        </div>
        <div>
          {/* 구글 로그인 */}
          <span>
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                const decoded = jwtDecode(credentialResponse?.credential); // JWT 디코딩 credentialResponse 안에 credential가 있는지 확인하고 가져옴
                console.log(decoded); // 디코딩된 사용자 정보 확인
              }}
              onError={() => {
                console.log("Login Failed"); // 로그인 실패 로그
              }}
            />
          </span>
          <div className={styles.OAuth}>
            <h4>카카오톡로그인</h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login; // Login 컴포넌트 export
