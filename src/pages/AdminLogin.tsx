import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdmin } from '@/contexts/AdminContext';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Mail, Loader2 } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const { sendMagicLink, user, isAdmin } = useAdmin();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin/panel');
    }
  }, [user, isAdmin, navigate]);

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await sendMagicLink(email);

    if (error) {
      toast({
        title: 'Failed to send magic link',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setMagicLinkSent(true);
      toast({
        title: 'Magic link sent!',
        description: 'Check your email for the login link.',
      });
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
          <img 
            src="/assets/admin-logo.png" 
            alt="Admin Logo" 
            className="w-24 h-auto mx-auto mb-4"
          />
          <h1 className="text-4xl font-bold mb-2">Admin Login</h1>
          <p className="text-muted-foreground">Enter your email to receive a login link</p>
        </div>

        {!magicLinkSent ? (
          <form onSubmit={handleMagicLink} className="space-y-6 bg-card p-8 rounded-lg border">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="workwithsutra@gmail.com"
                required
              />
              <p className="text-sm text-muted-foreground">
                Only authorized admin emails can access the panel.
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Magic Link
                </>
              )}
            </Button>
          </form>
        ) : (
          <div className="bg-card p-8 rounded-lg border text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Check your email</h2>
            <p className="text-muted-foreground">
              We sent a login link to <strong>{email}</strong>. Click the link in the email to sign in.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setMagicLinkSent(false);
                setEmail('');
              }}
              className="mt-4"
            >
              Use a different email
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminLogin;
