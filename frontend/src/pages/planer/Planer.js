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
  const [sortBy, setSortBy] = useState("priority");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
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
    const newGoal = { id: Date.now(), text: input, done: false, priority: priority || "" };
    setGoals((prev) => ({
      ...prev,
      [selectedDateKey]: [...(prev[selectedDateKey] || []), newGoal],
    }));
    setInput("");
    setPriority("");
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

  const handleToggleLongTerm = (goalId, dueDate) => {
    // longTermGoals 안에 있는 목표인지 확인
    const existsInLongTerm = longTermGoals.some((g) => g.id === goalId);

    if (existsInLongTerm) {
      setLongTermGoals((prev) => prev.map((g) => (g.id === goalId ? { ...g, done: !g.done } : g)));
    } else {
      // 미래 날짜 단기 목표인 경우
      setGoals((prev) => {
        const updatedList = (prev[dueDate] || []).map((g) =>
          g.id === goalId ? { ...g, done: !g.done } : g
        );
        return { ...prev, [dueDate]: updatedList };
      });
    }
  };

  const handleDeleteLongTerm = (goalId, dueDate) => {
    const existsInLongTerm = longTermGoals.some((g) => g.id === goalId);

    if (existsInLongTerm) {
      // longTermGoals에서 삭제
      setLongTermGoals((prev) => prev.filter((g) => g.id !== goalId));
    } else {
      // 미래 단기 목표(goals[날짜])에서 삭제
      setGoals((prev) => {
        const updatedList = (prev[dueDate] || []).filter((g) => g.id !== goalId);
        return { ...prev, [dueDate]: updatedList };
      });
    }
  };

  const handleEditLongTerm = (goalId, newText) => {
    setLongTermGoals((prev) => prev.map((g) => (g.id === goalId ? { ...g, text: newText } : g)));
  };

  const formatDateTitle = () => {
    if (selectedDateKey === todayKey) return "오늘의 목표";
    return `${selectedDateKey} 목표`;
  };

  const [priority, setPriority] = useState("");
  const todayGoals = goals[selectedDateKey] || [];
  const totalGoals = todayGoals.length;
  const completedGoals = todayGoals.filter((goal) => goal.done).length;
  const progressPercentage = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;
  const priorityOrder = { high: 0, medium: 1, low: 2, "": 3 };

  const sortedTodayGoals = [...todayGoals].sort((a, b) => {
    // 완료 여부 먼저 비교
    if (a.done !== b.done) return a.done ? 1 : -1;
    // 완료 상태가 같다면 중요도 비교
    return priorityOrder[a.priority || ""] - priorityOrder[b.priority || ""];
  });

  const baseToday = new Date();
  baseToday.setHours(0, 0, 0, 0);
  const selectedDate = new Date(date);
  selectedDate.setHours(0, 0, 0, 0);

  const filteredLongTermGoals = [
    // 기존 장기 목표
    ...longTermGoals,
    // 날짜가 미래인 단기 목표도 포함
    ...Object.entries(goals)
      .filter(([dateKey]) => {
        const targetDate = new Date(dateKey.replace(/-/g, "/"));
        targetDate.setHours(0, 0, 0, 0);
        return targetDate >= baseToday; // 오늘보다 미래
      })
      .flatMap(([dateKey, goalList]) =>
        goalList.map((goal) => ({
          ...goal,
          dueDate: dateKey,
        }))
      ),
  ].filter((goal) => {
    const due = new Date(goal.dueDate.replace(/-/g, "/"));
    due.setHours(0, 0, 0, 0);
    return due >= selectedDate; // 선택한 날짜 이후에 있는 것만 보여줌
  });

  const sortedLongTermGoals = [...filteredLongTermGoals].sort((a, b) => {
    // 완료 여부 먼저 비교
    if (a.done !== b.done) return a.done ? 1 : -1;

    // 정렬 기준
    if (sortBy === "priority") {
      return priorityOrder[a.priority || ""] - priorityOrder[b.priority || ""];
    } else if (sortBy === "date") {
      const aDate = new Date(a.dueDate.replace(/-/g, "/"));
      const bDate = new Date(b.dueDate.replace(/-/g, "/"));
      return aDate - bDate;
    }
    return 0;
  });
  const allGoalsWithDueDate = [
    ...longTermGoals,
    ...Object.entries(goals).flatMap(([dateKey, goalList]) =>
      goalList.map((goal) => ({
        ...goal,
        dueDate: dateKey,
      }))
    ),
  ];

  const monthlyGoals = allGoalsWithDueDate.filter((goal) => {
    const due = new Date(goal.dueDate.replace(/-/g, "/"));
    return due.getFullYear() === selectedYear && due.getMonth() + 1 === selectedMonth;
  });
  const completedMonthlyGoals = monthlyGoals.filter((goal) => goal.done).length;
  const monthlyProgressPercentage =
    monthlyGoals.length > 0 ? (completedMonthlyGoals / monthlyGoals.length) * 100 : 0;

  const totalLongTermGoals = filteredLongTermGoals.length;
  const completedLongTermGoals = filteredLongTermGoals.filter((goal) => goal.done).length;
  const longTermProgressPercentage =
    totalLongTermGoals > 0 ? (completedLongTermGoals / totalLongTermGoals) * 100 : 0;
  const sortedMonthlyGoals = [...monthlyGoals].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    // 필요하면 여기에 중요도, 날짜 정렬 추가
    return 0;
  });

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
              {sortedTodayGoals.map((goal) => (
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

                  {/* ✅ 중요도 아이콘 */}
                  <span className={`${styles.priorityBadge} ${styles[goal.priority]}`}>
                    {goal.priority === "high" && "🔥"}
                    {goal.priority === "medium" && "⚡"}
                    {goal.priority === "low" && "🌱"}
                  </span>

                  <button className={styles.deleteButton} onClick={() => handleDelete(goal.id)}>
                    X
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
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={styles.select}
              >
                <option value="">중요도 없음</option>
                <option value="high">상</option>
                <option value="medium">중</option>
                <option value="low">하</option>
              </select>
              <button className={styles.addButton} onClick={handleAddGoal}>
                +
              </button>
            </div>
          </div>
        </div>

        <div className={styles.longGoalsBox}>
          {/* <div className={styles.longTermGoalsSection}> */}
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>예정된 목표</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.select}
            >
              <option value="priority">중요도 순</option>
              <option value="date">날짜 순</option>
            </select>
          </div>

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
            {sortedLongTermGoals.map((goal) => (
              <div key={goal.id} className={styles.longTermGoalItemHorizontal}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={goal.done}
                  onChange={() => handleToggleLongTerm(goal.id, goal.dueDate)}
                />
                <input
                  type="text"
                  className={`${styles.goalText} ${goal.done ? styles.done : ""}`}
                  value={goal.text}
                  onChange={(e) => handleEditLongTerm(goal.id, e.target.value)}
                />
                {/* ✅ 중요도 아이콘 */}
                <span className={`${styles.priorityBadge} ${styles[goal.priority]}`}>
                  {goal.priority === "high" && "🔥"}
                  {goal.priority === "medium" && "⚡"}
                  {goal.priority === "low" && "🌱"}
                </span>
                <span className={styles.dueDate}>마감: {goal.dueDate}</span>
                <button
                  className={styles.smalldeleteButton}
                  onClick={() => handleDeleteLongTerm(goal.id, goal.dueDate)}
                >
                  X
                </button>
              </div>
            ))}
          </div>
          {/* </div> */}
        </div>
        <div className={styles.monthlyGoalsSection}>
          <h3 className={styles.sectionTitle}>📅 이번 달 전체 목표</h3>

          {/* ✅ 진행률 표시 */}
          {monthlyGoals.length > 0 ? (
            <div className={styles.monthprogressStickyWrapper}>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${monthlyProgressPercentage}%` }}
                />
              </div>
              <div className={styles.progressText}>
                <span>진행 상황</span>
                <span>
                  {completedMonthlyGoals}/{monthlyGoals.length} 완료
                </span>
              </div>
            </div>
          ) : (
            <p className={styles.noGoalsText}>해당 월에 등록된 목표가 없습니다 🗓️</p>
          )}

          {/* ✅ 월 선택 UI */}
          <div className={styles.monthSelector}>
            <label>
              연도:
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                {[2023, 2024, 2025, 2026].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </label>
            <label>
              월:
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <option key={month} value={month}>
                    {month}월
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* ✅ 목표 리스트 */}
          <div className={styles.goalList}>
            {sortedMonthlyGoals.map((goal) => (
              <div key={goal.id} className={styles.goalItem}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={goal.done}
                  onChange={() => {
                    if (longTermGoals.some((g) => g.id === goal.id)) {
                      handleToggleLongTerm(goal.id, goal.dueDate);
                    } else {
                      handleToggle(goal.id);
                    }
                  }}
                />
                <span className={`${styles.goalText} ${goal.done ? styles.done : ""}`}>
                  {goal.text}
                </span>
                <span className={styles.dueDate}>마감: {goal.dueDate}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Planner;
