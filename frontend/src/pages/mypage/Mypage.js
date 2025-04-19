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

// 📊 일별 공부 시간 (예: 이번 주 기준)
const dailyStudyData = [
  { day: "월", hours: 2 },
  { day: "화", hours: 3 },
  { day: "수", hours: 1.5 },
  { day: "목", hours: 4 },
  { day: "금", hours: 2 },
  { day: "토", hours: 5 },
  { day: "일", hours: 3 },
];

// 📊 월별 공부 시간 (올해 기준)
const monthlyStudyData = [
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
  const [previewImage, setPreviewImage] = useState(StudywithusLogo);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newNickname, setNewNickname] = useState(nickname);
  const [newImageFile, setNewImageFile] = useState(null);
  const [rankMode, setRankMode] = useState("daily"); // "daily" or "monthly"

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
      setProfileImage(previewImage);
    }
    setShowEditModal(false);
    alert("프로필이 수정되었습니다.");
  };

  const dummyFriends = [
    {
      id: 1,
      name: "효서기",
      email: "hyoseok@naver.com",
      image: StudywithusLogo,
      status: "오늘도 파이팅 ✨",
      dailyHours: 5,
      monthlyHours: 45,
    },
    {
      id: 2,
      name: "태비니",
      email: "taebin@naver.com",
      image: StudywithusLogo,
      status: "열공 중입니다 👨‍💻",
      dailyHours: 4,
      monthlyHours: 38,
    },
    {
      id: 3,
      name: "열공핑",
      email: "yeongho@naver.com",
      image: StudywithusLogo,
      status: "컴포넌트 분해 중 🧩",
      dailyHours: 2,
      monthlyHours: 20,
    },
  ];

  const sortedRanking = [...dummyFriends].sort((a, b) => {
    return rankMode === "daily"
      ? b.dailyHours - a.dailyHours
      : b.monthlyHours - a.monthlyHours;
  });

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

        {/* 📌 스터디 랭킹 */}
        <div className={styles.section}>
          <h3>스터디 랭킹</h3>
          <div className={styles.rankButtons}>
            <button
              className={rankMode === "daily" ? styles.activeBtn : ""}
              onClick={() => setRankMode("daily")}
            >
              일간
            </button>
            <button
              className={rankMode === "monthly" ? styles.activeBtn : ""}
              onClick={() => setRankMode("monthly")}
            >
              월간
            </button>
          </div>
          {sortedRanking.map((friend, index) => (
            <div key={friend.id} className={styles.rankItem}>
              <span className={styles.rankNum}>{index + 1}위</span>
              <span className={styles.rankName}>{friend.name}</span>
              <span className={styles.rankHours}>
                {rankMode === "daily"
                  ? `${friend.dailyHours}시간`
                  : `${friend.monthlyHours}시간`}
              </span>
            </div>
          ))}
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
            {dummyFriends.map((friend) => (
              <div key={friend.id} className={styles.friendItem}>
                <img
                  src={friend.image}
                  alt="profile"
                  className={styles.friendAvatar}
                />
                <div className={styles.friendInfo}>
                  <strong>{friend.name}</strong>
                  <p>{friend.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 하단 일간/월간 공부 시간 */}
        <div className={styles.subGrid}>
          <div className={styles.subSection}>
            <h4>일별 공부시간</h4>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={dailyStudyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis unit="시간" />
                <Tooltip />
                <Bar dataKey="hours" fill="#82ca9d" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className={styles.subSection}>
            <h4>월별 공부시간</h4>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={monthlyStudyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis unit="시간" />
                <Tooltip />
                <Bar dataKey="hours" fill="#8884d8" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 수정 모달 */}
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
