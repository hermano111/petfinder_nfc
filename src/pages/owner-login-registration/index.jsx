import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthHeader from './components/AuthHeader';
import AuthTabs from './components/AuthTabs';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import HelpSection from './components/HelpSection';
import TestimonialCarousel from './components/TestimonialCarousel';

const OwnerLoginRegistration = () => {
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is already authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated === 'true') {
      navigate('/pet-owner-dashboard');
      return;
    }

    // Check for URL parameters or state to determine initial tab
    const urlParams = new URLSearchParams(location.search);
    const action = urlParams?.get('action');
    const fromState = location?.state?.action;
    
    if (action === 'register' || fromState === 'register') {
      setActiveTab('register');
    } else if (action === 'login' || fromState === 'login') {
      setActiveTab('login');
    }
  }, [navigate, location]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Update URL without causing navigation
    const newUrl = new URL(window.location);
    newUrl?.searchParams?.set('action', tab);
    window.history?.replaceState({}, '', newUrl);
  };

  const toggleForm = () => {
    const newTab = activeTab === 'login' ? 'register' : 'login';
    setActiveTab(newTab);
    handleTabChange(newTab);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Authentication Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md mx-auto">
          <AuthHeader />
          
          <div className="bg-card rounded-xl shadow-elevated border border-border p-6 sm:p-8">
            <AuthTabs activeTab={activeTab} onTabChange={handleTabChange} />
            
            <LoginForm 
              isActive={activeTab === 'login'} 
              onToggleForm={toggleForm}
            />
            
            <RegisterForm 
              isActive={activeTab === 'register'} 
              onToggleForm={toggleForm}
            />
            
            <HelpSection />
          </div>

          {/* Footer Links */}
          <div className="mt-8 text-center space-y-2">
            <div className="flex justify-center space-x-6 text-sm">
              <button 
                onClick={() => navigate('/privacy-policy')}
                className="text-muted-foreground hover:text-foreground transition-smooth"
              >
                Privacidad
              </button>
              <button 
                onClick={() => navigate('/terms-of-service')}
                className="text-muted-foreground hover:text-foreground transition-smooth"
              >
                Términos
              </button>
              <button 
                onClick={() => navigate('/contact')}
                className="text-muted-foreground hover:text-foreground transition-smooth"
              >
                Contacto
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              © {new Date()?.getFullYear()} PetFinder NFC. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
      {/* Right Side - Testimonials (Desktop Only) */}
      <TestimonialCarousel />
    </div>
  );
};

export default OwnerLoginRegistration;