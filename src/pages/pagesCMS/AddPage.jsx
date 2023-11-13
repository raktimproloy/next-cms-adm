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
    published_date: "23 March, 2024",
    category: "Predesign",
    predesign: "",
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
    axios.post(`${API_HOST}page/add`, pageData, {
      headers: headers
    })
    .then((res) => {
      dispatch(addInfo({ field: 'pageUpdate', value: 'not-updated' }));
      setShowLoading(false)
      createPage(pageData.title)(dispatch);
      navigate("/pages")
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
        ...pageData, category:e.target.value
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
          <Textinput
            label="Page Slug"
            id="pn2"
            type="text"
            placeholder="Type Your Page Slug"
            defaultValue={pageData.slug}
            onChange={(e) => setPageData({...pageData, slug:e.target.value})}
          />
          <Textinput
            label="Predesign Page"
            id="pn2"
            type="text"
            placeholder="Type Your Page Slug"
            onChange={(e) => setPageData({...pageData, predesign:e.target.value})}
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
          <Textinput
            label="Meta Title"
            id="pn3"
            placeholder=" Disabled Input"
            type="text"
            onChange={(e) => setPageData({...pageData, meta_title:e.target.value})}
          />
          <Textarea
            label="Meta Description"
            id="pn4"
            placeholder="Type Meta Description"
            onChange={(e) => setPageData({...pageData, meta_description:e.target.value})}
          />
          <Select
            options={["Predesign", "Grapesjs"]}
            label="Page Category"
            onChange={handleOptionChange}
          />
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