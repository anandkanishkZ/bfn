import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { 
  Users, Droplets, Calendar, AlertTriangle, TrendingUp, TrendingDown, 
  Activity, Heart, MapPin, Clock, Filter, Download, RefreshCw
} from 'lucide-react';
import axios from '../../utils/axiosConfig';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeDonors: 0,
    pendingRequests: 0,
    emergencyRequests: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState('6months');

  useEffect(() => {
    fetchDashboardData();
  }, [timeframe]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, analyticsRes] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/analytics')
      ]);

      setStats(statsRes.data);
      setAnalytics(analyticsRes.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Color schemes for charts
  const BLOOD_TYPE_COLORS = {
    'A+': '#ef4444', 'A-': '#dc2626', 'B+': '#f97316', 'B-': '#ea580c',
    'AB+': '#eab308', 'AB-': '#ca8a04', 'O+': '#22c55e', 'O-': '#16a34a'
  };

  const STATUS_COLORS = {
    pending: '#f59e0b', approved: '#10b981', fulfilled: '#6366f1', rejected: '#ef4444'
  };

  const URGENCY_COLORS = {
    normal: '#6b7280', urgent: '#f59e0b', emergency: '#ef4444'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">{error}</h2>
          <button
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center mx-auto"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Admin Analytics Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Comprehensive overview of Blood For Nepal operations
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
              >
                <option value="1month">Last Month</option>
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="1year">Last Year</option>
              </select>
              <button
                onClick={fetchDashboardData}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-xl">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Total Users
                    </dt>
                    <dd className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stats.totalUsers.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>12% from last month</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-xl">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Droplets className="h-8 w-8 text-red-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Active Donors
                    </dt>
                    <dd className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stats.activeDonors.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>8% from last month</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-xl">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Pending Requests
                    </dt>
                    <dd className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stats.pendingRequests.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-red-600">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  <span>5% from last month</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-xl">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Emergency Requests
                    </dt>
                    <dd className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stats.emergencyRequests.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-yellow-600">
                  <Activity className="h-4 w-4 mr-1" />
                  <span>Critical priority</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Blood Type Distribution */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Blood Type Distribution
              </h3>
              <Droplets className="h-5 w-5 text-red-600" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics?.bloodTypeDistribution || []}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="blood_type"
                  label={({ blood_type, count }) => `${blood_type}: ${count}`}
                >
                  {analytics?.bloodTypeDistribution?.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={BLOOD_TYPE_COLORS[entry.blood_type] || '#6b7280'} 
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Request Urgency Distribution */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Request Urgency Levels
              </h3>
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics?.urgencyDistribution || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="urgency" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#f59e0b">
                  {analytics?.urgencyDistribution?.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={URGENCY_COLORS[entry.urgency] || '#6b7280'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Monthly Request Trends
            </h3>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={analytics?.monthlyTrends || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Status Overview */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Request Status Overview
            </h3>
            <Activity className="h-5 w-5 text-blue-600" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics?.statusDistribution || []} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="status" type="category" width={80} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1">
                {analytics?.statusDistribution?.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={STATUS_COLORS[entry.status] || '#6b7280'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              <Download className="h-5 w-5 mr-2" />
              Export Data
            </button>
            <button className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Filter className="h-5 w-5 mr-2" />
              Advanced Filters
            </button>
            <button className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Heart className="h-5 w-5 mr-2" />
              Emergency Alert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
