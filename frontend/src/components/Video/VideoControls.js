import React, { useState, useRef, useEffect } from "react";
import { FaVideo, FaVideoSlash, FaSignOutAlt, FaMusic, FaPlay, FaPause } from "react-icons/fa";
import { apiGet, apiPatch } from "../../utils/api";
import PopupBox from "../common/PopupBox";
import styles from "./VideoControls.module.css";

const VideoControls = ({ isVideoOn, toggleVideo, handleExit }) => {
  const BASE_URL = process.env.REACT_APP_BGM_BASE_URL;

  const [isBgmOpen, setIsBgmOpen] = useState(false);
  const [currentBgm, setCurrentBgm] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio());

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

  return (
    <div className={styles.videoControls}>
      <div className={styles.leftSection}>
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
        <button className={styles.iconButtonExit} title="방 나가기" onClick={handleExit}>
          <FaSignOutAlt />
        </button>
      </div>
    </div>
  );
};

export default VideoControls;
