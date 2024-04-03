import React, { lazy, Suspense, useEffect, useState } from "react";
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
const PagesSetting = lazy(() => import("./pages/settings/PagesSetting"))
const BlogsSetting = lazy(() => import("./pages/settings/BlogsSetting"))

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
import { getSetting } from "@/utils/getSetting";
import RequireAuth from "./utils/RequireAuth";
import NotFoundPage from "./pages/404"

function App() {
  const dispatch = useDispatch()
  const sessionData = useSelector((state) => state.session)
  const [isAuthenticated] = useAuthCheck();
  const [cookie, setCookie, removeCookie] = useCookies();

  const profileData = useSelector((state) => state.profile);
  const settingData = useSelector((state) => state.setting);
  const updateInfo = useSelector((state) => state.update);
  useEffect(() => {
    if(isAuthenticated){
      if (updateInfo.profileUpdate === "" || updateInfo.profileUpdate === "not-updated") {
          getProfile(dispatch, cookie, removeCookie, sessionData);
      }
    }
    if (updateInfo.settingUpdate === "" || updateInfo.settingUpdate === "not-updated") {
      getSetting(dispatch, cookie, removeCookie);
    }
  }, [dispatch, profileData, updateInfo]);

  useEffect(() => {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    
    link.href = `${settingData?.storage_config?.storage_url}${settingData.fav_icon}` || "";
  }, [settingData]);

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
          isAuthenticated === true  ?
        <Route path="/*" element={<RequireAuth />}>
          <Route path="dashboard" element={
            <Suspense fallback={<Loading />}>
            <Dashboard />
          </Suspense>
            
          } />

          {/* profile page */}
          <Route path="profile/:username" element={
            <Suspense fallback={<Loading />}>
              {
                Object.keys(profileData).length === 0 ? <Loading /> :
                profileData.rolename === "Admin" || profileData?.permission?.page ?
                <Profile />
                :<NotFoundPage/>
              }
          </Suspense>
          } />

          {/* Pages */}
          <Route path="pages" element={
            <Suspense fallback={<Loading />}>
              {
                Object.keys(profileData).length === 0 ? <Loading /> :
                profileData.rolename === "Admin" || profileData?.permission?.page ?
                <Pages />
                :<NotFoundPage/>
              }
            </Suspense>
          } />
          <Route path="pages/add" element={
            <Suspense fallback={<Loading />}>
              {
                Object.keys(profileData).length === 0 ? <Loading /> :
                profileData.rolename === "Admin" || profileData?.permission?.page ?
                <AddPage />
                :<NotFoundPage/>
              }
            </Suspense>
            
          } />
          <Route path="pages/edit/:slug" element={
            <Suspense fallback={<Loading />}>
              {
                Object.keys(profileData).length === 0 ? <Loading /> :
                profileData.rolename === "Admin" || profileData?.permission?.page ?
                <EditPage />
                :<NotFoundPage/>
              }
            </Suspense>
          } />
          <Route path="pages/editor/:slug" element={
            <Suspense fallback={<Loading />}>
              {
                Object.keys(profileData).length === 0 ? <Loading /> :
                profileData.rolename === "Admin" || profileData?.permission?.page ?
                <Editor />
                :<NotFoundPage/>
              }
            </Suspense>
          } />
    
          {/* System */}
          <Route path="add-user" element={
            <Suspense fallback={<Loading />}>
              {
                Object.keys(profileData).length === 0 ? <Loading /> :
                profileData.rolename === "Admin" ?
                <AddUser />
                :<NotFoundPage/>
              }
            </Suspense>
            } 
          />
          <Route path="change-password" element={
            <Suspense fallback={<Loading />}>
              {
                Object.keys(profileData).length === 0 ? <Loading /> :
                profileData.rolename === "Admin" ?
                <ChangePassword />
                :<NotFoundPage/>
              }
            </Suspense>
          } />
          <Route path="role-management" element={
            <Suspense fallback={<Loading />}>
              {
                Object.keys(profileData).length === 0 ? <Loading /> :
                profileData.rolename === "Admin" ?
                <RoleManager />
                :<NotFoundPage/>
              }
            </Suspense>
          } />
          <Route path="user-management" element={
            <Suspense fallback={<Loading />}>
              {
                Object.keys(profileData).length === 0 ? <Loading /> :
                profileData.rolename === "Admin" ?
                <UserManager />
                :<NotFoundPage/>
              }
            </Suspense>
          } />
          <Route path="user-management/edit/:username" element={
            <Suspense fallback={<Loading />}>
              {
                Object.keys(profileData).length === 0 ? <Loading /> :
                profileData.rolename === "Admin" ?
                <UserEdit />
                :<NotFoundPage/>
              }
            </Suspense>
          } />

          {/* Setting */}
          <Route path="genarel-setting" element={
            <Suspense fallback={<Loading />}>
              {
                Object.keys(profileData).length === 0 ? <Loading /> :
                profileData.rolename === "Admin" ?
                <GenarelSetting />
                :<NotFoundPage/>
              }
            </Suspense>
          } />
          <Route path="pages-setting" element={
            <Suspense fallback={<Loading />}>
              {
                Object.keys(profileData).length === 0 ? <Loading /> :
                profileData.rolename === "Admin" ?
                <PagesSetting />
                :<NotFoundPage/>
              }
            </Suspense>
          } />
          <Route path="blogs-setting" element={
            <Suspense fallback={<Loading />}>
              {
                Object.keys(profileData).length === 0 ? <Loading /> :
                profileData.rolename === "Admin" ?
                <BlogsSetting />
                :<NotFoundPage/>
              }
            </Suspense>
          } />

          {/* Menu Page */}
          <Route path="menu/menu-type" element={
          <Suspense fallback={<Loading />}>
            {
              Object.keys(profileData).length === 0 ? <Loading /> :
              profileData.rolename === "Admin" ?
              <MenuType />
              :<NotFoundPage/>
            }
          </Suspense>
          } />
          <Route path="menu/menu-type/add" element={
            <Suspense fallback={<Loading />}>
              {
                Object.keys(profileData).length === 0 ? <Loading /> :
                profileData.rolename === "Admin" ?
                <AddMenuType />
                :<NotFoundPage/>
              }
            </Suspense>
          } />
          <Route path="menu/menu-type/edit/:alias" element={
            <Suspense fallback={<Loading />}>
              {
                Object.keys(profileData).length === 0 ? <Loading /> :
                profileData.rolename === "Admin" ?
                <EditMenuType />
                :<NotFoundPage/>
              }
          </Suspense>
          } />

          <Route path="menu/menu-manager" element={
            <Suspense fallback={<Loading />}>
              {
                Object.keys(profileData).length === 0 ? <Loading /> :
                profileData.rolename === "Admin" ?
                <MenuManager />
                :<NotFoundPage/>
              }
          </Suspense>
          } />
          <Route path="menu/menu-manager/add" element={
            <Suspense fallback={<Loading />}>
              {
                Object.keys(profileData).length === 0 ? <Loading /> :
                profileData.rolename === "Admin" ?
                <AddLink />
                :<NotFoundPage/>
              }
          </Suspense>
          } />

          {/* Blog Page */}
          <Route path="blog" element={
            <Suspense fallback={<Loading />}>
              {
                Object.keys(profileData).length === 0 ? <Loading /> :
                profileData.rolename === "Admin" || profileData?.permission?.blog ?
                  <BlogPage />
                :<NotFoundPage/>
              }
          </Suspense>
          } />
          <Route path="blog/add" element={
            <Suspense fallback={<Loading />}>
              {
                Object.keys(profileData).length === 0 ? <Loading /> :
                profileData.rolename === "Admin" || profileData?.permission?.blog ?
                  <AddBlog />
                :<NotFoundPage/>
              }
          </Suspense>
          } />
          <Route path="blog/edit/:slug" element={
            <Suspense fallback={<Loading />}>
              {
                Object.keys(profileData).length === 0 ? <Loading /> :
                profileData.rolename === "Admin" || profileData?.permission?.blog ?
                  <EditBlog/>
                :<NotFoundPage/>
              }
          </Suspense>
          } />
          <Route path='*' element={<NotFoundPage />} />
        </Route> 
        : <Route path='*' element={<Navigate to='/' replace />} />

        }

      </Routes>
    </main>
  );
}

export default App;
