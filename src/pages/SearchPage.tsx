
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchContainer from '@/components/search/SearchContainer';
import SupabaseDebugPanel from '@/components/debug/SupabaseDebugPanel';
import { toast } from "@/components/ui/use-toast";
import { checkSupabaseClientStatus } from '@/integrations/supabase/client';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const SearchPage: React.FC = () => {
  const location = useLocation();
  const showDebugTools = true; // Set to false to hide in production
  
  useEffect(() => {
    // Scroll to top when navigating to this page or when the URL parameters change
    window.scrollTo(0, 0);
    
    // Add console log to track page navigation
    console.log("Navigated to search page with params:", location.search);
    
    // Run Supabase client check on page load
    checkSupabaseClientStatus();
    
    // Commented out toast notification
    /*
    // Show search page toast except when navigating with forceHideBadge parameter 
    // (used by internal navigation)
    const params = new URLSearchParams(location.search);
    if (!params.get('forceHideBadge')) {
      toast({
        title: "Search Page",
        description: "Find players, teams, tournaments and sponsorships"
      });
    }
    */
  }, [location.search]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        {showDebugTools && (
          <div className="container mx-auto px-4 py-4">
            <Accordion type="single" collapsible>
              <AccordionItem value="debug">
                <AccordionTrigger className="text-sm text-gray-500">
                  Supabase Connection Diagnostics
                </AccordionTrigger>
                <AccordionContent>
                  <SupabaseDebugPanel />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}
        <SearchContainer />
      </main>
      <Footer />
    </div>
  );
};

export default SearchPage;
