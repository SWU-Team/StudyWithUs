import { useState, useEffect, useCallback } from "react";
import { apiGet } from "../utils/api";

const useCurrentUser = () => {
  const [user, setUser] = useState(null);

  const fetchUser = useCallback(async () => {
    try {
      const data = await apiGet("/users/me");
      setUser(data);
    } catch (err) {
      console.error("유저 정보 불러오기 실패", err);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, refreshUser: fetchUser };
};

export default useCurrentUser;
