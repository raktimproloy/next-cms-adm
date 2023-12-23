import axios from 'axios';
import { addInfo, addProfile } from '../store/layout';
import { API_HOST } from './index';

export const getProfile = (dispatch, cookie, removeCookie) => {
  const headers = {
    'Authorization': `Bearer ${cookie._token}`
  };
  
// Get User Data
  axios
    .get(`${API_HOST}user/${cookie.username}`, {
      headers: headers
    })
    .then((res) => {
      const profile = res.data[0]

      // Get Permission Data
        axios.get(`${API_HOST}user-role/${cookie.permissionId}`, {
          headers: headers
        })
        .then(res => {
          const permissionData = res.data[0]
          // Added Permission Data in Store
          dispatch(addProfile({
            fullName: profile.fullName,
            username: profile.username,
            email: profile.email,
            last_login: profile.last_login,
            phone: profile.phone,
            status: profile.status,
            permission: {
              blog: permissionData.permission.blog,
              service: permissionData.permission.service,
              info: permissionData.permission.info,
              user: permissionData.permission.user,
            }
          }));
          // Update Store Info
          dispatch(addInfo({ field: 'profileUpdate', value: 'updated' }));
        })
        .catch(error => {
          if(error.response.data.error === "Authentication error!"){
            removeCookie("_token")
          }
          console.log(error)
        })
    })
    .catch((err) => {
      if (err.response && err.response.data && err.response.data.error === "Authentication error!") {
        removeCookie("_token");
      }
      console.log(err);
    });
};
