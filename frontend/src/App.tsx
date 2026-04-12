import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import { Toaster } from '@/components/ui/sonner';

export default function App() {
  return (
    <div className="min-h-screen bg-background text-on_surface flex flex-col">
      <Navbar />
      <div className="flex-1 overflow-auto">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/" element={<Navigate to="/projects" replace />} />
          </Route>
        </Routes>
      </div>
      <Toaster />
    </div>
  );
}