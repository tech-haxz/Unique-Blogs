import Login from "../pages/Login";
import { useState } from "react";
import Register from "../pages/Register";
import NavBarProtected from "./NavBarProtected";
import {useAuthCheck}  from "../hooks/useAuthCheck.js";

const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const isAuthenticated = useAuthCheck();


  if (isAuthenticated === true) {
    return <NavBarProtected />
  }

  return (
    <nav className="w-full border-b border-black-200 bg-[#ededee] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-21 items-center">
          {/* Left: Logo */}
          <div className="flex-shrink-0 flex items-center">
            <a
              href="/"
              className="text-4xl font-bold text-black-gray hover:text-gray-800 font-serif"
            >
              Unique Blogs
            </a>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-4">
            <a
              onClick={() => setShowRegister(true)}
              className="text-gray-700 hover:text-black text-sm font-medium"
            >
              Write a blog
            </a>
            <a
              onClick={() => setShowLogin(true)}
              className="text-gray-700 hover:text-black text-sm font-medium cursor-pointer"
            >
              Sign in
            </a>
            <a
              onClick={() => setShowRegister(true)}
              className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition"
            >
              Get started
            </a>
          </div>
        </div>
      </div>
      <Login open={showLogin} onClose={() => setShowLogin(false)} />
      <Register open={showRegister} onClose={() => setShowRegister(false)} />
    </nav>
  );
};

export default Navbar;
