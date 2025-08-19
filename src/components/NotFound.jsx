
// src/components/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center p-4">
      <h1 className="text-6xl font-bold text-[#FF6B6B] mb-4">404</h1>
      <p className="text-lg text-gray-700 mb-6">Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" className="text-[#0077FF] font-semibold hover:underline">Go back home</Link>
    </div>
  );
};

export default NotFound;