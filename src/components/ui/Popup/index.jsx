import React from 'react'
import Spinner from "/spinner.gif"
import styles from "./style.module.css"

function index({showLoading=false, popupText}) {
  return (
    <div className={`fixed left-0 w-screen flex justify-center ease-in-out duration-200 ${showLoading ? "top-3 opacity-100 visible" : "top-[-25%] opacity-0 invisible"} `} style={{zIndex:"999999"}}>
      <div className='bg-black-500 px-10 rounded text-white border-b-2'>
        <div className='flex items-center'>
          <img src={Spinner} alt="" className='w-14 h-14 mr-4' />
            {popupText}
        </div>
      </div>
    </div>
  )
}

export default index