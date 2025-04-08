import React, { useState } from "react";
import Layout from "../../components/Layout";
import styles from "./StudyRoomList.module.css";

function StudyRoomList() {
  const [rooms, setRooms] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [newRoom, setNewRoom] = useState({
    title: "",
    maxCapacity: 2,
    focusMinute: 50,
    breakMinute: 10,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoom((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateRoom = () => {
    if (!newRoom.title) {
      alert("방 제목을 입력해주세요.");
      return;
    }

    const newRoomData = {
      id: rooms.length + 1,
      title: newRoom.title,
      current: 1, // 기본 입장 인원 1명
      max: Number(newRoom.maxCapacity),
    };

    setRooms((prev) => [...prev, newRoomData]);
    setNewRoom({
      title: "",
      maxCapacity: 2,
      focusMinute: 50,
      breakMinute: 10,
    });
    setShowModal(false);
    alert("방이 생성되었습니다!");
  };

  return (
    <Layout>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h2 className={styles.title}>스터디룸 목록</h2>
          <button
            className={styles.createBtn}
            onClick={() => setShowModal(true)}
          >
            + 방 만들기
          </button>
        </div>

        {/* ✅ 모달 */}
        {showModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h3>스터디룸 생성</h3>
              <input
                type="text"
                name="title"
                value={newRoom.title}
                onChange={handleInputChange}
                placeholder="방 제목"
                className={styles.input}
              />
              <input
                type="number"
                name="focusMinute"
                placeholder="집중 시간 (분)"
                value={newRoom.focusMinute}
                onChange={handleInputChange}
                className={styles.input}
              />
              <input
                type="number"
                name="breakMinute"
                placeholder="휴식 시간 (분)"
                value={newRoom.breakMinute}
                onChange={handleInputChange}
                className={styles.input}
              />
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
                <button
                  onClick={() => setShowModal(false)}
                  className={styles.cancelBtn}
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 방 목록 */}
        <div className={styles.roomList}>
          {rooms.map((room) => (
            <div key={room.id} className={styles.roomCard}>
              <div className={styles.roomTitle}>{room.title}</div>
              <div className={styles.roomInfo}>
                인원: {room.current} / {room.max}
              </div>
              <button className={styles.enterBtn}>입장</button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default StudyRoomList;
