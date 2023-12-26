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
import { useSelector } from 'react-redux'
import { getAllMenus } from '../../utils/getAllMenus'
import { getAllPages } from '../../utils/getAllPages'
import MultipleSelect from "@/pages/shared/MultipleSelect"
import {CurrentDate} from "@/utils/CurrentDate"

function AddPage() {
  const [pageData, setPageData] = useState({
    title: "",
    slug: "",
    active: false,
    menu_type: [],
    published_date: CurrentDate(),
    template_category: "Predesign",
    template: "",
    meta_title: "",
    meta_description: ""
  })
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showLoading, setShowLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [menuType, setMenuType] = useState([])
  const [selectedMenuType, setSelectedMenuType] = useState([])
  const menuTypeData = useSelector((state) => state.menus);
  const pagesData = useSelector((state) => state.pages);
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



  const saveHandler = () => {
    setShowLoading(true)
    axios.post(`${API_HOST}page/add`, pageData, {
      headers: headers
    })
    .then((res) => {
      dispatch(addInfo({ field: 'pageUpdate', value: 'not-updated' }));
      dispatch(addInfo({ field: 'menuUpdate', value: 'not-updated' }));
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
      setErrorMessage(err.response.data.error)
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
          <Select
            options={["Predesign", "Grapesjs"]}
            label="Page Category"
            onChange={handleOptionChange}
          />
          <Textinput
            className={errorMessage.includes("dup key") && "border-1 dark:border-red-700"}
            label="Page Slug"
            id="pn2"
            type="text"
            placeholder="Type Your Page Slug"
            defaultValue={pageData.slug}
            onChange={(e) => setPageData({...pageData, slug:e.target.value})}
          />
          {
            errorMessage.includes("dup key") &&
            <p className='text-red-500 text-sm'>This slug already used!</p>
          }
          <Textinput
            label="Default Template"
            id="pn2"
            readonly={pageData.template_category.toLowerCase() == "predesign" ? false : true}
            type="text"
            placeholder="Type Your Template File Name"
            onChange={(e) => setPageData({...pageData, template:e.target.value})}
          />
          <MultipleSelect label={"Select Menu Type"} option={menuType} setReturnArray={setSelectedMenuType} usage={"add"}/>
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