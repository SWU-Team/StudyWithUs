import styles from "./Signup.module.css";

function Signup() {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>회원가입</h1>
      <div className={styles.form}>
        {/* 이메일 */}
        <div className={styles.inputGroup}>
          <label>이메일</label>
          <div className={styles.inputRow}>
            <input type="text" maxLength="30" name="register_id" autoFocus />
            <button type="button" className={styles.checkbtn}>
              중복확인
            </button>
          </div>
        </div>

        {/* 비밀번호 */}
        <div className={styles.inputGroup}>
          <label>비밀번호</label>
          <input
            type="password"
            maxLength="20"
            name="register_password"
            placeholder="비밀번호"
          />
        </div>

        {/* 비밀번호 확인 */}
        <div className={styles.inputGroup}>
          <label>비밀번호 확인</label>
          <input
            type="password"
            maxLength="20"
            name="register_pswCheck"
            placeholder="비밀번호 확인"
          />
        </div>

        {/* 이름 */}
        <div className={styles.inputGroup}>
          <label>이름</label>
          <input
            type="text"
            maxLength="20"
            name="register_name"
            placeholder="이름"
          />
        </div>

        <button type="submit" className={styles.submitBtn}>
          가입하기
        </button>
      </div>
    </div>
  );
}

export default Signup;
