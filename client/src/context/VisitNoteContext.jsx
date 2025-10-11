// src/contexts/VisitNoteContext.jsx
import { createContext, useContext, useState } from "react";
import {
    createOrUpdateVisitNote,
    getVisitNotes,
    deleteVisitNotes,
} from "../api/visitNoteApi";
import toast from "react-hot-toast";

const VisitNoteContext = createContext();

export const useVisitNotes = () => useContext(VisitNoteContext);

export const VisitNoteProvider = ({ children }) => {
    const [notes, setNotes] = useState(null); // store notes for one visit
    const [loading, setLoading] = useState(false);

    // Fetch notes for a visit
    const fetchNotes = async (visitId) => {
        setLoading(true);
        try {
            const res = await getVisitNotes(visitId);
            setNotes(res.data);
            return res.data;
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to fetch notes");
        } finally {
            setLoading(false);
        }
    };

    // Create or update notes
    const saveNotes = async (visitId, data) => {
        try {
            const res = await createOrUpdateVisitNote(visitId, data);
            setNotes(res.data);
            toast.success("Notes saved successfully");
            return res.data;
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save notes");
        }
    };

    // Delete notes
    const removeNotes = async (visitId) => {
        try {
            await deleteVisitNotes(visitId);
            setNotes(null);
            toast.success("Notes deleted successfully");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete notes");
        }
    };

    return (
        <VisitNoteContext.Provider
            value={{ notes, loading, fetchNotes, saveNotes, removeNotes }}
        >
            {children}
        </VisitNoteContext.Provider>
    );
};