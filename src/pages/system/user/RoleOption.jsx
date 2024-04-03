import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import Select from "react-select";
import { API_HOST } from '@/utils';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { getAllRoles } from '@/utils/getAllRoles';

const styles = {
    option: (provided, state) => ({
      ...provided,
      fontSize: "14px",
    }),
};

function RoleOption({userData, setUserData}) {
const [roles, setRoles] = useState([])

const data = useSelector((state) => state.roles);
const updateInfo = useSelector((state) => state.update);
const dispatch = useDispatch()

// Cookies
const [cookie, removeCookie] = useCookies()

useEffect(() => {
  if (updateInfo.roleUpdate === "" || updateInfo.roleUpdate === "not-updated") {
    getAllRoles(dispatch, cookie, removeCookie);
  }
}, [dispatch, data, updateInfo]);

useEffect(() => { 
  if(roles.length < 1){
    setRoles([])
    data.map(role => {
      setRoles(oldValue => [...oldValue, {value: role.rolename, label: role.rolename}])
    })
  }
}, [data])

function handleOptionChange(e) {
  data.map(role => {
    if(role.rolename.toString() === e.value.toString()){
      setUserData({
        ...userData, roleId:role._id, role:e.value
    })
    }
  })
}

  return (
    <div className="gap-5">
        <div>
        <label htmlFor=" hh" className="form-label ">
            Role
        </label>
        <Select
            className="react-select"
            classNamePrefix="select"
            defaultValue={roles[0]}
            options={roles}
            styles={styles}
            id="hh"
            onChange={handleOptionChange}
        />
        </div>
    </div>
  )
}

export default RoleOption