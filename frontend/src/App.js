import "./App.css";
import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import Layout from "./components/Layout";
import Signup from "./pages/signup/Signup";
import Login from "./pages/login/Login";
import Mypage from "./pages/mypage/Mypage";
import SearchID from "./pages/search/SearchID";
import SearchPW from "./pages/search/SearchPW";
import Diary from "./pages/diary/Diary";
import Planer from "./pages/planer/Planer";
import StudyRoomList from "./pages/rooms/StudyRoomList";
import Startpage from "./pages/startpage/Startpage";
// import StudyRoom from "./pages/rooms/StudyRoom";

import { isAuthenticated } from "./utils/auth";

// ✅ 인증이 필요한 라우트 래퍼
const ProtectedRoute = () => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

function App() {
  return (
    <Routes>
      {/* 🔓 인증 없이 접근 가능한 페이지 */}
      <Route path="/" element={<Startpage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/searchid" element={<SearchID />} />
      <Route path="/searchpw" element={<SearchPW />} />

      {/* 🔐 인증이 필요한 페이지 (공통 레이아웃 포함) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/diary" element={<Diary />} />
        <Route path="/planer" element={<Planer />} />
        <Route path="/rooms" element={<StudyRoomList />} />
        {/* <Route path="/rooms/:roomId" element={<StudyRoom />} /> */}
      </Route>

      {/* 🔁 잘못된 경로 → 홈으로 리다이렉트 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
