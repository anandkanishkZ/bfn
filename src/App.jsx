import React from 'react';
import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import DonorRegistrationPage from './pages/DonorRegistrationPage';
import RequestBloodPage from './pages/RequestBloodPage';
import FindDonorsPage from './pages/FindDonorsPage';
import EducationPage from './pages/EducationPage';
import EmergencyPage from './pages/EmergencyPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboard from './pages/AdminDashboard';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import ProfilePage from './pages/ProfilePage';
import { LanguageProvider } from './context/LanguageContext';
import BackToTop from './components/common/BackToTop';
import AuthCheck from './components/admin/AuthCheck';

const ProtectedRoute = ({ children, role }) => {
  // Get user from localStorage and provide better error handling
  let user;
  try {
    const userStr = localStorage.getItem('user');
    user = userStr ? JSON.parse(userStr) : null;
    console.log('ProtectedRoute - User:', user);
    console.log('ProtectedRoute - Required role:', role);
    console.log('ProtectedRoute - User role:', user?.role);
  } catch (e) {
    console.error('Error parsing user from localStorage:', e);
    return <Navigate to="/login" />;
  }

  if (!user) {
    console.log('ProtectedRoute - No user found, redirecting to login');
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    console.log(`ProtectedRoute - User role ${user.role} doesn't match required role ${role}, redirecting to profile`);
    return <Navigate to="/profile" />;
  }

  console.log('ProtectedRoute - Access granted');
  return children;
};

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      document.documentElement.classList.toggle('dark', !prev);
      return !prev;
    });
  };

  return (
    <LanguageProvider>
      <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark' : ''}`}>
        <Navbar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<><HomePage /><BackToTop /></>} />
            <Route path="/register" element={<><DonorRegistrationPage /><BackToTop /></>} />
            <Route path="/request" element={<><RequestBloodPage /><BackToTop /></>} />
            <Route path="/find" element={<><FindDonorsPage /><BackToTop /></>} />
            <Route path="/education" element={<><EducationPage /><BackToTop /></>} />
            <Route path="/emergency" element={<><EmergencyPage /><BackToTop /></>} />
            <Route path="/dashboard" element={<><DashboardPage /><BackToTop /></>} />
            <Route path="/admin" element={<ProtectedRoute role="admin"><><AdminDashboard /><BackToTop /></></ProtectedRoute>} />
            <Route path="/about" element={<><AboutPage /><BackToTop /></>} />
            <Route path="/login" element={<><LoginPage /><BackToTop /></>} />
            <Route path="/register-user" element={<><RegistrationPage /><BackToTop /></>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
        {/* Auth Debug Component */}
        <AuthCheck />
      </div>
    </LanguageProvider>
  );
}

export default App;