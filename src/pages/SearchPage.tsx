
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchContainer from '@/components/search/SearchContainer';
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const SearchPage: React.FC = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Scroll to top when navigating to this page or when the URL parameters change
    window.scrollTo(0, 0);
    
    // Add console log to track page navigation
    console.log("Navigated to search page with params:", location.search);

    // Check for authentication status to help debug RLS issues
    const checkAuthStatus = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error checking auth status:", error);
      } else {
        console.log("Auth status:", data.session ? "Authenticated" : "Not authenticated");
      }
    };
    
    checkAuthStatus();
    
    // Show search page toast except when navigating with forceHideBadge parameter 
    // (used by internal navigation)
    const params = new URLSearchParams(location.search);
    if (!params.get('forceHideBadge')) {
      toast({
        title: "Search Page",
        description: "Find players, teams, tournaments and sponsorships"
      });
    }
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
