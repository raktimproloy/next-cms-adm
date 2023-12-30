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
import { useSelector } from 'react-redux'
import { getAllMenus } from '../../utils/getAllMenus'
import MultipleSelect from "@/pages/shared/MultipleSelect"
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";


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


// let schema = yup.object().shape({
//   title: yup.string().required("Title is required"),
//   slug: yup.string().required("Slug is required"),
// });

function EditPage() {
  const params = useParams()
  const [selectedFile, setSelectedFile] = useState(null)
  const [errorMessage, setErrorMessage] = useState("")

  const [menuData, setMenuData] = useState([])
  const [menuType, setMenuType] = useState([])
  const [selectedMenuType, setSelectedMenuType] = useState([])
  const menuTypeData = useSelector((state) => state.menus);
  const updateInfo = useSelector((state) => state.update);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    // resolver: yupResolver(schema),
    //
    mode: "all",
  });


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
  const editHandler = () => {
    setShowLoading(true)
    const formData = new FormData()

    formData.append("title", pageData.title)
    formData.append("slug", pageData.slug)
    formData.append("active", pageData.active)
    formData.append("order", pageData.order)
    formData.append("breadcrumb", pageData.breadcrumb)
    formData.append("menu_type", JSON.stringify(pageData.menu_type))
    formData.append("published_date", pageData.published_date)
    formData.append("template_category", pageData.template_category)
    formData.append("template", pageData.template)
    formData.append("meta_title", pageData.meta_title)
    formData.append("meta_description", pageData.meta_description)
    formData.append("og_image", selectedFile)
    formData.append("meta_property", JSON.stringify(metaTag))

    if(pageData.template_category === "Grapesjs" || (pageData.template_category === "Predesign" && pageData.template !== "") ){
      axios.post(`${API_HOST}page/update/${pageData.slug}`, formData, {
          headers: headers
      })
      .then((res) => {
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
          }
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

  return (
    <div>
        <Popup showLoading={showLoading} popupText={"Role Adding..."}  />
        <Card title="Page Edit">
          <form>
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
                  // name= "title"
                  register={register}
                  // error={errors.title}
                  placeholder="Type Your Page Title"
                  defaultValue={pageData.title}
                  onChange={(e) => setPageData({...pageData, title:e.target.value})}
              />
              <Select
                  options={["Predesign", "Grapesjs"]}
                  label="Page Category"
                  value={pageData.template_category}
                  onChange={handleOptionChange}
              />
              <Textinput
                  label="Page Slug"
                  className={errorMessage.includes("duplicate key") && "border-1 dark:border-red-700"}
                  id="pn2"
                  type="text"
                  // name= "slug"
                  register={register}
                  // error={errors.slug}
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
              <MultipleSelect option={menuType} setReturnArray={setSelectedMenuType} defaultArray={pageData.menu_type} usage={"edit"}/>
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
                <div className='flex w-100 justify-items-between gap-10'>
                  <div className='w-2/4'>
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
                  <div className='w-2/4'>
                    <span className="block text-base font-medium tracking-[0.01em] dark:text-slate-300 text-slate-500 mb-3">
                      Previous Image :
                    </span>
                    <div className='flex justify-center'>
                      <Image
                        src={image2}
                        alt="Small image with fluid:"
                        className="rounded-md w-[90%]"
                      />
                    </div>
                  </div>
                </div>
              
                <h5 className='mt-5'>Meta Tags</h5>
              <div className='flex w-100 gap-10'>

                <div className='w-1/3'>
                  <Textinput
                    label="Property: title"
                    id="pn3"
                    placeholder="Type Content"
                    type="text"
                    defaultValue={metaTag.title}
                    onChange={(e) => setMetaTag({...metaTag, title:e.target.value})}
                  />
                  <Textarea
                    label="Property: description"
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
                <div className='w-1/3'>
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
                <div className='w-1/3'>
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
              console.log("Click")
              editHandler()
            }}/>
          </div>
          </form>
      </Card>
    </div>
  )
}

export default EditPage