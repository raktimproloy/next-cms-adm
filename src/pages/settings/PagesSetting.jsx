import React, { Fragment, useEffect, useState } from 'react'
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Popup from "@/components/ui/Popup";
import Fileinput from "@/components/ui/Fileinput";
import Textarea from "@/components/ui/Textarea"
import Switch from "@/components/ui/Switch";
import Image from "@/components/ui/Image";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { Tab, Disclosure, Transition } from "@headlessui/react";
import Accordion from "@/components/ui/Accordion";
import image2 from "@/assets/images/all-img/image-2.png";
import axios from 'axios';
import { API_HOST } from '../../utils';
import { useCookies } from 'react-cookie';
import { addInfo } from '../../store/layout';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { getSetting } from '../../utils/getSetting';


const buttons = [
  {
    title: "Page",
    icon: "heroicons-outline:user",
  },
];

function PagesSetting() {
  const [showLoading, setShowLoading] = useState(false)
  const dispatch = useDispatch()
  const [settingData, setSettingData] = useState({})

  // Cookies
  const [cookie, removeCookie] = useCookies()
  const headers = {
    'Authorization': `Bearer ${cookie._token}`,
    // 'Content-Type': 'multipart/form-data',
  };

  const data = useSelector((state) => state.setting);
  const updateInfo = useSelector((state) => state.update);

  useEffect(() => {
    if (updateInfo.settingUpdate === "" || updateInfo.settingUpdate === "not-updated") {
        getSetting(dispatch, cookie, removeCookie);
    }
  }, [dispatch, settingData, updateInfo]);

  useEffect(() => {
    if(Object.keys(settingData).length === 0){
      setSettingData(data)
    }
  }, [data])

  const editHandler = () => {
    setShowLoading(true)
    axios.post(`${API_HOST}setting/update/${settingData._id}`, settingData, {
      headers: {
        'Authorization': `Bearer ${cookie._token}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(res => {
      dispatch(addInfo({ field: 'settingUpdate', value: 'not-updated' }));
      console.log(res);
      setShowLoading(false)
    })
    .catch(err => {
      console.log(err);
      if(err.response.data.error === "Authentication error!"){
        removeCookie("_token")
      }
      setShowLoading(false)
    });
  };


  // Handle Language
  function handleOptionChange(e) {
    setSettingData({
        ...settingData, newslater:e.target.value.toLowerCase()
    })
  }
  
  return (
    <>
      <Popup showLoading={showLoading} popupText={"Setting Updating..."}  />
      <Card title="Pages Setting">
        <Tab.Group>
          <Tab.List className="lg:space-x-6 md:space-x-3 space-x-0 rtl:space-x-reverse mb-5">
            {buttons.map((item, i) => (
              <Tab as={Fragment} key={i}>
                {({ selected }) => (
                  <button
                    className={` text-sm font-medium mb-7 last:mb-0 capitalize ring-0 foucs:ring-0 focus:outline-none px-6 rounded-md py-2 transition duration-150
              
              ${
                selected
                  ? "text-white bg-primary-500 "
                  : "text-slate-500 bg-white dark:bg-slate-700 dark:text-slate-300"
              }
              `}
                  >
                    {item.title}
                  </button>
                )}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels>
            {/* Contact */}
            {/* Basic */}
            <Tab.Panel>
              <div className='flex gap-10'>
                <div className='w-1/3'>
                <Textinput
                  label="Tiny MCE"
                  id="pn2"
                  type="text"
                  placeholder="Type Your Website Title"
                  defaultValue={settingData.tiny_mce}
                  onChange={(e) => setSettingData({...settingData, tiny_mce:e.target.value})}
                />
                <Select
                  options={["Active", "Inactive"]}
                  label="Newslater"
                  value={settingData.newslater === "active" ? "Active": "Inactive"}
                  onChange={handleOptionChange}
                />
                </div>
              </div>
            </Tab.Panel>

          </Tab.Panels>
        </Tab.Group>
        <div className='flex justify-end items-center mt-5'>
          <Button text="Save" className="btn-success py-2" onClick={() => {
            editHandler()
          }}  />
        </div>
      </Card>
    </>
  )
}

export default PagesSetting