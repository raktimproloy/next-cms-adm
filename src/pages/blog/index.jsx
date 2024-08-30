import React, { useEffect, useState, Fragment } from 'react'
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import Popup from "@/components/ui/Popup"
import Modal from "@/components/ui/Modal"
import Pagination from "@/components/ui/Pagination"
import Tooltip from "@/components/ui/Tooltip"
import Icon from "@/components/ui/Icon"
import { useSelector } from 'react-redux';
import { getAllBlogs } from '../../utils/getAllBlogs';
import axios from 'axios';
import { API_HOST } from '@/utils';
import { addBlog, addInfo, removeBlog } from '../../store/layout';
import { Link, useNavigate } from 'react-router-dom';
import { deletePage } from '@/store/actions/pageAction';
import { ArraySlice } from '@/utils/ArraySlice';
import { getBlogsByPage } from '../../utils/getBlogByPage';
import {AddLog} from "@/utils/logHandler"
import { getSetting } from '../../utils/getSetting';
import { ToastContainer, toast } from 'react-toastify'
import Textinput from "@/components/ui/Textinput"


const columns = [
    {
      label: "Title",
      field: "title",
    },
    {
      label: "slug",
      field: "slug",
    },
    {
      label: "Status",
      field: "status",
    },
    {
      label: "Blog Category",
      field: "blog_category",
    },
    {
      label: "Publish Date",
      field: "publish_date",
    },
    {
      label: "Manage",
      field: "manage",
    },
];

