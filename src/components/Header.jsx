'use client'
import headerImage from '@/data/images/headerImage.jpg'
import { useState } from 'react'

export default function Header() {
  const [search, setSearch] = useState('')

  return (
    <header className="relative w-full h-130 text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${headerImage.src})` }}
      />

      <div className="absolute inset-0 bg-black/30" />
      {/* Navigation */}
      <div className="relative z-10 flex items-center justify-between px-8 py-6">
        <div className="text-2xl font-semibold tracking-tight">
          🐎 HorseApp Logo???
        </div>

        {/* Nav links */}
        <div className="flex items-center gap-8 text-sm font-medium">
          <button className="hover:opacity-80">Explore</button>
          <button className="hover:opacity-80">Saved</button>
          <button className="hover:opacity-80">Log in</button>
        </div>
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <h1 className="text-5xl md:text-6xl font-semibold mb-8">
          Find your ride
        </h1>

        {/* Search */}
        <div className="w-full max-w-2xl">
          <div className="rounded-full bg-white shadow-2xl ring-1 ring-black/10">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by city, zip, or key words"
              className="w-full rounded-full bg-white px-6 py-4 text-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-white/40"
            />
          </div>
        </div>

        <button className="mt-6 text-sm underline opacity-90 hover:opacity-100">
          Explore nearby
        </button>
      </div>
    </header>
  )
}
