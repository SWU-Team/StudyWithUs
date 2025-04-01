import "./App.css";
import Login from "./pages/login/Login";
import Mypage from "./pages/mypage/Mypage";
import SearchID from "./pages/searchid/SearchID";
import SearchPW from "./pages/searchpw/SearchPW";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // BrowserRouter 추가
import Diary from "./pages/diary/Diary";
import Planer from "./pages/planer/Planer";
import StudyRoomList from "./pages/rooms/StudyRoomList";
import Signup from "./pages/sighup/Signup";
import Startpage from "./pages/startpage/Startpage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Startpage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/SearchID" element={<SearchID />} />
        <Route path="/SearchPW" element={<SearchPW />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Mypage" element={<Mypage />} />
        <Route path="/Diary" element={<Diary />} />
        <Route path="/Planer" element={<Planer />} />
        <Route path="/StudyRoomList" element={<StudyRoomList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
