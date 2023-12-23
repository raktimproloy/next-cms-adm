import React, { useEffect, useState } from "react";
import GroupChart3 from "@/components/partials/widget/chart/group-chart-3";
import HomeBredCurbs from "@/components/partials/widget/HomeBredCurbs";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useCookies } from "react-cookie";
import { getProfile } from "../../utils/getProfile";

const Dashboard = () => {

    const dispatch = useDispatch()
    // Cookies
    const [cookie, removeCookie] = useCookies()
    const profileData = useSelector((state) => state.profile);
    const updateInfo = useSelector((state) => state.update);

    // useEffect(() => {
    //   if (updateInfo.profileUpdate === "" || updateInfo.profileUpdate === "not-updated") {
    //       getProfile(dispatch, cookie, removeCookie);
    //   }
    // }, [dispatch, profileData, updateInfo]);

  return (
    <div>
      <HomeBredCurbs title="Dashboard" />
      
        <div className="grid xl:grid-cols-4 lg:grid-cols-2 col-span-1 gap-3">
          <GroupChart3 />
        </div>
    </div>
  );
};

export default Dashboard;
