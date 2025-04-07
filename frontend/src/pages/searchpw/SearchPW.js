import React, { useState } from "react";
import styles from "./SearchPW.module.css";

function SearchPW() {
  // 상태 관리
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordReset, setIsPasswordReset] = useState(false);

  // 인증번호 발송 핸들러
  const handleSendVerification = (e) => {
    e.preventDefault();

    // 여기에서는 시뮬레이션만 함 (실제로는 서버 API 호출 필요)
    if (email && name && phone) {
      setIsVerificationSent(true);
    }
  };

  // 인증번호 확인 핸들러
  const handleVerifyCode = (e) => {
    e.preventDefault();

    // 여기에서는 시뮬레이션만 함 (실제로는 서버 API 호출 필요)
    if (verificationCode) {
      setIsVerified(true);
    }
  };

  // 비밀번호 재설정 핸들러
  const handleResetPassword = (e) => {
    e.preventDefault();

    // 여기에서는 시뮬레이션만 함 (실제로는 서버 API 호출 필요)
    if (newPassword && newPassword === confirmPassword) {
      setIsPasswordReset(true);
    }
  };

  // 전체 프로세스 리셋
  const handleReset = () => {
    setEmail("");
    setName("");
    setPhone("");
    setIsVerificationSent(false);
    setVerificationCode("");
    setIsVerified(false);
    setNewPassword("");
    setConfirmPassword("");
    setIsPasswordReset(false);
  };

  // 1단계: 사용자 정보 입력
  const renderStep1 = () => (
    <form className={styles.form} onSubmit={handleSendVerification}>
      {/* 이메일 */}
      <div className={styles.inputGroup}>
        <label htmlFor="email">이메일</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="가입한 이메일을 입력하세요"
          required
          autoFocus
        />
      </div>

      {/* 이름 */}
      <div className={styles.inputGroup}>
        <label htmlFor="name">이름</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름을 입력하세요"
          required
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
        인증번호 발송
      </button>

      <div className={styles.linkContainer}>
        <a href="/login" className={styles.link}>
          로그인
        </a>
        <a href="/SearchID" className={styles.link}>
          아이디 찾기
        </a>
        <a href="/signup" className={styles.link}>
          회원가입
        </a>
      </div>
    </form>
  );

  // 2단계: 인증번호 확인
  const renderStep2 = () => (
    <form className={styles.form} onSubmit={handleVerifyCode}>
      <div className={styles.infoText}>
        {email}로 인증번호가 발송되었습니다.
      </div>

      {/* 인증번호 */}
      <div className={styles.inputGroup}>
        <label htmlFor="verificationCode">인증번호</label>
        <div className={styles.inputRow}>
          <input
            id="verificationCode"
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="인증번호 6자리를 입력하세요"
            maxLength="6"
            required
            autoFocus
          />
          <button
            type="button"
            className={styles.checkbtn}
            onClick={handleSendVerification}
          >
            재발송
          </button>
        </div>
      </div>

      <button type="submit" className={styles.submitBtn}>
        인증 확인
      </button>

      <button type="button" onClick={handleReset} className={styles.cancelBtn}>
        처음으로 돌아가기
      </button>
    </form>
  );

  // 3단계: 새 비밀번호 설정
  const renderStep3 = () => (
    <form className={styles.form} onSubmit={handleResetPassword}>
      <div className={styles.infoText}>새로운 비밀번호를 설정해주세요.</div>

      {/* 새 비밀번호 */}
      <div className={styles.inputGroup}>
        <label htmlFor="newPassword">새 비밀번호</label>
        <input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="새 비밀번호를 입력하세요 (8자 이상)"
          minLength="8"
          required
          autoFocus
        />
      </div>

      {/* 새 비밀번호 확인 */}
      <div className={styles.inputGroup}>
        <label htmlFor="confirmPassword">새 비밀번호 확인</label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="새 비밀번호를 다시 입력하세요"
          minLength="8"
          required
        />
      </div>

      <button type="submit" className={styles.submitBtn}>
        비밀번호 변경하기
      </button>

      <button type="button" onClick={handleReset} className={styles.cancelBtn}>
        처음으로 돌아가기
      </button>
    </form>
  );

  // 4단계: 비밀번호 변경 완료
  const renderStep4 = () => (
    <div className={styles.resultContainer}>
      <div className={styles.resultMessage}>
        <p>비밀번호가 성공적으로 변경되었습니다.</p>
        <p>새 비밀번호로 로그인해주세요.</p>
      </div>

      <div className={styles.resultActions}>
        <a href="/login" className={styles.loginLink}>
          로그인하기
        </a>
      </div>
    </div>
  );

  // 단계별 렌더링
  const renderCurrentStep = () => {
    if (isPasswordReset) return renderStep4();
    if (isVerified) return renderStep3();
    if (isVerificationSent) return renderStep2();
    return renderStep1();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>비밀번호 찾기</div>
      {renderCurrentStep()}
    </div>
  );
}

export default SearchPW;
