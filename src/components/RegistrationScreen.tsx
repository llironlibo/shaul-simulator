
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
      setCurrentError("...");
      return;
    }
    if (password !== confirmPassword) {
      setCurrentError("...");
      return;
    }
    if (password.length < 6) {
      setCurrentError("...");
      return;
    }

    setIsLoading(true);
    const result = await onRegister(name, email, phone, accessCode, password);
    if (!result.success) {
      setCurrentError(result.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-lg space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 text-center">הרשמה</h2>

        {(currentError || authError) && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {currentError || authError}
          </div>
        )}

        <div>
          <label htmlFor="name-register" className="block text-sm font-medium text-slate-600 mb-1">שם מלא</label>
          <input id="name-register" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div>
          <label htmlFor="email-register" className="block text-sm font-medium text-slate-600 mb-1">כתובת אימייל</label>
          <input id="email-register" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div>
          <label htmlFor="phone-register" className="block text-sm font-medium text-slate-600 mb-1">
            מספר טלפון <span className="text-slate-400">(אופציונלי)</span>
          </label>
          <input id="phone-register" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>

        <div>
          <label htmlFor="access-code-register" className="block text-sm font-medium text-slate-600 mb-1">קוד גישה</label>
          <input
            id="access-code-register"
            type="text"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
            required
            placeholder="SHAUL-XXXX-YYYY"
          />
          <p className="text-xs text-slate-400 mt-1">הקוד מתקבל ממנהל המערכת לאחר הסדרת תשלום.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="password-register" className="block text-sm font-medium text-slate-600 mb-1">סיסמה</label>
            <input id="password-register" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="6 תווים לפחות" />
          </div>
          <div>
            <label htmlFor="confirm-password-register" className="block text-sm font-medium text-slate-600 mb-1">אימות סיסמה</label>
            <input id="confirm-password-register" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
        </div>

        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
          {isLoading ? '...' : 'הירשם'}
        </Button>

        <p className="text-sm text-center text-slate-500">
          יש לך חשבון?{' '}
          <button type="button" onClick={onNavigateToLogin} className="font-semibold text-brand-600 hover:text-brand-500">
            התחבר כאן
          </button>
        </p>
      </form>
    </div>
  );
};

export default RegistrationScreen;
