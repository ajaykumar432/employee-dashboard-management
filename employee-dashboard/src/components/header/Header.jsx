
import React, { useState, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Attendance", path: "/attendance" },
  { name: "Notifications", path: "/notifications" },
  { name: "Reports", path: "/reports" },
];

const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Handle logout action
  const handleLogout = useCallback(() => {
    localStorage.removeItem("auth");
    navigate("/");
  }, [navigate]);

  // Tailwind classes for active and inactive links
  const linkClass = ({ isActive }) =>
    isActive
      ? "text-blue-600 font-semibold border-b-2 border-blue-600"
      : "text-gray-600 hover:text-blue-600";

  // Render navigation links
  const renderNavLinks = (closeMenu = false) =>
    NAV_ITEMS.map((item) => (
      <NavLink
        key={item.path}
        to={item.path}
        className={linkClass}
        onClick={() => closeMenu && setMenuOpen(false)}
      >
        {item.name}
      </NavLink>
    ));

  return (
    <header className="bg-white sticky top-0 z-50">
      {/* Container */}
      <div className="max-w-auto mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        {/* <h1 className="text-lg -4 w-4 font-semibold text-gray-800">Org Logo</h1> */}
        {/* Logo */}
<div className="flex items-center gap-2">
  <svg
    className="w-8 h-8 text-indigo-600"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 3L3 9l9 6 9-6-9-6z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 9v6l9 6 9-6V9"
    />
  </svg>

</div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {renderNavLinks()}
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-1.5 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="md:hidden text-gray-700 focus:outline-none text-2xl"
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t">
          <nav className="flex flex-col gap-4 px-6 py-4">
            {renderNavLinks(true)}
            <button
              onClick={handleLogout}
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
