import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { API_HOST } from '@/utils';
import DOMPurify from 'isomorphic-dompurify';

function Test() {
  const [htmlData, setHtmlData] = useState([])
  const [cleanHTML, setCleanHTML] = useState()
  const [cleanCSS, setCleanCSS] = useState()
  const [cleanScript, setCleanScript] = useState()

  useEffect(() => {
    async function getAllAssets() {
      try {
        const response = await axios.get(`${API_HOST}api/pages/about/content`);
        setHtmlData(response.data);
      } catch (error) {
        setHtmlData(error.message);
      }
    }

    getAllAssets();
  }, [])
  useEffect(() => {

    // JavaScript code from the provided HTML
    if(htmlData.mycustom_html){
      const splitScript = htmlData.mycustom_html.toString().split("<script>")
      const splitScript2 = splitScript[1].split("</script>")
      setCleanScript(splitScript2[0])
    }
    const script = document.createElement('script');
    script.innerHTML = cleanScript;

    script.async = true
    // Append the script to the body
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  }, [cleanHTML, cleanScript]);

  useEffect(() => {
    const cleanHTML = DOMPurify.sanitize(htmlData.mycustom_html);
    const cleanCSS = DOMPurify.sanitize(htmlData.mycustom_css);
    setCleanHTML(cleanHTML)
    setCleanCSS(cleanCSS)
  }, [htmlData])
  return (
    <div>
    {/* Render the HTML from the data object */}
    <div dangerouslySetInnerHTML={{ __html: cleanHTML }} />

    <style jsx="true">
      {cleanCSS}
    </style>
    </div>
  )
}

export default Test