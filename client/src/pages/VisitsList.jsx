import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Plus, Trash2, AlertTriangle, Eye, Edit, MapPin } from 'lucide-react';
import { Button, Title, Modal } from '../components/ui/base';
import { usePatient } from '../context/PatientContext';
import { useVisits } from '../context/VisitContext';
import LoadingSpinner from '../components/LoadingSpinner';
import VisitDetailsModal from '../components/VisitDetailsModal';
import EditVisitModal from '../components/EditVisitModal';
import Pagination from '../utils/Pagination';

const VisitsList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { patient, fetchPatientById, loading: patientLoading } = usePatient();
  const { visits, fetchVisitsByPatient, removeVisit, removeAllVisitsForPatient, loading: visitsLoading } = useVisits();

  const [selectedVisit, setSelectedVisit] = useState(null);
  const [editingVisit, setEditingVisit] = useState(null);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const visitsPerPage = 5;

  useEffect(() => {
    if (id) {
      fetchPatientById(id);
      fetchVisitsByPatient(id);
    }
  }, [id]);

  // Calculate pagination values
  const totalVisits = visits?.length || 0;
  const totalPages = Math.ceil(totalVisits / visitsPerPage);
  const currentVisits = visits?.slice(
    (currentPage - 1) * visitsPerPage,
    currentPage * visitsPerPage
  ) || [];

  const handleViewVisit = (visit) => {
    setSelectedVisit(visit);
    setIsVisitModalOpen(true);
  };

  const handleEditVisit = (visit) => {
    setEditingVisit(visit);
    setIsEditModalOpen(true);
  };

  const handleDeleteVisit = async (visitId) => {
    if (window.confirm('Are you sure you want to delete this visit?')) {
      await removeVisit(visitId);
      // Reset to first page if current page becomes empty
      if (currentVisits.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleDeleteAllVisits = async () => {
    await removeAllVisitsForPatient(id);
    setIsDeleteAllModalOpen(false);
    setCurrentPage(1);
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
              {totalVisits} visits total
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="primary"
          size="medium"
          icon={Plus}
          onClick={() => navigate(`/patients/${id}/visits/new`)}
        >
          Add New Visit
        </Button>

        {totalVisits > 0 && (
          <Button
            variant="danger"
            size="medium"
            icon={Trash2}
            onClick={() => setIsDeleteAllModalOpen(true)}
          >
            Delete All Visits
          </Button>
        )}
      </div>

      {/* Visits List */}
      <div className="bg-white rounded-lg shadow-lg">
        {visitsLoading ? (
          <div className="p-8">
            <LoadingSpinner />
          </div>
        ) : currentVisits && currentVisits.length > 0 ? (
          <>
            <div className="divide-y divide-gray-200">
              {currentVisits.map((visit) => (
                <VisitListItem
                  key={visit._id}
                  visit={visit}
                  onView={() => handleViewVisit(visit)}
                  onEdit={() => handleEditVisit(visit)}
                  onDelete={() => handleDeleteVisit(visit._id)}
                />
              ))}
            </div>

            {/* Pagination - Only show if more than 5 visits */}
            {totalVisits > visitsPerPage && (
              <div className="border-t">
                <Pagination
                  from={(currentPage - 1) * visitsPerPage + 1}
                  to={Math.min(currentPage * visitsPerPage, totalVisits)}
                  total={totalVisits}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPrevious={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  onNext={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            )}
          </>
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
              icon={Plus}
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
        onEdit={() => {
          setIsVisitModalOpen(false);
          handleEditVisit(selectedVisit);
        }}
        onDelete={() => {
          setIsVisitModalOpen(false);
          handleDeleteVisit(selectedVisit._id);
        }}
      />

      {/* Edit Visit Modal */}
      <EditVisitModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        visit={editingVisit}
        patientId={id}
      />

      {/* Delete All Confirmation Modal */}
      <Modal
        title="Delete All Visits"
        Icon={AlertTriangle}
        isOpen={isDeleteAllModalOpen}
        onClose={() => setIsDeleteAllModalOpen(false)}
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
              <span className="text-red-800 font-medium">Warning</span>
            </div>
            <p className="text-red-700 text-sm mt-2">
              This action will permanently delete all {totalVisits} visits for {patient?.fullName}. This cannot be undone.
            </p>
          </div>

          <p className="text-gray-600">
            Are you sure you want to delete all visits for this patient?
          </p>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              size="small"
              onClick={() => setIsDeleteAllModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="small"
              icon={Trash2}
              onClick={handleDeleteAllVisits}
            >
              Delete All Visits
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Visit List Item Component
const VisitListItem = ({ visit, onView, onEdit, onDelete }) => {
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

        <div className="ml-4">
          <Button
            variant="outline"
            size="small"
            icon={Eye}
            onClick={onView}
          >
            View
          </Button>
          {/* <Button
            variant="ghost"
            size="small"
            icon={Edit}
            onClick={onEdit}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="small"
            icon={Trash2}
            onClick={onDelete}
          >
            Delete
          </Button> */}
        </div>
      </div>
    </div>
  );
};

export default VisitsList;