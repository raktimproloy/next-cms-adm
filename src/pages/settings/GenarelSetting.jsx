import React, { Fragment, useEffect, useState } from 'react'
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Fileinput from "@/components/ui/Fileinput";
import Textarea from "@/components/ui/Textarea"
import Switch from "@/components/ui/Switch";
import Image from "@/components/ui/Image";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Popup from "@/components/ui/Popup";
import { Tab, Disclosure, Transition } from "@headlessui/react";
import Accordion from "@/components/ui/Accordion";
import image2 from "@/assets/images/all-img/image-2.png";
import axios from 'axios';
import { API_HOST } from '../../utils';
import { useCookies } from 'react-cookie';
import { addInfo } from '../../store/layout';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getSetting } from '../../utils/getSetting';


const buttons = [
  {
    title: "Basic",
    icon: "heroicons-outline:home",
  },
  {
    title: "Contact",
    icon: "heroicons-outline:user",
  },
  {
    title: "Socal",
    icon: "heroicons-outline:chat-alt-2",
  },
  {
    title: "Meta",
    icon: "heroicons-outline:cog",
  },
  {
    title: "Popup",
    icon: "heroicons-outline:cog",
  },
];

function GenarelSetting() {
  const [showLoading, setShowLoading] = useState(false)
  const [settingData, setSettingData] = useState({})
  const [settingMetaData, setSettingMetaData] = useState({})
  const [settingSocalData, setSettingSocalData] = useState({})
  const [favIcon, setFavIcon] = useState(null)
  const [logo, setLogo] = useState(null)
  const [metaImage, setMetaImage] = useState(null)
  const dispatch = useDispatch()

  // Cookies
  const [cookie, removeCookie] = useCookies()
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
    const formData = new FormData();
  
    formData.append("title", settingData.title);
    formData.append("description", settingData.description);
    formData.append("fav_icon", favIcon);
    formData.append("logo", logo);
    formData.append("phone", settingData.phone)
    formData.append("uk_phone", settingData.uk_phone)
    formData.append("email", settingData.email)
    formData.append("address", settingData.address)
    formData.append("uk_address", settingData.uk_address)
    formData.append("city", settingData.city)
    formData.append("uk_city", settingData.uk_city)
    formData.append("country", settingData.country)
    formData.append("uk_country", settingData.uk_country)
    formData.append("map_url", settingData.map_url)
    formData.append("uk_map_url", settingData.uk_map_url)
    formData.append("map_share", settingData.map_share)
    formData.append("uk_map_share", settingData.uk_map_share)
    formData.append("google_analytics_id", settingData.google_analytics_id)
    formData.append("blog_show_amount", settingData.blog_show_amount)
    formData.append("language", settingData.language)
    formData.append("popup", settingData.popup)
    formData.append("meta_image", metaImage)
    formData.append("meta_property", JSON.stringify(settingMetaData))
    formData.append("socal_media", JSON.stringify(settingSocalData))
  
    axios.post(`${API_HOST}setting/update/${settingData._id}`, formData, {
      headers: {
        'Authorization': `Bearer ${cookie._token}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(res => {
      dispatch(addInfo({ field: 'settingUpdate', value: 'not-updated' }));
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
        ...settingData, language:e.target.value
    })
  }

  // Handle Image Upload
  const handleFavIcon = (e) => {
    setFavIcon(e.target.files[0]);
  };
  const handleIcon = (e) => {
    setLogo(e.target.files[0]);
  };

  const handleMetaImage = (e) => {
    setMetaImage(e.target.files[0]);
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
              <div className='flex gap-10'>
                <div className='w-1/3'>
                <Textinput
                  label="Title"
                  id="pn2"
                  type="text"
                  placeholder="Type Your Website Title"
                  defaultValue={settingData.title}
                  onChange={(e) => setSettingData({...settingData, title:e.target.value})}
                />
                <Textarea
                  label="Description"
                  id="pn2"
                  type="text"
                  placeholder="Type Your Website Description"
                  defaultValue={settingData.description}
                  onChange={(e) => setSettingData({...settingData, description:e.target.value})}
                />
                <Textinput
                  label="Google Analytics Id"
                  id="pn2"
                  type="text"
                  placeholder="Type Your Google Analytics Id"
                  defaultValue={settingData.google_analytics_id}
                  onChange={(e) => setSettingData({...settingData, google_analytics_id:e.target.value})}
                />
                <Select
                  options={["english", "bangla"]}
                  label="Page Category"
                  value={settingData.value}
                  onChange={handleOptionChange}
                />
                </div>
                <div className='w-1/3'>
                  <p className='mt-3 mb-1'>Fav Icon</p>
                  <Fileinput
                    name="fav_icon"
                    selectedFile={favIcon}
                    onChange={handleFavIcon}
                  />
                  <span className="block text-base font-medium tracking-[0.01em] dark:text-slate-300 text-slate-500 mb-3">
                    Previous Image :
                  </span>
                  <div className='flex justify-center'>
                    <Image
                      src={`/public/upload/setting/${settingData.fav_icon}`}
                      alt="fav_icon"
                      className="rounded-md w-[90%]"
                    />
                  </div>
                  
                </div>
                <div className='w-1/3'>
                <p className='mt-3 mb-1'>Logo</p>
                  <Fileinput
                    name="logo"
                    selectedFile={logo}
                    onChange={handleIcon}
                  />
                  <span className="block text-base font-medium tracking-[0.01em] dark:text-slate-300 text-slate-500 mb-3">
                    Previous Image :
                  </span>
                  <div className='flex justify-center'>
                    <Image
                      src={`/public/upload/setting/${settingData.logo}`}
                      alt="logo"
                      className="rounded-md w-[90%]"
                    />
                  </div>
                </div>
              </div>
            </Tab.Panel>

            {/* Contact */}
            <Tab.Panel>
                <Textinput
                  label="Email"
                  id="pn2"
                  type="text"
                  placeholder="Type Your Email"
                  defaultValue={settingData.email}
                  onChange={(e) => setSettingData({...settingData, email:e.target.value})}
                />
              <div className='flex gap-10'>
                <div className='w-2/4'>
                <p>Bangladesh</p>
                  <Textinput
                    label="Phone"
                    id="pn2"
                    type="text"
                    placeholder="Type Your Phone"
                    defaultValue={settingData.phone}
                    onChange={(e) => setSettingData({...settingData, phone:e.target.value})}
                  />
                  <Textinput
                    label="Address"
                    id="pn2"
                    type="text"
                    placeholder="Type Your Address"
                    defaultValue={settingData.address}
                    onChange={(e) => setSettingData({...settingData, address:e.target.value})}
                  />
                  <Textinput
                    label="City"
                    id="pn2"
                    type="text"
                    placeholder="Type Your City"
                    defaultValue={settingData.city}
                    onChange={(e) => setSettingData({...settingData, city:e.target.value})}
                  />
                  <Textinput
                    label="Country"
                    id="pn2"
                    type="text"
                    placeholder="Type Your Country"
                    defaultValue={settingData.country}
                    onChange={(e) => setSettingData({...settingData, country:e.target.value})}
                  />
                  <Textinput
                    label="Map Url"
                    id="pn2"
                    type="text"
                    placeholder="Type Your Map Url"
                    defaultValue={settingData.map_url}
                    onChange={(e) => setSettingData({...settingData, map_url:e.target.value})}
                  />
                  <Textinput
                    label="Map Share Link"
                    id="pn2"
                    type="text"
                    placeholder="Type Your Map Share Link"
                    defaultValue={settingData.map_share}
                    onChange={(e) => setSettingData({...settingData, map_share:e.target.value})}
                  />
                </div>
                <div className='w-2/4'>
                <p>United Kingdom</p>
                  <Textinput
                    label="UK Phone"
                    id="pn2"
                    type="text"
                    placeholder="Type Your UK Phone"
                    defaultValue={settingData.uk_phone}
                    onChange={(e) => setSettingData({...settingData, uk_phone:e.target.value})}
                  />
                  <Textinput
                    label="UK Address"
                    id="pn2"
                    type="text"
                    placeholder="Type Your UK Address"
                    defaultValue={settingData.uk_address}
                    onChange={(e) => setSettingData({...settingData, uk_address:e.target.value})}
                  />
                  <Textinput
                    label="UK City"
                    id="pn2"
                    type="text"
                    placeholder="Type Your UK City"
                    defaultValue={settingData.uk_city}
                    onChange={(e) => setSettingData({...settingData, uk_city:e.target.value})}
                  />
                  <Textinput
                    label="UK Country"
                    id="pn2"
                    type="text"
                    placeholder="Type Your UK Country"
                    defaultValue={settingData.uk_country}
                    onChange={(e) => setSettingData({...settingData, uk_country:e.target.value})}
                  />
                  <Textinput
                    label="UK Map Url"
                    id="pn2"
                    type="text"
                    placeholder="Type Your UK Map Url"
                    defaultValue={settingData.uk_map_url}
                    onChange={(e) => setSettingData({...settingData, uk_map_url:e.target.value})}
                  />
                  <Textinput
                    label="Uk Map Share Link"
                    id="pn2"
                    type="text"
                    placeholder="Type Your Uk Map Share Link"
                    defaultValue={settingData.uk_map_share}
                    onChange={(e) => setSettingData({...settingData, uk_map_share:e.target.value})}
                  />
                </div>
              </div>
            </Tab.Panel>

            {/* Socal */}
            <Tab.Panel>
              <Textinput
                label="Facebook"
                id="pn2"
                type="text"
                placeholder="Type Your Facebook Link"
                defaultValue={settingSocalData.facebook}
                onChange={(e) => setSettingSocalData({...settingSocalData, facebook:e.target.value})}
              />
              <Textinput
                label="Linkedin"
                id="pn2"
                type="text"
                placeholder="Type Your Linkedin Link"
                defaultValue={settingSocalData.linkedin}
                onChange={(e) => setSettingSocalData({...settingSocalData, linkedin:e.target.value})}
              />
              <Textinput
                label="Pinterest"
                id="pn2"
                type="text"
                placeholder="Type Your Pinterest Link"
                defaultValue={settingSocalData.pinterest}
                onChange={(e) => setSettingSocalData({...settingSocalData, pinterest:e.target.value})}
              />
            </Tab.Panel>

            {/* Meta */}
            <Tab.Panel>
              <div className='flex w-100 justify-items-between gap-10'>
                <div className='w-2/4'>
                <Textinput
                  label="Meta Title"
                  id="pn3"
                  placeholder=" Type Meta Title"
                  type="text"
                  defaultValue={settingMetaData.title}
                  onChange={(e) => setSettingMetaData({...settingMetaData, title:e.target.value, og_title:e.target.value, twitter_title: e.target.value})}
                />
                <Textarea
                    label="Meta Description"
                    id="pn4"
                    placeholder="Type Meta Description"
                    defaultValue={settingMetaData.description}
                    onChange={(e) => setSettingMetaData({...settingMetaData, description:e.target.value, og_description:e.target.value, twitter_description: e.target.value})}
                />
                <p className='mt-3'>Property: og:image</p>
                  <Fileinput
                    name="og_image"
                    selectedFile={metaImage}
                    onChange={handleMetaImage}
                  />
                </div>
                <div className='w-2/4'>
                  <span className="block text-base font-medium tracking-[0.01em] dark:text-slate-300 text-slate-500 mb-3">
                    Previous Image :
                  </span>
                  <div className='flex justify-center'>
                    <Image
                      src={`/public/upload/setting/${settingMetaData.og_image}`}
                      alt="default og_image"
                      className="rounded-md w-[90%]"
                    />
                  </div>
                </div>
              </div>
            
              <h5 className='mt-5'>Meta Tags</h5>
            <div className='flex w-100 gap-10'>

              <div className='w-1/3'>
                <Textinput
                  label="Og Title"
                  id="pn3"
                  placeholder="Type Your Og Title"
                  type="text"
                  defaultValue={settingMetaData.og_title}
                  onChange={(e) => setSettingMetaData({...settingMetaData, og_title:e.target.value})}
                />
                <Textarea
                  label="Og Description"
                  id="pn4"
                  placeholder="Type Your Og Description"
                  defaultValue={settingMetaData.og_description}
                  onChange={(e) => setSettingMetaData({...settingMetaData, og_description:e.target.value})}
                />
                <Textinput
                  label="Og Site Name"
                  id="pn4"
                  placeholder="Type Your Og Site Name"
                  defaultValue={settingMetaData.og_site_name}
                  onChange={(e) => setSettingMetaData({...settingMetaData, og_site_name:e.target.value})}
                />
                <Textinput
                  label="Og Type"
                  id="pn3"
                  placeholder="Type Your Og Type"
                  type="text"
                  defaultValue={settingMetaData.og_type}
                  onChange={(e) => setSettingMetaData({...settingMetaData, og_type:e.target.value})}
                />
              </div>
              <div className='w-1/3'>
              <Textinput
                  label="Og Url"
                  id="pn3"
                  placeholder="Type Your Og Url"
                  type="text"
                  defaultValue={settingMetaData.og_url}
                  onChange={(e) => setSettingMetaData({...settingMetaData, og_url:e.target.value})}
                />
              <Textinput
                  label="Twitter Card"
                  id="pn4"
                  placeholder="Type Your Twitter Card"
                  defaultValue={settingMetaData.twitter_card}
                  onChange={(e) => setSettingMetaData({...settingMetaData, twitter_card:e.target.value})}
                />
                <Textinput
                  label="Twitter Title"
                  id="pn3"
                  placeholder="Type Your Twitter Title"
                  type="text"
                  defaultValue={settingMetaData.twitter_title}
                  onChange={(e) => setSettingMetaData({...settingMetaData, twitter_title:e.target.value})}
                />
                <Textarea
                  label="Twitter Description"
                  id="pn3"
                  placeholder="Type Your Twitter Description"
                  type="text"
                  defaultValue={settingMetaData.twitter_description}
                  onChange={(e) => setSettingMetaData({...settingMetaData, twitter_description:e.target.value})}
                />
              </div>
              <div className='w-1/3'>
                <Textinput
                  label="Twitter Url"
                  id="pn3"
                  placeholder="Type Your Twitter Url"
                  type="text"
                  defaultValue={settingMetaData.twitter_url}
                  onChange={(e) => setSettingMetaData({...settingMetaData, twitter_url:e.target.value})}
                />
              </div>
            </div>
            </Tab.Panel>

            {/* Popup */}
            <Tab.Panel>
            <div>
            <label htmlFor="" className='pb-3'>Page Active</label>
              <Switch
                label="Page Active Status"
                activeClass="bg-danger-500"
                value={settingData.popup}
                onChange={() => setSettingData({...settingData, popup: !settingData.popup})}
              />
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

export default GenarelSetting