import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Ticket, Bus, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Bus className="h-8 w-8 text-[#D84E55]" />
            <span className="ml-2 text-xl font-bold text-[#D84E55]">RedBus</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-[#D84E55] font-medium">
              Home
            </Link>
            <Link to="/search" className="text-gray-700 hover:text-[#D84E55] font-medium">
              Find Buses
            </Link>
            {isAuthenticated && (
              <Link to="/my-bookings" className="text-gray-700 hover:text-[#D84E55] font-medium">
                My Bookings
              </Link>
            )}
          </nav>

          {/* User Menu (Desktop) */}
          <div className="hidden md:flex items-center">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center text-gray-700 hover:text-[#D84E55]"
                  onClick={toggleProfile}
                >
                  <span className="mr-1">{user?.username || 'User'}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link
                      to="/my-bookings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Ticket className="h-4 w-4 mr-2" />
                      My Bookings
                    </Link>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        logout();
                      }}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="py-2 px-4 bg-[#D84E55] text-white rounded-md hover:bg-[#D84E45] mt-2 w-full"

              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-700 hover:text-[#D84E55]"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-sm py-2">
          <div className="container mx-auto px-4 flex flex-col space-y-2">
            <Link
              to="/"
              className="block py-2 text-gray-700 hover:text-[#D84E55]"
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link
              to="/search"
              className="block py-2 text-gray-700 hover:text-[#D84E55]"
              onClick={closeMenu}
            >
              Find Buses
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/my-bookings"
                  className="block py-2 text-gray-700 hover:text-[#D84E55]"
                  onClick={closeMenu}
                >
                  My Bookings
                </Link>
                <button
                  onClick={() => {
                    closeMenu();
                    logout();
                  }}
                  className="flex items-center py-2 text-gray-700 hover:text-[#D84E55]"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  closeMenu();
                  navigate('/login');
                }}
                className="py-2 px-4 bg-[#D84E55] text-white rounded-md hover:bg-[#D84E55] mt-2 w-full"

              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;