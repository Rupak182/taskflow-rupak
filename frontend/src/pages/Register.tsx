import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useRegister } from '@/api/auth/hooks';
import { getApiErrorMsg } from '@/lib/utils';

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const registerMutation = useRegister();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await registerMutation.mutateAsync({ name, email, password });
      toast.success('Account created successfully!');
      navigate('/projects');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      let errorMsg = getApiErrorMsg(err, 'Failed to register');

      const fields = err.response?.data?.fields;
      if (errorMsg === 'validation failed' && fields?.email) {
        errorMsg = 'An account with this email already exists';
      }
      toast.error(errorMsg);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-background">
      <div className="p-8 bg-card rounded shadow-md w-96 border border-border text-card-foreground">
        <h2 className="text-2xl font-bold mb-6">Register</h2>
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
          <button 
            type="submit" 
            className="p-2 bg-primary text-primary-foreground rounded mt-4"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
