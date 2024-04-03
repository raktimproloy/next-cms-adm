import React, { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import GroupChart3 from "@/components/partials/widget/chart/group-chart-3";
import BasicArea from "./BasicArea";
import SelectMonth from "@/components/partials/SelectMonth";
import { meets} from "@/constant/data";
import CalendarView from "@/components/partials/widget/CalendarView";
import HomeBredCurbs from "./HomeBredCurbs";
import DefaultProfile from "/default_profile.png"
import { useSelector } from "react-redux";
import { getCollectionCount } from "../../utils/getCollectionCount";
import { useDispatch } from "react-redux";
import { useCookies } from "react-cookie";
import axios from "axios";
import { API_HOST } from "../../utils";
import LogCard from "./LogCard";

const Dashboard = () => {
  const dispatch = useDispatch()

  // Cookies
  const [cookie, removeCookie] = useCookies()
  const [groupChartArray, setGroupCharArray] = useState([])
  const [logData, setLogData] = useState([])
  const headers = {
    'Authorization': `Bearer ${cookie._token}`
  }

  const data = useSelector((state) => state.collectionCount);
  useEffect(() => {
    if (data.blog === undefined) {
      getCollectionCount(dispatch, cookie, removeCookie, "blog", data);
    }
    if (data.user === undefined) {
      getCollectionCount(dispatch, cookie, removeCookie, "user", data);
    }
  }, [dispatch, data]);


  // Get Log data
  useEffect(() => {
    axios
      .get(`${API_HOST}log/get`, {
        headers: headers
      })
      .then((res) => {
        setLogData(res?.data)
      })
      .catch((err) => {
        console.log(err)
        if(err.response.data.error === "Authentication error!"){
          removeCookie("_token")
        }
      });
  }, [])

  useEffect(() => {
    setGroupCharArray([
        {
          title: "Active User",
          count: "0"
        },
        {
          title: "Total User",
          count: data.user
        },
        {
          title: "Total Blog",
          count: data.blog
        },
        {
          title: "Total Services",
          count: "0"
        },
      ])

  }, [data])


  return (
    <div className="space-y-5">
      <HomeBredCurbs title="Dashboard" className="text-white" />
      <div className="grid grid-cols-12 gap-5">
        <div className="lg:col-span-8 col-span-12 space-y-5">
          <Card>
            <div className="grid grid-cols-12 gap-5">
              <div className="xl:col-span-12 col-span-12">
                <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-3">
                  <GroupChart3 chartData={groupChartArray} />
                </div>
              </div>
            </div>
          </Card>
          <Card title="Deal distribution by stage" headerslot={<SelectMonth />}>
            <BasicArea height={310} />
          </Card>
        </div>
        <div className="lg:col-span-4 col-span-12 space-y-5">
          <Card title="Notes">
            <div className="mb-12">
              <CalendarView />
            </div>
            <ul className="divide-y divide-slate-100 dark:divide-slate-700">
              {logData.map((log, i) => (
                <LogCard key={i} data={log}/>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
