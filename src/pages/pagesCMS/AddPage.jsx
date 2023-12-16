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


function AddPage() {
  const [pageData, setPageData] = useState({
    title: "",
    slug: "",
    active: false,
    order: "",
    menu_type: "",
    published_date: "23 March, 2024",
    template_category: "Predesign",
    template: "",
    meta_title: "",
    meta_description: ""
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
    axios.post(`${API_HOST}page/add`, pageData, {
      headers: headers
    })
    .then((res) => {
      dispatch(addInfo({ field: 'pageUpdate', value: 'not-updated' }));
      setShowLoading(false)
      createPage(pageData.title)(dispatch);
      setTimeout(() => {
        if(pageData.template_category === "Predesign"){
          navigate("/pages")
        }else{
          navigate(`/pages/editor/${pageData.slug}`)
        }
      }, 1000);
    })
    .catch((err) => {
      setShowLoading(false)
      if(err.response.data.error === "Authentication error!"){
          removeCookie("_token")
      }
    });
  }

  useEffect(() => {

  }, [])

  // Selection Handler
  function handleOptionChange(e) {
    setPageData({
        ...pageData, template_category:e.target.value
    })
  }
  function handleMenuChange(e) {
    setPageData({
        ...pageData, menu_type:(e.target.value).toLowerCase().replace(" ", "_")
    })
  }

  return (
    <div>
        <Popup showLoading={showLoading} popupText={"Role Adding..."}  />
        <Card title="Add Page">
        <div className="space-y-3">
          <Textinput
            label="Page Title"
            id="pn"
            type="text"
            placeholder="Type Your Page Title"
            onChange={(e) => setPageData({...pageData, title:e.target.value, slug: e.target.value.replace(/ /g, "-").toLowerCase()})}
          />
          <Select
            options={["Predesign", "Grapesjs"]}
            label="Page Category"
            onChange={handleOptionChange}
          />
          <Textinput
            label="Page Slug"
            id="pn2"
            type="text"
            placeholder="Type Your Page Slug"
            defaultValue={pageData.slug}
            onChange={(e) => setPageData({...pageData, slug:e.target.value})}
          />
          <Textinput
            label="Default Template"
            id="pn2"
            readonly={pageData.template_category.toLowerCase() == "predesign" ? false : true}
            type="text"
            placeholder="Type Your Template File Name"
            onChange={(e) => setPageData({...pageData, template:e.target.value})}
          />
          <Textinput
            label="Page Order"
            id="pn2"
            type="number"
            placeholder="Type Your Template File Name"
            onChange={(e) => setPageData({...pageData, order:e.target.value})}
          />
          <Select
            options={["Top Menu", "Side Menu", "Footer Menu"]}
            label="Menu Type"
            onChange={handleMenuChange}
          />
          <div>
            <label htmlFor="" className='pb-3'>Page Active</label>
            <Switch
              label="Page Active Status"
              activeClass="bg-danger-500"
              value={pageData.active}
              onChange={() => setPageData({...pageData, active: !pageData.active})}
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

export default AddPage