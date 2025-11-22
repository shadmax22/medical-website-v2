import axios from "axios";
const customFetch = axios.create({
  baseURL: 'http://localhost:5173/V1',
});

export default customFetch;
