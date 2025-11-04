
import React from 'react';
import { ServiceType } from '../types';
import { LightIcon } from './icons/LightIcon';
import { ShedIcon } from './icons/ShedIcon';
import { RoofIcon } from './icons/RoofIcon';
import { GutterIcon } from './icons/GutterIcon';

interface ServiceSelectionProps {
  onSelect: (service: ServiceType) => void;
}

const services = [
  {
    type: ServiceType.Lights,
    icon: <LightIcon className="h-10 w-10 text-blue-500 mb-4" />,
    title: 'Worry-Free Holiday Lights',
    description: 'Full-service installation, maintenance, takedown, and storage for commercial-grade displays.',
  },
  {
    type: ServiceType.Shed,
    icon: <ShedIcon className="h-10 w-10 text-blue-500 mb-4" />,
    title: 'Custom Shed Builder',
    description: 'Design and build your perfect backyard structure. End-to-end service including permits and foundation.',
  },
  {
    type: ServiceType.Roofing,
    icon: <RoofIcon className="h-10 w-10 text-blue-500 mb-4" />,
    title: 'Drone Roof Inspections',
    description: 'Comprehensive, AI-analyzed report of your roof’s condition without anyone setting foot on it. Safe, fast, and thorough.',
  },
  {
    type: ServiceType.Maintenance,
    icon: <GutterIcon className="h-10 w-10 text-blue-500 mb-4" />,
    title: 'Gutter Cleaning & Maintenance',
    description: 'Protect your home from water damage. We ensure your gutters are clear and functioning perfectly for NB winters.',
  },
];

export const ServiceSelection: React.FC<ServiceSelectionProps> = ({ onSelect }) => {
  return (
    <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to PLACED</h2>
        <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">Your one-stop solution for premium home services. Select a service below to get started.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
                <div
                    key={service.title}
                    onClick={() => onSelect(service.type)}
                    className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col items-center"
                >
                    {service.icon}
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{service.title}</h3>
                    <p className="text-sm text-gray-500 flex-grow">{service.description}</p>
                </div>
            ))}
        </div>
    </div>
  );
};
