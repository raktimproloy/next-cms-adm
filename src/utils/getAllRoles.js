import axios from 'axios';
import { addInfo, addRole } from '../store/layout';

export const getAllRoles = (dispatch) => {
    axios
      .get(`http://localhost:3001/role/all`)
      .then((res) => {
        dispatch(addRole(res.data));
        dispatch(addInfo({ field: 'roleUpdate', value: 'updated' }));
      })
      .catch((err) => {
        console.log(err);
      });
};