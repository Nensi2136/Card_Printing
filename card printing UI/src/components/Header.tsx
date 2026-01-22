import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, User, LogOut, CreditCard, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Header: React.FC = () => {
  const { user, setUser, adminUser, setAdminUser, isLoggedIn, isAdminLoggedIn } = useApp();
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (isAdminLoggedIn) {
      setAdminUser(null);
    } else {
      setUser(null);
    }
    navigate('/');
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <CreditCard className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">CardCraft</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/home" className="text-gray-700 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
              About Us
            </Link>
            
            <div className="relative">
              <button
                onClick={() => setShowProductDropdown(!showProductDropdown)}
                className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
              >
                Products
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              
              {showProductDropdown && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
                  <Link
                    to="/product/basic"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setShowProductDropdown(false)}
                  >
                    Basic Cards
                  </Link>
                  <Link
                    to="/product/luxury"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setShowProductDropdown(false)}
                  >
                    Luxury Cards
                    <span className="ml-2 text-xs bg-gold-100 text-gold-800 px-2 py-1 rounded">Premium</span>
                  </Link>
                </div>
              )}
            </div>

            <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
              Contact Us
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {(isLoggedIn || isAdminLoggedIn) ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
                >
                  {isAdminLoggedIn ? (
                    <Settings className="h-5 w-5 mr-1" />
                  ) : (
                    <User className="h-5 w-5 mr-1" />
                  )}
                  {isAdminLoggedIn ? adminUser?.username : user?.username}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                
                {showUserDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
                    {isAdminLoggedIn ? (
                      <>
                        <Link
                          to="/admin/dashboard"
                          className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <Settings className="inline h-4 w-4 mr-2" />
                          Admin Dashboard
                        </Link>
                        <Link
                          to="/admin/users"
                          className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          Manage Users
                        </Link>
                        <Link
                          to="/admin/templates"
                          className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          Manage Templates
                        </Link>
                      </>
                    ) : (
                      !user?.isPremium && (
                        <Link
                          to="/upgrade"
                          className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          Upgrade to Premium
                        </Link>
                      )
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600"
                    >
                      <LogOut className="inline h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;