import React, { useEffect, useState, Fragment } from 'react'
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import Popup from "@/components/ui/Popup"
import Modal from "@/components/ui/Modal"
import Pagination from "@/components/ui/Pagination"
import { useSelector } from 'react-redux';
import { getAllBlogs } from '../../utils/getAllBlogs';
import axios from 'axios';
import { API_HOST } from '@/utils';
import { addBlog, addInfo, removeBlog } from '../../store/layout';
import { Link, useNavigate } from 'react-router-dom';
import { deletePage } from '@/store/actions/pageAction';
import { ArraySlice } from '@/utils/ArraySlice';


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
      label: "Publish Date",
      field: "publish_date",
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
      label: "Manage",
      field: "manage",
    },
];

function index() {
  const navigate = useNavigate()
  const [deleteInfo, setDeleteInfo] = useState({
    showDeleteModal: false,
    slug: ""
  })
  const data = useSelector((state) => state.blogs);
  const updateInfo = useSelector((state) => state.update);
  const dispatch = useDispatch()

  // Cookies
  const [cookie, removeCookie] = useCookies()
  const headers = {
    'Authorization': `Bearer ${cookie._token}`
    }

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(6);
  const [blogdata, setBlogData] = useState([])
  
  useEffect(() => {
    if (updateInfo.blogUpdate === "" || updateInfo.blogUpdate === "not-updated") {
      getAllBlogs(dispatch, cookie, removeCookie);
    }
    setTotalPages(Math.ceil(data.length/10) || 1)
  }, [dispatch, data, updateInfo]);




  const handleDelete = () => {
    axios.delete(`${API_HOST}blog/delete/${deleteInfo.slug}`, {
      headers: headers
    })
    .then((res) => {
      dispatch(removeBlog(deleteInfo.slug))
      dispatch(addInfo({ field: 'blogUpdate', value: 'not-updated' }));
      setDeleteInfo({...deleteInfo, showDeleteModal: false})
    })
    .catch((err) => {
      console.log(err)
      if(err.response.data.error === "Authentication error!"){
        removeCookie("_token")
      }
    });
  }




  useEffect(() => {
    console.log(data)
    setBlogData(ArraySlice(currentPage, 10, data))
    
  }, [data, currentPage])

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // You can add any other logic you need here, such as making an API call to fetch data for the new page
  };

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
      <Card title="Blogs" noborder>
        <div className='text-right mb-3'>
            <Button text="Add Page" className="btn-success py-2" onClick={() => {
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
                    {blogdata.map((row, i) => (
                      <tr key={i}>
                        <td className="table-td" style={{paddingRight: "0"}}>{row.title}</td>
                        <td className="table-td lowercase" style={{paddingRight: "0"}}>{row.slug.toLowerCase()}</td>
                        <td className="table-td " style={{paddingRight: "0"}}>{row.published_date}</td>
                        {/* <td className="table-td bg-danger-500" style={{paddingRight: "0"}}>{row.status}</td> */}
                        <td className="table-td" style={{paddingRight: "0"}}>
                        <span class={`inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${row.status === "Active" ? "text-success-500 bg-success-500": "text-warning-500 bg-warning-500"}`}>{row.status}</span>
                        </td>
                        <td className="table-td " style={{paddingRight: "0"}}>{row.blog_category}</td>
                        <td className="table-td " style={{paddingRight: "0"}}>
                            <Button
                              text="Preview"
                              className="btn-outline-primary rounded-[999px] py-2 me-2"
                              onClick={() => 
                                navigate(`/pages/edit/${row.slug}`)
                              }
                            />
                            <Button
                              text="Edit"
                              className="btn-outline-primary rounded-[999px] py-2 me-2"
                              onClick={() => 
                                navigate(`/blog/edit/${row.slug}`)
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
          <div>
            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                handlePageChange={handlePageChange}
                className={"flex justify-center py-5"}
              />
          </div>
      </Card>
    </div>
    )
}

export default index