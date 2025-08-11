import React from 'react';

const AuthTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'login', label: 'Iniciar Sesión' },
    { id: 'register', label: 'Registrarse' }
  ];

  return (
    <div className="flex bg-muted rounded-lg p-1 mb-8">
      {tabs?.map((tab) => (
        <button
          key={tab?.id}
          onClick={() => onTabChange(tab?.id)}
          className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-smooth ${
            activeTab === tab?.id
              ? 'bg-card text-foreground shadow-soft'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {tab?.label}
        </button>
      ))}
    </div>
  );
};

export default AuthTabs;