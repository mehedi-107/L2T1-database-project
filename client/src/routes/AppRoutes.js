import { Route, Routes } from 'react-router-dom';

import Admin from '../components/admin/Admin';
import BedInfoAdmin from '../components/admin/BedInfoAdmin';
import Appointments from '../components/doctor/Appointments';
import Doctor from '../components/doctor/Doctor';
import TaskList from '../components/doctor/TaskList';
import Home from '../components/Home';
import Login from '../components/Login';
import Nurse from '../components/nurse/Nurse';
import Patient from '../components/patient/Patient';
import Signup from '../components/Signup';
import BedInfo from '../components/ward/BedInfo';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';

const RoleDashboard = () => {
  const { userData, role, logout } = useAuth();

  if (role === 'doctor') return <Doctor userData={userData} onLogout={logout} />;
  if (role === 'nurse') return <Nurse userData={userData} onLogout={logout} />;
  if (role === 'patient') return <Patient userData={userData} onLogout={logout} />;
  if (role === 'admin') return <Admin onLogout={logout} />;

  return <Home />;
};

const AppRoutes = () => {
  const { login, logout, userData } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login onLoginSuccess={login} />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/doctor"
        element={
          <ProtectedRoute allowedRoles={['doctor', 'nurse', 'patient', 'admin']}>
            <RoleDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient"
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <Patient userData={userData} onLogout={logout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/nurse"
        element={
          <ProtectedRoute allowedRoles={['nurse']}>
            <Nurse userData={userData} onLogout={logout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/appointments"
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <Appointments userData={userData} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasklist"
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <TaskList userData={userData} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/BedInfo"
        element={
          <ProtectedRoute allowedRoles={['doctor', 'admin']}>
            <BedInfo />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Admin onLogout={logout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bedInfoAdmin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <BedInfoAdmin />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
