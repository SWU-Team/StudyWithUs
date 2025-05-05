import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "./Planer.module.css";

function Planner() {
  const [date, setDate] = useState(new Date());
  const [goals, setGoals] = useState({});
  const [longTermGoals, setLongTermGoals] = useState([]);
  const [input, setInput] = useState("");
  const [longTermInput, setLongTermInput] = useState("");
  const [dueDateInput, setDueDateInput] = useState("");

  useEffect(() => {
    const storedGoals = localStorage.getItem("planner-goals");
    if (storedGoals) {
      try {
        setGoals(JSON.parse(storedGoals));
      } catch (error) {
        console.error("Failed to parse stored goals:", error);
      }
    }

    const storedLongTermGoals = localStorage.getItem("planner-long-term-goals");
    if (storedLongTermGoals) {
      try {
        setLongTermGoals(JSON.parse(storedLongTermGoals));
      } catch (error) {
        console.error("Failed to parse stored long term goals:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("planner-goals", JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem("planner-long-term-goals", JSON.stringify(longTermGoals));
  }, [longTermGoals]);

  const selectedDateKey = date
    .toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })
    .replace(/\./g, "-")
    .replace(/ /g, "");
  const todayKey = new Date()
    .toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })
    .replace(/\./g, "-")
    .replace(/ /g, "");

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  const handleAddGoal = () => {
    if (!input.trim()) return;
    const newGoal = { id: Date.now(), text: input, done: false };
    setGoals((prev) => ({
      ...prev,
      [selectedDateKey]: [...(prev[selectedDateKey] || []), newGoal],
    }));
    setInput("");
  };

  const handleToggle = (goalId) => {
    const currentGoals = goals[selectedDateKey] || [];
    const updated = currentGoals.map((g) => (g.id === goalId ? { ...g, done: !g.done } : g));
    setGoals((prev) => ({ ...prev, [selectedDateKey]: updated }));
  };

  const handleDelete = (goalId) => {
    const currentGoals = goals[selectedDateKey] || [];
    const updated = currentGoals.filter((g) => g.id !== goalId);
    setGoals((prev) => ({ ...prev, [selectedDateKey]: updated }));
  };

  const handleEdit = (goalId, newText) => {
    const currentGoals = goals[selectedDateKey] || [];
    const updated = currentGoals.map((g) => (g.id === goalId ? { ...g, text: newText } : g));
    setGoals((prev) => ({ ...prev, [selectedDateKey]: updated }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddGoal();
    }
  };

  const handleAddLongTermGoal = () => {
    if (!longTermInput.trim() || !dueDateInput) return;
    const newLongTermGoal = {
      id: Date.now(),
      text: longTermInput,
      done: false,
      dueDate: dueDateInput,
    };
    setLongTermGoals((prev) => [...prev, newLongTermGoal]);
    setLongTermInput("");
    setDueDateInput("");
  };

  const handleLongTermKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddLongTermGoal();
    }
  };

  const handleToggleLongTerm = (goalId) => {
    setLongTermGoals((prev) => prev.map((g) => (g.id === goalId ? { ...g, done: !g.done } : g)));
  };

  const handleDeleteLongTerm = (goalId) => {
    setLongTermGoals((prev) => prev.filter((g) => g.id !== goalId));
  };

  const handleEditLongTerm = (goalId, newText) => {
    setLongTermGoals((prev) => prev.map((g) => (g.id === goalId ? { ...g, text: newText } : g)));
  };

  const formatDateTitle = () => {
    if (selectedDateKey === todayKey) return "오늘의 목표";
    return `${selectedDateKey} 목표`;
  };

  const todayGoals = goals[selectedDateKey] || [];
  const totalGoals = todayGoals.length;
  const completedGoals = todayGoals.filter((goal) => goal.done).length;
  const progressPercentage = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  const baseToday = new Date();
  baseToday.setHours(0, 0, 0, 0);
  const selectedDate = new Date(date);
  selectedDate.setHours(0, 0, 0, 0);

  const filteredLongTermGoals = longTermGoals.filter((goal) => {
    const due = new Date(goal.dueDate);
    due.setHours(0, 0, 0, 0);
    return due >= selectedDate;
  });

  const totalLongTermGoals = filteredLongTermGoals.length;
  const completedLongTermGoals = filteredLongTermGoals.filter((goal) => goal.done).length;
  const longTermProgressPercentage =
    totalLongTermGoals > 0 ? (completedLongTermGoals / totalLongTermGoals) * 100 : 0;

  return (
    <div className={styles.wrapper}>
      <div className={styles.plantoday}>
        <div className={styles.calendarContainer}>
          <h2 className={styles.title}>📆 플래너</h2>
          <Calendar
            onChange={handleDateChange}
            value={date}
            className={styles.calendar}
            locale="ko-KR"
            calendarType="US"
          />
        </div>

        <div className={styles.goalsContainer}>
          <div className={styles.dailyGoalsBox}>
            <h3 className={styles.sectionTitle}>{formatDateTitle()}</h3>

            {totalGoals > 0 ? (
              <div className={styles.progressStickyWrapper}>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className={styles.progressText}>
                  <span>진행 상황</span>
                  <span>
                    {completedGoals}/{totalGoals} 완료
                  </span>
                </div>
              </div>
            ) : (
              <p className={styles.noGoalsText}>
                선택한 날짜에 목표가 없습니다. 목표를 추가해주세요 😊
              </p>
            )}

            <div className={styles.goalList}>
              {todayGoals.map((goal) => (
                <div key={goal.id} className={styles.goalItem}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={goal.done}
                    onChange={() => handleToggle(goal.id)}
                  />
                  <input
                    type="text"
                    className={`${styles.goalText} ${goal.done ? styles.done : ""}`}
                    value={goal.text}
                    onChange={(e) => handleEdit(goal.id, e.target.value)}
                  />
                  <button className={styles.deleteButton} onClick={() => handleDelete(goal.id)}>
                    삭제
                  </button>
                </div>
              ))}
            </div>
            <div className={styles.inputBox}>
              <input
                type="text"
                placeholder="새 목표 입력"
                className={styles.input}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button className={styles.addButton} onClick={handleAddGoal}>
                추가
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.longGoalsBox}>
        <h3 className={styles.sectionTitle}>장기 목표</h3>
        {totalLongTermGoals > 0 ? (
          <>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${longTermProgressPercentage}%` }}
              />
            </div>
            <div className={styles.progressText}>
              <span>진행 상황</span>
              <span>
                {completedLongTermGoals}/{totalLongTermGoals} 완료
              </span>
            </div>
          </>
        ) : (
          <p className={styles.noGoalsText}>
            아직 등록된 장기 목표가 없습니다. 목표를 추가해주세요 🎯
          </p>
        )}
        <div className={styles.longTermGoalListHorizontal}>
          {filteredLongTermGoals.map((goal) => (
            <div key={goal.id} className={styles.longTermGoalItemHorizontal}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={goal.done}
                onChange={() => handleToggleLongTerm(goal.id)}
              />
              <input
                type="text"
                className={`${styles.goalText} ${goal.done ? styles.done : ""}`}
                value={goal.text}
                onChange={(e) => handleEditLongTerm(goal.id, e.target.value)}
              />
              <span className={styles.dueDate}>마감: {goal.dueDate}</span>
              <button className={styles.deleteButton} onClick={() => handleDeleteLongTerm(goal.id)}>
                삭제
              </button>
            </div>
          ))}
        </div>
        <div className={styles.inputBoxHorizontal}>
          <input
            type="text"
            placeholder="새 장기 목표 입력"
            className={styles.input}
            value={longTermInput}
            onChange={(e) => setLongTermInput(e.target.value)}
            onKeyDown={handleLongTermKeyDown}
          />
          <input
            type="date"
            className={styles.dateInput}
            value={dueDateInput}
            onChange={(e) => setDueDateInput(e.target.value)}
          />
          <button className={styles.addButton} onClick={handleAddLongTermGoal}>
            추가
          </button>
        </div>
      </div>
    </div>
  );
}

export default Planner;
