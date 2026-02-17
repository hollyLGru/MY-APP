'use client'

import { useState } from 'react'

export default function Header() {
  const [search, setSearch] = useState('')

  return (
    <header className="w-full bg-white/80 backdrop-blur-md shadow-sm border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-emerald-300 to-emerald-500 text-white rounded-2xl px-4 py-1.5 text-lg font-bold shadow-sm">
            🏡
          </div>
          <span className="text-2xl font-semibold tracking-tight text-emerald-700">
            Nestly
          </span>
        </div>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by city, address, or ZIP"
            className="w-full rounded-full border border-emerald-200 bg-white px-5 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 transition"
          />
        </div>

        {/* Nav */}
        <div className="flex items-center gap-6">
          <button className="text-emerald-700 hover:text-emerald-500 transition font-medium">
            Buy
          </button>
          <button className="text-emerald-700 hover:text-emerald-500 transition font-medium">
            Rent
          </button>
          <button className="text-emerald-700 hover:text-emerald-500 transition font-medium">
            Sell
          </button>

          <button className="bg-emerald-500 text-white px-5 py-2 rounded-full hover:bg-emerald-600 transition shadow-sm">
            Sign In
          </button>
        </div>
      </div>
    </header>
  )
}
