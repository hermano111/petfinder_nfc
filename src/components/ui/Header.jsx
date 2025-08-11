import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/pet-owner-dashboard',
      icon: 'Home',
      tooltip: 'View all pets and recent activity'
    },
    {
      label: 'My Pets',
      path: '/pet-profile-management',
      icon: 'Heart',
      tooltip: 'Manage pet profiles and information'
    },
    {
      label: 'Medical Records',
      path: '/medical-records-center',
      icon: 'FileText',
      tooltip: 'Access health records and medical history'
    },
    {
      label: 'Activity',
      path: '/scan-history-analytics',
      icon: 'Activity',
      tooltip: 'View scan history and analytics'
    }
  ];

  const isActiveRoute = (path) => {
    return location?.pathname === path;
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location?.pathname]);

  // Don't render header on NFC landing page
  if (location?.pathname === '/nfc-pet-profile-landing') {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-card border-b border-border z-1000">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo */}
        <div className="flex items-center">
          <button
            onClick={() => navigate('/pet-owner-dashboard')}
            className="flex items-center space-x-3 hover:opacity-80 transition-smooth"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Heart" size={20} color="white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-semibold text-foreground">PetFinder</h1>
              <p className="text-xs text-muted-foreground -mt-1">NFC</p>
            </div>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navigationItems?.map((item) => (
            <button
              key={item?.path}
              onClick={() => handleNavigation(item?.path)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-smooth ${
                isActiveRoute(item?.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              title={item?.tooltip}
            >
              <Icon name={item?.icon} size={18} />
              <span>{item?.label}</span>
            </button>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            iconName="Bell"
            iconPosition="left"
            className="relative"
          >
            Alerts
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="Settings"
            onClick={() => navigate('/settings')}
          />
          <Button
            variant="ghost"
            size="sm"
            iconName="User"
            onClick={() => navigate('/profile')}
          />
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            iconName={isMobileMenuOpen ? "X" : "Menu"}
            onClick={toggleMobileMenu}
          />
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-card border-t border-border">
          <nav className="px-4 py-2 space-y-1">
            {navigationItems?.map((item) => (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`flex items-center space-x-3 w-full px-3 py-3 rounded-md text-sm font-medium transition-smooth ${
                  isActiveRoute(item?.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item?.icon} size={20} />
                <span>{item?.label}</span>
              </button>
            ))}
            
            {/* Mobile Actions */}
            <div className="pt-3 mt-3 border-t border-border space-y-1">
              <button
                onClick={() => {
                  navigate('/notifications');
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center space-x-3 w-full px-3 py-3 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
              >
                <Icon name="Bell" size={20} />
                <span>Notifications</span>
              </button>
              <button
                onClick={() => {
                  navigate('/settings');
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center space-x-3 w-full px-3 py-3 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
              >
                <Icon name="Settings" size={20} />
                <span>Settings</span>
              </button>
              <button
                onClick={() => {
                  navigate('/profile');
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center space-x-3 w-full px-3 py-3 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
              >
                <Icon name="User" size={20} />
                <span>Profile</span>
              </button>
            </div>
          </nav>
        </div>
      )}
      {/* Emergency Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-1200">
        <Button
          variant="destructive"
          size="lg"
          iconName="AlertTriangle"
          iconPosition="left"
          onClick={() => navigate('/report-lost-pet')}
          className="shadow-elevated animate-pulse-gentle"
        >
          Report Lost
        </Button>
      </div>
    </header>
  );
};

export default Header;