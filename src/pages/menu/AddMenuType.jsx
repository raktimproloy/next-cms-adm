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
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

let schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  alias: yup.string().required("Alias is required"),
});


function AddMenuType() {
  const [menuData, setMenuData] = useState({
    title: "",
    alias: "",
    status: true,
    template: "",
  })
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showLoading, setShowLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    //
    mode: "all",
  });

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
      setErrorMessage(err.response.data.error)
      setShowLoading(false)
      if(err.response.data.error === "Authentication error!"){
          removeCookie("_token")
      }
    });
  }

  return (
    <div>
        <Popup showLoading={showLoading} popupText={"Menu Type Adding..."}  />
        <Card title="Add Menu Type">
          <form onSubmit={handleSubmit(saveHandler)}>
          <div className="space-y-3">
            <Textinput
              label="Menu Title"
              id="pn"
              type="text"
              name="title"
              register={register}
              error={errors.title}
              placeholder="Type Your Menu Title"
              onChange={(e) => setMenuData({...menuData, title:e.target.value, alias: e.target.value.replace(/ /g, "-").toLowerCase()})}
            />
            <Textinput
              label="Menu Alias"
              className={errorMessage.includes("dup key") && "border-1 dark:border-red-700"}
              id="pn2"
              type="text"
              placeholder="Type Your Menu Slug"
              name="alias"
              register={register}
              error={errors.alias}
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
              onChange={(e) => setMenuData({...menuData, template:e.target.value})}
            />
            <div>
              <label htmlFor="" className='pb-3'>Menu Status</label>
              <Switch
                label="Menu Active Status"
                activeClass="bg-danger-500"
                value={menuData.status}
                onChange={() => setMenuData({...menuData, status: !menuData.status})}
              />
            </div>
          </div>
          <div className='text-right mt-5'>
            <Button type="submit" text="Save" className="btn-warning py-2"/>
          </div>
          </form>
      </Card>
    </div>
  )
}

export default AddMenuType