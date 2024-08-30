import React, { useEffect, useState, Fragment } from 'react'
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import Popup from "@/components/ui/Popup"
import MessagePopup from "@/components/ui/Popup/MessagePopup"
import Modal from "@/components/ui/Modal"
import Icon from "@/components/ui/Icon"
import Tooltip from "@/components/ui/Tooltip"
import Select from "@/components/ui/Select"
import { useSelector } from 'react-redux';
import { getAllPages } from '../../utils/getAllPages';
import axios from 'axios';
import { API_HOST } from '@/utils';
import { addInfo } from '../../store/layout';
import { Link, useNavigate } from 'react-router-dom';
import { deletePage } from '@/store/actions/pageAction';
import {AddLog} from "@/utils/logHandler"
import {CurrentDate} from "@/utils/CurrentDate"
import { createPage } from "@/store/actions/pageAction";
import { ToastContainer, toast } from 'react-toastify';
import Pagination from "@/components/ui/Pagination"
import Textinput from "@/components/ui/Textinput"

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
      label: "Status",
      field: "status",
    },
    {
      label: "Publish",
      field: "publish",
    },
    {
      label: "Category",
      field: "category",
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

const category = [
  {value: "all", label: "All"},
  {value: "predesign", label: "Predesign"},
  {value: "designer", label: "Designer"}
]


function index() {
  const CMS_API = import.meta.env.VITE_CMS_LINK
  const [showLoading, setShowLoading] = useState(false)
  const [showLoadingText, setShowLoadingText] = useState("Page Deleting...")
  const navigate = useNavigate()
  const [selectionValue, setSelectionValue] = useState("")
  const [showingData, setShowingData] = useState([])
  const [deleteInfo, setDeleteInfo] = useState({
    showDeleteModal: false,
    slug: ""
  })
  // const data = useSelector((state) => state.pages);
  // const updateInfo = useSelector((state) => state.update);
  const profileData = useSelector((state) => state.profile);
  const dispatch = useDispatch()

  // Cookies
  const [cookie, removeCookie] = useCookies()
  const headers = {
    'Authorization': `Bearer ${cookie._token}`
  }
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState("")
  const [duplicateActivity, setDuplicateActivity] = useState(false)

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePagination = () => {
    setCurrentPage(1);
    axios.get(`${API_HOST}page/count/${selectionValue}`)
    .then(res => {
      setTotalPages(Math.ceil(res.data.count/10) || 1)
    })
    .catch(err => {
    })
  }

  useEffect(() => {
    handlePagination()
  }, [selectionValue])


  const handleDelete = () => {
    setShowLoadingText("Page Deleting...")
    setShowLoading(true)
    axios.delete(`${API_HOST}page/delete/${deleteInfo.slug}`, {
      headers: headers
    })
    .then((res) => {
      AddLog(profileData.email, "Page", `Page Deleted Successful`)
      deletePage(deleteInfo.slug)(dispatch);
      dispatch(addInfo({ field: 'pageUpdate', value: 'not-updated' }));
      dataShowingFilter()
      handlePagination()
      setDeleteInfo({...deleteInfo, showDeleteModal: false})
      setShowLoading(false)
      toast.success("Slider Added Successful", {
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
      console.log(err)
      if(err.response.data.error === "Authentication error!"){
        removeCookie("_token")
        AddLog(profileData.email, "Page", `Page Deleted Failed For Authorization`)
      }else{
        AddLog(profileData.email, "Page", `Page Edited Unsuccessful`)
      }
      setShowLoading(false)
      toast.error("Page Deleted Unuccessful!", {
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


  const dataShowingFilter = () => {
    setShowingData([])
    if(searchInput.length > 0){
      axios.get(`${API_HOST}page/query/${currentPage}/search?query=${searchInput}`)
      .then(res => {
        setTotalPages(Math.ceil(res.data.count/10) || 1)
        setShowingData(res.data.results)
      })
      .catch(err => {
        console.log(err)
      })

    }else{
      axios.get(`${API_HOST}page/get/${selectionValue}/${currentPage}`)
      .then(res => {
        setShowingData(res.data)
      })
      .catch(err => {
        console.log(err)
      })

    }
  }

  useEffect(() => {
    dataShowingFilter()
  }, [currentPage, selectionValue, duplicateActivity])

  // handle selection
  const handleChange = (e) => {
    sessionStorage.setItem("pageSelection", e.target.value)
    setSelectionValue(e.target.value)
  }

  const [defaultSelection, setDefaultSelection] = useState({})
  useEffect(() => {
    const storedSelection = sessionStorage.getItem("pageSelection")
    if(storedSelection){
      setSelectionValue(storedSelection)
      category.map((item) => {
        if(item.value === storedSelection){
          setDefaultSelection(item)
        }
      })
    }else{
      setDefaultSelection(category[0])
      setSelectionValue("all")
    }
  }, [])

  // Handle Preview
  const handlePreview = (slug) => {
    if(slug == "home"){
      window.open(`${CMS_API}`, '_blank');
    }else{
      window.open(`${CMS_API}${slug.toLowerCase()}`, '_blank');
    }
  }

  // handle Duplicate
  const handleDuplicate = (slug) => {
    setShowLoadingText("Page Duplicating...")
    setShowLoading(true)

    // get main page data
    axios.get(`${API_HOST}page/${slug}`, {
      headers: headers
    })
    .then((res) => {
      // change duplicate data value
      const duplicatePageData = res.data
      duplicatePageData.title = duplicatePageData.title + "_new"
      duplicatePageData.slug = duplicatePageData.slug + "_new"

      // create duplicate page
      axios.post(`${API_HOST}page/add`, duplicatePageData, {
        headers: headers
      })
      .then((res) => {
        AddLog(profileData.email, "Page", `Page Duplicated Successful`)
        createPage(duplicatePageData.title)(dispatch);

        // get main page grapes js content
        axios.get(`${API_HOST}api/pages/${slug}/content`)
        .then(res => {
          const content = res.data
          if(content?.message === "No content"){
            axios.post(`${API_HOST}api/pages/${duplicatePageData.slug}/content`, content)
            .then(res => {
              setShowLoading(false)
              setDuplicateActivity(!duplicateActivity)
              toast.success("Page Duplicated Successful!", {
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
            .catch(err => {
              setShowLoading(false)
              toast.error("Page Duplicated Unsuccessful!", {
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
          }else{
            if(typeof(content) === "object"){
              // duplicate main page grapes js content
              axios.post(`${API_HOST}api/pages/${duplicatePageData.slug}/content`, content)
              .then(res => {
                setShowLoading(false)
                setDuplicateActivity(!duplicateActivity)
                toast.success("Page Duplicated Successful!", {
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
              .catch(err => {
                setShowLoading(false)
                toast.error("Page Duplicated Unsuccessful!", {
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
            }else{
              setShowLoading(false)
              toast.success("Page Duplicated Successful!", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
            }
          }
        })
        .catch(err => {
          setShowLoading(false)
          toast.error("Page Duplicated Unsuccessful!", {
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
      })
      .catch((err) => {
        setShowLoading(false)
        if(err.response.data.error === "Authentication error!"){
          removeCookie("_token")
          AddLog(profileData.email, "Page", `Page Duplicated Faild For Authorization`)
        }else{
          AddLog(profileData.email, "Page", `Page Duplicated Unsuccessful`)
        }
        toast.error("Page Duplicated Unsuccessful!", {
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
    })
    .catch((err) => {
      setShowLoading(false)
      toast.error("Page Duplicated Unsuccessful!", {
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
  
  const handleSearch = (search) => {
    axios.get(`${API_HOST}page/query/${currentPage}/search?query=${search}`)
    .then(res => {
      setTotalPages(Math.ceil(res.data.count/10) || 1)
      setShowingData(res.data.results)
    })
    .catch(err => {
      console.log(err)
    })
  }

  const emptyCheck = (e) => {
    if(e?.target?.value?.length === 0){
      axios.get(`${API_HOST}page/get/${selectionValue}/${currentPage}`)
      .then(res => {
        setShowingData(res.data)
      })
      .catch(err => {
        console.log(err)
      })
    }
    handlePagination()
  }


  return (
    <div>
      <Popup showLoading={showLoading} popupText={showLoadingText}  />
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
      <Card title="Pages" noborder>
        <div className='flex justify-end mb-3'>
          <div className='w-full flex justify-end md:w-1/4'>
            <Textinput
              id="pn"
              type="text"
              placeholder="Search..."
              // onChange={(e) => {setSearchInput(e.target.value); emptyCheck(e)}}
              onChange={(e) => {handleSearch(e.target.value); emptyCheck(e)}}
            />
            {/* <Button text="Search" className="btn-success py-2 ml-3" onClick={() => {
              handleSearch()
            }}  /> */}
          </div>
        </div>
        <div className='flex justify-between mb-3'>
          {
            Object.keys(defaultSelection).length > 0 ?
            <Select
                className="react-select"
                classNamePrefix="select"
                defaultValue={defaultSelection}
                options={category}
                styles={styles}
                onChange={handleChange}
                id="hh"
              />

            : ""
          }
            <Button text="Add Page" className="btn-success py-2" onClick={() => {
              navigate("/pages/add")
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
                    {showingData.map((row, i) => (
                      <tr key={i}>
                        <td className="table-td flex justify-evely items-center">
                          {row.title}
                        </td>
                        <td className="table-td lowercase">{row.slug}</td>
                        {/* <td className="table-td ">{row.menu_type}</td> */}
                        <td className="table-td" style={{paddingRight: "0"}}>
                        <span className={`inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${row.active ? "text-success-500 bg-success-500" : "text-warning-500 bg-warning-500"}`}>{row.active ? "Active": "Inactive"}</span>
                        </td>
                        <td className="table-td ">{row.published_date}</td>
                        <td className="table-td ">{row.template_category}</td>
                        <td className="table-td flex ">
                          <Tooltip content="View" placement="top" arrow animation="shift-away">
                            <button className="action-btn btn-outline-success mr-3" type="button" onClick={() => 
                              handlePreview(row.slug)
                            }>
                              <Icon icon="heroicons:eye" />
                            </button>
                          </Tooltip>
                          <Tooltip content="Edit" placement="top" arrow animation="shift-away">
                            <button className="action-btn btn-outline-cyan mr-3" type="button" onClick={() => 
                              navigate(`/pages/edit/${row.slug}`)
                            }>
                              <Icon icon="heroicons:pencil" />
                            </button>
                          </Tooltip>
                          <Tooltip content="Delete" placement="top" arrow animation="shift-away">
                            <button className="action-btn btn-outline-danger mr-3" type="button" onClick={() => 
                              setDeleteInfo({...deleteInfo, showDeleteModal: true, slug: row.slug})
                            }>
                              <Icon icon="heroicons:trash" />
                            </button>
                          </Tooltip>
                          {/*<Tooltip content="Clone" placement="top" arrow animation="shift-away">
                            <button className="action-btn btn-outline-success mr-3" type="button" onClick={() => handleDuplicate(row.slug)} >
                              <Icon icon="heroicons:document-duplicate" />
                            </button>
                          </Tooltip> */}
                          {
                            row.template_category == "Designer" &&
                            <Tooltip content="Design" placement="top" arrow animation="shift-away">
                            <button className="action-btn btn-outline-cyan mr-3" type="button" 
                            onClick={() => {
                              navigate(`/pages/editor/${row.slug}`)
                              localStorage.setItem('grapesjs_page', JSON.stringify({
                                title: row.title,
                                slug: row.slug
                              }));
                            }
                            }
                            >
                              <Icon icon="heroicons:pencil-square" />
                            </button>
                          </Tooltip>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {
            totalPages > 1 ?
            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                handlePageChange={handlePageChange}
                className={"flex justify-center py-5"}
            />
            : ""
          }
      </Card>
    </div>
    )
}

export default index