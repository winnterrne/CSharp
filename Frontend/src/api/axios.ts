import axios from "axios";
import { authStore } from "../store/authStore";

const api = axios.create({
  baseURL: "http://localhost:5081/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const storeToken = authStore.getState().token;
  const localToken = localStorage.getItem("token");

  const token = storeToken || localToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;