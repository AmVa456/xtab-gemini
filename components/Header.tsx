import React from 'react';

const PaletteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    {...props}
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle>
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle>
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle>
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.667 0-.422-.02-.833-.052-1.234-.4-3.14 1.89-6.42 5.04-6.42h.01c2.29 0 4.37 1.56 4.37 4.37 0 1.43-1.09 2.1-1.09 2.1"></path>
  </svg>
);


const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/70 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-3">
          <PaletteIcon className="w-8 h-8 text-sky-400" />
          <h1 className="text-2xl font-bold text-slate-50 tracking-tight">
            Gemini Design Studio
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;