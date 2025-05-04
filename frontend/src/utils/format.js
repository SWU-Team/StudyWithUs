// 분 단위 숫자를 "X시간 Y분" 형식의 문자열로 변환
export const formatMinutes = (minutes) => {
  const safeMin = Number(minutes); // 문자열일 경우에도 숫자로 변환
  if (isNaN(safeMin) || safeMin < 0) return "0분";

  const h = Math.floor(safeMin / 60);
  const m = safeMin % 60;
  return h > 0 ? `${h}시간 ${m}분` : `${m}분`;
};

// YYYY-MM-DD 형식 문자열을 "YYYY.MM.DD" 형식으로 변환
export const formatDate = (date) => {
  if (!date) return "";
  const [y, m, d] = date.split("-");
  return `${y}.${m}.${d}`;
};

// YYYY-MM-DD 형식 문자열을 "YYYY년 M월" 형식으로 변환
export const formatMonthKorean = (date) => {
  const [y, m] = date.split("-");
  return `${y}년 ${parseInt(m)}월`;
};

// YYYY-MM-DD 형식 문자열을 "YYYY년 M월 D일" 한국어로 변환
export const formatDateKorean = (date) => {
  if (!date) return "";
  const [y, m, d] = date.split("-");
  return `${y}년 ${parseInt(m)}월 ${parseInt(d)}일`;
};

// ISO Date를 한국어로 날짜+요일까지 출력 (예: 2025년 5월 3일 토요일)
export const formatDateWithDayKorean = (isodate) => {
  if (!isodate) return "";
  const date = new Date(isodate);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
};
