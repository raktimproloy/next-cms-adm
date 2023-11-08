import React, { useEffect, useState } from 'react'
import Card from "@/components/ui/Card";
import Switch from "@/components/ui/Switch";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import { getAllRoles } from '@/utils/getAllRoles';

const columns = [
    {
      label: "User",
      field: "user",
    },
    {
      label: "Info",
      field: "info",
    },
    {
      label: "Blog",
      field: "blog",
    },
    {
      label: "Service",
      field: "service",
    },
    
  ];
  const rows = 1;

function PermissionCard({userData, permission, setPermission}) {
    const data = useSelector((state) => state.roles);
    const updateInfo = useSelector((state) => state.update);
    const dispatch = useDispatch()
    
    // Cookies
    const [cookie, removeCookie] = useCookies()
    
    useEffect(() => {
      if (updateInfo.roleUpdate === "" || updateInfo.roleUpdate === "not-updated") {
        getAllRoles(dispatch, cookie, removeCookie);
      }
    }, [dispatch, data, updateInfo]);
    
    useEffect(() => {
        data.map(role => {
            if(userData.role === role.rolename){
                setPermission({
                    user: role.user,
                    info: role.info,
                    service: role.service,
                    blog: role.blog,
                })
            }else{
                console.log("nai")
            }
        })
    }, [userData])
    
    useEffect(() => {
        console.log(permission)
    }, [permission, userData])

  return (
    <Card title="Permission" noborder>
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
                    <tr>
                        <td className="table-td">
                        <Switch
                            label="User"
                            activeClass="bg-danger-500"
                            value={permission.user}
                            onChange={() => setPermission({...permission, user: !permission.user})}
                        />
                        </td>
                        <td className="table-td">
                        <Switch
                            label="Info"
                            activeClass="bg-danger-500"
                            value={permission.info}
                            onChange={() => setPermission({...permission, info: !permission.info})}
                        />
                        </td>
                        <td className="table-td ">
                        <Switch
                            label="Service"
                            activeClass="bg-success-500"
                            value={permission.service}
                            onChange={() => setPermission({...permission, service: !permission.service})}
                        />  
                        </td>
                        <td className="table-td ">
                        <Switch
                            label="Blog"
                            activeClass="bg-success-500"
                            value={permission.blog}
                            onChange={() => setPermission({...permission, blog: !permission.blog})}
                        />  
                        </td>
                    </tr>
                </tbody>
                </table>
            </div>
            </div>
        </div>
    </Card>
  )
}

export default PermissionCard