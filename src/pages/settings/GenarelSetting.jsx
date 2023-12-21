import React, { Fragment, useEffect, useState } from 'react'
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
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

  const [settingData, setSettingData] = useState({})
  const [settingMetaData, setSettingMetaData] = useState({})
  const [settingSocalData, setSettingSocalData] = useState({})


  useEffect(() => {
    axios.get(`${API_HOST}setting/get`)
    .then(res => {
      setSettingData(res.data)
      setSettingMetaData(res.data.meta_property)
      setSettingSocalData(res.data.socal_media)
    })
    .catch(err => {
      console.log(err)
    })
  }, [])

  const editHandler = () => {
    const updatedData = {
      ...settingData,
      meta_property: settingMetaData,
      socal_media: settingSocalData
    }
    
    axios.post(`${API_HOST}setting/update/${settingData._id}`, updatedData)
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      console.log(err)
    })
  }


  return (
    <>
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
                <Textinput
                  label="Language"
                  id="pn2"
                  type="text"
                  placeholder="Type Your Language"
                  defaultValue={settingData.language}
                  onChange={(e) => setSettingData({...settingData, language:e.target.value})}
                />
                </div>
                <div className='w-1/3'>
                  <p className='mt-3 mb-1'>Fav Icon</p>
                  <Fileinput
                    name="og_image"
                    // selectedFile={selectedFile}
                    // onChange={handleFileChange}
                  />
                  <span className="block text-base font-medium tracking-[0.01em] dark:text-slate-300 text-slate-500 mb-3">
                    Previous Image :
                  </span>
                  <div className='flex justify-center'>
                    <Image
                      src={image2}
                      alt="Small image with fluid:"
                      className="rounded-md w-[90%]"
                    />
                  </div>
                  
                </div>
                <div className='w-1/3'>
                <p className='mt-3 mb-1'>Logo</p>
                  <Fileinput
                    name="og_image"
                    // selectedFile={selectedFile}
                    // onChange={handleFileChange}
                  />
                  <span className="block text-base font-medium tracking-[0.01em] dark:text-slate-300 text-slate-500 mb-3">
                    Previous Image :
                  </span>
                  <div className='flex justify-center'>
                    <Image
                      src={image2}
                      alt="Small image with fluid:"
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
                  onChange={(e) => setSettingMetaData({...settingMetaData, title:e.target.value})}
                />
                <Textarea
                    label="Meta Description"
                    id="pn4"
                    placeholder="Type Meta Description"
                    defaultValue={settingMetaData.description}
                    onChange={(e) => setSettingMetaData({...settingMetaData, description:e.target.value})}
                />
                <p className='mt-3'>Property: og:image</p>
                  <Fileinput
                    name="og_image"
                    // selectedFile={selectedFile}
                    // onChange={handleFileChange}
                  />
                </div>
                <div className='w-2/4'>
                  <span className="block text-base font-medium tracking-[0.01em] dark:text-slate-300 text-slate-500 mb-3">
                    Previous Image :
                  </span>
                  <div className='flex justify-center'>
                    <Image
                      src={image2}
                      alt="Small image with fluid:"
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
              <Textarea
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
                <Textinput
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