import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PatientsList, PatientDetails, Home, Login, SignUp, Dashboard } from './pages/pages';


function App() {
    return (
        <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path="/patients" element={<PatientsList />} />
            <Route path="/patients/:id" element={<PatientDetails />} />
            <Route path='/' element={<Home />} />
        </Routes>
    );
};

export default App;