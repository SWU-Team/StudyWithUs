import React from "react";
import Layout from "../../components/Layout";
import styles from "./StudyRoomList.module.css";

const dummyRooms = [
  { id: 1, title: "FE 취업 스터디", current: 3, max: 5 },
  { id: 2, title: "알고리즘 같이 풀기", current: 2, max: 4 },
  { id: 3, title: "CS 개념 마스터", current: 5, max: 5 },
];

function StudyRoomList() {
  return (
    <Layout>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h2 className={styles.title}>스터디룸 목록</h2>
          <button className={styles.createBtn}>+ 방 만들기</button>
        </div>

        <div className={styles.roomList}>
          {dummyRooms.map((room) => (
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
