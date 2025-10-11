// src/api/visitNoteApi.js
import api from "./api"; // axios instance with token interceptor
// Create or update visit notes
export const createOrUpdateVisitNote = (visitId, data) =>
  api.post(`/visits/${visitId}/notes`, data);
// Get visit notes
export const getVisitNotes = (visitId) =>
  api.get(`/visits/${visitId}/notes`);
// Delete visit notes
export const deleteVisitNotes = (visitId) =>
  api.delete(`/visits/${visitId}/notes`);