import axios from "axios";
import { authStore } from "../store/authStore";

const api = axios.create({
  baseURL: "http://localhost:5081/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = authStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;