import axios from 'axios';
import { addInfo, addBlog } from '../store/layout';
import { API_HOST } from './index';

export const getAllBlogs = (dispatch, cookie, removeCookie) => {
  const headers = {
    'Authorization': `Bearer ${cookie._token}`
  }
    axios
      .get(`${API_HOST}blog/all`, {
        headers: headers
      })
      .then((res) => {
        dispatch(addBlog(res.data));
        dispatch(addInfo({ field: 'blogUpdate', value: 'updated' }));
      })
      .catch((err) => {
        if(err.response.data.error === "Authentication error!"){
          removeCookie("_token")
        }
        console.log(err);
      });
};