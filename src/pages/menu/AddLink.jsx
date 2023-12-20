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
import { getAllPages } from '../../utils/getAllPages'



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

function AddLink() {
  const [linkData, setLinkData] = useState({
    title: "",
    // link_type: "",
    // internal_link: "",
    external_link: "",
    // active: false,
    menu_type: [],
  })
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showLoading, setShowLoading] = useState(false)
  const [linkSelection, setLinkSelection] = useState("Article")

  const [menuType, setMenuType] = useState([])
  const [selectedMenuType, setSelectedMenuType] = useState([])
  const [selectedPages, setSelectedPages] = useState([])
  const menuTypeData = useSelector((state) => state.menus);
  const pageData = useSelector((state) => state.pages);
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
    if (updateInfo.pageUpdate === "" || updateInfo.pageUpdate === "not-updated") {
      getAllPages(dispatch, cookie, removeCookie);
    }
  }, [dispatch, pageData, updateInfo]);


  useEffect(() => {
    setSelectedPages([])
    pageData.map(page => {
      setSelectedPages(oldPage => [...oldPage, { value: page.slug, label: page.title }])
    })
    // if(pageData.length > 0){
    //   if(linkData.internal_link === ""){
    //     linkData.internal_link = pageData[0].slug
    //   }
    // }
  }, [pageData])



  const saveHandler = () => {
    linkData.link_type = linkSelection
    setShowLoading(true)
    if(linkSelection === "External"){
      axios.post(`${API_HOST}link/add`, linkData, {
        headers: headers
      })
      .then((res) => {
        // dispatch(addInfo({ field: 'pageUpdate', value: 'not-updated' }));
        setShowLoading(false)
        // createPage(pageData.title)(dispatch);
        // setTimeout(() => {
        //   if(pageData.template_category === "Predesign"){
        //     navigate("/pages")
        //   }else{
        //     navigate(`/pages/editor/${pageData.slug}`)
        //   }
        // }, 1000);
      })
      .catch((err) => {
        setShowLoading(false)
        if(err.response.data.error === "Authentication error!"){
            removeCookie("_token")
        }
      });
    }
  }


  useEffect(() => {
    const data = []
    selectedMenuType.map(selectedData => {
      data.push(selectedData.value)
    })
    setLinkData({
      ...linkData, menu_type: data
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
    setLinkData({
        ...linkData, internal_link:e.target.value
    })
  }

  return (
    <div>
        <Popup showLoading={showLoading} popupText={"Link Adding..."}  />
        <Card title="Add Link">
        <div className="space-y-3">
          <Textinput
            label="Link Title"
            id="pn"
            type="text"
            placeholder="Type Your Link Title"
            onChange={(e) => setLinkData({...linkData, title:e.target.value})}
          />
          <p>Links: </p>
          <Card className="removePadding" >
                <Tab.Group>
                <Tab.List className="lg:space-x-8 md:space-x-4 space-x-0 rtl:space-x-reverse">
                    {buttons.map((item, i) => (
                    <Tab as={Fragment} key={i}>
                        {({ selected }) => (
                        <button
                        onClick={() => setLinkSelection(item.title)}
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
                        options={selectedPages}
                        label="Select Page"
                        onChange={handleOptionChange}
                    />
                    </Tab.Panel>
                    <Tab.Panel>
                    <Textinput
                        label="External Link"
                        id="pn2"
                        type="text"
                        placeholder="http://"
                        // defaultValue={pageData.slug}
                        onChange={(e) => setLinkData({...linkData, external_link:e.target.value})}
                    />
                    </Tab.Panel>
                </Tab.Panels>
                </Tab.Group>
            </Card>
          <MultipleSelect label={"Select Menu Type"} option={menuType} setReturnArray={setSelectedMenuType} usage={"add"}/>
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

export default AddLink