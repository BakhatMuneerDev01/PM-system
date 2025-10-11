import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, FileText } from 'lucide-react';
import { Button, Title } from '../components/ui/base';
import { usePatient } from '../context/PatientContext';
import { useVisits } from '../context/VisitContext';
import LoadingSpinner from '../components/LoadingSpinner';
import VisitDetailsModal from '../components/VisitDetailsModal';
import { useState } from 'react';

const VisitsList = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { patient, fetchPatientById, loading: patientLoading } = usePatient();
    const { visits, fetchVisitsByPatient, loading: visitsLoading } = useVisits();

    const [selectedVisit, setSelectedVisit] = useState(null);
    const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);

    useEffect(() => {
        if (id) {
            fetchPatientById(id);
            fetchVisitsByPatient(id);
        }
    }, [id]);

    const handleViewVisit = (visit) => {
        setSelectedVisit(visit);
        setIsVisitModalOpen(true);
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (patientLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <Button
                    variant="secondary"
                    size="medium"
                    icon={ArrowLeft}
                    onClick={() => navigate(`/patients/${id}`)}
                >
                    Back to Patient Details
                </Button>

                <div className="flex items-center gap-4">
                    <Title
                        title={`Visit History - ${patient?.fullName || 'Patient'}`}
                        Icon={Calendar}
                    />
                </div>
            </div>

            {/* Patient Info Summary */}
            {patient && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-blue-900">{patient.fullName}</h3>
                            <p className="text-blue-700 text-sm">
                                {patient.phoneNumber} • {patient.address}
                            </p>
                        </div>
                        <span className="text-blue-600 text-sm font-medium">
                            {visits?.length || 0} visits total
                        </span>
                    </div>
                </div>
            )}

            {/* Visits List */}
            <div className="bg-white rounded-lg shadow-lg">
                {visitsLoading ? (
                    <div className="p-8">
                        <LoadingSpinner />
                    </div>
                ) : visits && visits.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                        {visits.map((visit) => (
                            <VisitListItem
                                key={visit._id}
                                visit={visit}
                                onView={() => handleViewVisit(visit)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No Visits Recorded
                        </h3>
                        <p className="text-gray-500 mb-6">
                            No visits have been recorded for this patient yet.
                        </p>
                        <Button
                            variant="primary"
                            onClick={() => navigate(`/patients/${id}/visits/new`)}
                        >
                            Record First Visit
                        </Button>
                    </div>
                )}
            </div>

            {/* Visit Details Modal */}
            <VisitDetailsModal
                visit={selectedVisit}
                isOpen={isVisitModalOpen}
                onClose={() => setIsVisitModalOpen(false)}
            />
        </div>
    );
};

// Visit List Item Component
const VisitListItem = ({ visit, onView }) => {
    const truncateText = (text, maxLength = 100) => {
        if (!text) return '—';
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    const getVisitTypeColor = (type) => {
        switch (type) {
            case 'Emergency':
                return 'bg-red-100 text-red-800';
            case 'Initial Consultation':
                return 'bg-blue-100 text-blue-800';
            case 'Routine Check-up':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="p-6 hover:bg-gray-50 transition-colors duration-150">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getVisitTypeColor(visit.type)}`}>
                            {visit.type || '—'}
                        </span>
                        <span className="text-sm text-gray-500">
                            {visit.date ? new Date(visit.date).toLocaleDateString() : '—'}
                        </span>
                    </div>

                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        {visit.purpose || '—'}
                    </h4>

                    {visit.summary && (
                        <p className="text-gray-600 mb-3">
                            {truncateText(visit.summary)}
                        </p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        {visit.gpsLocation && (
                            <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>
                                    {visit.gpsLocation.latitude?.toFixed(4)}, {visit.gpsLocation.longitude?.toFixed(4)}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="ml-4 flex-shrink-0">
                    <Button
                        variant="outline"
                        size="small"
                        onClick={onView}
                    >
                        View Details
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default VisitsList;