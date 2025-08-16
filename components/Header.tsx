
import React from 'react';

const CodeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/70 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-3">
          <CodeIcon className="w-8 h-8 text-sky-400" />
          <h1 className="text-2xl font-bold text-slate-50 tracking-tight">
            AI Code Reviewer
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
