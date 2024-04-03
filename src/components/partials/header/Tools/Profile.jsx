import React, { useEffect } from "react";
import Dropdown from "@/components/ui/Dropdown";
import Icon from "@/components/ui/Icon";
import { Menu, Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import UserAvatar from "@/assets/images/all-img/user.png";
import { useCookies } from "react-cookie";
import { getProfile } from "../../../../utils/getProfile";
import ProfileImage from "/default_profile.png"
import { addInfo, profileSlice } from "../../../../store/layout";

let profileData;

const profileLabel = () => {
  return (
    <div className="flex items-center">
      <div className="flex-1 ltr:mr-[10px] rtl:ml-[10px]">
        <div className="lg:h-8 lg:w-8 h-7 w-7 rounded-full bg-white">
          <img
            src={ProfileImage}
            alt=""
            className="block w-full h-full object-cover rounded-full"
          />
        </div>
      </div>
      <div className="flex-none text-slate-600 dark:text-white text-sm font-normal items-center lg:flex hidden overflow-hidden text-ellipsis whitespace-nowrap">
        <span className="overflow-hidden text-ellipsis whitespace-nowrap w-[85px] block">
          {profileData.fullName}
        </span>
        <span className="text-base inline-block ltr:ml-[10px] rtl:mr-[10px]">
          <Icon icon="heroicons-outline:chevron-down"></Icon>
        </span>
      </div>
    </div>
  );
};

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sessionData = useSelector((state) => state.session)
  const [cookie, setCookie, removeCookie] = useCookies();

  profileData = useSelector((state) => state.profile);
  const updateInfo = useSelector((state) => state.update);

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

  const ProfileMenu = [
    {
      label: "Profile",
      icon: "heroicons-outline:user",

      action: () => {
        navigate(`/profile/${profileData.username}`);
      },
    },
    // {
    //   label: "Email",
    //   icon: "heroicons-outline:mail",
    //   action: () => {
    //     console.log("email");
    //   },
    // },
    {
      label: "Logout",
      icon: "heroicons-outline:login",
      action: () => {
        handleRemove()
      },
    },
  ];

  return (
    <Dropdown label={profileLabel()} classMenuItems="w-[180px] top-[58px]">
      {ProfileMenu.map((item, index) => (
        <Menu.Item key={index}>
          {({ active }) => (
            <div
              onClick={() => item.action()}
              className={`${
                active
                  ? "bg-slate-100 text-slate-900 dark:bg-slate-600 dark:text-slate-300 dark:bg-opacity-50"
                  : "text-slate-600 dark:text-slate-300"
              } block     ${
                item.hasDivider
                  ? "border-t border-slate-100 dark:border-slate-700"
                  : ""
              }`}
            >
              <div className={`block cursor-pointer px-4 py-2`}>
                <div className="flex items-center">
                  <span className="block text-xl ltr:mr-3 rtl:ml-3">
                    <Icon icon={item.icon} />
                  </span>
                  <span className="block text-sm">{item.label}</span>
                </div>
              </div>
            </div>
          )}
        </Menu.Item>
      ))}
    </Dropdown>
  );
};

export default Profile;
