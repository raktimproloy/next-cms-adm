import { Client } from "appwrite";
import axios from "axios";
import { API_HOST } from "..";

export const client = new Client();

axios
.get(`${API_HOST}setting/get`)
.then((res) => {
  const setting = res.data
  client
  .setEndpoint(setting?.storage_config?.storage_endpoint)
  .setProject(setting?.storage_config?.storage_project_id);
})
.catch((err) => {
  if (err.response && err.response.data && err.response.data.error === "Authentication error!") {
    removeCookie("_token");
  }
  console.log(err);
});

// client
//     .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
//     .setProject(import.meta.env.VITE_APPWRITE_PROJECTID);





    