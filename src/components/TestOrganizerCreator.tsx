
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { createTestUser } from "@/pages/signup/utils";
import { useNavigate } from "react-router-dom";

const TestOrganizerCreator = () => {
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();
  
  const handleCreateTestOrganizer = async () => {
    setIsCreating(true);
    try {
      const success = await createTestUser(true);
      if (success) {
        navigate('/login');
      }
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <div className="bg-amber-50 border border-amber-200 p-4 rounded-md mb-6">
      <h3 className="text-amber-800 font-medium mb-2">Create Tournament Organizer Account</h3>
      <p className="text-amber-700 text-sm mb-3">
        Create a test tournament organizer with email: jjpatnaik.12@gmail.com and password: Abcde@12345
      </p>
      <Button 
        onClick={handleCreateTestOrganizer}
        disabled={isCreating}
        variant="outline"
        className="bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200"
      >
        {isCreating ? "Creating Account..." : "Create Organizer Account"}
      </Button>
    </div>
  );
};

export default TestOrganizerCreator;
