import React, { useEffect, useState, Fragment } from 'react'
import Card from "@/components/ui/Card"
import Textinput from "@/components/ui/Textinput"
import Select from "@/components/ui/Select"
import Textarea from "@/components/ui/Textarea"
import Switch from "@/components/ui/Switch"
import Button from "@/components/ui/Button"
import Image from "@/components/ui/Image"
import Keyword from "@/components/ui/Keyword"
import Fileinput from "@/components/ui/Fileinput"
import axios from 'axios'
import { API_HOST } from '@/utils'
import { useCookies } from 'react-cookie'
import Popup from "@/components/ui/Popup"
import MessagePopup from "@/components/ui/Popup/MessagePopup"
import { useDispatch } from 'react-redux'
import { addInfo } from '../../store/layout'
import { useNavigate, useParams } from 'react-router-dom'
import { Tab } from "@headlessui/react";
import {Editor} from "@tinymce/tinymce-react"
import image2 from "@/assets/images/all-img/image-2.png";
import { CurrentDate } from '@/utils/CurrentDate'
import TinyMCE from './TinyMCE'
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { getSetting } from '../../utils/getSetting'
import { useSelector } from 'react-redux'
import {AddLog} from "@/utils/logHandler"
import { StoreMetaImage } from '@/utils/appwrite/StoreImage';
import { ToastContainer, toast } from 'react-toastify'
import Designer from '../Editor'


const buttons = [
    {
      title: "Blog Details",
      icon: "heroicons-outline:home",
    },
    // {
    //   title: "Designer",
    //   icon: "heroicons-outline:home",
    // },
    {
      title: "Blog Metatag",
      icon: "heroicons-outline:user",
    }
];



