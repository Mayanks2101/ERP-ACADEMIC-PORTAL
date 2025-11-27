import axios from "axios";
import { toast,Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const BASE_URL='http://localhost:8080'

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
     
      'Content-Type': 'application/json',
  
    },
  });

  export const setAuthHeader = (token,api) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  };

  export const startTokenExpiryCheck = () => {
    console.log("enterrrrrrrrrrrrrrr")
    const user = JSON.parse(localStorage.getItem('jwt'));
    const checkInterval = 1000; 
    console.log(user);
    const exptime=user.expiration;
    const intervalId = setInterval(() => {
      const currentTime = Date.now();
      console.log(exptime);
      if (exptime <= currentTime) {
        toast.error('Your session has expired. Please log in again.', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
          closeButton:false
          });
          // setTimeout(() => {
          //   console.log('This runs after 5 seconds');
          // }, 5000);
        localStorage.removeItem('user');
        window.location.href = '/'; 
        clearInterval(intervalId);
      }
    }, checkInterval);
  };