import React, { useEffect, useState } from 'react'
import { API_HOST } from '../../../utils'
import { useParams } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import Switch from "@/components/ui/Switch";
import axios from 'axios';

function EditRole() {
    const [userCheckbox, setUserCheckbox] = useState(false)
    const [infoCheckbox, setInfoCheckbox] = useState(false)
    const [serviceCheckbox, setServiceCheckbox] = useState(false)
    const [blogCheckbox, setBlogCheckbox] = useState(false)
    const { id } = useParams();

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
            setUserCheckbox(data.user)
            setInfoCheckbox(data.info)
            setServiceCheckbox(data.service)
            setBlogCheckbox(data.blog)
        })
        .catch(error => {
          if(error.response.data.error === "Authentication error!"){
            removeCookie("_token")
          }
          console.log(error)
        })
      }, [])
  return (
    <>
        <tr>
            <td className="table-td border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
            {/* {row.username} */}
            "Admin"
            </td>
            <td className="table-td border border-slate-100 dark:bg-slate-800 dark:border-slate-700 ">
            <Switch
            label="user"
            activeClass="bg-danger-500"
            value={userCheckbox}
            onChange={() => setUserCheckbox(!userCheckbox)}
            />
            </td>
            <td className="table-td border border-slate-100 dark:bg-slate-800 dark:border-slate-700 ">
            <Switch
            label="info"
            activeClass="bg-danger-500"
            value={infoCheckbox}
            onChange={() => setInfoCheckbox(!infoCheckbox)}
            />
            </td>
            <td className="table-td border border-slate-100 dark:bg-slate-800 dark:border-slate-700 ">
            <Switch
            label="service"
            activeClass="bg-danger-500"
            value={serviceCheckbox}
            onChange={() => setServiceCheckbox(!serviceCheckbox)}
            />
            </td>
            <td className="table-td border border-slate-100 dark:bg-slate-800 dark:border-slate-700 ">
            <Switch
            label="blog"
            activeClass="bg-danger-500"
            value={blogCheckbox}
            onChange={() => setBlogCheckbox(!blogCheckbox)}
            />
            </td>
        </tr>
    </>
  )
}

export default EditRole