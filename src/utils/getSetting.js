import axios from 'axios';
import { addInfo, addSetting } from '../store/layout';
import { API_HOST } from './index';

export const getSetting = (dispatch, cookie, removeCookie) => {
  const headers = {
    'Authorization': `Bearer ${cookie._token}`
  };
    // Get Setting Data
  axios
    .get(`${API_HOST}setting/get`, {
      headers: headers
    })
    .then((res) => {
      const setting = res.data
      // Added Permission Data in Store
      dispatch(addSetting(setting));
      // Update Store Info
      dispatch(addInfo({ field: 'settingUpdate', value: 'updated' }));
    })
    .catch((err) => {
      if (err.response && err.response.data && err.response.data.error === "Authentication error!") {
        removeCookie("_token");
      }
      console.log(err);
    });
};
