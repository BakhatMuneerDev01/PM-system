import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Add this import
import { Modal, Button, Input, Title } from './ui/base';
import { User, Phone, User as UserIcon, Check, MapPin, Mail } from 'lucide-react';
import { usePatient } from '../context/PatientContext';
import toast from 'react-hot-toast';

const EditPatientModal = ({ isOpen, onClose, patient }) => {
    const { editPatient } = usePatient();
    const location = useLocation(); // Get current location
    const [loading, setLoading] = useState(false);

    // Determine if we're on the patient details page
    const isPatientDetailsPage = location.pathname.match(/^\/patients\/[^/]+$/);
    const includeBasicDetails = !!isPatientDetailsPage;

    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        address: '',
        dateOfBirth: '',
        emergencyContact: {
            name: '',
            relationship: '',
            phoneNumber: ''
        }
    });

    // Reset form when patient changes or modal opens
    useEffect(() => {
        if (patient) {
            setFormData({
                fullName: patient.fullName || '',
                phoneNumber: patient.phoneNumber || '',
                address: patient.address || '',
                dateOfBirth: patient.dateOfBirth ? new Date(patient.dateOfBirth).toISOString().split('T')[0] : '',
                emergencyContact: {
                    name: patient.emergencyContact?.name || '',
                    relationship: patient.emergencyContact?.relationship || '',
                    phoneNumber: patient.emergencyContact?.phoneNumber || ''
                }
            });
        }
        setLoading(false);
    }, [patient, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith('emergencyContact.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                emergencyContact: {
                    ...prev.emergencyContact,
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const payload = {
                dateOfBirth: formData.dateOfBirth || undefined,
                emergencyContact: {
                    name: formData.emergencyContact.name || undefined,
                    relationship: formData.emergencyContact.relationship || undefined,
                    phoneNumber: formData.emergencyContact.phoneNumber || undefined
                }
            };

            // Include basic details if on patient details page
            if (includeBasicDetails) {
                payload.fullName = formData.fullName || undefined;
                payload.phoneNumber = formData.phoneNumber || undefined;
                payload.address = formData.address || undefined;
            }

            await editPatient(patient._id, payload);
            onClose();
            toast.success('Patient updated successfully');
        } catch (error) {
            console.error('Failed to update patient:', error);
            toast.error('Failed to update patient');
        } finally {
            setLoading(false);
        }
    };

    if (!patient) return null;

    return (
        <Modal
            title="Update Patient Information"
            Icon={UserIcon}
            isOpen={isOpen}
            onClose={onClose}
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Patient Information Section */}
                {includeBasicDetails && (
                    <div className="pb-4">
                        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Full Name"
                                name="fullName"
                                placeholder="Enter patient's full name"
                                value={formData.fullName}
                                onChange={handleChange}
                                icon={User}
                                required
                            />

                            <Input
                                label="Phone Number"
                                name="phoneNumber"
                                type="tel"
                                placeholder="Enter phone number"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                icon={Phone}
                                required
                            />
                        </div>

                        <Input
                            label="Address"
                            name="address"
                            placeholder="Enter full address"
                            value={formData.address}
                            onChange={handleChange}
                            icon={MapPin}
                            required
                        />
                    </div>
                )}

                {/* Date of Birth */}
                <div className="pb-4">
                    <h3 className="text-lg font-semibold mb-4">Personal Details</h3>
                    <Input
                        label="Date of Birth"
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                    />
                </div>

                {/* Emergency Contact Section */}
                <div className="pb-4">
                    <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Full Name"
                            name="emergencyContact.name"
                            placeholder="Enter emergency contact name"
                            value={formData.emergencyContact.name}
                            onChange={handleChange}
                            icon={User}
                        />

                        <Input
                            label="Relationship"
                            name="emergencyContact.relationship"
                            placeholder="e.g., Spouse, Parent, Child"
                            value={formData.emergencyContact.relationship}
                            onChange={handleChange}
                        />
                    </div>

                    <Input
                        label="Phone Number"
                        name="emergencyContact.phoneNumber"
                        type="tel"
                        placeholder="Enter phone number"
                        value={formData.emergencyContact.phoneNumber}
                        onChange={handleChange}
                        icon={Phone}
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
                        {loading ? "Saving..." : "Update Patient"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default EditPatientModal;