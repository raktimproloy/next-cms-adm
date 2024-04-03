import React, { useEffect, useState } from 'react'
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput"
import Select from "@/components/ui/Select"
import Button from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {API_HOST} from "@/utils"
import Switch from "@/components/ui/Switch"
import Popup from "@/components/ui/Popup"
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ToastContainer, toast } from 'react-toastify';
import {AddLog} from "@/utils/logHandler"

let schema = yup.object().shape({
  fullName: yup.string().required("Full name is required"),
  email: yup.string().email("Email is not valid").required("Email is required"),
});

function userEdit() {
  const [profileData, setProfileData] = useState({})
  const [userPermission, setUserPermission] = useState({})
  const [permissionData, setPermissionData] = useState({})
  const [errorMessage, setErrorMessage] = useState("")
  // Show Loading
  const [showLoading, setShowLoading] = useState(false)
  const navigate = useNavigate()

  function handleChange(e) {
    setProfileData({
        ...profileData, [e.target.name]:e.target.value
    })
  }

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    //
    mode: "all",
  });

  // Cookies
  const [cookie, removeCookie] = useCookies()
  const headers = {
    'Authorization': `Bearer ${cookie._token}`
  }

  const { username } = useParams();
  useEffect(() => {
    axios.get(`${API_HOST}user/${username}`, {
      headers: headers
    })
    .then(res => {
      setProfileData(res.data[0])

      // get permission data
      axios.get(`${API_HOST}user-role/${res.data[0].permission[0]}`, {
        headers: headers
      })
      .then(res => {
        setUserPermission(res.data[0])
        setPermissionData(res.data[0].permission)
      })
      .catch(error => {
        if(error.response.data.error === "Authentication error!"){
          removeCookie("_token")
        }
        console.log(error)
      })
    })
    .catch(error => {
      if(error.response.data.error === "Authentication error!"){
        removeCookie("_token")
      }
      console.log(error)
    })
  }, [])

  const handleUpdate = () => {
    setShowLoading(true)
    const updatedData = {
      profileData,
      permissionData:{
        ...userPermission,
        permission: permissionData
      }
    }
    axios.put(`${API_HOST}user/update/${profileData._id}`, updatedData, {
      headers: headers
    })
    .then(res => {
        navigate("/user-management")
        AddLog(profileData.email, "user", `User Updated Successful`)
        setShowLoading(false)
        toast.success("User Updated Successful!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
    })
    .catch(err => {
      setErrorMessage(err.response.data.error)
      AddLog(profileData.email, "user", `User Updated Unsuccessful`)
        setShowLoading(false)
        if(err.response.data.error === "Authentication error!"){
          removeCookie("_token")
        }
        toast.success("User Updated Unsuccessful!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
    })
  }


  const handleStatusChange = (e) => {
    setProfileData({
      ...profileData, status: e.target.value === "active" ? true : false
    })
  }

  return (
    <div>
      {/* <ToastContainer/> */}
      <Popup showLoading={showLoading} popupText={"User Updating..."} />
        <Card title="User Edit">
          <form onSubmit={handleSubmit(handleUpdate)}>
            <div className="space-y-3">
              <Textinput
                label="Full Name"
                id="pn"
                register={register}
                type="text"
                name="fullName"
                placeholder="Change Full Name"
                // error={errors.fullName}
                defaultValue={profileData.fullName}
                onChange={handleChange}
              />
              <Textinput
                label="Username"
                id="pn3"
                placeholder="Enter Username"
                register={register}
                readonly
                type="text"
                // name="username"
                defaultValue={profileData.username}
                onChange={handleChange}
              />
              <Textinput
                label="Email"
                id="pn2"
                type="text"
                register={register}
                className={errorMessage.includes("dup key") && "border-1 dark:border-red-700"}
                name="email"
                placeholder="Change Email"
                // error={errors.email}
                defaultValue={profileData.email}
                onChange={handleChange}
              />
              {
                errorMessage.includes("dup key") &&
                <p className='text-red-500 text-sm'>This email already used!</p>
              }
              <Textinput
                label="Phone Number"
                id="pn4"
                type="text"
                register={register}
                name="phone"
                placeholder="Change Phone Number"
                defaultValue={profileData.phone}
                onChange={handleChange}
              />
              {
                profileData &&
                <Select
                  options={["active", "inactive"]}
                  label="User Status"
                  value={profileData.status === true ? "active" : "inactive"}
                  onChange={handleStatusChange}
                />
              }

              <h4 className='pt-5'>Permissions</h4>
              <div className='flex align-center gap-20 py-5'>
                <Switch
                label="Page"
                activeClass="bg-danger-500"
                value={permissionData.page || false}
                onChange={() => setPermissionData({...permissionData, page: !permissionData.page})}
                />
                <Switch
                label="Info"
                activeClass="bg-danger-500"
                value={permissionData.info || false}
                onChange={() => setPermissionData({...permissionData, info: !permissionData.info})}
                />
                <Switch
                label="Service"
                activeClass="bg-danger-500"
                value={permissionData.service || false}
                onChange={() => setPermissionData({...permissionData, service: !permissionData.service})}
                />
                <Switch
                label="Blog"
                activeClass="bg-danger-500"
                value={permissionData.blog || false}
                onChange={() => setPermissionData({...permissionData, blog: !permissionData.blog})}
                />
              </div>
              <Button type="submit" text="Update" className="btn-primary py-2" onClick={() => handleUpdate()}  />
            </div>
          </form>
      </Card>
    </div>
  )
}

export default userEdit