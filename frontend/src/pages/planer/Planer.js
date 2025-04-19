import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "./Planer.module.css";

function Planner() {
  const [date, setDate] = useState(new Date());
  const [goals, setGoals] = useState({});
  const [input, setInput] = useState("");

  const selectedDateKey = date.toISOString().split("T")[0];
  const todayKey = new Date().toISOString().split("T")[0];

  const handleAddGoal = () => {
    if (!input.trim()) return;
    const newGoal = {
      id: Date.now(),
      text: input,
      done: false,
    };
    setGoals((prev) => ({
      ...prev,
      [selectedDateKey]: [...(prev[selectedDateKey] || []), newGoal],
    }));
    setInput("");
  };

  const handleToggle = (goalId) => {
    const updated = goals[selectedDateKey].map((g) =>
      g.id === goalId ? { ...g, done: !g.done } : g
    );
    setGoals((prev) => ({ ...prev, [selectedDateKey]: updated }));
  };

  const handleDelete = (goalId) => {
    const updated = goals[selectedDateKey].filter((g) => g.id !== goalId);
    setGoals((prev) => ({ ...prev, [selectedDateKey]: updated }));
  };

  const handleEdit = (goalId, newText) => {
    const updated = goals[selectedDateKey].map((g) =>
      g.id === goalId ? { ...g, text: newText } : g
    );
    setGoals((prev) => ({ ...prev, [selectedDateKey]: updated }));
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>📆 플래너</h2>
      <Calendar onChange={setDate} value={date} className={styles.calendar} />
      <div className={styles.goalSection}>
        <h3>{selectedDateKey === todayKey ? "오늘의 목표" : `${selectedDateKey} 목표`}</h3>
        <div className={styles.goalList}>
          {(goals[selectedDateKey] || []).map((goal) => (
            <div key={goal.id} className={styles.goalItem}>
              <input type="checkbox" checked={goal.done} onChange={() => handleToggle(goal.id)} />
              <input
                className={goal.done ? styles.done : ""}
                value={goal.text}
                onChange={(e) => handleEdit(goal.id, e.target.value)}
              />
              <button onClick={() => handleDelete(goal.id)}>삭제</button>
            </div>
          ))}
        </div>
        <div className={styles.inputBox}>
          <input
            type="text"
            placeholder="새 목표 입력"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={handleAddGoal}>추가</button>
        </div>
      </div>
    </div>
  );
}

export default Planner;
