import React, { useState } from 'react';
import { Search, Users, MapPin, Filter, Droplets } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import SearchLocationInput from '../components/common/SearchLocationInput';
import BloodTypeCard from '../components/common/BloodTypeCard';

const FindDonorsPage = () => {
  const { t } = useLanguage();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedBloodType, setSelectedBloodType] = useState(null);
  const [selectedRhFactor, setSelectedRhFactor] = useState(null);
  const [distanceFilter, setDistanceFilter] = useState(10);
  const [isEmergencyOnly, setIsEmergencyOnly] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [donors, setDonors] = useState([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  const handleLocationSelected = (location) => {
    setSelectedLocation(location);
  };
  
  const handleBloodTypeSelect = (type, rhFactor) => {
    setSelectedBloodType(type);
    setSelectedRhFactor(rhFactor);
  };
  
  const handleSearch = () => {
    if (!selectedLocation || !selectedBloodType) {
      return;
    }
    
    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock data
      const mockDonors = [
        {
          id: 1,
          name: 'Rajesh Sharma',
          bloodType: 'A',
          rhFactor: '+' ,
          distance: 2.1,
          location: 'Kathmandu Metropolitan City',
          lastDonation: '2023-08-15',
          availableForEmergency: true
        },
        {
          id: 2,
          name: 'Sita Thapa',
          bloodType: 'A',
          rhFactor: '+' ,
          distance: 3.4,
          location: 'Kathmandu Metropolitan City',
          lastDonation: '2023-11-20',
          availableForEmergency: false
        },
        {
          id: 3,
          name: 'Binod Gurung',
          bloodType: 'A',
          rhFactor: '+' ,
          distance: 5.7,
          location: 'Chandragiri Municipality',
          lastDonation: '2024-01-05',
          availableForEmergency: true
        },
        {
          id: 4,
          name: 'Anita Poudel',
          bloodType: 'A',
          rhFactor: '+' ,
          distance: 6.3,
          location: 'Tokha Municipality',
          lastDonation: '2023-07-30',
          availableForEmergency: true
        },
        {
          id: 5,
          name: 'Krishna Adhikari',
          bloodType: 'A',
          rhFactor: '+' ,
          distance: 8.5,
          location: 'Budhanilkantha Municipality',
          lastDonation: '2023-10-12',
          availableForEmergency: false
        },
      ];
      
      // Filter based on distance and emergency availability
      const filteredDonors = mockDonors.filter((donor) => {
        return donor.distance <= distanceFilter && 
               (!isEmergencyOnly || donor.availableForEmergency);
      });
      
      setDonors(filteredDonors);
      setIsSearching(false);
    }, 1500);
  };
  
  const bloodTypes = [
    { type: 'A', rhFactor: '+' },
    { type: 'A', rhFactor: '-' },
    { type: 'B', rhFactor: '+' },
    { type: 'B', rhFactor: '-' },
    { type: 'AB', rhFactor: '+' },
    { type: 'AB', rhFactor: '-' },
    { type: 'O', rhFactor: '+' },
    { type: 'O', rhFactor: '-' },
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Find Blood Donors
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Search for available blood donors near you based on location and blood type
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Search Criteria</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Location *
                </label>
                <SearchLocationInput onLocationSelected={handleLocationSelected} />
                
                {selectedLocation && (
                  <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-semibold">Selected Location:</span> {selectedLocation.province}, {selectedLocation.district}, {selectedLocation.municipality}
                      {selectedLocation.ward ? `, Ward ${selectedLocation.ward}` : ''}
                    </p>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Required Blood Type *
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {bloodTypes.map((bt) => (
                    <BloodTypeCard
                      key={`${bt.type}${bt.rhFactor}`}
                      type={bt.type}
                      rhFactor={bt.rhFactor}
                      isAvailable={true}
                      onClick={() => handleBloodTypeSelect(bt.type, bt.rhFactor)}
                    />
                  ))}
                </div>
                {selectedBloodType && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Selected: <span className="font-medium">{selectedBloodType} {selectedRhFactor}</span>
                  </p>
                )}
              </div>
              
              <button
                type="button"
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="flex items-center text-sm text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 focus:outline-none"
              >
                <Filter className="h-4 w-4 mr-1" />
                {isFiltersOpen ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
              </button>
              
              {isFiltersOpen && (
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Advanced Filters</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="distanceFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Maximum Distance: {distanceFilter} km
                      </label>
                      <input
                        type="range"
                        id="distanceFilter"
                        min="1"
                        max="50"
                        value={distanceFilter}
                        onChange={(e) => setDistanceFilter(parseInt(e.target.value))}
                        className="block w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full appearance-none cursor-pointer focus:outline-none"
                      />
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>1 km</span>
                        <span>25 km</span>
                        <span>50 km</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="emergencyOnly"
                        type="checkbox"
                        checked={isEmergencyOnly}
                        onChange={() => setIsEmergencyOnly(!isEmergencyOnly)}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <label htmlFor="emergencyOnly" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Show only donors available for emergency
                      </label>
                    </div>
                  </div>
                </div>
              )}
              
              <div>
                <button
                  type="button"
                  onClick={handleSearch}
                  disabled={!selectedLocation || !selectedBloodType || isSearching}
                  className={`w-full inline-flex justify-center items-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white ${
                    !selectedLocation || !selectedBloodType || isSearching 
                      ? 'bg-red-300 dark:bg-red-800 cursor-not-allowed' 
                      : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                  }`}
                >
                  {isSearching ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Find Donors
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Results Section */}
          {donors.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-red-600 dark:text-red-500" />
                  Found {donors.length} matching donors
                </div>
              </h2>
              
              <div className="space-y-4">
                {donors.map((donor) => (
                  <div 
                    key={donor.id} 
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{donor.name}</h3>
                        <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-400">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{donor.location} • {donor.distance} km away</span>
                        </div>
                        <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-400">
                          <Droplets className="h-4 w-4 mr-1" />
                          <span>Last donation: {new Date(donor.lastDonation).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center mb-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            {donor.bloodType}{donor.rhFactor}
                          </span>
                        </div>
                        {donor.availableForEmergency && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Available for Emergency
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end space-x-3">
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-white bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Message
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Request Donation
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindDonorsPage;