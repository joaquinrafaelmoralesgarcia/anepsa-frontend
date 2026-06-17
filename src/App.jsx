import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';
import Login from './pages/Login';
import DashboardAdmin from './pages/DashboardAdmin';
import DashboardValuador from './pages/DashboardValuador';
import Clientes from './pages/Clientes';
import Inmuebles from './pages/Inmuebles';
import Ordenes from './pages/Ordenes';
import Usuarios from './pages/Usuarios';
import OrdenDetalle from './pages/OrdenDetalle';
import ActividadAdmin from './pages/ActividadAdmin';
import NotificacionesValuador from './pages/NotificacionesValuador';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><RoleRoute role="admin"><DashboardAdmin /></RoleRoute></ProtectedRoute>} />
          <Route path="/admin/clientes" element={<ProtectedRoute><RoleRoute role="admin"><Clientes /></RoleRoute></ProtectedRoute>} />
          <Route path="/admin/inmuebles" element={<ProtectedRoute><RoleRoute role="admin"><Inmuebles /></RoleRoute></ProtectedRoute>} />
          <Route path="/admin/ordenes" element={<ProtectedRoute><RoleRoute role="admin"><Ordenes /></RoleRoute></ProtectedRoute>} />
          <Route path="/admin/ordenes/:id" element={<ProtectedRoute><RoleRoute role="admin"><OrdenDetalle /></RoleRoute></ProtectedRoute>} />
          <Route path="/admin/usuarios" element={<ProtectedRoute><RoleRoute role="admin"><Usuarios /></RoleRoute></ProtectedRoute>} />
          <Route path="/admin/actividad" element={<ProtectedRoute><RoleRoute role="admin"><ActividadAdmin /></RoleRoute></ProtectedRoute>} />
          <Route path="/valuador/dashboard" element={<ProtectedRoute><RoleRoute role="valuador"><DashboardValuador /></RoleRoute></ProtectedRoute>} />
          <Route path="/valuador/ordenes/:id" element={<ProtectedRoute><RoleRoute role="valuador"><OrdenDetalle /></RoleRoute></ProtectedRoute>} />
          <Route path="/valuador/notificaciones" element={<ProtectedRoute><RoleRoute role="valuador"><NotificacionesValuador /></RoleRoute></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
