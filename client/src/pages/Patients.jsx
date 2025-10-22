import { useEffect, useState } from "react";
import { Check, Edit, Eye, RefreshCcw, User, Users } from "lucide-react";
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

  // Pagination state - FIXED: Use actual pagination data from API
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPatients: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10
  });

  // Fetch patients on load + whenever search/sort/page changes - FIXED
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
    // Refresh the list to show the new patient
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

  // Handle page changes - FIXED
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

  // Reset to page 1 when search or sort changes - FIXED
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
    <div className="max-w-6xl w-full mx-auto text-right">
      {/* Button for adding a new patient */}
      <Button
        variant="primary"
        size="medium"
        icon={User}
        onClick={() => setIsModalOpen(true)}
      >
        Add Patient
      </Button>

      <div className="flex flex-col justify-between bg-white px-4 py-6 rounded-lg shadow-lg mt-6 h-[60vh]">
        <div>
          {/* Title, Search, Sort, Refresh */}
          <div className="flex items-center justify-between">
            <Title title="My Patients" Icon={Users} active="true" />
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search by name or phone"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="p-2 text-gray-500 text-sm outline-none"
              >
                <option value="fullName">Sort by Name</option>
                <option value="lastVisit">Sort by Last Visit</option>
              </select>
              <Button
                variant="outline"
                size="small"
                icon={RefreshCcw}
                onClick={fetchPatientsWithPagination}
                className="text-sm text-gray-400"
              >
                Refresh
              </Button>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <LoadingSpinner />
          ) : (
            <table className="w-full bg-white shadow mt-6 text-left">
              <thead className="bg-gray-100">
                <tr>
                  {columns.map(({ key, name }) => (
                    <th
                      key={key}
                      className="py-1.5 px-1 text-sm text-gray-600 uppercase"
                    >
                      {name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {patients && patients.length > 0 ? (
                  patients.map((patient) => (
                    <tr key={patient._id} className="border-t border-gray-300">
                      <td className="py-1.5 px-1 text-sm text-gray-500">
                        {patient.fullName}
                      </td>
                      <td className="py-1.5 px-1 text-sm text-gray-500">
                        {patient.phoneNumber}
                      </td>
                      <td className="py-1.5 px-1 text-sm text-gray-500">
                        {patient.address}
                      </td>
                      <td className="py-1.5 px-1 text-sm text-gray-500">
                        {patient.lastVisit
                          ? new Date(patient.lastVisit).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="py-1.5 px-1 text-sm text-blue-600 cursor-pointer flex items-center justify-start gap-2">
                        <button
                          onClick={() => navigate(`/patients/${patient._id}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          title="Edit extra info"
                          onClick={() => openEdit(patient)}
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="py-4 text-center text-gray-500">
                      No patients found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Controls - FIXED: Use actual pagination data */}
        {pagination.totalPatients > 0 && (
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
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="small"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="small"
              icon={Check}
              onClick={handleAddPatient}
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