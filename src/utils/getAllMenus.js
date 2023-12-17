import axios from 'axios';
import { addInfo, addMenu } from '../store/layout';
import { API_HOST } from './index';

export const getAllMenus = (dispatch, cookie, removeCookie) => {
  const headers = {
    'Authorization': `Bearer ${cookie._token}`
  }
    axios
      .get(`${API_HOST}menu/all`, {
        headers: headers
      })
      .then((res) => {
        dispatch(addMenu(res.data));
        dispatch(addInfo({ field: 'menuUpdate', value: 'updated' }));
      })
      .catch((err) => {
        if(err.response.data.error === "Authentication error!"){
          removeCookie("_token")
        }
        console.log(err);
      });
};