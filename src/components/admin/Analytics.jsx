import React from 'react';
import { BarChart3, TrendingUp, Users, Droplets, Calendar, Download } from 'lucide-react';

const Analytics = () => {
  const analyticsData = [
    {
      title: 'Monthly Donations',
      value: '156',
      change: '+12%',
      trend: 'up',
      icon: Droplets,
      color: 'text-blue-600'
    },
    {
      title: 'New Registrations',
      value: '89',
      change: '+8%',
      trend: 'up',
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Blood Requests',
      value: '234',
      change: '+15%',
      trend: 'up',
      icon: Calendar,
      color: 'text-purple-600'
    },
    {
      title: 'Success Rate',
      value: '78%',
      change: '+3%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-red-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h2>
        <button className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsData.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{item.title}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{item.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 dark:text-green-400">{item.change}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">vs last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-700 ${item.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donation Trends Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Donation Trends</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">Chart visualization would go here</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Integration with charting library needed</p>
            </div>
          </div>
        </div>

        {/* Blood Type Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Blood Type Distribution</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-center">
              <div className="w-32 h-32 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                <Droplets className="h-12 w-12 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400">Pie chart would go here</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Showing distribution of blood types</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Analytics Activity</h3>
        <div className="space-y-4">
          {[
            { action: 'New donation recorded', time: '5 minutes ago', type: 'success' },
            { action: 'Blood request fulfilled', time: '1 hour ago', type: 'info' },
            { action: 'Monthly report generated', time: '2 hours ago', type: 'neutral' },
            { action: 'Donor milestone reached', time: '1 day ago', type: 'success' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-3 ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'info' ? 'bg-blue-500' : 'bg-gray-500'
                }`}></div>
                <span className="text-gray-900 dark:text-white">{activity.action}</span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
