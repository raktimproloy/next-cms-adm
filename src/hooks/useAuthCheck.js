import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { addProfile, addSession } from "../store/layout";
import { useDispatch } from "react-redux";
import { getProfile } from "../utils/getProfile";
import { useSelector } from "react-redux";

const useAuthCheck = () => {
  // Initialize with null to indicate that authentication status is pending
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const dispatch = useDispatch()
  const sessionData = useSelector((state) => state.session)

  // Cookie hook
  const [cookies, setCookie, removeCookie] = useCookies();
  const token = cookies._token;

  useEffect(() => {
    if (!token || token == "undefined") {
      setIsAuthenticated(false);
    } else {
      const decoded = jwtDecode(token);
      const newSessionData = {
        userId: decoded.userId,
        username: decoded.username,
        email: decoded.email,
        permissionId: decoded.permissionId,
      }
      dispatch(addSession(newSessionData));

      if (decoded.exp < Date.now() / 1000) {
        setIsAuthenticated(false);
        removeCookie("_token")
      } else {
        setIsAuthenticated(true);
        // You can also set the token here if needed
        getProfile(dispatch, cookies, removeCookie, sessionData);
      }
    }
  }, [token]);

  return [isAuthenticated];
};

export default useAuthCheck;
