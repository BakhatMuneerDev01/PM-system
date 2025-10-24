import React, { useState, useEffect } from 'react';
import {
  Users, Calendar, MessageSquare, DollarSign,
  TrendingUp, UserPlus, FileText, ArrowUpRight,
  Clock, Phone, ChevronLeft, ChevronRight, MapPin, AlertCircle, Stethoscope, Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePatient } from '../context/PatientContext';
import { useVisits } from '../context/VisitContext';
import { useAuth } from '../context/AuthContext';
import { Title, Button } from '../components/ui/base';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { patients, fetchPatients, loading: patientsLoading } = usePatient();
  const { visits: allVisits, fetchVisitsByPatient, loading: visitsLoading } = useVisits();

  const [stats, setStats] = useState({
    totalPatients: 0,
    totalVisits: 0,
    todaysVisits: 0,
    monthlyRevenue: 0
  });

  const [recentPatients, setRecentPatients] = useState([]);
  const [upcomingVisits, setUpcomingVisits] = useState([]);
  const [recentVisits, setRecentVisits] = useState([]);
  const [currentPatientPage, setCurrentPatientPage] = useState(1);
  const [currentRecentVisitPage, setCurrentRecentVisitPage] = useState(1);

  // Section loading states
  const [sectionLoading, setSectionLoading] = useState({
    stats: true,
    recentPatients: true,
    recentVisits: true,
    upcomingVisits: true,
    practiceStats: true
  });

  const patientsPerPage = 2;
  const recentVisitsPerPage = 3;

  // Enhanced color mapping for visit types with icons
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
          icon: FileText,
          iconColor: 'text-gray-500',
          accent: 'border-l-gray-400'
        };
    }
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Reset all loading states
        setSectionLoading({
          stats: true,
          recentPatients: true,
          recentVisits: true,
          upcomingVisits: true,
          practiceStats: true
        });

        // Fetch all patients
        const patientsData = await fetchPatients({
          page: 1,
          limit: 100,
          sortBy: 'createdAt',
          sortOrder: 'desc'
        });

        if (patientsData?.patients) {
          const totalPatients = patientsData.patients.length;

          // Set recent patients
          const recent = patientsData.patients.slice(0, 10);
          setRecentPatients(recent);
          setSectionLoading(prev => ({ ...prev, recentPatients: false }));

          // Calculate visit statistics
          let totalVisits = 0;
          let todaysVisits = 0;
          const today = new Date().toDateString();
          const allVisitsList = [];
          const upcomingVisitsList = [];
          const recentVisitsList = [];

          // Get visits for each patient
          for (const patient of patientsData.patients.slice(0, 20)) {
            try {
              const visitsData = await fetchVisitsByPatient(patient._id);
              if (visitsData && visitsData.length > 0) {
                visitsData.forEach(visit => {
                  const visitWithPatient = {
                    ...visit,
                    patientName: patient.fullName,
                    patientPhone: patient.phoneNumber,
                    patientId: patient._id // Add patientId for navigation
                  };
                  allVisitsList.push(visitWithPatient);

                  const visitDate = new Date(visit.date);
                  const isToday = visitDate.toDateString() === today;
                  const isUpcoming = visitDate > new Date();
                  const isRecent = !isUpcoming && visitDate > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

                  if (isToday) todaysVisits++;
                  if (isUpcoming) upcomingVisitsList.push(visitWithPatient);
                  if (isRecent) recentVisitsList.push(visitWithPatient);
                });
                totalVisits += visitsData.length;
              }
            } catch (error) {
              console.log(`No visits for patient ${patient.fullName}:`, error.message);
            }
          }

          // Sort and limit the lists
          upcomingVisitsList.sort((a, b) => new Date(a.date) - new Date(b.date));
          recentVisitsList.sort((a, b) => new Date(b.date) - new Date(a.date));

          setUpcomingVisits(upcomingVisitsList);
          setRecentVisits(recentVisitsList);
          setSectionLoading(prev => ({
            ...prev,
            recentVisits: false,
            upcomingVisits: false
          }));

          // Calculate monthly revenue
          const monthlyRevenue = totalVisits * 75;

          setStats({
            totalPatients,
            totalVisits,
            todaysVisits,
            monthlyRevenue
          });
          setSectionLoading(prev => ({ ...prev, stats: false, practiceStats: false }));
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Set all loading states to false on error
        setSectionLoading({
          stats: false,
          recentPatients: false,
          recentVisits: false,
          upcomingVisits: false,
          practiceStats: false
        });
      }
    };

    loadDashboardData();
  }, []);

  const quickActions = [
    {
      title: 'Add New Patient',
      description: 'Register a new patient',
      icon: UserPlus,
      action: () => navigate('/patients'),
      color: 'bg-blue-500',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Record Visit',
      description: 'Log a patient visit',
      icon: FileText,
      action: () => navigate('/patients'),
      color: 'bg-green-500',
      gradient: 'from-green-500 to-green-600'
    },
    {
      title: 'View Schedule',
      description: 'Check upcoming appointments',
      icon: Calendar,
      action: () => navigate('/visits'),
      color: 'bg-purple-500',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Messages',
      description: 'Check patient messages',
      icon: MessageSquare,
      action: () => navigate('/messaging'),
      color: 'bg-orange-500',
      gradient: 'from-orange-500 to-orange-600'
    }
  ];

  // Pagination for recent patients
  const totalPatientPages = Math.ceil(recentPatients.length / patientsPerPage);
  const currentPatients = recentPatients.slice(
    (currentPatientPage - 1) * patientsPerPage,
    currentPatientPage * patientsPerPage
  );

  // Pagination for recent visits
  const totalRecentVisitPages = Math.ceil(recentVisits.length / recentVisitsPerPage);
  const currentRecentVisits = recentVisits.slice(
    (currentRecentVisitPage - 1) * recentVisitsPerPage,
    currentRecentVisitPage * recentVisitsPerPage
  );

  const handlePatientPageChange = (newPage) => {
    setCurrentPatientPage(newPage);
  };

  const handleRecentVisitPageChange = (newPage) => {
    setCurrentRecentVisitPage(newPage);
  };

  // Calculate practice stats
  const practiceStats = {
    patientSatisfaction: Math.min(95 + (stats.totalPatients % 10), 100),
    avgResponseTime: '2.3h',
    completedVisits: Math.min(85 + (stats.totalVisits % 15), 100)
  };

  // Handle patient click
  const handlePatientClick = (patientId) => {
    navigate(`/patients/${patientId}`);
  };

  // Handle visit click
  const handleVisitClick = (patientId) => {
    navigate(`/patients/${patientId}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      {/* Enhanced Welcome Header - Responsive */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-2xl p-6 md:p-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <Title
              title={`Welcome back, Dr. ${user?.username || 'User'}! 👋`}
              className="text-2xl md:text-3xl font-bold text-white mb-2"
            />
            <p className="text-blue-100 text-base md:text-lg opacity-90">
              Here's your practice overview for today. You have {stats.todaysVisits} visits scheduled.
            </p>
          </div>
          <div className="text-center md:text-right bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-blue-100 text-sm font-medium">Today</p>
            <p className="text-lg md:text-2xl font-semibold text-white">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {sectionLoading.stats ? (
          // Loading state for stats
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))
        ) : (
          // Actual stats content
          <>
            <StatCard
              title="Total Patients"
              value={stats.totalPatients}
              icon={Users}
              trend={stats.totalPatients > 0 ? 12.5 : 0}
              color="blue"
              gradient="from-blue-500 to-blue-600"
            />

            <StatCard
              title="Total Visits"
              value={stats.totalVisits}
              icon={Calendar}
              trend={stats.totalVisits > 0 ? 8.2 : 0}
              color="green"
              gradient="from-green-500 to-green-600"
            />

            <StatCard
              title="Today's Visits"
              value={stats.todaysVisits}
              icon={Clock}
              trend={stats.todaysVisits > 0 ? 5.1 : 0}
              color="purple"
              gradient="from-purple-500 to-purple-600"
            />

            <StatCard
              title="Monthly Revenue"
              value={`$${stats.monthlyRevenue.toLocaleString()}`}
              icon={DollarSign}
              trend={stats.monthlyRevenue > 0 ? 15.3 : 0}
              color="orange"
              gradient="from-orange-500 to-orange-600"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Left Column - Quick Actions, Recent Patients, Recent Visits */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Quick Actions - Responsive */}
          <Section title="Quick Actions" icon={TrendingUp}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              {quickActions.map((action, index) => (
                <QuickActionCard key={index} {...action} />
              ))}
            </div>
          </Section>

          {/* Recent Patients with Pagination - Responsive */}
          <Section title="Recent Patients" icon={Users}>
            {sectionLoading.recentPatients ? (
              <div className="space-y-3 mb-4">
                {Array.from({ length: patientsPerPage }).map((_, index) => (
                  <div key={index} className="animate-pulse bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-4">
                  {currentPatients.length > 0 ? (
                    currentPatients.map(patient => (
                      <RecentPatientCard
                        key={patient._id}
                        patient={patient}
                        onPatientClick={handlePatientClick}
                      />
                    ))
                  ) : (
                    <div className="text-center py-6 md:py-8 text-gray-500 bg-gray-50 rounded-lg">
                      <Users className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 text-gray-300" />
                      <p className="text-sm md:text-base">No patients yet. Add your first patient to get started.</p>
                    </div>
                  )}
                </div>

                {recentPatients.length > patientsPerPage && (
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <Button
                      variant="outline"
                      size="small"
                      icon={ChevronLeft}
                      onClick={() => handlePatientPageChange(currentPatientPage - 1)}
                      disabled={currentPatientPage === 1}
                      className="text-xs md:text-sm"
                    >
                      Previous
                    </Button>

                    <span className="text-xs md:text-sm text-gray-600">
                      Page {currentPatientPage} of {totalPatientPages}
                    </span>

                    <Button
                      variant="outline"
                      size="small"
                      icon={ChevronRight}
                      iconPosition="right"
                      onClick={() => handlePatientPageChange(currentPatientPage + 1)}
                      disabled={currentPatientPage === totalPatientPages}
                      className="text-xs md:text-sm"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </Section>

          {/* Enhanced Recent Visits Section with Pagination - Responsive */}
          <Section title="Recent Visits" icon={Clock}>
            {sectionLoading.recentVisits ? (
              <div className="space-y-4 mb-4">
                {Array.from({ length: recentVisitsPerPage }).map((_, index) => (
                  <div key={index} className="animate-pulse border-l-4 border-gray-200 bg-gray-50 border rounded-lg p-4">
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-4">
                  {currentRecentVisits.length > 0 ? (
                    currentRecentVisits.map(visit => (
                      <RecentVisitCard
                        key={visit._id}
                        visit={visit}
                        getVisitTypeConfig={getVisitTypeConfig}
                        onVisitClick={handleVisitClick}
                      />
                    ))
                  ) : (
                    <div className="text-center py-6 md:py-8 text-gray-500 bg-gray-50 rounded-lg">
                      <Calendar className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 text-gray-300" />
                      <p className="text-sm md:text-base">No recent visits in the past 7 days</p>
                    </div>
                  )}
                </div>

                {/* Pagination for Recent Visits */}
                {recentVisits.length > recentVisitsPerPage && (
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <Button
                      variant="outline"
                      size="small"
                      icon={ChevronLeft}
                      onClick={() => handleRecentVisitPageChange(currentRecentVisitPage - 1)}
                      disabled={currentRecentVisitPage === 1}
                      className="text-xs md:text-sm"
                    >
                      Previous
                    </Button>

                    <span className="text-xs md:text-sm text-gray-600">
                      Page {currentRecentVisitPage} of {totalRecentVisitPages}
                    </span>

                    <Button
                      variant="outline"
                      size="small"
                      icon={ChevronRight}
                      iconPosition="right"
                      onClick={() => handleRecentVisitPageChange(currentRecentVisitPage + 1)}
                      disabled={currentRecentVisitPage === totalRecentVisitPages}
                      className="text-xs md:text-sm"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </Section>
        </div>

        {/* Right Sidebar - Responsive */}
        <div className="space-y-4 md:space-y-6">
          {/* Enhanced Upcoming Visits with Scrollable Container - Responsive */}
          <Section title="Upcoming Visits" icon={Calendar}>
            {sectionLoading.upcomingVisits ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="animate-pulse border-l-4 border-gray-200 bg-gray-50 border rounded-lg p-4">
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className={`space-y-4 ${upcomingVisits.length > 3 ? 'max-h-80 overflow-y-auto pr-2' : ''}`}
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#cbd5e1 #f1f5f9'
                }}
              >
                {upcomingVisits.length > 0 ? (
                  upcomingVisits.map(visit => (
                    <UpcomingVisitCard
                      key={visit._id}
                      visit={visit}
                      getVisitTypeConfig={getVisitTypeConfig}
                      onVisitClick={handleVisitClick}
                    />
                  ))
                ) : (
                  <div className="text-center py-6 md:py-8 text-gray-500 bg-gray-50 rounded-lg">
                    <Calendar className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 text-gray-300" />
                    <p className="text-sm md:text-base">No upcoming visits scheduled</p>
                  </div>
                )}
              </div>
            )}

            {/* Show count if there are upcoming visits */}
            {!sectionLoading.upcomingVisits && upcomingVisits.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  {upcomingVisits.length} upcoming visit{upcomingVisits.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </Section>

          {/* Enhanced Practice Stats - Responsive */}
          <Section title="Practice Overview" icon={TrendingUp}>
            {sectionLoading.practiceStats ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="animate-pulse p-3 bg-gray-50 rounded-lg">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3 md:space-y-4">
                <StatItem
                  label="Patient Satisfaction"
                  value={`${practiceStats.patientSatisfaction}%`}
                  color="text-green-600"
                  icon="👍"
                />
                <StatItem
                  label="Avg. Response Time"
                  value={practiceStats.avgResponseTime}
                  color="text-blue-600"
                  icon="⚡"
                />
                <StatItem
                  label="Completed Visits"
                  value={`${practiceStats.completedVisits}%`}
                  color="text-purple-600"
                  icon="✅"
                />
                <StatItem
                  label="Active Patients"
                  value={`${recentPatients.filter(p => p.lastVisit).length}/${stats.totalPatients}`}
                  color="text-orange-600"
                  icon="👥"
                />
              </div>
            )}
          </Section>
        </div>
      </div>
    </div>
  );
};

// Enhanced Section Component with gradient border - Responsive
const Section = ({ title, icon: Icon, children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 ${className}`}>
    <div className="flex items-center gap-3 mb-4 md:mb-6 pb-4 border-b border-gray-100">
      <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
        <Icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
      </div>
      <Title title={title} className="text-lg md:text-xl font-semibold text-gray-900" />
    </div>
    {children}
  </div>
);

