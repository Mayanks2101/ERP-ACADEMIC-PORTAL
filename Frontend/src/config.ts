const hostname = window.location.hostname;
export const BACKEND_BASE_URL = process.env.REACT_APP_API_URL || `http://${hostname}:8080`;
