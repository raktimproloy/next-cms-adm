import React from 'react'
import DefaultProfile from "/default_profile.png"

function LogCard({data}) {
    const userIp = data.access_log.split(",")
    // Formet Log time
    const dateObject = new Date(data.createdAt);
    const formattedDate = dateObject.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
    const amPmTime = dateObject.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });

  return (
    <li className="block py-[10px]">
            
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
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
            <span className={`block text-sm ${data.details.includes("successful") ? "text-red-600": "text-green-600"}`}>
            {data.details}
            </span>
                {data.email}
            </span>
            <span className="flex font-normal text-xs dark:text-slate-400 text-slate-500">
                <span className="text-base inline-block mr-1">
                {/* <Icon icon="heroicons-outline:video-camera" /> */}
                </span>
                {userIp[0]}
            </span>
            </div>
        </div>
        <div className="flex-none">
            
            <span className="block text-xs text-center text-slate-600 dark:text-slate-400">
            {formattedDate}
            </span>
            <span className="block text-xs text-center text-slate-600 dark:text-slate-400">
            {amPmTime}
            </span>
        </div>
        </div>
    </li>
  )
}

export default LogCard