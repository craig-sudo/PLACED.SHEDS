
import React, { useState } from 'react';
import { ServiceType } from '../types';

interface LightsQuoteFormProps {
  onBack: () => void;
}

const PRICE_PER_FOOT = 7.50;

export const LightsQuoteForm: React.FC<LightsQuoteFormProps> = ({ onBack }) => {
  const [linearFeet, setLinearFeet] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [quote, setQuote] = useState<number | null>(null);

  const handleCalculate = () => {
    const feet = parseFloat(linearFeet);
    if (!feet || feet <= 0) {
      setError('Roof Lines Linear Feet is required to calculate a price. Please enter a positive number.');
      setQuote(null);
      return;
    }
    setError(null);
    const calculatedQuote = feet * PRICE_PER_FOOT;
    setQuote(calculatedQuote);
  };

  return (
    <div className="text-center bg-white p-8 sm:p-12 rounded-lg shadow-md max-w-2xl mx-auto">
      <button onClick={onBack} className="mb-8 text-blue-600 hover:underline flex items-center">
        &larr; Back to Services
      </button>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">{ServiceType.Lights}</h2>
      <p className="text-gray-600 mb-8">
        Enter the total linear feet of your roof lines to get an instant estimate. Our pricing includes professional installation, takedown, and storage.
      </p>

      <div className="max-w-sm mx-auto">
          <label htmlFor="linearFeet" className="block text-sm font-medium text-gray-700 text-left mb-1">
            Roof Lines Linear Feet
          </label>
          <input
            type="number"
            id="linearFeet"
            value={linearFeet}
            onChange={(e) => {
                setLinearFeet(e.target.value);
                if (error) setError(null);
                if (quote) setQuote(null);
            }}
            placeholder="e.g., 150"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              error ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'
            }`}
            aria-describedby="feet-error"
          />
          {error && <p id="feet-error" className="mt-2 text-sm text-red-600 text-left">{error}</p>}
      </div>

      <div className="mt-6">
        <button
            onClick={handleCalculate}
            className="w-full max-w-sm bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300"
        >
            Calculate Instant Estimate
        </button>
      </div>

      {quote !== null && (
        <div className="mt-8 p-6 bg-blue-50 border-t-4 border-blue-500 rounded-b-lg">
            <p className="text-lg text-gray-700">Estimated Price:</p>
            <p className="text-4xl font-extrabold text-blue-900">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(quote)}
            </p>
            <p className="text-sm text-gray-600 mt-2">This is an estimate. A final quote will be provided after a site review.</p>
        </div>
      )}
    </div>
  );
};
