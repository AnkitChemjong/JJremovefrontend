import axios from 'axios';
import { serverUrl } from '@/Routes';

const axiosClient = axios.create({
    baseURL: serverUrl,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: false, 
  });
  
  export default axiosClient;