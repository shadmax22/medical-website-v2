import axios from "axios";
import { getTokenFromLocalStorage } from "./Local-Storage";

const Api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Request interceptor to automatically add Authorization header
Api.interceptors.request.use(
  (config) => {
    const token = getTokenFromLocalStorage();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default Api;

