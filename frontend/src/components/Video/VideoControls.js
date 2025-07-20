import React, { useState, useRef, useEffect } from "react";
import { FaVideo, FaVideoSlash, FaSignOutAlt, FaMusic, FaPlay, FaPause } from "react-icons/fa";
import { VscChecklist } from "react-icons/vsc";
import { apiGet, apiPatch } from "../../utils/api";
import CustomCheckbox from "../common/CustomCheckBox";
import PopupBox from "../common/PopupBox";
import styles from "./VideoControls.module.css";

const VideoControls = ({ isVideoOn, toggleVideo, handleExit }) => {
  const BASE_URL = process.env.REACT_APP_BGM_BASE_URL;

  const [isTodoOpen, setIsTodoOpen] = useState(false);
  const [isBgmOpen, setIsBgmOpen] = useState(false);
  const [currentBgm, setCurrentBgm] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio());
  const [plans, setPlans] = useState([]);

  const bgms = [
    {
      name: "비BGM",
      url: `${BASE_URL}/bgm/rain.mp3`,
    },
    {
      name: "장작BGM",
      url: `${BASE_URL}/bgm/fire.mp3`,
    },
  ];

  useEffect(() => {
    const fetchTodayPlans = async () => {
      const today = new Date().toISOString().slice(0, 10);
      try {
        const res = await apiGet(`/plans?date=${today}`);
        setPlans(res);
        return res;
      } catch (e) {
        console.error("오늘의 플랜 불러오기 실패", e);
        return [];
      }
    };
    fetchTodayPlans();
  }, []);

  const togglePlanCompletion = async (planId, plan) => {
    try {
      await apiPatch(`/plans/${planId}`, {
        content: plan.content,
        planDate: plan.planDate,
        priority: plan.priority,
        isCompleted: !plan.isCompleted,
      });
    } catch (e) {
      console.error("플랜 완료 여부 수정 실패", e);
    }
  };

  const handleCheck = (planId) => {
    const plan = plans.find((p) => p.id === planId);
    if (!plan) return;

    togglePlanCompletion(planId, plan).then(() => {
      setPlans((prev) =>
        prev.map((p) => (p.id === planId ? { ...p, isCompleted: !p.isCompleted } : p))
      );
    });
  };

  const handleSelectBgm = (bgm) => {
    audioRef.current.pause();
    audioRef.current.src = bgm.url;
    audioRef.current.loop = true;
    audioRef.current.play();
    setCurrentBgm(bgm);
    setIsPlaying(true);
    setIsBgmOpen(false);
  };

  const togglePlayPause = () => {
    if (!audioRef.current.src) return;
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleExitWithAudioStop = () => {
    audioRef.current.pause();
    audioRef.current.src = "";
    handleExit();
  };

  return (
    <div className={styles.videoControls}>
      <div className={styles.leftSection}>
        <div className={styles.planerWrapper}>
          <button
            className={styles.iconButton}
            title="오늘 플래너 열기"
            onClick={() => setIsTodoOpen(!isTodoOpen)}
          >
            <VscChecklist />
            {isTodoOpen && (
              <PopupBox title="오늘의 계획" onClose={() => setIsTodoOpen(false)}>
                <ul className={styles.todoList}>
                  {plans.map((plan) => (
                    <li
                      key={plan.id}
                      className={`${styles.todoItem} ${plan.isCompleted ? styles.completed : ""}`}
                    >
                      <CustomCheckbox
                        checked={plan.isCompleted}
                        onChange={() => handleCheck(plan.id)}
                      />
                      <span>{plan.content}</span>
                    </li>
                  ))}
                </ul>
              </PopupBox>
            )}
          </button>
        </div>
        <div className={styles.bgmWrapper}>
          <button
            className={styles.iconButton}
            title="브금 선택"
            onClick={() => setIsBgmOpen(!isBgmOpen)}
          >
            <FaMusic />
            {isBgmOpen && (
              <PopupBox title="Bgm 목록" onClose={() => setIsBgmOpen(false)}>
                {bgms.map((bgm) => (
                  <div key={bgm.name} className={styles.bgmRow}>
                    <span className={styles.bgmName}>{bgm.name}</span>
                    <button
                      className={styles.playButton}
                      onClick={() => handleSelectBgm(bgm)}
                      title="재생"
                    >
                      <FaPlay />
                    </button>
                  </div>
                ))}
              </PopupBox>
            )}
          </button>

          {currentBgm && (
            <div className={styles.bgmStatusBox}>
              <div className={styles.bgmInfo}>🎵 {currentBgm.name}</div>
              <div className={styles.bgmControls}>
                <button
                  className={styles.bgmControlButton}
                  title={isPlaying ? "일시정지" : "재생"}
                  onClick={togglePlayPause}
                >
                  {isPlaying ? <FaPause /> : <FaPlay />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  defaultValue="1"
                  onChange={(e) => {
                    audioRef.current.volume = parseFloat(e.target.value);
                  }}
                  className={styles.volumeSlider}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={styles.rightSection}>
        <button className={styles.iconButton} title="비디오 토글" onClick={toggleVideo}>
          {isVideoOn ? <FaVideo /> : <FaVideoSlash />}
        </button>
        <button
          className={styles.iconButtonExit}
          title="방 나가기"
          onClick={handleExitWithAudioStop}
        >
          <FaSignOutAlt />
        </button>
      </div>
    </div>
  );
};

export default VideoControls;
