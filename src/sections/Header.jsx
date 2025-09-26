import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import clsx from "clsx";
import useStore from "../store/store.js";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, clearUser } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    clearUser();
    navigate("/login");
    setMenuOpen(false);
  };

  const getInitials = (username, email) => {
    const name = username || email.split("@")[0];
    return name ? name.slice(0, 2).toUpperCase() : "U";
  };

  const navItems = user
    ? [
        { title: "Dashboard", to: "/dashboard" },
        { title: "Logout", onClick: handleLogout },
      ]
    : [{ title: "Login", to: "/login" }];

  return (
    <header
      className={clsx(
        "fixed w-full z-50 transition-all duration-300",
        scrolled ? "bg-black/80 backdrop-blur-md py-2" : "py-4"
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <svg
            width="160"
            height="55"
            viewBox="0 0 160 55"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Circle element for logo icon */}
            <circle cx="27" cy="27" r="20" fill="#0F3460" />
            <circle cx="27" cy="27" r="14" fill="#1A1A2E" />

            {/* Stylized "A" inside circle */}
            <path
              d="M20 34 L27 18 L34 34 H30 L27 27 L24 34 H20 Z"
              fill="#EAEDFF"
            />

            {/* Text "Aon AI" next to logo */}
            <text
              x="60"
              y="34"
              fontFamily="Helvetica, Arial, sans-serif"
              fontWeight="700"
              fontSize="28"
              fill="#EAEDFF"
            >
              Aon AI
            </text>
          </svg>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) =>
            item.to ? (
              <Link
                key={item.title}
                to={item.to}
                className="text-white font-semibold hover:text-blue-500"
              >
                {item.title}
              </Link>
            ) : (
              <button
                key={item.title}
                onClick={item.onClick}
                className="text-white font-semibold hover:text-blue-500"
              >
                {item.title}
              </button>
            )
          )}

          {/* User Avatar */}
          {user && (
            <div className="ml-4 flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold">
                {getInitials(user.username, user.email)}
              </div>
              <span className="text-white font-medium">
                {user.credits} Credits
              </span>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 rounded-md border border-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <img
            src={`/images/${menuOpen ? "close" : "magic"}.svg`}
            alt="menu"
            className="w-6 h-6"
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={clsx(
          "lg:hidden bg-black/90 backdrop-blur-md w-full fixed top-0 left-0 h-screen flex flex-col items-center justify-center gap-8 transition-transform duration-300",
          menuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {navItems.map((item) =>
          item.to ? (
            <Link
              key={item.title}
              to={item.to}
              className="text-white text-2xl font-semibold"
              onClick={() => setMenuOpen(false)}
            >
              {item.title}
            </Link>
          ) : (
            <button
              key={item.title}
              onClick={item.onClick}
              className="text-white text-2xl font-semibold"
            >
              {item.title}
            </button>
          )
        )}

        {user && (
          <div className="flex flex-col items-center gap-2 mt-6">
            <div className="w-16 h-16 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold text-xl">
              {getInitials(user.username, user.email)}
            </div>
            <span className="text-white font-medium text-lg">
              {user.credits} Credits
            </span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
