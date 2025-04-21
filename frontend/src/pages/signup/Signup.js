import { useState } from "react";
import styles from "./Signup.module.css";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    passwordCheck: "",
    nickname: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignup = async () => {
    if (!form.email || !form.password || !form.nickname) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    if (form.password !== form.passwordCheck) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          nickname: form.nickname,
        }),
      });

      const result = await res.json();
      console.log("서버 응답:", result);

      if (res.ok && result.status === 200) {
        alert("🎉 " + result.message);
        navigate("/login");
      } else {
        alert("회원가입 실패: " + result.message);
      }
    } catch (error) {
      console.error("서버 통신 에러:", error);
      alert("서버 오류: " + error.message);
    }
  };

  const handleEmailCheck = () => {
    if (!form.email) {
      alert("이메일을 입력해주세요.");
      return;
    }

    // 이메일 중복확인 API를 연결하려면 여기서 fetch 추가하면 됨
    console.log("이메일 중복확인 요청:", form.email);
    alert("이메일 중복확인 기능은 아직 구현 중입니다.");
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>회원가입</h1>
      <div className={styles.form}>
        <div className={styles.inputGroup}>
          <label>이메일</label>
          <div className={styles.inputRow}>
            <input
              type="text"
              name="email"
              value={form.email}
              onChange={handleChange}
              maxLength="30"
              autoFocus
            />
            <button
              type="button"
              className={styles.checkbtn}
              onClick={handleEmailCheck}
            >
              중복확인
            </button>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label>비밀번호</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            maxLength="20"
            placeholder="비밀번호"
          />
        </div>

        <div className={styles.inputGroup}>
          <label>비밀번호 확인</label>
          <input
            type="password"
            name="passwordCheck"
            value={form.passwordCheck}
            onChange={handleChange}
            maxLength="20"
            placeholder="비밀번호 확인"
          />
        </div>

        <div className={styles.inputGroup}>
          <label>닉네임</label>
          <input
            type="text"
            name="nickname"
            value={form.nickname}
            onChange={handleChange}
            maxLength="20"
            placeholder="닉네임"
          />
        </div>

        <button
          type="button"
          className={styles.submitBtn}
          onClick={handleSignup}
        >
          가입하기
        </button>
      </div>
    </div>
  );
}

export default Signup;
