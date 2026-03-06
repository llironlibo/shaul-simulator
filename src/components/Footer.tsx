
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-4 px-4 text-center mt-auto">
      <div className="container mx-auto text-sm">
        &copy; {new Date().getFullYear()} סימולטור שאו"ל &middot; כלי עזר חינוכי להכנה למבחן האישיות
      </div>
    </footer>
  );
};

export default Footer;
