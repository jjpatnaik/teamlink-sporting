
import React from 'react';
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center">
      <span className="text-2xl font-bold bg-gradient-to-r from-sport-purple to-sport-blue bg-clip-text text-transparent">
        Sportshive
      </span>
    </Link>
  );
};

export default Logo;
