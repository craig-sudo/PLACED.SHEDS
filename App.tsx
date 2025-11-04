
import React, { useState, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { ConfiguratorStep } from './components/ConfiguratorStep';
import { Summary } from './components/Summary';
import { ShedConfig, Option, ServiceType } from './types';
import { SIZES, STYLES, SIDING_OPTIONS, ROOF_OPTIONS, ADDONS } from './constants';
import { generateBuildOrder, generateShedDescription } from './services/geminiService';
import { ServiceSelection } from './components/ServiceSelection';

const App: React.FC = () => {
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);

  const [config, setConfig] = useState<ShedConfig>({
    size: null,
    style: null,
    siding: null,
    roof: null,
    addons: [],
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [buildOrder, setBuildOrder] = useState<string | null>(null);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [shedDescription, setShedDescription] = useState<string | null>(null);

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

  const handleGenerateDescription = async () => {
    setIsGeneratingDescription(true);
    setShedDescription(null);
    const result = await generateShedDescription(config);
    setShedDescription(result);
    setIsGeneratingDescription(false);
  };

  const configuratorSteps = [
    { title: '1. Choose Your Size', description: 'Select the base model and footprint for your new shed.', options: SIZES, selected: config.size, onSelect: (opt: Option) => handleSelect('size', opt) },
    { title: '2. Select a Style', description: 'Customize the look and feel of your shed.', options: STYLES, selected: config.style, onSelect: (opt: Option) => handleSelect('style', opt) },
    { title: '3. Pick Your Siding', description: 'Choose the material for your shed\'s exterior.', options: SIDING_OPTIONS, selected: config.siding, onSelect: (opt: Option) => handleSelect('siding', opt) },
    { title: '4. Choose a Roof', description: 'Select roofing material for durability and style.', options: ROOF_OPTIONS, selected: config.roof, onSelect: (opt: Option) => handleSelect('roof', opt) },
    { title: '5. Add Your Options', description: 'Fully customize your shed with functional and aesthetic add-ons.', options: ADDONS, selected: config.addons, onSelect: handleAddonSelect, isMultiSelect: true },
  ];

  const renderContent = () => {
    if (!selectedService) {
      return <ServiceSelection onSelect={setSelectedService} />;
    }

    if (selectedService === ServiceType.Shed) {
      return (
        <>
          <button onClick={() => setSelectedService(null)} className="mb-4 text-blue-600 hover:underline">
            &larr; Back to Services
          </button>
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            <div className="lg:col-span-2">
              {configuratorSteps.map(step => (
                  <ConfiguratorStep
                      key={step.title}
                      title={step.title}
                      description={step.description}
                      options={step.options}
                      selected={step.selected}
                      onSelect={step.onSelect}
                      isMultiSelect={step.isMultiSelect}
                  />
              ))}
            </div>
            <div className="lg:col-span-1">
              <Summary 
                config={config} 
                totalPrice={totalPrice}
                onGenerate={handleGenerateBuildOrder}
                isLoading={isLoading}
                onGenerateDescription={handleGenerateDescription}
                isGeneratingDescription={isGeneratingDescription}
                shedDescription={shedDescription}
              />
            </div>
          </div>
        </>
      );
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
                <button onClick={() => setBuildOrder(null)} className="text-gray-500 hover:text-gray-800">&times;</button>
              </div>
              <div className="p-6 prose max-w-none" dangerouslySetInnerHTML={{ __html: buildOrder.replace(/\n/g, '<br />') }} />
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