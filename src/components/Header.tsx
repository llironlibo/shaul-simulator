
import React from 'react';
import Button from './Button';

interface HeaderProps {
  currentUser?: { name: string } | null;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout }) => {
  return (
    <header className="bg-gradient-to-l from-brand-700 to-brand-900 text-white py-4 px-4 sm:px-6 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            סימולטור שאו"ל
          </h1>
          <p className="text-xs sm:text-sm text-brand-200 mt-0.5 hidden sm:block">
            הכנה מבוססת אישיות למבחן הקבלה
          </p>
        </div>
        {currentUser && onLogout && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-brand-200 hidden sm:inline">{currentUser.name}</span>
            <Button onClick={onLogout} variant="ghost" size="sm" className="!text-brand-200 hover:!text-white hover:!bg-brand-700/50">
              התנתק
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
