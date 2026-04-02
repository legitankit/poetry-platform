'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signout()
    toast.success('Logged out successfully')
    router.push('/')
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">📖</span>
              <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Poet's Haven
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-700 hover:text-purple-600 transition">
              Home
            </Link>
            
            {/* Contact Link - Added Here */}
            <Link href="/contact" className="text-gray-700 hover:text-purple-600 transition">
              <i className="fas fa-envelope mr-1"></i>
              Contact
            </Link>
            
            {user ? (
              <>
                <Link href="/write" className="text-gray-700 hover:text-purple-600 transition">
                  ✍️ Write
                </Link>
                <Link href={`/profile/${user.id}`} className="text-gray-700 hover:text-purple-600 transition">
                  👤 Profile
                </Link>
                <button onClick={handleLogout} className="text-red-600 hover:text-red-700 transition">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-gray-700 hover:text-purple-600 transition">
                  Login
                </Link>
                <Link href="/auth/signup" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}