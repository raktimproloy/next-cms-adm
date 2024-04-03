import React from 'react'
import DefaultProfile from "/default_profile.png"

function LogCard({data, index}) {
    // Formet Log time
    const dateObject = new Date(data.createdAt);
    const formattedDate = dateObject.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
    const amPmTime = dateObject.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });

  return (
    <tr
    className=" even:bg-slate-200 dark:even:bg-slate-700"
    >
        <td className="table-td">{index + 1}</td>
        <td className="table-td">{data.activity_type}</td>
        <td className="table-td">{data.details}</td>
        <td className="table-td">{data.access_log}</td>
        <td className="table-td">
            <span className='block'>{formattedDate}</span>
            <span className='block'>{amPmTime}</span>
        </td>
    </tr>
  )
}

export default LogCard