import React, { useEffect, useState } from 'react'
import Card from "@/components/ui/Card"
import Textinput from "@/components/ui/Textinput"
import Select from "@/components/ui/Select"
import Textarea from "@/components/ui/Textarea"
import Switch from "@/components/ui/Switch"
import Button from "@/components/ui/Button"
import axios from 'axios'
import { API_HOST } from '@/utils'
import { useCookies } from 'react-cookie'
import Popup from "@/components/ui/Popup"
import { useDispatch } from 'react-redux'
import { addInfo } from '../../store/layout'
import { useNavigate } from 'react-router-dom'
import { createPage } from "@/store/actions/pageAction";


function AddMenu() {
  const [menuData, setMenuData] = useState({
    title: "",
    alias: "",
    status: false,
    template: "",
    date: "17 December, 2023",
  })
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showLoading, setShowLoading] = useState(false)

  // Cookies
  const [cookie, removeCookie] = useCookies()
  const headers = {
  'Authorization': `Bearer ${cookie._token}`
  }
  const saveHandler = () => {
    setShowLoading(true)
    axios.post(`${API_HOST}menu/add`, menuData, {
      headers: headers
    })
    .then((res) => {
      dispatch(addInfo({ field: 'menuUpdate', value: 'not-updated' }));
      setShowLoading(false)
      setTimeout(() => {
        navigate("/menu/menu-type")
      }, 500);
    })
    .catch((err) => {
      setShowLoading(false)
      if(err.response.data.error === "Authentication error!"){
          removeCookie("_token")
      }
    });
  }

  // Selection Handler
  // function handleOptionChange(e) {
  //   setPageData({
  //       ...pageData, template_category:e.target.value
  //   })
  // }

  return (
    <div>
        <Popup showLoading={showLoading} popupText={"Role Adding..."}  />
        <Card title="Add Page">
        <div className="space-y-3">
          <Textinput
            label="Menu Title"
            id="pn"
            type="text"
            placeholder="Type Your Page Title"
            onChange={(e) => setMenuData({...menuData, title:e.target.value, alias: e.target.value.replace(/ /g, "-").toLowerCase()})}
          />
          {/* <Select
            options={["Predesign", "Grapesjs"]}
            label="Page Category"
            onChange={handleOptionChange}
          /> */}
          <Textinput
            label="Menu Alias"
            id="pn2"
            type="text"
            placeholder="Type Your Page Slug"
            defaultValue={menuData.alias}
            onChange={(e) => setMenuData({...menuData, alias:e.target.value})}
          />
          <Textinput
            label="Template"
            id="pn2"
            type="text"
            placeholder="Type Your Template File Name"
            onChange={(e) => setMenuData({...menuData, template:e.target.value})}
          />
          <div>
            <label htmlFor="" className='pb-3'>Menu Status</label>
            <Switch
              label="Page Active Status"
              activeClass="bg-danger-500"
              value={menuData.status}
              onChange={() => setMenuData({...menuData, status: !menuData.status})}
            />
          </div>
        </div>
        <div className='text-right mt-5'>
          <Button text="Save" className="btn-warning py-2" onClick={() => {
            saveHandler()
          }}  />
        </div>
      </Card>
    </div>
  )
}

export default AddMenu