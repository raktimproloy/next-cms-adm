import axios from 'axios';
import { addInfo, addUser } from '../store/layout';
import { API_HOST } from './index';

export const getUser = (dispatch) => {
    axios
      .get(`${API_HOST}user/all`)
      .then((res) => {
        dispatch(addUser(res.data));
        dispatch(addInfo({ field: 'userUpdate', value: 'updated' }));
      })
      .catch((err) => {
        console.log(err);
      });
};