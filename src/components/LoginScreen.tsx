
import React, { useState } from 'react';
import Button from './Button';

interface LoginScreenProps {
  onLogin: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  onNavigateToRegister: () => void;
  authError: string | null;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onNavigateToRegister, authError }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentError, setCurrentError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentError(null);
    if (!email || !password) {
      setCurrentError("...");
      return;
    }
    setIsLoading(true);
    const result = await onLogin(email, password);
    if (!result.success) {
      setCurrentError(result.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-5">
        <h2 className="text-2xl font-bold text-slate-800 text-center">
          התחברות
        </h2>

        {(currentError || authError) && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {currentError || authError}
          </div>
        )}

        <div>
          <label htmlFor="email-login" className="block text-sm font-medium text-slate-600 mb-1">
            כתובת אימייל
          </label>
          <input
            id="email-login"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password-login" className="block text-sm font-medium text-slate-600 mb-1">
            סיסמה
          </label>
          <input
            id="password-login"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
          {isLoading ? '...' : 'התחבר'}
        </Button>

        <p className="text-sm text-center text-slate-500">
          אין לך חשבון?{' '}
          <button type="button" onClick={onNavigateToRegister} className="font-semibold text-brand-600 hover:text-brand-500">
            הרשם כאן
          </button>
        </p>
      </form>
    </div>
  );
};

export default LoginScreen;
