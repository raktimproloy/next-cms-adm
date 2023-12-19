import React, { useEffect, useState, Fragment } from 'react'
import Card from "@/components/ui/Card"
import Textinput from "@/components/ui/Textinput"
import Select from "@/components/ui/Select"
import Textarea from "@/components/ui/Textarea"
import { Tab, Disclosure, Transition } from "@headlessui/react";
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
import { useSelector } from 'react-redux'
import { getAllMenus } from '../../utils/getAllMenus'
import MultipleSelect from "@/pages/shared/MultipleSelect"



const buttons = [
    {
      title: "Article",
      icon: "heroicons-outline:home",
    },
    {
      title: "External",
      icon: "heroicons-outline:user",
    },
  ];

function AddMenu() {
  const [pageData, setPageData] = useState({
    title: "",
    slug: "",
    active: false,
    order: "",
    menu_type: [],
    published_date: "23 March, 2024",
    link: "",
  })
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showLoading, setShowLoading] = useState(false)

  const [menuType, setMenuType] = useState([])
  const [selectedMenuType, setSelectedMenuType] = useState([])
  const menuTypeData = useSelector((state) => state.menus);
  const updateInfo = useSelector((state) => state.update);

  // Cookies
  const [cookie, removeCookie] = useCookies()
  const headers = {
  'Authorization': `Bearer ${cookie._token}`
  }

  useEffect(() => {
    if (updateInfo.menuUpdate === "" || updateInfo.menuUpdate === "not-updated") {
      getAllMenus(dispatch, cookie, removeCookie);
    }
  }, [dispatch, pageData, updateInfo]);



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
    const data = []
    selectedMenuType.map(selectedData => {
      data.push(selectedData.value)
    })
    setPageData({
      ...pageData, menu_type: data
    })
  }, [selectedMenuType])

  // update Menu Type
  useEffect(() => {
    setMenuType([])
    menuTypeData.map(type => {
      setMenuType(oldType => [...oldType, { value: type._id, label: type.title }])
    })
  }, [menuTypeData])

  // Selection Handler
  function handleOptionChange(e) {
    setPageData({
        ...pageData, template_category:e.target.value
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
          <p>Links: </p>
          <Card>
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
                    <Select
                        options={["Predesign", "Grapesjs"]}
                        label="Page Category"
                        onChange={handleOptionChange}
                    />
                    </Tab.Panel>
                    <Tab.Panel>
                    <Textinput
                        label="Page Slug"
                        id="pn2"
                        type="text"
                        placeholder="http://"
                        defaultValue={pageData.slug}
                        onChange={(e) => setPageData({...pageData, slug:e.target.value})}
                    />
                    </Tab.Panel>
                </Tab.Panels>
                </Tab.Group>
            </Card>
          <Textinput
            label="Page Order"
            id="pn2"
            type="number"
            placeholder="Type Your Template File Name"
            onChange={(e) => setPageData({...pageData, order:e.target.value})}
          />
          <MultipleSelect option={menuType} setReturnArray={setSelectedMenuType}/>
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

export default AddMenu