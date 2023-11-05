import React, { useEffect, useState } from 'react'
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput"
import Button from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {API_HOST} from "@/utils"

function userEdit() {
  const [profileData, setProfileData] = useState({})

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
    // resolver: yupResolver(schema),
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
      console.log(res.data[0])
    })
    .catch(error => {
      // if(error.response.data.error === "Authentication error!"){
      //   removeCookie("_token")
      // }
      console.log(error)
    })
  }, [])

  const handleUpdate = () => {
    axios.put(`${API_HOST}user/update/${profileData._id}`, profileData, {
      headers: headers
    })
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
  }


  return (
    <div>
        <Card title="Basic Inputs">
        <div className="space-y-3">
          <Textinput
            label="Full Name"
            id="pn"
            register={register}
            type="text"
            name="fullName"
            placeholder="Change Full Name"
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
            name="username"
            defaultValue={profileData.username}
            onChange={handleChange}
          />
          <Textinput
            label="Email"
            id="pn2"
            type="text"
            register={register}
            name="email"
            placeholder="Change Email"
            defaultValue={profileData.email}
            onChange={handleChange}
          />
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
          <Button text="Update" className="btn-primary py-2" onClick={handleUpdate} />
        </div>
      </Card>
    </div>
  )
}

export default userEdit