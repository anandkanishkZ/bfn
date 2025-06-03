import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Droplets, Calendar, AlertTriangle, Settings, ChevronDown, Search, Filter } from 'lucide-react';
import axios from '../utils/axiosConfig';
import DashboardStats from '../components/admin/DashboardStats';
import UserManagement from '../components/admin/UserManagement';
import DonorManagement from '../components/admin/DonorManagement';
import RequestManagement from '../components/admin/RequestManagement';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <button
              onClick={() => navigate('/settings')}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Settings className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-600 p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <DashboardStats stats={stats} />

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg mt-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('users')}
                className={`${
                  activeTab === 'users'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
              >
                Users
              </button>
              <button
                onClick={() => setActiveTab('donors')}
                className={`${
                  activeTab === 'donors'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
              >
                Donors
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`${
                  activeTab === 'requests'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
              >
                Blood Requests
              </button>
            </nav>
          </div>

          <div className="p-6">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;