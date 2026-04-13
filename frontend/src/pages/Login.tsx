import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useLogin } from '@/api/auth/hooks';
import { getApiErrorMsg } from '@/lib/utils';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const loginMutation = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await loginMutation.mutateAsync({ email, password });
      toast.success('Successfully logged in!');
      navigate('/projects');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      let errorMsg = getApiErrorMsg(err, 'Failed to login');

      if (errorMsg === 'unauthorized') {
        errorMsg = 'Invalid email or password';
      }
      toast.error(errorMsg);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-background">
      <div className="p-8 bg-card rounded shadow-md w-96 text-card-foreground border border-border">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
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
          <button 
            type="submit" 
            className="p-2 bg-primary text-primary-foreground rounded mt-4"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          Don't have an account? <Link to="/register" className="text-primary hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
