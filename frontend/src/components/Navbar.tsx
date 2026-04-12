import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const navigate = useNavigate();
  // Placeholder user
  const user = { name: "John Doe" };
  const isAuthenticated = true;

  const handleLogout = () => {
    // Placeholder for logout logic (e.g., removing JWT)
    console.log("Logging out...");
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
          <div className="flex items-center gap-4">
            <span>Welcome, {user.name}</span>
            <Button onClick={handleLogout}>Logout</Button>
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
