import React, { useState, useEffect } from "react";
import Textinput from "@/components/ui/Textinput";
import InputGroup from "@/components/ui/InputGroup";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import * as yup from "yup";
import Switch from "@/components/ui/Switch";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useUserData } from "../../hooks/useUserData";

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

const furits = [
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "user", label: "User" },
];

const styles = {
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
};


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

  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const [checked3, setChecked3] = useState(false);
  const [checked4, setChecked4] = useState(false);

  const [userData, setUserData] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    last_login: "30mnt ago",
    status: 0,
    password: "",
    role: "admin"
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
  useEffect(() => {
    //console.log("step number changed");
  }, [stepNumber]);

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
      console.log(userData)
    }
  }

  const handleAdd = (e) => {
    e.preventDefault()

    useUserData()
    axios.post(`http://localhost:3001/user/signup`, userData)
    .then(response=>{
      const userId = response.data.userId
      const roleData = {
        role: userData.role,
        username: userData.username,
        userId: userId,
        permission: {
          info: checked1,
          user: checked2,
          service: checked3,
          blog: checked4
        }
      }
      axios.post(`http://localhost:3001/role/add`, roleData)
      .then(res=>{
        navigate("/user-manager")
      })
      .catch(error=>{
          console.log(error)
      })
    })
    .catch(error=>{
        console.log(error)
    })
  }

  function handleChange(e) {
    setUserData({
        ...userData, [e.target.name]:e.target.value
    })
  }

  function handleOptionChange(e) {
    setUserData({
        ...userData, role:e.value
    })
  }

  const handlePrev = () => {
    setStepNumber(stepNumber - 1);
  };

  return (
    <div>
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
                      label="Username"
                      type="text"
                      placeholder="Type your User Name"
                      name="username"
                      error={errors.username}
                      register={register}
                      onChange={handleChange}
                    />
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
                    <div className="gap-5">
                      <div>
                        <label htmlFor=" hh" className="form-label ">
                          Role
                        </label>
                        <Select
                          className="react-select"
                          classNamePrefix="select"
                          defaultValue={furits[0]}
                          options={furits}
                          styles={styles}
                          id="hh"
                          onChange={handleOptionChange}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Basic table for permission */}
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
                                    label=""
                                    activeClass="bg-danger-500"
                                    value={checked1}
                                    onChange={() => setChecked1(!checked1)}
                                  />
                                  </td>
                                  <td className="table-td">
                                  <Switch
                                    label=""
                                    activeClass="bg-danger-500"
                                    value={checked2}
                                    onChange={() => setChecked2(!checked2)}
                                  />
                                  </td>
                                  <td className="table-td ">
                                    <Switch
                                      label=""
                                      activeClass="bg-success-500"
                                      value={checked3}
                                      onChange={() => setChecked3(!checked3)}
                                    />  
                                  </td>
                                  <td className="table-td ">
                                    <Switch
                                      label=""
                                      activeClass="bg-success-500"
                                      value={checked4}
                                      onChange={() => setChecked4(!checked4)}
                                    />  
                                  </td>
                                </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </Card>
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