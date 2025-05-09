import React, { useState, useEffect, useMemo } from "react";
import styles from "./Mypage.module.css";
import defaultUserImg from "../../assets/images/user.png";
import { Bar } from "react-chartjs-2";
import useCurrentUser from "../../hooks/useCurrentUser";
import { apiGet } from "../../utils/api";
import { formatMinutes, formatMonthKorean, formatDateWithDayKorean } from "../../utils/format";
import { toast } from "react-toastify";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import NicknameModal from "../../components/Mypage/NicknameModal";
import ProfileImgModal from "../../components/Mypage/ProfileImgModal";
import PasswordModal from "../../components/Mypage/PasswordModal";
import WithdrawModal from "../../components/Mypage/WithdrawModal";
import Loading from "../../components/Loading";
import Button from "../../components/common/Button";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MyPage = () => {
  const { user, refreshUser } = useCurrentUser();

  const [todayMinutes, setTodayMinutes] = useState(null);
  const [totalMinutes, setTotalMinutes] = useState(null);
  const [diaryCount, setDiaryCount] = useState(null);
  const [planStats, setPlanStats] = useState({ total: 0, completed: 0 });

  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [isProfileImgModalOpen, setIsProfileImgModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  const isLoading = !user || todayMinutes === null || totalMinutes === null;
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [studyChartData, setStudyChartData] = useState({ labels: [], datasets: [] });
  const [planChartData, setPlanChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const fetchTodayStudyTime = async () => {
      const today = new Date().toISOString().split("T")[0];
      try {
        const res = await apiGet(`/study-times?date=${today}`);
        setTodayMinutes(res.totalMinutes);
      } catch (err) {
        console.error("오늘 공부 시간 조회 실패", err);
        setTodayMinutes(0);
      }
    };

    fetchTodayStudyTime();
  }, []);

  useEffect(() => {
    const featchAllStudyTime = async () => {
      try {
        const res = await apiGet("/study-times/total");
        setTotalMinutes(res.totalMinutes);
      } catch (err) {
        console.error("총 공부 시간 불러오기 실패", err);
        setTotalMinutes(0);
      }
    };

    featchAllStudyTime();
  }, []);

  useEffect(() => {
    const featchAllDiary = async () => {
      try {
        const res = await apiGet("/diaries");
        console.log("총 다이어리", res);
        setDiaryCount(res.length);
      } catch (err) {
        console.error("총 공부 시간 불러오기 실패", err);
        setTotalMinutes(0);
      }
    };

    featchAllDiary();
  }, []);

  useEffect(() => {
    const fetchPlanStats = async () => {
      try {
        const res = await apiGet("/plans/stats");
        setPlanStats({
          total: res.totalPlans,
          completed: res.completedPlans,
        });
      } catch (err) {
        console.error("플랜 통계 조회 실패", err);
        setPlanStats({ total: 0, completed: 0 });
      }
    };

    fetchPlanStats();
  }, []);

  useEffect(() => {
    const fetchMonthlyStudyData = async () => {
      const [year, month] = currentMonth.split("-").map(Number);
      const res = await apiGet(`/study-times/monthly?month=${currentMonth}`);
      const dailyMap = new Map();

      res.forEach(({ recordDate, totalMinutes }) => {
        const date = new Date(recordDate).getDate();
        const prev = dailyMap.get(date) || 0;
        dailyMap.set(date, prev + totalMinutes);
      });

      const endDate = new Date(year, month, 0).getDate();
      const labels = Array.from({ length: endDate }, (_, i) => `${i + 1}`);
      const studyData = Array.from({ length: endDate }, (_, i) => {
        const minutes = dailyMap.get(i + 1) || 0;
        return minutes / 60;
      });

      setStudyChartData({
        labels,
        datasets: [
          {
            label: "공부 시간 (시간)",
            data: studyData,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            hoverBackgroundColor: "rgba(75, 192, 192, 1)",
            barThickness: 20,
          },
        ],
      });
    };

    fetchMonthlyStudyData();
  }, [currentMonth]);

  useEffect(() => {
    const fetchPlanData = async () => {
      const [year, month] = currentMonth.split("-").map(Number);
      const res = await apiGet(`/plans/month?year=${year}&month=${month}`);
      console.log("플랜 데이터", res);
      const dailyMap = new Map();

      res.forEach((plan) => {
        if (plan.isCompleted) {
          const day = new Date(plan.planDate).getDate();
          const prev = dailyMap.get(day) || 0;
          dailyMap.set(day, prev + 1);
        }
      });

      const endDate = new Date(year, month, 0).getDate();
      const labels = Array.from({ length: endDate }, (_, i) => `${i + 1}`);
      const planData = Array.from({ length: endDate }, (_, i) => dailyMap.get(i + 1) || 0);

      setPlanChartData({
        labels,
        datasets: [
          {
            label: "완료된 플랜 수",
            data: planData,
            backgroundColor: "rgba(255, 159, 64, 0.6)",
            hoverBackgroundColor: "rgba(255, 159, 64, 1)",
            barThickness: 20,
          },
        ],
      });
    };

    fetchPlanData();
  }, [currentMonth]);

  const handleMonthChange = (dir) => {
    const [year, month] = currentMonth.split("-").map(Number);
    const date = new Date(year, month - 1);
    date.setMonth(date.getMonth() + dir);

    const newYear = date.getFullYear();
    const newMonth = String(date.getMonth() + 1).padStart(2, "0");
    setCurrentMonth(`${newYear}-${newMonth}`);
  };

  const optionsStudy = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true },
        tooltip: {
          backgroundColor: "#343a40",
          callbacks: {
            title: (ctx) => `📅 ${ctx[0].label}`,
            label: (ctx) => {
              const minutes = Math.round(ctx.parsed.y * 60);
              return `총 ${formatMinutes(minutes)}`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          suggestedMax: 2,
          ticks: {
            stepSize: 0.5,
            callback: (v) => `${v}시간`,
            color: "#495057",
            font: { size: 12 },
          },
          grid: {
            color: "#dee2e6",
            borderDash: [4],
          },
        },
        x: {
          ticks: {
            color: "#495057",
            font: { size: 12 },
          },
          grid: { display: false },
        },
      },
    }),
    []
  );

  const optionsPlan = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      tooltip: {
        backgroundColor: "#343a40",
        callbacks: {
          title: (ctx) => `📅 ${ctx[0].label}`,
          label: (ctx) => `완료된 플랜: ${ctx.parsed.y}개`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: 2,
        ticks: {
          stepSize: 1,
          callback: (v) => `${v}개`,
          color: "#495057",
          font: { size: 12 },
        },
        grid: {
          color: "#dee2e6",
          borderDash: [4],
        },
      },
      x: {
        ticks: {
          color: "#495057",
          font: { size: 12 },
        },
        grid: { display: false },
      },
    },
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Loading />
        <p>마이페이지 정보를 불러오는 중입니다...</p>
      </div>
    );
  }
  return (
    <>
      <div className={styles.container}>
        <div className={styles.mainLayout}>
          <div className={styles.leftSection}>
            <div className={styles.profileSection}>
              <div className={styles.profileImageWrapper}>
                <img
                  src={user.profileImg ? user.profileImg : defaultUserImg}
                  alt="Profile"
                  className={styles.profileImg}
                />
              </div>
              <div className={styles.profileInfo}>
                <dl>
                  <dt>닉네임</dt>
                  <dd>{user.nickname}</dd>
                  <dt>이메일</dt>
                  <dd>{user.email}</dd>
                  <dt>등급</dt>
                  <dd>
                    <span className={styles.badge}>{user.grade}</span>
                  </dd>
                  <dt>로그인 방식</dt>
                  <dd>
                    <span
                      className={`${styles.loginTypeBadge} ${
                        user.loginType === "LOCAL"
                          ? styles["login-local"]
                          : user.loginType === "KAKAO"
                          ? styles["login-kakao"]
                          : styles["login-google"]
                      }`}
                    >
                      {user.loginType}
                    </span>
                  </dd>
                  <dt>가입일</dt>
                  <dd>{formatDateWithDayKorean(user.createdAt)}</dd>
                </dl>
              </div>
            </div>
            <div className={styles.accountSection}>
              <h3>계정 설정</h3>
              <div className={styles.btnWrapper}>
                <Button type="primary" onClick={() => setIsNicknameModalOpen(true)}>
                  닉네임 수정
                </Button>
                <Button type="primary" onClick={() => setIsProfileImgModalOpen(true)}>
                  프로필 이미지 수정
                </Button>
                {user.loginType === "LOCAL" ? (
                  <Button type="default" onClick={() => setIsPasswordModalOpen(true)}>
                    비밀번호 변경
                  </Button>
                ) : (
                  <Button
                    type="default"
                    onClick={() => toast.error("소셜 로그인 유저는 비밀번호를 변경할 수 없습니다.")}
                  >
                    비밀번호 변경
                  </Button>
                )}
                <Button type="danger" onClick={() => setIsWithdrawModalOpen(true)}>
                  회원 탈퇴
                </Button>
              </div>
              <p className={styles.notice}>※ 소셜 로그인 유저는 비밀번호를 변경할 수 없습니다.</p>
            </div>
          </div>

          <div className={styles.rightSection}>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryCard}>
                <p className={styles.summaryLabel}>오늘 공부 시간</p>
                <p className={styles.summaryValue}>{formatMinutes(todayMinutes)}</p>
              </div>
              <div className={styles.summaryCard}>
                <p className={styles.summaryLabel}>누적 공부 시간</p>
                <p className={styles.summaryValue}>{formatMinutes(totalMinutes)}</p>
              </div>
              <div className={styles.summaryCard}>
                <p className={styles.summaryLabel}>전체 일기</p>
                <p className={styles.summaryValue}>{diaryCount}</p> {/* 추후 API 연결 */}
              </div>
              <div className={styles.summaryCard}>
                <p className={styles.summaryLabel}>전체 플랜</p>
                <p className={styles.summaryValue}>
                  {planStats.completed}개 / {planStats.total}개
                </p>{" "}
              </div>
            </div>
            <div className={styles.statsCard}>
              <div className={styles.monthHeader}>
                <button onClick={() => handleMonthChange(-1)}>← 이전달</button>
                <span>{formatMonthKorean(currentMonth)}</span>

                <button onClick={() => handleMonthChange(1)}>다음달 →</button>
              </div>
              <div className={styles.statsGraphSection}>
                <div className={styles.graphBlock}>
                  {studyChartData.datasets.length > 0 &&
                  studyChartData.datasets[0].data.length > 0 ? (
                    <Bar data={studyChartData} options={optionsStudy} />
                  ) : (
                    <div className={styles.emptyMessage}>
                      <p>
                        이번 달 공부 기록이 없습니다. 플래너에서 계획을 세우고, 스터디룸에서 공부를
                        시작해보세요!
                      </p>
                    </div>
                  )}
                </div>
                <div className={styles.graphBlock}>
                  {planChartData.datasets.length > 0 &&
                  planChartData.datasets[0].data.length > 0 ? (
                    <Bar data={planChartData} options={optionsPlan} />
                  ) : (
                    <div className={styles.emptyMessage}>
                      <p>해당 월에 완료된 플랜이 없습니다. 플래너에서 계획을 세워보세요.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isNicknameModalOpen && (
        <NicknameModal
          isOpen={isNicknameModalOpen}
          onClose={() => setIsNicknameModalOpen(false)}
          onUpdate={refreshUser}
        />
      )}
      {isProfileImgModalOpen && (
        <ProfileImgModal
          isOpen={isProfileImgModalOpen}
          onClose={() => setIsProfileImgModalOpen(false)}
          onUpdate={refreshUser}
        />
      )}
      {isPasswordModalOpen && (
        <PasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />
      )}
      {isWithdrawModalOpen && (
        <WithdrawModal isOpen={isWithdrawModalOpen} onClose={() => setIsWithdrawModalOpen(false)} />
      )}
    </>
  );
};

export default MyPage;
