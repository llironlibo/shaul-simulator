
import React, { useState } from 'react';
import Button from './Button';

interface RegistrationScreenProps {
  onRegister: (name: string, email: string, phone: string, accessCode: string, password: string) => Promise<{ success: boolean; message: string }>;
  onNavigateToLogin: () => void;
  authError: string | null;
}

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ onRegister, onNavigateToLogin, authError }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentError, setCurrentError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentError(null);
    if (!name || !email || !accessCode || !password || !confirmPassword) {
      setCurrentError("אנא מלא את כל שדות החובה.");
      return;
    }
    if (password !== confirmPassword) {
      setCurrentError("הסיסמאות אינן תואמות.");
      return;
    }
    // Basic password strength check (example)
    if (password.length < 6) {
      setCurrentError("הסיסמה חייבת להכיל לפחות 6 תווים.");
      return;
    }

    setIsLoading(true);
    const result = await onRegister(name, email, phone, accessCode, password);
    if (!result.success) {
      setCurrentError(result.message);
    }
    // On success, App.tsx will handle navigation
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-8 rounded-xl shadow-2xl space-y-5">
        <h2 className="text-3xl font-bold text-sky-700 text-center">הרשמה</h2>
        
        {(currentError || authError) && (
          <div className="p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md">
            <p>{currentError || authError}</p>
          </div>
        )}

        <div>
          <label htmlFor="name-register" className="block text-sm font-medium text-slate-700 mb-1">
            שם מלא
          </label>
          <input
            id="name-register"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500"
          />
        </div>

        <div>
          <label htmlFor="email-register" className="block text-sm font-medium text-slate-700 mb-1">
            כתובת אימייל (תשמש כשם משתמש)
          </label>
          <input
            id="email-register"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500"
          />
        </div>
        
        <div>
          <label htmlFor="phone-register" className="block text-sm font-medium text-slate-700 mb-1">
            מספר טלפון (אופציונלי)
          </label>
          <input
            id="phone-register"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500"
          />
        </div>

        <div>
          <label htmlFor="access-code-register" className="block text-sm font-medium text-slate-700 mb-1">
            קוד גישה
          </label>
          <input
            id="access-code-register"
            type="text"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
            required
            className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500"
            placeholder="לדוגמה: SHAUL-XXXX-YYYY"
          />
           <p className="text-xs text-slate-500 mt-1">קוד הגישה ניתן לך על ידי מנהל המערכת לאחר התשלום.</p>
        </div>
        
        <div>
          <label htmlFor="password-register" className="block text-sm font-medium text-slate-700 mb-1">
            סיסמה (לפחות 6 תווים)
          </label>
          <input
            id="password-register"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500"
          />
        </div>

        <div>
          <label htmlFor="confirm-password-register" className="block text-sm font-medium text-slate-700 mb-1">
            אימות סיסמה
          </label>
          <input
            id="confirm-password-register"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500"
          />
        </div>

        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
          {isLoading ? 'מרשם...' : 'הירשם'}
        </Button>

        <p className="text-sm text-center text-slate-600">
          יש לך כבר חשבון?{' '}
          <button
            type="button"
            onClick={onNavigateToLogin}
            className="font-medium text-sky-600 hover:text-sky-500"
          >
            התחבר כאן
          </button>
        </p>
         <p className="text-xs text-slate-500 mt-4 text-center">
          <strong>הערה חשובה:</strong> מערכת זו מאחסנת סיסמאות באופן מאובטח באופן מוגבל בצד הלקוח בלבד. אין להשתמש בסיסמה זו באתרים אחרים.
        </p>
      </form>
    </div>
  );
};

export default RegistrationScreen;
