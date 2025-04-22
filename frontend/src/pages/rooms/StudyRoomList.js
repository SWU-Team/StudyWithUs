import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./StudyRoomList.module.css";
import { getAuthHeader } from "../../utils/auth";

function StudyRoomList() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
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
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/rooms`, {
        headers: {
          Authorization: getAuthHeader(),
        },
      });
      if (!response.ok) throw new Error("Failed to fetch rooms");
      const data = await response.json();
      setRooms(data.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
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
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: getAuthHeader(),
        },
        body: JSON.stringify(newRoom),
      });

      if (!response.ok) throw new Error("Failed to create room");

      const data = await response.json();
      if (data.status === 200) {
        alert("방이 생성되었습니다!");
        navigate(`/rooms/${data.id}`);
      } else {
        throw new Error(data.message || "방 생성에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error creating room:", error);
      alert(error.message || "방 생성에 실패했습니다.");
    }
  };

  const handleJoinRoom = (roomId) => {
    navigate(`/rooms/${roomId}`);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>📋 스터디룸 목록</h2>
        <button className={styles.createBtn} onClick={() => setShowModal(true)}>
          + 방 만들기
        </button>
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>📌 새 스터디룸 생성</h3>
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

      <div className={styles.roomList}>
        {rooms.map((room) => (
          <div key={room.id} className={styles.roomCard}>
            <div className={styles.roomInfoBox}>
              <div className={styles.roomTitle}>📝 {room.title}</div>
              <div className={styles.roomInfo}>
                👥 {room.currentMemberCount} / {room.maxCapacity}
              </div>
              <div className={styles.roomTime}>
                ⏱️ {room.focusMinute}분 집중 / {room.breakMinute}분 휴식
              </div>
            </div>
            <button className={styles.enterBtn} onClick={() => handleJoinRoom(room.id)}>
              입장
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudyRoomList;
