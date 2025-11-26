import React, { useState } from 'react';
import { User } from '../types';

interface LoginPageProps {
  onLoginSuccess: (email: string) => void;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, users, setUsers }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLoginView) {
      // --- LOGIN LOGIC ---
      const user = users.find(u => u.email === email);
      if (user && user.password === password) {
        onLoginSuccess(user.email);
      } else {
        // For backward compatibility with the demo account if no users are registered yet
        if (users.length === 0 && email === 'user@example.com' && password === 'password123') {
           // Create the demo user on first login
           const demoUser = { email: 'user@example.com', name: 'Demo User', password: 'password123' };
           setUsers([demoUser]);
           onLoginSuccess(demoUser.email);
        } else {
           setError('Invalid credentials. Please try again.');
        }
      }
    } else {
      // --- SIGN UP LOGIC ---
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (password.length < 8) {
        setError("Password must be at least 8 characters long.");
        return;
      }
      // Check if user already exists
      if (users.some(u => u.email === email)) {
        setError("An account with this email already exists.");
        return;
      }
      
      const newUser: User = { name, email, password };
      setUsers(prevUsers => [...prevUsers, newUser]);
      onLoginSuccess(email);
    }
  };

  const handleSocialLogin = (userEmail: string, userName: string) => {
    const existingUser = users.find(u => u.email === userEmail);
    if (!existingUser) {
        const newUser: User = { email: userEmail, name: userName, password: 'social_login' };
        setUsers(prev => [...prev, newUser]);
    }
    onLoginSuccess(userEmail);
  };

  const handleGoogleLogin = () => {
    handleSocialLogin('google.user@example.com', 'Google User');
  };

  const handleAppleLogin = () => {
    handleSocialLogin('apple.user@example.com', 'Apple User');
  };

  const handleBiometricLogin = async () => {
    if ('PublicKeyCredential' in window) {
      console.log("WebAuthn is available. Simulating biometric login.");
      handleSocialLogin('biometric.user@example.com', 'Biometric User');
    } else {
      setError("Biometric authentication is not supported on this browser.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="flex flex-col items-center">
          <div className="flex items-center space-x-2 mb-2">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
            </svg>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">SpendSense</h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400">Welcome! Please sign in or create an account.</p>
        </div>

        <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
                onClick={() => { setIsLoginView(true); setError(''); }}
                className={`w-1/2 py-3 text-sm font-medium transition-colors focus:outline-none ${isLoginView ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
            >
                Sign In
            </button>
            <button
                onClick={() => { setIsLoginView(false); setError(''); }}
                className={`w-1/2 py-3 text-sm font-medium transition-colors focus:outline-none ${!isLoginView ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
            >
                Sign Up
            </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLoginView && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
              <input
                id="name" name="name" type="text" autoComplete="name" required
                value={name} onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="John Doe"
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
            <input
              id="email" name="email" type="email" autoComplete="email" required
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="user@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              id="password" name="password" type="password" autoComplete="current-password" required
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder={isLoginView ? "password123" : "8+ characters"}
            />
          </div>
          {!isLoginView && (
            <div>
              <label htmlFor="confirm-password"className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
              <input
                id="confirm-password" name="confirm-password" type="password" required
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Re-enter your password"
              />
            </div>
          )}

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isLoginView ? 'Sign In' : 'Create Account'}
            </button>
          </div>
        </form>

        <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            <span className="flex-shrink mx-4 text-xs text-gray-400 dark:text-gray-500 uppercase">Or continue with</span>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
        </div>

        <div className="space-y-4">
            <button
                type="button" onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l8.35 6.51C12.73 13.72 17.94 9.5 24 9.5z"></path><path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6.02C43.51 38.07 46.98 32.07 46.98 24.55z"></path><path fill="#FBBC05" d="M10.91 28.73c-1.3-3.92-1.3-8.19 0-12.11l-8.35-6.51C.91 14.12 0 18.88 0 24c0 5.12.91 9.88 2.56 14.27l8.35-6.54z"></path><path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.82l-7.73-6.02c-2.15 1.45-4.92 2.3-8.16 2.3-6.06 0-11.27-4.22-13.09-9.97l-8.35 6.51C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path>
                </svg>
                Continue with Google
            </button>
            <button
                type="button" onClick={handleAppleLogin}
                className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M18.82 17.54C17.75 18.6 16.53 20 14.82 20C13.11 20 12.55 18.99 11.18 18.99C9.81 18.99 9.25 20 7.54 20C5.83 20 4.61 18.6 3.54 17.54C1.6 15.62 1.12 11.66 2.87 9.1C3.76 7.8 5.18 7 6.89 7C8.6 7 9.16 8.01 10.53 8.01C11.9 8.01 12.46 7 14.24 7C15.95 7 16.92 7.8 17.81 9.1C19.32 11.23 19.58 14.6 18.82 17.54ZM13.82 4.99C13.82 3.81 14.7 3 15.82 3C16.94 3 17.82 3.81 17.82 4.99C17.82 6.17 16.94 6.98 15.82 6.98C14.7 6.98 13.82 6.17 13.82 4.99Z"/></svg>
                Continue with Apple
            </button>
            <button
                type="button" onClick={handleBiometricLogin}
                className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.246.99-4.659.99-7.132A8 8 0 008 4a8 8 0 00-8 8c0 2.472.345 4.886.99 7.132m20.02 0a21.88 21.88 0 00-3.84-1.132M4 17c.645-2.246.99-4.659.99-7.132a8 8 0 018-8 8 8 0 018 8c0 2.472-.345 4.886-.99 7.132" /></svg>
                Continue with Biometrics
            </button>
        </div>

        {isLoginView && (
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              <p>No account yet? Switch to "Sign Up".</p>
              <p>For a quick demo, try:</p>
              <p>Email: <strong>user@example.com</strong> / Pass: <strong>password123</strong></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;