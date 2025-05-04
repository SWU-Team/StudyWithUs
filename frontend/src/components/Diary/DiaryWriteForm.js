import React, { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import styles from "./DiaryWriteForm.module.css";
import confetti from "canvas-confetti";
import { apiGet, apiPost, extractErrorInfo } from "../../utils/api";
import { formatMinutes, formatDateWithDayKorean } from "../../utils/format";
import { scoreDescriptions } from "../../constants/diary";
import Modal from "../Modal";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function DiaryWrite({ onClose, onSuccess }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [aiFeedback, setAiFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [selfScore, setSelfScore] = useState(null);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const inputRef = useRef();
  const [studyMinutes, setStudyMinutes] = useState(0);

  useEffect(() => {
    fetchStudyMinutes(selectedDate);
  }, [selectedDate]);

  const fetchStudyMinutes = async (date) => {
    try {
      const res = await apiGet(`/study-times?date=${date}`);
      setStudyMinutes(res.totalMinutes);
    } catch (e) {
      setStudyMinutes(0);
    }
  };

  const handleOverlayClick = (e) => {
    // 모달 내용이 아닌 바깥 영역 클릭했을 때만 onClose 실행
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handlePreSubmit = async () => {
    if (!title.trim()) {
      toast.error("제목을 입력해주세요.");
      return;
    }

    const html = content.trim();
    if (!html) {
      toast.error("내용을 입력해주세요.");
      return;
    }

    setShowScoreModal(true);
  };

  const submitDiary = async () => {
    if (!selfScore) {
      toast.error("성취도를 선택해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      const html = content.trim();
      const res = await apiPost("/diaries", {
        title: title.trim(),
        content: html,
        diaryDate: selectedDate,
        score: selfScore,
      });

      setAiFeedback(res.feedback);
      toast.success("✨ 일기 저장 완료! 오늘도 수고했어요");
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        scalar: 1.2,
      });
      setShowFeedbackModal(true);
    } catch (e) {
      const status = extractErrorInfo(e).status;
      if (status === 409) {
        toast.error("이미 작성한 일기입니다.");
      }
    } finally {
      setIsSubmitting(false);
      setShowScoreModal(false);
    }
  };
  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.container}>
        <button className={styles.closeBtn} onClick={onClose}>
          ✖
        </button>

        <h2 className={styles.pageTitle}>📝 오늘의 일기</h2>
        <div className={styles.meta}>
          <div className={styles.studyStat}>⏳ 오늘 공부한 시간: {formatMinutes(studyMinutes)}</div>
          <div className={styles.dateWrapper} onClick={() => inputRef.current?.showPicker()}>
            <span className={styles.dateText}>{formatDateWithDayKorean(selectedDate)}</span>
            <input
              ref={inputRef}
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className={styles.datePicker}
              max={new Date().toISOString().slice(0, 10)}
            />
          </div>
        </div>
        <label className={styles.editorLabel}>오늘의 제목</label>
        <input
          type="text"
          className={styles.titleInput}
          placeholder="한 문장으로 오늘을 표현해보세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <p className={styles.editorLabel}>오늘의 일기 내용</p>
        <ReactQuill
          value={content}
          onChange={setContent}
          placeholder="오늘의 일기를 작성해보세요..."
          theme="snow"
        />
        <div className={styles.bottomSection}>
          <button onClick={handlePreSubmit} disabled={isSubmitting} className={styles.button}>
            {isSubmitting ? "저장 완료" : "저장하고 피드백 받기"}
          </button>
        </div>
      </div>
      {aiFeedback && showFeedbackModal && (
        <Modal
          isOpen={showFeedbackModal}
          onClose={() => {
            setShowFeedbackModal(false);
            onClose();
            onSuccess();
          }}
          title="🤖 AI 피드백"
          content={aiFeedback}
          confirmText="확인"
          onConfirm={() => {
            setShowFeedbackModal(false);
            onClose();
            onSuccess();
          }}
        ></Modal>
      )}
      <Modal
        isOpen={showScoreModal}
        onClose={() => setShowScoreModal(false)}
        title="오늘의 성취도"
        content="하루를 돌아보며, 스스로에게 점수를 매겨보세요."
        confirmText="저장"
        onConfirm={submitDiary}
      >
        <div className={styles.starRow}>
          {[1, 2, 3, 4, 5].map((score) => (
            <span
              key={score}
              className={`${styles.star} ${selfScore >= score ? styles.active : ""}`}
              onClick={() => setSelfScore(score)}
            >
              ★
            </span>
          ))}
        </div>
        {selfScore && <div className={styles.scoreDescription}>{scoreDescriptions[selfScore]}</div>}
      </Modal>
    </div>
  );
}

export default DiaryWrite;
