'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function PoemCard({ poem, featured = false }) {
  const [user, setUser] = useState(null)
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(poem.likes_count)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null)
      if (session?.user) {
        checkIfLiked()
      }
    })
  }, [])

  async function checkIfLiked() {
    const { data } = await supabase
      .from('poem_likes')
      .select('id')
      .eq('poem_id', poem.id)
      .eq('user_id', user?.id)
      .single()

    setIsLiked(!!data)
  }

  async function handleLike(e) {
    e.preventDefault()
    if (!user) {
      alert('Please login to like poems')
      return
    }

    if (isLiked) {
      await supabase.from('poem_likes').delete().eq('poem_id', poem.id).eq('user_id', user.id)
      setLikesCount(likesCount - 1)
      setIsLiked(false)
      
      await supabase.from('poems').update({ likes_count: likesCount - 1 }).eq('id', poem.id)
    } else {
      await supabase.from('poem_likes').insert({ poem_id: poem.id, user_id: user.id })
      setLikesCount(likesCount + 1)
      setIsLiked(true)
      
      await supabase.from('poems').update({ likes_count: likesCount + 1 }).eq('id', poem.id)
    }
  }

  const excerpt = poem.content.split('\n').slice(0, 3).join(' ') + '...'

  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 ${featured ? 'ring-2 ring-purple-500' : ''}`}>
      {featured && (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-1 text-sm">
          ⭐ Poem of the Day
        </div>
      )}
      
      <div className="p-6">
        <Link href={`/poem/${poem.id}`}>
          <h3 className="text-xl font-bold text-gray-800 mb-2 hover:text-purple-600 transition">
            {poem.title}
          </h3>
        </Link>
        
        <Link href={`/profile/${poem.author_id}`}>
          <p className="text-sm text-gray-500 mb-3 hover:text-purple-600 transition">
            By {poem.author?.full_name || poem.author?.username || 'Anonymous'}
          </p>
        </Link>
        
        <p className="text-gray-600 mb-4 line-clamp-3">{excerpt}</p>
        
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <button onClick={handleLike} className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition">
              <span>{isLiked ? '❤️' : '🤍'}</span>
              <span>{likesCount}</span>
            </button>
            <div className="flex items-center space-x-1 text-gray-500">
              <span>👁️</span>
              <span>{poem.views || 0}</span>
            </div>
            <div className="text-gray-500 text-sm">
              {poem.category}
            </div>
          </div>
          
          <Link href={`/poem/${poem.id}`}>
            <span className="text-purple-600 hover:text-purple-700 text-sm font-semibold">
              Read More →
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}