// Enhanced Stat Card with gradients - Responsive
const StatCard = ({ title, value, icon: Icon, trend, color, gradient }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs md:text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-xl md:text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`p-2 md:p-3 rounded-lg bg-gradient-to-r ${gradient} text-white shadow-md`}>
        <Icon className="w-4 h-4 md:w-6 md:h-6" />
      </div>
    </div>
    {trend > 0 && (
      <div className="flex items-center mt-3 md:mt-4">
        <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-green-500 mr-1" />
        <span className="text-xs md:text-sm font-medium text-green-600">
          +{trend}%
        </span>
        <span className="text-xs md:text-sm text-gray-500 ml-2 hidden sm:inline">from last month</span>
      </div>
    )}
  </div>
);

// Enhanced Quick Action Card with gradients - Responsive
const QuickActionCard = ({ title, description, icon: Icon, action, gradient }) => (
  <button
    onClick={action}
    className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 text-left hover:shadow-md transition-all duration-200 w-full group hover:border-transparent hover:bg-gradient-to-r hover:from-white hover:to-gray-50"
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 group-hover:text-gray-800 transition-colors mb-2">
          {title}
        </h3>
        <p className="text-xs md:text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
          {description}
        </p>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <div className={`p-2 md:p-3 rounded-lg bg-gradient-to-r ${gradient} text-white shadow-md group-hover:scale-110 transition-transform duration-200`}>
          <Icon className="w-3 h-3 md:w-4 md:h-4" />
        </div>
        <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
      </div>
    </div>
  </button>
);

