import axios from 'axios';
import { addInfo, addUser } from '../store/layout';
import { API_HOST } from './index';
import { useCookies } from 'react-cookie';

export const getAllUser = (dispatch, cookies, removeCookies) => {

  const token = cookies._token
  const headers = {
    'Authorization': `Bearer ${token}`
  }
    axios
      .get(`${API_HOST}user/all`, {
        headers: headers
      })
      .then((res) => {
        dispatch(addUser(res.data));
        dispatch(addInfo({ field: 'userUpdate', value: 'updated' }));
      })
      .catch((err) => {
        if(err.response.data.error === "Authentication error!"){
          removeCookies("_token")
        }
        console.log(err);
      });
};