import React, { useState } from "react";
import styles from "./SearchID.module.css";

function SearchID() {
  // 상태 관리
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isFound, setIsFound] = useState(false);
  const [foundEmail, setFoundEmail] = useState("");

  // 아이디 찾기 핸들러
  const handleFindId = (e) => {
    e.preventDefault();

    // 여기에서는 시뮬레이션만 함 (실제로는 서버 API 호출 필요)
    if (name && phone) {
      setIsFound(true);
      // 가상의 이메일 마스킹
      setFoundEmail("user***@example.com");
    }
  };

  // 입력 폼 리셋
  const handleReset = () => {
    setIsFound(false);
    setName("");
    setPhone("");
    setFoundEmail("");
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>아이디 찾기</div>

      {!isFound ? (
        <form className={styles.form} onSubmit={handleFindId}>
          {/* 이름 */}
          <div className={styles.inputGroup}>
            <label htmlFor="name">이름</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              maxLength="20"
              required
              autoFocus
            />
          </div>

          {/* 휴대폰 번호 */}
          <div className={styles.inputGroup}>
            <label htmlFor="phone">휴대폰 번호</label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="휴대폰 번호를 입력하세요 (-없이)"
              required
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            아이디 찾기
          </button>

          <div className={styles.linkContainer}>
            <a href="/login" className={styles.link}>
              로그인
            </a>
            <a href="/find-password" className={styles.link}>
              비밀번호 찾기
            </a>
            <a href="/signup" className={styles.link}>
              회원가입
            </a>
          </div>
        </form>
      ) : (
        <div className={styles.resultContainer}>
          <div className={styles.resultMessage}>
            <p>회원님의 아이디는</p>
            <p className={styles.foundEmail}>{foundEmail}</p>
            <p>입니다.</p>
          </div>

          <div className={styles.resultActions}>
            <button onClick={handleReset} className={styles.resetBtn}>
              다시 찾기
            </button>
            <a href="/login" className={styles.loginLink}>
              로그인하기
            </a>
            <a href="/find-password" className={styles.findPasswordLink}>
              비밀번호 찾기
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchID;
