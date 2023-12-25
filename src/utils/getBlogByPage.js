import axios from "axios";
import { addBlogPage, addInfo } from "../store/layout";
import { API_HOST } from "./index";

export const getBlogsByPage = (dispatch, currentPage, cookie, removeCookie, pageDataInRedux) => {
    const headers = {
      'Authorization': `Bearer ${cookie._token}`
    };
    if (pageDataInRedux) {
      // If data is in Redux, dispatch it directly
      dispatch(addBlogPage({ page: currentPage, data: pageDataInRedux }));
    } else {
      // If data is not in Redux, fetch it from the API
      axios
        .get(`${API_HOST}blog/all/${currentPage}`, { headers })
        .then((res) => {
          dispatch(addBlogPage({ page: currentPage, data: res.data }));
          dispatch(addInfo({ field: 'blogUpdate', value: 'updated' }));
        })
        .catch((err) => {
          if (err.response.data.error === "Authentication error!") {
            removeCookie("_token");
          }
          console.log(err);
        });
    }
  };
  