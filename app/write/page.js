'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function WritePoem() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('Romance')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [isWriter, setIsWriter] = useState(false)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        router.push('/auth/login')
        return
      }
      setUser(session.user)

      // Check if user is a writer
      const { data } = await supabase
        .from('users')
        .select('is_writer')
        .eq('id', session.user.id)
        .single()

      if (!data?.is_writer) {
        toast.error('Please complete your profile to become a writer first!')
        router.push(`/profile/${session.user.id}`)
      } else {
        setIsWriter(true)
      }
    })
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title || !content) {
      toast.error('Please fill all fields')
      return
    }

    setLoading(true)

    const { error } = await supabase
      .from('poems')
      .insert({
        title,
        content,
        category,
        author_id: user.id,
        views: 0,
        likes_count: 0,
      })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Poem published successfully! 🎉')
      router.push('/')
    }

    setLoading(false)
  }

  if (!isWriter) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        Write a New Poem
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 mb-2 font-semibold">Poem Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Whispers of the Dawn"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2 font-semibold">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            <option value="Romance">💖 Romance</option>
            <option value="Nature">🌿 Nature</option>
            <option value="Sadness">😢 Sadness</option>
            <option value="Motivation">⚡ Motivation</option>
            <option value="Life">🌱 Life</option>
            <option value="Love">💕 Love</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-2 font-semibold">Your Poem</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your poem here..."
            rows={12}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 font-serif text-lg"
            required
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Publishing...' : 'Publish Poem ✨'}
          </button>
          
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}