// // src/components/Navbar.jsx
// import React from 'react';
// import { Link } from 'react-router-dom';

// const Navbar = () => {
//   return (
//     <nav className=" bg-[#0A192F] text-white py-4 px-6 shadow-md">
//       <div className="container mx-auto flex justify-between items-center">
//         <Link to="/" className="text-xl font-bold">FinCapital</Link>
//         <div className="space-x-4">
//           <Link to="/login" className="hover:underline">Login</Link>
//           <Link to="/signup" className="hover:underline">Sign Up</Link>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="bg-[#0A192F] text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Brand Logo */}
        <Link to="/" className="text-xl font-bold">
          FinCapital
        </Link>

        {/* Links */}
        <div className="space-x-4">
          {user ? (
            <>
              <Link to="/dashboard" className="hover:underline">Dashboard</Link>
              <Link to="/learn" className="hover:underline">Learn</Link>
              <Link to="/mentor" className="hover:underline">Mentor</Link>
              <Link to="/planner" className="hover:underline">Planner</Link>
              <Link to="/trading" className="hover:underline">Trading</Link>
              <Link to="/esg" className="hover:underline">ESG</Link>
              <Link to="/community" className="hover:underline">Community</Link>
              <button 
                onClick={handleSignOut} 
                className="hover:underline ml-4"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/signup" className="hover:underline">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
