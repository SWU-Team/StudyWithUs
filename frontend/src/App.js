import "./App.css";
import Login from "./pages/Login";
import Startpage from "./pages/Startpage";
import Mypage from "./pages/Mypage";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // BrowserRouter 추가
import Diary from "./pages/Diary";
import Planer from "./pages/Planer";
import StudyRoomList from "./pages/StudyRoomList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Startpage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Mypage" element={<Mypage />} />
        <Route path="/Diary" element={<Diary />} />
        <Route path="/Planer" element={<Planer />} />
        <Route path="/StudyRoomList" element={<StudyRoomList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
