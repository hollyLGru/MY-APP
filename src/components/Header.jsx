'use client'

import { useState } from 'react'

export default function Header() {
  const [search, setSearch] = useState('')

  return (
    <header className="w-full bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200">
      {/* Pastel rainbow accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-pink-200 via-amber-200 via-emerald-200 via-sky-200 to-violet-200" />

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="rounded-2xl px-4 py-1.5 text-lg font-bold text-gray-900 shadow-sm bg-gradient-to-br from-pink-200 via-emerald-200 to-sky-200">
            🏡
          </div>
          <span className="text-2xl font-semibold tracking-tight text-gray-900">
            Nestly
          </span>
        </div>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <div className="w-full rounded-full p-[1px] bg-gradient-to-r from-pink-200 via-amber-200 via-emerald-200 via-sky-200 to-violet-200">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by city, address, or ZIP"
              className="w-full rounded-full bg-white px-5 py-2 focus:outline-none focus:ring-2 focus:ring-pink-200 transition"
            />
          </div>
        </div>

        {/* Nav */}
        <div className="flex items-center gap-6">
          <button className="font-medium text-pink-300 hover:text-pink-400 hover:font-semibold transition-all duration-200">
            Buy
          </button>

          <button className="font-medium text-amber-300 hover:text-amber-400 hover:font-semibold transition-all duration-200">
            Rent
          </button>

          <button className="font-medium text-emerald-300 hover:text-emerald-400 hover:font-semibold transition-all duration-200">
            Sell
          </button>

          <button className=" rounded-full p-[1px] bg-gradient-to-r from-pink-200 via-amber-200 via-emerald-200 via-sky-200 to-violet-200 shadow-sm">
            <span className="block rounded-full bg-white px-5 py-2 text-gray-900 font-medium hover:bg-gray-50 transition">
              Sign In
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
