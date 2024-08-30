import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {API_HOST} from "@/utils"
import { useCookies } from "react-cookie";
import Popup from "@/components/ui/Popup"
import { ToastContainer } from "react-toastify";
import useDarkMode from "@/hooks/useDarkMode";
import bgImage from "@/assets/images/all-img/page-bg.png";
import LogoWhite from "@/assets/images/logo/logo-white.svg";
import Logo from "@/assets/images/logo/logo.svg";



const schema = yup
  .object({
    password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
    confirmpass: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
  })
  .required();

const NewPassword = () => {

    const [isDark] = useDarkMode();
    // Cookies store
    const [cookies, setCookie] = useCookies(['_token'])
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState(false)
    const [showLoading, setShowLoading] = useState(false)
  
    const [newPasswordData, setNewPasswordData] = useState({
      password: "",
      confirm_password: ""
    })
  
    function handleChange(e) {
        setNewPasswordData({
          ...newPasswordData, [e.target.name]:e.target.value
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
    const navigate = useNavigate();

    const onSubmit = () => {
    //   setShowLoading(true)
  
    //   axios.post(`${API_HOST}user/login`, loginData)
    //   .then(response=>{
    //     setShowLoading(false)
    //     const token = response?.data?.token
    //     setCookie("_token", token)
    //   })
    //   .catch(error=>{
    //       setShowLoading(false)
    //       setErrorMessage(error.response.data.error)
    //       setError(true)
    //   })
  
    };
  
  

  return (
    <>
    <Popup showLoading={showLoading} popupText={"New Password Updating..."} />
      <ToastContainer />
      <div
        className="loginwrapper bg-cover bg-no-repeat bg-center flex justify-center"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      >
          <div className="">
            <div className="auth-box-3">
              <div className="mobile-logo text-center mb-6 lg:hidden block">
                <Link to="/">
                  <img
                    src={isDark ? LogoWhite : Logo}
                    alt=""
                    className="mx-auto"
                  />
                </Link>
              </div>
              <div className="text-center">
                <h4 className="font-medium">New Password</h4>
                
                
              </div>
              
                <div className="text-red-500 dark:text-red-400 text-base text-center mb-3">
                {
                    error ?
                    errorMessage === "You don't have login access!" ?
                    errorMessage 
                    : "Your credential do not matching !" 
                    : ""
                }
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
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

                <button className="btn btn-dark block w-full text-center">update</button>
                </form>
            </div>
          </div>
      </div>
    </>
  );
};

export default NewPassword;
