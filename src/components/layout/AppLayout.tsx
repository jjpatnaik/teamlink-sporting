
import React from 'react';
import ImprovedHeader from './ImprovedHeader';
import MobileBottomNav from '../navigation/MobileBottomNav';

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, className = '' }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <ImprovedHeader />
      
      <main className={`flex-1 ${className} pb-20 md:pb-0`}>
        {children}
      </main>
      
      <MobileBottomNav />
    </div>
  );
};

export default AppLayout;
