
import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import PlayerSignupForm from "./PlayerSignupForm";
import { userTypes } from "../signup/constants";

const CreateProfilePage = () => {
  const [userType, setUserType] = useState<string>("player");
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-sport-light-purple/10">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-sport-blue to-sport-purple bg-clip-text text-transparent">Create Your Profile</h1>
            <p className="text-sport-gray text-lg">Showcase your talents and connect with the community</p>
          </div>

          {/* User Type Selection */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-sport-light-purple/20 mb-8">
            <div>
              <label htmlFor="userType" className="block text-sm font-medium mb-2 text-sport-dark-gray">
                I want to create a profile as:
              </label>
              <Select value={userType} onValueChange={setUserType}>
                <SelectTrigger className="border-sport-light-purple/50 focus-visible:ring-sport-purple/40">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  {userTypes.map((type) => (
                    <SelectItem 
                      key={type.value} 
                      value={type.value}
                      disabled={type.disabled}
                    >
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {userType === "player" ? (
            <PlayerSignupForm isLoading={isLoading} setIsLoading={setIsLoading} />
          ) : (
            <div className="py-16 text-center bg-white rounded-lg shadow-sm border border-sport-light-purple/20">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 rounded-full bg-sport-light-purple/30 flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl text-sport-purple">
                    {userType === "team" ? "🏆" : 
                     userType === "organizer" ? "🏅" : "🤝"}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-sport-dark-gray mb-3">
                  {userType === "team" ? "Club/Team" : 
                   userType === "organizer" ? "Tournament Organiser" : "Sponsor"} registration
                </h3>
                <p className="text-sport-gray mb-6">
                  We're currently working on making this feature available. 
                  Please check back soon for updates.
                </p>
                <button 
                  className="px-6 py-2 bg-gray-100 rounded-md text-sport-gray font-medium hover:bg-gray-200 transition-colors"
                  onClick={() => setUserType("player")}
                >
                  Back to Player Registration
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateProfilePage;
