import axios, { AxiosInstance } from "axios";
import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { BACKEND_BASE_URL } from "../config";

export const api: AxiosInstance = axios.create({
    baseURL: BACKEND_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const setAuthHeader = (token: string | null, api: AxiosInstance): void => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

export const startTokenExpiryCheck = (): void => {
    console.log("enterrrrrrrrrrrrrrr");
    const jwtString = localStorage.getItem('jwt');
    if (!jwtString) return;

    // Assuming the JWT stored in localStorage is a JSON object with expiration
    // If it's just the token string, we need to decode it. 
    // Based on previous code: const user = JSON.parse(localStorage.getItem('jwt'));
    // This suggests 'jwt' key holds a JSON string, not just the token.

    try {
        const user = JSON.parse(jwtString);
        const checkInterval = 1000;
        console.log(user);
        const exptime = user.expiration; // Ensure this exists in your stored object

        const intervalId = setInterval(() => {
            const currentTime = Date.now();
            // console.log(exptime);
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
                    closeButton: false
                });

                localStorage.removeItem('user'); // Check if this is the correct key to clear
                localStorage.removeItem('jwt');  // Also clear the token
                window.location.href = '/';
                clearInterval(intervalId);
            }
        }, checkInterval);
    } catch (e) {
        console.error("Error parsing JWT from local storage", e);
    }
};
