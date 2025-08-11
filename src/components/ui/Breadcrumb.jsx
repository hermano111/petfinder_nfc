import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = ({ customBreadcrumbs = null }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Don't render breadcrumbs on landing or login pages
  if (location?.pathname === '/nfc-pet-profile-landing' || location?.pathname === '/owner-login-registration') {
    return null;
  }

  const routeMap = {
    '/pet-owner-dashboard': { label: 'Dashboard', icon: 'Home' },
    '/pet-profile-management': { label: 'My Pets', icon: 'Heart' },
    '/medical-records-center': { label: 'Medical Records', icon: 'FileText' },
    '/scan-history-analytics': { label: 'Activity', icon: 'Activity' }
  };

  const generateBreadcrumbs = () => {
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }

    const pathSegments = location?.pathname?.split('/')?.filter(Boolean);
    const breadcrumbs = [
      { label: 'Dashboard', path: '/pet-owner-dashboard', icon: 'Home' }
    ];

    if (location?.pathname !== '/pet-owner-dashboard') {
      const currentRoute = routeMap?.[location?.pathname];
      if (currentRoute) {
        breadcrumbs?.push({
          label: currentRoute?.label,
          path: location?.pathname,
          icon: currentRoute?.icon,
          isActive: true
        });
      }
    } else {
      breadcrumbs[0].isActive = true;
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  const handleBreadcrumbClick = (path, isActive) => {
    if (!isActive && path) {
      navigate(path);
    }
  };

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
      {breadcrumbs?.map((crumb, index) => (
        <div key={index} className="flex items-center space-x-2">
          {index > 0 && (
            <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
          )}
          <button
            onClick={() => handleBreadcrumbClick(crumb?.path, crumb?.isActive)}
            className={`flex items-center space-x-1 transition-smooth ${
              crumb?.isActive
                ? 'text-foreground font-medium cursor-default'
                : 'hover:text-foreground cursor-pointer'
            }`}
            disabled={crumb?.isActive}
          >
            {crumb?.icon && (
              <Icon 
                name={crumb?.icon} 
                size={14} 
                className={crumb?.isActive ? 'text-primary' : 'text-muted-foreground'} 
              />
            )}
            <span>{crumb?.label}</span>
          </button>
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;