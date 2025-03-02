import React, { useEffect, useState, Fragment } from 'react'
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import Popup from "@/components/ui/Popup"
import Select from "@/components/ui/Select"
import Textinput from "@/components/ui/Textinput"
import Modal from "@/components/ui/Modal"
import { useSelector } from 'react-redux';
import { getAllPages } from '../../utils/getAllPages';
import axios from 'axios';
import { API_HOST } from '@/utils';
import { addInfo } from '../../store/layout';
import { Link, useNavigate } from 'react-router-dom';
import { deletePage } from '@/store/actions/pageAction';
import { getAllMenus } from '../../utils/getAllMenus';
import swal from 'sweetalert';
import { ToastContainer, toast } from 'react-toastify';
import DragableMenuManager from './DragableMenuManager';
import DragMenuManager from './DragMenuManager';

const columns = [
    {
      label: "Title",
      field: "title",
    },
    {
      label: "Slug",
      field: "slug",
    },
    {
      label: `Position`,
      field: "position",
    },
    {
      label: "Menu Type",
      field: "menu-type",
    },
    {
      label: "Status",
      field: "status",
    },
    {
      label: "Manage",
      field: "manage",
    },
];

const styles = {
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
};

function MenuManager() {
  const navigate = useNavigate()
  const [selectionValue, setSelectionValue] = useState("")
  const [showLoading, setShowLoading] = useState(false)
  const [loadingText, setLoadingText] = useState("")
  const [editPopup, setEditPopup] = useState({
    slug: "",
    showEditModal: false
  })

  const [deleteInfo, setDeleteInfo] = useState({
    showDeleteModal: false,
    slug: ""
  })
  const [menuData, setMenuData] = useState({
    title: ""
  })

  const [externalLink, setExternalLink] = useState({
    title: "",
    link: "",
  })
  const [menuType, setMenuType] = useState([])
  const pageData = useSelector((state) => state.pages);
  const menuTypeData = useSelector((state) => state.menus);
  const [showingPages, setShowingPages] = useState([])
  const updateInfo = useSelector((state) => state.update);
  const dispatch = useDispatch()

  // Cookies
  const [cookie, removeCookie] = useCookies()
  const headers = {
    'Authorization': `Bearer ${cookie._token}`
    }

  useEffect(() => {
    if (updateInfo.pageUpdate === "" || updateInfo.pageUpdate === "not-updated") {
      getAllPages(dispatch, cookie, removeCookie);
    }
    if (updateInfo.menuUpdate === "" || updateInfo.menuUpdate === "not-updated") {
      getAllMenus(dispatch, cookie, removeCookie);
    }
  }, [dispatch, pageData, updateInfo]);

  useEffect(() => {
    const selectionValueArray = selectionValue.split("/")
    if(menuTypeData.length > 0){
      if(selectionValueArray.length === 1){
        menuTypeData.map(type => {
          if(type.alias === selectionValueArray[0]){
            setMenuData(type)
          }
        })
      }else if(selectionValueArray.length === 2){
        menuTypeData.map(type => {
          if(type.items && type.items.length > 0){
            type.items.map(item => {
              if(item.menu_slug === selectionValueArray[1]){
                setMenuData(item)
              }
            })
          }
        })
      }else{
        menuTypeData.map(type => {
          if(type.items && type.items.length > 0){
            type.items.map(item => {
              if(item.menu_slug === selectionValueArray[1] && item.items.length > 0){
                item.items.map(child => {
                  if(child.items && child.items.length > 0){
                    setMenuData(child)
                  }
                })
              }
            })
          }
        })
      }
    }
  }, [menuTypeData, selectionValue, pageData])

  // Menu Items sort and set Page data
  useEffect(() => {
    setShowingPages([])
    // console.log(menuData)
    const pagesData = []
    if(menuData.title !== ""){
      const sortItems = [...menuData.items].sort((a, b) => a.order - b.order);
      sortItems.map((item) => {
        // console.log(item)
         if(item.link_type === "external"){
            pagesData.push(item.link)
         }else{
           pageData.map((page) => {
            // console.log("pageSlug", page.slug, "menuSlug", item.menu_slug)
               if(page.slug === item.menu_slug){
                   pagesData.push(page)
               }
           })
         }
      })
    }
    setShowingPages(pagesData)
  }, [menuData, menuTypeData, pageData])

  // update Menu Type
  useEffect(() => {
    setMenuType([])
    // Update the menuType state based on menuTypeData
    const menuTypeValue = [];
    menuTypeData.forEach(type => {
      menuTypeValue.push({ value: type.alias, label: type.title });
      if (type.items && type.items.length > 0) {
        type.items.forEach(item => {
          if (item.items && item.items.length > 0) {
            menuTypeValue.push({ value: type.alias + "/" + item.menu_slug, label: item.title });
            item.items.map(child => {
              if(child.items && child.items.length > 0){
                menuTypeValue.push({ value: type.alias + "/" + item.menu_slug + "/" + child.menu_slug, label: child.title });
              }
            })
          }
        });
      }
    });

    setMenuType(menuTypeValue);

    if(selectionValue === ""){
      menuTypeData.length > 0 && setSelectionValue(menuTypeData[0].alias)
    }

  }, [menuTypeData])



  return (
    <div>
      <DragMenuManager/>
    </div>
    )
}

export default MenuManager