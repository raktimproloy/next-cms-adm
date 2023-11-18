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
  const [selectedFile, setSelectedFile] = useState(null)
  const [pageData, setPageData] = useState({
    title: "",
    slug: "",
    active: false,
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

    // Get data
    useEffect(() => {
      axios.get(`${API_HOST}page/${params.slug}`, {
        headers: headers
        })
        .then((res) => {
            setPageData(res.data[0])
            setMetaTag(res.data[0].meta_property)
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
    formData.append("published_date", pageData.published_date)
    formData.append("template_category", pageData.template_category)
    formData.append("template", pageData.template)
    formData.append("meta_title", pageData.meta_title)
    formData.append("meta_description", pageData.meta_description)
    formData.append("og_image", selectedFile)
    formData.append("meta_property", JSON.stringify(metaTag))


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

  // Selection Handler
  function handleOptionChange(e) {
    setPageData({
        ...pageData, template_category:e.target.value
    })
  }

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };


  useEffect(() => {
    console.log("PageData", pageData)
    console.log("MetaTag", metaTag)
  }, [pageData, metaTag])

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
                defaultValue={pageData.template}
                onChange={(e) => setPageData({...pageData, template:e.target.value})}
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
                value={pageData.template_category}
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
              <h5 className='mt-5'>Meta Tags</h5>
            <div className='flex w-100 gap-10'>
              <div className='w-2/4'>
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
              <div className='w-2/4'>
                
                <p className='my-3'>Property: og:image</p>
                <Fileinput
                  name="og_image"
                  selectedFile={selectedFile}
                  onChange={handleFileChange}
                />
                <span className="block text-base font-medium tracking-[0.01em] dark:text-slate-300 text-slate-500 mb-3 mt-5">
                  Previous Image :
                </span>
                <span className="block text-base dark:text-slate-300 text-slate-500 uppercase mb-6 ">
                  {metaTag.og_image}
                </span>
                <Image
                  src={image2}
                  alt="Small image with fluid:"
                  className="rounded-md mb-6"
                />
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