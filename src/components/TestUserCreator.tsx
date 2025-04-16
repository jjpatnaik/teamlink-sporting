
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { createTestUser } from "@/pages/signup/utils";

const TestUserCreator = () => {
  const [isCreating, setIsCreating] = useState(false);
  
  const handleCreateTestUser = async () => {
    setIsCreating(true);
    try {
      await createTestUser();
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <div className="bg-amber-50 border border-amber-200 p-4 rounded-md mb-6">
      <h3 className="text-amber-800 font-medium mb-2">Developer Testing Tool</h3>
      <p className="text-amber-700 text-sm mb-3">
        Create a test player profile with email: jjpatnaik.12@gmail.com and password: testprofile
      </p>
      <Button 
        onClick={handleCreateTestUser}
        disabled={isCreating}
        variant="outline"
        className="bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200"
      >
        {isCreating ? "Creating Test User..." : "Create Test Profile"}
      </Button>
    </div>
  );
};

export default TestUserCreator;
