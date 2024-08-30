import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "@/pages/Editor/Sidebar";
import TopNav from "@/pages/Editor/TopNav";
import geditorConfig from "@/utils/api/geditor_config";
import Textinput from "@/components/ui/Textinput"
import "@/styles/main.scss"
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getAllPages } from "../../utils/getAllPages";
import { useCookies } from "react-cookie";

const Editor = () => {
  const [editor, setEditor] = useState(null);
  const pathname = window.location.pathname
  const [search, setSearch] = useState("")
  // Set Default Image
  const [assets, setAssets] = useState([
  ]);
  const [editorPageData, setEditorPageData] = useState({})
  const dispatch = useDispatch()
  const data = useSelector((state) => state.pages);
  const updateInfo = useSelector((state) => state.update);
  const [cookie, removeCookie] = useCookies()
  const { slug } = useParams();

  useEffect(() => {
    const editor = geditorConfig(assets, slug);
    setEditor(editor);
  }, [slug, assets]);

  useEffect(() => {
    if (updateInfo.pageUpdate === "" || updateInfo.pageUpdate === "not-updated") {
      getAllPages(dispatch, cookie, removeCookie);
    }
  }, [dispatch, data, updateInfo]);

  useEffect(() => {
    if(data.length > 0){
      data.map(page => {
        if(page.slug === slug){
          setEditorPageData(page)
        }
      })
    }
  }, [slug, data])

    
  const blockSearch = (search) => {
    const categories = document.querySelector(".gjs-block-categories")
    for (let index = 0; index < categories.children.length; index++) {
      const element = categories.children[index];
      element.style.display = "inline"
      for (let elementPropertyIndex = 0; elementPropertyIndex < element.children[1].children.length; elementPropertyIndex++) {
        const property = element.children[1].children[elementPropertyIndex];
        if(property.getAttribute("title")){
          if(property.getAttribute("title").toLowerCase().includes(search.toLowerCase())){
            property.style.display = "block"
            element.style.display = "block"
            element.children[1].style.display = "flex"
          }else{
            property.style.display = "none"
            if(element.style.display !== "block"){
              element.style.display = "none"
            }
          }
        }
      }
      if(search.length === 0){
        element.children[1].style.display = "none"
      }
    }
  }

  const brushSearch = (search) => {
    const categories = document.querySelector(".gjs-sm-sectors")
    const settings = document.querySelector(".gjs-trt-traits ")
    
    if(settings.children.length > 0){
      for (let index = 0; index < settings.children.length; index++) {
        const element = settings.children[index];
        element.style.display = "inline"
        // This is title
        const elementTitle = element.children[0].children[0].children[0].innerHTML
        if(elementTitle.toLowerCase().includes(search.toLowerCase())){
          element.style.display = "inline"
        }else{
          element.style.display = "none"
        }
      }
    }

    for (let index = 0; index < categories.children.length; index++) {
      const element = categories.children[index];
      element.style.display = "inline"
      // This is title
      const elementTitle = element.children[0].children[1].innerHTML
      for (let propertyIndex = 0; propertyIndex < element.children[1].children.length; propertyIndex++) {
        const property = element.children[1].children[propertyIndex];
        if(property.children[0].children[0].innerText.trim().toLowerCase().includes(search.toLowerCase())){
          element.style.display = "block"
          property.style.display = "block"
        }else{
          if(element.style.display !== "block"){
            element.style.display = "none"
          }
          property.style.display = "none"
        }
      }
    }
  }
  
  const handleSearch = (search) => {
    brushSearch(search)
    blockSearch(search)
  }
  
  return (
    <div className="App main-container flex d-flex mb-5">
      <div
        className="main-content position-relative w-85 start-15"
        id="main-content"
      >
        <TopNav editorPageData={editorPageData} />
        <div id="editor" style={{height: "50vh"}}></div>
      </div>
      <div
        id="navbar"
        className="sidenav d-flex flex-column overflow-scroll position-fixed"
      >
        <div>
        <Textinput
          // label="Search"
          id="pn3"
          placeholder="Search..."
          type="text"
          defaultValue={search}
          onChange={(e) => {
            handleSearch(e.target.value)
            setSearch(e.target.value)
          }}
        />
        </div>
        <Sidebar />
      
      </div>
    </div>
    
  );
};

export default Editor;