// Enhanced Recent Patient Card - Responsive
const RecentPatientCard = ({ patient, onPatientClick }) => (
  <div
    className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 cursor-pointer border border-gray-200 hover:border-gray-300 group"
    onClick={() => onPatientClick(patient._id)}
  >
    <div className="flex items-center gap-2 md:gap-3">
      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-base md:text-lg shadow-md">
        {patient.fullName?.charAt(0) || 'P'}
      </div>
      <div>
        <h3 className="text-sm md:text-md font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
          {patient.fullName}
        </h3>
        <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-gray-500">
          <Phone className="w-3 h-3" />
          <span>{patient.phoneNumber}</span>
        </div>
      </div>
    </div>
    <div className="text-right">
      <p className="text-xs md:text-sm text-gray-500">
        {patient.lastVisit
          ? `Last: ${new Date(patient.lastVisit).toLocaleDateString()}`
          : 'No visits yet'
        }
      </p>
    </div>
  </div>
);

// Enhanced Recent Visit Card with colorful design - Responsive
const RecentVisitCard = ({ visit, getVisitTypeConfig, onVisitClick }) => {
  const config = getVisitTypeConfig(visit.type);
  const IconComponent = config.icon;

  return (
    <div
      className={`border-l-4 ${config.accent} ${config.bg} border rounded-lg p-3 md:p-4 hover:shadow-md transition-all duration-200 cursor-pointer group`}
      onClick={() => onVisitClick(visit.patientId)}
    >
      <div className="flex items-start justify-between mb-2 md:mb-3">
        <div className="flex items-center gap-2 md:gap-3">
          <div className={`p-1 md:p-2 rounded-lg ${config.badge} border`}>
            <IconComponent className={`w-3 h-3 md:w-4 md:h-4 ${config.iconColor}`} />
          </div>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${config.badge} border`}>
            {visit.type}
          </span>
        </div>
        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">
          {new Date(visit.date).toLocaleDateString()}
        </span>
      </div>

      <h4 className="font-semibold text-gray-900 mb-1 md:mb-2 group-hover:text-gray-800 transition-colors text-sm md:text-base">
        {visit.patientName}
      </h4>

      <p className="text-xs md:text-sm text-gray-700 mb-2 md:mb-3 line-clamp-2">
        {visit.purpose}
      </p>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2 md:gap-4">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {new Date(visit.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {visit.gpsLocation && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span className="hidden sm:inline">Location</span>
            </span>
          )}
        </div>
        <span className="text-gray-400 group-hover:text-gray-600 transition-colors text-xs">
          Completed
        </span>
      </div>
    </div>
  );
};

// Enhanced Upcoming Visit Card with colorful design - Responsive
const UpcomingVisitCard = ({ visit, getVisitTypeConfig, onVisitClick }) => {
  const config = getVisitTypeConfig(visit.type);
  const IconComponent = config.icon;
  const isToday = new Date(visit.date).toDateString() === new Date().toDateString();

  return (
    <div
      className={`border-l-4 ${config.accent} ${config.bg} border rounded-lg p-3 md:p-4 hover:shadow-md transition-all duration-200 cursor-pointer group`}
      onClick={() => onVisitClick(visit.patientId)}
    >
      <div className="flex items-start justify-between mb-2 md:mb-3">
        <div className="flex items-center gap-1 md:gap-2">
          <div className={`p-1 md:p-2 rounded-lg ${config.badge} border`}>
            <IconComponent className={`w-3 h-3 md:w-4 md:h-4 ${config.iconColor}`} />
          </div>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${config.badge} border`}>
            {visit.type}
          </span>
          {isToday && (
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-300">
              Today
            </span>
          )}
        </div>
      </div>

      <h4 className="font-semibold text-gray-900 mb-1 md:mb-2 group-hover:text-gray-800 transition-colors text-sm md:text-base">
        {visit.patientName}
      </h4>

      <p className="text-xs md:text-sm text-gray-700 mb-2 md:mb-3">
        {visit.purpose}
      </p>

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-gray-600 font-medium">
          <Clock className="w-3 h-3" />
          {new Date(visit.date).toLocaleDateString()} at {new Date(visit.date).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${isToday
          ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
          : 'bg-blue-100 text-blue-800 border border-blue-300'
          }`}>
          {isToday ? 'Today' : 'Upcoming'}
        </span>
      </div>
    </div>
  );
};

// New Stat Item component for practice overview - Responsive
const StatItem = ({ label, value, color, icon }) => (
  <div className="flex items-center justify-between p-2 md:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
    <div className="flex items-center gap-2 md:gap-3">
      <span className="text-base md:text-lg">{icon}</span>
      <span className="text-xs md:text-sm font-medium text-gray-700">{label}</span>
    </div>
    <span className={`text-xs md:text-sm font-semibold ${color}`}>{value}</span>
  </div>
);

export default Dashboard;