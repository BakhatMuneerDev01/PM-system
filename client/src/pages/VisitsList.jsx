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

  // Color mapping for visit types (matching Dashboard)
  const getVisitTypeConfig = (type) => {
    switch (type) {
      case 'Emergency':
        return {
          bg: 'bg-red-50 border-red-200',
          badge: 'bg-red-100 text-red-800 border-red-300',
          accent: 'border-l-red-400'
        };
      case 'Initial Consultation':
        return {
          bg: 'bg-blue-50 border-blue-200',
          badge: 'bg-blue-100 text-blue-800 border-blue-300',
          accent: 'border-l-blue-400'
        };
      case 'Routine Check-up':
        return {
          bg: 'bg-green-50 border-green-200',
          badge: 'bg-green-100 text-green-800 border-green-300',
          accent: 'border-l-green-400'
        };
      case 'Follow-up':
        return {
          bg: 'bg-purple-50 border-purple-200',
          badge: 'bg-purple-100 text-purple-800 border-purple-300',
          accent: 'border-l-purple-400'
        };
      default:
        return {
          bg: 'bg-gray-50 border-gray-200',
          badge: 'bg-gray-100 text-gray-800 border-gray-300',
          accent: 'border-l-gray-400'
        };
    }
  };

  if (patientLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* Header - Responsive stacking */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Button
            variant="secondary"
            size="medium"
            icon={ArrowLeft}
            onClick={() => navigate(`/patients/${id}`)}
          >
            Back to Patient Details
          </Button>

          <div className="flex items-center justify-center sm:justify-start">
            <Title
              title={`Visit History - ${patient?.fullName || 'Patient'}`}
              Icon={Calendar}
              className="text-xl md:text-2xl"
            />
          </div>
        </div>

        {/* Patient Info Summary - Responsive */}
        {patient && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="text-center sm:text-left">
                <h3 className="font-semibold text-blue-900 text-lg">{patient.fullName}</h3>
                <p className="text-blue-700 text-sm">
                  {patient.phoneNumber} • {patient.address}
                </p>
              </div>
              <span className="text-blue-600 text-sm font-medium text-center sm:text-right">
                {totalVisits} visits total
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons - Responsive stacking */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6">
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
              {currentVisits.map((visit) => {
                const config = getVisitTypeConfig(visit.type);
                return (
                  <VisitListItem
                    key={visit._id}
                    visit={visit}
                    config={config}
                    onView={() => handleViewVisit(visit)}
                    onEdit={() => handleEditVisit(visit)}
                    onDelete={() => handleDeleteVisit(visit._id)}
                  />
                );
              })}
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
              className="w-full sm:w-auto justify-center"
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

          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
            <Button
              variant="outline"
              size="small"
              onClick={() => setIsDeleteAllModalOpen(false)}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="small"
              icon={Trash2}
              onClick={handleDeleteAllVisits}
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              Delete All Visits
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Visit List Item Component - Fully responsive
const VisitListItem = ({ visit, config, onView, onEdit, onDelete }) => {
  const truncateText = (text, maxLength = 100) => {
    if (!text) return '—';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div className={`border-l-4 ${config.accent} ${config.bg} border p-4 md:p-6 hover:bg-gray-50 transition-colors duration-150`}>
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${config.badge} self-start`}>
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
            <p className="text-gray-600 mb-3 text-sm">
              {truncateText(visit.summary)}
            </p>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-500">
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

        <div className="flex flex-row justify-start lg:justify-end gap-2">
          <Button
            variant="outline"
            size="small"
            icon={Eye}
            onClick={onView}
            className="flex-1 sm:flex-none justify-center cursor-pointer"
          >
            <span className="hidden sm:inline">View</span>
          </Button>

          {/* Edit and Delete buttons - hidden on md and above, visible on mobile */}
          <div className="md:hidden flex gap-2">
            <Button
              variant="ghost"
              size="small"
              icon={Edit}
              onClick={onEdit}
              className="flex-1 sm:flex-none justify-center cursor-pointer"
            >
              <span className="hidden sm:inline">Edit</span>
            </Button>
            <Button
              variant="danger"
              size="small"
              icon={Trash2}
              onClick={onDelete}
              className="flex-1 sm:flex-none justify-center cursor-pointer"
            >
              <span className="hidden sm:inline">Delete</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitsList;