
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="w-full py-6 px-4 md:px-8 border-b border-border/40 bg-white/80 backdrop-blur-md sticky top-0 z-10 animate-fade-in">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold shadow-md">
            C
          </div>
          <h1 className="text-xl font-semibold tracking-tight">CryptoView</h1>
        </div>
        
        {!isHome && (
          <Link 
            to="/" 
            className="text-sm font-medium px-4 py-2 rounded-lg hover:bg-secondary transition-colors"
          >
            Back to Assets
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
