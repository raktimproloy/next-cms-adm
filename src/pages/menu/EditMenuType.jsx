import React, { useEffect, useState, Fragment } from 'react'
import Card from "@/components/ui/Card"
import Textinput from "@/components/ui/Textinput"
import Select from "@/components/ui/Select"
import Textarea from "@/components/ui/Textarea"
import Fileinput from "@/components/ui/Fileinput"
import Switch from "@/components/ui/Switch"
import Button from "@/components/ui/Button"
import Image from "@/components/ui/Image"
import axios from 'axios'
import { API_HOST } from '@/utils'
import { useCookies } from 'react-cookie'
import Popup from "@/components/ui/Popup"
import { useDispatch } from 'react-redux'
import { addInfo } from '../../store/layout'
import { useNavigate, useParams } from 'react-router-dom'
import { Tab } from "@headlessui/react";
import image2 from "@/assets/images/all-img/image-2.png";


function EditMenuType() {
  const params = useParams()
  const [menuData, setMenuData] = useState({
    title: "",
    alias: "",
    status: false,
    template: "",
  })

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showLoading, setShowLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  // Cookies
  const [cookie, removeCookie] = useCookies()
  const headers = {
  'Authorization': `Bearer ${cookie._token}`
  }

    // Get data
    useEffect(() => {
      axios.get(`${API_HOST}menu/${params.alias}`, {
        headers: headers
        })
        .then((res) => {
          setMenuData(res.data)
        })
        .catch((err) => {
          console.log(err)
        });
    }, [])

//   Edit Data
  const editHandler = () => {
    setShowLoading(true)

    axios.post(`${API_HOST}menu/update/${params.alias}`, menuData, {
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
      setErrorMessage(err.response.data.error)
      setShowLoading(false)
      if(err.response.data.error === "Authentication error!"){
          removeCookie("_token")
      }
    });
  }

  return (
    <div>
        <Popup showLoading={showLoading} popupText={"Menu Type Updating..."}  />
        <Card title="Menu Type Edit">
        <Tab.Group>
          <Tab.Panels>
            <Tab.Panel>
            <Textinput
              label="Menu Title"
              id="pn"
              type="text"
              placeholder="Type Your Menu Title"
              defaultValue={menuData.title}
              onChange={(e) => setMenuData({...menuData, title:e.target.value, alias: e.target.value.replace(/ /g, "-").toLowerCase()})}
            />
            {/* <Select
                options={["Predesign", "Grapesjs"]}
                label="Page Category"
                value={pageData.template_category}
                onChange={handleOptionChange}
            /> */}
            <Textinput
              label="Menu Alias"
              className={errorMessage.includes("dup key") ? "border-1 dark:border-red-700" : ""}
              id="pn2"
              type="text"
              placeholder="Type Your Menu Slug"
              defaultValue={menuData.alias}
              onChange={(e) => setMenuData({...menuData, alias:e.target.value})}
            />
            {
              errorMessage.includes("dup key") &&
              <p className='text-red-500 text-sm'>This alias already used!</p>
            }
            <Textinput
              label="Template"
              id="pn2"
              type="text"
              placeholder="Type Your Menu Template"
              defaultValue={menuData.template}
              onChange={(e) => setMenuData({...menuData, template:e.target.value})}
            />
            <div>
              <label htmlFor="" className='pb-3'>Menu Status</label>
              <Switch
                label="Menu Active Status"
                activeClass="bg-danger-500"
                value={menuData.status || false}
                onChange={() => setMenuData({...menuData, status: !menuData.status})}
              />
            </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
        <div className='text-right mt-5'>
          <Button text="Edit" className="btn-warning py-2" onClick={() => {
            editHandler()
          }}  />
        </div>
      </Card>
    </div>
  )
}

export default EditMenuType