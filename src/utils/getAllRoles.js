import axios from 'axios';
import { addInfo, addRole } from '../store/layout';
import { API_HOST } from './index';

export const getAllRoles = (dispatch, cookie, removeCookie) => {
  const headers = {
    'Authorization': `Bearer ${cookie._token}`
  }
    axios
      .get(`${API_HOST}role/all`, {
        headers: headers
      })
      .then((res) => {
        dispatch(addRole(res.data));
        dispatch(addInfo({ field: 'roleUpdate', value: 'updated' }));
      })
      .catch((err) => {
        if(err.response.data.error === "Authentication error!"){
          removeCookie("_token")
        }
        console.log(err);
      });
};