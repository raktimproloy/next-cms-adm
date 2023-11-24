import axios from 'axios';
import { addInfo, addUserRole } from '../store/layout';
import { API_HOST } from './index';

export const getAllUserRoles = (dispatch, cookie, removeCookie) => {
  const headers = {
    'Authorization': `Bearer ${cookie._token}`
  }
    axios
      .get(`${API_HOST}user-role/all`, {
        headers: headers
      })
      .then((res) => {
        dispatch(addUserRole(res.data));
        dispatch(addInfo({ field: 'userRoleUpdate', value: 'updated' }));
      })
      .catch((err) => {
        if(err.response.data.error === "Authentication error!"){
          removeCookie("_token")
        }
        console.log(err);
      });
};