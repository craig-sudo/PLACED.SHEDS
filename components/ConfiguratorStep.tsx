
import React from 'react';
import { Option } from '../types';
import { OptionCard } from './OptionCard';

interface ConfiguratorStepProps {
  title: string;
  description: string;
  options: Option[];
  selected: Option | Option[] | null;
  onSelect: (option: Option) => void;
  isMultiSelect?: boolean;
}

export const ConfiguratorStep: React.FC<ConfiguratorStepProps> = ({ title, description, options, selected, onSelect, isMultiSelect = false }) => {
  const isSelected = (option: Option) => {
    if (isMultiSelect && Array.isArray(selected)) {
      return selected.some(item => item.id === option.id);
    }
    return (selected as Option)?.id === option.id;
  };

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <p className="mt-1 text-gray-600">{description}</p>
      <div className={`mt-6 grid gap-4 ${isMultiSelect ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2 md:grid-cols-3'}`}>
        {options.map((option) => (
          <OptionCard
            key={option.id}
            option={option}
            isSelected={isSelected(option)}
            onSelect={() => onSelect(option)}
            isAddon={isMultiSelect}
          />
        ))}
      </div>
    </div>
  );
};