function AddBlog() {
  const tinymceApi = import.meta.env.VITE_TINYMCE_API
  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [errorMessage, setErrorMessage] = useState("")
  const [showMessagePopup, setShowMessagePopup] = useState(false)
  const setting = useSelector((state) => state.setting);
  const updateInfo = useSelector((state) => state.update);
  const profileData = useSelector((state) => state.profile);
  
  const AppwriteUrl = setting?.storage_config?.storage_url
  
  useEffect(() => {
    if (updateInfo.settingUpdate === "" || updateInfo.settingUpdate === "not-updated") {
        getSetting(dispatch, cookie, removeCookie);
    }
  }, [dispatch, setting, updateInfo]);
  
  const [text, setText] = useState("")
  const [value, setValue] = useState("<p>TinyMCE Editor text</p>")

  const [blogTag, setBlogTag] = useState([])

  const [blogData, setBlogData] = useState({
    title: "",
    slug: "",
    status: "Active",
    design_type: 0,
    published_date: CurrentDate(),
    blog_category: "Management",

  })

  const [metaTag, setMetaTag] = useState({
    main_title: "",
    main_description: "",
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

  
  const [selectedFile, setSelectedFile] = useState(null)


  const [showLoading, setShowLoading] = useState(false)

  // Cookies
  const [cookie, removeCookie] = useCookies()
  const headers = {
  'Authorization': `Bearer ${cookie._token}`,
  // 'Content-Type': 'application/json'
  }

  const htmlToStringConverter = (html) => {
    // Your HTML content
    const htmlContent = html;

    // Create a temporary DOM element to parse the HTML
    const tempElement = document.createElement('div');
    tempElement.innerHTML = htmlContent;

    // Extract the text content
    const textContent = tempElement.textContent || tempElement.innerText || '';
    return textContent.trim()
  }


//   Save Data
  const saveHandler = async() => {
    setShowLoading(true)
    try{
      let metaFinal = { ...metaTag };
      const desText = htmlToStringConverter(value);
      
      if (metaTag.main_description.length === 0) {
        metaFinal = {
          ...metaFinal, // Spread the existing properties
          main_description: desText,
        };
      }
      if (metaTag.description.length === 0) {
        metaFinal = {
          ...metaFinal, // Spread the existing properties
          description: desText,
        };
      }
      if (metaTag.og_description.length === 0) {
        metaFinal = {
          ...metaFinal, // Spread the existing properties
          og_description: desText,
        };
      }
      if (metaTag.twitter_description.length === 0) {
        metaFinal = {
          ...metaFinal, // Spread the existing properties
          twitter_description: desText,
        };
      }

      console.log(metaFinal)

      let og_imageUrl = setting?.meta_property?.og_image
      if(selectedFile){
        og_imageUrl = await StoreMetaImage(selectedFile, setting?.storage_config?.storage_meta_bucket_id);
      }
        const formData = new FormData();
        formData.append('title', blogData.title);
        formData.append('slug', blogData.slug);
        formData.append('status', blogData.status);
        formData.append('design_type', blogData.design_type);
        formData.append('published_date', blogData.published_date);
        formData.append('blog_category', blogData.blog_category.toLowerCase());
        formData.append('blog_tags', JSON.stringify(blogTag));
        formData.append('blog_details', value);
        formData.append("og_image", og_imageUrl)
        formData.append("meta_property", JSON.stringify(metaFinal))
  
        axios.post(`${API_HOST}blog/add`, formData, {
            headers: headers
        })
        .then((res) => {
            AddLog(profileData.email, "blog", `Blog Posted Successful`)
            dispatch(addInfo({ field: 'blogUpdate', value: 'not-updated' }));
            setShowLoading(false)
            toast.success("New Blog Added!", {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            navigate("/blog")
        })
        .catch((err) => {
            
            setErrorMessage(err.response.data.error)
            setShowLoading(false)
            if(err.response.data.error.includes("is required")){
              setShowMessagePopup(true)
              toast.error("Required Value Missing!", {
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
            if(err.response.data.error === "Authentication error!"){
            removeCookie("_token")
              AddLog(profileData.email, "blog", `Blog Post Faild For Authorization`)
            }else{
              AddLog(profileData.email, "blog", `Blog Post Unsuccessful`)
            }
        });
      

    }catch(error){
      setShowLoading(false)
      toast.error("Required Value Missing!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      console.error("Image upload failed:", error);
    }
    
  }

  // Selection Handler
  function handleOptionChange(e) {
    setBlogData({
        ...blogData, blog_category:e.target.value
    })
  }  
  function handleStatusChange(e) {
    setBlogData({
        ...blogData, status:e.target.value
    })
  }

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleDesignChange = (e) => {
    setBlogData({...blogData, design_type: e.target.value === "TinyMCE" ? 0 : 1})
  }


  return (
    <div>
        {/* <MessagePopup showMessagePopup={showMessagePopup} setShowMessagePopup={setShowMessagePopup} popupText={"Please Fill Required Input"} aleart={"error"} /> */}
        <Popup showLoading={showLoading} popupText={"Blog Adding..."}  />
        {/* <ToastContainer/> */}
        <Card title="Add Blog">
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
                <div className='flex gap-10'>
                  <div className='w-full md:w-2/4'>
                  <Textinput
                    label="Blog Title*"
                    id="pn"
                    type="text"
                    placeholder="Type Your Blog Title"
                    defaultValue={blogData.title}
                    onChange={(e) => setBlogData({...blogData, title:e.target.value, slug: e.target.value.replace(/ /g, "-").toLowerCase()})}
                  />
                  <Textinput
                      label="Blog Slug*"
                      className={errorMessage.includes("dup key") && "border-1 dark:border-red-700"}
                      id="pn2"
                      type="text"
                      placeholder="Type Your Blog Slug"
                      defaultValue={blogData.slug}
                      onChange={(e) => setBlogData({...blogData, slug:e.target.value})}
                  />
                  {
                    errorMessage.includes("dup key") &&
                    <p className='text-red-500 text-sm'>This slug already used!</p>
                  }

                  </div>

                  <div className='w-full md:w-2/4'>
                  <Select
                    options={["TinyMCE", "Designer"]}
                    label="Design Type"
                    value={blogData.design_type === 0 ? "TinyMCE" : "Designer"}
                    onChange={handleDesignChange}
                  />
                  <Keyword tags={blogTag} setTags={setBlogTag} />

                  </div>
                </div>
              
              <div className='mt-5'>
                <p className='mb-2'>Write Your Blog:</p>
                <Editor 
                  apiKey={setting?.tiny_mce}
                  onEditorChange={(newValue, editor) => {
                  setValue(newValue)
                  setText(editor.getContent({format:"text"}))
                  }}
                  onInit={(evt, editor) => {
                  setText(editor.getContent({format: "text"}))
                  }}
                  // initialValue='TinyMCE rich text editor'
                  value={value}
                  
                  init={{
                  plugins: "a11ychecker advcode advlist advtable anchor autocorrect autolink autosave casechange charmap checklist code codesample directionality editimage emoticons export footnotes formatpainter fullscreen image inlinecss insertdatetime link linkchecker lists media mediaembed mentions mergetags nonbreaking pagebreak pageembed permanentpen powerpaste preview quickbars save searchreplace table tableofcontents tinydrive tinymcespellchecker typography visualblocks visualchars wordcount",
                  // theme: 'modern',
                  keep_styles: true,
                  width: '100%',
                  inline_styles: true,
                  verify_html: false,
                  valid_children : '+body[style],-body[div],p[strong|a|#text]',
                  
                  }}
                />
                {/* <TinyMCE/> */}
              </div>
              <div className='flex gap-10 mt-5'>
                  <div className='w-full md:w-2/4'>
                  <Select
                    options={["Management", "Stories", "Development", "Updates"]}
                    label="Blog Category*"
                    value={blogData.blog_category}
                    onChange={handleOptionChange}
                  />
                  </div>
                  <div className='w-full md:w-2/4'>
                  <Select
                      options={["Active", "Draft"]}
                      label="Blog Status"
                      value={blogData.status}
                      onChange={handleStatusChange}
                  />
                  </div>
              </div>
            </Tab.Panel>
            {/* <Tab.Panel>
            <div className='py-5'>
                  <Designer/>
              </div>
            </Tab.Panel> */}

            <Tab.Panel>
            <div className='flex flex-col md:flex-row w-full gap-10'>
              <div className='w-full md:w-1/2'>
                <Textinput
                    label="Meta Title"
                    id="pn3"
                    placeholder=" Disabled Input"
                    type="text"
                    defaultValue={metaTag.main_title}
                    onChange={(e) => setMetaTag({...metaTag, main_title:e.target.value, title:e.target.value, og_title:e.target.value, twitter_title:e.target.value})}
                />
                <Textarea
                    label="Meta Description"
                    id="pn4"
                    placeholder="Type Meta Description"
                    defaultValue={metaTag.main_description}
                    onChange={(e) => setMetaTag({...metaTag, main_description:e.target.value, description:e.target.value, og_description:e.target.value, twitter_description:e.target.value})}
                />
                <p className='my-3'>Property: og:image / Featured Image</p>
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
                      src={`${AppwriteUrl}${setting?.meta_property?.og_image}`}
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
        <div className='flex justify-end items-center mt-5'>
          <Button text="Save" className="btn-success py-2" onClick={() => saveHandler()} />
        </div>
      </Card>
    </div>
  )
}

export default AddBlog