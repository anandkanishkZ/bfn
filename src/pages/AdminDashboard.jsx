import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Droplets, Calendar, AlertTriangle, Settings, ChevronDown, Search, Filter, Menu } from 'lucide-react';
import axios from '../utils/axiosConfig';
import { debugAuth } from '../utils/debugAuth';
import AdminSidebar from '../components/admin/AdminSidebar';
import MobileToggle from '../components/admin/MobileToggle';
import DashboardStats from '../components/admin/DashboardStats';
import UserManagement from '../components/admin/UserManagement';
import DonorManagement from '../components/admin/DonorManagement';
import RequestManagement from '../components/admin/RequestManagement';
import Dashboard from '../components/admin/Dashboard';
import Analytics from '../components/admin/Analytics';
import Reports from '../components/admin/Reports';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authDebugInfo, setAuthDebugInfo] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeDonors: 0,
    pendingRequests: 0,
    emergencyRequests: 0
  });
  const [users, setUsers] = useState([]);
  const [donors, setDonors] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // Debug authentication state
    const authInfo = debugAuth();
    setAuthDebugInfo(authInfo);
    
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
      console.log('Admin access denied:', !user ? 'No user found' : `User role is ${user.role}, not admin`);
      navigate('/login');
      return;
    }

    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [usersRes, donorsRes, requestsRes] = await Promise.all([
        axios.get('/api/admin/users'),
        axios.get('/api/admin/donors'),
        axios.get('/api/admin/requests')
      ]);

      setUsers(usersRes.data);
      setDonors(donorsRes.data);
      setRequests(requestsRes.data);

      // Calculate stats
      setStats({
        totalUsers: usersRes.data.length,
        activeDonors: donorsRes.data.filter(d => d.status === 'active').length,
        pendingRequests: requestsRes.data.filter(r => r.status === 'pending').length,
        emergencyRequests: requestsRes.data.filter(r => r.urgency === 'emergency').length
      });

      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const handleUserAction = async (userId, action) => {
    try {
      await axios.post(`/api/admin/users/${userId}/${action}`);
      fetchData(); // Refresh data after action
    } catch (error) {
      console.error(`Error performing ${action} on user:`, error);
      setError(`Failed to ${action} user`);
    }
  };

  const handleDonorAction = async (donorId, action) => {
    try {
      await axios.post(`/api/admin/donors/${donorId}/${action}`);
      fetchData();
    } catch (error) {
      console.error(`Error performing ${action} on donor:`, error);
      setError(`Failed to ${action} donor`);
    }
  };

  const handleRequestAction = async (requestId, action) => {
    try {
      await axios.post(`/api/admin/requests/${requestId}/${action}`);
      fetchData();
    } catch (error) {
      console.error(`Error performing ${action} on request:`, error);
      setError(`Failed to ${action} request`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      
      {/* Mobile Sidebar Toggle */}
      <MobileToggle 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
      />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 lg:hidden"
                >
                  <Menu className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                </button>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white ml-2 lg:ml-0">
                  {activeTab === 'dashboard' && 'Dashboard Overview'}
                  {activeTab === 'users' && 'User Management'}
                  {activeTab === 'donors' && 'Donor Management'}
                  {activeTab === 'requests' && 'Blood Request Management'}
                  {activeTab === 'analytics' && 'Analytics'}
                  {activeTab === 'reports' && 'Reports'}
                </h1>
              </div>
              <button
                onClick={() => navigate('/settings')}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <Settings className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 lg:p-8">
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-600 p-4 rounded-r-lg">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                <p className="text-red-800 dark:text-red-200">{error}</p>
              </div>
            </div>
          )}
          
          {/* Content based on active tab */}
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'users' && (
            <UserManagement 
              users={users} 
              onUserAction={handleUserAction} 
            />
          )}
          {activeTab === 'donors' && (
            <DonorManagement 
              donors={donors} 
              onDonorAction={handleDonorAction} 
            />
          )}
          {activeTab === 'requests' && (
            <RequestManagement 
              requests={requests} 
              onRequestAction={handleRequestAction} 
            />
          )}
          {activeTab === 'analytics' && <Analytics />}
          {activeTab === 'reports' && <Reports />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;