
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type CoverPhotoProps = {
  backgroundUrl?: string | null;
};

const CoverPhoto: React.FC<CoverPhotoProps> = ({ backgroundUrl }) => {
  const navigate = useNavigate();
  
  const handleConnections = () => {
    navigate('/connections');
  };

  return (
    <div className="h-48 relative bg-gradient-to-r from-sport-purple to-sport-blue">
      {backgroundUrl && (
        <img 
          src={backgroundUrl} 
          alt="Cover"
          className="w-full h-full object-cover"
        />
      )}
      <div className="absolute top-4 right-4 flex space-x-2">
        <Button 
          variant="ghost" 
          className="bg-white/20 hover:bg-white/30 text-white"
          onClick={handleConnections}
        >
          <Link className="mr-2 h-4 w-4" />
          Connections
        </Button>
      </div>
    </div>
  );
};

export default CoverPhoto;
