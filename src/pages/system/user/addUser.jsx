import React, { useState, useEffect } from "react";
import Textinput from "@/components/ui/Textinput";
import InputGroup from "@/components/ui/InputGroup";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Switch from "@/components/ui/Switch";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addInfo } from "../../../store/layout";
import {API_HOST} from "@/utils"
import { useCookies } from "react-cookie";
import Popup from "@/components/ui/Popup"
import RoleOption from "./RoleOption";
import PermissionCard from "./PermissionCard";



const steps = [
  {
    id: 1,
    title: "Account Details",
  },
  {
    id: 2,
    title: "Permission",
  }
];

let stepSchema = yup.object().shape({
  username: yup.string().required(" User name is required"),
  fullName: yup.string().required("Full name is required"),
  email: yup.string().email("Email is not valid").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmpass: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

function AddUser() {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [stepNumber, setStepNumber] = useState(0);

  // Cookies
  const [cookie, removeCookie] = useCookies()

  // Show Loading
  const [showLoading, setShowLoading] = useState(false)

  const [permission, setPermission] = useState({
    user: false,
    info: false,
    service: false,
    blog: false
  })

  const [userData, setUserData] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    last_login: "30mnt ago",
    status: 0,
    password: "",
    role: "",
    roleId: ""
  })

  // find current step schema
  let currentStepSchema;
  switch (stepNumber) {
    case 0:
      currentStepSchema = stepSchema;
      break;
    default:
      currentStepSchema = stepSchema;
  }

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({
    resolver: yupResolver(currentStepSchema),
    // keep watch on all fields
    mode: "all",
  });

  const handleNext = (e) => {
    let totalSteps = steps.length;
    const isLastStep = stepNumber === totalSteps - 1;
    if (isLastStep) {
      
    } else {
      setStepNumber(stepNumber + 1);
    }
  }

  const handleAdd = (e) => {
    e.preventDefault()
    setShowLoading(true)

    const headers = {
      'Authorization': `Bearer ${cookie._token}`
    }

    axios.post(`${API_HOST}user/signup`, userData, {
      headers: headers
    })
    .then(response=>{
      const userId = response.data.userId
      const roleData = {
        role: userData.roleId,
        username: userData.username.toLowerCase(),
        userId: userId,
        permission: permission
      }
      axios.post(`${API_HOST}user-role/add`, roleData)
      .then(res=>{
        dispatch(addInfo({ field: 'userUpdate', value: 'not-updated' }));
        navigate("/user-management")
        setShowLoading(false)
      })
      .catch(error=>{
          console.log(error)
          setShowLoading(false)
      })
    })
    .catch(error=>{
        console.log(error)
        if(error.response.data.error === "Authentication error!"){
          removeCookie("_token")
        }
    })
  }

  function handleChange(e) {
    setUserData({
        ...userData, [e.target.name]:e.target.value
    })
  }

  const handlePrev = () => {
    setStepNumber(stepNumber - 1);
  };

  return (
    <div>
      <Popup showLoading={showLoading} popupText={"User Adding..."} />
      <Card title="Horizontal">
        <div>
          <div className="flex z-[5] items-center relative justify-center md:mx-8">
            {steps.map((item, i) => (
              <div
                className="relative z-[1] items-center item flex flex-start flex-1 last:flex-none group"
                key={i}
              >
                <div
                  className={`${
                    stepNumber >= i
                      ? "bg-slate-900 text-white ring-slate-900 ring-offset-2 dark:ring-offset-slate-500 dark:bg-slate-900 dark:ring-slate-900"
                      : "bg-white ring-slate-900 ring-opacity-70  text-slate-900 dark:text-slate-300 dark:bg-slate-600 dark:ring-slate-600 text-opacity-70"
                  }  transition duration-150 icon-box md:h-12 md:w-12 h-7 w-7 rounded-full flex flex-col items-center justify-center relative z-[66] ring-1 md:text-lg text-base font-medium`}
                >
                  {stepNumber <= i ? (
                    <span> {i + 1}</span>
                  ) : (
                    <span className="text-3xl">
                      <Icon icon="bx:check-double" />
                    </span>
                  )}
                </div>

                <div
                  className={`${
                    stepNumber >= i
                      ? "bg-slate-900 dark:bg-slate-900"
                      : "bg-[#E0EAFF] dark:bg-slate-700"
                  } absolute top-1/2 h-[2px] w-full`}
                ></div>
                <div
                  className={` ${
                    stepNumber >= i
                      ? " text-slate-900 dark:text-slate-300"
                      : "text-slate-500 dark:text-slate-300 dark:text-opacity-40"
                  } absolute top-full text-base md:leading-6 mt-3 transition duration-150 md:opacity-100 opacity-0 group-hover:opacity-100`}
                >
                  <span className="w-max">{item.title}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="conten-box ">
            <form onSubmit={handleSubmit(handleNext)}>
              {stepNumber === 0 && (
                <div>
                  <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 pt-10">
                    <div className="lg:col-span-3 md:col-span-2 col-span-1">
                      <h4 className="text-base text-slate-800 dark:text-slate-300 my-6">
                        Enter Your Account Details
                      </h4>
                    </div>
                    <Textinput
                      label="Full name"
                      type="text"
                      placeholder="Full name"
                      name="fullName"
                      error={errors.fullName}
                      register={register}
                      onChange={handleChange}
                    />
                    <Textinput
                      label="Username"
                      type="text"
                      placeholder="Type your User Name"
                      name="username"
                      error={errors.username}
                      register={register}
                      onChange={handleChange}
                    />
                    <Textinput
                      label="Email"
                      type="email"
                      placeholder="Type your email"
                      name="email"
                      error={errors.email}
                      register={register}
                      onChange={handleChange}
                    />
                    <InputGroup
                      label="Phone Number"
                      type="text"
                      placeholder="Phone Number"
                      name="phone"
                      error={errors.phone}
                      register={register}
                      onChange={handleChange}
                    />
                    <Textinput
                      label="Password"
                      type="password"
                      placeholder="8+ characters, 1 capitat letter "
                      name="password"
                      error={errors.password}
                      hasicon
                      register={register}
                      onChange={handleChange}
                    />
                    <Textinput
                      label="Confirm Password"
                      type="password"
                      placeholder="Password"
                      name="confirmpass"
                      error={errors.confirmpass}
                      register={register}
                      hasicon
                    />
                  </div>
                </div>
              )}

              {stepNumber === 1 && (
                <div>
                  <div className="grid md:grid-cols-2 grid-cols-1 gap-5 mb-5">
                    <div className="md:col-span-2 col-span-1">
                      <h4 className="text-base text-slate-800 dark:text-slate-300 mb-6">
                        Enter Your Personal info-500
                      </h4>
                    </div>
                    {/* selection  */}
                    <RoleOption userData={userData} setUserData={setUserData}  />
                  </div>
                  {/* Basic table for permission */}
                  <PermissionCard userData={userData} setUserData={setUserData} setPermission={setPermission} permission={permission} />
                </div>
              )}
              <div
                className={`${
                  stepNumber > 0 ? "flex justify-between" : " text-right"
                } mt-10`}
              >
                {stepNumber !== 0 && (
                  <Button
                    text="prev"
                    className="btn-dark"
                    onClick={handlePrev}
                  />
                )}
                {
                  stepNumber !== steps.length - 1 ?
                  <Button
                    text={"next"}
                    className="btn-dark"
                    type={"submit"}
                  /> :
                  <Button
                    text={"submit"}
                    className="btn-dark"
                    onClick={handleAdd}
                  />
                }
              </div>
            </form>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default AddUser