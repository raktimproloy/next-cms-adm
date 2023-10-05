import React from 'react'
import Card from "@/components/ui/Card";
import { tableData } from "@/constant/table-data";

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
  // slice(0, 10) is used to limit the number of rows to 10
  const rows = tableData.slice(0, 7);
function MenuPage() {
  return (
    <Card title="Table Head" noborder>
        <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden ">
              <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                <thead className="bg-slate-200 dark:bg-slate-700">
                  <tr>
                    {columns.map((column, i) => (
                      <th key={i} scope="col" className=" table-th ">
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                  {rows.map((row, i) => (
                    <tr key={i}>
                      <td className="table-td">{row.age}</td>
                      <td className="table-td">{row.first_name}</td>
                      <td className="table-td ">{row.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Card>
  )
}

export default MenuPage