import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Patients from './pages/Patients'
import Dashboard from './pages/Dashboard'; // You'll need to create this
import Messaging from './pages/Messaging'; // You'll need to create this
import MainLayout from './components/layout/MainLayout';
import PatientDetails from "./pages/PatientDetails ";
import AddVisit from "./pages/AddVisit";
import VisitsList from "./pages/VisitsList";
import Profile from "./pages/Profile";
import VisitsPage from './pages/VisitsPage';

function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        {/* Authenticated Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="patients" element={<Patients />} />
          <Route path="/patients/:id" element={<PatientDetails />} />
          <Route path="patients/:patientId/visits/new" element={<AddVisit />} />
          <Route path="patients/:id/visits" element={<VisitsList />} /> {/* Add this line */}
          <Route path="visits" element={<VisitsPage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="messaging" element={<Messaging />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;