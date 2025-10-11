
{/*
    import { createContext, useContext, useState } from "react";
    import {
        createVisit,
        getVisitById,
        updateVisit,
        deleteVisit,
        getVisitsByPatient,
    } from "../api/visitApi";
    import toast from "react-hot-toast";
    
    const VisitContext = createContext();
    
    export const useVisits = () => useContext(VisitContext);
    
    export const VisitProvider = ({ children }) => {
        const [visit, setVisit] = useState([]);
        const [visits, setVisits] = useState([]);
        const [loading, setLoading] = useState(false);
        // Fetch all visits for a patient
        const fetchVisitsByPatient = async (patientId) => {
            setLoading(true);
            try {
                const res = await getVisitsByPatient(patientId);
                setVisits(res.data);
                return res.data;
            } catch (err) {
                toast.error(err.response?.data?.message || "Failed to fetch visits");
            } finally {
                setLoading(false);
            }
        };
        // Fetch a single visit
        const fetchVisitById = async (id) => {
            setLoading(true);
            try {
                const res = await getVisitById(id);
                setVisit(res.data);
                return res.data;
            } catch (err) {
                toast.error(err.response?.data?.message || "Failed to fetch visit");
            } finally {
                setLoading(false);
            }
        };
        // Create a visit
        const addVisit = async (data) => {
            try {
                const res = await createVisit(data);
                setVisits((prev) => [...prev, res.data]);
                toast.success('Visit created successfully');
                return res.data;
            } catch (err) {
                toast.error(err.response?.data?.message || "Failed to create visit");
            }
        };
        // Update a visit
        const editVisit = async (id, data) => {
            try {
                const res = await updateVisit(id, data);
                setVisits((prev) =>
                    prev.map((v) => (v._id === id ? res.data : v))
                );
                toast.success("Visit updated successfully");
                return res.data;
            } catch (err) {
                toast.error(err.response?.data?.message || "Failed to update visit");
            }
        };
        // Delete a visit
        const removeVisit = async (id) => {
            try {
                await deleteVisit(id);
                setVisits((prev) => prev.filter((v) => v._id !== id));
                toast.success("Visit deleted successfully");
            } catch (err) {
                toast.error(err.response?.data?.message || "Failed to delete visit");
            }
        };
    
        const values = {
            fetchVisitsByPatient,
            fetchVisitById,
            addVisit,
            editVisit,
            removeVisit,
            visit,
            visits,
            loading
        };
        return (
            <VisitContext.Provider value={values}>
                {children}
            </VisitContext.Provider>
        )
    };
    
    */}

// src/context/VisitContext.jsx
import { createContext, useContext, useState } from 'react';
import {
  createVisit,
  getVisitById,
  updateVisit,
  deleteVisit,
  getVisitsByPatient,
} from '../api/visitApi';
import toast from 'react-hot-toast';

const VisitContext = createContext();
export const useVisits = () => useContext(VisitContext);

export const VisitProvider = ({ children }) => {
  const [visit, setVisit] = useState(null);   // a single visit
  const [visits, setVisits] = useState([]);   // visits list
  const [loading, setLoading] = useState(false);

  // In src/context/VisitContext.jsx - Update fetchVisitsByPatient
  const fetchVisitsByPatient = async (patientId) => {
    setLoading(true);
    try {
      const res = await getVisitsByPatient(patientId);
      // Ensure visits is always an array, even if API returns null/undefined
      setVisits(res.data || []);
      return res.data || [];
    } catch (err) {
      console.error('Fetch visits error:', err);
      // If it's a 404 (no visits), that's normal - set empty array
      if (err.response?.status === 404) {
        setVisits([]);
        return [];
      }
      toast.error(err.response?.data?.message || "Failed to fetch visits");
      setVisits([]); // Fallback to empty array
    } finally {
      setLoading(false);
    }
  };

  const fetchVisitById = async (id) => {
    setLoading(true);
    try {
      const res = await getVisitById(id);
      setVisit(res.data);
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch visit');
    } finally {
      setLoading(false);
    }
  };

  const addVisit = async (data) => {
    try {
      const res = await createVisit(data);
      // fixed spread bug
      setVisits((prev) => [...prev, res.data]);
      toast.success('Visit created successfully');
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create visit');
    }
  };

  const editVisit = async (id, data) => {
    try {
      const res = await updateVisit(id, data);
      setVisits((prev) => prev.map((v) => (v._id === id ? res.data : v)));
      if (visit && visit._id === id) setVisit(res.data);
      toast.success('Visit updated successfully');
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update visit');
    }
  };

  const removeVisit = async (id) => {
    try {
      await deleteVisit(id);
      setVisits((prev) => prev.filter((v) => v._id !== id));
      if (visit && visit._id === id) setVisit(null);
      toast.success('Visit deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete visit');
    }
  };

  const values = {
    visit,
    visits,
    loading,
    fetchVisitsByPatient,
    fetchVisitById,
    addVisit,
    editVisit,
    removeVisit,
  };

  return <VisitContext.Provider value={values}>{children}</VisitContext.Provider>;
};