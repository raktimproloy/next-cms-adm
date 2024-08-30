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
import {AddLog} from "@/utils/logHandler"
import { StoreSettingImage } from '@/utils/appwrite/StoreImage';
import MessagePopup from "@/components/ui/Popup/MessagePopup"
import { ToastContainer, toast } from 'react-toastify'

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
    title: "Social",
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
  {
    title: "Storage",
    icon: "heroicons-outline:cog",
  },
  {
    title: "Email",
    icon: "heroicons-outline:cog",
  },
];

function GenarelSetting() {
  const [showLoading, setShowLoading] = useState(false)
  const [settingData, setSettingData] = useState({})
  const [settingMetaData, setSettingMetaData] = useState({})
  const [settingStorageData, setSettingStorageData] = useState({})
  const [settingEmailData, setSettingEmailData] = useState({})
  const [settingSocalData, setSettingSocalData] = useState({})
  const [favIcon, setFavIcon] = useState(null)
  const [logo, setLogo] = useState(null)
  const [metaImage, setMetaImage] = useState(null)
  const dispatch = useDispatch()

  // Cookies
  const [cookie, removeCookie] = useCookies()
  const data = useSelector((state) => state.setting);
  const updateInfo = useSelector((state) => state.update);
  const profileData = useSelector((state) => state.profile);
  
  const AppwriteUrl = settingData?.storage_config?.storage_url
  useEffect(() => {
    if (updateInfo.settingUpdate === "" || updateInfo.settingUpdate === "not-updated") {
        getSetting(dispatch, cookie, removeCookie);
    }
  }, [dispatch, settingData, updateInfo]);

  useEffect(() => {
    setSettingData({})
    // if(Object.keys(settingData).length === 0){
      setSettingData(data)
      setSettingMetaData(data.meta_property)
      setSettingSocalData(data.socal_media)
      setSettingStorageData(data.storage_config)
      setSettingEmailData(data.email_config)
    // }
  }, [data])




  const editHandler = async () => {
    setShowLoading(true)
    try {
      let logoURL = settingData.logo
      let fav_iconURL = settingData.fav_icon
      let meta_imageURL = settingMetaData.og_image
      if(logo){
        logoURL = await StoreSettingImage(logo, settingData?.storage_config?.storage_setting_bucket_id);
      }
      if(favIcon){
        fav_iconURL = await StoreSettingImage(favIcon, settingData?.storage_config?.storage_setting_bucket_id);
      }
      if(metaImage){
        meta_imageURL = await StoreSettingImage(metaImage, settingData?.storage_config?.storage_setting_bucket_id);
      }

      const formData = new FormData();
  
      formData.append("title", settingData.title);
      formData.append("description", settingData.description);
      formData.append("fav_icon", fav_iconURL);
      formData.append("logo", logoURL);
      formData.append("tiny_mce", settingData.tinyMce);
      formData.append("newslater", settingData.newslater);
      formData.append("phone", settingData.phone)
      formData.append("uk_phone", settingData.uk_phone)
      formData.append("email", settingData.email)
      formData.append("whatsapp", settingData.whatsapp)
      formData.append("uk_whatsapp", settingData.uk_whatsapp)
      formData.append("address", settingData.address)
      formData.append("uk_address", settingData.uk_address)
      formData.append("city", settingData.city)
      formData.append("uk_city", settingData.uk_city)
      formData.append("country", settingData.country)
      formData.append("uk_country", settingData.uk_country)
      formData.append("map_lat", settingData.map_lat)
      formData.append("map_lng", settingData.map_lng)
      formData.append("uk_map_lat", settingData.uk_map_lat)
      formData.append("uk_map_lng", settingData.uk_map_lng)
      formData.append("map_share", settingData.map_share)
      formData.append("uk_map_share", settingData.uk_map_share)
      formData.append("google_analytics_id", settingData.google_analytics_id)
      formData.append("blog_show_amount", settingData.blog_show_amount)
      formData.append("language", settingData.language)
      formData.append("popup", settingData.popup)
      formData.append("meta_image", meta_imageURL)
      formData.append("meta_property", JSON.stringify(settingMetaData))
      formData.append("socal_media", JSON.stringify(settingSocalData))
      formData.append("storage_config", JSON.stringify(settingStorageData))
      formData.append("email_config", JSON.stringify(settingEmailData))
      
      axios.post(`${API_HOST}setting/update/${settingData._id}`, formData, {
        headers: {
          'Authorization': `Bearer ${cookie._token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(res => {
        AddLog(profileData.email, "Setting", `Setting Updated Successful`)
        dispatch(addInfo({ field: 'settingUpdate', value: 'not-updated' }));
        setShowLoading(false)
        // setShowMessagePopup(true)
        toast.success("Setting Updated Successful!", {
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
      .catch(err => {
        console.log(err);
        if(err.response.data.error === "Authentication error!"){
          removeCookie("_token")
          AddLog(profileData.email, "Setting", `Setting Updated Failed For Authorization`)
        }else{
          AddLog(profileData.email, "Setting", `Setting Deleted Unsuccessful`)
        }
        setShowLoading(false)
        toast.error("Setting Updated Unsuccessful!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
    } catch (error) {
        toast.error("Setting Updated Unsuccessful!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
    }
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
    {/* <ToastContainer/> */}
      <Popup showLoading={showLoading} popupText={"Setting Updating..."}  />
      <Card title="Genarel Setting">
        <Tab.Group>
          <Tab.List className="lg:space-x-6 md:space-x-3 space-x-0 rtl:space-x-reverse mb-5">
            {buttons.map((item, i) => (
              <Tab as={Fragment} key={i}>
                {({ selected }) => (
                  <button
                    className={` text-sm font-medium mb-7last:mb-0 capitalize ring-0 foucs:ring-0 focus:outline-none px-6 rounded-md py-2 transition duration-150
              
                  ${
                    selected
                      ? "text-white bg-primary-500 "
                      : "text-slate-500 bg-white dark:bg-slate-700 dark:text-slate-300"
                  }
                  `}
                  style={{marginRight: "7px"}}
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
              <div className='flex flex-col md:flex-row gap-10'>
                <div className='w-full md:w-1/3'>
                  <Textinput
                    label="Title"
                    id="pn2"
                    type="text"
                    placeholder="Type Your Website Title"
                    defaultValue={settingData.title}
                    onChange={(e) => setSettingData({ ...settingData, title: e.target.value })}
                  />
                  <Textarea
                    label="Description"
                    id="pn2"
                    type="text"
                    placeholder="Type Your Website Description"
                    defaultValue={settingData.description}
                    onChange={(e) => setSettingData({ ...settingData, description: e.target.value })}
                  />
                  <Textinput
                    label="Google Analytics Id"
                    id="pn2"
                    type="text"
                    placeholder="Type Your Google Analytics Id"
                    defaultValue={settingData.google_analytics_id}
                    onChange={(e) => setSettingData({ ...settingData, google_analytics_id: e.target.value })}
                  />
                  <Select
                    options={["english", "bangla"]}
                    label="Page Category"
                    value={settingData.value}
                    onChange={handleOptionChange}
                  />
                </div>
                <div className='w-full md:w-1/3'>
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
                      key={settingData.fav_icon}
                      src={`${AppwriteUrl}${settingData.fav_icon}`}
                      alt="fav_icon"
                      className="rounded-md w-[90%]"
                    />
                  </div>
                </div>
                <div className='w-full md:w-1/3'>
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
                      key={settingData.logo}
                      src={`${AppwriteUrl}${settingData.logo}`}
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
                    onChange={(e) => setSettingData({ ...settingData, email: e.target.value })}
                  />
                  
              <div className='flex flex-col md:flex-row gap-10'>
                <div className='w-full md:w-1/2'>
                  <p>Bangladesh</p>
                  <Textinput
                    label="Phone"
                    id="pn2"
                    type="text"
                    placeholder="Type Your Phone"
                    defaultValue={settingData.phone}
                    onChange={(e) => setSettingData({ ...settingData, phone: e.target.value })}
                  />
                  <Textinput
                    label="Whatsapp"
                    id="pn2"
                    type="text"
                    placeholder="Type Your Whatsapp"
                    defaultValue={settingData.whatsapp}
                    onChange={(e) => setSettingData({ ...settingData, whatsapp: e.target.value })}
                  />
                  <Textinput
                    label="Address"
                    id="pn2"
                    type="text"
                    placeholder="Type Your Address"
                    defaultValue={settingData.address}
                    onChange={(e) => setSettingData({ ...settingData, address: e.target.value })}
                  />
                  <Textinput
                    label="City"
                    id="pn2"
                    type="text"
                    placeholder="Type Your City"
                    defaultValue={settingData.city}
                    onChange={(e) => setSettingData({ ...settingData, city: e.target.value })}
                  />
                  <Textinput
                    label="Country"
                    id="pn2"
                    type="text"
                    placeholder="Type Your Country"
                    defaultValue={settingData.country}
                    onChange={(e) => setSettingData({ ...settingData, country: e.target.value })}
                  />
                  <div className='flex justify-between gap-5'>
                    <div className='w-1/2'>
                    <Textinput
                      label="Map Latitude"
                      id="pn2"
                      type="text"
                      placeholder="Type Your Map Latitude"
                      defaultValue={settingData.map_lat}
                      onChange={(e) => setSettingData({ ...settingData, map_lat: e.target.value })}
                    />
                    </div>
                    <div className='w-1/2'>
                    <Textinput
                      label="Map Longitude "
                      id="pn2"
                      type="text"
                      placeholder="Type Your Map Longitude"
                      defaultValue={settingData.map_lng}
                      onChange={(e) => setSettingData({ ...settingData, map_lng: e.target.value })}
                    />
                    </div>
                  </div>
                  <Textinput
                    label="Map Share Link"
                    id="pn2"
                    type="text"
                    placeholder="Type Your Map Share Link"
                    defaultValue={settingData.map_share}
                    onChange={(e) => setSettingData({ ...settingData, map_share: e.target.value })}
                  />
                </div>
                <div className='w-full md:w-1/2'>
                  <p>United Kingdom</p>
                  <Textinput
                    label="UK Phone"
                    id="pn2"
                    type="text"
                    placeholder="Type Your UK Phone"
                    defaultValue={settingData?.uk_phone}
                    onChange={(e) => setSettingData({ ...settingData, uk_phone: e.target.value })}
                  />
                  <Textinput
                    label="UK Whatsapp"
                    id="pn2"
                    type="text"
                    placeholder="Type Your UK Whatsapp"
                    defaultValue={settingData?.uk_whatsapp}
                    onChange={(e) => setSettingData({ ...settingData, uk_whatsapp: e.target.value })}
                  />
                  <Textinput
                    label="UK Address"
                    id="pn2"
                    type="text"
                    placeholder="Type Your UK Address"
                    defaultValue={settingData.uk_address}
                    onChange={(e) => setSettingData({ ...settingData, uk_address: e.target.value })}
                  />
                  <Textinput
                    label="UK City"
                    id="pn2"
                    type="text"
                    placeholder="Type Your UK City"
                    defaultValue={settingData.uk_city}
                    onChange={(e) => setSettingData({ ...settingData, uk_city: e.target.value })}
                  />
                  <Textinput
                    label="UK Country"
                    id="pn2"
                    type="text"
                    placeholder="Type Your UK Country"
                    defaultValue={settingData.uk_country}
                    onChange={(e) => setSettingData({ ...settingData, uk_country: e.target.value })}
                  />
                  <div className='flex justify-between gap-5'>
                    <div className='w-1/2'>
                    <Textinput
                      label="UK Map Latitude"
                      id="pn2"
                      type="text"
                      placeholder="Type Your UK Map Latitude"
                      defaultValue={settingData.uk_map_lat}
                      onChange={(e) => setSettingData({ ...settingData, uk_map_lat: e.target.value })}
                    />
                    </div>
                    <div className='w-1/2'>
                    <Textinput
                      label="UK Map Longitude "
                      id="pn2"
                      type="text"
                      placeholder="Type Your UK Map Longitude"
                      defaultValue={settingData.uk_map_lng}
                      onChange={(e) => setSettingData({ ...settingData, uk_map_lng: e.target.value })}
                    />
                    </div>
                  </div>
                  <Textinput
                    label="Uk Map Share Link"
                    id="pn2"
                    type="text"
                    placeholder="Type Your Uk Map Share Link"
                    defaultValue={settingData.uk_map_share}
                    onChange={(e) => setSettingData({ ...settingData, uk_map_share: e.target.value })}
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
                defaultValue={settingSocalData?.facebook}
                onChange={(e) => setSettingSocalData({...settingSocalData, facebook:e.target.value})}
              />
              <Textinput
                label="Linkedin"
                id="pn2"
                type="text"
                placeholder="Type Your Linkedin Link"
                defaultValue={settingSocalData?.linkedin}
                onChange={(e) => setSettingSocalData({...settingSocalData, linkedin:e.target.value})}
              />
              <Textinput
                label="Pinterest"
                id="pn2"
                type="text"
                placeholder="Type Your Pinterest Link"
                defaultValue={settingSocalData?.pinterest}
                onChange={(e) => setSettingSocalData({...settingSocalData, pinterest:e.target.value})}
              />
              <Textinput
                label="Youtube"
                id="pn2"
                type="text"
                placeholder="Type Your Youtube Link"
                defaultValue={settingSocalData?.youtube}
                onChange={(e) => setSettingSocalData({...settingSocalData, youtube:e.target.value})}
              />
            </Tab.Panel>

            {/* Meta */}
            <Tab.Panel>
              <div className='flex flex-col md:flex-row w-full gap-10'>
                <div className='w-full md:w-1/2'>
                  <Textinput
                    label="Meta Title"
                    id="pn3"
                    placeholder="Type Meta Title"
                    type="text"
                    defaultValue={settingMetaData.title}
                    onChange={(e) => setSettingMetaData({ ...settingMetaData, title: e.target.value, og_title: e.target.value, twitter_title: e.target.value })}
                  />
                  <Textarea
                    label="Meta Description"
                    id="pn4"
                    placeholder="Type Meta Description"
                    defaultValue={settingMetaData.description}
                    onChange={(e) => setSettingMetaData({ ...settingMetaData, description: e.target.value, og_description: e.target.value, twitter_description: e.target.value })}
                  />
                  <p className='mt-3'>Property: og:image</p>
                  <Fileinput
                    name="og_image"
                    selectedFile={metaImage}
                    onChange={handleMetaImage}
                  />
                </div>
                <div className='w-full md:w-1/2'>
                  <span className="block text-base font-medium tracking-[0.01em] dark:text-slate-300 text-slate-500 mb-3">
                    Previous Image :
                  </span>
                  <div className='flex justify-center'>
                    <Image
                      src={`${AppwriteUrl}${settingMetaData.og_image}`}
                      alt="default og_image"
                      className="rounded-md w-[90%]"
                    />
                  </div>
                </div>
              </div>

              <h5 className='mt-5'>Meta Tags</h5>
              
              <div className='flex flex-col md:flex-row w-full gap-10'>
                <div className='w-full md:w-1/3'>
                  <Textinput
                    label="Og Title"
                    id="pn3"
                    placeholder="Type Your Og Title"
                    type="text"
                    defaultValue={settingMetaData.og_title}
                    onChange={(e) => setSettingMetaData({ ...settingMetaData, og_title: e.target.value })}
                  />
                  <Textarea
                    label="Og Description"
                    id="pn4"
                    placeholder="Type Your Og Description"
                    defaultValue={settingMetaData.og_description}
                    onChange={(e) => setSettingMetaData({ ...settingMetaData, og_description: e.target.value })}
                  />
                  <Textinput
                    label="Og Site Name"
                    id="pn4"
                    placeholder="Type Your Og Site Name"
                    defaultValue={settingMetaData.og_site_name}
                    onChange={(e) => setSettingMetaData({ ...settingMetaData, og_site_name: e.target.value })}
                  />
                  <Textinput
                    label="Og Type"
                    id="pn3"
                    placeholder="Type Your Og Type"
                    type="text"
                    defaultValue={settingMetaData.og_type}
                    onChange={(e) => setSettingMetaData({ ...settingMetaData, og_type: e.target.value })}
                  />
                </div>
                <div className='w-full md:w-1/3'>
                  <Textinput
                    label="Og Url"
                    id="pn3"
                    placeholder="Type Your Og Url"
                    type="text"
                    defaultValue={settingMetaData.og_url}
                    onChange={(e) => setSettingMetaData({ ...settingMetaData, og_url: e.target.value })}
                  />
                  <Textinput
                    label="Twitter Card"
                    id="pn4"
                    placeholder="Type Your Twitter Card"
                    defaultValue={settingMetaData.twitter_card}
                    onChange={(e) => setSettingMetaData({ ...settingMetaData, twitter_card: e.target.value })}
                  />
                  <Textinput
                    label="Twitter Title"
                    id="pn3"
                    placeholder="Type Your Twitter Title"
                    type="text"
                    defaultValue={settingMetaData.twitter_title}
                    onChange={(e) => setSettingMetaData({ ...settingMetaData, twitter_title: e.target.value })}
                  />
                  <Textarea
                    label="Twitter Description"
                    id="pn3"
                    placeholder="Type Your Twitter Description"
                    type="text"
                    defaultValue={settingMetaData.twitter_description}
                    onChange={(e) => setSettingMetaData({ ...settingMetaData, twitter_description: e.target.value })}
                  />
                </div>
                <div className='w-full md:w-1/3'>
                  <Textinput
                    label="Twitter Url"
                    id="pn3"
                    placeholder="Type Your Twitter Url"
                    type="text"
                    defaultValue={settingMetaData.twitter_url}
                    onChange={(e) => setSettingMetaData({ ...settingMetaData, twitter_url: e.target.value })}
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


            {/* Storage */}
            <Tab.Panel>
            <div>
            <label htmlFor="" className='pb-3'>Storage Config</label>
            <div className='block md:flex gap-10'>
              <div className='w-full md:w-1/2'>
              <Textinput
                label="Storage Url"
                id="pn2"
                type="text"
                placeholder="Type Storage Url"
                defaultValue={settingStorageData?.storage_url}
                onChange={(e) => setSettingStorageData({...settingStorageData, storage_url:e.target.value})}
              />
              <Textinput
                label="Storage Endpoint"
                id="pn2"
                type="text"
                placeholder="Type Storage Endpoint"
                defaultValue={settingStorageData?.storage_endpoint}
                onChange={(e) => setSettingStorageData({...settingStorageData, storage_endpoint:e.target.value})}
              />
              <Textinput
                label="Setting Bucket Id"
                id="pn2"
                type="text"
                placeholder="Type Setting Bucket Id"
                defaultValue={settingStorageData?.storage_setting_bucket_id}
                onChange={(e) => setSettingStorageData({...settingStorageData, storage_setting_bucket_id:e.target.value})}
              />
              </div>
              <div className='w-full md:w-1/2'>
              <Textinput
                label="Storage Project Id"
                id="pn2"
                type="text"
                placeholder="Type Storage Project Id"
                defaultValue={settingStorageData?.storage_project_id}
                onChange={(e) => setSettingStorageData({...settingStorageData, storage_project_id:e.target.value})}
              />
              <Textinput
                label="Meta Bucket Id"
                id="pn2"
                type="text"
                placeholder="Type Meta Bucket Id"
                defaultValue={settingStorageData?.storage_meta_bucket_id}
                onChange={(e) => setSettingStorageData({...settingStorageData, storage_meta_bucket_id:e.target.value})}
              />
              </div>
            </div>
              
              
            </div>
            </Tab.Panel>


            {/* Email Config */}
            <Tab.Panel>
            <div>
            <label htmlFor="" className='pb-3'>SMTP</label>
            <div className='flex gap-10 mb-5 mt-2'>
              <div className='w-full md:w-1/2'>
              <Textinput
                  label="DNS"
                  id="pn2"
                  type="text"
                  placeholder="Type SMTP DNS"
                  defaultValue={settingEmailData?.smtp_dns}
                  onChange={(e) => setSettingEmailData({...settingEmailData, smtp_dns:e.target.value})}
                />
                <Textinput
                  label="SMTP User"
                  id="pn2"
                  type="text"
                  placeholder="Type Your SMTP User"
                  defaultValue={settingEmailData?.smtp_user}
                  onChange={(e) => setSettingEmailData({...settingEmailData, smtp_user:e.target.value})}
                />
                
              </div>
              <div className='w-full md:w-1/2'>
              <Textinput
                  label="Port"
                  id="pn2"
                  type="text"
                  placeholder="Type Your Port"
                  defaultValue={settingEmailData?.port}
                  onChange={(e) => setSettingEmailData({...settingEmailData, port:e.target.value})}
                />
                <Textinput
                  label="SMTP Key"
                  id="pn2"
                  type="text"
                  placeholder="Type Your SMTP Key"
                  defaultValue={settingEmailData?.smtp_key}
                  onChange={(e) => setSettingEmailData({...settingEmailData, smtp_key:e.target.value})}
                />
              </div>
            </div>

            <label htmlFor="" className='py-5 '>Email Config</label>
            <div className='flex gap-10 mb-5 mt-2'>
              <div className='w-full md:w-1/2'>
              <Textinput
                  label="From"
                  id="pn2"
                  type="email"
                  placeholder="Type From Email"
                  defaultValue={settingEmailData?.from}
                  onChange={(e) => setSettingEmailData({...settingEmailData, from:e.target.value})}
                />
                <Textinput
                  label="To"
                  id="pn2"
                  type="email"
                  placeholder="Type Your To Email"
                  defaultValue={settingEmailData?.to}
                  onChange={(e) => setSettingEmailData({...settingEmailData, to:e.target.value})}
                />

                
              </div>
              <div className='w-full md:w-1/2'>
                <Textinput
                  label="Default To Email"
                  id="pn2"
                  type="email"
                  placeholder="Type Your Default To Email"
                  defaultValue={settingEmailData?.default_to_email}
                  onChange={(e) => setSettingEmailData({...settingEmailData, default_to_email:e.target.value})}
                />
                <Textinput
                  label="Template Name"
                  id="pn2"
                  type="email"
                  placeholder="Type Your Template Name"
                  defaultValue={settingEmailData?.template_name}
                  onChange={(e) => setSettingEmailData({...settingEmailData, template_name:e.target.value})}
                />
              </div>
            </div>
            
            <label htmlFor="" className='py-5 '>ReCaptcha Config</label>
            <div className='flex gap-10 mb-5 mt-2'>
              <div className='w-full md:w-1/2'>
              <Textinput
                  label="Admin Recaptcha Secret Key"
                  id="pn2"
                  type="email"
                  placeholder="Type Your Admin Recaptcha Secret Key"
                  defaultValue={settingEmailData?.admin_recaptcha_secret_key}
                  onChange={(e) => setSettingEmailData({...settingEmailData, admin_recaptcha_secret_key:e.target.value})}
                />
                <Textinput
                  label="Admin Recaptcha Site Key"
                  id="pn2"
                  type="email"
                  placeholder="Type Your Admin Recaptcha Site Key"
                  defaultValue={settingEmailData?.admin_recaptcha_site_key}
                  onChange={(e) => setSettingEmailData({...settingEmailData, admin_recaptcha_site_key:e.target.value})}
                />
              </div>
              <div className='w-full md:w-1/2'>
              <Textinput
                  label="CMS Recaptcha Secret Key"
                  id="pn2"
                  type="text"
                  placeholder="Type Your CMS Recaptcha Secret Key"
                  defaultValue={settingEmailData?.cms_recaptcha_secret_key}
                  onChange={(e) => setSettingEmailData({...settingEmailData, cms_recaptcha_secret_key:e.target.value})}
                />
                <Textinput
                  label="CMS Recaptcha Site Key"
                  id="pn2"
                  type="text"
                  placeholder="Type Your CMS Recaptcha Site Key"
                  defaultValue={settingEmailData?.cms_recaptcha_site_key}
                  onChange={(e) => setSettingEmailData({...settingEmailData, cms_recaptcha_site_key:e.target.value})}
                />
              </div>
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

export default GenarelSetting