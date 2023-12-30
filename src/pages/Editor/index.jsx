import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "@/pages/Editor/Sidebar";
import TopNav from "@/pages/Editor/TopNav";
import geditorConfig from "@/utils/api/geditor_config";
import PageSection from "@/pages/Editor/PageSection";
import "@/styles/main.scss"
import GjsEditor from '@grapesjs/react';

const Editor = () => {
  const [editor, setEditor] = useState(null);
  // Set Default Image
  const [assets, setAssets] = useState([
    "https://res.cloudinary.com/dcbantk1f/image/upload/v1690037754/blog-desk/blogs/y287vtcrul7xuqju9uko.jpg"
  ]);

  const { slug } = useParams();

  const { pageStore } = useSelector((state) => state);
  const { pages } = pageStore;

  useEffect(() => {
    const editor = geditorConfig(assets, slug);
    setEditor(editor);
  }, [slug, assets]);

  

  
  return (
    <div className="App main-container flex d-flex mb-5">
      <div
        className="main-content position-relative w-85 start-15"
        id="main-content"
      >
        <TopNav />
        <div id="editor" style={{height: "50vh"}}></div>
      </div>
      <div
        id="navbar"
        className="sidenav d-flex flex-column overflow-scroll position-fixed"
      >
        <Sidebar />
      
      </div>
    </div>
    
  );
};

export default Editor;
