
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
    <div className="min-h-[calc(100vh-250px)] flex flex-col items-center justify-center py-8">
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
      <div className="mt-6 text-center max-w-md mx-auto px-4">
        <p className="text-xs text-slate-400">
          מערכת סגורה. קודי גישה ניתנים באופן אישי לאחר הסדרת תשלום.
        </p>
      </div>
    </div>
  );
};

export default AuthScreen;
