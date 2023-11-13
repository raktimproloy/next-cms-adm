import axios from 'axios';
import { addInfo, addPage } from '../store/layout';
import { API_HOST } from './index';

export const getAllPages = (dispatch, cookie, removeCookie) => {
  const headers = {
    'Authorization': `Bearer ${cookie._token}`
  }
    axios
      .get(`${API_HOST}page/all`, {
        headers: headers
      })
      .then((res) => {
        dispatch(addPage(res.data));
        dispatch(addInfo({ field: 'pageUpdate', value: 'updated' }));
      })
      .catch((err) => {
        if(err.response.data.error === "Authentication error!"){
          removeCookie("_token")
        }
        console.log(err);
      });
};