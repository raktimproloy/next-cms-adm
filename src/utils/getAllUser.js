import axios from 'axios';
import { addInfo, addUser } from '../store/layout';

export const getUser = (dispatch) => {
    axios
      .get(`http://localhost:3001/user/all`)
      .then((res) => {
        dispatch(addUser(res.data));
        dispatch(addInfo({ field: 'userUpdate', value: 'updated' }));
      })
      .catch((err) => {
        console.log(err);
      });
};