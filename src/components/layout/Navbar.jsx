import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Droplets, Moon, Sun, User, LogOut, Settings, Bell } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSelector from '../common/LanguageSelector';

const Navbar = ({ isDarkMode, toggleDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem('user'));
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/60 dark:bg-gray-900/60 shadow-md transition-colors duration-200 backdrop-blur-md backdrop-saturate-150 border-b border-white/30 dark:border-gray-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Droplets className="h-8 w-8 text-red-600 dark:text-red-500" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">Blood For Nepal</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-700 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-500 px-3 py-2 rounded-md text-sm font-medium">
              {t('navHome')}
            </Link>
            <Link to="/register" className="text-gray-700 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-500 px-3 py-2 rounded-md text-sm font-medium">
              {t('navRegister')}
            </Link>
            <Link to="/request" className="text-gray-700 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-500 px-3 py-2 rounded-md text-sm font-medium">
              {t('navRequest')}
            </Link>
            <Link to="/find" className="text-gray-700 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-500 px-3 py-2 rounded-md text-sm font-medium">
              {t('navFind')}
            </Link>
            <Link to="/education" className="text-gray-700 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-500 px-3 py-2 rounded-md text-sm font-medium">
              {t('navEducation')}
            </Link>
            <Link to="/emergency" className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 px-3 py-2 rounded-md text-sm font-medium">
              {t('navEmergency')}
            </Link>
            <LanguageSelector />
            <button
              onClick={toggleDarkMode}
              className="ml-2 p-2 rounded-full text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Profile Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </div>
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <div className="flex items-center">
                          <Settings className="h-4 w-4 mr-2" />
                          Admin Dashboard
                        </div>
                      </Link>
                    )}
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </div>
                    </Link>
                    <Link
                      to="/notifications"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center">
                        <Bell className="h-4 w-4 mr-2" />
                        Notifications
                      </div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 shadow-lg">
          <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-red-500 dark:hover:bg-gray-800">
            {t('navHome')}
          </Link>
          <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-red-500 dark:hover:bg-gray-800">
            {t('navRegister')}
          </Link>
          <Link to="/request" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-red-500 dark:hover:bg-gray-800">
            {t('navRequest')}
          </Link>
          <Link to="/find" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-red-500 dark:hover:bg-gray-800">
            {t('navFind')}
          </Link>
          <Link to="/education" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-red-500 dark:hover:bg-gray-800">
            {t('navEducation')}
          </Link>
          <Link to="/emergency" className="block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">
            {t('navEmergency')}
          </Link>
          
          {user ? (
            <>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 pb-3">
                <div className="flex items-center px-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                    <span className="text-lg font-medium text-red-600 dark:text-red-400">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800 dark:text-white">{user.name}</div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{user.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Link
                    to="/profile"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-red-500 dark:hover:bg-gray-800"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-red-500 dark:hover:bg-gray-800"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-50 dark:text-red-400 dark:hover:bg-gray-800"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="block px-3 py-2 rounded-md text-base font-medium text-white bg-red-600 hover:bg-red-700"
            >
              Sign In
            </Link>
          )}
          
          <LanguageSelector />
          <button
            onClick={toggleDarkMode}
            className="mt-1 w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {isDarkMode ? <Sun className="h-5 w-5 mr-2" /> : <Moon className="h-5 w-5 mr-2" />}
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;