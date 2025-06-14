import React, { useEffect, useState, Fragment } from 'react'
import Card from "@/components/ui/Card"
import Textinput from "@/components/ui/Textinput"
import Select from "@/components/ui/Select"
import Textarea from "@/components/ui/Textarea"
import Switch from "@/components/ui/Switch"
import Button from "@/components/ui/Button"
import Keyword from "@/components/ui/Keyword"
import Fileinput from "@/components/ui/Fileinput"
import axios from 'axios'
import { API_HOST } from '@/utils'
import { useCookies } from 'react-cookie'
import Popup from "@/components/ui/Popup"
import { useDispatch } from 'react-redux'
import { addInfo } from '../../store/layout'
import { useNavigate, useParams } from 'react-router-dom'
import { Tab } from "@headlessui/react";
import {Editor} from "@tinymce/tinymce-react"
import Image from "@/components/ui/Image"
import image2 from "@/assets/images/all-img/image-2.png";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useSelector } from 'react-redux'
import {AddLog} from "@/utils/logHandler"
import { getSetting } from '../../utils/getSetting'
import { StoreMetaImage } from '@/utils/appwrite/StoreImage';
import { ToastContainer, toast } from 'react-toastify'
import Designer from '../Editor'
import Icon from "@/components/ui/Icon"
import Tooltip from "@/components/ui/Tooltip"
import Modal from "@/components/ui/Modal"

const buttons = [
  {
    title: "Blog Details",
    icon: "heroicons-outline:home",
  },
  {
    title: "Designer",
    icon: "heroicons-outline:user",
  },
  {
    title: "Blog Metatag",
    icon: "heroicons-outline:user",
  }
];

// let schema = yup.object().shape({
//   title: yup.string().required("Title is required"),
//   slug: yup.string().required("Slug is required"),
// });

function EditBlog() {
  const tinymceApi = import.meta.env.VITE_TINYMCE_API
  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [errorMessage, setErrorMessage] = useState("")
  
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


  // const {
  //   register,
  //   formState: { errors },
  //   handleSubmit,
  // } = useForm({
  //   resolver: yupResolver(schema),
  //   //
  //   mode: "all",
  // });

  const [blogTag, setBlogTag] = useState([])

  const [blogData, setBlogData] = useState({
    title: "",
    slug: "",
    status: "",
    design_type: 0,
    published_date: "",
    blog_category: "",

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

// Get data
useEffect(() => {
    axios.get(`${API_HOST}blog/${params.slug}`, {
        headers: headers
    })
    .then((res) => {
        setBlogData(res.data)
        setBlogTag(res.data.blog_tags)
        setValue(res.data.blog_details)
        setMetaTag(res.data.meta_property)
    })
    .catch((err) => {
        console.log(err)
    });
}, [])
const [changeMetaImage, setChangeMetaImage] = useState("")
//   Edit Data
  const editHandler = async() => {
    setShowLoading(true)
    try{
      let og_imageUrl =  metaTag.og_image
      if(changeMetaImage.length > 0){
        og_imageUrl = changeMetaImage
      }else if(selectedFile){
        og_imageUrl = await StoreMetaImage(selectedFile, setting?.storage_config?.storage_meta_bucket_id);
      }
      const formData = new FormData();
      formData.append('title', blogData.title);
      formData.append('slug', blogData.slug);
      formData.append('status', blogData.status);
      formData.append('design_type', blogData.design_type);
      formData.append('published_date', blogData.published_date);
      formData.append('blog_category', blogData.blog_category);
      formData.append('blog_tags', blogTag);
      formData.append('blog_details', value);
      formData.append("og_image", og_imageUrl)
      formData.append("meta_property", JSON.stringify(metaTag))

      axios.post(`${API_HOST}blog/update/${params.slug}`, formData, {
          headers: headers
      })
      .then((res) => {
          AddLog(profileData.email, "blog", `Blog Edited Successful`)
          dispatch(addInfo({ field: 'blogUpdate', value: 'not-updated' }));
          setShowLoading(false)
          navigate("/blog")
          toast.success("Blog Updated Successful!", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
      })
      .catch((err) => {
          setErrorMessage(err.response.data.error)
          setShowLoading(false)
          if(err.response.data.error === "Authentication error!"){
            removeCookie("_token")
            AddLog(profileData.email, "blog", `Blog Edited Faild For Authorization`)
          }else{
            AddLog(profileData.email, "blog", `Blog Edited Unsuccessful`)
          }
          toast.error("Blog Updated Unsuccessful!", {
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
    }catch(error){
      toast.error("Blog Updated Unsuccessful!", {
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

  const [activeModal, setActiveModal] = useState(false)
  const handleMetaImage = () => {
    setChangeMetaImage(setting?.meta_property?.og_image)
    setActiveModal(false)
  }

  return (
    <div>
        {/* <ToastContainer/> */}
        <Popup showLoading={showLoading} popupText={"Blog Updating..."}  />
        <Modal
          title="Warning"
          label=""
          labelClass="btn-outline-warning p-1"
          themeClass="bg-warning-500"
          activeModal={activeModal}
          onClose={() => {
            setActiveModal(false)
          }}
          footerContent={
            <Button
              text="Accept"
              className="btn-warning "
              onClick={handleMetaImage}
            />
          }
        >
          <h4 className="font-medium text-lg mb-3 text-slate-900">
            Delete Og Image
          </h4>
          <div className="text-base text-slate-600 dark:text-slate-300">
            Do you want to delete ob image?
          </div>
        </Modal>
        <Card title="Blog Edit">
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
                        label="Blog Title"
                        id="pn"
                        // name="title"
                        type="text"
                        placeholder="Type Your Blog Title"
                        // register={register}
                        // error={errors.title}
                        defaultValue={blogData.title}
                        onChange={(e) => setBlogData({...blogData, title:e.target.value, slug: e.target.value.replace(/ /g, "-").toLowerCase()})}
                    />
                    <Textinput
                        label="Blog Slug"
                        className={errorMessage.includes("dup key") && "border-1 dark:border-red-700"}
                        id="pn2"
                        // name="slug"
                        type="text"
                        placeholder="Type Your Blog Slug"
                        // register={register}
                        // error={errors.slug}
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
                      apiKey={setting.tiny_mce}
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
                      valid_children : '+body[style],-body[div],p[strong|a|#text]'
                      }}
                  />
              </div>
              <div className='flex gap-10 mt-5'>
              <div className='w-full md:w-2/4'>
                <Select
                  options={["Management", "Stories", "Development", "Updates"]}
                  label="Blog Category"
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
              <Tab.Panel>
                <div className='py-5'>
                  <Designer/>
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
                  <div className='flex justify-between'>
                    <span className="text-base font-medium tracking-[0.01em] dark:text-slate-300 text-slate-500 mb-3">
                      View Meta Image :
                    </span>
                    {
                      metaTag.og_image !== setting?.meta_property?.og_image ?
                        <Button text="Remove" className="btn-success py-2" onClick={() => setActiveModal(true)} />
                      : ""
                    }
                  </div>
                  <div className='flex justify-center'>
                    <Image
                      src={changeMetaImage.length > 0 ? `${AppwriteUrl}${changeMetaImage}`  : `${AppwriteUrl}${metaTag.og_image}`}
                      alt="Small image with fluid:"
                      className="rounded-md w-[90%] h-[250px]"
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
            <Button text="Save" className="btn-success py-2" onClick={() => editHandler()} />
          </div>
      </Card>
    </div>
  )
}

export default EditBlog