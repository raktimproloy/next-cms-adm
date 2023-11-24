import React, { useEffect, useState, Fragment } from 'react'
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
import { useNavigate, useParams } from 'react-router-dom'
import { Tab } from "@headlessui/react";
import {Editor} from "@tinymce/tinymce-react"


const buttons = [
    {
      title: "Blog Info",
      icon: "heroicons-outline:home",
    },
    {
      title: "Blog Details",
      icon: "heroicons-outline:user",
    }
];

function AddBlog() {
  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const [text, setText] = useState("")
  const [value, setValue] = useState("<p>TinyMCE Editor text</p>")

  const [blogData, setBlogData] = useState({
    title: "",
    slug: "",
    active: false,
    published_date: "23 March, 2024",
  })
  


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
        console.log(res)
        // setPageData(res.data)
        // setMetaTag(res.data.meta_property)
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

    if(pageData.template_category === "Grapesjs" || (pageData.template_category === "Predesign" && pageData.template !== "") ){
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
  }

  // Selection Handler
  function handleOptionChange(e) {
    setPageData({
        ...pageData, template_category:e.target.value
    })
  }

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
                label="Blog Title"
                id="pn"
                type="text"
                placeholder="Type Your Blog Title"
                // defaultValue={pageData.title}
                // onChange={(e) => setPageData({...pageData, title:e.target.value, slug: e.target.value.replace(/ /g, "-").toLowerCase()})}
            />
            <Textinput
                label="Blog Slug"
                id="pn2"
                type="text"
                placeholder="Type Your Blog Slug"
                // readonly={pageData.template_category.toLowerCase() == "predesign" ? false : true}
                // defaultValue={pageData.template}
                // onChange={(e) => setPageData({...pageData, template:e.target.value})}
            />
            <Select
                options={["Management", "Stories, Development, Updates"]}
                label="Blog Category"
                // value={pageData.template_category}
                // onChange={handleOptionChange}
            />
            <Textarea
                label="Blog Tags"
                id="pn4"
                placeholder="Input blog tags"
                // defaultValue={pageData.meta_description}
                // onChange={(e) => setPageData({...pageData, meta_description:e.target.value})}
            />
            <div>
                <label htmlFor="" className='pb-3'>Blog Active</label>
                <Switch
                label="Blog Active Status"
                activeClass="bg-danger-500"
                // value={pageData.active}
                // onChange={() => setPageData({...pageData, active: !pageData.active})}
                />
            </div>
            </Tab.Panel>
            <Tab.Panel>
            <Editor 
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
                plugins: "a11ychecker advcode advlist advtable anchor autocorrect autolink autoresize autosave casechange charmap checklist code codesample directionality editimage emoticons export footnotes formatpainter fullscreen image inlinecss insertdatetime link linkchecker lists media mediaembed mentions mergetags nonbreaking pagebreak pageembed permanentpen powerpaste preview quickbars save searchreplace table tableofcontents template tinycomments tinydrive tinymcespellchecker typography visualblocks visualchars wordcount"
                }}
            />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
        <div className='flex justify-between items-center mt-5'>
          <Button text="Save" className="btn-success py-2" onClick={() => {
            editHandler()
          }}  />
        </div>
      </Card>
    </div>
  )
}

export default AddBlog