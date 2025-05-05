import React, { useEffect, useState } from "react";
import styles from "./TimerBox.module.css";

const TimerBox = ({ createdAt, focusMinute, breakMinute }) => {
  const [phase, setPhase] = useState("FOCUS");
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const created = new Date(createdAt);
    const focusSec = focusMinute * 60;
    const breakSec = breakMinute * 60;
    const cycle = focusSec + breakSec;

    const update = () => {
      const now = new Date();
      const elapsed = Math.floor((now - created) / 1000);
      const cyclePos = elapsed % cycle;

      const isFocus = cyclePos < focusSec;
      const remaining = isFocus ? focusSec - cyclePos : breakSec - (cyclePos - focusSec);
      setPhase(isFocus ? "FOCUS" : "BREAK");
      setTimeLeft(remaining);
    };

    update(); // 초기 실행
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [createdAt, focusMinute, breakMinute]);

  const format = (sec) =>
    `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;

  return (
    <div className={`${styles.timerBox} ${phase === "BREAK" ? styles.break : ""}`}>
      {phase === "FOCUS" ? "🟠 집중 중" : "🔵 휴식 중"}&nbsp;{format(timeLeft)}
    </div>
  );
};

export default React.memo(TimerBox);
