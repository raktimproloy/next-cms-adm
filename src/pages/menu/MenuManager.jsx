import React, { useEffect, useState, Fragment } from 'react'
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import Popup from "@/components/ui/Popup"
import Select from "@/components/ui/Select"
import Modal from "@/components/ui/Modal"
import { useSelector } from 'react-redux';
import { getAllPages } from '../../utils/getAllPages';
import axios from 'axios';
import { API_HOST } from '@/utils';
import { addInfo } from '../../store/layout';
import { Link, useNavigate } from 'react-router-dom';
import { deletePage } from '@/store/actions/pageAction';
import { getAllMenus } from '../../utils/getAllMenus';


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
  const [deleteInfo, setDeleteInfo] = useState({
    showDeleteModal: false,
    slug: ""
  })
  const [menuData, setMenuData] = useState({
    title: ""
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
    if(menuTypeData.length > 0){
      menuTypeData.map(type => {
        if(type._id === selectionValue){
          setMenuData(type)
        }
      })
    }
  }, [menuTypeData, selectionValue, pageData])


  // Menu Items sort and set Page data
  useEffect(() => {
    setShowingPages([])
    const pagesData = []
    if(menuData.title !== ""){
      const sortItems = [...menuData.items].sort((a, b) => a.order - b.order);
      sortItems.map((item) => {
         if(item.link_type === "external"){
            pagesData.push(item.link)
         }else{
           pageData.map((page) => {
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
    menuTypeData.map(type => {
      setMenuType(oldType => [...oldType, { value: type._id, label: type.title }])
    })
    if(selectionValue === ""){
      menuTypeData.length > 0 && setSelectionValue(menuTypeData[0]._id)
    }
  }, [menuTypeData])



  const handleDelete = () => {
    axios.post(`${API_HOST}menu/delete/item/${selectionValue}`, {
      slug: deleteInfo.slug
    }, {
      headers: headers
    })
    .then((res) => {
      // deletePage(deleteInfo.slug)(dispatch);
      dispatch(addInfo({ field: 'menuUpdate', value: 'not-updated' }));
      setDeleteInfo({...deleteInfo, showDeleteModal: false})
    })
    .catch((err) => {
      console.log(err)
      if(err.response.data.error === "Authentication error!"){
        removeCookie("_token")
      }
    });
  }

  const updateApi = (updatedData) => {
    axios.post(`${API_HOST}menu/update/${selectionValue}`, updatedData, {
      headers: headers
    })
    .then((res) => {
      dispatch(addInfo({ field: 'menuUpdate', value: 'not-updated' }));
    })
    .catch((err) => {
      console.log(err)
      if(err.response.data.error === "Authentication error!"){
      removeCookie("_token")
      }
    });
  }

  // handle selection
  const handleChange = (e) => {
    setSelectionValue(e.target.value)
  }

  // Handle Position
  const handleUpButton = (slug) => {
    let previousPage = {};
    let clickedPage = {};

    menuData.items.map(menuPage => {
      if (menuPage.menu_slug === slug) {
        clickedPage = Object.assign({}, menuPage); // create a new object
      } 
    });

    menuData.items.map(menuPage => {
      if(menuPage.order === (clickedPage.order - 1)){
        previousPage = Object.assign({}, menuPage); // create a new object
      }
    })

    if (previousPage && clickedPage) {
      previousPage.order = previousPage.order + 1;
      clickedPage.order = clickedPage.order - 1;
    }

    const updatedData = [previousPage, clickedPage]
    const updatedMenuData = {
      ...menuData,
      items: menuData.items.map((item) => {
        const updatedItem = updatedData.find((updated) => updated.menu_slug === item.menu_slug);
        return updatedItem ? { ...item, ...updatedItem } : item;
      }),
    };

    updateApi(updatedMenuData)
    swal("Updated", "The page moved to up!", "success")
  }
  

  const handleDownButton = (slug) => {
    let nextPage = {};
    let clickedPage = {};

    menuData.items.map(menuPage => {
      if (menuPage.menu_slug === slug) {
        clickedPage = Object.assign({}, menuPage); // create a new object
      } 
    });

    menuData.items.map(menuPage => {
      if(menuPage.order === (clickedPage.order + 1)){
        nextPage = Object.assign({}, menuPage); // create a new object
      }
    })

    if (nextPage && clickedPage) {
      nextPage.order = nextPage.order - 1;
      clickedPage.order = clickedPage.order + 1;
    }

    const updatedData = [nextPage, clickedPage]
    const updatedMenuData = {
      ...menuData,
      items: menuData.items.map((item) => {
        const updatedItem = updatedData.find((updated) => updated.menu_slug === item.menu_slug);
        return updatedItem ? { ...item, ...updatedItem } : item;
      }),
    };

    updateApi(updatedMenuData)
    swal("Updated", "The page moved to down!", "success")
  }

  return (
    <div>
      <Modal
        title="Warning"
        label=""
        labelClass="btn-outline-warning p-1"
        themeClass="bg-warning-500"
        activeModal={deleteInfo.showDeleteModal}
        onClose={() => {
          setDeleteInfo({...deleteInfo, showDeleteModal: false})
        }}
        footerContent={
          <Button
            text="Accept"
            className="btn-warning "
            onClick={handleDelete}
          />
        }
      >
        <h4 className="font-medium text-lg mb-3 text-slate-900">
          Delete Page
        </h4>
        <div className="text-base text-slate-600 dark:text-slate-300">
          Do you want to delete this page?
        </div>
      </Modal>
      <Card title="Menu Manager" noborder>
        <div className='flex justify-between mb-3'>
          <Select
            className="react-select"
            classNamePrefix="select"
            defaultValue={menuType[0]}
            options={menuType}
            styles={styles}
            onChange={handleChange}
            id="hh"
          />
          <Button text="Add Link" className="btn-success py-2" onClick={() => {
            navigate("/menu/menu-manager/add")
          }}  />
        </div>
          <div className="overflow-x-auto -mx-6">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden ">
                <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                  <thead className="bg-slate-200 dark:bg-slate-700">
                    <tr>
                      {columns.map((column, i) => (
                        <th key={i} scope="col" className=" table-th ">
                          {column.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                    {showingPages.map((row, i) => (
                      <tr key={i}>
                        <td className="table-td">{row.title}</td>
                        <td className="table-td lowercase">{row.slug}</td>
                        <td className="table-td flex justify-center items-center">
                          {/* Up Arrow */}
                          {
                            i !== 0 &&
                            <button onClick={(e) => handleUpButton(row.slug)}>
                              <svg viewBox="0 0 24 24" style={{cursor:"pointer"}} width={"20px"} height={"20px"} fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M12 3C12.2652 3 12.5196 3.10536 12.7071 3.29289L19.7071 10.2929C20.0976 10.6834 20.0976 11.3166 19.7071 11.7071C19.3166 12.0976 18.6834 12.0976 18.2929 11.7071L13 6.41421V20C13 20.5523 12.5523 21 12 21C11.4477 21 11 20.5523 11 20V6.41421L5.70711 11.7071C5.31658 12.0976 4.68342 12.0976 4.29289 11.7071C3.90237 11.3166 3.90237 10.6834 4.29289 10.2929L11.2929 3.29289C11.4804 3.10536 11.7348 3 12 3Z" fill="#ffffff"></path> </g></svg>
                            </button>
                          }

                          {/* Down Arrow */}
                          {
                            i !== (menuData.items.length-1) &&
                            <button onClick={(e) => handleDownButton(row.slug)}>
                              <svg viewBox="0 0 24 24" style={{cursor:"pointer"}} width={"20px"} height={"20px"} fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M12 3C12.5523 3 13 3.44772 13 4V17.5858L18.2929 12.2929C18.6834 11.9024 19.3166 11.9024 19.7071 12.2929C20.0976 12.6834 20.0976 13.3166 19.7071 13.7071L12.7071 20.7071C12.3166 21.0976 11.6834 21.0976 11.2929 20.7071L4.29289 13.7071C3.90237 13.3166 3.90237 12.6834 4.29289 12.2929C4.68342 11.9024 5.31658 11.9024 5.70711 12.2929L11 17.5858V4C11 3.44772 11.4477 3 12 3Z" fill="#ffffff"></path> </g></svg>
                            </button>
                          }
                        </td>
                        <td className="table-td ">{
                          menuType.map(menu => {
                            if(menu.value === selectionValue){
                              return menu.label
                            }
                          })
                        }</td>
                        <td className="table-td" style={{paddingRight: "0"}}>
                        <span className={`inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${row.active ? "text-success-500 bg-success-500" : "text-warning-500 bg-warning-500"}`}>{row.active ? "Active": "Inactive"}</span>
                        </td>
                        <td className="table-td ">
                          <Button
                            text="Edit"
                            className="btn-outline-primary rounded-[999px] py-2 me-2"
                            onClick={() => 
                              navigate(`/menu/menu-manager/edit/${row.slug}`)
                            }
                          />
                          <Button
                            text="Delete"
                            className="btn-outline-primary rounded-[999px] py-2"
                            onClick={() => {
                              setDeleteInfo({...deleteInfo, showDeleteModal: true, slug: row.slug})
                              
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
      </Card>
    </div>
    )
}

export default MenuManager