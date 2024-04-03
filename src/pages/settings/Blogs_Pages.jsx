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
    title: "Blog",
    icon: "heroicons-outline:home",
  },
  {
    title: "Page",
    icon: "heroicons-outline:user",
  },
];

function Blogs_Pages() {
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
  
  return (
    <>
      <Popup showLoading={showLoading} popupText={"Setting Updating..."}  />
      <Card title="Justify Tabs">
        <Tab.Group>
          <Tab.List className="lg:space-x-6 md:space-x-3 space-x-0 rtl:space-x-reverse">
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
            {/* Basic */}
            <Tab.Panel>
              <Textinput
                label="Blog Show Amount"
                id="pn2"
                type="number"
                placeholder="Type how much amount  showing"
                defaultValue={settingData.blog_show_amount}
                onChange={(e) => setSettingData({...settingData, blog_show_amount:e.target.value})}
              />
            </Tab.Panel>

            {/* Contact */}
            <Tab.Panel>
              <Textinput
                label="Page Show Amount"
                id="pn2"
                type="text"
                placeholder="Type how much amount showing"
                // defaultValue={settingData.title}
                // onChange={(e) => setSettingData({...settingData, title:e.target.value})}
              />
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

export default Blogs_Pages