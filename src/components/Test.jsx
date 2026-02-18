'use client'
import { useState } from 'react'

export default function Test() {
  const [term, setTerm] = useState('World')

  return (
    <div className="min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      hello {term}
      <div className="text-5xl font-bold text-pink-500">
        Testing until I remember how to fricking use app router 💅
      </div>
    </div>
  )
}
