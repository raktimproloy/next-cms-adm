import React, { useEffect, useRef, useState } from "react";
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
import {AddLog} from "@/utils/logHandler"
import ReCAPTCHA  from "react-google-recaptcha"
import { getSetting } from "../../../utils/getSetting";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

const schema = yup
  .object({
    email: yup.string().email("Invalid email").required("Email is Required"),
    password: yup.string().required("Password is Required"),
  })
  .required();


const LoginForm = () => {
  const [cookie, setCookie, removeCookie] = useCookies(['_token'])
  const [error, setError] = useState(false)
  const dispatch = useDispatch()
  const [errorMessage, setErrorMessage] = useState(false)
  const [showLoading, setShowLoading] = useState(false)
  const captchaRef = useRef(null)
  const setting = useSelector((state) => state.setting);
  const updateInfo = useSelector((state) => state.update);

  

  useEffect(() => {
    if (updateInfo.settingUpdate === "" || updateInfo.settingUpdate === "not-updated") {
        getSetting(dispatch, cookie, removeCookie);
    }
  }, [dispatch, setting, updateInfo]);

  const [recaptchaSiteKey, setRecaptchaSiteKey] = useState("")

  useEffect(() => {
    // setRecaptchaSiteKey("")
    setRecaptchaSiteKey(setting?.email_config?.admin_recaptcha_site_key)
  }, [setting]);

  const [loginData, setLoginData] = useState({
    email:"",
    password: ""
  })

  function handleChange(e) {
    setLoginData({
        ...loginData, [e.target.name]:e.target.value
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
    const token = captchaRef.current.getValue();
    // if(token){
      setShowLoading(true)
      axios.post(`${API_HOST}user/login`, {token, loginData})
      .then(response=>{
        const token = response?.data?.token
        setCookie("_token", token)
        
        AddLog(loginData.email, "login", "Login Successful")
        setShowLoading(false)
        navigate("/dashboard")
      })
      .catch(error=>{
          AddLog(loginData.email, "login", `${error?.response?.data?.error || "Unsuccessful Login"}`)
          setShowLoading(false)
          console.log(error)
          setErrorMessage(error?.response?.data?.error)
          setError(true)
      })
    // }
    captchaRef.current.reset();
  };

  return (
    <>
    <Popup showLoading={showLoading} popupText={"User Logging..."} />
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
        name="email"
        label="email"
        type="email"
        register={register}
        error={errors.email}
        className="h-[48px]"
        onChange={handleChange}
      />
      <Textinput
        name="password"
        label="passwrod"
        type="password"
        register={register}
        error={errors.password}
        className="h-[48px]"
        onChange={handleChange}
      />
      <div className="flex justify-end ">
        <Link
          to="/forgot-password"
          className="text-sm text-slate-800 dark:text-slate-400 leading-6 font-medium"
        >
          Forgot Password??{" "}
        </Link>
      </div>
      <div className="w-100 flex justify-center">
        {
          recaptchaSiteKey ? 
          <ReCAPTCHA
            sitekey={recaptchaSiteKey}
            ref={captchaRef}
          />
          : ""
        }
      </div>
      <button className="btn btn-dark block w-full text-center">Sign in</button>
    </form>
    
    </>
  );
};

export default LoginForm;
