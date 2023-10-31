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

const schema = yup
  .object({
    email: yup.string().email("Invalid email").required("Email is Required"),
    password: yup.string().required("Password is Required"),
  })
  .required();


const LoginForm = () => {
  // Cookies store
  const [cookies, setCookie] = useCookies(['_token'])
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

    axios.post(`${API_HOST}user/login`, loginData)
    .then(response=>{
      const token = response?.data?.token
      setCookie("_token", token)
      navigate("/dashboard")
    })
    .catch(error=>{
        console.log(error)
    })

  };

  const [checked, setChecked] = useState(false);

  return (
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
          Forgot Password?{" "}
        </Link>
      </div>

      <button className="btn btn-dark block w-full text-center">Sign in</button>
    </form>
  );
};

export default LoginForm;
