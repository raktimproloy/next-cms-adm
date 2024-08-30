import React from "react";
import useDarkMode from "@/hooks/useDarkMode";
import { Link } from "react-router-dom";
import useWidth from "@/hooks/useWidth";
const Logo = ({settingData}) => {
  const [isDark] = useDarkMode();
  const { width, breakpoints } = useWidth();

  return (
    <div>
      <Link to="/dashboard">
        {width >= breakpoints.xl ? (
          <img src={`${settingData?.storage_config?.storage_url}${settingData.fav_icon}`} alt="" className="w-[3rem]" />
        ) : (
          <img src={`${settingData?.storage_config?.storage_url}${settingData.fav_icon}`} alt="" className="w-[3rem]" />
        )}
      </Link>
    </div>
  );
};

export default Logo;
