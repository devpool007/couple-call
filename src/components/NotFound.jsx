import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-xl text-gray-400 mb-8">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link 
          to="/"
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;