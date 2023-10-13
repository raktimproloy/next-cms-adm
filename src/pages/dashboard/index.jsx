import React, { useEffect, useState } from "react";
import GroupChart3 from "@/components/partials/widget/chart/group-chart-3";
import HomeBredCurbs from "@/components/partials/widget/HomeBredCurbs";
import { getUser } from "../../utils/getData";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

const Dashboard = () => {

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
