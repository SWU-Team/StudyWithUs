import "./App.css";
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, Outlet, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { getAuthHeader, setToken, extractTokenFromHeader } from "./utils/auth";
import axios from "axios";

import Layout from "./components/Layout";
import Mypage from "./pages/mypage/Mypage";
import DiaryList from "./pages/diary/DiaryList";
import Planer from "./pages/planer/Planer";
import StudyRoomList from "./pages/rooms/StudyRoomList";
import LandingPage from "./pages/landing/LandingPage";
import StudyRoom from "./pages/rooms/StudyRoom";
import CompleteInfoPage from "./pages/landing/CompleteInfoPage";

import { isAuthenticated } from "./utils/auth";

// ✅ 인증이 필요한 라우트 래퍼
const ProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthHeader();
      if (!token) {
        try {
          const res = await axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/auth/reissue`,
            {},
            {
              withCredentials: true,
            }
          );
          const newToken = extractTokenFromHeader(res);
          setToken(newToken);
        } catch (e) {
          navigate("/", { replace: true });
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);
  if (loading) return <div>로딩 중...</div>;

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

function App() {
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        limit={1}
        theme="light"
      />
      <Routes>
        {/* 🔓 인증 없이 접근 가능한 페이지 */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/complete-info" element={<CompleteInfoPage />} />

        {/* 🔐 인증이 필요한 페이지 (공통 레이아웃 포함) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/diaries" element={<DiaryList />} />
          <Route path="/planer" element={<Planer />} />
          <Route path="/rooms" element={<StudyRoomList />} />
          <Route path="/rooms/:roomId" element={<StudyRoom />} />
        </Route>

        {/* 🔁 잘못된 경로 → 홈으로 리다이렉트 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
