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

function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        {/* Authenticated Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} /> {/* Default route */}
          <Route path="patients" element={<Patients />} />
          <Route path="/patients/:id" element={<PatientDetails />} />
          // In App.jsx, add this route inside the MainLayout
          <Route path="patients/:patientId/visits/new" element={<AddVisit />} />
          // In App.jsx, add this route inside the MainLayout
          <Route path="patients/:id/visits" element={<VisitsList />} />
          <Route path="messaging" element={<Messaging />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;