import React, { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

// home pages  & dashboard
// Auth Pages
const Login = lazy(() => import("./pages/auth/login3"));
const ForgotPass = lazy(() => import("./pages/auth/forgot-password3"));

// Sidebar pages
const Dashboard = lazy(() => import("./pages/dashboard"));

// Pages
const PagesService = lazy(() => import("./pages/pages/Service"))

// Editor
const Editor = lazy(() => import("./pages/Editor"))

// System 
const AddUser = lazy(() => import("./pages/system/user/addUser"))
const ChangePassword = lazy(() => import("./pages/system/changePassword"))
const RoleManager = lazy(() => import("./pages/system/role"))
const EditRole = lazy(() => import("./pages/system/role/EditRole"))
const UserManager = lazy(() => import("./pages/system/user"))
const UserEdit = lazy(() => import("./pages/system/user/userEdit"))

// Content
const Contact = lazy(() => import("./pages/content/Contact"))
const Logo = lazy(() => import("./pages/content/Logo"))
const SocalMedia = lazy(() => import("./pages/content/SocalMedia"))

// Blog Page
const BlogPage = lazy(() => import("./pages/blog"))
const BlogDetailsPage = lazy(() => import("./pages/blog/blog-details"))

// Service Page
const ServicePage = lazy(() => import("./pages/service"))
const ServiceDetailsPage = lazy(() => import("./pages/service/service-details"))

// Email Page
const EmailPage = lazy(() => import("./pages/email"))

// Menu Page
const Menu = lazy(() => import("./pages/menu"))

// Profile page
const Profile = lazy(() => import("./pages/profile"))

// Redux Dispathch
import { pageLoad } from "./store/actions/pageAction";


import Layout from "./layout/Layout";
import Loading from "./components/Loading";


import { useDispatch } from "react-redux";
import useAuthCheck from "@/hooks/useAuthCheck";

function App() {
  const dispatch = useDispatch()
  const [isAuthenticated] = useAuthCheck();

  useEffect(() => {
    pageLoad()(dispatch);
  }, [dispatch]);


  return (
    <main className="App  relative">
      <Routes>
        {
          isAuthenticated === false ? 
          <Route
            path="/"
            element={
              <Suspense fallback={<Loading />}>
                <Login />
              </Suspense>
            }
          /> :
          <Route path='/' element={<Navigate to='/dashboard' replace />} />
        }
        <Route
          path="/forgot-password"
          element={
            <Suspense fallback={<Loading />}>
              <ForgotPass />
            </Suspense>
          }
        />
        {/* Editor */}
        <Route path="pages/editor/:pageId" element={<Editor />} />
        {
          isAuthenticated === true ? 
        <Route path="/*" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />

          {/* System */}
          <Route path="add-user" element={<AddUser />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="role-management" element={<RoleManager />} />
          <Route path="role-management/edit/:id" element={<EditRole />} />
          <Route path="user-management" element={<UserManager />} />
          <Route path="user-management/edit/:username" element={<UserEdit />} />

          {/* Pages */}
          <Route path="pages/services" element={<PagesService />} />



          {/* Content */}
          <Route path="contact" element={<Contact />} />
          <Route path="logo" element={<Logo />} />
          <Route path="socal-media" element={<SocalMedia />} />

          {/* Blog Page */}
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog-details" element={<BlogDetailsPage />} />

          {/* Service Page */}
          <Route path="service" element={<ServicePage />} />
          <Route path="service-details" element={<ServiceDetailsPage />} />

          {/* Menu Page */}
          <Route path="menu" element={<Menu />} />

          {/* profile page */}
          <Route path="profile/:username" element={<Profile />} />

          {/* Email Page */}
          {/* <Route path="email" element={<EmailPage />} /> */}
          <Route path="*" element={<Navigate to="/404" />} />

        </Route> :
         <Route path='*' element={<Navigate to='/' replace />} />

        }

      </Routes>
    </main>
  );
}

export default App;
