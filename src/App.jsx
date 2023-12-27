import React, { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

// home pages  & dashboard
// Auth Pages
const Login = lazy(() => import("./pages/auth/login3"));
const ForgotPass = lazy(() => import("./pages/auth/forgot-password3"));
const NewPass = lazy(() => import("./pages/auth/new-password"));

// Sidebar pages
const Dashboard = lazy(() => import("./pages/dashboard"));

// Pages
const Pages = lazy(() => import("./pages/pagesCMS"))
const AddPage = lazy(() => import("./pages/pagesCMS/AddPage"))
const EditPage = lazy(() => import("./pages/pagesCMS/EditPage"))

// Editor
const Editor = lazy(() => import("./pages/Editor"))

// System 
const AddUser = lazy(() => import("./pages/system/user/addUser"))
const ChangePassword = lazy(() => import("./pages/system/changePassword"))
const RoleManager = lazy(() => import("./pages/system/role"))
const UserManager = lazy(() => import("./pages/system/user"))
const UserEdit = lazy(() => import("./pages/system/user/userEdit"))

// Settings
const GenarelSetting = lazy(() => import("./pages/settings/GenarelSetting"))
const Blogs_Pages = lazy(() => import("./pages/settings/Blogs_Pages"))

// Blog Page
const BlogPage = lazy(() => import("./pages/blog"))
const AddBlog = lazy(() => import("./pages/blog/AddBlog"))
const EditBlog = lazy(() => import("./pages/blog/EditBlog"))

// Service Page
const ServicePage = lazy(() => import("./pages/service"))
const ServiceDetailsPage = lazy(() => import("./pages/service/service-details"))

// Email Page
const EmailPage = lazy(() => import("./pages/email"))

// Menu Page
const MenuManager = lazy(() => import("./pages/menu/MenuManager"))
const AddLink = lazy(() => import("./pages/menu/AddLink"))

const MenuType = lazy(() => import("./pages/menu/MenuType"))
const AddMenuType = lazy(() => import("./pages/menu/AddMenuType"))
const EditMenuType = lazy(() => import("./pages/menu/EditMenuType"))

// Profile page
const Profile = lazy(() => import("./pages/profile"))

// Redux Dispathch
import { pageLoad } from "./store/actions/pageAction";


import Layout from "./layout/Layout";
import Loading from "./components/Loading";


import { useDispatch } from "react-redux";
import useAuthCheck from "@/hooks/useAuthCheck";
import { useSelector } from "react-redux";
import { getProfile } from "./utils/getProfile";
import { useCookies } from "react-cookie";

function App() {
  const dispatch = useDispatch()
  const [isAuthenticated] = useAuthCheck();
  const [cookie, setCookie, removeCookie] = useCookies();

  const profileData = useSelector((state) => state.profile);
  const updateInfo = useSelector((state) => state.update);

  useEffect(() => {
    if(isAuthenticated){
      if (updateInfo.profileUpdate === "" || updateInfo.profileUpdate === "not-updated") {
          getProfile(dispatch, cookie, removeCookie);
      }
    }
  }, [dispatch, profileData, updateInfo]);


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
          /> 
          : <Route path='/' element={<Navigate to='/dashboard' replace />} />
        }
        <Route
          path="/forgot-password"
          element={
            <Suspense fallback={<Loading />}>
              <ForgotPass />
            </Suspense>
          }
        />
        <Route
          path="/new-password"
          element={
            <Suspense fallback={<Loading />}>
              <NewPass />
            </Suspense>
          }
        />
        {/* Editor */}
        
        {
          isAuthenticated === true ?
        <Route path="/*" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />


          {
            profileData.rolename === "Admin" || profileData?.permission?.page ?
            (
              <>
                {/* Pages */}
                <Route path="pages" element={<Pages />} />
                <Route path="pages/add" element={<AddPage />} />
                <Route path="pages/edit/:slug" element={<EditPage />} />
                <Route path="pages/editor/:slug" element={<Editor />} />
              </>
            ): ""
          }
          
          {
            profileData.rolename === "Admin" && (
              <>
                {/* System */}
                <Route path="add-user" element={<AddUser />} />
                <Route path="change-password" element={<ChangePassword />} />
                <Route path="role-management" element={<RoleManager />} />
                <Route path="user-management" element={<UserManager />} />
                <Route path="user-management/edit/:username" element={<UserEdit />} />

                {/* Setting */}
                <Route path="genarel-setting" element={<GenarelSetting />} />
                <Route path="blogs-pages" element={<Blogs_Pages />} />

                {/* Menu Page */}
                <Route path="menu/menu-type" element={<MenuType />} />
                <Route path="menu/menu-type/add" element={<AddMenuType />} />
                <Route path="menu/menu-type/edit/:alias" element={<EditMenuType />} />

                <Route path="menu/menu-manager" element={<MenuManager />} />
                <Route path="menu/menu-manager/add" element={<AddLink />} />
              </>
            )
          }
          {
            profileData.rolename === "Admin" || profileData?.permission?.blog ? 
              <>
                {/* Blog Page */}
                <Route path="blog" element={<BlogPage />} />
                <Route path="blog/add" element={<AddBlog />} />
                <Route path="blog/edit/:slug" element={<EditBlog/>} />
              </>
            : ""
          }
          

          {/* Service Page */}
          {/* <Route path="service" element={<ServicePage />} />
          <Route path="service-details" element={<ServiceDetailsPage />} /> */}



          {/* profile page */}
          <Route path="profile/:username" element={<Profile />} />

          {/* Email Page */}
          {/* <Route path="email" element={<EmailPage />} /> */}
          <Route path="*" element={<Navigate to="/404" />} />

        </Route> 
        : <Route path='*' element={<Navigate to='/' replace />} />

        }

      </Routes>
    </main>
  );
}

export default App;
