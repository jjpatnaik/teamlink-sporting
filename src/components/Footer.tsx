
import React from 'react';
import { Link } from "react-router-dom";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Linkedin 
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-sport-dark text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-sport-purple to-sport-blue bg-clip-text text-transparent">
              Sportshive
            </h3>
            <p className="text-gray-300 mb-4">
              Connect with the global sports community. Build your profile, grow your network, and advance your sports career.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-sport-purple transition duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-sport-purple transition duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-sport-purple transition duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-sport-purple transition duration-300">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-sport-purple transition duration-300">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-300 hover:text-white transition duration-300">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition duration-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition duration-300">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">For Users</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/players" className="text-gray-300 hover:text-white transition duration-300">
                  Players
                </Link>
              </li>
              <li>
                <Link to="/teams" className="text-gray-300 hover:text-white transition duration-300">
                  Teams
                </Link>
              </li>
              <li>
                <Link to="/tournaments" className="text-gray-300 hover:text-white transition duration-300">
                  Tournaments
                </Link>
              </li>
              <li>
                <Link to="/sponsors" className="text-gray-300 hover:text-white transition duration-300">
                  Sponsors
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-gray-300 hover:text-white transition duration-300">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white transition duration-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white transition duration-300">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white transition duration-300">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8">
          <p className="text-center text-gray-400">
            &copy; {new Date().getFullYear()} Sportshive. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
