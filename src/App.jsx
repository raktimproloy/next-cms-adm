import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// home pages  & dashboard
// Auth Pages
const Login = lazy(() => import("./pages/auth/login3"));
const ForgotPass = lazy(() => import("./pages/auth/forgot-password3"));

// Sidebar pages
const Dashboard = lazy(() => import("./pages/dashboard"));


// System 
const AddUser = lazy(() => import("./pages/system/addUser"))
const ChangePassword = lazy(() => import("./pages/system/changePassword"))
const Permission = lazy(() => import("./pages/system/permission"))
const UserManager = lazy(() => import("./pages/system/userManager"))


import Layout from "./layout/Layout";
import Loading from "./components/Loading";
function App() {
  return (
    <main className="App  relative">
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<Loading />}>
              <Login />
            </Suspense>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <Suspense fallback={<Loading />}>
              <ForgotPass />
            </Suspense>
          }
        />
        <Route path="/*" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />

          {/* System */}
          <Route path="add-user" element={<AddUser />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="permission" element={<Permission />} />
          <Route path="user-manager" element={<UserManager />} />

          {/* Content */}
          {/* <Route path="contact" element={<UserManager />} />
          <Route path="logo" element={<UserManager />} />
          <Route path="socal-media" element={<UserManager />} /> */}

          <Route path="*" element={<Navigate to="/404" />} />
        </Route>

      </Routes>
    </main>
  );
}

export default App;
