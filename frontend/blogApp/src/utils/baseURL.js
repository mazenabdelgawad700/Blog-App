import axios from "axios";

const request = axios.create({
  baseURL: "http://localhost:5000",
});

export const BASE_URL = "http://localhost:5000";

export default request;

// https://blog-app-api-seven.vercel.app/
