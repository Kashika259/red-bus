import React from 'react';
import { ArrowRight, Clock, Star, ShieldCheck } from 'lucide-react';
import SearchForm from '../components/home/SearchForm';
import FeaturedRoutes from '../components/home/FeaturedRoutes';

const Home: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section 
        className="relative bg-cover bg-center h-[500px] flex items-center"
        style={{ 
          backgroundImage: 'url(https://images.pexels.com/photos/3764014/pexels-photo-3764014.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
              Book Your Bus Tickets Easily
            </h1>
            <p className="text-xl text-white text-center mb-8">
              India's largest online bus ticketing platform with the widest choice of bus operators
            </p>
            
            <SearchForm />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose RedBus?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6 rounded-lg transition-transform hover:scale-105">
              <div className="bg-[var(--primary-light)] w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-[var(--primary)]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Quick & Easy Booking</h3>
              <p className="text-gray-600">
                Book bus tickets in just a few clicks. Select your route, choose your seats, and confirm your booking within minutes.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="text-center p-6 rounded-lg transition-transform hover:scale-105">
              <div className="bg-[var(--primary-light)] w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
                <Star className="h-8 w-8 text-[var(--primary)]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Largest Selection</h3>
              <p className="text-gray-600">
                Choose from thousands of bus operators across India. Compare prices, amenities, and reviews to find the perfect bus.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="text-center p-6 rounded-lg transition-transform hover:scale-105">
              <div className="bg-[var(--primary-light)] w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
                <ShieldCheck className="h-8 w-8 text-[var(--primary)]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure Payments</h3>
              <p className="text-gray-600">
                Pay securely with multiple payment options including credit cards, UPI, net banking, and more.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Routes */}
      <FeaturedRoutes />

      {/* App Download */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold mb-4">Download the RedBus App</h2>
              <p className="text-gray-600 mb-6">
                Get exclusive app-only deals and manage your bookings on the go. Scan the QR code to download our mobile app.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="inline-block">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/2560px-Google_Play_Store_badge_EN.svg.png" 
                    alt="Get it on Google Play" 
                    className="h-12"
                  />
                </a>
                <a href="#" className="inline-block">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/2560px-Download_on_the_App_Store_Badge.svg.png" 
                    alt="Download on App Store" 
                    className="h-12"
                  />
                </a>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center md:justify-end">
              <div className="bg-white p-4 rounded-lg shadow-md inline-flex">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png" 
                  alt="QR Code" 
                  className="w-40 h-40"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "RedBus made my trip planning so easy! I was able to compare different bus operators, find the best price, and book my ticket in minutes."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Priya Sharma</h4>
                  <p className="text-sm text-gray-500">Mumbai</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "I travel frequently between Bangalore and Chennai, and RedBus has become my go-to app for booking buses. The seat selection feature is great!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Rahul Verma</h4>
                  <p className="text-sm text-gray-500">Bangalore</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "The customer service is excellent! When my trip got cancelled due to bad weather, RedBus helped me get a full refund without any hassle."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Ankit Patel</h4>
                  <p className="text-sm text-gray-500">Ahmedabad</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;