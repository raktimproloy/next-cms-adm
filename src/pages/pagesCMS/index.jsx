import React, { useEffect, useState, Fragment } from 'react'
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import Popup from "@/components/ui/Popup"
import Modal from "@/components/ui/Modal"
import Select from "@/components/ui/Select"
import { useSelector } from 'react-redux';
import { getAllPages } from '../../utils/getAllPages';
import axios from 'axios';
import { API_HOST } from '@/utils';
import { addInfo } from '../../store/layout';
import { Link, useNavigate } from 'react-router-dom';
import { deletePage } from '@/store/actions/pageAction';


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
  {value: "grapesjs", label: "Grapesjs"}
]


function index() {
  const CMS_API = import.meta.env.VITE_CMS_LINK
  const [showLoading, setShowLoading] = useState(false)
  const navigate = useNavigate()
  const [selectionValue, setSelectionValue] = useState("all")
  const [showingData, setShowingData] = useState([])
  const [deleteInfo, setDeleteInfo] = useState({
    showDeleteModal: false,
    slug: ""
  })
  const data = useSelector((state) => state.pages);
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
  }, [dispatch, data, updateInfo]);


  const handleDelete = () => {
    setShowLoading(true)
    axios.delete(`${API_HOST}page/delete/${deleteInfo.slug}`, {
      headers: headers
    })
    .then((res) => {
      deletePage(deleteInfo.slug)(dispatch);
      dispatch(addInfo({ field: 'pageUpdate', value: 'not-updated' }));
      setDeleteInfo({...deleteInfo, showDeleteModal: false})
      setShowLoading(false)
    })
    .catch((err) => {
      console.log(err)
      if(err.response.data.error === "Authentication error!"){
        removeCookie("_token")
      }
      setShowLoading(false)
    });
  }

  useEffect(() => {
    setShowingData([])
    if(data.length > 0){
      data.map(page => {
        if(selectionValue === "all"){
          setShowingData(oldPage => [...oldPage, page])
        }else if(page.template_category.toLowerCase() === selectionValue){
          setShowingData(oldPage => [...oldPage, page])
        }
      })
    }
  }, [data, selectionValue])

  // handle selection
  const handleChange = (e) => {
    setSelectionValue(e.target.value)
  }

  // Handle Preview
  const handlePreview = (slug) => {
    console.log(slug)
    window.open(`${CMS_API}${slug.toLowerCase()}`, '_blank');
  }

  return (
    <div>
      <Popup showLoading={showLoading} popupText={"Page Deleting..."}  />
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
        <div className='flex justify-between mb-3'>
          <Select
              className="react-select"
              classNamePrefix="select"
              defaultValue={category[0]}
              options={category}
              styles={styles}
              onChange={handleChange}
              id="hh"
            />
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
                        <td className="table-td">{row.title}</td>
                        <td className="table-td lowercase">{row.slug}</td>
                        {/* <td className="table-td ">{row.menu_type}</td> */}
                        <td className="table-td" style={{paddingRight: "0"}}>
                        <span className={`inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${row.active ? "text-success-500 bg-success-500" : "text-warning-500 bg-warning-500"}`}>{row.active ? "Active": "Inactive"}</span>
                        </td>
                        <td className="table-td ">{row.published_date}</td>
                        <td className="table-td ">{row.template_category}</td>
                        {/* <td className="table-td ">{row.order}</td> */}
                        <td className="table-td ">
                            <Button
                              text="view"
                              className="btn-outline-success rounded-[999px] py-2 me-2"
                              onClick={() => 
                                handlePreview(row.slug)
                              }
                            />
                          <Button
                            text="Edit"
                            className="btn-outline-primary rounded-[999px] py-2 me-2"
                            onClick={() => 
                              navigate(`/pages/edit/${row.slug}`)
                            }
                          />
                          <Button
                            text="Delete"
                            className="btn-outline-danger rounded-[999px] py-2"
                            onClick={() => {
                              setDeleteInfo({...deleteInfo, showDeleteModal: true, slug: row.slug})
                              
                            }}
                          />
                          {
                            row.template_category == "Grapesjs" &&

                          <Button
                            text="design"
                            className="btn-outline-primary rounded-[999px] py-2 ms-2"
                            onClick={() => {
                              navigate(`/pages/editor/${row.slug}`)
                              localStorage.setItem('grapesjs_page', JSON.stringify({
                                title: row.title,
                                slug: row.slug
                              }));
                            }
                            }
                          />
                          }
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

export default index