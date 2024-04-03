import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Icon from "@/components/ui/Icon";
import Card from "@/components/ui/Card";

// import images
import axios from "axios";
import {API_HOST} from "@/utils"
import { useCookies } from "react-cookie";
import ProfileImage from "/public/default_profile.png"
import LogCard from "./LogCard";
import Popup from "@/components/ui/Popup"
import MessagePopup from "@/components/ui/Popup/MessagePopup"
import { tableData } from "@/constant/table-data";
import Textinput from "@/components/ui/Textinput";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";

const columns = [
  {
    label: "No",
    field: "no",
  },
  {
    label: "Activity Type",
    field: "activity_type",
  },
  {
    label: "Details",
    field: "details",
  },
  {
    label: "Access Log",
    field: "access_log",
  },
  {
    label: "Time",
    field: "time",
  },
];

const schema = yup
  .object({
    // email: yup.string().email("Invalid email").required("Email is Required"),
    old_password: yup.string().required("Old Password is Required"),
    new_password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
    confirm_password: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("new_password"), null], "Passwords must match"),
  })
  .required();
// slice(0, 10) is used to limit the number of rows to 10
const rows = tableData.slice(0, 7);

const Index = () => {
  const [profileData, setProfileData] = useState({})
  const [editData, setEditData] = useState({})
  const [errorMessage, setErrorMessage] = useState("")
  const [showMessagePopup, setShowMessagePopup] = useState("")
  const [overlay, setOverlay] = useState("edit")
  const [logData, setLogData] = useState([])
  const params = useParams()
  const [cookie, removeCookie] = useCookies();
  const headers = {
    'Authorization': `Bearer ${cookie._token}`
  };

  // Show Loading
  const [showLoading, setShowLoading] = useState(false)

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    //
    mode: "all",
  });

  useEffect(() => {
    if(Object.keys(profileData).length === 0){
      axios.get(`${API_HOST}user/${params.username}`, {
        headers: headers
      })
      .then(res => {
        setProfileData(res.data[0])
      })
      .catch(err => {
        console.log(err)
      })
    }
  }, [params])

  useEffect(() => {
    if(Object.keys(profileData).length > 0){
      axios.get(`${API_HOST}log/get/${profileData.email}`, {
        headers: headers
      })
      .then(res => {
        setLogData(res.data)
      })
      .catch(err => {
        console.log(err)
      })
    }
  }, [profileData])

  function handleChange(e) {
    setEditData({
        ...editData, [e.target.name]:e.target.value
    })
    
  }

  const onSubmit = () => {
    const headers = {
      'Authorization': `Bearer ${cookie._token}`
    }

    setShowLoading(true)
    axios.put(`${API_HOST}user/reset/${profileData._id}`,{
      passwordData: editData,
      authType: "oldPassword"
    }, {
      headers: headers
    })
    .then((res) => {
      console.log(res)
      setShowLoading(false)
      // setShowMessagePopup(true)
      toast.success("Password Updated Successful!", {
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
    .catch((err) => {
      setShowLoading(false)
      if(err.response.data.error === "Authentication error!"){
        removeCookie("_token")
      }else{
        setErrorMessage(err.response.data.error)
      }
      toast.error("Password Updated Unsuccessful!", {
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

  return (
    <div>
      {/* <ToastContainer/> */}
      {/* <MessagePopup showMessagePopup={showMessagePopup} setShowMessagePopup={setShowMessagePopup} popupText={"Password Changed!"} aleart={"success"} /> */}
      <Popup showLoading={showLoading} popupText={"Password Changing ..."} />
      <div className="space-y-5 profile-page">
        <div className="profiel-wrap px-[35px] pb-10 md:pt-[84px] pt-10 rounded-lg bg-white dark:bg-slate-800 lg:flex lg:space-y-0 space-y-6 justify-between items-end relative z-[1]">
          <div className="bg-slate-900 dark:bg-slate-700 absolute left-0 top-0 md:h-1/2 h-[150px] w-full z-[-1] rounded-t-lg"></div>
          <div className="profile-box flex-none md:text-start text-center">
            <div className="md:flex items-end md:space-x-6 rtl:space-x-reverse">
              <div className="flex-none">
                <div className="md:h-[186px] md:w-[186px] h-[140px] w-[140px] md:ml-0 md:mr-0 ml-auto mr-auto md:mb-0 mb-4 rounded-full ring-4 ring-slate-100 relative bg-white">
                  <img
                    src={ProfileImage}
                    alt=""
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="text-2xl font-medium text-slate-900 dark:text-slate-200 mb-[3px]">
                  {profileData.fullName}
                </div>
              </div>
            </div>
          </div>

          {/* <div className="profile-info-500 md:flex md:text-start text-center flex-1 max-w-[516px] md:space-y-0 space-y-4">
            <div className="flex-1">
              <div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1">
                $32,400
              </div>
              <div className="text-sm text-slate-600 font-light dark:text-slate-300">
                Total Balance
              </div>
            </div>

            <div className="flex-1">
              <div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1">
                200
              </div>
              <div className="text-sm text-slate-600 font-light dark:text-slate-300">
                Board Card
              </div>
            </div>

            <div className="flex-1">
              <div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1">
                3200
              </div>
              <div className="text-sm text-slate-600 font-light dark:text-slate-300">
                Calender Events
              </div>
            </div>
          </div> */}
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="lg:col-span-4 col-span-12">
            <div className="">
              <button className="text-sm mr-5 font-medium mb-7 last:mb-0 capitalize ring-0 foucs:ring-0 focus:outline-none px-6 rounded-md py-2 transition duration-150 text-slate-500 bg-white dark:bg-slate-700 dark:text-slate-300" id="headlessui-tabs-tab-:r4:" role="tab" aria-selected="false" tabIndex="-1" data-headlessui-state="" type="button" aria-controls="headlessui-tabs-panel-:r9:" onClick={() => {setOverlay("edit")}}>Edit</button>
              <button className="text-sm font-medium mb-7 last:mb-0 capitalize ring-0 foucs:ring-0 focus:outline-none px-6 rounded-md py-2 transition duration-150 text-slate-500 bg-white dark:bg-slate-700 dark:text-slate-300" id="headlessui-tabs-tab-:r4:" role="tab" aria-selected="false" tabIndex="-1" data-headlessui-state="" type="button" aria-controls="headlessui-tabs-panel-:r9:" onClick={() => {setOverlay("activity")}}>Activity</button>
            </div>
            <Card title="Info">
              <ul className="list space-y-8">
                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:envelope" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      EMAIL
                    </div>
                    <a
                      href="mailto:someone@example.com"
                      className="text-base text-slate-600 dark:text-slate-50"
                    >
                      {profileData.email}
                    </a>
                  </div>
                </li>

                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:phone-arrow-up-right" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      PHONE
                    </div>
                    <a
                      href={`tel:${profileData.phone}`}
                      className="text-base text-slate-600 dark:text-slate-50"
                    >
                      {profileData.phone}
                    </a>
                  </div>
                </li>
              </ul>
            </Card>
          </div>
          <div className="lg:col-span-8 col-span-12">
            {overlay === "activity" && 
              <Card title="Activity" noborder>
                <div className="overflow-x-auto -mx-6 h-[30rem]">
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
                          {logData.map((log, i) => (
                            <LogCard key={i} data={log} index={i} />
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </Card>
            }
            {overlay === "edit" && 
              <Card title="edit">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Textinput
                    name="old_password"
                    label="old passwrod"
                    type="password"
                    register={register}
                    error={errors.old_password}
                    className={`h-[48px] mb-3 ${errorMessage.includes("wrong password") && "border-1 dark:border-red-700"}`}
                    onChange={handleChange}
                  />
                  {
                    errorMessage.includes("wrong password") &&
                    <p className='text-red-500 text-sm'>Incorrect Password</p>
                  }
                  <Textinput
                    name="new_password"
                    label="new passwrod"
                    type="password"
                    register={register}
                    error={errors.new_password}
                    className="h-[48px] mb-3"
                    onChange={handleChange}
                  />
                  <Textinput
                    name="confirm_password"
                    label="confirm passwrod"
                    type="password"
                    register={register}
                    error={errors.confirm_password}
                    className="h-[48px] mb-3"
                    onChange={handleChange}
                  />
                  <button type="submit" className="btn btn-dark block w-full text-center mt-4">Save</button>
                </form>
              </Card>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
