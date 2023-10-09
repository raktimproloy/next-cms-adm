import React, { useState } from 'react'
import Card from "@/components/ui/Card";
import { tableData } from "@/constant/table-data";
import Switch from "@/components/ui/Switch";
import Button from "@/components/ui/Button";

function Permission() {
  const columns = [
    {
      label: "Id",
      field: "id",
    },
    {
      label: "Full Name",
      field: "full_name",
    },
    {
      label: "User",
      field: "user",
    },
    {
      label: "Info",
      field: "info",
    },
    {
      label: "Services",
      field: "services",
    },
    {
      label: "Blogs",
      field: "blogs",
    },
  ];

  const rows = tableData.slice(0, 3);

  const [checked, setChecked] = useState(true);
  const [checked2, setChecked2] = useState(false);
  const [checked3, setChecked3] = useState(false);
  const [checked4, setChecked4] = useState(false);
  return (
    <div className="space-y-5">
      <Card title="Bordered Table" noborder>
        <div className="overflow-x-auto ">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden ">
              <table className="min-w-full border border-slate-100 table-fixed dark:border-slate-700 border-collapse">
                <thead className="">
                  <tr>
                    {columns.map((column, i) => (
                      <th
                        key={i}
                        scope="col"
                        className=" table-th border border-slate-100 dark:bg-slate-800 dark:border-slate-700 "
                      >
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white ">
                  {rows.map((row, i) => (
                    <tr key={i}>
                      <td className="table-td border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                        {row.age}
                      </td>
                      <td className="table-td border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                        {row.first_name}
                      </td>
                      <td className="table-td border border-slate-100 dark:bg-slate-800 dark:border-slate-700 ">
                      <Switch
                        label="danger"
                        activeClass="bg-danger-500"
                        value={checked}
                        onChange={() => setChecked(!checked)}
                      />
                      </td>
                      <td className="table-td border border-slate-100 dark:bg-slate-800 dark:border-slate-700 ">
                      <Switch
                        label="danger"
                        activeClass="bg-danger-500"
                        value={checked2}
                        onChange={() => setChecked2(!checked2)}
                      />
                      </td>
                      <td className="table-td border border-slate-100 dark:bg-slate-800 dark:border-slate-700 ">
                      <Switch
                        label="danger"
                        activeClass="bg-danger-500"
                        value={checked3}
                        onChange={() => setChecked3(!checked3)}
                      />
                      </td>
                      <td className="table-td border border-slate-100 dark:bg-slate-800 dark:border-slate-700 ">
                      <Switch
                        label="danger"
                        activeClass="bg-danger-500"
                        value={checked4}
                        onChange={() => setChecked4(!checked4)}
                      />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
      <div className='text-right mt-4'>
        <Button text="Save" className="btn-primary " />
      </div>
        </div>
      </Card>
    </div>
  )
}

export default Permission