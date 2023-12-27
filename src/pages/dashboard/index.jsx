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

const Dashboard = () => {
  const dispatch = useDispatch()

  // Cookies
  const [cookie, removeCookie] = useCookies()
  const [groupChartArray, setGroupCharArray] = useState([])

  const data = useSelector((state) => state.collectionCount);
  useEffect(() => {
    if (data.blog === undefined) {
      getCollectionCount(dispatch, cookie, removeCookie, "blog", data);
    }
    if (data.user === undefined) {
      getCollectionCount(dispatch, cookie, removeCookie, "user", data);
    }
  }, [dispatch, data]);

  useEffect(() => {
    setGroupCharArray([
        {
          title: "Active User",
          count: "354"
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
          count: "10"
        },
      ])

  }, [data])


  return (
    <div className="space-y-5">
      <HomeBredCurbs title="Dashboard" />
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
              {meets.map((item, i) => (
                <li key={i} className="block py-[10px]">
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <div className="flex-1 flex items-center space-x-2 rtl:space-x-reverse">
                      <div className="flex-none">
                        <div className="h-8 w-8 bg-white rounded-full">
                          <img
                            src={DefaultProfile}
                            alt=""
                            className="block w-full h-full object-cover rounded-full border hover:border-white border-transparent"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <span className="block text-slate-600 text-sm dark:text-slate-300 mb-1 font-medium">
                          avilsh
                        </span>
                        <span className="flex font-normal text-xs dark:text-slate-400 text-slate-500">
                          <span className="text-base inline-block mr-1">
                            {/* <Icon icon="heroicons-outline:video-camera" /> */}
                          </span>
                          IP: 192.168.1.10,<br/> Device: Windows PC
                        </span>
                      </div>
                    </div>
                    <div className="flex-none">
                      <span className="block text-xs text-slate-600 dark:text-slate-400">
                        {item.date}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
