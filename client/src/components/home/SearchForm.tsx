import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

import { popularCities } from '../../data/cities';

const SearchForm: React.FC = () => {
  const [source, setSource] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [journeyDate, setJourneyDate] = useState<Date | null>(new Date());
  const [showSourceSuggestions, setShowSourceSuggestions] = useState<boolean>(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState<boolean>(false);
  
  const navigate = useNavigate();

  const filteredSourceCities = source 
    ? popularCities.filter(city => city.toLowerCase().includes(source.toLowerCase()))
    : popularCities;

  const filteredDestinationCities = destination 
    ? popularCities.filter(city => city.toLowerCase().includes(destination.toLowerCase()))
    : popularCities;

  const handleSourceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSource(e.target.value);
    setShowSourceSuggestions(true);
  };

  const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDestination(e.target.value);
    setShowDestinationSuggestions(true);
  };

  const handleSourceSelect = (city: string) => {
    setSource(city);
    setShowSourceSuggestions(false);
  };

  const handleDestinationSelect = (city: string) => {
    setDestination(city);
    setShowDestinationSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!source) {
      toast.error('Please enter a source city');
      return;
    }
    
    if (!destination) {
      toast.error('Please enter a destination city');
      return;
    }
    
    if (!journeyDate) {
      toast.error('Please select a journey date');
      return;
    }

    if (source === destination) {
      toast.error('Source and destination cannot be the same');
      return;
    }
    
    // Format date as YYYY-MM-DD
    const formattedDate = journeyDate.toISOString().split('T')[0];
    
    navigate(`/search?source=${source}&destination=${destination}&date=${formattedDate}`);
  };

  // Function to swap source and destination
  const swapLocations = () => {
    const temp = source;
    setSource(destination);
    setDestination(temp);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
          {/* Source */}
          <div className="flex-1 relative">
            <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">
              From
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="source"
                placeholder="Enter source city"
                className="input pl-10"
                value={source}
                onChange={handleSourceChange}
                onFocus={() => setShowSourceSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSourceSuggestions(false), 200)}
              />
            </div>
            {showSourceSuggestions && filteredSourceCities.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto fade-in">
                {filteredSourceCities.map((city) => (
                  <div
                    key={city}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onMouseDown={() => handleSourceSelect(city)}
                  >
                    {city}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Swap Button */}
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={swapLocations}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors md:mt-5"
            >
              <ArrowRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Destination */}
          <div className="flex-1 relative">
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
              To
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="destination"
                placeholder="Enter destination city"
                className="input pl-10"
                value={destination}
                onChange={handleDestinationChange}
                onFocus={() => setShowDestinationSuggestions(true)}
                onBlur={() => setTimeout(() => setShowDestinationSuggestions(false), 200)}
              />
            </div>
            {showDestinationSuggestions && filteredDestinationCities.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto fade-in">
                {filteredDestinationCities.map((city) => (
                  <div
                    key={city}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onMouseDown={() => handleDestinationSelect(city)}
                  >
                    {city}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Date Picker */}
          <div className="flex-1">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date of Journey
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <DatePicker
                selected={journeyDate}
                onChange={(date) => setJourneyDate(date)}
                minDate={new Date()}
                className="input pl-10 w-full"
                dateFormat="dd/MM/yyyy"
                placeholderText="Select date"
              />
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="mt-6">
          <button type="submit" className="btn btn-primary w-full py-3">
            Search Buses
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;