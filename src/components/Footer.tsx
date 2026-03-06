
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-slate-300 p-4 text-center mt-auto">
      <div className="container mx-auto text-sm">
        &copy; {new Date().getFullYear()} סימולטור שאו"ל. כל הזכויות שמורות.
        <p className="mt-1 opacity-70">פותח ככלי עזר חינוכי.</p>
      </div>
    </footer>
  );
};

export default Footer;
