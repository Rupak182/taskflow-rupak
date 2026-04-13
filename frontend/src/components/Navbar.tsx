import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';

export default function Navbar() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isAuthenticated = !!token;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    queryClient.clear();
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-card text-card-foreground border-b border-border">
      <div>
        <Link to="/" className="text-xl font-bold text-primary">TaskFlow</Link>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        {isAuthenticated ? (
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="hidden sm:inline text-sm">Welcome, {user.name}</span>
            <Button onClick={handleLogout} variant="outline" size="sm">Logout</Button>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
