import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Mail, Calendar, Droplets, MapPin, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import SearchLocationInput from '../components/common/SearchLocationInput';

const DonorRegistrationPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    bloodType: '',
    rhFactor: '',
    lastDonation: '',
    medicalConditions: '',
    location: {
      province: '',
      district: '',
      municipality: '',
      ward: ''
    },
    street: '',
    agreedToTerms: false,
    availableForEmergency: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? e.target.checked : value
    });
  };
  
  const handleLocationSelected = (location) => {
    setFormData({
      ...formData,
      location: {
        province: location.province || '',
        district: location.district || '',
        municipality: location.municipality || '',
        ward: location.ward || ''
      }
    });
  };
  
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
    window.scrollTo(0, 0);
  };
  
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Redirect after a delay
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            {t('registerTitle')}
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {t('registerSubtitle')}
          </p>
        </div>
        
        {/* Steps indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            {/* Progress Bar */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 -translate-y-1/2"></div>
            <div 
              className="absolute top-1/2 left-0 h-1 bg-red-600 dark:bg-red-500 -translate-y-1/2 transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            ></div>
            
            {/* Steps */}
            <div className={`relative rounded-full w-10 h-10 z-10 flex items-center justify-center ${
              currentStep >= 1 ? 'bg-red-600 dark:bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}>
              <User className="h-5 w-5" />
            </div>
            <div className={`relative rounded-full w-10 h-10 z-10 flex items-center justify-center ${
              currentStep >= 2 ? 'bg-red-600 dark:bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}>
              <Droplets className="h-5 w-5" />
            </div>
            <div className={`relative rounded-full w-10 h-10 z-10 flex items-center justify-center ${
              currentStep >= 3 ? 'bg-red-600 dark:bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}>
              <MapPin className="h-5 w-5" />
            </div>
            <div className={`relative rounded-full w-10 h-10 z-10 flex items-center justify-center ${
              currentStep >= 4 ? 'bg-red-600 dark:bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}>
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
          
          <div className="flex justify-between mt-2 text-xs text-gray-600 dark:text-gray-400">
            <span>{t('personalInfo')}</span>
            <span>{t('medicalInfo')}</span>
            <span>{t('locationInfo')}</span>
            <span>Confirm</span>
          </div>
        </div>
        
        {isSuccess ? (
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 text-center">
            <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Registration Successful!</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Thank you for registering as a blood donor. You are now part of our life-saving community.
            </p>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-500">
              Redirecting you to the homepage...
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">{t('personalInfo')}</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('fullName')} *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('phoneNumber')} *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          id="phoneNumber"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('email')}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('dateOfBirth')} *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="date"
                          id="dateOfBirth"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleInputChange}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('gender')} *
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-end">
                    <button
                      type="button"
                      onClick={nextStep}
                      className="ml-3 inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
              
              {/* Step 2: Medical Information */}
              {currentStep === 2 && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">{t('medicalInfo')}</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('bloodType')} *
                      </label>
                      <select
                        id="bloodType"
                        name="bloodType"
                        value={formData.bloodType}
                        onChange={handleInputChange}
                        className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      >
                        <option value="">Select Blood Type</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="AB">AB</option>
                        <option value="O">O</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="rhFactor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('rhFactor')} *
                      </label>
                      <select
                        id="rhFactor"
                        name="rhFactor"
                        value={formData.rhFactor}
                        onChange={handleInputChange}
                        className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      >
                        <option value="">Select Rh Factor</option>
                        <option value="+">Positive (+)</option>
                        <option value="-">Negative (-)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="lastDonation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('lastDonation')}
                      </label>
                      <input
                        type="date"
                        id="lastDonation"
                        name="lastDonation"
                        value={formData.lastDonation}
                        onChange={handleInputChange}
                        className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="medicalConditions" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('medicalConditions')}
                      </label>
                      <textarea
                        id="medicalConditions"
                        name="medicalConditions"
                        value={formData.medicalConditions}
                        onChange={handleInputChange}
                        rows={3}
                        className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="List any medical conditions or medications..."
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="availableForEmergency"
                        name="availableForEmergency"
                        type="checkbox"
                        checked={formData.availableForEmergency}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <label htmlFor="availableForEmergency" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        I am available for emergency blood donation
                      </label>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="inline-flex justify-center py-2 px-6 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-white bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="ml-3 inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
              
              {/* Step 3: Location Information */}
              {currentStep === 3 && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">{t('locationInfo')}</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Select Your Location *
                      </label>
                      <SearchLocationInput onLocationSelected={handleLocationSelected} />
                      
                      {formData.location.province && (
                        <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            <span className="font-semibold">Selected Location:</span> {formData.location.province}, {formData.location.district}, {formData.location.municipality}
                            {formData.location.ward ? `, Ward ${formData.location.ward}` : ''}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="street" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('street')} *
                      </label>
                      <input
                        type="text"
                        id="street"
                        name="street"
                        value={formData.street}
                        onChange={handleInputChange}
                        className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="inline-flex justify-center py-2 px-6 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-white bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="ml-3 inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
              
              {/* Step 4: Confirmation */}
              {currentStep === 4 && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Confirm Your Information</h2>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('personalInfo')}</h3>
                      <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{t('fullName')}</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{formData.fullName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{t('phoneNumber')}</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{formData.phoneNumber}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{t('email')}</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{formData.email || '-'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{t('dateOfBirth')}</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{formData.dateOfBirth}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{t('gender')}</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{formData.gender}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('medicalInfo')}</h3>
                      <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{t('bloodType')}</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{formData.bloodType} {formData.rhFactor}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{t('lastDonation')}</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{formData.lastDonation || '-'}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-xs text-gray-500 dark:text-gray-400">{t('medicalConditions')}</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{formData.medicalConditions || '-'}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Emergency Availability</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {formData.availableForEmergency ? 'Available for emergency' : 'Not available for emergency'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('locationInfo')}</h3>
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Address</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {formData.street}, {formData.location.municipality}, {formData.location.district}, {formData.location.province}
                          {formData.location.ward ? `, Ward ${formData.location.ward}` : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="agreedToTerms"
                          name="agreedToTerms"
                          type="checkbox"
                          checked={formData.agreedToTerms}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                          required
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="agreedToTerms" className="font-medium text-gray-700 dark:text-gray-300">
                          I agree to the <a href="#" className="text-red-600 hover:text-red-500">Terms and Conditions</a> and <a href="#" className="text-red-600 hover:text-red-500">Privacy Policy</a>
                        </label>
                        <p className="text-gray-500 dark:text-gray-400">
                          By registering, you agree to be contacted for blood donation purposes.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="inline-flex justify-center py-2 px-6 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-white bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Previous
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !formData.agreedToTerms}
                      className={`ml-3 inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                        isSubmitting || !formData.agreedToTerms 
                          ? 'bg-red-300 dark:bg-red-800 cursor-not-allowed' 
                          : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                      }`}
                    >
                      {isSubmitting ? 'Submitting...' : 'Register as Donor'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorRegistrationPage;