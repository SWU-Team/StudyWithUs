import React, { useState, useEffect } from "react";
import styles from "./DiaryList.module.css";
import { apiGet } from "../../utils/api";
import { formatMinutes, formatDate, formatMonthKorean } from "../../utils/format";
import { toast } from "react-toastify";
import DiaryWriteForm from "../../components/Diary/DiaryWriteForm";

const DiaryListPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [diaries, setDiaries] = useState([]);
  const [isWriting, setIsWriting] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const selectedMonthText = formatMonthKorean(selectedMonth);
  const [selectedDiary, setSelectedDiary] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchDiaries(selectedMonth);
  }, [selectedMonth]);

  const fetchDiaries = async (month) => {
    try {
      setIsLoading(true);
      const data = await apiGet(`/diaries?month=${month}`);
      setDiaries(data);
    } catch (error) {
      console.error("일기 목록 가져오기 실패: ", error);
      toast.error("일기 목록을 가져오는 데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const stripHtml = (html) => {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || "";
  };

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.toolbarWrapper}>
          <div className={styles.toolBarLeft}>
            <div className={styles.monthTitle}>🗓️ {selectedMonthText}의 다이어리</div>
            <div className={styles.diaryCount}>📚 총 {diaries.length}개의 일기가 있습니다.</div>
          </div>
          <div className={styles.toolBarRight}>
            <input
              id="month"
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
            <button className={styles.writeButton} onClick={() => setIsWriting(true)}>
              ✍️ 일기 작성
            </button>
          </div>
        </div>

        <div className={styles.container}>
          {diaries.map((diary) => (
            <div key={diary.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.date}>{formatDate(diary.diaryDate)}</div>
                <div className={styles.title}>{diary.title}</div>
              </div>
              <div className={styles.info}>
                <span>⏱ {formatMinutes(diary.studyMinutes)}</span>
                <span className={styles.score}>
                  {"★".repeat(diary.score) + "☆".repeat(5 - diary.score)}
                </span>
              </div>
              <div className={styles.content}>{stripHtml(diary.content)}</div>
              <button
                className={styles.detailBtn}
                onClick={() => {
                  setSelectedDiary(diary);
                  setShowDetailModal(true);
                }}
              >
                자세히 보기
              </button>
            </div>
          ))}
          {diaries.length === 0 && !isLoading && (
            <div className={styles.empty}>해당 월에는 작성된 일기가 없습니다.</div>
          )}
        </div>
      </div>
      {isWriting && (
        <DiaryWriteForm
          onClose={() => setIsWriting(false)}
          onSuccess={() => {
            fetchDiaries(selectedMonth);
            setIsWriting(false);
          }}
        />
      )}

      {showDetailModal && selectedDiary && (
        <div className={styles.overlay} onClick={() => setShowDetailModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setShowDetailModal(false)}>
              ✖
            </button>
            <div className={styles.bigTitle}>{selectedDiary.title}</div>

            <div className={styles.metaLine}>
              {formatDate(selectedDiary.diaryDate)} · {formatMinutes(selectedDiary.studyMinutes)} ·
              <span className={styles.score}>
                {"★".repeat(selectedDiary.score) + "☆".repeat(5 - selectedDiary.score)}
              </span>
            </div>

            <div className={styles.diaryBlock}>
              <div className={styles.label}>📖 일기 내용</div>
              <div
                className={styles.diaryText}
                dangerouslySetInnerHTML={{ __html: selectedDiary.content }}
              />
            </div>

            {selectedDiary.feedback && (
              <div className={styles.diaryBlock}>
                <div className={styles.label}>🤖 AI 피드백</div>
                <div className={styles.diaryText}>{selectedDiary.feedback}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DiaryListPage;
