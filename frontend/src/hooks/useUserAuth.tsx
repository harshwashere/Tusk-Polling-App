import { useEffect } from "react";
import { useUserContext } from "../context/userContext";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/helper";
import { useNavigate } from "react-router-dom";

const useUserAuth = () => {
  const { user, updateUser, clearUser } = useUserContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) return;

    let isMounted = true;

    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);

        if (isMounted && response.data) {
          updateUser(response.data.userInfo);
        }
      } catch (error) {
        console.error("Failed to fetch user info: ", error);

        if (isMounted) {
          clearUser();
          navigate("/login");
        }
      }
    };

    fetchUserInfo();

    return () => {
      isMounted = false;
    };
  }, [user, updateUser, clearUser]);
};

export default useUserAuth;
