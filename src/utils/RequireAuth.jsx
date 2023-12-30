import React from 'react';
import useAuthCheck from "@/hooks/useAuthCheck";
import { Navigate, Route, useLocation } from 'react-router-dom';

function RequireAuth({ children }) {
    const [isAuthenticated] = useAuthCheck();
    console.log(isAuthenticated)
  
    return isAuthenticated ? children : <Navigate to="/" />;
  }

export default RequireAuth;
