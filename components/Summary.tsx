import React, { useState } from 'react';
import { ShedConfig } from '../types';
import { DollarSignIcon } from './icons/DollarSignIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { generateShedDescription } from '../services/geminiService';

interface SummaryProps {
  config: ShedConfig;
  totalPrice: number;
  onGenerateBuildOrder: () => void;
  isBuildOrderLoading: boolean;
  isReviewStep: boolean;
}

export const Summary: React.FC<SummaryProps> = ({ config, totalPrice, onGenerateBuildOrder, isBuildOrderLoading, isReviewStep }) => {
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [shedDescription, setShedDescription] = useState<string | null>(null);

  const handleGenerateDescription = async () => {
    setIsGeneratingDescription(true);
    setShedDescription(null);
    const result = await generateShedDescription(config);
    setShedDescription(result);
    setIsGeneratingDescription(false);
  };

  const renderLineItem = (label: string, value: string | null | undefined, price: number | undefined) => {
    if (!value) return null;
    return (
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">{label}: {value}</span>
        {price ? <span className="font-medium text-gray-800">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)}</span> : null}
      </div>
    );
  };

  const isComplete = config.size && config.style && config.siding && config.roof;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg sticky top-8">
      <h3 className="text-xl font-bold text-gray-900 border-b pb-3 mb-4">Your Custom Shed</h3>
      <div className="space-y-3">
        {renderLineItem('Size', config.size?.name, config.size?.price)}
        {renderLineItem('Style', config.style?.name, config.style?.price)}
        {renderLineItem('Siding', config.siding?.name, config.siding?.price)}
        {renderLineItem('Roof', config.roof?.name, config.roof?.price)}
        
        {config.addons.length > 0 && (
          <div>
            <h4 className="font-semibold mt-4 mb-2 text-gray-700">Add-ons:</h4>
            <div className="space-y-2 pl-2 border-l-2">
              {config.addons.map(addon => renderLineItem(addon.name, '', addon.price))}
            </div>
          </div>
        )}
      </div>
      
      <div className="pt-4 border-t-2 border-dashed mt-6">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-800">Total Price:</span>
          <span className="text-2xl font-bold text-blue-600">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalPrice)}
          </span>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {isReviewStep ? (
          <>
            <div>
              <button
                onClick={handleGenerateDescription}
                disabled={isGeneratingDescription || !isComplete}
                className="w-full bg-purple-100 text-purple-700 font-semibold py-2 px-4 rounded-lg border border-purple-200 hover:bg-purple-200 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all duration-300 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isGeneratingDescription ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Writing...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    Generate AI Description
                  </>
                )}
              </button>
              {shedDescription && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
                      <p className="text-sm text-gray-700 italic">"{shedDescription}"</p>
                  </div>
              )}
            </div>
            <div>
              <button
                onClick={onGenerateBuildOrder}
                disabled={!isComplete || isBuildOrderLoading}
                className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isBuildOrderLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <DollarSignIcon className="w-5 h-5 mr-2" />
                    Generate Build Order
                  </>
                )}
              </button>
              <p className="text-xs text-gray-500 mt-2 text-center">Finalize your selections to generate a detailed build order & quote.</p>
            </div>
          </>
        ) : (
            <p className="text-sm text-gray-500 mt-2 text-center h-[52px] flex items-center justify-center">Complete all steps to generate a build order.</p>
        )}
      </div>
    </div>
  );
};