import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  // Placeholder for authentication check
  const isAuthenticated = true; // Replace with actual auth logic (e.g., checking JWT)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
