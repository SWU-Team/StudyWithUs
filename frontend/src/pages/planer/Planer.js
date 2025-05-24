import React, { useState, useEffect, useMemo } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "./Planer.module.css";
import { apiGet, apiPost, apiPatch, apiDelete, extractErrorInfo } from "../../utils/api";
import { toast } from "react-toastify";

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
  const [priority, setPriority] = useState("");
  const [editingTexts, setEditingTexts] = useState({});
const [isComposing, setIsComposing] = useState(false);

  const selectedDateKey = useMemo(() => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, [date]);
  const todayKey = (() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  })();
  useEffect(() => {

    const storedLongTermGoals = localStorage.getItem("planner-long-term-goals");
    if (storedLongTermGoals) {
      try {
        setLongTermGoals(JSON.parse(storedLongTermGoals));
      } catch (error) {
        console.error("Failed to parse stored long term goals:", error);
      }
    }

    apiGet(`/plans?date=${selectedDateKey}`)
    .then((res) => {
      setGoals((prev) => ({
        ...prev,
        [selectedDateKey]: res,
      }));
    })
    .catch((err) => {
      const { message } = extractErrorInfo(err);
      toast.error(`목표 불러오기 실패: ${message}`);
    });
}, [selectedDateKey]);

  useEffect(() => {
    localStorage.setItem("planner-goals", JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem("planner-long-term-goals", JSON.stringify(longTermGoals));
  }, [longTermGoals]);

  

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  function getKSTTodayDateString() {
  const now = new Date();

  // UTC 시간 + 9시간 → 한국 시간으로 보정
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);

  // YYYY-MM-DD 형태로 자르기
  return kst.toISOString().split("T")[0];
}
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleAddGoal = async () => {
    if (isSubmitting) return;
    if (!input.trim()) return;

  const todayKey = getKSTTodayDateString();
  if (selectedDateKey < todayKey) {
    toast.error("과거 날짜에는 목표를 등록할 수 없습니다.");
    return;
  }

  setIsSubmitting(true);

  const newGoal = {
    content: input,
    planDate: selectedDateKey,
    priority: (priority || "LOW").toUpperCase(),


    isCompleted: false,
  };

  try {
    await apiPost("/plans", newGoal);

    // 🔥 UI 즉시 반영
    const updated = await apiGet(`/plans?date=${selectedDateKey}`);
    setGoals((prev) => ({
      ...prev,
      [selectedDateKey]: updated,
    }));

    setInput("");
    setPriority("");
  } catch (err) {
    const { message } = extractErrorInfo(err);
    toast.error(`목표 추가 실패: ${message}`);
  }finally {
    setIsSubmitting(false); // 🔓
  }
};

  const handleToggle = (goalId) => {
    const currentGoals = goals[selectedDateKey] || [];
    const updated = currentGoals.map((g) => (g.id === goalId ? { ...g, isCompleted: !g.isCompleted } : g));
    setGoals((prev) => ({ ...prev, [selectedDateKey]: updated }));
  };

  const handleDelete = async (goalId) => {
    try {
      await apiDelete(`/plans/${goalId}`);
      setGoals((prev) => ({
        ...prev,
        [selectedDateKey]: (prev[selectedDateKey] || []).filter((g) => g.id !== goalId),
      }));
    } catch (err) {
      const { message } = extractErrorInfo(err);
      toast.error(`삭제 실패: ${message}`);
    }
  };

  const handleEdit = async (goalId, newText) => {
    const currentGoals = goals[selectedDateKey] || [];
    const goalToEdit = currentGoals.find((g) => g.id === goalId);

  const updatedGoal = {
    content: newText,
    planDate: goalToEdit.planDate || selectedDateKey, // 필수
    priority: (goalToEdit.priority || "LOW").toUpperCase(),
    isCompleted: goalToEdit.isCompleted,
  };

  try {
    await apiPatch(`/plans/${goalId}`, updatedGoal);
    setGoals((prev) => ({
      ...prev,
      [selectedDateKey]: prev[selectedDateKey].map((g) =>
        g.id === goalId ? { ...g, ...updatedGoal } : g
      ),
    }));
  } catch (err) {
    const { message } = extractErrorInfo(err);
    toast.error(`수정 실패: ${message}`);
  }
};

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
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
      setLongTermGoals((prev) => prev.map((g) => (g.id === goalId ? { ...g, isCompleted: !g.isCompleted} : g)));
    } else {
      // 미래 날짜 단기 목표인 경우
      setGoals((prev) => {
        const updatedList = (prev[dueDate] || []).map((g) =>
          g.id === goalId ? { ...g, isCompleted: !g.isCompleted } : g
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

  const handleEditLongTerm = async (goalId, newText) => {
    const allGoals = Object.entries(goals).flatMap(([dateKey, list]) =>
      list.map((g) => ({ ...g, dueDate: dateKey }))
    );
    const goalToEdit = allGoals.find((g) => g.id === goalId);
    const updatedGoal = {
      content: newText,
      planDate: goalToEdit.dueDate,
      priority: (goalToEdit.priority || "LOW").toUpperCase(),
      isCompleted: goalToEdit.isCompleted,
    };
  
    try {
      await apiPatch(`/plans/${goalId}`, updatedGoal);
      setGoals((prev) => {
        const updatedList = (prev[goalToEdit.dueDate] || []).map((g) =>
          g.id === goalId ? { ...g, ...updatedGoal } : g
        );
        return { ...prev, [goalToEdit.dueDate]: updatedList };
      });
    } catch (err) {
      const { message } = extractErrorInfo(err);
      toast.error(`예정된 목표 수정 실패: ${message}`);
    }
  };

  const formatDateTitle = () => {
    if (selectedDateKey === todayKey) return "오늘의 목표";
    return `${selectedDateKey} 목표`;
  };

  const todayGoals = goals[selectedDateKey] || [];
  const totalGoals = todayGoals.length;
  const completedGoals = todayGoals.filter((goal) => goal.isCompleted).length;
  const progressPercentage = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;
  const priorityOrder = {
    high: 0,
    medium: 1,
    low: 2,
    none: 3,
    "": 4,
  };

  const sortedTodayGoals = [...todayGoals].sort((a, b) => {
    // 완료 여부 먼저 비교
    if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
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
        return targetDate.getTime() >= baseToday.getTime(); // 오늘보다 미래
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
    return due.getTime() >= selectedDate.getTime(); // 선택한 날짜 이후에 있는 것만 보여줌
  });

  const sortedLongTermGoals = [...filteredLongTermGoals].sort((a, b) => {
    // 완료 여부 먼저 비교
    if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;

    // 정렬 기준
    if (sortBy === "priority") {
      return priorityOrder[a.priority?.toLowerCase() || ""] - priorityOrder[b.priority?.toLowerCase() || ""];

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
  const completedMonthlyGoals = monthlyGoals.filter((goal) => goal.isCompleted).length;
  const monthlyProgressPercentage =
    monthlyGoals.length > 0 ? (completedMonthlyGoals / monthlyGoals.length) * 100 : 0;

  const totalLongTermGoals = filteredLongTermGoals.length;
  const completedLongTermGoals = filteredLongTermGoals.filter((goal) => goal.isCompleted).length;
  const longTermProgressPercentage =
    totalLongTermGoals > 0 ? (completedLongTermGoals / totalLongTermGoals) * 100 : 0;
  const sortedMonthlyGoals = [...monthlyGoals].sort((a, b) => {
    if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
    // 필요하면 여기에 중요도, 날짜 정렬 추가
    return 0;
  });
  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear((prev) => prev - 1);
    } else {
      setSelectedMonth((prev) => prev - 1);
    }
  };
  
  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear((prev) => prev + 1);
    } else {
      setSelectedMonth((prev) => prev + 1);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.plantoday}>
        {/* 여기가 캘린더 컨테이너 */}
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
        {/* 여기는 선택한 날 목표 컨테이너 */}
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

    {/* ✅ 스크롤되는 영역만 따로 분리 */}
    <div className={styles.goalListWrapper}>
      <div className={styles.goalList}>
        {sortedTodayGoals.map((goal) => (
          <div key={goal.id} className={styles.goalItem}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={goal.isCompleted}
              onChange={() => handleToggle(goal.id)}
            />
            <input
              type="text"
              className={`${styles.goalText} ${goal.isCompleted ? styles.isCompleted : ""}`}
              value={goal.content}
              onChange={(e) => handleEdit(goal.id, e.target.value)}
            />
            <span className={`${styles.priorityTag} ${styles[goal.priority?.toLowerCase()]}`}>
              {goal.priority?.toLowerCase() === "high" && "높음"}
              {goal.priority?.toLowerCase() === "medium" && "중간"}
              {goal.priority?.toLowerCase() === "low" && "낮음"}
            </span>
            <button className={styles.deleteButton} onClick={() => handleDelete(goal.id)}>
              X
            </button>
          </div>
        ))}
      </div>
    </div>

    {/* ✅ 고정 입력창 */}
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

              {/* 여기는 예정된 목표 */}
        <div className={styles.longGoalsBox}>
          <div className={styles.positionGoalsBox}>
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
          </div>
          <div className={styles.longTermGoalListHorizontal}>
            {sortedLongTermGoals.map((goal) => (
              <div key={goal.id} className={styles.longTermGoalItemHorizontal}>
                
                <input
                  type="text"
                  className={`${styles.goalText} ${goal.isCompleted ? styles.done : ""}`}
                  value={editingTexts[goal.id] ?? goal.text ?? goal.content ?? ""}
                  onChange={(e) => {
                    const newText = e.target.value;
                    setEditingTexts((prev) => ({ ...prev, [goal.id]: newText }));

                    if (!isComposing) {
                      handleEditLongTerm(goal.id, newText);
                    }
                  }}
                  onCompositionStart={() => setIsComposing(true)}
                  onCompositionEnd={(e) => {
                    setIsComposing(false);
                    const newText = e.target.value;
                    handleEditLongTerm(goal.id, newText);
                  }}
                />

                {/* ✅ 중요도 아이콘 */}
                <span className={`${styles.priorityTag} ${goal.content?.startsWith("[없음]") ? styles.none : styles[goal.priority?.toLowerCase()]}`}>
                  {goal.content?.startsWith("[없음]") ? "없음" : (
                    goal.priority?.toLowerCase() === "high" ? "높음" :
                    goal.priority?.toLowerCase() === "medium" ? "중간" : "낮음"
                  )}
                </span>
                
                <span className={styles.dueDate}>마감: {goal.dueDate}</span>
              <div className={styles.buttonGroup}>  
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={goal.isCompleted}
                    onChange={() => handleToggleLongTerm(goal.id, goal.dueDate)}
                  />
                  <button
                    className={styles.smalldeleteButton}
                    onClick={() => handleDeleteLongTerm(goal.id, goal.dueDate)}
                  >
                    X
                  </button>
                </div>
                
              </div>
              
            ))}
          </div>
        
        </div>
        {/* 여기는 달의 목표 */}
        <div className={styles.monthlyGoalsSection}>
          {/* ✅ 월 선택 UI */}
          <div className={styles.monthSelector}>
            <button onClick={handlePrevMonth}>◀ 이전 달</button>

            <span>
            📅{selectedYear}년 {selectedMonth}월 전체 목표
            </span>

            <button onClick={handleNextMonth}>다음 달 ▶</button>
          </div>

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

          

          {/* ✅ 목표 리스트 */}
          <div className={styles.goalList}>
            {sortedMonthlyGoals.map((goal) => (
              <div key={goal.id} className={styles.goalItem}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={goal.isCompleted}
                  onChange={() => {
                    if (longTermGoals.some((g) => g.id === goal.id)) {
                      handleToggleLongTerm(goal.id, goal.dueDate);
                    } else {
                      handleToggle(goal.id);
                    }
                  }}
                />
                <input
                  type="text"
                  className={`${styles.goalText} ${goal.isCompleted ? styles.done : ""}`}
                  value={editingTexts[goal.id] ?? goal.text ?? goal.content ?? ""}
                  onChange={(e) => {
                    const newText = e.target.value;
                    setEditingTexts((prev) => ({ ...prev, [goal.id]: newText }));

                    if (!isComposing) {
                      const isLongTerm = goal.text && !goal.content;
                      if (isLongTerm) {
                        handleEditLongTerm(goal.id, newText);
                      } else {
                        handleEdit(goal.id, newText);
                      }
                    }
                  }}
                  onCompositionStart={() => setIsComposing(true)}
                  onCompositionEnd={(e) => {
                    setIsComposing(false);
                    const newText = e.target.value;
                    const isLongTerm = goal.text && !goal.content;
                    if (isLongTerm) {
                      handleEditLongTerm(goal.id, newText);
                    } else {
                      handleEdit(goal.id, newText);
                    }
                  }}
                />


                <span className={`${styles.priorityTag} ${goal.content?.startsWith("[없음]") ? styles.none : styles[goal.priority?.toLowerCase()]}`}>
                  {goal.content?.startsWith("[없음]") ? "없음" : (
                    goal.priority?.toLowerCase() === "high" ? "높음" :
                    goal.priority?.toLowerCase() === "medium" ? "중간" : "낮음"
                  )}
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
