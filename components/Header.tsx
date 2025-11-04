
import React from 'react';
import { WrenchIcon } from './icons/WrenchIcon';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <WrenchIcon className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">PLACED</h1>
        </div>
        <p className="text-gray-500 hidden sm:block">Your AI-Powered Shed Builder</p>
      </div>
    </header>
  );
};
