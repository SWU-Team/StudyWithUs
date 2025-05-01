import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./StudyRoomList.module.css";
import { apiGet, apiPost, extractErrorInfo } from "../../utils/api";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";

function StudyRoomList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newRoom, setNewRoom] = useState({
    title: "",
    maxCapacity: 4,
    focusMinute: 50,
    breakMinute: 10,
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      const data = await apiGet("/rooms");
      setRooms(data);
    } catch (error) {
      console.error("방 목록 가져오기 실패: ", error);
      toast.error("방 목록을 가져오는 데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoom((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateRoom = async () => {
    if (!newRoom.title) {
      alert("방 제목을 입력해주세요.");
      return;
    }

    try {
      const data = await apiPost("/rooms", newRoom);
      alert("방이 생성되었습니다!");
      navigate(`/rooms/${data.id}`);
    } catch (error) {
      console.error("방 생성 실패: ", error);
      alert(error.message || "방 생성에 실패했습니다.");
    }
  };

  const handleJoinRoom = async (roomId) => {
    try {
      await apiPost(`/rooms/${roomId}/join`, {});
      navigate(`/rooms/${roomId}`);
    } catch (error) {
      const { status, data } = extractErrorInfo(error);

      if (status === 409) {
        toast.error("방에 이미 참여 중입니다.");
      }
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="검색어를 입력하세요."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className={styles.searchBtn}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill="none"
            stroke="#1c4454"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-search"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>StudyRoom</h3>
            <label className={styles.label}>방 이름</label>
            <input
              type="text"
              name="title"
              value={newRoom.title}
              onChange={handleInputChange}
              className={styles.input}
            />

            <div className={styles.modalRow}>
              <div className={styles.modalColumn}>
                <label className={styles.label}>집중 시간</label>
                <input
                  type="number"
                  name="focusMinute"
                  value={newRoom.focusMinute}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>
              <div className={styles.modalColumn}>
                <label className={styles.label}>휴식 시간</label>
                <input
                  type="number"
                  name="breakMinute"
                  value={newRoom.breakMinute}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>
            </div>
            <label className={styles.label}>최대 인원</label>
            <select
              name="maxCapacity"
              value={newRoom.maxCapacity}
              onChange={handleInputChange}
              className={styles.select}
            >
              {[2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  최대 {num}명
                </option>
              ))}
            </select>
            <div className={styles.formButtons}>
              <button onClick={handleCreateRoom} className={styles.submitBtn}>
                생성
              </button>
              <button onClick={() => setShowModal(false)} className={styles.cancelBtn}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}
      {isLoading ? (
        <div className={styles.loadingWrapper}>
          <Loading />
        </div>
      ) : (
        <>
          <div className={styles.roomList}>
            <div className={styles.roomListHeader}>
              <div className={styles.roomTitleCell}>방 제목</div>
              <div className={styles.roomInfoWrapper}>
                <div className={styles.roomTimeCell}>집중/휴식</div>
                <div className={styles.roomInfoCell}>인원</div>
              </div>
            </div>

            {rooms.map((room) => (
              <div
                key={room.id}
                className={styles.roomListRow}
                onClick={() => handleJoinRoom(room.id)}
              >
                <div className={styles.roomTitleCell}>{room.title}</div>
                <div className={styles.roomInfoWrapper}>
                  <div className={styles.roomTimeCell}>
                    {room.focusMinute}분 / {room.breakMinute}분
                  </div>
                  <div className={styles.roomInfoCell}>
                    {room.currentMemberCount} / {room.maxCapacity}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.pagination}>
            <button className={styles.pageBtn}>◀</button>
            <div className={`${styles.pageNumber} ${styles.active}`}>1</div>
            <button className={styles.pageBtn}>▶</button>
          </div>
        </>
      )}
      <button className={styles.createBtn} onClick={() => setShowModal(true)}>
        + 방 만들기
      </button>
    </div>
  );
}

export default StudyRoomList;
