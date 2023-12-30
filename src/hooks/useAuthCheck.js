import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { addProfile } from "../store/layout";
import { useDispatch } from "react-redux";

const useAuthCheck = () => {
  // Initialize with null to indicate that authentication status is pending
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const dispatch = useDispatch()

  // Cookie hook
  const [cookies, setCookie, removeCookie] = useCookies(['_token']);
  const token = cookies._token;
  // console.log(token)
  useEffect(() => {
    if (!token || token == "undefined") {
      setIsAuthenticated(false);
    } else {
      const decoded = jwtDecode(token);
      
      setCookie("userId", decoded.userId)
      setCookie("username", decoded.username)
      setCookie("email", decoded.email)
      setCookie("permissionId", decoded.permissionId)

      if (decoded.exp < Date.now() / 1000) {
        setIsAuthenticated(false);
        removeCookie("_token")
      } else {
        setIsAuthenticated(true);
        // You can also set the token here if needed
      }
    }
  }, [token]);
  // console.log(isAuthenticated)

  return [isAuthenticated];
};

export default useAuthCheck;
