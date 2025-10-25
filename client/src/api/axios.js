import axios from "axios";
const api = axios.create({
    baseURL: "https://pm-system-flax.vercel.app/api", // your backend API base
});
// Attach JWT token automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;