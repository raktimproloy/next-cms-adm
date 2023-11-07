import React, { useEffect, useState } from 'react'
import { API_HOST } from '../../../utils'
import { useParams } from 'react-router-dom'
import { useCookies } from 'react-cookie'

import Button from "@/components/ui/Button";
import Switch from "@/components/ui/Switch";
import Popup from "@/components/ui/Popup";
import axios from 'axios';

function EditRole() {
    const [roleData, setRoleData] = useState({
      rolename: "",
      user: false,
      info: false,
      service: false,
      blog: false
    })
    const { id } = useParams();

    const [showLoading, setShowLoading] = useState(false)

    // Cookies
    const [cookie, removeCookie] = useCookies()
    const headers = {
        'Authorization': `Bearer ${cookie._token}`
    }

    useEffect(() => {
        axios.get(`${API_HOST}role/${id}`, {
          headers: headers
        })
        .then(res => {
            const data = res.data[0]
            console.log(res.data[0])
            setRoleData(res.data[0])
        })
        .catch(error => {
          if(error.response.data.error === "Authentication error!"){
            removeCookie("_token")
          }
          console.log(error)
        })
      }, [])


      // Update Role
      const handleUpdate = () => {
        setShowLoading(true)
        axios.put(`${API_HOST}role/update/${id}`, roleData, {
          headers: headers
        })
        .then(res => {
            console.log(res)
            setShowLoading(false)
        })
        .catch(error => {
          setShowLoading(false)
          if(error.response.data.error === "Authentication error!"){
            removeCookie("_token")
          }
          console.log(error)
        })
      }
  return (
    <>
      <Popup showLoading={showLoading} popupText={"Role Updating..."} />
      <h3 className='text-center'>Role: <span>Admin</span></h3>
      <tr className='flex justify-center mt-10'>
          <td className="table-td border border-slate-100 dark:bg-slate-800 dark:border-slate-700 ">
          <Switch
          label="user"
          activeClass="bg-danger-500"
          value={roleData.user}
          onChange={() => setRoleData({...roleData, user: !roleData.user})}
          />
          </td>
          <td className="table-td border border-slate-100 dark:bg-slate-800 dark:border-slate-700 ">
          <Switch
          label="info"
          activeClass="bg-danger-500"
          value={roleData.info}
          onChange={() => setRoleData({...roleData, info: !roleData.info})}
          />
          </td>
          <td className="table-td border border-slate-100 dark:bg-slate-800 dark:border-slate-700 ">
          <Switch
          label="service"
          activeClass="bg-danger-500"
          value={roleData.service}
          onChange={() => setRoleData({...roleData, service: !roleData.service})}
          />
          </td>
          <td className="table-td border border-slate-100 dark:bg-slate-800 dark:border-slate-700 ">
          <Switch
          label="blog"
          activeClass="bg-danger-500"
          value={roleData.blog}
          onChange={() => setRoleData({...roleData, blog: !roleData.blog})}
          />
          </td>
      </tr>
      <div className='text-center mt-10'>
        <Button text="Save" className="btn-primary py-2" onClick={handleUpdate} />
      </div>
    </>
  )
}

export default EditRole