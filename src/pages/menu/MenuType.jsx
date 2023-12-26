import React, { useEffect, useState } from 'react'
import Card from "@/components/ui/Card";
import { tableData } from "@/constant/table-data";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Popup from "@/components/ui/Popup";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getAllMenus } from '../../utils/getAllMenus';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { API_HOST } from '../../utils';
import { addInfo } from '../../store/layout';

const columns = [
    {
      label: "Title",
      field: "title",
    },
    {
      label: "Alias",
      field: "alias",
    },
    {
      label: "Template",
      field: "template",
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
  // slice(0, 10) is used to limit the number of rows to 10
  const rows = tableData.slice(0, 7);
function MenuType() {
  const navigate = useNavigate()
  const [showLoading, setShowLoading] = useState(false)
  const [deleteInfo, setDeleteInfo] = useState({
    showDeleteModal: false,
    slug: ""
  })
  const data = useSelector((state) => state.menus);
  const updateInfo = useSelector((state) => state.update);
  const dispatch = useDispatch()

  // Cookies
  const [cookie, removeCookie] = useCookies()
  const headers = {
    'Authorization': `Bearer ${cookie._token}`
    }

  useEffect(() => {
    if (updateInfo.menuUpdate === "" || updateInfo.menuUpdate === "not-updated") {
      getAllMenus(dispatch, cookie, removeCookie);
    }
  }, [dispatch, data, updateInfo]);

  const handleDelete = () => {
    setShowLoading(true)
    axios.delete(`${API_HOST}menu/delete/${deleteInfo.alias}`, {
      headers: headers
    })
    .then((res) => {
      // deleteMenu(deleteInfo.alias)(dispatch);
      dispatch(addInfo({ field: 'menuUpdate', value: 'not-updated' }));
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
  return (
    <>
      <Popup showLoading={showLoading} popupText={"Menu Type Deleting..."}  />
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
          Delete Menu
        </h4>
        <div className="text-base text-slate-600 dark:text-slate-300">
          Do you want to delete this menu?
        </div>
      </Modal>
      <Card title="Menu Type" noborder>
        <div className='text-right mb-3'>
            <Button text="Add Menu" className="btn-success py-2" onClick={() => {
              navigate("/menu/menu-type/add")
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
                    {data.map((row, i) => (
                      <tr key={i}>
                        <td className="table-td">{row.title}</td>
                        <td className="table-td lowercase">{row.alias}</td>
                        <td className="table-td ">{row.template}</td>
                        <td className="table-td" style={{paddingRight: "0"}}>
                        <span className={`inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${row.status ? "text-success-500 bg-success-500" : "text-warning-500 bg-warning-500"}`}>{row.status ? "Active": "Inactive"}</span>
                        </td>
                        <td className="table-td ">
                            <Button
                              text="Edit"
                              className="btn-outline-primary rounded-[999px] py-2 me-2"
                              onClick={() => {
                                navigate(`/menu/menu-type/edit/${row.alias}`)
                              }}
                            />
                            <Button
                              text="Delete"
                              className="btn-outline-primary rounded-[999px] py-2"
                              onClick={() => {
                                setDeleteInfo({...deleteInfo, showDeleteModal: true, alias: row.alias})
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
    </>
  )
}

export default MenuType