import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

interface NavbarProps {
  isDarkMode?: boolean;
}

function Navbar({ isDarkMode = false }: NavbarProps) {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `btn btn-ghost hover:bg-transparent ${ 
      isActive
          ? "text-teal-400 font-bold"
        : "text-white"
    }`;
  };

  return (
    <div
      className={`
        fixed top-4 left-1/2 -translate-x-1/2 z-30 shadow-lg transition-all duration-300
        rounded-2xl backdrop-blur-xl
        ${isScrolled ? "bg-black/40" : "bg-black/20"}
        ${isDarkMode ? "text-white" : "text-white"}
      `}
    >
      <div className="navbar px-4 py-2">
        <div className="navbar-start">
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li><NavLink to="/" className={() => navLinkClass("/")}>Introduction</NavLink></li>
            <li><NavLink to="/interesting-finds" className={() => navLinkClass("/interesting-finds")}>Interesting Finds</NavLink></li>
            <li><NavLink to="/analyze-data" className={() => navLinkClass("/analyze-data")}>Analyze Data</NavLink></li>
            <li><NavLink to="/explore-room" className={() => navLinkClass("/explore-room")}>Explore Room</NavLink></li>
          </ul>
        </div>

        <div className="navbar-end">
          <div className="flex items-center gap-4 pr-2"></div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;