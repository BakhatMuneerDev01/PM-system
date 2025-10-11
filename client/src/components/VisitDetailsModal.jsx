// src/components/VisitDetailsModal.jsx
import React from 'react';
import { Modal, Title } from './ui/base';
import { Calendar, MapPin, FileText } from 'lucide-react';

const VisitDetailsModal = ({ visit, isOpen, onClose }) => {
    if (!visit) return null;

    return (
        <Modal
            title="Visit Details"
            Icon={FileText}
            isOpen={isOpen}
            onClose={onClose}
            size="lg"
        >
            <div className="space-y-6">
                {/* Visit Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <div>
                            <p className="text-sm text-gray-600">Date</p>
                            <p className="font-medium">
                                {new Date(visit.date).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Type</p>
                        <p className="font-medium capitalize">{visit.type}</p>
                    </div>
                </div>

                {/* Purpose */}
                <div>
                    <p className="text-sm text-gray-600 mb-2">Purpose</p>
                    <p className="font-medium">{visit.purpose}</p>
                </div>

                {/* Summary */}
                {visit.summary && (
                    <div>
                        <p className="text-sm text-gray-600 mb-2">Summary</p>
                        <p className="text-gray-700">{visit.summary}</p>
                    </div>
                )}

                {/* GPS Location */}
                {visit.gpsLocation && (
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <div>
                            <p className="text-sm text-gray-600">Location</p>
                            <p className="text-sm">
                                {visit.gpsLocation.latitude}, {visit.gpsLocation.longitude}
                            </p>
                        </div>
                    </div>
                )}

                {/* Visit Notes */}
                {visit.notes && (
                    <div className="border-t pt-4">
                        <h4 className="font-semibold mb-3">Clinical Notes</h4>
                        {visit.notes.observations && (
                            <div className="mb-3">
                                <p className="text-sm text-gray-600 mb-1">Observations</p>
                                <p className="text-gray-700">{visit.notes.observations}</p>
                            </div>
                        )}
                        {visit.notes.treatmentNotes && (
                            <div className="mb-3">
                                <p className="text-sm text-gray-600 mb-1">Treatment</p>
                                <p className="text-gray-700">{visit.notes.treatmentNotes}</p>
                            </div>
                        )}
                        {visit.notes.followUpInstructions && (
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Follow-up</p>
                                <p className="text-gray-700">{visit.notes.followUpInstructions}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default VisitDetailsModal;