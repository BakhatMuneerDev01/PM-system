import api from './axios';
// Create a visit
export const createVisit = (data) => api.post('/visits', data);
// Get a visit by ID
export const getVisitById = (id) => api.get(`/visits/${id}`);
// Update a visit
export const updateVisit = (id, data) => api.put(`/visits/${id}`, data);
// Delete a visit
export const deleteVisit = (id) => api.delete(`/visits/${id}`);
// Get visits by patient
export const getVisitsByPatient = (patientId) => api.get(`/visits/patient/${patientId}`);