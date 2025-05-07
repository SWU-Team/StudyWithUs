// src/pages/CompleteInfoPage.jsx
import React, { useState, useEffect } from "react";
import styles from "./CompleteInfoPage.module.css";
import logoImage from "../../assets/images/StudywithusLogo.png";
import { toast } from "react-toastify";
import { setToken, extractTokenFromHeader, getAuthHeader } from "../../utils/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

const CompleteInfoPage = () => {
  const [nickname, setNickname] = useState("");
  const [profileImgFile, setProfileImgFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/auth/reissue`,
          {},
          { withCredentials: true }
        );
        const token = extractTokenFromHeader(res);
        console.log("Access Token:", token);
        setToken(token);
      } catch (e) {
        toast.error("로그인 세션이 만료되었습니다.");
        navigate("/");
      }
    };

    fetchAccessToken();
  }, []);

  const handleProfileImgChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > MAX_FILE_SIZE) {
      toast.error("이미지 크기는 1MB를 넘을 수 없습니다.");
      return;
    }
    setProfileImgFile(file);
  };

  const handleSubmit = async () => {
    if (!nickname.trim()) {
      toast.error("닉네임을 입력해주세요.");
      return;
    }

    try {
      const formData = new FormData();
      const json = JSON.stringify({ nickname });
      const blob = new Blob([json], { type: "application/json" });

      formData.append("info", blob);

      if (profileImgFile) {
        formData.append("profileImage", profileImgFile);
      }

      await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/users/complete-info`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: getAuthHeader(),
        },
        withCredentials: true,
      });

      toast.success("정보가 성공적으로 저장되었습니다!");

      navigate("/rooms");
    } catch (err) {
      toast.error("정보 저장에 실패했습니다.");
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <img src={logoImage} alt="StudyWithUs 로고" className={styles.logo} />
        <h2 className={styles.title}>추가 정보 입력</h2>
        <p className={styles.subtitle}>서비스를 사용하기 위한 정보를 완성해주세요</p>

        <input
          type="text"
          placeholder="닉네임을 입력하세요"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className={styles.input}
        />

        <label htmlFor="profileImg" className={styles.fileLabel}>
          {profileImgFile ? profileImgFile.name : "프로필 이미지 선택"}
        </label>
        <input
          id="profileImg"
          type="file"
          accept="image/*"
          onChange={handleProfileImgChange}
          className={styles.fileInput}
        />

        <button onClick={handleSubmit} className={styles.button}>
          완료하고 입장하기
        </button>
      </div>
    </div>
  );
};

export default CompleteInfoPage;
