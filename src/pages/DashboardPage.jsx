import React from 'react';
import { useState } from 'react';
import { BarChart, PieChart, Calendar, Users, Droplets, Activity, Map, TrendingUp, Filter } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import StatsCard from '../components/common/StatsCard';

const DashboardPage = () => {
  const { t } = useLanguage();
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  const handleTimeframeChange = (timeframe) => {
    setSelectedTimeframe(timeframe);
  };
  
  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
  };
  
  // Blood availability data
  const bloodAvailability = [
    { type: 'A+', units: 125 },
    { type: 'A-', units: 14 },
    { type: 'B+', units: 87 },
    { type: 'B-', units: 9 },
    { type: 'AB+', units: 36 },
    { type: 'AB-', units: 3 },
    { type: 'O+', units: 156 },
    { type: 'O-', units: 21 },
  ];
  
  // Donation trends data (monthly for the last 6 months)
  const donationTrends = [
    { month: 'Jan', donations: 210 },
    { month: 'Feb', donations: 185 },
    { month: 'Mar', donations: 220 },
    { month: 'Apr', donations: 190 },
    { month: 'May', donations: 245 },
    { month: 'Jun', donations: 270 },
  ];
  
  // Request by purpose data
  const requestsByPurpose = [
    { purpose: 'Surgery', count: 145 },
    { purpose: 'Accident', count: 87 },
    { purpose: 'Pregnancy', count: 62 },
    { purpose: 'Cancer', count: 53 },
    { purpose: 'Anemia', count: 41 },
    { purpose: 'Other', count: 39 },
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blood Donation Analytics</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Overview of blood donation activities, trends, and statistics
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-white bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>
            
            <div className="inline-flex rounded-md shadow-sm">
              <button
                onClick={() => handleTimeframeChange('week')}
                className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
                  selectedTimeframe === 'week'
                    ? 'bg-red-600 text-white border-red-600 dark:bg-red-800 dark:border-red-800'
                    : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-600'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => handleTimeframeChange('month')}
                className={`px-4 py-2 text-sm font-medium border-t border-b ${
                  selectedTimeframe === 'month'
                    ? 'bg-red-600 text-white border-red-600 dark:bg-red-800 dark:border-red-800'
                    : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-600'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => handleTimeframeChange('year')}
                className={`px-4 py-2 text-sm font-medium rounded-r-md border ${
                  selectedTimeframe === 'year'
                    ? 'bg-red-600 text-white border-red-600 dark:bg-red-800 dark:border-red-800'
                    : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-600'
                }`}
              >
                Year
              </button>
            </div>
          </div>
        </div>
        
        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="region" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Region
                </label>
                <select
                  id="region"
                  value={selectedRegion}
                  onChange={handleRegionChange}
                  className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Nepal</option>
                  <option value="province1">Province 1</option>
                  <option value="madhesh">Madhesh Province</option>
                  <option value="bagmati">Bagmati Province</option>
                  <option value="gandaki">Gandaki Province</option>
                  <option value="lumbini">Lumbini Province</option>
                  <option value="karnali">Karnali Province</option>
                  <option value="sudurpaschim">Sudurpaschim Province</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Blood Type
                </label>
                <select
                  id="bloodType"
                  className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Types</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="hospital" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Hospital/Blood Bank
                </label>
                <select
                  id="hospital"
                  className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Facilities</option>
                  <option value="redcross">Nepal Red Cross Society</option>
                  <option value="birHospital">Bir Hospital</option>
                  <option value="teachingHospital">Teaching Hospital</option>
                  <option value="patanHospital">Patan Hospital</option>
                  <option value="civilHospital">Civil Hospital</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm">
                Apply Filters
              </button>
            </div>
          </div>
        )}
        
        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard 
            title="statDonors" 
            value={1568} 
            icon={<Users className="h-6 w-6" />} 
            change={12} 
            isPositiveChange={true} 
          />
          <StatsCard 
            title="statRequests" 
            value={427} 
            icon={<Droplets className="h-6 w-6" />} 
            change={8} 
            isPositiveChange={true} 
          />
          <StatsCard 
            title="statDonations" 
            value={312} 
            icon={<Calendar className="h-6 w-6" />} 
            change={5} 
            isPositiveChange={true} 
          />
          <StatsCard 
            title="statLivesSaved" 
            value={298} 
            icon={<Activity className="h-6 w-6" />} 
            change={15} 
            isPositiveChange={true} 
          />
        </div>
        
        {/* Charts Row 1 */}
        <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Blood Availability Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                <Droplets className="h-5 w-5 mr-2 text-red-600 dark:text-red-500" />
                Blood Inventory Status
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Total: {bloodAvailability.reduce((acc, curr) => acc + curr.units, 0)} units
              </span>
            </div>
            
            <div className="relative">
              <div className="overflow-hidden">
                <div className="h-60 flex items-end space-x-2">
                  {bloodAvailability.map((item) => (
                    <div key={item.type} className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-t">
                        <div 
                          className="bg-red-600 dark:bg-red-700 rounded-t" 
                          style={{ 
                            height: `${(item.units / Math.max(...bloodAvailability.map(i => i.units))) * 180}px`,
                            transition: 'height 1s ease-in-out' 
                          }}
                        ></div>
                      </div>
                      <div className="mt-2">
                        <div className="text-xs font-medium text-gray-600 dark:text-gray-400">{item.type}</div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{item.units}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Donation Trends Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-red-600 dark:text-red-500" />
                Donation Trends
              </h2>
            </div>
            
            <div className="relative">
              <div className="overflow-hidden">
                <div className="h-60 flex items-end space-x-2">
                  {donationTrends.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-t">
                        <div 
                          className="bg-blue-500 dark:bg-blue-600 rounded-t" 
                          style={{ 
                            height: `${(item.donations / Math.max(...donationTrends.map(i => i.donations))) * 180}px`,
                            transition: 'height 1s ease-in-out' 
                          }}
                        ></div>
                      </div>
                      <div className="mt-2">
                        <div className="text-xs font-medium text-gray-600 dark:text-gray-400">{item.month}</div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{item.donations}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Charts Row 2 */}
        <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Requests by Purpose */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                <PieChart className="h-5 w-5 mr-2 text-red-600 dark:text-red-500" />
                Requests by Purpose
              </h2>
            </div>
            
            <div className="space-y-4">
              {requestsByPurpose.map((item) => (
                <div key={item.purpose}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{item.purpose}</span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{item.count}</span>
                  </div>
                  <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-green-600 dark:bg-green-500 h-2.5 rounded-full" 
                      style={{ 
                        width: `${(item.count / requestsByPurpose.reduce((acc, curr) => acc + curr.count, 0)) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Geographic Distribution Map */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                <Map className="h-5 w-5 mr-2 text-red-600 dark:text-red-500" />
                Geographic Distribution
              </h2>
            </div>
            
            <div className="flex items-center justify-center h-60 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <div className="text-center">
                <Map className="h-12 w-12 text-gray-400 mx-auto" />
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Interactive map visualization</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">(Coming Soon)</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <Activity className="h-5 w-5 mr-2 text-red-600 dark:text-red-500" />
              Recent Activity
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            <div className="px-6 py-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Blood Drive at Kathmandu University</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">46 donors participated, collecting 41 units</p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</span>
              </div>
            </div>
            
            <div className="px-6 py-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Emergency Request Fulfilled</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">O- blood supplied to Bir Hospital for accident victim</p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">5 hours ago</span>
              </div>
            </div>
            
            <div className="px-6 py-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">New Blood Bank Partnership</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Memorandum signed with Civil Hospital for blood exchange program</p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">1 day ago</span>
              </div>
            </div>
            
            <div className="px-6 py-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Blood Inventory Update</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Critical shortage of B- blood type reported in Bagmati Province</p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">2 days ago</span>
              </div>
            </div>
            
            <div className="px-6 py-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Donor Milestone Reached</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">5000th donor registered on Blood For Nepal platform</p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">3 days ago</span>
              </div>
            </div>
          </div>
          
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
            <a href="#" className="text-sm font-medium text-red-600 dark:text-red-500 hover:text-red-800 dark:hover:text-red-400">
              View all activity →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;