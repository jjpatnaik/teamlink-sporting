
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchContainer from '@/components/search/SearchContainer';

const SearchPage: React.FC = () => {
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
