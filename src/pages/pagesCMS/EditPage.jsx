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
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Tab } from "@headlessui/react";
import image2 from "@/assets/images/all-img/image-2.png";
import { useSelector } from 'react-redux'
import { getAllMenus } from '../../utils/getAllMenus'
import MultipleSelect from "@/pages/shared/MultipleSelect"
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import {AddLog} from "@/utils/logHandler"
import { getSetting } from '../../utils/getSetting'
import { StoreMetaImage } from '@/utils/appwrite/StoreImage';
import { ToastContainer, toast } from 'react-toastify'

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

const styles = {
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
};


function EditPage() {
  const params = useParams()
  const [searchParams] = useSearchParams();
  const paramValue = searchParams.get('param');
  const paramArray =paramValue?.split("/")
  const [selectedFile, setSelectedFile] = useState(null)
  const [errorMessage, setErrorMessage] = useState("")
  
  const [menuType, setMenuType] = useState([])
  const [selectedMenuType, setSelectedMenuType] = useState([])
  const menuTypeData = useSelector((state) => state.menus);
  const updateInfo = useSelector((state) => state.update);
  const profileData = useSelector((state) => state.profile);
  const setting = useSelector((state) => state.setting);
  const AppwriteUrl = setting?.storage_config?.storage_url

  const [checkGetData, setCheckGetData] = useState(false)

  const [pageData, setPageData] = useState({
    title: "",
    slug: "",
    active: false,
    breadcrumb: "",
    menu_type: [],
    published_date: "23 March, 2024",
    template_category: "Predesign",
    template: "",
    meta_title: "",
    meta_description: ""
  })
  const [menuData, setMenuData] = useState({
    isClickable: true,
    menu_design: 0,
    tag_line: "",
    svg_icon: ""
  })
  
  const [metaTag, setMetaTag] = useState({
    title: "",
    description: "",
    keyword: "",
    og_title:"",
    og_url:"",
    og_description:"",
    og_site_name:"",
    og_type:"",
    og_image: "",
    twitter_card:"",
    twitter_title:"",
    twitter_description:"",
    twitter_url: ""
  })

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showLoading, setShowLoading] = useState(false)

  // Cookies
  const [cookie, removeCookie] = useCookies()
  const headers = {
  'Authorization': `Bearer ${cookie._token}`
  }
  
  useEffect(() => {
    if (updateInfo.menuUpdate === "" || updateInfo.menuUpdate === "not-updated") {
      getAllMenus(dispatch, cookie, removeCookie);
    }
    if (updateInfo.settingUpdate === "" || updateInfo.settingUpdate === "not-updated") {
      getSetting(dispatch, cookie, removeCookie);
  }
  }, [dispatch, pageData, updateInfo]);

    // Get data
    useEffect(() => {
      axios.get(`${API_HOST}page/${params.slug}`, {
        headers: headers
        })
        .then((res) => {
          setCheckGetData(true)
          setPageData(res.data)
          setMetaTag(res.data.meta_property)
        })
        .catch((err) => {
        console.log(err)
        });
    }, [])

