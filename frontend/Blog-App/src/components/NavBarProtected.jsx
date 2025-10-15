import { useContext, useEffect, useState } from "react";
import { RxExit } from "react-icons/rx";
import { CiSearch } from "react-icons/ci";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { logoutUser } from "../api/BlogApi";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "./ContextAPI";

const NavBarProtected = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const data = useContext(AuthContext);

  useEffect(() => {
    async function fetchUserDetails() {
      const userDetails = await data.getUserDetail();
      setUser(userDetails || {});
    }
    fetchUserDetails();
  }, [data]);

  const handleLogout = () => {
    logoutUser();
    window.location.reload();
  };

  const handleProfileClick = () => {
    setShowProfile((prev) => !prev);
  };

  const handleGoToProfile = () => {
    setShowProfile(false);
    navigate("/profile");
  };

  // Get first letter for avatar, fallback to 'U'
  const avatarLetter =
    (user.name && user.name[0]) ||
    (user.username && user.username[0]) ||
    "U";

  return (
    <nav className="w-full border-b border-black-200 bg-white fixed top-0 z-50 flex justify-between items-center px-4 sm:px-6 lg:px-8 h-16">
      <div className="left flex items-center space-x-5">
        <a
          href="/"
          className="text-4xl font-bold text-black-gray hover:text-gray-800 font-serif"
        >
          Unique Blogs
        </a>
        <div className="search bg-[#f5f0f0] flex items-center space-x-2 px-5 py-3 rounded-full font-serif">
          <CiSearch className="text-2xl" />
          <input type="text" placeholder="Search" className="outline-none" />
        </div>
      </div>
      <div className="right flex items-center space-x-4 relative">
        <div className="write flex items-center gap-1.5 cursor-pointer">
          <NavLink
            to={"/create"}
            className="text-gray-700 hover:text-black text-sm font-medium flex items-center gap-1.5"
          >
            <HiOutlinePencilSquare className="text-2xl" />
            Write a blog
          </NavLink>
        </div>

        <div className="Profile flex items-center gap-1.5 cursor-pointer relative">
          <div
            onClick={handleProfileClick}
            className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold "
          >
            {avatarLetter.toUpperCase()}
          </div>
          <span
            onClick={handleProfileClick}
            className="text-sm font-medium transition"
          >
            {user.name || user.username || "User"}
          </span>
          {showProfile && (
            <div className="absolute right-0 top-10 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-5">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold mr-3">
                  {avatarLetter.toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-gray-700">
                    {user.name || "User"}
                    <div className="text-xs text-gray-500 mb-2">
                      @{user.username || "username"}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mb-4">
                    {user.email || ""}
                  </div>
                </div>
              </div>
              <button
                onClick={handleGoToProfile}
                className="w-full bg-indigo-600 text-white py-1.5 rounded hover:bg-indigo-700 transition mb-5"
              >
                View Profile
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 justify-center text-red-600 py-1.5 rounded hover:bg-red-50 transition"
              >
                <RxExit className="text-2xl" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBarProtected;
// filepath: d:\BlogApp-Fastapi\frontend\Blog-App\src\components\NavBarProtected.jsx
