import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Droplets, 
  Calendar, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  AlertTriangle,
  FileText,
  BarChart3,
  Bell,
  Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminSidebar = ({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(3);
  const [hoveredItem, setHoveredItem] = useState(null);
  
  // Simulate a notification count update
  useEffect(() => {
    const timer = setTimeout(() => {
      if (notifications > 0) {
        setNotifications(notifications - 1);
      }
    }, 30000); // Decrease notification count every 30 seconds
    
    return () => clearTimeout(timer);
  }, [notifications]);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/login');
  };
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'users',
      label: 'Users',
      icon: Users,
      badge: null
    },
    {
      id: 'donors',
      label: 'Donors',
      icon: Heart,
      badge: null
    },
    {
      id: 'requests',
      label: 'Blood Requests',
      icon: Droplets,
      badge: {
        text: 'urgent',
        count: notifications,
        color: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'
      }
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      badge: {
        text: 'new',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200'
      }
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: FileText,
      badge: null
    }
  ];
  const bottomMenuItems = [
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: notifications > 0 ? {
        count: notifications,
        color: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'
      } : null,
      action: () => alert('Notifications panel would open here')
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      badge: null,
      action: () => navigate('/settings')
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: LogOut,
      badge: null,
      action: handleLogout
    }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}
        {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-xl z-50 transform transition-all duration-300 ease-in-out
        ${isCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-20' : 'translate-x-0 w-64'}
      `}>        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <div className={`flex items-center ${isCollapsed ? 'lg:justify-center' : ''}`}>
            <div className="relative">
              <Heart className="h-8 w-8 text-red-600 dark:text-red-500" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-200 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
              </span>
            </div>
            {!isCollapsed && (
              <div className="ml-3">
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Admin Panel</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Blood For Nepal</p>
              </div>
            )}
          </div>
          
          {/* Toggle button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 lg:hidden"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        {/* Search Bar - only visible when sidebar is expanded */}
        {!isCollapsed && (
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isHovered = hoveredItem === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 1024) {
                    setIsCollapsed(true);
                  }
                }}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`
                  w-full flex items-center px-3 py-3 rounded-lg text-left transition-all duration-200 group
                  ${isActive 
                    ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 shadow-sm' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                <div className="relative">
                  <Icon 
                    className={`
                      h-5 w-5 flex-shrink-0 transition-all duration-200
                      ${isActive ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}
                      ${(isHovered || isActive) ? 'scale-110' : ''}
                    `} 
                  />
                  
                  {isCollapsed && item.badge && item.badge.count && (
                    <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                      {item.badge.count}
                    </span>
                  )}
                </div>
                
                {!isCollapsed && (
                  <>
                    <span className={`ml-3 font-medium transition-all duration-200 ${isHovered && !isActive ? 'translate-x-1' : ''}`}>
                      {item.label}
                    </span>
                    
                    {item.badge && (
                      <span className="ml-auto">
                        {item.badge.count ? (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.badge.color}`}>
                            {item.badge.text} ({item.badge.count})
                          </span>
                        ) : (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.badge.color}`}>
                            {item.badge.text}
                          </span>
                        )}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-2">
          {bottomMenuItems.map((item) => {
            const Icon = item.icon;
            const isHovered = hoveredItem === item.id;
            
            return (
              <button
                key={item.id}
                onClick={item.action}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`
                  w-full flex items-center px-3 py-3 rounded-lg text-left transition-all duration-200
                  text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700
                  ${item.id === 'logout' ? 'hover:text-red-600 dark:hover:text-red-400' : ''}
                `}
              >
                <div className="relative">
                  <Icon 
                    className={`
                      h-5 w-5 flex-shrink-0 transition-all duration-200 
                      ${isHovered ? 'scale-110' : ''}
                      ${item.id === 'logout' && isHovered ? 'text-red-600' : 'text-gray-500 dark:text-gray-400'}
                    `} 
                  />
                  
                  {isCollapsed && item.badge && item.badge.count > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                      {item.badge.count}
                    </span>
                  )}
                </div>
                
                {!isCollapsed && (
                  <>
                    <span className={`ml-3 font-medium transition-all duration-200 ${isHovered ? 'translate-x-1' : ''}`}>
                      {item.label}
                    </span>
                    
                    {item.badge && item.badge.count > 0 && (
                      <span className="ml-auto">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.badge.color}`}>
                          {item.badge.count}
                        </span>
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </div>        {/* Collapse toggle for desktop */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:bg-red-50 dark:hover:bg-red-900/30 group"
        >
          <div className="flex items-center justify-center w-6 h-6">
            {isCollapsed ? (
              <ChevronRight className="h-3 w-3 text-gray-500 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-300" />
            ) : (
              <ChevronLeft className="h-3 w-3 text-gray-500 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-300" />
            )}
          </div>
        </button>
        
        {/* User Profile Section */}
        {!isCollapsed && (
          <div className="p-4">
            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Users className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Admin User</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Online</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminSidebar;
