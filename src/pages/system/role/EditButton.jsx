import React, { useEffect, useState } from 'react'
import Tooltip from "@/components/ui/Tooltip";
import Icon from "@/components/ui/Icon";
import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Textinput from "@/components/ui/Textinput";
import Switch from "@/components/ui/Switch";
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { API_HOST } from '@/utils'
import Popup from "@/components/ui/Popup"
import { useDispatch } from 'react-redux';
import { addInfo } from "@/store/layout";

function EditButton({row}) {
    const dispatch = useDispatch()
    const roleId = row?.cell?.row.original._id
    const [showEditModal, setShowEditModal] = useState(false)
    const [showLoading, setShowLoading] = useState(false)
    const [roleData, setRoleData] = useState({
        rolename: "",
        page: false,
        info: false,
        service: false,
        blog: false
      })

    const [cookie, removeCookie] = useCookies()
    const headers = {
        'Authorization': `Bearer ${cookie._token}`
    }

    useEffect(() => {
        axios.get(`${API_HOST}role/${roleId}`, {
          headers: headers
        })
        .then(res => {
            const data = res.data[0]
            console.log(res.data[0])
            setRoleData(res.data[0])
        })
        .catch(error => {
          if(error.response.data.error === "Authentication error!"){
            removeCookie("_token")
          }
          console.log(error)
        })
    }, [])


    const editRoleHandler = () => {
        setShowLoading(true)
        axios.put(`${API_HOST}role/update/${roleId}`, roleData, {
          headers: headers
        })
        .then(res => {
            dispatch(addInfo({ field: 'roleUpdate', value: 'not-updated' }));
            setShowLoading(false)
            setShowEditModal(false)
        })
        .catch(error => {
          setShowLoading(false)
          if(error.response.data.error === "Authentication error!"){
            removeCookie("_token")
          }
          console.log(error)
        })
    }
    
  return (
    <>
    <Popup showLoading={showLoading} popupText={"Role Updating..."} />
    <Tooltip content="Edit" placement="top" arrow animation="shift-away">
        <button className="action-btn" type="button"  onClick={() => setShowEditModal(true)}>
            {/* <Link to={`/role-management/edit/${roleId}`}> */}
                <Icon icon="heroicons:pencil-square" />
            {/* </Link> */}
        </button>
    </Tooltip>
    <Modal
        title="Add New Role"
        label="Login Form"
        labelClass="btn-outline-dark"
        activeModal={showEditModal}
        onClose={() => {
            setShowEditModal(false)
        }}
        footerContent={
            <Button
            text="Accept"
            className="btn-dark "
            onClick={() => {
                editRoleHandler()
            }}
            />
        }
        >
        <div className="text-base text-slate-600 dark:text-slate-300">
            <Textinput
            label="Role Name"
            type="text"
            placeholder="Type new role"
            value={roleData.rolename}
            onChange={(e) => setRoleData({...roleData, rolename: e.target.value})}
            />
            <div className="mt-4 w-2/4 mx-auto">
            <div className="flex justify-between py-3">
                <Switch
                label="User"
                activeClass="bg-danger-500"
                value={roleData.page}
                onChange={() => setRoleData({...roleData, page: !roleData.page})}
                />
                <Switch
                label="Info"
                activeClass="bg-danger-500"
                value={roleData.info}
                onChange={() => setRoleData({...roleData, info: !roleData.info})}
                />
            </div>
            <div className="flex justify-between py-3">
                <Switch
                label="Service"
                activeClass="bg-danger-500"
                value={roleData.service }
                onChange={() => setRoleData({...roleData, service: !roleData.service})}
                />
                <Switch
                label="Blog"
                activeClass="bg-danger-500"
                value={roleData.blog}
                onChange={() => setRoleData({...roleData, blog: !roleData.blog})}
                />
            </div>
            </div>
        </div>
    </Modal>
    </>
  )
}

export default EditButton