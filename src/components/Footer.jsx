import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const handleClick = (path) => (e) => {
    e.preventDefault();
    window.open(path, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="bg-gray-800 py-4 px-6 absolute bottom-0 w-full">
      <div className="max-w-7xl mx-auto flex justify-center items-center gap-6 text-sm">
        <Link 
          to="/how-to-use" 
          onClick={handleClick('/how-to-use')}
          className="text-gray-300 hover:text-white transition-colors"
        >
          How to Use
        </Link>
        <Link 
          to="/privacy-policy" 
          onClick={handleClick('/privacy-policy')}
          className="text-gray-300 hover:text-white transition-colors"
        >
          Privacy Policy
        </Link>
        <Link 
          to="/feedback" 
          onClick={handleClick('/feedback')}
          className="text-gray-300 hover:text-white transition-colors"
        >
          Feedback
        </Link>
      </div>
    </footer>
  );
}

export default Footer;