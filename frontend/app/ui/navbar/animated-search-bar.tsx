"use client"

import { useState } from 'react'
import { Search } from 'lucide-react'

export function AnimatedSearchBar() {
  const [searchValue, setSearchValue] = useState('')

  return (
    <div className="flex justify-center items-center bg-gray-900">
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg blur opacity-75 animate-glow"></div>
        <div className="relative bg-black rounded-lg overflow-hidden">
          <div className="flex">
            <input
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full bg-black text-white placeholder-white placeholder-opacity-50 py-3 px-4 focus:outline-none"
              style={{
                backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.5), rgba(255,255,255,0))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            />
            <button
              className="bg-gray-800 text-white px-4 py-2 hover:bg-gray-700 transition-colors duration-200"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}