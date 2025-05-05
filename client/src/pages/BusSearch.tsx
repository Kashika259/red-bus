import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, RefreshCcw, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import BusFilters from '../components/search/BusFilters';
import BusCard, { BusDetails } from '../components/search/BusCard';
import { mockBusData } from '../data/mockBusData';
import { popularCities } from '../data/cities';

const BusSearch: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  const sourceParam = queryParams.get('source') || '';
  const destinationParam = queryParams.get('destination') || '';
  const dateParam = queryParams.get('date') || new Date().toISOString().split('T')[0];
  
  const [source, setSource] = useState<string>(sourceParam);
  const [destination, setDestination] = useState<string>(destinationParam);
  const [journeyDate, setJourneyDate] = useState<Date>(new Date(dateParam));
  const [showSourceSuggestions, setShowSourceSuggestions] = useState<boolean>(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState<boolean>(false);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [buses, setBuses] = useState<BusDetails[]>([]);
  const [filteredBuses, setFilteredBuses] = useState<BusDetails[]>([]);
  
  const filteredSourceCities = source 
    ? popularCities.filter(city => city.toLowerCase().includes(source.toLowerCase()))
    : popularCities;

  const filteredDestinationCities = destination 
    ? popularCities.filter(city => city.toLowerCase().includes(destination.toLowerCase()))
    : popularCities;
  
  // Get min and max prices from the data
  const minPrice = Math.min(...mockBusData.map(bus => bus.fare));
  const maxPrice = Math.max(...mockBusData.map(bus => bus.fare));
  
  useEffect(() => {
    // Simulate API call
    setLoading(true);
    
    setTimeout(() => {
      // Filter buses based on search criteria
      const filtered = mockBusData.filter(bus => {
        const sourceMatch = !source || bus.source.toLowerCase() === source.toLowerCase();
        const destinationMatch = !destination || bus.destination.toLowerCase() === destination.toLowerCase();
        return sourceMatch && destinationMatch;
      });
      
      setBuses(filtered);
      setFilteredBuses(filtered);
      setLoading(false);
      
      if (filtered.length === 0 && source && destination) {
        toast.error('No buses found for this route. Try different dates or destinations.');
      }
    }, 1500);
  }, [source, destination, journeyDate]);
  
  const handleFilterChange = (filters: {
    minPrice: number;
    maxPrice: number;
    departureTime: string[];
    busTypes: string[];
  }) => {
    let filtered = [...buses];
    
    // Filter by price
    filtered = filtered.filter(bus => 
      bus.fare >= filters.minPrice && bus.fare <= filters.maxPrice
    );
    
    // Filter by departure time if selected
    if (filters.departureTime.length > 0) {
      filtered = filtered.filter(bus => {
        const hour = parseInt(bus.departureTime.split(':')[0]);
        
        if (filters.departureTime.includes('morning') && hour >= 6 && hour < 12) {
          return true;
        }
        
        if (filters.departureTime.includes('afternoon') && hour >= 12 && hour < 18) {
          return true;
        }
        
        if (filters.departureTime.includes('evening') && hour >= 18 && hour < 24) {
          return true;
        }
        
        if (filters.departureTime.includes('night') && (hour >= 0 && hour < 6)) {
          return true;
        }
        
        return false;
      });
    }
    
    // Filter by bus type if selected
    if (filters.busTypes.length > 0) {
      filtered = filtered.filter(bus => {
        const busType = bus.type.toLowerCase();
        
        if (filters.busTypes.includes('ac_sleeper') && busType.includes('ac') && busType.includes('sleeper')) {
          return true;
        }
        
        if (filters.busTypes.includes('non_ac_sleeper') && !busType.includes('ac') && busType.includes('sleeper')) {
          return true;
        }
        
        if (filters.busTypes.includes('ac_seater') && busType.includes('ac') && !busType.includes('sleeper')) {
          return true;
        }
        
        if (filters.busTypes.includes('non_ac_seater') && !busType.includes('ac') && !busType.includes('sleeper')) {
          return true;
        }
        
        if (filters.busTypes.includes('volvo') && busType.includes('volvo')) {
          return true;
        }
        
        return false;
      });
    }
    
    setFilteredBuses(filtered);
  };
  
  const handleSearch = () => {
    if (!source) {
      toast.error('Please enter a source city');
      return;
    }
    
    if (!destination) {
      toast.error('Please enter a destination city');
      return;
    }
    
    // Update URL params and reload data
    const formattedDate = journeyDate.toISOString().split('T')[0];
    navigate(`/search?source=${source}&destination=${destination}&date=${formattedDate}`);
    
    // Data will be reloaded by the useEffect hook
  };
  
  const handleDateChange = (date: Date) => {
    setJourneyDate(date);
    
    // Update URL params and reload data
    const formattedDate = date.toISOString().split('T')[0];
    navigate(`/search?source=${source}&destination=${destination}&date=${formattedDate}`);
  };
  
  // Swap source and destination
  const swapLocations = () => {
    const temp = source;
    setSource(destination);
    setDestination(temp);
    
    // Update URL immediately
    navigate(`/search?source=${destination}&destination=${temp}&date=${journeyDate.toISOString().split('T')[0]}`);
  };
  
  const formatDate = (date: Date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };
  
  return (
    <div className="bg-gray-50 py-6">
      <div className="container mx-auto px-4">
        {/* Search Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
            {/* Source & Destination */}
            <div className="flex flex-1 items-center space-x-2">
              <div className="flex-1 relative">
                <label htmlFor="source" className="block text-xs text-gray-500 mb-1">FROM</label>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                  <input
                    type="text"
                    id="source"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    onFocus={() => setShowSourceSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSourceSuggestions(false), 200)}
                    className="block w-full border-0 p-0 text-gray-900 focus:ring-0 sm:text-sm"
                    placeholder="Enter source"
                  />
                </div>
                {showSourceSuggestions && filteredSourceCities.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredSourceCities.map((city) => (
                      <div
                        key={city}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onMouseDown={() => setSource(city)}
                      >
                        {city}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <button 
                onClick={swapLocations}
                className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200"
              >
                <RefreshCcw className="h-4 w-4 text-gray-600" />
              </button>
              
              <div className="flex-1 relative">
                <label htmlFor="destination" className="block text-xs text-gray-500 mb-1">TO</label>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                  <input
                    type="text"
                    id="destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    onFocus={() => setShowDestinationSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowDestinationSuggestions(false), 200)}
                    className="block w-full border-0 p-0 text-gray-900 focus:ring-0 sm:text-sm"
                    placeholder="Enter destination"
                  />
                </div>
                {showDestinationSuggestions && filteredDestinationCities.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredDestinationCities.map((city) => (
                      <div
                        key={city}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onMouseDown={() => setDestination(city)}
                      >
                        {city}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Date */}
            <div className="w-full md:w-48">
              <label htmlFor="date" className="block text-xs text-gray-500 mb-1">TRAVEL DATE</label>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                <DatePicker
                  selected={journeyDate}
                  onChange={handleDateChange}
                  minDate={new Date()}
                  className="block w-full border-0 p-0 text-gray-900 focus:ring-0 sm:text-sm"
                  dateFormat="dd MMM yyyy"
                />
              </div>
            </div>
            
            {/* Search Button */}
            <div>
              <button 
                onClick={handleSearch}
                className="btn btn-primary w-full md:w-auto"
              >
                Search
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row md:space-x-6">
          {/* Filters (Sidebar) */}
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <BusFilters 
              onFilterChange={handleFilterChange}
              minAvailablePrice={minPrice}
              maxAvailablePrice={maxPrice}
            />
          </div>
          
          {/* Bus List */}
          <div className="w-full md:w-3/4">
            {/* Date Navigation */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">
                  {source} to {destination}
                </h2>
                <p className="text-sm text-gray-600">{formatDate(journeyDate)}</p>
              </div>
            </div>
            
            {/* Results Info */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)] mx-auto"></div>
                  <p className="mt-2 text-gray-600">Finding the best buses for you...</p>
                </div>
              ) : filteredBuses.length > 0 ? (
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">{filteredBuses.length}</span> buses found
                  </p>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">Sort by:</span>
                    <button className="text-sm font-medium text-gray-800 hover:text-[var(--primary)]">
                      Departure
                    </button>
                    <button className="text-sm font-medium text-gray-800 hover:text-[var(--primary)]">
                      Duration
                    </button>
                    <button className="text-sm font-medium text-[var(--primary)]">
                      Price
                    </button>
                    <button className="text-sm font-medium text-gray-800 hover:text-[var(--primary)]">
                      Rating
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No buses found</h3>
                  <p className="text-gray-600 mb-4">
                    We couldn't find any buses for this route on the selected date.
                  </p>
                  <p className="text-sm text-gray-500">
                    Try changing the date or search for a different route.
                  </p>
                </div>
              )}
            </div>
            
            {/* Bus Cards */}
            {!loading && filteredBuses.length > 0 && (
              <div className="space-y-4">
                {filteredBuses.map((bus) => (
                  <BusCard key={bus.id} bus={bus} journeyDate={journeyDate.toISOString().split('T')[0]} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusSearch;