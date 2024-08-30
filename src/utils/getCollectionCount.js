import axios from 'axios';
import { addCollectionCount, addInfo } from '../store/layout';
import { API_HOST } from './index';

export const getCollectionCount = async (dispatch, cookie, removeCookie, collection, previousData) => {
  try {
    const headers = {
      'Authorization': `Bearer ${cookie._token}`
    };

    const countResponse = await axios.get(`${API_HOST}${collection}/collection/count`, {
      headers: headers
    });
    const count = countResponse.data.count;

    if(previousData[collection] === undefined){
        dispatch(addCollectionCount({
            ...previousData,
            [collection]: count,
        }))
    }
    

  } catch (error) {
    if (error.response && error.response.data && error.response.data.error === "Authentication error!") {
      removeCookie("_token");
    }
    console.error(error);
  }
};
