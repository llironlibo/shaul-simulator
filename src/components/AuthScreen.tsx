
import React, { useState } from 'react';
import LoginScreen from './LoginScreen';
import RegistrationScreen from './RegistrationScreen';

interface AuthScreenProps {
  onLogin: (email: string, password: string) => Promise<{ success: boolean; message: string; user?: any }>;
  onRegister: (name: string, email: string, phone: string, accessCode: string, password: string) => Promise<{ success: boolean; message: string; user?: any }>;
  authError: string | null;
  initialView?: 'login' | 'register';
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, onRegister, authError, initialView = 'login' }) => {
  const [isRegistering, setIsRegistering] = useState(initialView === 'register');

  return (
    <div className="min-h-[calc(100vh-250px)] flex flex-col items-center justify-center bg-slate-100 py-8">
      {isRegistering ? (
        <RegistrationScreen 
          onRegister={onRegister} 
          onNavigateToLogin={() => setIsRegistering(false)}
          authError={authError} 
        />
      ) : (
        <LoginScreen 
          onLogin={onLogin} 
          onNavigateToRegister={() => setIsRegistering(true)}
          authError={authError}
        />
      )}
       <div className="mt-8 text-center max-w-xl mx-auto p-4 bg-amber-50 border border-amber-200 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-amber-700">ברוכים הבאים לסימולטור שאו"ל!</h3>
          <p className="text-sm text-amber-600 mt-2">
            כדי לגשת לסימולטור, עליך להירשם באמצעות קוד גישה שקיבלת ממנהל המערכת לאחר הסדרת התשלום.
            אם כבר נרשמת, תוכל להתחבר עם האימייל והסיסמה שלך.
          </p>
          <p className="text-xs text-amber-500 mt-3">
            שימו לב: זוהי מערכת סגורה. קודי גישה ניתנים באופן ידני.
          </p>
        </div>
    </div>
  );
};

export default AuthScreen;
