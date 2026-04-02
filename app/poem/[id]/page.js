'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function PoemPage() {
  const { id } = useParams()
  const [poem, setPoem] = useState(null)
  const [user, setUser] = useState(null)
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPoem()
    trackView()
  }, [id])

  async function trackView() {
    // Real unique view counting
    const { data: { session } } = await supabase.auth.getSession()
    const sessionId = localStorage.getItem('session_id') || Math.random().toString(36)
    localStorage.setItem('session_id', sessionId)

    await fetch('/api/poems/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        poemId: parseInt(id),
        userId: session?.user?.id,
        sessionId: sessionId
      })
    })
  }

  async function fetchPoem() {
    const { data } = await supabase
      .from('poems')
      .select(`
        *,
        author:author_id (id, username, full_name, bio, avatar_url, is_writer)
      `)
      .eq('id', id)
      .single()

    if (data) {
      setPoem(data)
      setLikesCount(data.likes_count)
      
      // Check if user liked
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setUser(session.user)
        const { data: likeData } = await supabase
          .from('poem_likes')
          .select('id')
          .eq('poem_id', data.id)
          .eq('user_id', session.user.id)
          .single()
        setIsLiked(!!likeData)
      }
    }
    setLoading(false)
  }

  async function handleLike() {
    if (!user) {
      toast.error('Please login to like poems')
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

  if (loading) return <div className="text-center py-12">Loading...</div>
  if (!poem) return <div className="text-center py-12">Poem not found</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6">
          <h1 className="text-4xl font-bold text-white mb-2">{poem.title}</h1>
          <Link href={`/profile/${poem.author_id}`}>
            <p className="text-white/80 hover:text-white transition">
              By {poem.author?.full_name || poem.author?.username}
            </p>
          </Link>
        </div>

        <div className="p-8">
          <div className="flex justify-between items-center mb-6 pb-4 border-b">
            <div className="flex space-x-6">
              <div className="flex items-center space-x-2">
                <span className="text-xl">❤️</span>
                <button onClick={handleLike} className="font-semibold hover:text-red-500 transition">
                  {likesCount} {isLiked ? '(Liked)' : ''}
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xl">👁️</span>
                <span className="font-semibold">{poem.views || 0} reads</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xl">🏷️</span>
                <span className="text-purple-600 font-semibold">{poem.category}</span>
              </div>
            </div>
            <div className="text-gray-500 text-sm">
              {new Date(poem.created_at).toLocaleDateString()}
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            {poem.content.split('\n').map((line, i) => (
              <p key={i} className="mb-4 text-gray-700 leading-relaxed font-serif text-lg">
                {line}
              </p>
            ))}
          </div>
        </div>
      </article>
    </div>
  )
}