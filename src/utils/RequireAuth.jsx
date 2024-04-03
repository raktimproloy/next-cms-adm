import React from 'react';
import useAuthCheck from "@/hooks/useAuthCheck";
import { Navigate} from 'react-router-dom';
import Layout from '../layout/Layout';

function RequireAuth({ children }) {
    const [isAuthenticated] = useAuthCheck();
    return(
      isAuthenticated ? <Layout/> : <Navigate to="/"/>
    )
  }

export default RequireAuth;
