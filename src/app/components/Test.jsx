'use client'
import { useState, useEffect, useRef, useMemo } from 'react'
import { listings } from '../data/listings'

export default function Test() {
  const [term, setTerm] = useState('World')
  console.log(listings)
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      hello {term}
    </div>
  )
}
