import axios from 'axios';
import config from '../config/config.json'
const api = axios.create({
  baseURL: config.api_url + '/api',
  timeout: 20000
});
export function signUp(data){
  return new Promise(async (resolve, reject)=>{
    try{
      const response = await api.post('/auth/signup',data);
      console.log(response.data)
      resolve(response.data);
    }catch(e){
      console.log(e.response.data)
    }

  })
}