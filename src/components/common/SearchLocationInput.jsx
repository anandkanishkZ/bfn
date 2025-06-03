import React from 'react';
import { useState, useEffect } from 'react';
import { Search, X, MapPin } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

// Nepal's administrative data
import nepalData from '../../data/nepal-administrative-data';

const SearchLocationInput = ({ onLocationSelected }) => {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  
  const handleSearch = (e) => {
    setQuery(e.target.value);
    if (e.target.value) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };
  
  const clearSelection = () => {
    setQuery('');
    setSelectedProvince(null);
    setSelectedDistrict(null);
    setSelectedMunicipality(null);
    setSelectedWard(null);
    setShowResults(false);
  };
  
  const handleProvinceSelect = (province) => {
    setSelectedProvince(province);
    setQuery(province);
    setShowResults(false);
  };
  
  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district);
    setQuery(`${selectedProvince} > ${district}`);
    setShowResults(false);
  };
  
  const handleMunicipalitySelect = (municipality) => {
    setSelectedMunicipality(municipality);
    setQuery(`${selectedProvince} > ${selectedDistrict} > ${municipality}`);
    setShowResults(false);
    
    // Complete the location selection
    onLocationSelected({
      province: selectedProvince,
      district: selectedDistrict,
      municipality: municipality
    });
  };
  
  const handleWardSelect = (ward) => {
    setSelectedWard(ward);
    setQuery(`${selectedProvince} > ${selectedDistrict} > ${selectedMunicipality} > Ward ${ward}`);
    setShowResults(false);
    
    // Complete the location selection with ward
    onLocationSelected({
      province: selectedProvince,
      district: selectedDistrict,
      municipality: selectedMunicipality,
      ward: ward
    });
  };
  
  // Filter provinces based on query
  const filteredProvinces = !selectedProvince 
    ? Object.keys(nepalData).filter(province => 
        province.toLowerCase().includes(query.toLowerCase()))
    : [];
  
  // Filter districts based on selected province and query
  const filteredDistricts = selectedProvince && !selectedDistrict
    ? Object.keys(nepalData[selectedProvince]).filter(district =>
        district.toLowerCase().includes(query.replace(`${selectedProvince} > `, '').toLowerCase()))
    : [];
  
  // Filter municipalities based on selected province, district and query
  const filteredMunicipalities = selectedProvince && selectedDistrict && !selectedMunicipality
    ? nepalData[selectedProvince][selectedDistrict].municipalities.filter(municipality =>
        municipality.toLowerCase().includes(query.replace(`${selectedProvince} > ${selectedDistrict} > `, '').toLowerCase()))
    : [];
  
  // Generate ward numbers (1-32 is a common range for wards in Nepal)
  const wards = selectedProvince && selectedDistrict && selectedMunicipality && !selectedWard
    ? Array.from({ length: 32 }, (_, i) => (i + 1).toString())
    : [];
  
  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          type="text"
          className="block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          placeholder={t('search')}
          value={query}
          onChange={handleSearch}
          onFocus={() => setShowResults(true)}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        {query && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={clearSelection}
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
          </button>
        )}
      </div>
      
      {/* Results dropdown */}
      {showResults && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg max-h-60 rounded-lg py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {/* Show provinces */}
          {!selectedProvince && filteredProvinces.length > 0 && (
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
              Provinces
            </div>
          )}
          {!selectedProvince && filteredProvinces.map((province) => (
            <div
              key={province}
              className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => handleProvinceSelect(province)}
            >
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                <span className="font-normal block truncate">{province}</span>
              </div>
            </div>
          ))}
          
          {/* Show districts */}
          {selectedProvince && !selectedDistrict && filteredDistricts.length > 0 && (
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
              Districts in {selectedProvince}
            </div>
          )}
          {selectedProvince && !selectedDistrict && filteredDistricts.map((district) => (
            <div
              key={district}
              className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => handleDistrictSelect(district)}
            >
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                <span className="font-normal block truncate">{district}</span>
              </div>
            </div>
          ))}
          
          {/* Show municipalities */}
          {selectedProvince && selectedDistrict && !selectedMunicipality && filteredMunicipalities.length > 0 && (
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
              Municipalities in {selectedDistrict}
            </div>
          )}
          {selectedProvince && selectedDistrict && !selectedMunicipality && filteredMunicipalities.map((municipality) => (
            <div
              key={municipality}
              className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => handleMunicipalitySelect(municipality)}
            >
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                <span className="font-normal block truncate">{municipality}</span>
              </div>
            </div>
          ))}
          
          {/* Show wards */}
          {selectedProvince && selectedDistrict && selectedMunicipality && !selectedWard && wards.length > 0 && (
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
              Wards in {selectedMunicipality}
            </div>
          )}
          {selectedProvince && selectedDistrict && selectedMunicipality && !selectedWard && wards.map((ward) => (
            <div
              key={ward}
              className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => handleWardSelect(ward)}
            >
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                <span className="font-normal block truncate">Ward {ward}</span>
              </div>
            </div>
          ))}
          
          {/* No results */}
          {((filteredProvinces.length === 0 && !selectedProvince) ||
            (filteredDistricts.length === 0 && selectedProvince && !selectedDistrict) ||
            (filteredMunicipalities.length === 0 && selectedProvince && selectedDistrict && !selectedMunicipality)) && (
            <div className="py-2 px-3 text-sm text-gray-500 dark:text-gray-400">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchLocationInput;