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
import { ToastContainer, toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { getAllPages } from '../../utils/getAllPages'
import { getAllMenus } from '../../utils/getAllMenus'

// let schema = yup.object().shape({
//   title: yup.string().required("Title is required"),
//   alias: yup.string().required("Alias is required"),
// });


function AddMenuType() {
  const [selectParentTemplate, setSelectParentTemplate] = useState(["Normal Menu", "Mega Menu"])
  const [menuData, setMenuData] = useState({
    title: "",
    alias: "",
    status: true,
    parent_menu: false,
    children_menu: false,
    parent_slug_status: true,
    children_slug_status: true,
    parent_alias: "none",
    children_alias: "none",
    parent_menu_template: selectParentTemplate[0],
    template: "Default",
  })
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showLoading, setShowLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [selectedPages, setSelectedPages] = useState([])

  const getMenuData = useSelector((state) => state.menus);
  const pageData = useSelector((state) => state.pages);
  const updateInfo = useSelector((state) => state.update);

  useEffect(() => {
    if (updateInfo.menuUpdate === "" || updateInfo.menuUpdate === "not-updated") {
      getAllMenus(dispatch, cookie, removeCookie);
    }
    if (updateInfo.pageUpdate === "" || updateInfo.pageUpdate === "not-updated") {
      getAllPages(dispatch, cookie, removeCookie);
    }
    if (updateInfo.menuUpdate === "" || updateInfo.menuUpdate === "not-updated") {
      getAllMenus(dispatch, cookie, removeCookie);
    }
  }, [dispatch, pageData, updateInfo]);


  useEffect(() => {
    setSelectedPages([{value: "none", label: "None"}])
    pageData.map(page => {
      setSelectedPages(oldPage => [...oldPage, { value: page.slug, label: page.title }])
    })
  }, [pageData])

  function handleParentPageChange(e) {
    setMenuData({...menuData, parent_alias: e.target.value})
  }
  function handleChildrenPageChange(e) {
    setMenuData({...menuData, children_alias: e.target.value})
  }
  function handleParentMenuTemplateChange(e) {
    setMenuData({...menuData, parent_menu_template: e.target.value})
  }

  // const {
  //   register,
  //   formState: { errors },
  //   handleSubmit,
  // } = useForm({
  //   resolver: yupResolver(schema),
  //   //
  //   mode: "all",
  // });

  // Cookies
  const [cookie, removeCookie] = useCookies()
  const headers = {
  'Authorization': `Bearer ${cookie._token}`
  }
  const saveHandler = (e) => {
    setShowLoading(true)
    axios.post(`${API_HOST}menu/add`, menuData, {
      headers: headers
    })
    .then((res) => {
      dispatch(addInfo({ field: 'menuUpdate', value: 'not-updated' }));
      setShowLoading(false)
      toast.success("Menu Type Added Successful!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
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
      toast.error("Menu Type Added Unsuccessful!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    });
  }

  // const [menuType, setMenuType] = useState([{}])
  // useEffect(() => {
  //   console.log(getMenuData)
  // }, [getMenuData])

  return (
    <div>
      {/* <ToastContainer/> */}
        <Popup showLoading={showLoading} popupText={"Menu Type Adding..."}  />
        <Card title="Add Menu Type">
          <form>
          <div className="space-y-3">
            <Textinput
              label="Menu Title"
              id="pn"
              type="text"
              // name="title"
              // register={register}
              // error={errors.title}
              placeholder="Type Your Menu Title"
              onChange={(e) => setMenuData({...menuData, title:e.target.value, alias: e.target.value.replace(/ /g, "-").toLowerCase()})}
            />
            <Textinput
              label="Menu Alias"
              className={errorMessage.includes("dup key") && "border-1 dark:border-red-700"}
              id="pn2"
              type="text"
              placeholder="Type Your Menu Slug"
              // name="alias"
              // register={register}
              // error={errors.alias}
              defaultValue={menuData.alias}
              onChange={(e) => setMenuData({...menuData, alias:e.target.value})}
            />
            {
              errorMessage.includes("dup key") &&
              <p className='text-red-500 text-sm'>This alias already used!</p>
            }
            {/* <div className='flex gap-5'>
              <div className='w-full md:w-1/2'>
              <p htmlFor="" className='mt-5 mb-3 text-green-500'>Parent Menu Details</p>
              <div>
                <div className='flex items-center mb-3'>
                  <div>
                    <label htmlFor="" className='pb-3'>Make Parent</label>
                    <Switch
                      label="Parent Status"
                      activeClass="bg-danger-500"
                      value={menuData.parent_menu}
                      disabled={menuData.children_menu}
                      onChange={() => setMenuData({...menuData, parent_menu: !menuData.parent_menu})}
                    />
                  </div>
                  <div className='ml-10'>
                    <label htmlFor="" className='pb-3'>Parent Linkable</label>
                    <Switch
                      label="Parent Slug Status"
                      activeClass="bg-danger-500"
                      value={menuData.parent_slug_status}
                      disabled={!menuData.parent_menu}
                      onChange={() => setMenuData({...menuData, parent_slug_status: !menuData.parent_slug_status})}
                    />
                  </div>
                </div>
                <Select
                  options={selectedPages}
                  label="Select Parent"
                  disabled={!menuData.parent_menu}
                  onChange={handleParentPageChange}
                />
                <div className='my-2'>
                  <Select
                    options={selectParentTemplate}
                    label="Parent Menu Template"
                    disabled={!menuData.parent_menu}
                    onChange={handleParentMenuTemplateChange}
                  />
                </div>
              </div>
              </div>
              <div className='w-full md:w-1/2'>
              <p htmlFor="" className='mt-5 mb-3 text-danger-500'>Children Menu Details</p>
              <div>
                <div className='flex items-center mb-3'>
                  <div>
                    <label htmlFor="" className='pb-3'>Make Children</label>
                    <Switch
                      label="Children Status"
                      activeClass="bg-danger-500"
                      value={menuData.children_menu}
                      disabled={menuData.parent_menu}
                      onChange={() => setMenuData({...menuData, children_menu: !menuData.children_menu})}
                    />
                  </div>
                  <div className='ml-10'>
                    <label htmlFor="" className='pb-3'>Children Linkable</label>
                    <Switch
                      label="Children Slug Status"
                      activeClass="bg-danger-500"
                      value={menuData.children_slug_status}
                      disabled={!menuData.children_menu}
                      onChange={() => setMenuData({...menuData, children_slug_status: !menuData.children_slug_status})}
                    />
                  </div>
                </div>
                <Select
                  options={selectedPages}
                  label="Select Children"
                  disabled={!menuData.children_menu}
                  onChange={handleChildrenPageChange}
                />
              </div>
              </div>
            </div> */}
            
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
            <Button text="Save" className="btn-warning py-2" onClick={() => {
              saveHandler()
            }}/>
          </div>
          </form>
      </Card>
    </div>
  )
}

export default AddMenuType