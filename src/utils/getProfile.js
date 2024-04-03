import axios from 'axios';
import { addInfo, addProfile } from '../store/layout';
import { API_HOST } from './index';

export const getProfile = async (dispatch, cookie, removeCookie, sessionData) => {
  try {
    if(Object.keys(sessionData).length > 0){
  
      const headers = {
        'Authorization': `Bearer ${cookie._token}`
      };
      // Get User Data
      const userResponse = await axios.get(`${API_HOST}user/${sessionData.username}`, {
        headers: headers
      });
      const profile = userResponse.data[0];
      // Get Permission Data
      const permissionResponse = await axios.get(`${API_HOST}user-role/${sessionData.permissionId}`, {
        headers: headers
      });
      const permissionData = permissionResponse.data[0];
  
      // Get Role Data
      const roleResponse = await axios.get(`${API_HOST}role/${permissionData.role}`, {
        headers: headers
      });
      const roleData = roleResponse.data[0];
  
      // Added Permission Data in Store
      dispatch(addProfile({
        fullName: profile.fullName,
        username: profile.username,
        email: profile.email,
        last_login: profile.last_login,
        phone: profile.phone,
        status: profile.status,
        rolename: roleData.rolename,
        permission: {
          blog: permissionData.permission.blog,
          service: permissionData.permission.service,
          info: permissionData.permission.info,
          page: permissionData.permission.page,
        }
      }));
  
      // Update Store Info
      dispatch(addInfo({ field: 'profileUpdate', value: 'updated' }));
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error === "Authentication error!") {
      removeCookie("_token");
    }
  }
};
