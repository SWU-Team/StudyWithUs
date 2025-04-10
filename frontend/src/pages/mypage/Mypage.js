import React, { useState } from "react";
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
  const [nickname, setNickname] = useState("닉네임");
  const [email] = useState("user@email.com");
  const [profileImage, setProfileImage] = useState(StudywithusLogo);
  const [previewImage, setPreviewImage] = useState(StudywithusLogo); // 미리보기 용도
  const [showEditModal, setShowEditModal] = useState(false);
  const [newNickname, setNewNickname] = useState(nickname);
  const [newImageFile, setNewImageFile] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImageFile(file);
      setPreviewImage(URL.createObjectURL(file)); // 미리보기
    }
  };

  const handleSaveProfile = () => {
    setNickname(newNickname);
    if (previewImage) {
      setProfileImage(previewImage); // ✅ 저장 눌렀을 때만 반영
    }
    setShowEditModal(false);
    alert("프로필이 수정되었습니다.");
  };

  return (
    <Layout>
      <div className={styles.wrapper}>
        <h2 className={styles.title}>마이페이지</h2>

        {/* 프로필 */}
        <div className={`${styles.section} ${styles.profileSection}`}>
          <img
            src={profileImage}
            alt="Profile"
            className={styles.profileImage}
          />
          <div className={styles.profileInfo}>
            <h3>{nickname}</h3>
            <p>{email}</p>
          </div>
          <button
            className={styles.editButton}
            onClick={() => setShowEditModal(true)}
          >
            수정
          </button>
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

        {/* ✅ 수정 모달 */}
        {showEditModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h3>프로필 수정</h3>
              <input
                type="text"
                placeholder="새 닉네임"
                value={newNickname}
                onChange={(e) => setNewNickname(e.target.value)}
                className={styles.inputField}
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={styles.inputField}
              />
              <div className={styles.modalButtons}>
                <button
                  onClick={handleSaveProfile}
                  className={styles.submitBtn}
                >
                  저장
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className={styles.cancelBtn}
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Mypage;
