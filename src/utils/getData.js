import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../store/layout";
import { useSelector } from "react-redux";


export const getUser = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.users);
  const isUserUpdate = JSON.parse(localStorage.getItem("userdata"))
  // if(isUserUpdate !== "updated"){
    if (data.length === 0) { 
      axios
        .get(`http://localhost:3001/user/all`)
        .then((res) => {
          localStorage.setItem("userdata", JSON.stringify("updated"))
          dispatch(addUser(res.data));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  // }
};
