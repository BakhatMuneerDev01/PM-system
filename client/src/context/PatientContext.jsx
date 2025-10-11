{/*    
    import { createContext, useContext, useState } from 'react';
    import {
        getPatients,
        getPatientById,
        createPatient,
        updatePatient,
        deletePatient
    } from '../api/patientApi';
    import toast from 'react-hot-toast';
    
    const PatientContext = createContext();
    // export const usePatient = () => useContext(PatientContext);
    export const usePatient = () => {
        return useContext(PatientContext);
    }
    
    export const PatientProvider = ({ children }) => {
        const [patients, setPatients] = useState([]);
        const [patient, setPatient] = useState(null);
        const [loading, setLoading] = useState(false);
    
        // Fetch all patients
        const fetchPatients = async (params = {}) => {
            setLoading(true);
            try {
                const res = await getPatients(params);
                setPatients(res.data.patients);
                return res.data;
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to fetch patients');
            } finally {
                setLoading(false);
            }
        }
        // Fetch single patient
        const fetchPatientById = async (id) => {
            setLoading(true);
            try {
                const res = await getPatientById(id);
                setPatient(res.data);
                return res.data;
            } catch (err) {
                toast.error(err.response?.data?.message || "Failed to fetch patient");
            } finally {
                setLoading(false);
            }
        }
        // Create new patient
        const addPatient = async (data) => {
            try {
                const res = await createPatient(data);
                setPatients((prev) => [...prev, res.data]);;
                toast.success('Patient added successfully');
                return res.data;
            } catch (err) {
                toast.error(err.response?.data?.message || "Failed to create patient");
            }
        };
        // Update patient
        const editPatient = async (id, data) => {
            try {
                const res = await updatePatient(id, data);
                setPatients((prev) => prev.map((p) => (p._id === id ? res.data : p)));
                toast.success('Patient updated successfully');
                return res.data;
            } catch (err) {
                toast.error(err.response?.data?.message || "Failed to update patient");
            }
        }
        // Delete patient
        const removePatient = async (id) => {
            try {
                const res = await deletePatient(id);
                setPatients((prev) => prev.filter((p) => p._id !== id));
                toast.success("Patient deleted successfully");
            } catch (err) {
                toast.error(err.response?.data?.message || "Failed to delete patient");
            }
        };
    
        const values = {
            patient,
            patients,
            loading,
            fetchPatients,
            fetchPatientById,
            addPatient,
            editPatient,
            removePatient
        };
        return (
            <PatientContext.Provider value={values}>
                {children}
            </PatientContext.Provider>
        )
    };
*/}


// src/context/PatientContext.jsx
import { createContext, useContext, useState } from 'react';
import {
    getPatients,
    getPatientById,
    createPatient,
    updatePatient,
    deletePatient
} from '../api/patientApi';
import toast from 'react-hot-toast';

const PatientContext = createContext();
export const usePatient = () => useContext(PatientContext);

export const PatientProvider = ({ children }) => {
    const [patients, setPatients] = useState([]);
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchPatients = async (params = {}) => {
        setLoading(true);
        try {
            const res = await getPatients(params);
            setPatients(res.data.patients);
            return res.data;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch patients');
        } finally {
            setLoading(false);
        }
    };

    // In src/context/PatientContext.jsx - Update fetchPatientById
    const fetchPatientById = async (id) => {
        console.log('🔄 fetchPatientById called with id:', id);
        setLoading(true);
        try {
            const res = await getPatientById(id);
            console.log('✅ fetchPatientById success:', res.data);
            setPatient(res.data);
            return res.data;
        } catch (err) {
            console.error('❌ fetchPatientById error:', err);
            console.error('Error response:', err.response);
            toast.error(err.response?.data?.message || "Failed to fetch patient");
            setPatient(null);
        } finally {
            console.log('🏁 fetchPatientById completed, setting loading to false');
            setLoading(false);
        }
    }

    const addPatient = async (data) => {
        try {
            const res = await createPatient(data);
            // fixed spread bug
            setPatients((prev) => [...prev, res.data]);
            toast.success('Patient added successfully');
            return res.data;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create patient');
        }
    };

    const editPatient = async (id, data) => {
        try {
            const res = await updatePatient(id, data);
            setPatients((prev) => prev.map((p) => (p._id === id ? res.data : p)));
            // also refresh single patient if currently loaded
            setPatient((cur) => (cur && cur._id === id ? res.data : cur));
            toast.success('Patient updated successfully');
            return res.data;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update patient');
        }
    };

    const removePatient = async (id) => {
        try {
            await deletePatient(id);
            setPatients((prev) => prev.filter((p) => p._id !== id));
            if (patient && patient._id === id) setPatient(null);
            toast.success('Patient deleted successfully');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete patient');
        }
    };

    const values = {
        patient,
        patients,
        loading,
        fetchPatients,
        fetchPatientById,
        addPatient,
        editPatient,
        removePatient,
    };

    return <PatientContext.Provider value={values}>{children}</PatientContext.Provider>;
};