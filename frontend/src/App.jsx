import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AppLayout from './layouts/AppLayout';

import Patients from './pages/Patients';
import Doctors from './pages/Doctors';
import Appointments from './pages/Appointments';
import Pharmacy from './pages/Pharmacy';

import Landing from './pages/Landing';
import PatientProfile from './pages/PatientProfile';
import MedicalRecords from './pages/MedicalRecords';
import Laboratory from './pages/Laboratory';
import Billing from './pages/Billing';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, hasPermission } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !hasPermission(allowedRoles)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          <Route path="/app" element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />

            {/* Patients */}
            <Route path="patients" element={
              <ProtectedRoute allowedRoles={['Administrator', 'Doctor', 'Nurse', 'Receptionist']}>
                <Patients />
              </ProtectedRoute>
            } />
            <Route path="patients/:id" element={
              <ProtectedRoute allowedRoles={['Administrator', 'Doctor', 'Nurse', 'Receptionist']}>
                <PatientProfile />
              </ProtectedRoute>
            } />

            {/* Doctors */}
            <Route path="doctors" element={
              <ProtectedRoute allowedRoles={['Administrator', 'Patient', 'Receptionist']}>
                <Doctors />
              </ProtectedRoute>
            } />

            {/* Appointments */}
            <Route path="appointments" element={
              <ProtectedRoute allowedRoles={['Administrator', 'Doctor', 'Receptionist', 'Nurse']}>
                <Appointments />
              </ProtectedRoute>
            } />

            {/* Pharmacy */}
            <Route path="pharmacy" element={
              <ProtectedRoute allowedRoles={['Administrator', 'Pharmacist', 'Doctor']}>
                <Pharmacy />
              </ProtectedRoute>
            } />

            {/* Medical Records */}
            <Route path="records" element={
              <ProtectedRoute allowedRoles={['Administrator', 'Doctor', 'Nurse']}>
                <MedicalRecords />
              </ProtectedRoute>
            } />

            {/* Laboratory */}
            <Route path="laboratory" element={
              <ProtectedRoute allowedRoles={['Administrator', 'Doctor', 'Lab Technician']}>
                <Laboratory />
              </ProtectedRoute>
            } />

            {/* Billing */}
            <Route path="billing" element={
              <ProtectedRoute allowedRoles={['Administrator', 'Accountant', 'Receptionist']}>
                <Billing />
              </ProtectedRoute>
            } />

            {/* Add more routing as modules are built */}
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