function index() {
  const CMS_API = import.meta.env.VITE_CMS_LINK
  const [showLoading, setShowLoading] = useState(false)
  const navigate = useNavigate()
  const [deleteInfo, setDeleteInfo] = useState({
    showDeleteModal: false,
    slug: ""
  })
  // const data = useSelector((state) => state.blogs);
  const profileData = useSelector((state) => state.profile);
  const setting = useSelector((state) => state.setting);
  const updateInfo = useSelector((state) => state.update);
  const dispatch = useDispatch()
  const [changeHandle, setChangeHandle] = useState(false)

  // Cookies
  const [cookie, removeCookie] = useCookies()
  const headers = {
    'Authorization': `Bearer ${cookie._token}`
    }

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(6);
  const [blogdata, setBlogData] = useState([])
  const [searchInput, setSearchInput] = useState("")
  
  useEffect(() => {
    // if (updateInfo.blogUpdate === "" || updateInfo.blogUpdate === "not-updated") {
    //   getAllBlogs(dispatch, cookie, removeCookie);
    // }
    if (updateInfo.settingUpdate === "" || updateInfo.settingUpdate === "not-updated") {
      getSetting(dispatch, cookie, removeCookie);
    }
    
  }, [dispatch, updateInfo, setting]);

  const handlePagination = () => {
    axios.get(`${API_HOST}blog/collection/count`)
    .then(res => {
      setTotalPages(Math.ceil(res.data.count/parseInt(setting.blog_show_amount)) || 1)
    })
    .catch(err => {
      console.log(err)
    })
  }

  useEffect(() => {
    handlePagination()
  }, [setting])
  
  // Check if data for the current page is already in Redux
  // const pageDataInRedux = useSelector((state) => state.blogsPage[currentPage]);

  // useEffect(() => {
  //   getBlogsByPage(dispatch, currentPage, cookie, removeCookie, pageDataInRedux);
  // }, [currentPage, cookie, removeCookie, dispatch, pageDataInRedux]);


  const handleDelete = () => {
    setShowLoading(true)
  axios.delete(`${API_HOST}blog/delete/${deleteInfo.slug}`, {
    headers: headers
  })
  .then((res) => {
    setChangeHandle(!changeHandle)
    AddLog(profileData.email, "Blog", `Blog Deleted Successful`)
    dispatch(addInfo({ field: 'blogUpdate', value: 'not-updated' }));
    setDeleteInfo({...deleteInfo, showDeleteModal: false})
    setShowLoading(false)
    toast.success("Blog Deleted Successful!", {
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
      AddLog(profileData.email, "Blog", `Blog Deleted Failed For Authorization`)
    }else{
      AddLog(profileData.email, "Blog", `Blog Deleted Unsuccessful`)
    }
    setShowLoading(false)
    toast.success("Blog Deleted Unsuccessful!", {
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

  // useEffect(() => {
  //   // setBlogData(ArraySlice(currentPage, parseInt(setting.blog_show_amount), data))
  //   axios.get(`${API_HOST}blog/all/${currentPage}`)
  //   .then(res => {
  //     setBlogData(res.data)
  //   })
  //   .catch(err => {
  //     console.log(err)
  //   })
  // }, [currentPage, showLoading])

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle Preview
  const handlePreview = (slug) => {
    window.open(`${CMS_API}blog/details/${slug.toLowerCase()}`, '_blank');
    toast.success("Blog Preview Link Copied", {
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


  // handle blog
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const handleCopyClick = (slug) => {
    navigator.clipboard.writeText(`${CMS_API}blog/details/${slug}`);
    setTooltipVisible(true);

    // // Hide the tooltip after a delay (e.g., 2 seconds)
    setTimeout(() => {
      setTooltipVisible(false);
    }, 2000);
  };

  const dataShowingFilter = () => {
    setBlogData([])
    if(searchInput.length > 0){
      axios.get(`${API_HOST}blog/query/${currentPage}/search?query=${searchInput}`)
      .then(res => {
        setTotalPages(Math.ceil(res.data.count/parseInt(setting.blog_show_amount)) || 1)
        setBlogData(res.data.results)
      })
      .catch(err => {
        console.log(err)
      })

    }else{
      axios.get(`${API_HOST}blog/all/${currentPage}`)
      .then(res => {
        setBlogData(res.data)
      })
      .catch(err => {
        console.log(err)
      })

    }
  }

  useEffect(() => {
    dataShowingFilter()
  }, [currentPage, changeHandle])


  const handleSearch = (search) => {
      axios.get(`${API_HOST}blog/query/${currentPage}/search?query=${search}`)
      .then(res => {
        setTotalPages(Math.ceil(res.data.count/parseInt(setting.blog_show_amount)) || 1)
        setBlogData(res.data.results)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const emptyCheck = (e) => {
    if(e?.target?.value?.length === 0){
      axios.get(`${API_HOST}blog/all/${currentPage}`)
      .then(res => {
        setBlogData(res.data)
      })
      .catch(err => {
        console.log(err)
      })
    }
    handlePagination()
  }

  return (
    <div>
      {/* <ToastContainer/> */}
      <Popup showLoading={showLoading} popupText={"Blog Deleting..."}  />
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
      <Card title="Blogs" noborder>
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
        <div className='text-right mb-3'>
            <Button text="Add Blog" className="btn-success py-2" onClick={() => {
              navigate("/blog/add")
            }}  />
        </div>
          <div className="overflow-x-auto -mx-6">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden ">
                <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                  <thead className="bg-slate-200 dark:bg-slate-700">
                    <tr>
                      {columns.map((column, i) => (
                        <th key={i} scope="col" className="table-th">
                          {column.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                    {blogdata.length > 0 && blogdata.map((row, i) => (
                      <tr key={i}>
                        <td className="table-td" style={{paddingRight: "0"}}>{row.title}</td>

                        <td className="table-td" style={{paddingRight: "0"}}>
                          <div className='lowercase flex items-center'>
                           {row.slug.toLowerCase()}

                            <span  className='ms-2 cursor-pointer' onClick={() => handleCopyClick(row.slug.toLowerCase())} title={tooltipVisible ? "copied" : "copy"}>
                            <svg fill="#3498db" width={"20px"} height={"20px"} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M13.49 3 10.74.37A1.22 1.22 0 0 0 9.86 0h-4a1.25 1.25 0 0 0-1.22 1.25v11a1.25 1.25 0 0 0 1.25 1.25h6.72a1.25 1.25 0 0 0 1.25-1.25V3.88a1.22 1.22 0 0 0-.37-.88zm-.88 9.25H5.89v-11h2.72v2.63a1.25 1.25 0 0 0 1.25 1.25h2.75zm0-8.37H9.86V1.25l2.75 2.63z"></path><path d="M10.11 14.75H3.39v-11H4V2.5h-.61a1.25 1.25 0 0 0-1.25 1.25v11A1.25 1.25 0 0 0 3.39 16h6.72a1.25 1.25 0 0 0 1.25-1.25v-.63h-1.25z"></path></g></svg>
                            </span>
                          </div>
                        </td>

                        <td className="table-td" style={{paddingRight: "0"}}>
                        <span className={`inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${row.status === "Active" ? "text-success-500 bg-success-500": "text-warning-500 bg-warning-500"}`}>{row.status}</span>
                        </td>

                        <td className="table-td " style={{paddingRight: "0"}}>{row.blog_category}</td>

                        <td className="table-td " style={{paddingRight: "0"}}>{row.published_date}</td>

                        <td className="table-td flex" style={{paddingRight: "0"}}>
                        <Tooltip content="View" placement="top" arrow animation="shift-away">
                            <button className="action-btn btn-outline-success mr-3" type="button" onClick={() => 
                              handlePreview(row.slug.toLowerCase())
                            }>
                              <Icon icon="heroicons:eye" />
                            </button>
                          </Tooltip>
                            {/* <Button
                              text="view"
                              className="btn-outline-success rounded-[999px] py-2 me-2"
                              onClick={() => 
                                handlePreview(row.slug.toLowerCase())
                              }
                            /> */}

                          <Tooltip content="Edit" placement="top" arrow animation="shift-away">
                            <button className="action-btn btn-outline-cyan mr-3" type="button" onClick={() => 
                              navigate(`/blog/edit/${row.slug}`)
                            }>
                              <Icon icon="heroicons:pencil" />
                            </button>
                          </Tooltip>
                            
                            {/* <Button
                              text="Edit"
                              className="btn-outline-primary rounded-[999px] py-2 me-2"
                              onClick={() => 
                                navigate(`/blog/edit/${row.slug}`)
                              }
                            /> */}


                          <Tooltip content="Delete" placement="top" arrow animation="shift-away">
                            <button className="action-btn btn-outline-danger mr-3" type="button" onClick={() => 
                              setDeleteInfo({...deleteInfo, showDeleteModal: true, slug: row.slug})
                            }>
                              <Icon icon="heroicons:trash" />
                            </button>
                          </Tooltip>
                            {/* <Button
                              text="Delete"
                              className="btn-outline-danger rounded-[999px] py-2"
                              onClick={() => {
                                setDeleteInfo({...deleteInfo, showDeleteModal: true, slug: row.slug})
                              }}
                            /> */}
                            
                        </td>
                      </tr>
                    ))}

                  </tbody>
                </table>
                    {blogdata.length > 0 || <h3 className='py-5 text-center'>No Blog Available</h3>}
              </div>
            </div>
          </div>
          <div>
            {
              totalPages.length > 0 &&
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                handlePageChange={handlePageChange}
                className={"flex justify-center py-5"}
              />
            }
          </div>
      </Card>
    </div>
    )
}

export default index