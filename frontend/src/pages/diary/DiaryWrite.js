import React, { useRef, useState } from "react";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import { toast } from "react-toastify";
import styles from "./DiaryWrite.module.css";
import confetti from "canvas-confetti";
import { apiPost, extractErrorInfo } from "../../utils/api";
import Modal from "../../components/Modal";

function DiaryWrite() {
  const editorRef = useRef();
  const [title, setTitle] = useState("");
  const [aiFeedback, setAiFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [selfScore, setSelfScore] = useState(null);
  const [showScoreModal, setShowScoreModal] = useState(false);

  const scoreDescriptions = {
    5: "완벽하게 집중했어요",
    4: "꽤 만족스러운 하루였어요",
    3: "그냥 평범했어요",
    2: "집중이 잘 안 됐어요",
    1: "거의 못 했어요",
  };

  const handlePreSubmit = async () => {
    const editorInstance = editorRef.current.getInstance();
    const markdown = editorInstance.getMarkdown();

    if (!title.trim()) {
      toast.error("제목을 입력해주세요.");
      return;
    }

    if (!markdown.trim()) {
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
      const markdown = editorRef.current.getInstance().getMarkdown();
      const res = await apiPost("/diaries", {
        title: title.trim(),
        content: markdown.trim(),
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
    <>
      <div className={styles.root}>
        <div className={styles.container}>
          <h2 className={styles.pageTitle}>📝 오늘의 일기</h2>
          <div className={styles.meta}>
            <div className={styles.studyStat}>⏳ 오늘 공부한 시간: 3시간 25분</div>
            <div className={styles.date}>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className={styles.datePicker}
                max={new Date().toISOString().slice(0, 10)} // 미래 선택 방지
              />
            </div>
          </div>
          <label className={styles.titleLabel}>오늘의 제목</label>
          <input
            type="text"
            className={styles.titleInput}
            placeholder="한 문장으로 오늘을 표현해보세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <p className={styles.editorLabel}>오늘의 일기 내용</p>
          <div className={styles.editorWrapper}>
            <Editor
              ref={editorRef}
              height="100%"
              initialEditType="wysiwyg"
              hideModeSwitch={true}
              language="ko"
            />
          </div>

          <div className={styles.bottomSection}>
            <button onClick={handlePreSubmit} disabled={isSubmitting} className={styles.button}>
              {isSubmitting ? "저장 완료" : "저장하고 피드백 받기"}
            </button>
          </div>
        </div>
      </div>
      {aiFeedback && showFeedbackModal && (
        <Modal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          title="🤖 AI 피드백"
          content={aiFeedback}
          confirmText="확인"
          onConfirm={() => setShowFeedbackModal(false)}
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
    </>
  );
}

export default DiaryWrite;
