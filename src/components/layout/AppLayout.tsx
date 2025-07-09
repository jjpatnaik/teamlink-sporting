
import React from 'react';
import { Outlet } from 'react-router-dom';
import EnhancedHeader from '@/components/navigation/EnhancedHeader';
import BreadcrumbNavigation from '@/components/navigation/Breadcrumbs';
import EnhancedMobileNav from '@/components/navigation/EnhancedMobileNav';
import AccessibilityFeatures from '@/components/navigation/AccessibilityFeatures';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';

interface AppLayoutProps {
  children?: React.ReactNode;
  className?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, className = '' }) => {
  return (
    <AccessibilityFeatures>
      <div className="min-h-screen flex flex-col">
        <EnhancedHeader />
        <BreadcrumbNavigation />
        <main className={`flex-1 pb-16 md:pb-0 ${className}`}>
          {children || <Outlet />}
        </main>
        <Footer />
        <EnhancedMobileNav />
        <Toaster />
      </div>
    </AccessibilityFeatures>
  );
};

export default AppLayout;
