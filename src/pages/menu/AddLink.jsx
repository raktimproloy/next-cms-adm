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
    external_link: "",
    menu_type: [],
  })
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showLoading, setShowLoading] = useState(false)
  const [linkSelection, setLinkSelection] = useState("Article")

  const [menuType, setMenuType] = useState([])
  const [selectedMenuType, setSelectedMenuType] = useState([])
  const [selectedPages, setSelectedPages] = useState([])
  const [selectPage, setSelectPage] = useState("")
  const [selectedPageData, setSelectedPageData] = useState({
    menu_type: []
  })
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
    setSelectedPages([{value: "none", label: "None"}])
    pageData.map(page => {
      setSelectedPages(oldPage => [...oldPage, { value: page.slug, label: page.title }])
    })
  }, [pageData])

  useEffect(() => {
    if(pageData.length > 0){
      pageData.map(page => {
        if(page.slug === selectPage){
          setSelectedPageData(page)
        }
      })
    }
  }, [selectPage])




  const saveHandler = () => {
    linkData.link_type = linkSelection
    setShowLoading(true)
    if(linkSelection === "External"){
      axios.post(`${API_HOST}link/add`, linkData, {
        headers: headers
      })
      .then((res) => {
        console.log(res)
        dispatch(addInfo({ field: 'menuUpdate', value: 'not-updated' }));
        setShowLoading(false)
        // navigate("/pages")
      })
      .catch((err) => {
        setShowLoading(false)
        if(err.response.data.error === "Authentication error!"){
            removeCookie("_token")
        }
      });
    }else{
      axios.post(`${API_HOST}page/update/${selectedPageData.slug}`, selectedPageData, {
        headers: headers
      })
      .then((res) => {
          dispatch(addInfo({ field: 'pageUpdate', value: 'not-updated' }));
          dispatch(addInfo({ field: 'menuUpdate', value: 'not-updated' }));
          setShowLoading(false)
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


  useEffect(() => {
    const data = []
    selectedMenuType.map(selectedData => {
      data.push(selectedData.value)
    })
    // Extracting the 'value' property from the first array
    const valuesToPush = selectedMenuType.map(item => item.value);
    // Checking and pushing values that don't already exist in array2
    const newArray2 = [...selectedPageData.menu_type, ...valuesToPush.filter(value => !selectedPageData.menu_type.includes(value))];
    
    setSelectedPageData(prevState => ({
      ...prevState,
      menu_type: newArray2
    }));
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
    setSelectPage(e.target.value)
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
            {
              menuType.length > 0 ? 
            <MultipleSelect option={menuType} setReturnArray={setSelectedMenuType} defaultArray={selectedPageData.menu_type} usage={"add"}/>
            : ""
            }
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