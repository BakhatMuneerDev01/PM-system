import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Title } from './ui/base';
import { Calendar, MapPin, FileText, Check } from 'lucide-react';
import { useVisits } from '../context/VisitContext';
import toast from 'react-hot-toast';

const EditVisitModal = ({ isOpen, onClose, visit, patientId }) => {
    const { editVisit, loading } = useVisits();

    const [formData, setFormData] = useState({
        date: '',
        purpose: '',
        summary: '',
        type: '',
        gpsLocation: {
            latitude: '',
            longitude: ''
        }
    });

    useEffect(() => {
        if (visit) {
            const visitDate = new Date(visit.date);
            setFormData({
                date: visitDate.toISOString().split('T')[0],
                purpose: visit.purpose || '',
                summary: visit.summary || '',
                type: visit.type || '',
                gpsLocation: {
                    latitude: visit.gpsLocation?.latitude?.toString() || '',
                    longitude: visit.gpsLocation?.longitude?.toString() || ''
                }
            });
        }
    }, [visit, isOpen]);

    const handleChange = (e) => {
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

        if (!formData.purpose || !formData.type) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            const visitData = {
                date: new Date(formData.date).toISOString(),
                purpose: formData.purpose,
                summary: formData.summary,
                type: formData.type,
                gpsLocation: formData.gpsLocation.latitude && formData.gpsLocation.longitude ? {
                    latitude: parseFloat(formData.gpsLocation.latitude),
                    longitude: parseFloat(formData.gpsLocation.longitude)
                } : undefined
            };

            await editVisit(visit._id, visitData);
            onClose();
        } catch (error) {
            console.error('Failed to update visit:', error);
        }
    };

    const visitTypes = [
        'Initial Consultation',
        'Follow-up',
        'Emergency',
        'Routine Check-up'
    ];

    if (!visit) return null;

    return (
        <Modal
            title="Edit Visit"
            Icon={FileText}
            isOpen={isOpen}
            onClose={onClose}
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Visit Date */}
                <Input
                    label="Date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    icon={Calendar}
                />

                {/* Visit Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Visit Type *
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                        {visitTypes.map((type) => (
                            <div key={type} className="flex items-center space-x-3">
                                <input
                                    type="radio"
                                    id={`type-${type}`}
                                    name="type"
                                    value={type}
                                    checked={formData.type === type}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                    required
                                />
                                <label htmlFor={`type-${type}`} className="text-sm font-medium text-gray-700">
                                    {type}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Purpose */}
                <Input
                    label="Purpose *"
                    name="purpose"
                    placeholder="Enter the purpose of this visit"
                    value={formData.purpose}
                    onChange={handleChange}
                    required
                />

                {/* GPS Location */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        GPS Location
                    </label>
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
                </div>

                {/* Summary */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Summary
                    </label>
                    <textarea
                        name="summary"
                        value={formData.summary}
                        onChange={handleChange}
                        placeholder="Enter visit summary..."
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        size="small"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        size="small"
                        icon={Check}
                        disabled={loading}
                    >
                        {loading ? "Updating..." : "Update Visit"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default EditVisitModal;