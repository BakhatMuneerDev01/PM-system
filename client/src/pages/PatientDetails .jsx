import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  Calendar,
  User as UserIcon,
  Eye,
  Edit
} from 'lucide-react';
import { Button, Title } from '../components/ui/base';
import { usePatient } from '../context/PatientContext';
import { useVisits } from '../context/VisitContext';
import LoadingSpinner from '../components/LoadingSpinner';
import VisitDetailsModal from '../components/VisitDetailsModal';
import EditPatientModal from '../components/EditPatientModal';
import EditVisitModal from '../components/EditVisitModal';
import toast from 'react-hot-toast';

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { patient, fetchPatientById, loading: patientLoading } = usePatient();
  const { visits, fetchVisitsByPatient, removeVisit, loading: visitsLoading } = useVisits();

  const [selectedVisit, setSelectedVisit] = useState(null);
  const [editingVisit, setEditingVisit] = useState(null);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [isEditPatientModalOpen, setIsEditPatientModalOpen] = useState(false);
  const [isEditVisitModalOpen, setIsEditVisitModalOpen] = useState(false);

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

  const handleEditPatient = () => {
    setIsEditPatientModalOpen(true);
  };

  const handleEditVisit = (visit) => {
    setIsVisitModalOpen(false); // Close details modal
    setEditingVisit(visit);
    setIsEditVisitModalOpen(true);
  };

  const handleDeleteVisit = async (visitId) => {
    try {
      await removeVisit(visitId);
      setIsVisitModalOpen(false);
      // Refresh visits after deletion
      await fetchVisitsByPatient(id);
      toast.success('Visit deleted successfully');
    } catch (error) {
      toast.error('Failed to delete visit');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (patientLoading) {
    return <LoadingSpinner />;
  }

  if (!patient) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center">
          <Title title="Patient Not Found" />
          <Button
            variant="primary"
            onClick={() => navigate('/patients')}
            className="mt-4"
          >
            Back to Patients
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="secondary"
          size="medium"
          icon={ArrowLeft}
          onClick={() => navigate('/patients')}
        >
          Back to Patients
        </Button>

        <Button
          variant="primary"
          size="medium"
          icon={Edit}
          onClick={handleEditPatient}
        >
          Update Patient Details
        </Button>
      </div>

      {/* Patient Information Card */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <Title
          title="Patient Details"
          Icon={UserIcon}
          className="mb-6"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Basic Information
            </h3>

            <InfoRow
              icon={UserIcon}
              label="Full Name"
              value={patient.fullName}
            />

            <InfoRow
              icon={Phone}
              label="Phone Number"
              value={patient.phoneNumber}
            />

            <InfoRow
              icon={MapPin}
              label="Address"
              value={patient.address}
            />

            <InfoRow
              icon={Calendar}
              label="Date of Birth"
              value={formatDate(patient.dateOfBirth)}
            />
          </div>

          {/* Emergency Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Emergency Contact
            </h3>

            {patient.emergencyContact ? (
              <>
                <InfoRow
                  icon={User}
                  label="Name"
                  value={patient.emergencyContact.name}
                />

                <InfoRow
                  label="Relationship"
                  value={patient.emergencyContact.relationship}
                />

                <InfoRow
                  icon={Phone}
                  label="Phone Number"
                  value={patient.emergencyContact.phoneNumber}
                />
              </>
            ) : (
              <p className="text-gray-500 italic">No emergency contact information</p>
            )}
          </div>
        </div>
      </div>

      {/* Visit History Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <Title
            title="Visit History"
            className="text-xl"
          />
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {visits?.length || 0} visits total
            </span>
            <Button
              variant="primary"
              size="medium"
              onClick={() => navigate(`/patients/${id}/visits/new`)}
            >
              Record New Visit
            </Button>
          </div>
        </div>

        {visitsLoading ? (
          <LoadingSpinner />
        ) : visits && visits.length > 0 ? (
          <>
            {/* Show only first 3 visits */}
            <div className="space-y-4 mb-6">
              {visits.slice(0, 3).map((visit) => (
                <VisitPreviewItem
                  key={visit._id}
                  visit={visit}
                  onView={() => handleViewVisit(visit)}
                />
              ))}
            </div>

            {/* Show "View All Visits" button if there are more than 3 visits */}
            {visits.length > 3 && (
              <div className="pt-4">
                <Button
                  variant="outline"
                  size="medium"
                  className="w-full"
                  onClick={() => navigate(`/patients/${id}/visits`)}
                >
                  View All {visits.length} Visits
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No visits recorded yet</p>
            <Button
              variant="primary"
              size="medium"
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
        onEdit={handleEditVisit}
        onDelete={handleDeleteVisit}
      />

      {/* Edit Patient Modal */}
      <EditPatientModal
        isOpen={isEditPatientModalOpen}
        onClose={() => setIsEditPatientModalOpen(false)}
        patient={patient}
      />

      {/* Edit Visit Modal */}
      <EditVisitModal
        isOpen={isEditVisitModalOpen}
        onClose={() => setIsEditVisitModalOpen(false)}
        visit={editingVisit}
        patientId={id}
      />
    </div>
  );
};

// Reusable Info Row Component
const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start space-x-3">
    {Icon && <Icon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />}
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-sm text-gray-900 mt-1">{value || '—'}</p>
    </div>
  </div>
);

// Visit Preview Item Component for PatientDetails
const VisitPreviewItem = ({ visit, onView }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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

  const truncateText = (text, maxLength = 80) => {
    if (!text) return '—';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors duration-150">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getVisitTypeColor(visit.type)}`}>
              {visit.type || '—'}
            </span>
            <span className="text-sm text-gray-500">
              {formatDate(visit.date)}
            </span>
          </div>

          <h4 className="font-semibold text-gray-900 mb-1">
            {visit.purpose || '—'}
          </h4>

          {visit.summary && (
            <p className="text-sm text-gray-600 mb-2">
              {truncateText(visit.summary)}
            </p>
          )}
        </div>

        <div className="ml-4 flex-shrink-0">
          <Button
            variant="outline"
            size="small"
            onClick={onView}
          >
            View
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;