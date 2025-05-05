import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Bus, MapPin } from 'lucide-react';

interface RouteCardProps {
  source: string;
  destination: string;
  price: number;
  duration: string;
  frequency: string;
  busCount: number;
  image: string;
}

const RouteCard: React.FC<RouteCardProps> = ({
  source,
  destination,
  price,
  duration,
  frequency,
  busCount,
  image
}) => {
  return (
    <div className="card overflow-hidden group">
      <div 
        className="h-40 bg-cover bg-center relative" 
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4 text-white">
          <div className="flex items-center space-x-1 mb-1">
            <MapPin className="h-4 w-4" />
            <h3 className="text-lg font-semibold">{source} <ArrowRight className="h-4 w-4 inline mx-1" /> {destination}</h3>
          </div>
          <p className="text-sm opacity-90">From ₹{price}</p>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Bus className="h-4 w-4 mr-1" />
            <span>{busCount} buses</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-4">{frequency}</p>
        <Link 
          to={`/search?source=${source}&destination=${destination}&date=${new Date().toISOString().split('T')[0]}`}
          className="btn btn-outline w-full group-hover:bg-[var(--primary)] group-hover:text-white group-hover:border-[var(--primary)] transition-colors"
        >
          View Buses
        </Link>
      </div>
    </div>
  );
};

const FeaturedRoutes: React.FC = () => {
  const routes = [
    {
      source: 'Delhi',
      destination: 'Jaipur',
      price: 550,
      duration: '5h 30m',
      frequency: 'Every hour',
      busCount: 85,
      image: 'https://images.pexels.com/photos/3581364/pexels-photo-3581364.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      source: 'Mumbai',
      destination: 'Pune',
      price: 350,
      duration: '3h 15m',
      frequency: 'Every 30 minutes',
      busCount: 120,
      image: 'https://images.pexels.com/photos/2397414/pexels-photo-2397414.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      source: 'Bangalore',
      destination: 'Chennai',
      price: 750,
      duration: '6h 45m',
      frequency: 'Every hour',
      busCount: 95,
      image: 'https://images.pexels.com/photos/10070972/pexels-photo-10070972.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      source: 'Hyderabad',
      destination: 'Bangalore',
      price: 950,
      duration: '8h 30m',
      frequency: 'Every 2 hours',
      busCount: 65,
      image: 'https://images.pexels.com/photos/1107717/pexels-photo-1107717.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
  ];

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Popular Routes</h2>
          <Link to="/search" className="text-[var(--primary)] hover:underline font-medium">
            View All Routes
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {routes.map((route, index) => (
            <RouteCard key={index} {...route} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedRoutes;