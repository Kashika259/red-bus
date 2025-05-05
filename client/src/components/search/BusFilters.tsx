import React, { useState } from 'react';
import { Filter, Clock, Bus } from 'lucide-react';

interface BusFiltersProps {
  onFilterChange: (filters: {
    minPrice: number;
    maxPrice: number;
    departureTime: string[];
    busTypes: string[];
  }) => void;
  minAvailablePrice: number;
  maxAvailablePrice: number;
}

const BusFilters: React.FC<BusFiltersProps> = ({ 
  onFilterChange, 
  minAvailablePrice = 200, 
  maxAvailablePrice = 2000 
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([minAvailablePrice, maxAvailablePrice]);
  const [departureTime, setDepartureTime] = useState<string[]>([]);
  const [busTypes, setBusTypes] = useState<string[]>([]);
  
  const departureTimeOptions = [
    { id: 'morning', label: 'Morning (6AM - 12PM)' },
    { id: 'afternoon', label: 'Afternoon (12PM - 6PM)' },
    { id: 'evening', label: 'Evening (6PM - 12AM)' },
    { id: 'night', label: 'Night (12AM - 6AM)' },
  ];
  
  const busTypeOptions = [
    { id: 'ac_sleeper', label: 'AC Sleeper' },
    { id: 'non_ac_sleeper', label: 'Non-AC Sleeper' },
    { id: 'ac_seater', label: 'AC Seater' },
    { id: 'non_ac_seater', label: 'Non-AC Seater' },
    { id: 'volvo', label: 'Volvo' },
  ];
  
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    const isMinPrice = e.target.id === 'min-price';
    
    if (isMinPrice) {
      setPriceRange([value, priceRange[1]]);
    } else {
      setPriceRange([priceRange[0], value]);
    }
  };
  
  const handleDepartureTimeChange = (id: string) => {
    setDepartureTime(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  const handleBusTypeChange = (id: string) => {
    setBusTypes(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  const applyFilters = () => {
    onFilterChange({
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      departureTime,
      busTypes,
    });
  };
  
  const resetFilters = () => {
    setPriceRange([minAvailablePrice, maxAvailablePrice]);
    setDepartureTime([]);
    setBusTypes([]);
    
    onFilterChange({
      minPrice: minAvailablePrice,
      maxPrice: maxAvailablePrice,
      departureTime: [],
      busTypes: [],
    });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      {/* Mobile Filter Toggle */}
      <div className="flex justify-between items-center md:hidden mb-2">
        <h3 className="font-medium">Filters</h3>
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="text-gray-500 hover:text-gray-700"
        >
          <Filter className="h-5 w-5" />
        </button>
      </div>
      
      <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block`}>
        {/* Price Range */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <span className="mr-2">Price Range</span>
          </h4>
          <div className="flex items-center justify-between">
            <div className="w-[45%]">
              <label htmlFor="min-price" className="block text-xs text-gray-500 mb-1">
                Min Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">₹</span>
                <input
                  type="number"
                  id="min-price"
                  min={minAvailablePrice}
                  max={priceRange[1] - 50}
                  value={priceRange[0]}
                  onChange={handlePriceChange}
                  className="input pl-7 text-sm py-1"
                />
              </div>
            </div>
            <div className="text-gray-400">to</div>
            <div className="w-[45%]">
              <label htmlFor="max-price" className="block text-xs text-gray-500 mb-1">
                Max Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">₹</span>
                <input
                  type="number"
                  id="max-price"
                  min={priceRange[0] + 50}
                  max={maxAvailablePrice}
                  value={priceRange[1]}
                  onChange={handlePriceChange}
                  className="input pl-7 text-sm py-1"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Departure Time */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            <span>Departure Time</span>
          </h4>
          <div className="space-y-2">
            {departureTimeOptions.map((option) => (
              <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  id={option.id}
                  checked={departureTime.includes(option.id)}
                  onChange={() => handleDepartureTimeChange(option.id)}
                  className="rounded text-[var(--primary)] focus:ring-[var(--primary)]"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Bus Type */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <Bus className="h-4 w-4 mr-2" />
            <span>Bus Type</span>
          </h4>
          <div className="space-y-2">
            {busTypeOptions.map((option) => (
              <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  id={option.id}
                  checked={busTypes.includes(option.id)}
                  onChange={() => handleBusTypeChange(option.id)}
                  className="rounded text-[var(--primary)] focus:ring-[var(--primary)]"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Filter Actions */}
        <div className="flex flex-col space-y-2">
          <button
            onClick={applyFilters}
            className="btn btn-primary w-full"
          >
            Apply Filters
          </button>
          <button
            onClick={resetFilters}
            className="btn btn-outline w-full"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusFilters;