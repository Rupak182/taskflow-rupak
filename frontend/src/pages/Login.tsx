import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation placeholder
    if (!email || !password) {
      setError('Please fill in all fields');
      toast.error('Please fill in all fields');
      return;
    }

    // Placeholder for API call and JWT storage
    console.log("Logging in with", email);
    toast.success('Successfully logged in!');
    // localStorage.setItem('token', 'mock_jwt_token');
    navigate('/projects');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-background">
      <div className="p-8 bg-card rounded shadow-md w-96 text-card-foreground border border-border">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="p-2 border border-border rounded bg-background text-foreground"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="p-2 border border-border rounded bg-background text-foreground"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="p-2 bg-primary text-primary-foreground rounded mt-4">Login</button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          Don't have an account? <Link to="/register" className="text-primary hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
