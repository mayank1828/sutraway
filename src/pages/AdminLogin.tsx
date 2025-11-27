import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdmin } from '@/contexts/AdminContext';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const { signIn, user, isAdmin, requestPasswordReset } = useAdmin();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin/panel');
    }
  }, [user, isAdmin, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: 'Login failed',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Login successful',
        description: 'Welcome back!',
      });
    }

    setIsLoading(false);
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await requestPasswordReset(resetEmail);

    if (error) {
      toast({
        title: 'Password reset failed',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Check your email',
        description: 'Password reset link has been sent to your email.',
      });
      setShowResetForm(false);
      setResetEmail('');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Login</h1>
          <p className="text-muted-foreground">Access your admin panel</p>
        </div>

        {!showResetForm ? (
          <form onSubmit={handleLogin} className="space-y-6 bg-card p-8 rounded-lg border">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowResetForm(true)}
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handlePasswordReset} className="space-y-6 bg-card p-8 rounded-lg border">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
              <Input
                id="reset-email"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="workwithsutra@gmail.com"
                required
              />
              <p className="text-sm text-muted-foreground">
                Only the admin email (workwithsutra@gmail.com) can reset the password.
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowResetForm(false)}
                className="flex-1"
              >
                Back
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default AdminLogin;
