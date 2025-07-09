import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface AccessibilityFeaturesProps {
  children: React.ReactNode;
}

const AccessibilityFeatures: React.FC<AccessibilityFeaturesProps> = ({ children }) => {
  const location = useLocation();

  // Announce route changes to screen readers
  useEffect(() => {
    const announceRouteChange = () => {
      const routeTitles: Record<string, string> = {
        '/': 'Home page',
        '/search': 'Search page',
        '/teams': 'Teams page',
        '/tournaments': 'Tournaments page',
        '/auth': 'Authentication page',
        '/createprofile': 'Create profile page',
        '/edit-profile': 'Edit profile page',
        '/organiser/tournament': 'Tournament organizer panel',
        '/connections': 'Connections page',
        '/how-it-works': 'How it works page'
      };

      const currentTitle = routeTitles[location.pathname] || 'Page';
      
      // Create a live region for screen reader announcements
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = `Navigated to ${currentTitle}`;
      
      document.body.appendChild(announcement);
      
      // Remove after announcement
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    };

    announceRouteChange();
  }, [location.pathname]);

  // Focus management for route changes
  useEffect(() => {
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.focus();
    }
  }, [location.pathname]);

  // Skip link component
  const SkipLink = () => (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg"
    >
      Skip to main content
    </a>
  );

  return (
    <>
      <SkipLink />
      <div id="main-content" tabIndex={-1}>
        {children}
      </div>
    </>
  );
};

export default AccessibilityFeatures;