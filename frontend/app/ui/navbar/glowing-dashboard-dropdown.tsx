"use client"

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'

export function GlowingDashboardDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const dashboards = [
    { name: "User Dashboard", path: "/components/user-dashboard" },
    { name: "Moderator Dashboard", path: "/components/moderator-dashboard" },
    { name: "Analyst Dashboard", path: "/components/analyst-dashboard" },
    { name: "Admin Dashboard", path: "/components/admin-dashboard" }
  ]

  return (
    <div className="flex justify-center items-center bg-gray-900">
      <div className="relative w-64" ref={dropdownRef}>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg blur opacity-75 animate-glow"></div>
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="w-full flex items-center justify-between bg-black text-white py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-haspopup="true"
            aria-expanded={isOpen}
          >
            <span>Dashboards</span>
            <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
          </button>
          {isOpen && (
            <div className="absolute w-full mt-2 bg-black border border-gray-700 rounded-lg shadow-lg z-10">
              {dashboards.map((dashboard) => (
                <Link
                  key={dashboard.name}
                  href={dashboard.path}
                  className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700"
                >
                  {dashboard.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        @keyframes glow {
          0% {
            opacity: 0.5;
            transform: translate(-50%, -50%) scale(0.9);
          }
          50% {
            opacity: 0.75;
            transform: translate(-50%, -50%) scale(1.1);
          }
          100% {
            opacity: 0.5;
            transform: translate(-50%, -50%) scale(0.9);
          }
        }

        .animate-glow::before,
        .animate-glow::after {
          content: '';
          position: absolute;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          animation: glow 4s ease-in-out infinite alternate;
        }

        .animate-glow::before {
          background: rgba(138, 43, 226, 0.5); /* Purple */
          top: 0;
          right: 0;
          transform: translate(50%, -50%);
        }

        .animate-glow::after {
          background: rgba(0, 0, 255, 0.5); /* Blue */
          bottom: 0;
          right: 0;
          transform: translate(50%, 50%);
          animation-delay: 2s;
        }
      `}</style>
    </div>
  )
}