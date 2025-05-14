
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchContainer from '@/components/search/SearchContainer';

const SearchPage: React.FC = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Scroll to top when navigating to this page or when the URL parameters change
    window.scrollTo(0, 0);
    
    // Add console log to track page navigation
    console.log("Navigated to search page with params:", location.search);
  }, [location.search]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <SearchContainer />
      </main>
      <Footer />
    </div>
  );
};

export default SearchPage;
