import React, { useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";

import shade1 from "@/assets/images/all-img/shade-1.png";
import shade2 from "@/assets/images/all-img/shade-2.png";
import shade3 from "@/assets/images/all-img/shade-3.png";
import shade4 from "@/assets/images/all-img/shade-4.png";

const GroupChart3 = ({chartData}) => {
  const [statistics, setStatistics] = useState(
  [
    {
      title: "Active User",
      count: "354",
      bg: "bg-warning-500",
      text: "text-primary-500",
      percent: "25.67% ",
      icon: "heroicons:arrow-trending-up",
      img: shade1,
      percentClass: "text-primary-500",
    },
    {
      title: "Total User",
      count: "400",
      bg: "bg-info-500",
      text: "text-primary-500",
      percent: "8.67%",
      icon: "heroicons:arrow-trending-up",
      img: shade2,
      percentClass: "text-primary-500",
    },
    {
      title: "Total Blog",
      count: "35",
      bg: "bg-primary-500",
      text: "text-danger-500",
      percent: "1.67%  ",
      icon: "heroicons:arrow-trending-down",
      img: shade3,
      percentClass: "text-danger-500",
    },
    {
      title: "Total Services",
      count: "10",
      bg: "bg-success-500",
      text: "text-primary-500",
      percent: "11.67%  ",
      icon: "heroicons:arrow-trending-up",
      img: shade4,
      percentClass: "text-primary-500",
    },
  ])
  useEffect(() => {
    if (chartData.length > 0) {
      const updatedStatistics = statistics.map(stat => {
        const matchingData = chartData.find(data => data.title === stat.title);
  
        if (matchingData) {
          // If there is matching data in chartData, update title and count
          return {
            ...stat,
            title: matchingData.title,
            count: matchingData.count,
          };
        }
  
        // If no matching data found, return the original stat
        return stat;
      });
  
      // Update the state with the new statistics
      setStatistics(updatedStatistics);
    }
  }, [chartData]);


  return (
    <>
      {statistics.map((item, i) => (
        <div
          key={i}
          className={`${item.bg} rounded-md p-4 bg-opacity-[0.15] dark:bg-opacity-25 relative z-[1]`}
        >
          <div className="overlay absolute left-0 top-0 w-full h-full z-[-1]">
            <img
              src={item.img}
              alt=""
              draggable="false"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="block mb-6 text-sm text-slate-900 dark:text-white font-medium">
            {item.title}
          </span>
          <span className="block mb- text-2xl text-slate-900 dark:text-white font-medium mb-6">
            {item.count}
          </span>
        </div>
      ))}
    </>
  );
};

export default GroupChart3;
