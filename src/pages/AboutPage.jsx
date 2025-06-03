import React from 'react';

const AboutPage = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">About Blood For Nepal (BFN)</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Blood For Nepal (BFN) is a community-driven platform dedicated to connecting blood donors with patients and health institutions across Nepal. Our mission is to make blood donation accessible, transparent, and efficient for everyone in need.
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-4">Our Mission</h2>
        <p className="text-gray-700 dark:text-gray-200 mb-4">
          We strive to save lives by bridging the gap between blood donors and recipients. Through real-time technology, we empower individuals and organizations to respond quickly to urgent blood needs, promote regular donation, and foster a culture of giving.
        </p>
        <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-4 mt-8">What We Do</h2>
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-200 space-y-2">
          <li>Connect donors and patients in real-time across Nepal</li>
          <li>Provide up-to-date information on blood inventory and requests</li>
          <li>Support emergency blood requests and notifications</li>
          <li>Educate the public about blood donation and its impact</li>
          <li>Build a supportive community of regular donors and volunteers</li>
        </ul>
        <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-4 mt-8">Our Values</h2>
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-200 space-y-2">
          <li>Transparency and trust</li>
          <li>Community and compassion</li>
          <li>Innovation and accessibility</li>
          <li>Respect for privacy and data security</li>
        </ul>
      </div>
      <div className="text-center text-gray-600 dark:text-gray-400 text-base">
        <p>
          Want to get involved or learn more? <br />
          Contact us at <a href="mailto:info@bloodfornepal.org" className="text-red-600 dark:text-red-400 underline">info@bloodfornepal.org</a>
        </p>
      </div>
    </div>
  </div>
);

export default AboutPage;
