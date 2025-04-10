import React from "react";
import Layout from "../../components/Layout";
import styles from "./Mypage.module.css";
import StudywithusLogo from "../../assets/images/StudywithusLogo.png";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const studyData = [
  { month: "1월", hours: 10 },
  { month: "2월", hours: 25 },
  { month: "3월", hours: 15 },
  { month: "4월", hours: 32 },
  { month: "5월", hours: 20 },
  { month: "6월", hours: 28 },
];

function Mypage() {
  return (
    <Layout>
      <div className={styles.wrapper}>
        <h2 className={styles.title}>마이페이지</h2>

        {/* 프로필 */}
        <div className={`${styles.section} ${styles.profileSection}`}>
          <img
            src={StudywithusLogo}
            alt="StudywithusLogo"
            className={styles.profileImage}
          />
          <div className={styles.profileInfo}>
            <h3>닉네임</h3>
            <p>user@email.com</p>
          </div>
          <button className={styles.editButton}>수정</button>
        </div>

        {/* 일간 목표율 (그래프) */}
        <div className={styles.section}>
          <h3>일간 목표율</h3>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={studyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis unit="시간" />
                <Tooltip />
                <Bar dataKey="hours" fill="#8884d8" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 친구 */}
        <div className={styles.friendSection}>
          <h4>친구</h4>
          <input
            type="text"
            placeholder="친구 검색"
            className={styles.inputField}
          />
          <div className={styles.friendList}>
            <p>친구 목록이 여기에 표시됩니다.</p>
          </div>
        </div>

        {/* 하단 랭킹 및 월간 목표율 */}
        <div className={styles.subGrid}>
          <div className={styles.subSection}>
            <h4>랭킹</h4>
            <p>Study Time</p>
            <div style={{ backgroundColor: "#ddd", height: "100px" }}></div>
          </div>
          <div className={styles.subSection}>
            <h4>월간 목표율</h4>
            <div style={{ backgroundColor: "#ddd", height: "100px" }}></div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Mypage;
