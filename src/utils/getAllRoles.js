import axios from 'axios';
import { addInfo, addRole } from '../store/layout';
import { API_HOST } from './index';

export const getAllRoles = (dispatch) => {
    axios
      .get(`${API_HOST}role/all`)
      .then((res) => {
        dispatch(addRole(res.data));
        dispatch(addInfo({ field: 'roleUpdate', value: 'updated' }));
      })
      .catch((err) => {
        console.log(err);
      });
};