import axios from 'axios';
import { useHeTree, sortFlatData } from "he-tree-react";
import { useEffect, useState } from 'react';
import { API_HOST } from "../../utils";
import { useCookies } from 'react-cookie';
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button"
import Tooltip from "@/components/ui/Tooltip"
import Icon from "@/components/ui/Icon"
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { getAllMenus } from '../../utils/getAllMenus';
import { getAllPages } from '../../utils/getAllPages';
import Popup from "@/components/ui/Popup"
import Select from "@/components/ui/Select"
import Card from "@/components/ui/Card"
import Textinput from "@/components/ui/Textinput"
import { ToastContainer, toast } from 'react-toastify'
import { addInfo } from '../../store/layout';

const styles = {
    option: (provided, state) => ({
      ...provided,
      fontSize: "14px",
    }),
};

export default function DragMenuManager() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [menuItems, setMenuItems] = useState([])
    const [selectedPages, setSelectedPages] = useState([])
    const pageData = useSelector((state) => state.pages);
    const updateInfo = useSelector((state) => state.update);
    const menuTypeData = useSelector((state) => state.menus);
    const [selectItems, setSelectItems] = useState([])
    const [selectParent, setSelectParent] = useState("")
    const [childrenList, setChildrenList] = useState([])
    const [showLoading, setShowLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    // Assuming this is inside your functional component
    const [menuType, setMenuType] = useState([]);
    const [selectionValue, setSelectionValue] = useState("top-menu")

    useEffect(() => {
        const type = []
        menuTypeData && menuTypeData.length > 0 && menuTypeData.map(item => {
            type.push({value: item.alias, label: item.title})
        })
        setMenuType(type)
    }, [menuTypeData]);

    const [selectedPage, setSelectedPage] = useState({
        slug: "",
        title: ""
    })
    const [menuData, setMenuData] = useState({
        title: "",
        alias: "",
        status: true,
        children: false,
        parentAlias: "none",
        template: "Default",
      })
  
    const [showModal, setShowModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState({slug: "", modal: false})

    // Cookies
    const [cookie, removeCookie] = useCookies()
    const headers = {
    'Authorization': `Bearer ${cookie._token}`
    }

      // handle selection
  const handleTypeChange = (e) => {
    setSelectionValue(e.target.value)
  }

  const keys = { idKey: 'id', parentIdKey: 'parent_id' };
  const [data, setdata] = useState(() => sortFlatData([], keys));

//   json to Tree Convert
  useEffect(() => {
    setdata([])
    const dummyLayout  = []
    if(menuItems && menuItems.length > 0){
      let dummyNumber = 0
      const sortItems = [...menuItems].sort((a, b) => a.order - b.order);
      sortItems.map((parent, index) => {
        dummyLayout.push({
          slug: parent.menu_slug,
          id: dummyNumber,
          parent_id: null,
          name: parent.title,
        })
        dummyNumber = dummyNumber + 1
        if(parent.items && parent.items.length > 0){
          parent.items.map((child, index) => {
            dummyLayout.push({
                slug: parent.menu_slug + "/" + child.menu_slug,
                id: dummyNumber,
                parent_id: dummyNumber - (index + 1),
                name: child.title,
            })
            dummyNumber = dummyNumber + 1
            if(child.items && child.items.length > 0){
              child.items.map((sub,index) => {
                dummyLayout.push({
                    slug: parent.menu_slug + "/" + child.menu_slug + "/" + sub.menu_slug,
                    id: dummyNumber,
                    parent_id: dummyNumber - (index + 1),
                    name: sub.title,
                })
                dummyNumber = dummyNumber + 1
              })
            }
          })
        }
      })
      setdata(dummyLayout)
    }
}, [menuItems])

    // Get data
    useEffect(() => {
    if(selectionValue.length > 0){
        axios.get(`${API_HOST}menu/${selectionValue}`, {
            headers: headers
            })
            .then((res) => {
            setMenuData(res.data)
            setMenuItems(res.data.items)
            })
            .catch((err) => {
            console.log(err)
            });
    }
    }, [showModal, showDeleteModal.modal, selectionValue])


// Get Menu item Data using slug
const findMenuItem = (path) => {
    const pathSegments = path.split('/');
    let currentMenuItems = menuItems;
    for (const segment of pathSegments) {
        const foundItem = currentMenuItems.find(item => item.menu_slug === segment);
        if (pathSegments[pathSegments.length-1] !== foundItem.menu_slug) {
            currentMenuItems = foundItem.items;
        } else {
            return foundItem;
        }
    }
};

// Tree to json Converter
function convertData(data) {
    const topLevelItems = [];

    let parentOrder = 0
    let childOrder = 0
    let subOrder = 0
    data.forEach((item, index) => {
        if (item.parent_id === null) {
            const previousItem = findMenuItem(item.slug);
            const newItem = {
                ...previousItem,
                order: parentOrder,
                items: []
            };
            topLevelItems.push(newItem);
            parentOrder = parentOrder + 1
        }else{
            const parentSlug = data.find(menu => menu.id === item.parent_id).slug
            const splitSlug = parentSlug.split("/")
            if(splitSlug.length === 1){
                topLevelItems.map((pushParent, index) =>{
                    if(pushParent.menu_slug === splitSlug[0]){
                        const previousItem = findMenuItem(item.slug);
                        const newItem = {
                            ...previousItem,
                            order: childOrder,
                            items: []
                        };
                        topLevelItems[index].items.push(newItem)
                        childOrder = childOrder + 1
                    }
                })
            }else if(splitSlug.length === 2){
                topLevelItems.map((pushParent, parentIndex) =>{
                    if(pushParent.items && pushParent.items.length > 0){
                        pushParent.items.map((pushChild, childIndex) => {
                            if(pushChild.menu_slug === splitSlug[1]){
                                const previousItem = findMenuItem(item.slug);
                                const newItem = {
                                    ...previousItem,
                                    order: subOrder,
                                    items: []
                                };
                                topLevelItems[parentIndex].items[childIndex].items.push(newItem)
                                subOrder = subOrder + 1
                            }
                        })
                    }
                })
            }
            
        }
    });

    return topLevelItems;
}

// Save function
const handleConvertData = () => {
    setShowLoading(true)
const convertedData = convertData(data);
axios.post(`${API_HOST}menu/item/update/${menuData._id}`, 
{
    items: convertedData
}, {
  headers: headers
})
.then((res) => {
  setShowLoading(false)
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
    setShowLoading(false)
//   if(err?.response?.data?.error === "Authentication error!"){
//       removeCookie("_token")
//   }
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

const handleAddItem = () => {
    setShowLoading(true)
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
      setShowLoading(false)
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
        setShowLoading(false)
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

    // Handle page change
    function handlePageChange(e) {
        selectedPages.map(page => {
          if(e.target.value === page.value){
            setSelectedPage({slug: e.target.value, title: page.label})
          }
        })
      }

      useEffect(() => {
        setSelectItems([])
        setChildrenList([{value:"none", label: "None"}])
        menuItems && menuItems.length > 0 && menuItems.map(item => {
          setSelectItems(oldPage => [...oldPage, { value: item.menu_slug, label: item.title }])
        })
        // setSelectParent(selectItems[0]?.value)
      }, [menuItems]);
    
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
    
    // Added all page
    useEffect(() => {
        setSelectedPages([{value: "none", label: "None"}])
        pageData.map(page => {
            setSelectedPages(oldPage => [...oldPage, { value: page.slug, label: page.title }])
        })
    }, [pageData])

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

    const { renderTree, placeholder } = useHeTree({
    ...keys,
    data,
    dataType: 'flat',
    onChange: setdata,
    renderNodeBox: ({ stat, attrs, isPlaceholder }) => (
        <div {...attrs} key={attrs.key} className="my-node-box">
        {isPlaceholder ? <div className="my-placeholder">DROP HERE</div>
            : <div className="my-node">
            <span className="drag-handler" draggable={stat.draggable}>{dragIcon()}</span>
            <div className='flex justify-between'>
                <span style={{color:"black"}}>{stat.node.name}</span>
                <div className='flex'>
                    <Tooltip content="Edit" placement="top" arrow animation="shift-away">
                        <button className="action-btn btn-outline-danger mr-3" type="button" onClick={() => 
                            {
                                const slug = stat.node.slug.split("/")
                                navigate(`/pages/edit/${slug[slug.length - 1]}?param=${selectionValue}`)
                            }

                        }>
                            <Icon icon="heroicons:pencil" />
                        </button>
                    </Tooltip>
                    <Tooltip content="Delete" placement="top" arrow animation="shift-away">
                        <button className="action-btn btn-outline-danger mr-3" type="button" 
                        onClick={() => 
                            setShowDeleteModal({slug: stat.node.slug, modal: true})
                        }
                        >
                            <Icon icon="heroicons:trash" />
                        </button>
                    </Tooltip>
                </div>
            </div>
            </div>
        }
        </div>
    ),
    })

  return <>
    <Popup showLoading={showLoading} popupText={"Menu Item Updating..."}  />
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
        
            <Button text="Add Item" className="btn-warning py-2" onClick={() => {
                setShowModal(true)
            }}  />
        <div className='flex justify-between mt-3'>
        <Select
            className="react-select"
            classNamePrefix="select"
            defaultValue={menuType[0]}
            options={menuType}
            styles={styles}
            onChange={handleTypeChange}
            id="hh"
          />
            <Button text="Save Menu" className="btn-success py-2" onClick={handleConvertData}  />
        </div>
        {renderTree({ className: `my-tree ${placeholder ? 'dragging' : 'no-dragging'}` })}
    </Card>
    <style>{`
    .my-tree{
      width: 400px; 
      border-radius: 5px;
      margin: 20px; 
      padding: 20px;
    }
    .my-placeholder{
      height:40px;
      border: 1px dashed blue;
      border-radius: 3px;
      background-color: #f3ffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: small;
    }
    /*.no-dragging .my-node-box:hover{
      background-color: #eee;
    }*/
    .my-node-box:not(:last-child){
      margin-bottom: 10px;
    }
    .my-node{
      padding: 5px 10px;
      padding-left: 30px;
      border: 1px solid #e2e2e2;
      border-radius: 3px;
      background-color: #f0f0f0;
      display: block;
      align-items: center;
      position: relative;
      box-shadow: 1px 1px 3px 0px rgb(0 0 0 / 19%);
    }
    .no-dragging .my-node:hover{
      background-color: #ebfeff;
    }
    .drag-handler{
      position: absolute;
      left: 0;
      top: 0;
      width: 30px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: grab;
    }
    .drag-handler:hover{
      background-color: #f0f0f0;
    }
    .my-node svg{
      width:16px;
    }
    `}</style>
  </>
}

function dragIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>drag-horizontal-variant</title><path d="M21 11H3V9H21V11M21 13H3V15H21V13Z" /></svg>
}