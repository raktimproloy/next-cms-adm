import React, { useEffect, useState, Fragment } from 'react'
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
import { useNavigate, useParams } from 'react-router-dom'
import { Tab } from "@headlessui/react";


const buttons = [
    {
      title: "Page Info",
      icon: "heroicons-outline:home",
    },
    {
      title: "Meta Tags",
      icon: "heroicons-outline:user",
    }
];

function EditPage() {
    const params = useParams()
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

    // Get data
    useEffect(() => {
      console.log("slug check",params.slug)
        axios.get(`${API_HOST}page/${params.slug}`, {
            headers: headers
            })
            .then((res) => {
                setPageData(res.data[0])
            })
            .catch((err) => {
            console.log(err)
            });
    }, [])

//   Edit Data
  const editHandler = () => {
    setShowLoading(true)
    axios.put(`${API_HOST}page/update/${params.slug}`, pageData, {
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

  // Selection Handler
  function handleOptionChange(e) {
    setPageData({
        ...pageData, category:e.target.value
    })
  }

  return (
    <div>
        <Popup showLoading={showLoading} popupText={"Role Adding..."}  />
        <Card title="Default Tabs">
        <Tab.Group>
          <Tab.List className="lg:space-x-8 md:space-x-4 space-x-0 rtl:space-x-reverse">
            {buttons.map((item, i) => (
              <Tab as={Fragment} key={i}>
                {({ selected }) => (
                  <button
                    className={` text-sm font-medium mb-7 capitalize bg-white
             dark:bg-slate-800 ring-0 foucs:ring-0 focus:outline-none px-2
              transition duration-150 before:transition-all before:duration-150 relative 
              before:absolute before:left-1/2 before:bottom-[-6px] before:h-[1.5px] before:bg-primary-500 
              before:-translate-x-1/2 
              
              ${
                selected
                  ? "text-primary-500 before:w-full"
                  : "text-slate-500 before:w-0 dark:text-slate-300"
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
            <Tab.Panel>
            <Textinput
                label="Page Title"
                id="pn"
                type="text"
                placeholder="Type Your Page Title"
                defaultValue={pageData.title}
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
                defaultValue={pageData.predesign}
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
            <Select
                options={["Predesign", "Grapesjs"]}
                label="Page Category"
                value={pageData.category}
                onChange={handleOptionChange}
            />
            
            </Tab.Panel>
            <Tab.Panel>
            <Textinput
                label="Meta Title"
                id="pn3"
                placeholder=" Disabled Input"
                type="text"
                defaultValue={pageData.meta_title}
                onChange={(e) => setPageData({...pageData, meta_title:e.target.value})}
            />
            <Textarea
                label="Meta Description"
                id="pn4"
                placeholder="Type Meta Description"
                defaultValue={pageData.meta_description}
                onChange={(e) => setPageData({...pageData, meta_description:e.target.value})}
            />
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

export default EditPage