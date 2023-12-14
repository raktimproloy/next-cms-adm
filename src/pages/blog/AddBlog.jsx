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
import { useDispatch } from 'react-redux'
import { addInfo } from '../../store/layout'
import { useNavigate, useParams } from 'react-router-dom'
import { Tab } from "@headlessui/react";
import {Editor} from "@tinymce/tinymce-react"
import image2 from "@/assets/images/all-img/image-2.png";
import { CurrentDate } from '@/utils/CurrentDate'
import TinyMCE from './TinyMCE'



const buttons = [
    {
      title: "Blog Details",
      icon: "heroicons-outline:home",
    },
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
  
  const [text, setText] = useState("")
  const [value, setValue] = useState("<p>TinyMCE Editor text</p>")


  const [blogTag, setBlogTag] = useState([])

  const [blogData, setBlogData] = useState({
    title: "",
    slug: "",
    status: "",
    published_date: CurrentDate(),
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

//   Save Data
  const saveHandler = () => {
    setShowLoading(true)
    const formData = new FormData();
    formData.append('title', blogData.title);
    formData.append('slug', blogData.slug);
    formData.append('status', blogData.status);
    formData.append('published_date', blogData.published_date);
    formData.append('blog_category', blogData.blog_category.toLowerCase());
    formData.append('blog_tags', JSON.stringify(blogTag));
    formData.append('blog_details', value);
    formData.append("og_image", selectedFile)
    formData.append("meta_property", JSON.stringify(metaTag))

    axios.post(`${API_HOST}blog/add`, formData, {
        headers: headers
    })
    .then((res) => {
        dispatch(addInfo({ field: 'blogUpdate', value: 'not-updated' }));
        setShowLoading(false)
        navigate("/blog")
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
              <div className='flex gap-10'>
                <div className='w-2/4'>
                <Textinput
                  label="Blog Title"
                  id="pn"
                  type="text"
                  placeholder="Type Your Blog Title"
                  defaultValue={blogData.title}
                  onChange={(e) => setBlogData({...blogData, title:e.target.value, slug: e.target.value.replace(/ /g, "-").toLowerCase()})}
                />
                <Textinput
                    label="Blog Slug"
                    id="pn2"
                    type="text"
                    placeholder="Type Your Blog Slug"
                    defaultValue={blogData.slug}
                    onChange={(e) => setBlogData({...blogData, slug:e.target.value})}
                />
                <Select
                  options={["Management", "Stories", "Development", "Updates"]}
                  label="Blog Category"
                  value={blogData.blog_category}
                  onChange={handleOptionChange}
                />
                </div>

                <div className='w-2/4'>
                <Keyword tags={blogTag} setTags={setBlogTag} />
                <Select
                    options={["Active", "Draft"]}
                    label="Blog Status"
                    value={blogData.status}
                    onChange={handleStatusChange}
                />
                </div>
              </div>
              <div className='mt-5'>
                <p className='mb-2'>Write Your Blog:</p>
                <Editor 
                  apiKey={tinymceApi}
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
            
            </Tab.Panel>

            <Tab.Panel>
            <div className='flex w-100 justify-items-between gap-10'>
              <div className='w-2/4'>
                <Textinput
                    label="Meta Title"
                    id="pn3"
                    placeholder=" Disabled Input"
                    type="text"
                    defaultValue={metaTag.main_title}
                    onChange={(e) => setMetaTag({...metaTag, main_title:e.target.value})}
                />
                <Textarea
                    label="Meta Description"
                    id="pn4"
                    placeholder="Type Meta Description"
                    defaultValue={metaTag.main_description}
                    onChange={(e) => setMetaTag({...metaTag, main_description:e.target.value})}
                />
                <p className='my-3'>Property: og:image</p>
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
        <div className='flex justify-end items-center mt-5'>
          <Button text="Save" className="btn-success py-2" onClick={() => {
            saveHandler()
          }}  />
        </div>
      </Card>
    </div>
  )
}

export default AddBlog