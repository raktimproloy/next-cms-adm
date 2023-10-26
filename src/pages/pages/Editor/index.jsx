import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import Sidebar from "@/pages/pages/Editor/Sidebar";
import TopNav from "@/pages/pages/Editor/TopNav";
import geditorConfig from "@/utils/api/geditor_config";
import PageSection from "@/pages/pages/Editor/PageSection";
import {API_HOST} from "@/utils"
import "@/styles/main.scss"

const Editor = () => {
  const [editor, setEditor] = useState(null);
  const [assets, setAssets] = useState([]);
  const { pageId } = useParams();

  const { pageStore } = useSelector((state) => state);
  const { pages } = pageStore;

  // useEffect(() => {
  //   async function getAllAssets() {
  //     try {
  //       const response = await axios.get(`${API_HOST}assets/`, {
  //         headers:{
  //           "Access-Control-Allow-Origin": "*"
  //         }
  //       });
  //       setAssets(response.data);
  //     } catch (error) {
  //       setAssets(error.message);
  //     }
  //   }

  //   getAllAssets();
  // }, []);

  useEffect(() => {
    const editor = geditorConfig(assets, pageId);
    setEditor(editor);
  }, [pageId, assets]);
  return (
    <div className="App">
      <div
        id="navbar"
        className="sidenav d-flex flex-column overflow-scroll position-fixed"
      >
        <nav className="navbar navbar-light">
          <div className="container-fluid">
            <span className="navbar-brand mb-0 h3 logo">Code Dexterous</span>
          </div>
        </nav>
        <PageSection pages={pages} />
        <Sidebar />
      </div>
      <div
        className="main-content position-relative w-85 start-15"
        id="main-content"
      >
        <TopNav />
        <div id="editor"></div>
      </div>
    </div>
  );
};

export default Editor;
