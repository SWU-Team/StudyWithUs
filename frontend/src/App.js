import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import StudyRoom from "./pages/rooms/StudyRoom";
import { isAuthenticated } from "./utils/auth";

// 인증이 필요한 페이지들을 감싸는 컴포넌트
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* 시작 페이지와 인증 관련 페이지는 레이아웃 없이 렌더링 */}
        <Route path="/" element={<Startpage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/searchid" element={<SearchID />} />
        <Route path="/searchpw" element={<SearchPW />} />

        {/* 레이아웃이 필요한 페이지들 - 인증 필요 */}
        <Route element={<ProtectedRoute />}>
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/diary" element={<Diary />} />
          <Route path="/planer" element={<Planer />} />
          <Route path="/rooms" element={<StudyRoomList />} />
          <Route path="/rooms/:roomId" element={<StudyRoom />} />
        </Route>

        {/* 404 페이지 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
