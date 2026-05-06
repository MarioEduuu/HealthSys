import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Pacientes from './pages/Pacientes'
import Prontuario from './pages/Prontuario'
import Relatorios from './pages/Relatorios'
import Triagens from './pages/Triagens'
import Usuarios from './pages/Usuarios'
import Notificacoes from './pages/Notificacoes'
import { isAuthenticated } from './utils/auth'
import './App.css'

function ProtectedRoute() {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />
}

function RootRedirect() {
  return <Navigate to={isAuthenticated() ? '/dashboard' : '/login'} replace />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/pacientes" element={<Pacientes />} />
        <Route path="/prontuario" element={<Prontuario />} />
        <Route path="/triagens" element={<Triagens />} />
        <Route path="/notificacoes" element={<Notificacoes />} />
        <Route path="/relatorios" element={<Relatorios />} />
      </Route>
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  )
}

export default App
