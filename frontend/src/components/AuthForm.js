import React, { useState } from "react";
import styles from "./AuthForm.module.css";
import { setToken, extractTokenFromHeader } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import logoImage from "../assets/images/StudywithusLogo.png";
import kakaoLogo from "../assets/images/kakaologo.png";
import googleLogo from "../assets/images/googlelogo.png";
import Modal from "../components/Modal";
import { validateEmail, validatePassword } from "../utils/validation";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

const AuthForm = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // "login" or "signup"

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    email: "",
    password: "",
    nickname: "",
    profileImgFile: null,
  });

  const [isFindPasswordOpen, setIsFindPasswordOpen] = useState(false);
  const [findEmail, setFindEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSocialLogin = (platform) => {
    toast.info(`${platform} 로그인은 준비 중입니다.`);
  };

  const handleProfileImgChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > MAX_FILE_SIZE) {
      toast.error("파일 크기가 1MB를 초과했습니다.");
      return;
    }
    setSignupForm({ ...signupForm, profileImgFile: file });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && mode === "login") {
      handleSubmit();
    }
  };

  const handleLogin = async () => {
    const { email, password } = loginForm;

    if (!email || !password) {
      toast.error("아이디와 비밀번호를 입력해주세요.");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/auth/login`,
        { email, password },
        { headers: { "Content-Type": "application/json" }, withCredentials: true } // refresh token 쿠키 전송
      );

      const token = extractTokenFromHeader(res);
      if (token) {
        setToken(token);
        localStorage.setItem("nickname", res.data.data.nickname);
        navigate("/rooms");
      } else {
        toast.error("로그인 처리 중 문제가 발생했습니다.");
      }
    } catch (error) {
      toast.error("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  const handleSignup = async () => {
    const { email, password, nickname, profileImgFile } = signupForm;

    if (!email || !password || !nickname) {
      toast.error("모든 필드를 입력해주세요.");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("올바른 이메일 형식을 입력해주세요.");
      return;
    }
    if (!validatePassword(password)) {
      toast.error("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }
    if (profileImgFile && profileImgFile.size > MAX_FILE_SIZE) {
      toast.error("프로필 이미지 크기는 1MB를 초과할 수 없습니다.");
      return;
    }

    try {
      const formData = new FormData();
      const userJson = JSON.stringify({ email, password, nickname });
      const userBlob = new Blob([userJson], { type: "application/json" });

      formData.append("user", userBlob);
      if (profileImgFile) {
        formData.append("profileImage", profileImgFile);
      }

      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/signup`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("회원가입 성공! 로그인 해주세요.");
      setMode("login");
      setLoginForm({ email: "", password: "" });
      setSignupForm({ email: "", password: "", nickname: "", profileImgFile: null });
    } catch (error) {
      toast.error("회원가입 중 오류가 발생했습니다.");
    }
  };

  const handleSubmit = () => {
    if (mode === "login") {
      handleLogin();
    } else {
      handleSignup();
    }
  };

  const renderInputs = () => (
    <div className={styles.inputContainer}>
      {mode === "login" ? (
        <>
          <input
            type="text"
            placeholder="이메일"
            value={loginForm.email}
            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
            onKeyDown={handleKeyDown}
            className={styles.input}
          />
          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              onKeyDown={handleKeyDown}
              className={styles.input}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={styles.togglePasswordButton}
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="이메일"
            value={signupForm.email}
            onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
            className={styles.input}
          />
          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호"
              value={signupForm.password}
              onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
              className={styles.input}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={styles.togglePasswordButton}
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>
          <input
            type="text"
            placeholder="닉네임"
            value={signupForm.nickname}
            onChange={(e) => setSignupForm({ ...signupForm, nickname: e.target.value })}
            className={styles.input}
          />
          <label htmlFor="profileImg" className={styles.fileLabel}>
            {signupForm.profileImgFile ? signupForm.profileImgFile.name : "프로필 이미지 선택"}
          </label>
          <input
            id="profileImg"
            type="file"
            accept="image/*"
            onChange={handleProfileImgChange}
            className={styles.fileInput}
          />
        </>
      )}
    </div>
  );

  const renderSocialLogin = () => (
    <div className={styles.socialLogin}>
      <div className={styles.socialButton} onClick={() => handleSocialLogin("카카오")}>
        <img src={kakaoLogo} alt="카카오 로그인" className={styles.socialIcon} />
        카카오로 계속하기
      </div>
      <div className={styles.socialButton} onClick={() => handleSocialLogin("구글")}>
        <img src={googleLogo} alt="구글 로그인" className={styles.socialIcon} />
        구글로 계속하기
      </div>
    </div>
  );

  return (
    <div className={styles.authBox}>
      <img src={logoImage} alt="StudyWithUs Logo" className={styles.logo} />

      <div className={styles.toggle}>
        <button
          className={`${styles.toggleButton} ${mode === "login" ? styles.active : ""}`}
          onClick={() => setMode("login")}
        >
          로그인
        </button>
        <button
          className={`${styles.toggleButton} ${mode === "signup" ? styles.active : ""}`}
          onClick={() => setMode("signup")}
        >
          회원가입
        </button>
      </div>

      {renderInputs()}

      <button onClick={handleSubmit} className={styles.button}>
        {mode === "login" ? "로그인" : "회원가입"}
      </button>

      {renderSocialLogin()}

      <div className={styles.footer}>
        <button
          type="button"
          className={styles.footerButton}
          onClick={() => setIsFindPasswordOpen(true)}
        >
          비밀번호를 잊으셨나요?
        </button>
      </div>

      <Modal isOpen={isFindPasswordOpen} onClose={() => setIsFindPasswordOpen(false)}>
        <h2>비밀번호 찾기</h2>
        <input
          type="email"
          placeholder="가입한 이메일 입력"
          value={findEmail}
          onChange={(e) => setFindEmail(e.target.value)}
          className={styles.input}
        />
        <button className={styles.modalButton} onClick={() => {}}>
          비밀번호 찾기
        </button>
      </Modal>
    </div>
  );
};

export default AuthForm;
