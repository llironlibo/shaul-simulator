
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
      setCurrentError("אנא מלא אימייל וסיסמה.");
      return;
    }
    setIsLoading(true);
    const result = await onLogin(email, password);
    if (!result.success) {
      setCurrentError(result.message);
    }
    // On success, App.tsx will handle navigation
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl space-y-6">
        <h2 className="text-3xl font-bold text-sky-700 text-center">התחברות</h2>
        
        {(currentError || authError) && (
          <div className="p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md">
            <p>{currentError || authError}</p>
          </div>
        )}

        <div>
          <label htmlFor="email-login" className="block text-sm font-medium text-slate-700 mb-1">
            כתובת אימייל
          </label>
          <input
            id="email-login"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500"
            aria-describedby="email-error-login"
          />
        </div>

        <div>
          <label htmlFor="password-login" className="block text-sm font-medium text-slate-700 mb-1">
            סיסמה
          </label>
          <input
            id="password-login"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500"
            aria-describedby="password-error-login"
          />
        </div>

        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
          {isLoading ? 'מתחבר...' : 'התחבר'}
        </Button>

        <p className="text-sm text-center text-slate-600">
          אין לך חשבון?{' '}
          <button
            type="button"
            onClick={onNavigateToRegister}
            className="font-medium text-sky-600 hover:text-sky-500"
          >
            הרשם כאן
          </button>
        </p>
      </form>
    </div>
  );
};

export default LoginScreen;
