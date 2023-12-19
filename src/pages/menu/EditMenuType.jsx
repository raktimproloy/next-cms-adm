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

    // Get data
    useEffect(() => {
      axios.get(`${API_HOST}page/${params.slug}`, {
        headers: headers
        })
        .then((res) => {
            setPageData(res.data)
        })
        .catch((err) => {
        console.log(err)
        });
    }, [])

//   Edit Data
  const editHandler = () => {
    setShowLoading(true)
    const formData = new FormData()

    formData.append("title", pageData.title)
    formData.append("slug", pageData.slug)
    formData.append("active", pageData.active)
    formData.append("order", pageData.order)
    formData.append("menu_type", pageData.menu_type)
    formData.append("published_date", pageData.published_date)
    formData.append("template_category", pageData.template_category)
    formData.append("template", pageData.template)
    formData.append("meta_title", pageData.meta_title)
    formData.append("meta_description", pageData.meta_description)

    if(pageData.template_category === "Grapesjs" || (pageData.template_category === "Predesign" && pageData.template !== "") ){
      axios.post(`${API_HOST}page/update/${params.slug}`, formData, {
          headers: headers
      })
      .then((res) => {
          dispatch(addInfo({ field: 'pageUpdate', value: 'not-updated' }));
          setShowLoading(false)
          navigate("/pages")
      })
      .catch((err) => {
          console.log(err)
          setShowLoading(false)
          if(err.response.data.error === "Authentication error!"){
          removeCookie("_token")
          }
      });
    }
  }

  // Selection Handler
  function handleOptionChange(e) {
    setPageData({
        ...pageData, template_category:e.target.value
    })
  }

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  function handleMenuChange(e) {
    setPageData({
        ...pageData, menu_type:(e.target.value).toLowerCase().replace(" ", "-")
    })
  }

  return (
    <div>
        <Popup showLoading={showLoading} popupText={"Role Adding..."}  />
        <Card title="Page Edit">
        <Tab.Group>
          <Tab.Panels>
            <Tab.Panel>
            <Textinput
                label="Page Title"
                id="pn"
                type="text"
                placeholder="Type Your Page Title"
                defaultValue={pageData.title}
                onChange={(e) => setPageData({...pageData, title:e.target.value, slug: e.target.value.replace(/ /g, "-").toLowerCase()})}
            />
            <Select
                options={["Predesign", "Grapesjs"]}
                label="Page Category"
                value={pageData.template_category}
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
              label="Predesign Page"
              id="pn2"
              type="text"
              placeholder="Type Your Page Slug"
              defaultValue={pageData.template}
              onChange={(e) => setPageData({...pageData, template:e.target.value})}
            />
            <Textinput
              label="Page Order"
              id="pn2"
              type="number"
              placeholder="Type Your Template File Name"
              defaultValue={pageData.order}
              onChange={(e) => setPageData({...pageData, order:e.target.value})}
            />
            <Select
              options={["Top Menu", "Side Menu", "Footer Menu"]}
              label="Menu Type"
              defaultValue={pageData.menu_type}
              onChange={handleMenuChange}
            />
            {/* <div>
                <label htmlFor="" className='pb-3'>Page Active</label>
                <Switch
                label="Page Active Status"
                activeClass="bg-danger-500"
                value={pageData.active}
                onChange={() => setPageData({...pageData, active: !pageData.active})}
                />
            </div> */}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
        <div className='flex justify-between items-center mt-5'>
        <Button text="Edit Page" className="btn-warning py-2" onClick={() => {
            navigate(`/pages/editor/${params.slug}`)
          }}  />
          <Button text="Save" className="btn-success py-2" onClick={() => {
            editHandler()
          }}  />
        </div>
      </Card>
    </div>
  )
}

export default EditMenuType