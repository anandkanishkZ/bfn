import React, { useState } from 'react';
import { FileText, Download, Calendar, Filter, Search, Eye, BarChart3, Users, Droplets } from 'lucide-react';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('monthly');
  const [dateRange, setDateRange] = useState('last30days');

  const reportTypes = [
    {
      id: 'monthly',
      title: 'Monthly Summary',
      description: 'Comprehensive monthly donation and request statistics',
      icon: Calendar,
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
    },
    {
      id: 'donors',
      title: 'Donor Report',
      description: 'Detailed donor registration and activity report',
      icon: Users,
      color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
    },
    {
      id: 'requests',
      title: 'Blood Requests',
      description: 'Analysis of blood requests and fulfillment rates',
      icon: Droplets,
      color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
    },
    {
      id: 'analytics',
      title: 'Analytics Report',
      description: 'Comprehensive analytics and performance metrics',
      icon: BarChart3,
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
    }
  ];

  const recentReports = [
    {
      name: 'Monthly Donation Report - May 2025',
      type: 'Monthly Summary',
      date: '2025-06-01',
      size: '2.4 MB',
      status: 'completed'
    },
    {
      name: 'Donor Activity Report - Q2 2025',
      type: 'Donor Report',
      date: '2025-05-28',
      size: '1.8 MB',
      status: 'completed'
    },
    {
      name: 'Blood Request Analysis - May 2025',
      type: 'Blood Requests',
      date: '2025-05-25',
      size: '3.1 MB',
      status: 'completed'
    },
    {
      name: 'System Analytics - April 2025',
      type: 'Analytics Report',
      date: '2025-05-01',
      size: '4.2 MB',
      status: 'completed'
    }
  ];

  const generateReport = () => {
    // Simulate report generation
    alert(`Generating ${reportTypes.find(r => r.id === selectedReport)?.title} for ${dateRange}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reports Management</h2>
        <button 
          onClick={generateReport}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
        >
          <FileText className="h-4 w-4 mr-2" />
          Generate Report
        </button>
      </div>

      {/* Report Generation Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Generate New Report</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Report Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Report Type
            </label>
            <div className="space-y-3">
              {reportTypes.map((report) => {
                const Icon = report.icon;
                return (
                  <label key={report.id} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="reportType"
                      value={report.id}
                      checked={selectedReport === report.id}
                      onChange={(e) => setSelectedReport(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`flex items-center p-4 border-2 rounded-lg transition-all duration-200 ${
                      selectedReport === report.id 
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}>
                      <div className={`p-2 rounded-lg mr-4 ${report.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{report.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{report.description}</p>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Date Range and Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-4"
            >
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="last90days">Last 90 Days</option>
              <option value="lastyear">Last Year</option>
              <option value="custom">Custom Range</option>
            </select>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional Filters
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-red-600 focus:ring-red-500" />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Include emergency requests</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-red-600 focus:ring-red-500" />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Include donor statistics</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-red-600 focus:ring-red-500" />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Include geographical data</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Reports</h3>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search reports..."
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
            </div>
            <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400 text-sm">Report Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400 text-sm">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400 text-sm">Date Generated</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400 text-sm">Size</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentReports.map((report, index) => (
                <tr key={index} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="font-medium text-gray-900 dark:text-white">{report.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{report.type}</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{report.date}</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{report.size}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
