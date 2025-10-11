import api from "./axios";
// Get all patients (with optional query params)
export const getPatients = (params) => api.get('/patients', {params});
// Get patient by ID
export const getPatientById = (id) => api.get(`/patients/${id}`);
// Create a new patient
export const createPatient = (data) => api.post('/patients', data);
// Update patient
export const updatePatient = (id, data) => api.put(`/patients/${id}`, data);
// Delete patient
export const deletePatient = (id) => api.delete(`/patients/${id}`);