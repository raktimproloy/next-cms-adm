import React, { useEffect, useState } from 'react'
import Button from "@/components/ui/Button"
import GridLayout from "react-grid-layout";
import Modal from "@/components/ui/Modal";
import Tooltip from "@/components/ui/Tooltip"
import Icon from "@/components/ui/Icon"
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import { getAllMenus } from '../../utils/getAllMenus';
import { getAllPages } from '../../utils/getAllPages';
import axios from 'axios';
import { API_HOST } from '../../utils';
import Popup from "@/components/ui/Popup"
import Select from "@/components/ui/Select"
import Card from "@/components/ui/Card"
import Textinput from "@/components/ui/Textinput"
import { Responsive, WidthProvider } from "react-grid-layout";
const ResponsiveGridLayout = WidthProvider(Responsive);

function DragableMenuManager() {

    const [layout, setLayout] = useState([]);
    const location = useLocation()
    const state = location.state
    const params = useParams()
    const [selectedPages, setSelectedPages] = useState([])
    const pageData = useSelector((state) => state.pages);
    const updateInfo = useSelector((state) => state.update);
    const [menuItems, setMenuItems] = useState([])
    const [menuData, setMenuData] = useState({
      title: "",
      alias: "",
      status: true,
      children: false,
      parentAlias: "none",
      template: "Default",
    })
  
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [showLoading, setShowLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
  
    const [showModal, setShowModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState({slug: "", modal: false})
    const [selectItems, setSelectItems] = useState([])
    const [selectParent, setSelectParent] = useState("")
    const [layoutShowingData, setLayoutShowingData] = useState([])
    const [childrenList, setChildrenList] = useState([])
    const [selectedPage, setSelectedPage] = useState({
      slug: "",
      title: ""
    })
    useEffect(() => {
      if (updateInfo.menuUpdate === "" || updateInfo.menuUpdate === "not-updated") {
        getAllMenus(dispatch, cookie, removeCookie);
      }
      if (updateInfo.pageUpdate === "" || updateInfo.pageUpdate === "not-updated") {
        getAllPages(dispatch, cookie, removeCookie);
      }
    }, [dispatch, pageData, updateInfo]);
  
    // Added all page
    useEffect(() => {
      setSelectedPages([{value: "none", label: "None"}])
      pageData.map(page => {
        setSelectedPages(oldPage => [...oldPage, { value: page.slug, label: page.title }])
      })
    }, [pageData])
  
    // Cookies
    const [cookie, removeCookie] = useCookies()
    const headers = {
    'Authorization': `Bearer ${cookie._token}`
    }
  
    // Get data
    useEffect(() => {
    axios.get(`${API_HOST}menu/top-menu`, {
        headers: headers
        })
        .then((res) => {
        setMenuData(res.data)
        setMenuItems(res.data.items)
        })
        .catch((err) => {
        console.log(err)
        });
    }, [showModal, showDeleteModal.modal])
  
    useEffect(() => {
      setLayout([]);
      const dummyLayout  = []
      if(menuItems && menuItems.length > 0){
        let dummyNumber = 0
        const sortItems = [...menuItems].sort((a, b) => a.order - b.order);
        sortItems.map(parent => {
          dummyLayout.push({
            i: parent.menu_slug,
            x: 0,
            y: dummyNumber,
            w: 2.7,
            h: 1.5,
          })
          dummyNumber = dummyNumber + 1
          if(parent.items && parent.items.length > 0){
            parent.items.map(child => {
              dummyLayout.push({
                i: parent.menu_slug + "/" + child.menu_slug,
                x: 1,
                y: dummyNumber,
                w: 2.7,
                h: 1.5,
              })
              dummyNumber = dummyNumber + 1
              if(child.items && child.items.length > 0){
                child.items.map(sub => {
                  dummyLayout.push({
                    i: parent.menu_slug + "/" + child.menu_slug + "/" + sub.menu_slug,
                    x: 2,
                    y: dummyNumber,
                    w: 2.7,
                    h: 1.5,
                  })
                  dummyNumber = dummyNumber + 1
                })
              }
            })
          }
        })
        setLayout(dummyLayout)
      }
      
      setLayoutShowingData([])
      const dummyShowingLayout = []
      if(menuItems && menuItems.length > 0){
        menuItems.map((menu) => {
          dummyShowingLayout.push({
            slug: menu.menu_slug,
            title: menu.title
          })
          if(menu.items && menu.items.length > 0){
            menu.items.map(item => {
              dummyShowingLayout.push({
                slug: menu.menu_slug + "/" + item.menu_slug,
                title: item.title
              })
              if(item.items && item.items.length > 0){
                item.items.map(sub => {
                  dummyShowingLayout.push({
                    slug: menu.menu_slug + "/" + item.menu_slug + "/" + sub.menu_slug,
                    title: sub.title
                  })
                })
              }
            })
          }
        })
        setLayoutShowingData(dummyShowingLayout)
      }
  
      setSelectItems([])
      setChildrenList([{value:"none", label: "None"}])
      menuItems && menuItems.length > 0 && menuItems.map(item => {
        setSelectItems(oldPage => [...oldPage, { value: item.menu_slug, label: item.title }])
      })
      setSelectParent(selectItems[0]?.value)
    }, [menuItems]);
  
    // Handle page change
    function handlePageChange(e) {
      selectedPages.map(page => {
        if(e.target.value === page.value){
          setSelectedPage({slug: e.target.value, title: page.label})
        }
      })
    }
  
    function handleParentChange(e) {
      setSelectParent(e.target.value)
      setChildrenList([{value:"none", label: "None"}])
      menuItems.map(item => {
        if(item.menu_slug === e.target.value){
          if(item.items && item.items.length > 0){
            item.items.map(child => {
              setChildrenList(oldPage => [...oldPage, { value: item.menu_slug + "/" +child.menu_slug, label: child.title }])
            })
            
          }else{
            setChildrenList([])
          }
        }
      })
    }
  
    const handleAddItem = () => {
      axios.post(`${API_HOST}menu/add/item/${menuData._id}`, 
      {
        parent_slug: selectParent,
        page_slug: selectedPage.slug,
        page_title: selectedPage.title
  
      }, {
        headers: headers
      })
      .then((res) => {
        setShowModal(false)
        dispatch(addInfo({ field: 'menuUpdate', value: 'not-updated' }));
        toast.success("Menu Item Added Successful!", {
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
        if(err.response.data.error === "Authentication error!"){
            removeCookie("_token")
        }
        toast.error("Menu Item Added Unsuccessful!", {
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
    }
  
    const handleItemDelete = () => {
      const slug  = showDeleteModal.slug
      axios.post(`${API_HOST}menu/delete/item/${menuData._id}`, 
      {
        slug,
      }, {
        headers: headers
      })
      .then((res) => {
        setShowDeleteModal({slug: "", modal: false})
        dispatch(addInfo({ field: 'menuUpdate', value: 'not-updated' }));
        toast.success("Menu Items Deleted Successful!", {
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
        setShowDeleteModal({slug: "", modal: false})
        if(err.response.data.error === "Authentication error!"){
            removeCookie("_token")
        }
        toast.error("Menu Item Deleted Unsuccessful!", {
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
    }
  
    const handleChildrenChange = (e) => {
      setSelectParent(e.target.value === "none"? selectParent.split("/").shift() :e.target.value)
    }

    const handleLayoutSave = () => {
    }

    
  return (
    <>
    {/* <ToastContainer/> */}
    <Popup showLoading={showLoading} popupText={"Menu Type Updating..."}  />
        <Modal
          title="Add New Item"
          label=""
          labelClass="btn-outline-success p-1 "
          themeClass="bg-success-500"
          activeModal={showModal}
          onClose={() => {
            setShowModal(false)
          }}
          footerContent={
            <Button
              text="Add"
              className="btn-success "
              onClick={handleAddItem}
            />
          }
        >
          <h4 className="font-medium text-lg mb-3 text-slate-900">
            Add New Item
          </h4>
          <div className="text-base text-slate-600 dark:text-slate-300">
            <Select
              options={selectedPages}
              label="Select Page"
              onChange={handlePageChange}
            /> 
            <Select
              options={selectItems}
              label="Select Parent"
              onChange={handleParentChange}
            /> 
            <Select
              options={childrenList}
              label="Select Children"
              disabled={childrenList.length > 1 ? false : true}
              onChange={handleChildrenChange}
            /> 
          </div>
        </Modal>
        <Modal
          title="Delete Item"
          label=""
          labelClass="btn-outline-danger p-1 "
          themeClass="bg-danger-500"
          activeModal={showDeleteModal.modal}
          onClose={() => {
            setShowDeleteModal({...showDeleteModal, modal: false})
          }}
          footerContent={
            <Button
              text="Delete"
              className="btn-danger "
              onClick={handleItemDelete}
            />
          }
        >
          <h4 className="font-medium text-lg mb-3 text-slate-900">
            Delete Item
          </h4>
          <div className="text-base text-slate-600 dark:text-slate-300">
            Do you want to delete this item?
          </div>
        </Modal>
        <Card title="Menu Type Edit">
            <div>
                <div>
                    <p>Edit Menu Items</p>
                    <div className='flex justify-between'>
                        <Button text="Add Item" className="btn-warning py-2" onClick={() => {
                            setShowModal(true)
                        }}  />

                        <Button text="Save Menu" className="btn-success py-2" onClick={handleLayoutSave}  />
                    </div>
                </div>
                <GridLayout
                className="layout"
                layout={layout}
                cols={5}
                isDraggable={true}
                isResizable={false}
                
                rowHeight={30}
                width={600}
                onLayoutChange={(e) => {console.log("layout", e); console.log("Menu", menuItems)}}
                >
                {layoutShowingData.map(menu => (
                    <div key={menu.slug} className='bg-white border border-gray-200 rounded shadow flex items-center justify-betweeen px-5'>
                    <p className='text-gray-500 text-lg w-3/4'>{menu.title}</p>
                    <div className='w-1/4 flex justify-end'>
                        <Tooltip content="Delete" placement="top" arrow animation="shift-away">
                        <button className="action-btn btn-outline-danger mr-3" type="button" 
                        onClick={() => 
                            setShowDeleteModal({slug: menu.slug, modal: true})
                        }
                        >
                            <Icon icon="heroicons:trash" />
                        </button>
                        </Tooltip>
                    </div>
                    </div>
                ))}
                </GridLayout>
            </div>
        </Card>
    </>
  )
}

export default DragableMenuManager