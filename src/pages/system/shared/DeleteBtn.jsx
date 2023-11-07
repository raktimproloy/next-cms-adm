import React, { useState } from 'react'
import Tooltip from "@/components/ui/Tooltip";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import axios from "axios";
import { removeUser } from '../../../store/layout';
import { useDispatch } from 'react-redux';
import {API_HOST} from "@/utils"
import { useCookies } from 'react-cookie';
import Popup from "@/components/ui/Popup"

function DeleteBtn({row, which}) {
    const [showModal, setShowModal] = useState(false)
    const dispatch = useDispatch()
    const [showLoading, setShowLoading] = useState(false)

    // Cookies
    const [cookies, removeCookies] = useCookies()
    const headers = {
      'Authorization': `Bearer ${cookies._token}`
    }

    const deleteUser = (id) => {
        dispatch(removeUser(id))
    }

    const handleDelete = () => {
      setShowLoading(true)
      if(which === "user"){
        axios.delete(`${API_HOST}user/delete/${row?.cell?.row.original._id}`, {
          headers: headers
        })
        .then((res) => {
          setShowLoading(false)
          deleteUser(row?.cell?.row.id)
          setShowModal(false)
        })
        .catch((err) => {
          setShowLoading(false)
          if(err.response.data.error === "Authentication error!"){
            removeCookies("_token")
          }
        });
      }else{
        axios.delete(`${API_HOST}role/delete/${row?.cell?.row.original._id}`, {
          headers: headers
        })
        .then((res) => {
          setShowLoading(false)
          // deleteUser(row?.cell?.row.id)
          setShowModal(false)
        })
        .catch((err) => {
          setShowLoading(false)
          if(err.response.data.error === "Authentication error!"){
            removeCookies("_token")
          }
          console.log(err);
        });
      }
    }
  return (
    <>
      <Popup showLoading={showLoading} popupText={which === "user" ? "User Deleting..." : "Role Deleting..."} />
      <div className="flex justify-center">
        <Tooltip
          content="Delete"
          placement="top"
          arrow
          animation="shift-away"
          theme="danger"
        >

          <button className="action-btn" type="button" onClick={() => setShowModal(true)}>
            <Icon icon="heroicons:trash" />
          </button>
        </Tooltip>
        <Modal
          title="Warning"
          label=""
          labelClass="btn-outline-warning p-1"
          themeClass="bg-warning-500"
          activeModal={showModal}
          onClose={() => {
            setShowModal(false)
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
            Delete User
          </h4>
          <div className="text-base text-slate-600 dark:text-slate-300">
            Do you want to delete this user?
          </div>
        </Modal>
      </div>
    </>
  )
}

export default DeleteBtn