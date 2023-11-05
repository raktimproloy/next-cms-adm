import React, { useEffect, useState } from 'react'
import Card from "@/components/ui/Card";
import { tableData } from "@/constant/table-data";

import Button from "@/components/ui/Button";
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getAllRoles } from '../../../utils/getAllRoles';
import PermissionCard from './permissionCard';

function Permission() {
  const columns = [
    {
      label: "Id",
      field: "id",
    },
    {
      label: "Username",
      field: "username",
    },
    {
      label: "Role",
      field: "role",
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

  // User Data Fatching
  const dispatch = useDispatch();
  const data = useSelector((state) => state.roles);
  const updateInfo = useSelector((state) => state.update);

    // Cookies
    const [cookie, removeCookie] = useCookies()


  useEffect(() => {
    if (updateInfo.roleUpdate === "" || updateInfo.roleUpdate === "not-updated") {
      getAllRoles(dispatch, cookie, removeCookie);
    }
  }, [dispatch, data, updateInfo]);

  const [rows, setRows] = useState([])

  useEffect(() => {
    if(data){
      setRows(data.slice(0, 3))
    }
  }, [data])

  

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
                  {rows && rows.map((row, i) => 
                  {
                    return <PermissionCard row={row} key={i} i={i} />
                  }
                    
                  )}
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