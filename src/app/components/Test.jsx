'use client'
import { useState, useEffect, useRef, useMemo } from 'react'
import { listings } from '../data/listings'

export default function Test() {
  const [term, setTerm] = useState('World')
  return (
    <div className="min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      hello {term}
      <div className="text-5xl font-bold text-pink-500">
        Tailwind is alive 💅
      </div>
      <img className="w-auto" src={listings[0].images[0]} alt="Workflow logo" />
    </div>
  )
}
