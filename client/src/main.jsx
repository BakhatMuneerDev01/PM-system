import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx';
import { PatientProvider } from './context/PatientContext.jsx';
import { VisitProvider } from './context/VisitContext.jsx';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <PatientProvider>
        <VisitProvider>
          <App />
        </VisitProvider>
      </PatientProvider>
    </AuthProvider>
  </BrowserRouter>
);