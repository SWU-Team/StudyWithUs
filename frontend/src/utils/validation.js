// 이메일 유효성 검사
export const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

// 비밀번호 유효성 검사 (최소 4자 이상, 추후 변경 예정)
export const validatePassword = (password) => password.length >= 4;
