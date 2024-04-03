import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import Icon from "@/components/ui/Icon";

import FooterAvatar from "@/assets/images/users/user-1.jpg";
import DefaultProfile from "/default_profile.png"
import { useSelector } from "react-redux";
import { getProfile } from "../../../utils/getProfile";
import { useDispatch } from "react-redux";
import { useCookies } from "react-cookie";
const MobileFooter = () => {
  const [cookie, removeCookie] = useCookies()
  const dispatch = useDispatch();
  const profileData = useSelector((state) => state.profile);
  const updateInfo = useSelector((state) => state.update);
  const sessionData = useSelector((state) => state.session)

  useEffect(() => {
    if (updateInfo.profileUpdate === "" || updateInfo.profileUpdate === "not-updated") {
        getProfile(dispatch, cookie, removeCookie, sessionData);
    }
  }, [dispatch, profileData, updateInfo]);

  const handleRemove = () => {
    removeCookie('_token');
    dispatch(profileSlice.actions.clearProfile());
    dispatch(addInfo({ field: 'profileUpdate', value: 'not-updated' }));
    navigate("/")
  };
  return (
    <div className="bg-white bg-no-repeat custom-dropshadow footer-bg dark:bg-slate-700 flex justify-around items-center backdrop-filter backdrop-blur-[40px] fixed left-0 w-full z-[9999] bottom-0 py-[12px] px-4">
      <NavLink to={`/profile/${profileData.username}`}>
        {({ isActive }) => (
          <div>
            <span
              className={` relative cursor-pointer rounded-full text-[20px] flex flex-col items-center justify-center mb-1
         ${isActive ? "text-primary-500" : "dark:text-white text-slate-900"}
          `}
            >
              <Icon icon="heroicons-outline:user" />
              {/* <span className="absolute right-[5px] lg:top-0 -top-2 h-4 w-4 bg-red-500 text-[8px] font-semibold flex flex-col items-center justify-center rounded-full text-white z-[99]">
                10
              </span> */}
            </span>
            <span
              className={` block text-[11px]
          ${
            isActive ? "text-primary-500" : "text-slate-600 dark:text-slate-300"
          }
          `}
            >
              Profile
            </span>
          </div>
        )}
      </NavLink>
      <NavLink
        to="profile"
        className="relative bg-white bg-no-repeat backdrop-filter backdrop-blur-[40px] rounded-full footer-bg dark:bg-slate-700 h-[65px] w-[65px] z-[-1] -mt-[40px] flex justify-center items-center"
      >
        {({ isActive }) => (
          <div className="h-[50px] w-[50px] rounded-full relative left-[0px] top-[0px] custom-dropshadow">
            <img
              src={DefaultProfile}
              alt=""
              className={` w-full h-full rounded-full
          ${
            isActive
              ? "border-2 border-primary-500"
              : "border-2 border-slate-100"
          }
              `}
            />
          </div>
        )}
      </NavLink>
      <NavLink onClick={() => {handleRemove()}}>
        {({ isActive }) => (
          <div>
            <span
              className={` relative cursor-pointer rounded-full text-[20px] flex flex-col items-center justify-center mb-1
      ${isActive ? "text-primary-500" : "dark:text-white text-slate-900"}
          `}
            >
              <Icon icon="heroicons-outline:login" />
              {/* <span className="absolute right-[17px] lg:top-0 -top-2 h-4 w-4 bg-red-500 text-[8px] font-semibold flex flex-col items-center justify-center rounded-full text-white z-[99]">
                2
              </span> */}
            </span>
            <span
              className={` block text-[11px]
         ${isActive ? "text-primary-500" : "text-slate-600 dark:text-slate-300"}
        `}
            >
              Logout
            </span>
          </div>
        )}
      </NavLink>
    </div>
  );
};

export default MobileFooter;
