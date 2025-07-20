import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./StudyRoomList.module.css";
import { apiGet, apiPost, extractErrorInfo } from "../../utils/api";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";
import Modal from "../../components/Modal";

function StudyRoomList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [rooms, setRooms] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
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

  const fetchRooms = async (page = 0, keyword = "") => {
    try {
      setIsLoading(true);
      let data;

      if (keyword) {
        data = await apiGet(`/rooms/search?keyword=${keyword}&page=${page}&size=10`);
      } else {
        data = await apiGet(`/rooms?page=${page}&size=10`);
      }

      setRooms(data.content);
      setTotalPages(data.totalPages);
      setCurrentPage(data.number);
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
      toast.warn("방 제목을 입력해주세요.");
      return;
    }

    try {
      const data = await apiPost("/rooms", newRoom);
      toast.success("방이 생성되었습니다!");
      navigate(`/rooms/${data.id}`);
    } catch (error) {
      console.error("방 생성 실패: ", error);
      toast.error(error.message || "방 생성에 실패했습니다.");
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

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      fetchRooms(page, searchTerm);
    }
  };

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="검색어를 입력하세요."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                fetchRooms(0, searchTerm);
              }
            }}
          />
          <button className={styles.searchBtn} onClick={() => fetchRooms(0, searchTerm)}>
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
                  <div className={styles.roomTitleCell}>📌 {room.title}</div>
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
              <button
                className={styles.pageBtn}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
              >
                ◀
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <div
                  key={i}
                  className={`${styles.pageNumber} ${currentPage === i ? styles.active : ""}`}
                  onClick={() => handlePageChange(i)}
                >
                  {i + 1}
                </div>
              ))}

              <button
                className={styles.pageBtn}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
              >
                ▶
              </button>
            </div>
          </>
        )}
        <button className={styles.createBtn} onClick={() => setShowModal(true)}>
          + 방 만들기
        </button>
      </div>
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="✏️ 스터디룸 만들기"
        onConfirm={handleCreateRoom}
        confirmText="방 생성"
      >
        <div className={styles.modalDescription}>함께 공부할 방의 정보를 입력해주세요.</div>

        <div className={styles.formGroup}>
          <label className={styles.label}>방 제목</label>
          <input
            type="text"
            name="title"
            placeholder="ex) 오전 알고리즘 스터디"
            value={newRoom.title}
            onChange={handleInputChange}
            className={styles.input}
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formItem}>
            <label className={styles.label}>집중 시간</label>
            <div className={styles.inputWithUnit}>
              <input
                type="number"
                name="focusMinute"
                value={newRoom.focusMinute}
                onChange={handleInputChange}
                className={styles.input}
                min={10}
                step={5}
              />
              <span className={styles.unit}>분</span>
            </div>
          </div>

          <div className={styles.formItem}>
            <label className={styles.label}>휴식 시간</label>
            <div className={styles.inputWithUnit}>
              <input
                type="number"
                name="breakMinute"
                value={newRoom.breakMinute}
                onChange={handleInputChange}
                className={styles.input}
                min={5}
                step={5}
              />
              <span className={styles.unit}>분</span>
            </div>
          </div>

          <div className={styles.formItem}>
            <label className={styles.label}>최대 인원</label>
            <select
              name="maxCapacity"
              value={newRoom.maxCapacity}
              onChange={handleInputChange}
              className={styles.select}
            >
              {[2, 3, 4].map((num) => (
                <option key={num} value={num}>
                  {num}명
                </option>
              ))}
            </select>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default StudyRoomList;
