
import React, { useState, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { ConfiguratorStep } from './components/ConfiguratorStep';
import { Summary } from './components/Summary';
import { ShedConfig, Option, ServiceType } from './types';
import { SIZES, STYLES, SIDING_OPTIONS, ROOF_OPTIONS, ADDONS } from './constants';
import { generateBuildOrder } from './services/geminiService';
import { ServiceSelection } from './components/ServiceSelection';
import { LightsQuoteForm } from './components/LightsQuoteForm';
import { marked } from 'marked';

// --- Helper Components defined in-file ---

const ChevronRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
);

interface StepperProps {
  steps: string[];
  currentStep: number;
  onStepClick: (stepIndex: number) => void;
}
  
const Stepper: React.FC<StepperProps> = ({ steps, currentStep, onStepClick }) => {
  return (
    <nav className="flex mb-8 overflow-x-auto pb-2" aria-label="Progress">
      <ol role="list" className="flex items-center space-x-2 sm:space-x-4">
        {steps.map((step, index) => (
          <li key={step}>
            <div className="flex items-center">
              <button
                onClick={() => onStepClick(index)}
                disabled={index >= currentStep}
                className={`text-sm font-medium whitespace-nowrap disabled:cursor-not-allowed ${
                  index === currentStep
                    ? 'text-blue-600'
                    : index < currentStep
                    ? 'text-gray-500 hover:text-gray-700'
                    : 'text-gray-400'
                }`}
              >
                {step}
              </button>
              {index < steps.length - 1 && (
                <ChevronRightIcon className="ml-2 sm:ml-4 h-5 w-5 text-gray-300 flex-shrink-0" aria-hidden="true" />
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

const ReviewItem: React.FC<{title: string, selection: Option | null, onEdit: () => void}> = ({ title, selection, onEdit }) => (
    <div>
        <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <button onClick={onEdit} className="text-sm font-medium text-blue-600 hover:underline">Change</button>
        </div>
        {selection ? (
            <div className="mt-2 p-4 bg-gray-100 rounded-lg flex items-center justify-between">
                <div>
                    <p className="font-medium text-gray-900">{selection.name}</p>
                    {selection.description && <p className="text-sm text-gray-500">{selection.description}</p>}
                </div>
                <p className="font-semibold text-gray-800">
                    {selection.price > 0 ? `+${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(selection.price)}` : 'Included'}
                </p>
            </div>
        ) : (
             <div className="mt-2 p-4 bg-gray-100 rounded-lg">
                <p className="text-gray-500">No selection made.</p>
            </div>
        )}
    </div>
);

const ReviewAddons: React.FC<{title: string, selections: Option[], onEdit: () => void}> = ({ title, selections, onEdit }) => (
    <div>
        <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <button onClick={onEdit} className="text-sm font-medium text-blue-600 hover:underline">Change</button>
        </div>
        <div className="mt-2 p-4 bg-gray-100 rounded-lg">
            {selections.length > 0 ? (
                <ul className="space-y-2">
                    {selections.map(addon => (
                        <li key={addon.id} className="flex justify-between items-center">
                            <span className="text-gray-900">{addon.name}</span>
                            <span className="font-semibold text-gray-800">
                                +{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(addon.price)}
                            </span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">No add-ons selected.</p>
            )}
        </div>
    </div>
);

// --- Main App Component ---

const App: React.FC = () => {
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);

  const initialConfig: ShedConfig = {
    size: null,
    style: null,
    siding: null,
    roof: null,
    addons: [],
  };

  const [config, setConfig] = useState<ShedConfig>(initialConfig);
  const [currentStep, setCurrentStep] = useState(0);
  
  const [isLoading, setIsLoading] = useState(false);
  const [buildOrder, setBuildOrder] = useState<string | null>(null);

  const handleSelect = useCallback((category: keyof Omit<ShedConfig, 'addons'>, option: Option) => {
    setConfig(prev => ({ ...prev, [category]: option }));
  }, []);

  const handleAddonSelect = useCallback((addon: Option) => {
    setConfig(prev => {
      const isSelected = prev.addons.some(a => a.id === addon.id);
      if (isSelected) {
        return { ...prev, addons: prev.addons.filter(a => a.id !== addon.id) };
      } else {
        return { ...prev, addons: [...prev.addons, addon] };
      }
    });
  }, []);

  const totalPrice = useMemo(() => {
    let total = 0;
    if (config.size) total += config.size.price;
    if (config.style) total += config.style.price;
    if (config.siding) total += config.siding.price;
    if (config.roof) total += config.roof.price;
    config.addons.forEach(addon => {
      total += addon.price;
    });
    return total;
  }, [config]);
  
  const handleGenerateBuildOrder = async () => {
    setIsLoading(true);
    setBuildOrder(null);
    const result = await generateBuildOrder(config, totalPrice);
    setBuildOrder(result);
    setIsLoading(false);
  };
  
  const handleServiceSelection = (service: ServiceType) => {
    setConfig(initialConfig);
    setBuildOrder(null);
    setCurrentStep(0);
    setSelectedService(service);
  }

  const configuratorSteps = [
    { title: '1. Choose Your Size', description: 'Select the base model and footprint for your new shed.', options: SIZES, selected: config.size, onSelect: (opt: Option) => handleSelect('size', opt) },
    { title: '2. Select a Style', description: 'Customize the look and feel of your shed.', options: STYLES, selected: config.style, onSelect: (opt: Option) => handleSelect('style', opt) },
    { title: '3. Pick Your Siding', description: 'Choose the material for your shed\'s exterior.', options: SIDING_OPTIONS, selected: config.siding, onSelect: (opt: Option) => handleSelect('siding', opt) },
    { title: '4. Choose a Roof', description: 'Select roofing material for durability and style.', options: ROOF_OPTIONS, selected: config.roof, onSelect: (opt: Option) => handleSelect('roof', opt) },
    { title: '5. Add Your Options', description: 'Fully customize your shed with functional and aesthetic add-ons.', options: ADDONS, selected: config.addons, onSelect: handleAddonSelect, isMultiSelect: true },
  ];
  const stepNames = ['Size', 'Style', 'Siding', 'Roof', 'Add-ons', 'Review'];

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, stepNames.length - 1));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 0));
  const handleStepClick = (stepIndex: number) => setCurrentStep(stepIndex);

  const isNextDisabled = useMemo(() => {
    switch (currentStep) {
      case 0: return !config.size;
      case 1: return !config.style;
      case 2: return !config.siding;
      case 3: return !config.roof;
      default: return false;
    }
  }, [currentStep, config]);

  const renderContent = () => {
    if (!selectedService) {
      return <ServiceSelection onSelect={handleServiceSelection} />;
    }

    if (selectedService === ServiceType.Shed) {
      const isReviewStep = currentStep === configuratorSteps.length;

      return (
        <>
          <button onClick={() => setSelectedService(null)} className="mb-4 text-blue-600 hover:underline">
            &larr; Back to Services
          </button>
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            <div className="lg:col-span-2">
              <Stepper steps={stepNames} currentStep={currentStep} onStepClick={handleStepClick} />
              
              <div className="min-h-[400px] bg-white p-1 sm:p-4 rounded-lg shadow-inner border border-gray-100">
                {!isReviewStep ? (
                  <ConfiguratorStep
                    key={configuratorSteps[currentStep].title}
                    {...configuratorSteps[currentStep]}
                  />
                ) : (
                  <div className="p-4 sm:p-6">
                    <h2 className="text-2xl font-bold text-gray-900">Review Your Custom Shed</h2>
                    <p className="mt-2 text-gray-600">You're almost there! Please review your final selections below. When you're ready, generate your build order from the summary panel.</p>
                    
                    <div className="mt-8 space-y-6">
                      <ReviewItem title="Size" selection={config.size} onEdit={() => setCurrentStep(0)} />
                      <ReviewItem title="Style" selection={config.style} onEdit={() => setCurrentStep(1)} />
                      <ReviewItem title="Siding" selection={config.siding} onEdit={() => setCurrentStep(2)} />
                      <ReviewItem title="Roof" selection={config.roof} onEdit={() => setCurrentStep(3)} />
                      <ReviewAddons title="Add-ons" selections={config.addons} onEdit={() => setCurrentStep(4)} />
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-between">
                <button 
                    onClick={handleBack} 
                    disabled={currentStep === 0}
                    className="bg-white text-gray-700 font-semibold py-2 px-6 rounded-lg border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all duration-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                    Back
                </button>
                {!isReviewStep ? (
                    <button 
                        onClick={handleNext} 
                        disabled={isNextDisabled}
                        className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                ) : null}
              </div>
            </div>
            <div className="lg:col-span-1 mt-8 lg:mt-0">
              <Summary 
                config={config} 
                totalPrice={totalPrice}
                onGenerateBuildOrder={handleGenerateBuildOrder}
                isBuildOrderLoading={isLoading}
                isReviewStep={isReviewStep}
              />
            </div>
          </div>
        </>
      );
    }

    if (selectedService === ServiceType.Lights) {
      return <LightsQuoteForm onBack={() => setSelectedService(null)} />;
    }

    return (
      <div className="text-center bg-white p-12 rounded-lg shadow-md">
        <button onClick={() => setSelectedService(null)} className="mb-8 text-blue-600 hover:underline">
          &larr; Back to Services
        </button>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">{selectedService}</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Our online configurator for this service is coming soon! For an immediate, worry-free quote, please contact our team directly. We're ready to help you get started.
        </p>
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        {renderContent()}
        {buildOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">Your Build Order</h2>
                <button onClick={() => setBuildOrder(null)} className="text-gray-500 hover:text-gray-800 text-3xl leading-none">&times;</button>
              </div>
              <div className="p-6 prose max-w-none" dangerouslySetInnerHTML={{ __html: marked.parse(buildOrder) }} />
              <div className="p-4 bg-gray-50 text-right rounded-b-lg">
                 <button onClick={() => setBuildOrder(null)} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700">Close</button>
              </div>
            </div>
          </div>
        )}
      </main>
      <footer className="text-center py-4 mt-8 border-t">
        <p className="text-gray-500">&copy; {new Date().getFullYear()} PLACED. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
