import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

const useAuthCheck = () => {
  // Initialize with null to indicate that authentication status is pending
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Cookie hook
  const [cookies, removeCookie] = useCookies(['_token']);
  const token = cookies._token;
  useEffect(() => {
    if (!token || token == "undefined") {
      setIsAuthenticated(false);
    } else {
      const decoded = jwtDecode(token);
      if (decoded.exp < Date.now() / 1000) {
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
        // You can also set the token here if needed
      }
    }
  }, [token]);

  return [isAuthenticated];
};

export default useAuthCheck;
