import { useState, useEffect } from "react";
import { apiGet } from "../utils/api";

const useCurrentUser = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await apiGet("/users/me");
        setUser(data);
      } catch (err) {
        console.error("유저 정보 불러오기 실패", err);
      }
    };

    fetchUser();
  }, []);

  return user;
};

export default useCurrentUser;
