import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const AdminSetup = () => {
  const [email, setEmail] = useState('workwithsutra@gmail.com');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please make sure both passwords are the same.',
        variant: 'destructive',
      });
      setStatus('error');
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive',
      });
      setStatus('error');
      return;
    }

    setIsLoading(true);
    setStatus('idle');

    try {
      const { data, error } = await supabase.functions.invoke('setup-admin', {
        body: { email, password }
      });

      if (error) throw error;

      setStatus('success');
      toast({
        title: 'Admin account created!',
        description: 'You can now log in with your credentials.',
      });

      setTimeout(() => {
        navigate('/admin/login');
      }, 2000);
    } catch (error: any) {
      setStatus('error');
      toast({
        title: 'Setup failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 overflow-hidden relative"
      style={{
        background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)'
      }}
    >
      {/* Floating Blobs */}
      <motion.div
        className="absolute top-[10%] left-[20%] w-[300px] h-[300px] rounded-[40%_60%_70%_30%] opacity-80 blur-[40px] z-0"
        style={{ background: '#ff9a9e' }}
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[10%] right-[20%] w-[250px] h-[250px] rounded-[60%_40%_30%_70%] opacity-80 blur-[40px] z-0"
        style={{ background: '#a18cd1' }}
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-[380px] p-10 rounded-3xl text-center relative z-10"
        style={{
          background: 'rgba(255, 255, 255, 0.65)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)'
        }}
      >
        <img 
          src="/assets/admin-logo.png" 
          alt="Admin Logo" 
          className="w-24 h-auto mx-auto mb-4"
        />
        <h1 className="text-[#4a4a4a] text-2xl font-bold mb-2">Hello, Admin! 👋</h1>
        <p className="text-[#888] text-sm mb-8">Create your admin account to get started.</p>

        <form onSubmit={handleSetup} className="space-y-5">
          <div className="text-left">
            <label htmlFor="email" className="block text-[#666] text-xs font-bold mb-2 ml-2.5">
              Admin Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              disabled
              className="w-full px-5 py-4 rounded-xl border-2 border-transparent bg-white shadow-sm text-base transition-all focus:border-[#a18cd1] focus:ring-4 focus:ring-[#a18cd1]/20 text-[#4a4a4a] h-auto"
              style={{ fontFamily: 'inherit' }}
            />
            <p className="text-[#999] text-xs mt-1 ml-2.5">Fixed admin email</p>
          </div>

          <div className="text-left">
            <label htmlFor="password" className="block text-[#666] text-xs font-bold mb-2 ml-2.5">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full px-5 py-4 rounded-xl border-2 border-transparent bg-white shadow-sm text-base transition-all focus:border-[#a18cd1] focus:ring-4 focus:ring-[#a18cd1]/20 text-[#4a4a4a] h-auto"
              style={{ fontFamily: 'inherit' }}
            />
          </div>

          <div className="text-left">
            <label htmlFor="confirm-password" className="block text-[#666] text-xs font-bold mb-2 ml-2.5">
              Confirm Password
            </label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              className="w-full px-5 py-4 rounded-xl border-2 border-transparent bg-white shadow-sm text-base transition-all focus:border-[#a18cd1] focus:ring-4 focus:ring-[#a18cd1]/20 text-[#4a4a4a] h-auto"
              style={{ fontFamily: 'inherit' }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 border-none rounded-xl text-white font-bold text-base cursor-pointer transition-all mt-2.5 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
            style={{
              background: status === 'success' 
                ? '#2ecc71' 
                : 'linear-gradient(to right, #a18cd1 0%, #fbc2eb 100%)'
            }}
          >
            {isLoading ? 'Creating...' : status === 'success' ? 'Connected!' : 'Create Admin Account'}
          </button>
        </form>

        {/* Status Message */}
        <div className="mt-5 h-5 text-sm font-semibold">
          {status === 'success' && (
            <span className="text-[#2ecc71]">✨ Success! Redirecting to login...</span>
          )}
          {status === 'error' && (
            <span className="text-[#e74c3c]">Please check your inputs and try again.</span>
          )}
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={() => navigate('/admin/login')}
            className="text-sm text-[#a18cd1] hover:underline bg-transparent border-none cursor-pointer"
          >
            Already have an account? Sign in
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminSetup;