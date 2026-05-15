'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Eye, EyeOff, Lock, Mail, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useAuth } from '@/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';

const cardVariants = {
  initial: { opacity: 0, y: 50, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const auth = useAuth();

  const validate = () => {
    let tempErrors = { email: '', password: '' };
    let isValid = true;

    if (!email) {
      tempErrors.email = 'Email is required.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Email is not valid.';
      isValid = false;
    }

    if (!password) {
      tempErrors.password = 'Password is required.';
      isValid = false;
    } else if (password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters.';
      isValid = false;
    }
    
    setErrors(tempErrors);
    return isValid;
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setErrors(prev => ({...prev, email: 'Please enter your email to reset password.'}));
      toast({
        variant: 'destructive',
        title: 'Email Required',
        description: 'Please enter your email address first.',
      });
      return;
    }
    if (!auth) return;

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: 'Password Reset Email Sent',
        description: 'Please check your inbox to reset your password.',
      });
    } catch (error: any) {
      let description = 'Could not send password reset email. Please ensure the email is correct.';
      if (error.code === 'auth/user-not-found') {
        description = 'No account found with this email address.';
      }
      toast({
        variant: 'destructive',
        title: 'Reset Failed',
        description: description,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !auth) return;
    
    setIsLoading(true);
    
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        toast({
          title: 'Account Created',
          description: "Please check your email to verify your account.",
        });
        setIsLoading(false);
        setIsSignUp(false);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({
          title: 'Login Successful',
          description: "Welcome back!",
        });
        router.push('/dashboard');
      }
    } catch (error: any) {
      let title = isSignUp ? 'Sign Up Failed' : 'Login Failed';
      let description = 'An unexpected error occurred. Please try again.';

      switch (error.code) {
        case 'auth/email-already-in-use':
          setIsSignUp(false);
          title = 'Account Exists';
          description = 'This email is already registered. Please sign in instead.';
          break;
        case 'auth/weak-password':
          description = 'The password is too weak. It must be at least 6 characters long.';
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          description = 'Invalid email or password. Please check your credentials and try again.';
          break;
      }
        
      toast({
        variant: 'destructive',
        title: title,
        description: description,
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden">
        <div className="absolute inset-0 -z-10 h-full w-full bg-black bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem]"/>
        <div className="absolute top-0 z-[-2] h-screen w-screen bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,hsl(var(--primary)/0.15),rgba(255,255,255,0))]"></div>
      
      <motion.div
        variants={cardVariants}
        initial="initial"
        animate="animate"
      >
        <Card className="w-full max-w-md bg-card/60 backdrop-blur-xl border-white/10 shadow-2xl shadow-black/40">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
            <Image src="/icons/logo.png" alt="PragyanAI Logo" width={80} height={80} priority style={{ height: 'auto' }} />
            </div>
            <CardTitle className="text-3xl font-bold font-headline">{isSignUp ? 'Create an Account' : 'Welcome Back'}</CardTitle>
            <CardDescription>{isSignUp ? 'Fill in the details to get started.' : 'Sign in to access your AI toolkit'}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={cn("pl-10 bg-transparent", errors.email && "border-destructive")}
                    required
                    disabled={isLoading}
                  />
                </div>
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={cn("pl-10 pr-10 bg-transparent", errors.password && "border-destructive")}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
              </div>
              {!isSignUp && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Checkbox id="remember-me" disabled={isLoading} />
                    <Label htmlFor="remember-me" className="font-normal">Remember me</Label>
                  </div>
                  <button type="button" onClick={handleForgotPassword} className="text-primary hover:underline font-medium" disabled={isLoading}>
                    Forgot password?
                  </button>
                </div>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  isSignUp ? 'Sign Up' : 'Sign In'
                )}
              </Button>
            </form>
            
            <p className="mt-6 text-center text-sm text-muted-foreground">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button onClick={() => setIsSignUp(!isSignUp)} className="text-primary hover:underline font-medium" disabled={isLoading}>
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
