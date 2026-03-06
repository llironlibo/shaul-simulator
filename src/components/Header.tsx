
import React from 'react';
import Button from './Button'; // Assuming Button component is in the same directory or adjust path

interface HeaderProps {
  currentUser?: { name: string } | null;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout }) => {
  return (
    <header className="bg-gradient-to-r from-sky-600 to-cyan-500 text-white p-4 sm:p-6 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">סימולטור שאו"ל – הכנה מבוססת אישיות</h1>
          <p className="text-xs sm:text-sm opacity-90 mt-1 hidden sm:block">הכלי שלך להבנה עמוקה והצלחה במבחן האישיות</p>
        </div>
        {currentUser && onLogout && (
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <span className="text-sm hidden sm:inline">שלום, {currentUser.name}</span>
            <Button onClick={onLogout} variant="secondary" size="sm" className="!bg-sky-100 !text-sky-700 hover:!bg-sky-200">
              התנתק
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
