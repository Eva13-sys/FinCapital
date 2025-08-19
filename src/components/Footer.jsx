
// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#0A192F] text-white text-center py-4 mt-12">
      <p>&copy; {new Date().getFullYear()} FinCapital. All rights reserved.</p>
    </footer>
  );
};

export default Footer;

