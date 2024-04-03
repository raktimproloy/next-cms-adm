import axios from "axios"
import {API_HOST} from "./index"

export const AddLog = (email, activity_type, details) => {

    axios.get(`https://api.bigdatacloud.net/data/client-info`)
    .then(res => {
      const ipData = res.data
      let access_log = ""

      if(ipData.isBehindProxy){
        access_log = `IP: ${ipData?.proxyIp}, Device: ${ipData?.userAgentDisplay}`
      }else{
        access_log = `IP: ${ipData?.ipString}, Device: ${ipData?.userAgentDisplay}`
      }
      axios.post(`${API_HOST}log/add`, {
        email,
        activity_type,
        details,
        access_log
      })
      .then(res => {
        
      })
      .catch(err => {
        console.log(err)
      })

    })
    .catch(err => {
      console.log(err)
    })


}