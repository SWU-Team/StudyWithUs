const TOKEN_KEY = "study_with_us_token";

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const getAuthHeader = () => {
  const token = getToken();
  return token ? `Bearer ${token}` : "";
};

export const extractTokenFromHeader = (res) => {
  const authHeader = res.headers.get("Authorization");
  if (!authHeader) return null;
  const [scheme, token] = authHeader.split(" ");
  return scheme === "Bearer" ? token : null;
};

export const parseTokenPayload = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const payloadBase64 = token.split(".")[1];

    // base64url 포맷을 base64로 변환
    const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error("Failed to parse token payload:", error);
    return null;
  }
};

export const getNicknameFromToken = () => {
  const payload = parseTokenPayload();
  return payload ? payload.nickname : null;
};
