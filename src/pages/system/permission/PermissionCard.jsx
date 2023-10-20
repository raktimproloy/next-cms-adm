import React, { useState } from 'react'
import Switch from "@/components/ui/Switch";

function PermissionCard({row, i}) {
    const [checked1, setChecked1] = useState(row.permission.user)
    const [checked2, setChecked2] = useState(row.permission.info)
    const [checked3, setChecked3] = useState(row.permission.service)
    const [checked4, setChecked4] = useState(row.permission.blog)
  return (
    <>
        <tr>
            <td className="table-td border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
            {i + 1}
            </td>
            <td className="table-td border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
            {row.username}
            </td>
            <td className="table-td border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
            {row.role}
            </td>
            <td className="table-td border border-slate-100 dark:bg-slate-800 dark:border-slate-700 ">
            <Switch
            label="user"
            activeClass="bg-danger-500"
            value={checked1}
            onChange={() => setChecked1(!checked1)}
            />
            </td>
            <td className="table-td border border-slate-100 dark:bg-slate-800 dark:border-slate-700 ">
            <Switch
            label="info"
            activeClass="bg-danger-500"
            value={checked2}
            onChange={() => setChecked2(!checked2)}
            />
            </td>
            <td className="table-td border border-slate-100 dark:bg-slate-800 dark:border-slate-700 ">
            <Switch
            label="service"
            activeClass="bg-danger-500"
            value={checked3}
            onChange={() => setChecked3(!checked3)}
            />
            </td>
            <td className="table-td border border-slate-100 dark:bg-slate-800 dark:border-slate-700 ">
            <Switch
            label="blog"
            activeClass="bg-danger-500"
            value={checked4}
            onChange={() => setChecked4(!checked4)}
            />
            </td>
        </tr>
    </>
  )
}

export default PermissionCard