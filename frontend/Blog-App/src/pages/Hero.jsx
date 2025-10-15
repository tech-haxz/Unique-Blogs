import HeroImg from "../assets/Hero-img.webp";
import { useState, useEffect } from "react";
import Login from "./Login.jsx";
import { Home } from "./ProtectedPages/Home.jsx";
import { useAuthCheck } from "../hooks/useAuthCheck.js";

function Hero() {
  const isAuthenticated = useAuthCheck();
  const [showLogin, setShowLogin] = useState(false);

  if (isAuthenticated === null) return <div>Loading...</div>;
  if (isAuthenticated === true) return <Home />;

  
  return (
      <div className="bg-[#ededee] h-[75vh] flex items-center justify-center gap-40">
        <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 text-center font-serif flex flex-col gap-5">
          <h1 className="text-9xl  text-black-gray mb-4">
            Welcome to Unique Blogs
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Discover, read, and share amazing blogs from around the world.
          </p>
          <a
            onClick={() => setShowLogin(true)}
            className="bg-black text-white  py-4 rounded-full text-2xl font-medium hover:bg-gray-800 transition"
          >
            Start Reading/Writing
          </a>
        </div>

        <div className="w-1/2">
          <img src={HeroImg} alt="Hero Image" />
        </div>

        <Login open={showLogin} onClose={() => setShowLogin(false)} />
      </div>
  );
}

export default Hero;
