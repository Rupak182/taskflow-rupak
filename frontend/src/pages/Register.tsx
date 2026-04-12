import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation placeholder
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      toast.error('Please fill in all fields');
      return;
    }

    // Placeholder for API call and JWT storage
    console.log("Registering with", email);
    toast.success('Account created successfully!');
    // localStorage.setItem('token', 'mock_jwt_token');
    navigate('/projects');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-background">
      <div className="p-8 bg-card rounded shadow-md w-96 border border-border text-card-foreground">
        <h2 className="text-2xl font-bold mb-6">Register</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Name"
            className="p-2 border border-border rounded bg-background text-foreground"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
          <button type="submit" className="p-2 bg-primary text-primary-foreground rounded mt-4">Register</button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
