// components/pages/PatientDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, MapPin, Calendar, User, Edit, UserSquare } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout'
import { patients as dummyPatients } from '../data/dummyData';
import { Button, Title, Table } from '../components/ui/base';

const PatientDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API call with timeout
        const timer = setTimeout(() => {
            const foundPatient = dummyPatients.find(p => p.id === id);
            setPatient(foundPatient);
            setLoading(false);
        }, 100);

        return () => clearTimeout(timer);
    }, [id]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };


    const columns = [
        { key: "date", title: "Date" },
        { key: "purpose", title: "Purpose" },
        { key: "summary", title: "Summary" },
    ]

    const actions = [
        { key: "view details", title: "View Details" }
    ]

    // table data
    const tableData = patient.visits.map(visit => ({
        date: formatDate(visit.date),
        purpose: visit.purpose,
        summary: visit.summary,
    }))

    if (loading) {
        return (
            <MainLayout>
                <div className="container px-8 py-6 bg-white">
                    <div className="flex justify-center items-center h-64">
                        <div>Loading patient details...</div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    if (!patient) {
        return (
            <MainLayout>
                <div className="container px-8 py-6 bg-white">
                    <div className="flex flex-col items-center justify-center h-64">
                        <div className="text-xl font-semibold text-gray-700 mb-4">Patient not found</div>
                        <Button onClick={() => navigate('/patients')}>
                            Back to Patients List
                        </Button>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="container px-8 py-6 bg-white">
                {/* Header with back button */}
                <div className="flex justify-between items-center mb-6">
                    <Title title='Ptaient Details' Icon={UserSquare} />
                    <Button
                        variant="secondary"
                        size='md'
                        onClick={() => navigate('/patients')}
                        className="mr-4 flex items-center"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Patients
                    </Button>
                </div>

                {/* Patient Information Card */}
                <div className="p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">{patient.fullName}</h2>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center">
                            <Phone className="w-5 h-5 text-gray-500 mr-3" />
                            <span className="text-gray-700">{patient.phoneNumber}</span>
                        </div>
                        <div className="flex items-center">
                            <MapPin className="w-5 h-5 text-gray-500 mr-3" />
                            <span className="text-gray-700">{patient.address}</span>
                        </div>
                        <div className="flex items-center">
                            <Calendar className="w-5 h-5 text-gray-500 mr-3" />
                            <span className="text-gray-700">Date of Birth: {formatDate(patient.dateOfBirth)}</span>
                        </div>
                        <div className="flex items-center">
                            <User className="w-5 h-5 text-gray-500 mr-3" />
                            <span className="text-gray-700">Emergency Contact: {patient.emergencyContact}</span>
                        </div>
                    </div>
                </div>

                {/* Visit History */}
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Visit History</h3>
                    <div>
                        <Table 
                            columns={columns}
                            // data={tableData}
                            // actions={actions}
                        />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default PatientDetails;