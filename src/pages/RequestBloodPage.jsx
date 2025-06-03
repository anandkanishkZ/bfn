import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Clock, MapPin, HeartPulse as Pulse, User, Phone, Heart, Building, CheckCircle, Upload } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import SearchLocationInput from '../components/common/SearchLocationInput';
import BloodTypeCard from '../components/common/BloodTypeCard';

const RequestBloodPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    patientName: '',
    patientAge: '',
    patientGender: '',
    contactName: '',
    contactPhone: '',
    relationship: '',
    bloodType: '',
    rhFactor: '',
    quantity: 1,
    urgency: 'normal',
    requiredDate: '',
    purpose: '',
    hospitalName: '',
    hospitalAddress: '',
    location: {
      province: '',
      district: '',
      municipality: '',
      ward: ''
    },
    additionalInfo: '',
    prescription: null,
    prescriptionPreview: '',
    agreedToTerms: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      if (files && files[0]) {
        // Check file type
        const file = files[0];
        if (!file.type.startsWith('image/')) {
          alert('Please upload an image file (JPEG, PNG, etc.)');
          return;
        }
        
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert('File size should be less than 5MB');
          return;
        }
        
        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        
        setFormData({
          ...formData,
          prescription: file,
          prescriptionPreview: previewUrl
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? e.target.checked : value
      });
    }
  };
  
  const handleBloodTypeSelect = (type, rhFactor) => {
    setFormData({
      ...formData,
      bloodType: type,
      rhFactor: rhFactor
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
      
      // Clean up preview URL
      if (formData.prescriptionPreview) {
        URL.revokeObjectURL(formData.prescriptionPreview);
      }
      
      // Redirect after a delay
      setTimeout(() => {
        navigate('/');
      }, 3000);
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

  // Add prescription upload section to Step 2 (Request Information)
  const renderPrescriptionUpload = () => (
    <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Prescription Upload</h3>
      
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
          {formData.prescriptionPreview ? (
            <div className="space-y-4">
              <div className="relative aspect-[3/4] w-full max-w-sm mx-auto">
                <img
                  src={formData.prescriptionPreview}
                  alt="Prescription preview"
                  className="rounded-lg object-cover w-full h-full"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, prescription: null, prescriptionPreview: '' })}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Click the X to remove and upload a different image
              </p>
            </div>
          ) : (
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4 flex text-sm text-gray-600 dark:text-gray-400">
                <label
                  htmlFor="prescription-upload"
                  className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-red-600 dark:text-red-500 hover:text-red-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-red-500"
                >
                  <span>Upload prescription</span>
                  <input
                    id="prescription-upload"
                    name="prescription"
                    type="file"
                    accept="image/*"
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
          )}
        </div>
        
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p className="flex items-center">
            <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
            Please ensure the prescription is clearly visible and includes:
          </p>
          <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
            <li>Doctor's name and signature</li>
            <li>Hospital/Clinic details</li>
            <li>Patient's name</li>
            <li>Required blood type and quantity</li>
            <li>Date of prescription</li>
          </ul>
        </div>
      </div>
    </div>
  );

  // Update Step 2 to include prescription upload
  const renderStep2 = () => (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">{t('requestInfo')}</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Blood Type Required *
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
          {formData.bloodType && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Selected: <span className="font-medium">{formData.bloodType} {formData.rhFactor}</span>
            </p>
          )}
        </div>
        
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Units Required *
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            min="1"
            max="10"
            className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          />
        </div>
        
        <div>
          <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Urgency Level *
          </label>
          <select
            id="urgency"
            name="urgency"
            value={formData.urgency}
            onChange={handleInputChange}
            className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          >
            <option value="normal">Normal (Within days)</option>
            <option value="urgent">Urgent (Within 24 hours)</option>
            <option value="emergency">Emergency (Immediate)</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="requiredDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Required By Date
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              id="requiredDate"
              name="requiredDate"
              value={formData.requiredDate}
              onChange={handleInputChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Purpose *
          </label>
          <select
            id="purpose"
            name="purpose"
            value={formData.purpose}
            onChange={handleInputChange}
            className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          >
            <option value="">Select Purpose</option>
            <option value="surgery">Surgery</option>
            <option value="accident">Accident</option>
            <option value="pregnancy">Pregnancy/Childbirth</option>
            <option value="anemia">Anemia</option>
            <option value="cancer">Cancer Treatment</option>
            <option value="other">Other</option>
          </select>
        </div>

        {renderPrescriptionUpload()}
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
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            {t('requestTitle')}
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {t('requestSubtitle')}
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
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className={`relative rounded-full w-10 h-10 z-10 flex items-center justify-center ${
              currentStep >= 3 ? 'bg-red-600 dark:bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}>
              <Building className="h-5 w-5" />
            </div>
            <div className={`relative rounded-full w-10 h-10 z-10 flex items-center justify-center ${
              currentStep >= 4 ? 'bg-red-600 dark:bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}>
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
          
          <div className="flex justify-between mt-2 text-xs text-gray-600 dark:text-gray-400">
            <span>{t('patientInfo')}</span>
            <span>{t('requestInfo')}</span>
            <span>{t('hospitalInfo')}</span>
            <span>Confirm</span>
          </div>
        </div>
        
        {isSuccess ? (
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 text-center">
            <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Request Submitted Successfully!</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Your blood request has been sent. Nearby donors will be notified.
            </p>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Request ID: <span className="font-medium">BFN-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</span>
            </p>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-500">
              Redirecting you to the homepage...
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Patient Information */}
              {currentStep === 1 && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">{t('patientInfo')}</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Patient Name *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="patientName"
                          name="patientName"
                          value={formData.patientName}
                          onChange={handleInputChange}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="patientAge" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Patient Age *
                        </label>
                        <input
                          type="number"
                          id="patientAge"
                          name="patientAge"
                          value={formData.patientAge}
                          onChange={handleInputChange}
                          min="0"
                          max="120"
                          className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="patientGender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Patient Gender *
                        </label>
                        <select
                          id="patientGender"
                          name="patientGender"
                          value={formData.patientGender}
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
                    
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <h3 className="text-base font-medium text-gray-900 dark:text-white mb-3">Contact Information</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Contact Person Name *
                          </label>
                          <input
                            type="text"
                            id="contactName"
                            name="contactName"
                            value={formData.contactName}
                            onChange={handleInputChange}
                            className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Contact Phone *
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Phone className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                type="tel"
                                id="contactPhone"
                                name="contactPhone"
                                value={formData.contactPhone}
                                onChange={handleInputChange}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                required
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label htmlFor="relationship" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Relationship to Patient *
                            </label>
                            <select
                              id="relationship"
                              name="relationship"
                              value={formData.relationship}
                              onChange={handleInputChange}
                              className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              required
                            >
                              <option value="">Select Relationship</option>
                              <option value="self">Self</option>
                              <option value="family">Family Member</option>
                              <option value="friend">Friend</option>
                              <option value="hospital">Hospital Staff</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                        </div>
                      </div>
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
              
              {/* Step 2: Request Information */}
              {currentStep === 2 && renderStep2()}
              
              {/* Step 3: Hospital Information */}
              {currentStep === 3 && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">{t('hospitalInfo')}</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="hospitalName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Hospital/Clinic Name *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Building className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="hospitalName"
                          name="hospitalName"
                          value={formData.hospitalName}
                          onChange={handleInputChange}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="hospitalAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Hospital Address *
                      </label>
                      <input
                        type="text"
                        id="hospitalAddress"
                        name="hospitalAddress"
                        value={formData.hospitalAddress}
                        onChange={handleInputChange}
                        className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Hospital Location *
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
                      <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Additional Information
                      </label>
                      <textarea
                        id="additionalInfo"
                        name="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={handleInputChange}
                        rows={3}
                        className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Any additional details that might help donors..."
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
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Confirm Request Details</h2>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('patientInfo')}</h3>
                      <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Patient Name</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{formData.patientName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Patient Age/Gender</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{formData.patientAge} / {formData.patientGender}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Contact Person</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{formData.contactName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Contact Phone</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{formData.contactPhone}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('requestInfo')}</h3>
                      <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Blood Type</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{formData.bloodType} {formData.rhFactor}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Units Required</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{formData.quantity}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Urgency</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{formData.urgency}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Required By</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{formData.requiredDate || 'As soon as possible'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Purpose</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{formData.purpose}</p>
                        </div>
                      </div>

                      {formData.prescriptionPreview && (
                        <div className="mt-4">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Prescription</p>
                          <div className="mt-2 relative w-32 h-32">
                            <img
                              src={formData.prescriptionPreview}
                              alt="Prescription"
                              className="rounded-lg object-cover w-full h-full"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('hospitalInfo')}</h3>
                      <div className="mt-2">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Hospital/Clinic</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{formData.hospitalName}</p>
                        </div>
                        <div className="mt-1">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Location</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {formData.hospitalAddress}, {formData.location.municipality}, {formData.location.district}, {formData.location.province}
                            {formData.location.ward ? `, Ward ${formData.location.ward}` : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {formData.additionalInfo && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Additional Information</h3>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">{formData.additionalInfo}</p>
                      </div>
                    )}
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
                          I confirm that all information provided is accurate
                        </label>
                        <p className="text-gray-500 dark:text-gray-400">
                          Your request will be sent to matching donors in the area.
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
                      {isSubmitting ? 'Submitting...' : 'Submit Blood Request'}
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

export default RequestBloodPage;