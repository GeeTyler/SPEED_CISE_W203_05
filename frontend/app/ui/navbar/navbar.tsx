"use client"

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { GlowingDashboardDropdown } from './glowing-dashboard-dropdown';
import { Menu, ChevronDown } from 'lucide-react';
import "@/app/styles/link-animation.css"

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dashboardsOpen, setDashboardsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const dashboards = [
    { name: "User Dashboard", path: "/components/user-dashboard" },
    { name: "Moderator Dashboard", path: "/components/moderator-dashboard" },
    { name: "Analyst Dashboard", path: "/components/analyst-dashboard" },
    { name: "Admin Dashboard", path: "/components/admin-dashboard" }
  ];

  // Close the menu when clicking outside
  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setMenuOpen(false);
      setDashboardsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="border-b p-6 flex flex-row justify-between items-center relative">
      <div>
        <Link href="/" className="text-2xl font-bold">SPEED</Link>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex flex-row items-center justify-center gap-6">
        <Link href="/" className="hover-underline-animation">Home</Link>
        <Link href="/components/submit-article" className="whitespace-nowrap hover-underline-animation">Submit Article</Link>
        <Link href="/components/search-article" className="hover-underline-animation">Search Article</Link>
      </div>
      <div className="hidden md:block">
        <GlowingDashboardDropdown />
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden" ref={menuRef}>
        <button onClick={() => setMenuOpen(!menuOpen)} className="focus:outline-none">
          <Menu className="w-6 h-6" />
        </button>
        {menuOpen && (
          <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50">
            <Link href="/" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Home</Link>
            <Link href="/components/submit-article" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Submit Article</Link>
            <Link href="/components/search-article" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Search Article</Link>
            {/* Dashboards Submenu */}
            <div className="relative">
              <button
                onClick={() => setDashboardsOpen(!dashboardsOpen)}
                className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 flex justify-between items-center focus:outline-none"
              >
                <span>Dashboards</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${dashboardsOpen ? 'transform rotate-180' : ''}`} />
              </button>
              {dashboardsOpen && (
                <div className="ml-4 border-l border-gray-200">
                  {dashboards.map((dashboard) => (
                    <Link
                      key={dashboard.name}
                      href={dashboard.path}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      {dashboard.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
