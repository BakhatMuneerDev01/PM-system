import React, { useState, useEffect } from 'react';
import {
    Calendar, Filter, Search, Plus, Clock, MapPin, User,
    AlertCircle, Stethoscope, Activity, ChevronDown, ChevronUp
} from 'lucide-react';
import { Title, Button, Input } from '../components/ui/base';
import { useVisits } from '../context/VisitContext';
import { usePatient } from '../context/PatientContext';
import LoadingSpinner from '../components/LoadingSpinner';
import VisitDetailsModal from '../components/VisitDetailsModal';
import EditVisitModal from '../components/EditVisitModal';

const VisitsPage = () => {
    const { visits, fetchVisitsByPatient, loading } = useVisits();
    const { patients, fetchPatients } = usePatient();

    const [allVisits, setAllVisits] = useState([]);
    const [filteredVisits, setFilteredVisits] = useState([]);
    const [selectedVisit, setSelectedVisit] = useState(null);
    const [editingVisit, setEditingVisit] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Filter states
    const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'previous'
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [selectedPatient, setSelectedPatient] = useState('all');
    const [dateRange, setDateRange] = useState('all'); // 'today', 'week', 'month', 'all'
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        loadAllVisits();
    }, []);

    const loadAllVisits = async () => {
        try {
            await fetchPatients({ page: 1, limit: 100 });

            // Load visits for all patients
            if (patients && patients.length > 0) {
                const allVisitsData = [];
                for (const patient of patients.slice(0, 50)) { // Limit for performance
                    try {
                        const visitsData = await fetchVisitsByPatient(patient._id);
                        if (visitsData && visitsData.length > 0) {
                            const visitsWithPatient = visitsData.map(visit => ({
                                ...visit,
                                patientName: patient.fullName,
                                patientPhone: patient.phoneNumber,
                                patientId: patient._id
                            }));
                            allVisitsData.push(...visitsWithPatient);
                        }
                    } catch (error) {
                        console.log(`Error loading visits for patient ${patient.fullName}:`, error);
                    }
                }
                setAllVisits(allVisitsData);
            }
        } catch (error) {
            console.error('Error loading visits:', error);
        }
    };

    useEffect(() => {
        filterVisits();
    }, [allVisits, activeTab, searchTerm, selectedType, selectedPatient, dateRange]);

    const filterVisits = () => {
        let filtered = [...allVisits];

        // Filter by tab (upcoming vs previous)
        const now = new Date();
        if (activeTab === 'upcoming') {
            filtered = filtered.filter(visit => new Date(visit.date) > now);
        } else {
            filtered = filtered.filter(visit => new Date(visit.date) <= now);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(visit =>
                visit.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                visit.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
                visit.type.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by visit type
        if (selectedType !== 'all') {
            filtered = filtered.filter(visit => visit.type === selectedType);
        }

        // Filter by patient
        if (selectedPatient !== 'all') {
            filtered = filtered.filter(visit => visit.patientId === selectedPatient);
        }

        // Filter by date range
        if (dateRange !== 'all') {
            const today = new Date();
            const startOfDay = new Date(today.setHours(0, 0, 0, 0));
            const endOfDay = new Date(today.setHours(23, 59, 59, 999));

            if (dateRange === 'today') {
                filtered = filtered.filter(visit => {
                    const visitDate = new Date(visit.date);
                    return visitDate >= startOfDay && visitDate <= endOfDay;
                });
            } else if (dateRange === 'week') {
                const startOfWeek = new Date(today);
                startOfWeek.setDate(today.getDate() - today.getDay());
                startOfWeek.setHours(0, 0, 0, 0);

                filtered = filtered.filter(visit => {
                    const visitDate = new Date(visit.date);
                    return visitDate >= startOfWeek && visitDate <= endOfDay;
                });
            } else if (dateRange === 'month') {
                const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

                filtered = filtered.filter(visit => {
                    const visitDate = new Date(visit.date);
                    return visitDate >= startOfMonth && visitDate <= endOfDay;
                });
            }
        }

        // Sort visits
        filtered.sort((a, b) => {
            if (activeTab === 'upcoming') {
                return new Date(a.date) - new Date(b.date); // Ascending for upcoming
            } else {
                return new Date(b.date) - new Date(a.date); // Descending for previous
            }
        });

        setFilteredVisits(filtered);
    };

    const handleViewVisit = (visit) => {
        setSelectedVisit(visit);
        setIsDetailsModalOpen(true);
    };

    const handleEditVisit = (visit) => {
        setEditingVisit(visit);
        setIsEditModalOpen(true);
    };

    const handleDeleteVisit = async (visitId) => {
        if (window.confirm('Are you sure you want to delete this visit?')) {
            // Implementation would go here
            console.log('Delete visit:', visitId);
        }
    };

    const getVisitTypeConfig = (type) => {
        switch (type) {
            case 'Emergency':
                return {
                    bg: 'bg-red-50 border-red-200',
                    badge: 'bg-red-100 text-red-800 border-red-300',
                    icon: AlertCircle,
                    iconColor: 'text-red-500',
                    accent: 'border-l-red-400'
                };
            case 'Initial Consultation':
                return {
                    bg: 'bg-blue-50 border-blue-200',
                    badge: 'bg-blue-100 text-blue-800 border-blue-300',
                    icon: Stethoscope,
                    iconColor: 'text-blue-500',
                    accent: 'border-l-blue-400'
                };
            case 'Routine Check-up':
                return {
                    bg: 'bg-green-50 border-green-200',
                    badge: 'bg-green-100 text-green-800 border-green-300',
                    icon: Activity,
                    iconColor: 'text-green-500',
                    accent: 'border-l-green-400'
                };
            case 'Follow-up':
                return {
                    bg: 'bg-purple-50 border-purple-200',
                    badge: 'bg-purple-100 text-purple-800 border-purple-300',
                    icon: Calendar,
                    iconColor: 'text-purple-500',
                    accent: 'border-l-purple-400'
                };
            default:
                return {
                    bg: 'bg-gray-50 border-gray-200',
                    badge: 'bg-gray-100 text-gray-800 border-gray-300',
                    icon: Calendar,
                    iconColor: 'text-gray-500',
                    accent: 'border-l-gray-400'
                };
        }
    };

    const getVisitStats = () => {
        const now = new Date();
        const upcoming = allVisits.filter(visit => new Date(visit.date) > now).length;
        const previous = allVisits.filter(visit => new Date(visit.date) <= now).length;
        const today = allVisits.filter(visit => {
            const visitDate = new Date(visit.date);
            const today = new Date();
            return visitDate.toDateString() === today.toDateString();
        }).length;

        return { upcoming, previous, today };
    };

    const stats = getVisitStats();

    if (loading && allVisits.length === 0) {
        return <LoadingSpinner />;
    }

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Title title="Visit Schedule" Icon={Calendar} className="text-3xl mb-2" />
                    <p className="text-gray-600">Manage and view all patient visits in one place</p>
                </div>
                <Button
                    variant="primary"
                    size="medium"
                    icon={Plus}
                    onClick={() => window.location.href = '/patients'}
                >
                    Schedule New Visit
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Upcoming Visits"
                    value={stats.upcoming}
                    description="Scheduled for future dates"
                    color="blue"
                    icon={Calendar}
                />
                <StatCard
                    title="Previous Visits"
                    value={stats.previous}
                    description="Completed visits"
                    color="green"
                    icon={Clock}
                />
                <StatCard
                    title="Today's Visits"
                    value={stats.today}
                    description="Scheduled for today"
                    color="purple"
                    icon={Calendar}
                />
            </div>

            {/* Tabs and Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                {/* Tabs */}
                <div className="flex space-x-1 mb-6">
                    <TabButton
                        active={activeTab === 'upcoming'}
                        onClick={() => setActiveTab('upcoming')}
                        count={stats.upcoming}
                    >
                        Upcoming Visits
                    </TabButton>
                    <TabButton
                        active={activeTab === 'previous'}
                        onClick={() => setActiveTab('previous')}
                        count={stats.previous}
                    >
                        Previous Visits
                    </TabButton>
                </div>

                {/* Search and Filter Bar */}
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <Input
                                placeholder="Search visits by patient, purpose, or type..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        size="medium"
                        icon={showFilters ? ChevronUp : ChevronDown}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        Filters
                    </Button>
                </div>

                {/* Expandable Filters */}
                {showFilters && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Visit Type
                            </label>
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Types</option>
                                <option value="Emergency">Emergency</option>
                                <option value="Initial Consultation">Initial Consultation</option>
                                <option value="Routine Check-up">Routine Check-up</option>
                                <option value="Follow-up">Follow-up</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Patient
                            </label>
                            <select
                                value={selectedPatient}
                                onChange={(e) => setSelectedPatient(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Patients</option>
                                {patients.map(patient => (
                                    <option key={patient._id} value={patient._id}>
                                        {patient.fullName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date Range
                            </label>
                            <select
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Dates</option>
                                <option value="today">Today</option>
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                            </select>
                        </div>
                    </div>
                )}

                {/* Results Count */}
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-600">
                        Showing {filteredVisits.length} {activeTab === 'upcoming' ? 'upcoming' : 'previous'} visits
                    </p>
                    {filteredVisits.length > 0 && (
                        <p className="text-sm text-gray-500">
                            Sorted by {activeTab === 'upcoming' ? 'date (soonest first)' : 'date (most recent first)'}
                        </p>
                    )}
                </div>

                {/* Visits List */}
                <div className="space-y-4">
                    {filteredVisits.length > 0 ? (
                        filteredVisits.map(visit => (
                            <VisitCard
                                key={visit._id}
                                visit={visit}
                                getVisitTypeConfig={getVisitTypeConfig}
                                onView={handleViewVisit}
                                onEdit={handleEditVisit}
                                onDelete={handleDeleteVisit}
                                isUpcoming={activeTab === 'upcoming'}
                            />
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                No {activeTab === 'upcoming' ? 'Upcoming' : 'Previous'} Visits
                            </h3>
                            <p className="text-gray-500 mb-6">
                                {activeTab === 'upcoming'
                                    ? "No upcoming visits match your current filters."
                                    : "No previous visits match your current filters."
                                }
                            </p>
                            <Button
                                variant="primary"
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedType('all');
                                    setSelectedPatient('all');
                                    setDateRange('all');
                                }}
                            >
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <VisitDetailsModal
                visit={selectedVisit}
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                onEdit={handleEditVisit}
                onDelete={handleDeleteVisit}
            />

            <EditVisitModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                visit={editingVisit}
                patientId={editingVisit?.patientId}
            />
        </div>
    );
};

// Stat Card Component
const StatCard = ({ title, value, description, color, icon: Icon }) => {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600'
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    <p className="text-sm text-gray-500 mt-1">{description}</p>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
};

// Tab Button Component
const TabButton = ({ active, onClick, count, children }) => (
    <button
        onClick={onClick}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${active
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
    >
        <span>{children}</span>
        <span className={`px-2 py-1 text-xs rounded-full ${active ? 'bg-blue-400' : 'bg-gray-200'
            }`}>
            {count}
        </span>
    </button>
);

// Visit Card Component
const VisitCard = ({ visit, getVisitTypeConfig, onView, onEdit, onDelete, isUpcoming }) => {
    const config = getVisitTypeConfig(visit.type);
    const IconComponent = config.icon;
    const visitDate = new Date(visit.date);
    const isToday = visitDate.toDateString() === new Date().toDateString();

    const getTimeStatus = () => {
        if (!isUpcoming) return null;

        const now = new Date();
        const timeDiff = visitDate - now;
        const hoursDiff = timeDiff / (1000 * 60 * 60);

        if (isToday) {
            return { text: 'Today', color: 'text-green-600 bg-green-100' };
        } else if (hoursDiff <= 24) {
            return { text: 'Tomorrow', color: 'text-blue-600 bg-blue-100' };
        } else if (hoursDiff <= 168) { // 7 days
            return { text: 'This week', color: 'text-purple-600 bg-purple-100' };
        }
        return null;
    };

    const timeStatus = getTimeStatus();

    return (
        <div className={`border-l-4 ${config.accent} ${config.bg} border rounded-lg p-6 hover:shadow-md transition-all duration-200`}>
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${config.badge} border`}>
                            <IconComponent className={`w-4 h-4 ${config.iconColor}`} />
                            <span className="text-sm font-medium">{visit.type}</span>
                        </div>

                        {timeStatus && (
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${timeStatus.color}`}>
                                {timeStatus.text}
                            </span>
                        )}

                        {isToday && isUpcoming && (
                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                                Today
                            </span>
                        )}
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {visit.purpose}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <User className="w-4 h-4 text-gray-400" />
                            <div>
                                <p className="font-medium text-gray-900">{visit.patientName}</p>
                                <p className="text-gray-500">{visit.patientPhone}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <div>
                                <p className="font-medium text-gray-900">
                                    {visitDate.toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </p>
                                <p className="text-gray-500">
                                    {visitDate.toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {visit.summary && (
                        <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                            {visit.summary}
                        </p>
                    )}

                    {visit.gpsLocation && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MapPin className="w-4 h-4" />
                            <span>
                                {visit.gpsLocation.latitude?.toFixed(4)}, {visit.gpsLocation.longitude?.toFixed(4)}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex lg:flex-col gap-2">
                    <Button
                        variant="outline"
                        size="small"
                        onClick={() => onView(visit)}
                    >
                        View
                    </Button>``
                </div>
            </div>
        </div>
    );
};

export default VisitsPage;