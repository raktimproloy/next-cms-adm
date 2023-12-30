import React from 'react';
import { Navigate, useLocation, Route } from 'react-router-dom';

function RequireAuth({ children }) {
    const location = useLocation();
    const [isAuthenticated] = useAuthCheck();
    return isAuthenticated ? children : <Navigate to="/" state={{from: location}}/>;
}

export default RequireAuth;