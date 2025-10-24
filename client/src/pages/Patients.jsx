import { useEffect, useState } from "react";
import { Check, Edit, Eye, RefreshCcw, User, Users, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input, Button, Title, Modal } from '../components/ui/base';
import { usePatient } from "../context/PatientContext";
import LoadingSpinner from "../components/LoadingSpinner";
import Pagination from "../utils/Pagination";
import EditPatientModal from "../components/EditPatientModal";

const Patients = () => {
  const {
    patients,
    loading,
    fetchPatients,
    addPatient,
  } = usePatient();

  const navigate = useNavigate();

  // Local state
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("fullName");
  const [editingPatient, setEditingPatient] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
  });

  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPatients: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10
  });

  // Fetch patients on load + whenever search/sort/page changes
  useEffect(() => {
    fetchPatientsWithPagination();
  }, [search, sortBy, pagination.currentPage]);

  const fetchPatientsWithPagination = async () => {
    try {
      const params = {
        search,
        sortBy,
        page: pagination.currentPage,
        limit: pagination.limit
      };
      const result = await fetchPatients(params);

      if (result && result.pagination) {
        setPagination(result.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch patients:', error);
    }
  };

  const handleAddPatient = async () => {
    await addPatient(newPatient);
    setNewPatient({ fullName: "", phoneNumber: "", address: "" });
    setIsModalOpen(false);
    fetchPatientsWithPagination();
  };

  const openEdit = (patient) => {
    setEditingPatient(patient);
    setIsEditOpen(true);
  };

  const closeEdit = () => {
    setEditingPatient(null);
    setIsEditOpen(false);
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({
      ...prev,
      currentPage: newPage
    }));
  };

  const handlePreviousPage = () => {
    if (pagination.hasPrevPage) {
      setPagination(prev => ({
        ...prev,
        currentPage: prev.currentPage - 1
      }));
    }
  };

  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      setPagination(prev => ({
        ...prev,
        currentPage: prev.currentPage + 1
      }));
    }
  };

  // Reset to page 1 when search or sort changes
  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
  }, [search, sortBy]);

  const columns = [
    { key: "fullName", name: "Full Name" },
    { key: "phoneNumber", name: "Phone Number" },
    { key: "address", name: "Address" },
    { key: "lastVisit", name: "Last Visit" },
    { key: "actions", name: "Actions" },
  ];

  return (
    <div className="max-w-6xl w-full mx-auto p-4 md:p-6">
      {/* Button for adding a new patient */}
      {/* Button for adding a new patient - Icon-only on mobile */}
      <div className="flex justify-end md:mb-6 sm:justify-end mb-4">
        <Button
          variant="primary"
          size="medium"
          icon={User}
          onClick={() => setIsModalOpen(true)}
          title="Add Patient"
        >
          <span className="flex items-center justify-center gap-2">
            <span className="md:inline">Add Patient</span>
          </span>
        </Button>
      </div>

      <div className="flex flex-col bg-white p-4 md:p-6 rounded-lg shadow-lg min-h-[500px]">
        <div className="flex-1">
          {/* Title, Search, Sort, Refresh */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 md:mb-6">
            <Title title="My Patients" Icon={Users} active="true" className="text-xl md:text-2xl" />
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
              <Input
                placeholder="Search by name or phone"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:flex-1 md:w-64"
              />
              <div className="flex gap-2">
                {/* Enhanced Sort Dropdown */}
                <div className="relative flex-1">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full appearance-none p-2 pr-8 text-gray-700 text-sm outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="fullName">Sort by Name</option>
                    <option value="lastVisit">Sort by Last Visit</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </div>

                {/* Refresh Button with consistent icon */}
                <Button
                  variant="outline"
                  size="small"
                  onClick={fetchPatientsWithPagination}
                  className="px-3 flex items-center justify-center"
                >
                  <RefreshCcw className="w-4 h-4" />
                  <span className="hidden md:inline ml-2">Refresh</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Table Content */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <table className="w-full bg-white shadow text-left">
                  <thead className="bg-gray-100">
                    <tr>
                      {columns.map(({ key, name }) => (
                        <th
                          key={key}
                          className="py-3 px-4 text-sm text-gray-600 uppercase"
                        >
                          {name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {patients && patients.length > 0 ? (
                      patients.map((patient) => (
                        <tr key={patient._id} className="border-t border-gray-300 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-500">
                            {patient.fullName}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-500">
                            {patient.phoneNumber}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-500">
                            {patient.address}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-500">
                            {patient.lastVisit
                              ? new Date(patient.lastVisit).toLocaleDateString()
                              : "—"}
                          </td>
                          <td className="py-3 px-4 text-sm text-blue-600 flex items-center justify-start gap-3">
                            <button
                              onClick={() => navigate(`/patients/${patient._id}`)}
                              className="p-1 hover:bg-blue-50 rounded transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              title="Edit extra info"
                              onClick={() => openEdit(patient)}
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={columns.length} className="py-8 text-center text-gray-500">
                          No patients found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-3">
                {patients && patients.length > 0 ? (
                  patients.map((patient) => (
                    <div key={patient._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-gray-900 text-lg">{patient.fullName}</h3>
                          <div className="flex gap-2">
                            <button
                              onClick={() => navigate(`/patients/${patient._id}`)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openEdit(patient)}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Phone:</span>
                            <span className="text-gray-900">{patient.phoneNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Address:</span>
                            <span className="text-gray-900 text-right flex-1 ml-2">{patient.address}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Last Visit:</span>
                            <span className="text-gray-900">
                              {patient.lastVisit
                                ? new Date(patient.lastVisit).toLocaleDateString()
                                : "—"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No patients found
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Pagination Controls - Always rendered when there are patients */}
        {pagination.totalPatients > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <Pagination
              from={(pagination.currentPage - 1) * pagination.limit + 1}
              to={Math.min(pagination.currentPage * pagination.limit, pagination.totalPatients)}
              total={pagination.totalPatients}
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPrevious={handlePreviousPage}
              onNext={handleNextPage}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* Add Patient Modal */}
      <Modal
        title="Add New Patient"
        Icon={User}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="Enter patient's full name"
            value={newPatient.fullName}
            onChange={(e) =>
              setNewPatient({ ...newPatient, fullName: e.target.value })
            }
          />
          <Input
            label="Phone Number"
            type="phone"
            placeholder="Enter patient's phone number"
            value={newPatient.phoneNumber}
            onChange={(e) =>
              setNewPatient({ ...newPatient, phoneNumber: e.target.value })
            }
          />
          <Input
            label="Address"
            type="text"
            placeholder="Enter full address"
            value={newPatient.address}
            onChange={(e) =>
              setNewPatient({ ...newPatient, address: e.target.value })
            }
          />
          <div className="flex flex-col sm:flex-row justify-end gap-2">
            <Button
              variant="outline"
              size="small"
              onClick={() => setIsModalOpen(false)}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="small"
              icon={Check}
              onClick={handleAddPatient}
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              Save Patient
            </Button>
          </div>
        </div>
      </Modal>

      <EditPatientModal isOpen={isEditOpen} onClose={closeEdit} patient={editingPatient} />
    </div>
  );
};

export default Patients;