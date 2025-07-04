import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { assets } from "../assets/assets";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../redux/auth/userSlice";
import { resetCart } from "../redux/cartSlice";
import { setShowSearch } from "../redux/uiSlice";
import projectLogo from "../assets/projectLogo.png";

const Navbar = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.user);
  const userInitials = user?.name?.slice(0, 2).toUpperCase();

  const cartCount = useSelector((state) => {
    const items = state.cart.items;
    let total = 0;
    for (const itemId in items) {
      const sizes = items[itemId];
      for (const size in sizes) {
        total += sizes[size];
      }
    }
    return total;
  });

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(resetCart());
    navigate("/login");
    setShowDropdown(false); // Close dropdown after logout
  };

  const handleSearch = () => {
    dispatch(setShowSearch(true));
    navigate("/collection");
  };

  return (
    // Main container: responsive padding, fixed background, z-index for layering
<div className="w-full px-4 sm:px-6 lg:px-20 py-4 flex justify-between items-center bg-white border-b z-50 relative">
  {/* Logo */}
  <Link to="/" className="shrink-0">
    <img src={projectLogo} alt="Logo" className="w-36 sm:w-36 md:w-44" />
  </Link>

  {/* Desktop Nav Links */}
  <ul className="hidden md:flex gap-4 lg:gap-6 text-sm lg:text-base font-medium text-gray-700">
    {["HOME", "COLLECTION", "ABOUT", "CONTACT"].map((text, i) => (
      <NavLink
        key={text}
        to={["/", "/collection", "/about", "/contact"][i]}
        className={({ isActive }) =>
          `hover:text-black transition-colors duration-200 ${
            isActive ? "font-semibold text-black" : ""
          }`
        }
      >
        {text}
      </NavLink>
    ))}

    {/* 🔧 Admin Button – show only when NOT logged in */}
    {!token && (
      <a
        href="https://shopsmart-ai-admin.onrender.com"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-black transition-colors duration-200"
      >
        ADMIN
      </a>
    )}
  </ul>

  {/* Right-side icons */}
  <div className="flex items-center gap-3 sm:gap-5 md:gap-6">
    {/* Search Icon */}
    <img
      src={assets.search_icon}
      alt="Search"
      className="w-4 sm:w-5 cursor-pointer"
      onClick={handleSearch}
    />

    {/* Profile */}
    <div className="relative">
      {token ? (
        <div
          className="w-6 h-6  sm:w-8 sm:h-8 bg-gray-800 text-white text-sm rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-700"
          onClick={() => setShowDropdown((prev) => !prev)}
        >
          {userInitials}
        </div>
      ) : (
        <img
          src={assets.profile_icon}
          alt="Profile"
          className="w-6 sm:w-5 cursor-pointer hover:opacity-80"
          onClick={() => navigate("/login")}
        />
      )}

      {/* Dropdown */}
      {token && showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-100 p-3 rounded-md shadow-lg text-sm text-gray-600 z-50">
          <p className="cursor-pointer hover:text-black py-1">My Profile</p>
          <p
            className="cursor-pointer hover:text-black py-1"
            onClick={() => {
              setShowDropdown(false);
              navigate("/orders");
            }}
          >
            Orders
          </p>
          <p
            className="cursor-pointer hover:text-black py-1"
            onClick={handleLogout}
          >
            Logout
          </p>
        </div>
      )}
    </div>

    {/* Cart */}
    <Link to="/cart" className="relative">
      <img src={assets.cart_icon} alt="Cart" className="w-4 h-4 sm:w-5 sm:h-5" />
      {cartCount > 0 && (
        <span className="absolute -right-2.5 -top-1.5 w-4 h-4 sm:-right-2 sm:-bottom-2 sm:w-5 sm:h-5 bg-black text-white text-[10px] flex items-center justify-center rounded-full">
          {cartCount}
        </span>
      )}
    </Link>

    {/* Mobile Burger Menu */}
    <img
      src={assets.menu_icon}
      alt="Menu"
      className="w-6 md:hidden cursor-pointer hover:opacity-80"
      onClick={() => setMenuVisible(true)}
    />
  </div>

  {/* 🔧 Mobile Sidebar */}
  <div
    className={`fixed top-0 right-0 h-full w-64 bg-white z-[100] transform transition-transform duration-300 ease-in-out ${
      menuVisible ? "translate-x-0" : "translate-x-full"
    } shadow-lg flex flex-col`}
  >
    <div
      onClick={() => setMenuVisible(false)}
      className="flex items-center gap-2 px-6 py-4 cursor-pointer border-b text-gray-700 hover:bg-gray-50"
    >
      <img src={assets.dropdown_icon} alt="Close" className="h-5 rotate-180" />
      <p className="font-medium">Back</p>
    </div>

    {/* Nav Links */}
    {["HOME", "COLLECTION", "ABOUT", "CONTACT"].map((text, i) => (
      <NavLink
        key={text}
        to={["/", "/collection", "/about", "/contact"][i]}
        className="px-6 py-4 border-b text-gray-700 hover:bg-gray-50 text-base"
        onClick={() => setMenuVisible(false)}
      >
        {text}
      </NavLink>
    ))}

    {/* 🔧 Admin link only if NOT logged in */}
    {!token && (
      <a
        href="https://shopsmart-ai-admin.onrender.com"
        target="_blank"
        rel="noopener noreferrer"
        className="px-6 py-4 border-b text-gray-700 hover:bg-gray-50 text-base"
        onClick={() => setMenuVisible(false)}
      >
        ADMIN
      </a>
    )}

    {/* 🔧 Profile Options (Mobile) */}
    {token && (
      <div className="px-6 py-4 flex flex-col gap-3 text-base border-t mt-auto">
        <p
          className="cursor-pointer hover:text-black"
          onClick={() => {
            setMenuVisible(false);
            navigate("/orders");
          }}
        >
          Orders
        </p>
        <p
          className="cursor-pointer hover:text-black"
          onClick={handleLogout}
        >
          Logout
        </p>
      </div>
    )}
  </div>
</div>

  );
};

export default Navbar;
