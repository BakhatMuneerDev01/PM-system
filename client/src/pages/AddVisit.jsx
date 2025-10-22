// src/pages/AddVisit.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, User, Check, FileText } from 'lucide-react';
import { Button, Title, Input, Modal } from '../components/ui/base';
import { usePatient } from '../context/PatientContext';
import { useVisits } from '../context/VisitContext';
import LoadingSpinner from '../components/LoadingSpinner';

const AddVisit = () => {
    const { patientId } = useParams();
    const navigate = useNavigate();
    const { patient, fetchPatientById, loading: patientLoading } = usePatient();
    const { addVisit, loading: visitLoading } = useVisits();

    const [formData, setFormData] = useState({
        patient: patientId || '',
        date: '',
        time: '',
        purpose: '',
        summary: '',
        type: '',
        gpsLocation: {
            latitude: '',
            longitude: ''
        }
    });

    const [gpsCaptured, setGpsCaptured] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    useEffect(() => {
        if (patientId) {
            fetchPatientById(patientId);
            setFormData(prev => ({ ...prev, patient: patientId }));
        }
    }, [patientId]);

    useEffect(() => {
        // Set current date and time as default
        const now = new Date();
        setFormData(prev => ({
            ...prev,
            date: now.toISOString().split('T')[0],
            time: now.toTimeString().slice(0, 5)
        }));
        
        // Auto-capture GPS location when component mounts
        captureGPSLocation();
    }, []);

    const captureGPSLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData(prev => ({
                        ...prev,
                        gpsLocation: {
                            latitude: position.coords.latitude.toFixed(6),
                            longitude: position.coords.longitude.toFixed(6)
                        }
                    }));
                    setGpsCaptured(true);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    setGpsCaptured(false);
                    // Set default coordinates if GPS fails
                    setFormData(prev => ({
                        ...prev,
                        gpsLocation: {
                            latitude: '34.0522',
                            longitude: '-118.2437'
                        }
                    }));
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
            setGpsCaptured(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleGPSChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            gpsLocation: {
                ...prev.gpsLocation,
                [name]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields
        if (!formData.purpose || !formData.type) {
            alert('Please fill in all required fields: Purpose and Visit Type');
            return;
        }

        // Combine date and time
        const dateTime = formData.date && formData.time
            ? `${formData.date}T${formData.time}:00.000Z`
            : new Date().toISOString();

        const visitData = {
            patient: formData.patient,
            date: dateTime,
            purpose: formData.purpose,
            summary: formData.summary || '',
            type: formData.type,
            gpsLocation: formData.gpsLocation.latitude && formData.gpsLocation.longitude ? {
                latitude: parseFloat(formData.gpsLocation.latitude),
                longitude: parseFloat(formData.gpsLocation.longitude)
            } : undefined
        };

        console.log('Submitting visit data:', visitData);

        try {
            await addVisit(visitData);
            navigate(`/patients/${patientId}`);
        } catch (error) {
            console.error('Failed to create visit:', error);
        }
    };

    const handleCancel = () => {
        setShowCancelModal(true);
    };

    const confirmCancel = () => {
        navigate(`/patients/${patientId}`);
    };

    const visitTypes = [
        'Initial Consultation',
        'Follow-up',
        'Emergency',
        'Routine Check-up'
    ];

    if (patientLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <Title
                    title="Submit Visit Data"
                    Icon={FileText}
                    className="text-2xl"
                />
            </div>

            <form onSubmit={handleSubmit} className="space-y-">
                {/* Patient Information */}
                <Section title="Patient Name">
                    <div className="bg-gray-50 p-1.5 rounded-lg border">                        {patient ? (
                            <div className="flex items-center space-x-3">
                                <User className="w-5 h-5 text-gray-400" />
                                <span className="text-lg font-medium text-gray-900">
                                    {patient.fullName}
                                </span>
                            </div>
                        ) : (
                            <p className="text-gray-500">Select a patient</p>
                        )}
                    </div>
                </Section>

                {/* Visit Date & Time */}
                <Section title="Visit Date & Time">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Date"
                            name="date"
                            type="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            required
                            icon={Calendar}
                        />
                        <Input
                            label="Time"
                            name="time"
                            type="time"
                            value={formData.time}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    {formData.date && formData.time && (
                        <p className="text-sm text-gray-600 mt-2">
                            Scheduled for: {new Date(`${formData.date}T${formData.time}`).toLocaleString()}
                        </p>
                    )}
                </Section>

                {/* GPS Location */}
                <Section title="GPS Location">
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Latitude"
                                name="latitude"
                                value={formData.gpsLocation.latitude}
                                onChange={handleGPSChange}
                                placeholder="e.g., 34.0522"
                                icon={MapPin}
                            />
                            <Input
                                label="Longitude"
                                name="longitude"
                                value={formData.gpsLocation.longitude}
                                onChange={handleGPSChange}
                                placeholder="e.g., -118.2437"
                            />
                        </div>

                        <div className="flex items-center space-x-3">
                            <button
                                type="button"
                                onClick={captureGPSLocation}
                                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
                            >
                                <MapPin className="w-4 h-4" />
                                <span>Capture Current Location</span>
                            </button>

                            {gpsCaptured && (
                                <div className="flex items-center space-x-2 text-green-600 text-sm">
                                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                    <span>Location captured successfully!</span>
                                </div>
                            )}
                        </div>

                        {formData.gpsLocation.latitude && formData.gpsLocation.longitude && (
                            <p className="text-sm text-gray-600">
                                Lat: {formData.gpsLocation.latitude}, Lon: {formData.gpsLocation.longitude}
                            </p>
                        )}
                    </div>
                </Section>

                {/* Visit Type */}
                <Section title="Visit Type">
                    <div className="grid grid-cols-1 gap-3">
                        {visitTypes.map((type) => (
                            <div key={type} className="flex items-center space-x-3">
                                <input
                                    type="radio"
                                    id={type}
                                    name="type"
                                    value={type}
                                    checked={formData.type === type}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                    required
                                />
                                <label htmlFor={type} className="text-sm font-medium text-gray-700">
                                    {type}
                                </label>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* Purpose - REQUIRED FIELD */}
                <Section title="Purpose">
                    <Input
                        label="Visit Purpose"
                        name="purpose"
                        placeholder="Enter the purpose of this visit"
                        value={formData.purpose}
                        onChange={handleInputChange}
                        required
                    />
                </Section>

                {/* Notes (Optional) */}
                <Section title="Notes (Optional)">
                    <textarea
                        name="summary"
                        value={formData.summary}
                        onChange={handleInputChange}
                        placeholder="Enter any additional visit-related notes..."
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                </Section>

                {/* Visit Notes - Coming Soon */}
                <Section title="Visit Notes">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-lg font-semibold text-yellow-800">
                                    COMING SOON
                                </h4>
                                <p className="text-yellow-700 mt-1 text-sm">
                                    Detailed visit notes functionality will be available in a future update.
                                </p>
                            </div>
                        </div>
                    </div>
                </Section>

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        size="medium"
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        size="medium"
                        icon={Check}
                        disabled={visitLoading || !formData.patient || !formData.purpose || !formData.type}
                    >
                        {visitLoading ? 'Submitting...' : 'Submit Visit'}
                    </Button>
                </div>
            </form>

            {/* Cancel Confirmation Modal */}
            <Modal
                title="Cancel Visit Creation"
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                size="small"
            >
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Are you sure you want to cancel? Any unsaved changes will be lost.
                    </p>
                    <div className="flex justify-end space-x-3">
                        <Button
                            variant="outline"
                            size="small"
                            onClick={() => setShowCancelModal(false)}
                        >
                            Continue Editing
                        </Button>
                        <Button
                            variant="danger"
                            size="small"
                            onClick={confirmCancel}
                        >
                            Yes, Cancel
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

// Reusable Section Component
const Section = ({ title, children }) => (
    <section className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        {children}
    </section>
);

export default AddVisit;