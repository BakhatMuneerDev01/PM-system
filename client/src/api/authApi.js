import api from "./axios";
// Register
export const registerUser = (data) => api.post("/auth/register", data);
// Login
export const loginUser = (data) => api.post("/auth/login", data);
// Get profile
export const getProfile = () => api.get("/auth/profile");
// Update profile
export const updateProfile = (formData) =>
    api.put("/auth/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });