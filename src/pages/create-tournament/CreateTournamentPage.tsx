
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Header from '@/components/Header';
import TournamentForm from './components/TournamentForm';

const CreateTournamentPage = () => {
  const [userLoggedIn, setUserLoggedIn] = useState<boolean | null>(null);
  const navigate = useNavigate();
  
  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getSession();
      setUserLoggedIn(!!data.session);
      
      if (!data.session) {
        toast.error('You must be logged in to create a tournament');
        navigate('/login');
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  // Show loading state while checking auth
  if (userLoggedIn === null) {
    return <div>Loading...</div>;
  }
  
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Create Tournament</h1>
          <TournamentForm />
        </div>
      </main>
    </>
  );
};

export default CreateTournamentPage;
