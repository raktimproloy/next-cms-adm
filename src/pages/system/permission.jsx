import React from 'react'
import Card from "@/components/ui/Card";
import { tableData } from "@/constant/table-data";

function Permission() {
  const columns = [
    {
      label: "Age",
      field: "age",
    },
    {
      label: "First Name",
      field: "first_name",
    },
  
    {
      label: "Email",
      field: "email",
    },
  ];

  const rows = tableData.slice(0, 7);
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
                        {row.email}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Permission