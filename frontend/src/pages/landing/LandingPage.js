import React from "react";
import styles from "./LandingPage.module.css";
import AuthForm from "../../components/AuthForm";

function LandingPage() {
  return (
    <div className={styles.landing}>
      <div className={styles.leftSection}>
        <div className={`${styles.siteName} ${styles.fadeIn}`}>STUDY WITH US</div>

        <h1 className={`${styles.title} ${styles.fadeIn}`} style={{ animationDelay: "0.2s" }}>
          함께 공부하고, 함께 연결되는 공간
        </h1>

        <p className={`${styles.subTitle} ${styles.fadeIn}`} style={{ animationDelay: "0.4s" }}>
          혼자 공부하는 게 힘들었던 적 있나요?
          <br />
          실시간 스터디와 목표 관리,
          <br />
          매일 성장하는 당신을 위해 준비했습니다.
        </p>

        <p className={`${styles.description} ${styles.fadeIn}`} style={{ animationDelay: "0.6s" }}>
          Study With Us는
          <br />
          공부를 기록하고, 함께 목표를 이루는
          <br />
          진짜 스터디 플랫폼입니다.
        </p>
      </div>

      <div className={styles.rightSection}>
        <AuthForm />
      </div>
    </div>
  );
}

export default LandingPage;