//   Edit Data
  const editHandler = async() => {
    setShowLoading(true)
    try{
      let og_imageUrl =  metaTag.og_image
      if(selectedFile){
        og_imageUrl = await StoreMetaImage(selectedFile, setting?.storage_config?.storage_meta_bucket_id);
      }
      const formData = new FormData()

      formData.append("title", pageData.title)
      formData.append("slug", pageData.slug)
      formData.append("active", pageData.active)
      formData.append("breadcrumb", pageData.breadcrumb)
      formData.append("param", paramValue ? paramValue : "")
      formData.append("isClickable", menuData.isClickable)
      formData.append("menu_design", menuData.menu_design)
      formData.append("svg_icon", menuData.svg_icon)
      formData.append("tag_line", menuData.tag_line)
      formData.append("menu_type", JSON.stringify(pageData.menu_type))
      formData.append("published_date", pageData.published_date)
      formData.append("template_category", pageData.template_category)
      formData.append("template", pageData.template)
      formData.append("meta_title", pageData.meta_title)
      formData.append("meta_description", pageData.meta_description)
      formData.append("og_image", og_imageUrl)
      formData.append("meta_property", JSON.stringify(metaTag))

      if(pageData.template_category === "Designer" || (pageData.template_category === "Predesign" && pageData.template !== "") ){
        axios.post(`${API_HOST}page/update/${params.slug}`, formData, {
            headers: headers
        })
        .then((res) => {
            AddLog(profileData.email, "Page", `Page Edited Successful`)
            dispatch(addInfo({ field: 'pageUpdate', value: 'not-updated' }));
            dispatch(addInfo({ field: 'menuUpdate', value: 'not-updated' }));
            setShowLoading(false)
            navigate("/pages")
        })
        .catch((err) => {
            setErrorMessage(err.response.data.error)
            setShowLoading(false)
            if(err.response.data.error === "Authentication error!"){
            removeCookie("_token")
            AddLog(profileData.email, "Page", `Page Edited Faild For Authorization`)
            }else{
              AddLog(profileData.email, "Page", `Page Edited Unsuccessful`)
            }
            toast.error("Page Updated Unsuccessful!", {
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
    }
    catch(error){
      toast.error("Page Updated Unsuccessful!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
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

    if(paramArray?.length > 0){
      menuTypeData.map(type => {
        if( paramArray.length === 1){
          if(type.alias === paramArray[0]){
            type.items.map(item => {
              if(item.menu_slug === params.slug){
                setMenuData({isClickable: item.isClickable, menu_design: item.menu_design})
              }
            })
          }
        }else{
          if(type.alias === paramArray[0]){
            type.items.map(item => {
              if(item.menu_slug === paramArray[1]){
                if(item.items && item.items.length > 0){
                  item.items.map(child => {
                    if(child.menu_slug === params.slug){
                      setMenuData({isClickable: child.isClickable, menu_design: child.menu_design, svg_icon: child.svg_icon, tag_line: child.tag_line})
                    }
                  })
                }
              }
            })
          }
        }
      })
    }
  }, [menuTypeData])


  // Selection Handler
  function handleOptionChange(e) {
    setPageData({
        ...pageData, template_category:e.target.value
    })
  }

  const handleFileChange = (e) => {
    console.log(pageData)
    setSelectedFile(e.target.files[0]);
  };


  function handleBreadcrumbChange(e) {
    setPageData({
        ...pageData, breadcrumb:e.target.value.toLowerCase()
    })
  }


  function handlePageClickableChange(e){
    setMenuData({...menuData, isClickable: e.target.value.toLowerCase() === "true" ? true : false})
  }

  function handleMenuDesignChange(e){
    setMenuData({...menuData, menu_design: e.target.value === "Normal Menu" ? 0 : 1})
  }


  return (
    <div>
      {/* <ToastContainer/> */}
        <Popup showLoading={showLoading} popupText={"Page Updating..."}  />
        <Card title="Page Edit">
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
                  onChange={(e) => setPageData({...pageData, title:e.target.value})}
              />
              <Select
                  options={["Designer","Predesign"]}
                  label="Page Category"
                  value={pageData.template_category}
                  onChange={handleOptionChange}
              />
              <Textinput
                  label="Page Slug"
                  className={errorMessage?.includes("duplicate key") && "border-1 dark:border-red-700"}
                  id="pn2"
                  type="text"
                  placeholder="Type Your Page Slug"
                  defaultValue={pageData.slug}
                  onChange={(e) => setPageData({...pageData, slug:e.target.value})}
              />
              {
              errorMessage.includes("duplicate key") &&
              <p className='text-red-500 text-sm'>This slug already used!</p>
              }
              <Textinput
                label="Predesign Page"
                id="pn2"
                type="text"
                readonly={pageData?.template_category?.toLowerCase() == "predesign" ? false : true}
                placeholder="Type Your Page Slug"
                defaultValue={pageData.template}
                onChange={(e) => setPageData({...pageData, template:e.target.value})}
              />
              <Select
                  options={["Active", "Inactive"]}
                  label="Breadcrumb"
                  value={pageData.breadcrumb === "active" ? "Active" : "Inactive"}
                  onChange={handleBreadcrumbChange}
              />
              {
                checkGetData && menuType.length > 0 ? 
                <MultipleSelect option={menuType} label={"Select Menu Type"} setReturnArray={setSelectedMenuType} defaultArray={pageData.menu_type} usage={"edit"}/>
                : ""
                }
                {
                  paramArray !== undefined || paramArray?.length >= 3 ? 
                  <div className='flex gap-10'>
                    <div className='w-full md:w-1/2'>
                    <Select
                      options={["True", "False"]}
                      label="Is Clickable"
                      value={menuData.isClickable ? "True" : "False"}
                      onChange={handlePageClickableChange}
                    />
                    
                    </div>
                    {paramArray.length === 1 ? 
                      <div className='w-full md:w-1/2'>
                        <Select
                          options={["Normal Menu", "Mega Menu"]}
                          label="Select Menu Design"
                          value={menuData.menu_design === 0 ? "Normal Menu" : "Mega Menu"}
                          onChange={handleMenuDesignChange}
                        />
                      </div>
                      : ""
                    }
                    {
                      paramArray.length === 2 ? 
                      <div className='w-1/2'>
                      <Textarea
                        label="Input Your SVG"
                        id="pn2"
                        type="text"
                        placeholder="Input your SVG icon"
                        defaultValue={menuData.svg_icon}
                        onChange={(e) => setMenuData({...menuData, svg_icon:e.target.value})}
                      />
                      <Textinput
                        label="Menu Tag Line"
                        id="pn2"
                        type="text"
                        placeholder="Input your menu tag line"
                        defaultValue={menuData.tag_line}
                        onChange={(e) => setMenuData({...menuData, tag_line:e.target.value})}
                      />
                      </div>
                      : ""
                    }
                  </div>
                  : ""
                }
              <div>
                  <label htmlFor="" className='pb-3'>Page Active</label>
                  <Switch
                  label="Page Active Status"
                  activeClass="bg-danger-500"
                  value={pageData.active}
                  onChange={() => setPageData({...pageData, active: !pageData.active})}
                  />
              </div>
              </Tab.Panel>

              <Tab.Panel>
                <div className='flex flex-col md:flex-row w-full gap-10'>
                  <div className='w-full md:w-1/2'>
                  <Textinput
                    label="Meta Title"
                    id="pn3"
                    placeholder=" Disabled Input"
                    type="text"
                    defaultValue={pageData.meta_title}
                    onChange={(e) => {
                      setPageData({...pageData, meta_title:e.target.value})
                      setMetaTag({...metaTag, title:e.target.value, og_title:e.target.value, twitter_title:e.target.value})
                    }}
                  />
                  <Textarea
                      label="Meta Description"
                      id="pn4"
                      placeholder="Type Meta Description"
                      defaultValue={pageData.meta_description}
                      onChange={(e) => {
                        setPageData({...pageData, meta_description:e.target.value})
                        setMetaTag({...metaTag, description:e.target.value, og_description:e.target.value, twitter_description:e.target.value})
                      }}
                  />
                  <p className='mt-3'>Property: og:image</p>
                    <Fileinput
                      name="og_image"
                      selectedFile={selectedFile}
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className='w-full md:w-1/2'>
                    <span className="block text-base font-medium tracking-[0.01em] dark:text-slate-300 text-slate-500 mb-3">
                      View Template :
                    </span>
                    <div className='flex justify-center'>
                      <Image
                        src={metaTag.og_image.length > 0 ? `${AppwriteUrl}${metaTag.og_image}` : `${AppwriteUrl}${setting?.meta_property?.og_image}`}
                        alt="Small image with fluid:"
                        className="rounded-md w-[90%]"
                      />
                    </div>
                  </div>
                </div>
              
                <h5 className='mt-5'>Meta Tags</h5>
              <div className='flex flex-col md:flex-row w-full gap-10'>

                <div className='w-full md:w-1/3'>
                  <Textinput
                    label="Main Title"
                    id="pn3"
                    placeholder="Type Content"
                    type="text"
                    defaultValue={metaTag.title}
                    onChange={(e) => setMetaTag({...metaTag, title:e.target.value})}
                  />
                  <Textarea
                    label="Main Description"
                    id="pn4"
                    placeholder="Type Content"
                    defaultValue={metaTag.description}
                    onChange={(e) => setMetaTag({...metaTag, description:e.target.value})}
                  />
                  <Textinput
                    label="Property: keyword"
                    id="pn4"
                    placeholder="Type Content"
                    defaultValue={metaTag.keyword}
                    onChange={(e) => setMetaTag({...metaTag, keyword:e.target.value})}
                  />
                  <Textinput
                    label="Property: og:title"
                    id="pn3"
                    placeholder="Type Content"
                    type="text"
                    defaultValue={metaTag.og_title}
                    onChange={(e) => setMetaTag({...metaTag, og_title:e.target.value})}
                  />
                </div>
                <div className='w-full md:w-1/3'>
                <Textinput
                    label="Property: og:url"
                    id="pn3"
                    placeholder="Type Content"
                    type="text"
                    defaultValue={metaTag.og_url}
                    onChange={(e) => setMetaTag({...metaTag, og_url:e.target.value})}
                  />
                <Textarea
                    label="Property: og:description"
                    id="pn4"
                    placeholder="Type Content"
                    defaultValue={metaTag.og_description}
                    onChange={(e) => setMetaTag({...metaTag, og_description:e.target.value})}
                  />
                  <Textinput
                    label="Property: og:site_name"
                    id="pn3"
                    placeholder="Type Content"
                    type="text"
                    defaultValue={metaTag.og_site_name}
                    onChange={(e) => setMetaTag({...metaTag, og_site_name:e.target.value})}
                  />
                  <Textinput
                    label="Property: og:type"
                    id="pn3"
                    placeholder="Type Content"
                    type="text"
                    defaultValue={metaTag.og_type}
                    onChange={(e) => setMetaTag({...metaTag, og_type:e.target.value})}
                  />
                </div>
                <div className='w-full md:w-1/3'>
                  <Textinput
                    label="Property: twitter:card"
                    id="pn3"
                    placeholder="Type Content"
                    type="text"
                    defaultValue={metaTag.twitter_card}
                    onChange={(e) => setMetaTag({...metaTag, twitter_card:e.target.value})}
                  />
                  <Textinput
                    label="Property: twitter:title"
                    id="pn3"
                    placeholder="Type Content"
                    type="text"
                    defaultValue={metaTag.twitter_title}
                    onChange={(e) => setMetaTag({...metaTag, twitter_title:e.target.value})}
                  />
                  <Textarea
                    label="Property: twitter:description"
                    id="pn3"
                    placeholder="Type Content"
                    type="text"
                    defaultValue={metaTag.twitter_description}
                    onChange={(e) => setMetaTag({...metaTag, twitter_description:e.target.value})}
                  />
                  <Textinput
                    label="Property: twitter:url"
                    id="pn3"
                    placeholder="Type Content"
                    type="text"
                    defaultValue={metaTag.twitter_url}
                    onChange={(e) => setMetaTag({...metaTag, twitter_url:e.target.value})}
                  />
                </div>
              </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
          <div className='flex justify-between items-center mt-5'>
          <Button text="Edit Page" className="btn-warning py-2" onClick={() => {
              navigate(`/pages/editor/${pageData.slug}`)
              localStorage.setItem('grapesjs_page', JSON.stringify({
                title: pageData?.title,
                slug: pageData?.slug
              }));
            }}  />
            <Button text="Save" className="btn-success py-2" onClick={() => {
              editHandler()
            }}/>
          </div>
      </Card>
    </div>
  )
}

export default EditPage