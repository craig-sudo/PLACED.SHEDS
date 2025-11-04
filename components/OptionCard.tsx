
import React from 'react';
import { Option } from '../types';
import { CheckIcon } from './icons/CheckIcon';

interface OptionCardProps {
  option: Option;
  isSelected: boolean;
  onSelect: () => void;
  isAddon?: boolean;
}

export const OptionCard: React.FC<OptionCardProps> = ({ option, isSelected, onSelect, isAddon = false }) => {
  const formatPrice = (price: number) => {
    if (price === 0) return 'Included';
    return `+${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price)}`;
  };
  
  if (isAddon) {
    return (
      <label
        className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
          isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-300'
        }`}
      >
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-3 font-medium text-gray-700">{option.name}</span>
        </div>
        <span className="text-sm font-semibold text-gray-600">{formatPrice(option.price)}</span>
      </label>
    );
  }

  return (
    <div
      onClick={onSelect}
      className={`relative border-2 rounded-lg cursor-pointer transition-all duration-200 overflow-hidden ${
        isSelected ? 'border-blue-500 shadow-lg' : 'border-gray-200 bg-white hover:shadow-md hover:border-blue-300'
      }`}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1 z-10">
          <CheckIcon className="w-4 h-4" />
        </div>
      )}
      {option.image && <img src={option.image} alt={option.name} className="w-full h-32 object-cover" />}
      <div className="p-4">
        <h3 className="font-bold text-gray-800">{option.name}</h3>
        {option.description && <p className="text-sm text-gray-500 mt-1">{option.description}</p>}
        <p className="mt-2 text-sm font-semibold text-blue-600">{formatPrice(option.price)}</p>
      </div>
    </div>
  );
};
