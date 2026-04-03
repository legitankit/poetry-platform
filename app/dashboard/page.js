'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const [poems, setPoems] = useState([])
  const [favorites, setFavorites] = useState([])
  const [currentView, setCurrentView] = useState('dashboard')
  const [filterCategory, setFilterCategory] = useState('All')
  const [user, setUser] = useState(null)
  const [currentPoem, setCurrentPoem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPoems()
    loadFavorites()
    getUser()
  }, [])

  async function getUser() {
    const { data: { session } } = await supabase.auth.getSession()
    setUser(session?.user || null)
  }

  async function loadPoems() {
    setLoading(true)
    const { data, error } = await supabase
      .from('poems')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error loading poems:', error)
      toast.error('Failed to load poems')
    } else if (data && data.length > 0) {
      setPoems(data)
    }
    setLoading(false)
  }

  function loadFavorites() {
    const saved = localStorage.getItem('favorites')
    if (saved) setFavorites(JSON.parse(saved))
  }

  async function toggleFavorite(poemId) {
    let newFavorites = [...favorites]
    let updatedPoems = [...poems]
    let currentPoemData = poems.find(p => p.id === poemId)
    let newLikesCount
    
    if (newFavorites.includes(poemId)) {
      newFavorites = newFavorites.filter(id => id !== poemId)
      newLikesCount = Math.max(0, (currentPoemData.likes || 0) - 1)
      updatedPoems = updatedPoems.map(poem =>
        poem.id === poemId ? { ...poem, likes: newLikesCount } : poem
      )
      toast.success('Removed like')
    } else {
      newFavorites = [...newFavorites, poemId]
      newLikesCount = (currentPoemData.likes || 0) + 1
      updatedPoems = updatedPoems.map(poem =>
        poem.id === poemId ? { ...poem, likes: newLikesCount } : poem
      )
      toast.success('Liked! ❤️')
    }
    
    setPoems(updatedPoems)
    setFavorites(newFavorites)
    localStorage.setItem('favorites', JSON.stringify(newFavorites))
    
    const { error } = await supabase
      .from('poems')
      .update({ likes: newLikesCount })
      .eq('id', poemId)
    
    if (error) {
      console.error('Error updating likes:', error)
      toast.error('Failed to save like')
    }
  }

  async function openPoemModal(poem) {
    const newReadsCount = (poem.reads || 0) + 1
    
    const updatedPoems = poems.map(p =>
      p.id === poem.id ? { ...p, reads: newReadsCount } : p
    )
    setPoems(updatedPoems)
    setCurrentPoem({ ...poem, reads: newReadsCount })
    
    const { error } = await supabase
      .from('poems')
      .update({ reads: newReadsCount })
      .eq('id', poem.id)
    
    if (error) {
      console.error('Error updating reads:', error)
    }
    
    const modal = document.getElementById('poem-modal')
    if (modal) modal.style.display = 'flex'
  }

  function closePoemModal() {
    const modal = document.getElementById('poem-modal')
    if (modal) modal.style.display = 'none'
    setCurrentPoem(null)
  }

  function openCreateModal() {
    const modal = document.getElementById('create-modal')
    if (modal) modal.style.display = 'flex'
  }

  function closeCreateModal() {
    const modal = document.getElementById('create-modal')
    if (modal) modal.style.display = 'none'
    const titleInput = document.getElementById('modal-poem-title-input')
    const authorInput = document.getElementById('modal-poem-author-input')
    const contentInput = document.getElementById('modal-poem-content-input')
    if (titleInput) titleInput.value = ''
    if (authorInput) authorInput.value = ''
    if (contentInput) contentInput.value = ''
  }

  async function saveNewPoem() {
    const title = document.getElementById('modal-poem-title-input')?.value || ''
    const author = document.getElementById('modal-poem-author-input')?.value || ''
    const category = document.getElementById('modal-poem-category')?.value || 'Romance'
    const content = document.getElementById('modal-poem-content-input')?.value || ''

    if (!title || !author || !content) {
      alert('Please fill all fields!')
      return
    }

    const newPoem = {
      title,
      author,
      content,
      category: category.replace(/[^a-zA-Z]/g, ''),
      likes: 0,
      reads: 0,
      created_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('poems')
      .insert([newPoem])
      .select()
    
    if (error) {
      alert('Error saving poem!')
      console.error(error)
    } else if (data) {
      setPoems([data[0], ...poems])
      closeCreateModal()
      setCurrentView('poetry')
      toast.success('Poem published! 🎉')
    }
  }

  const topLikedPoems = [...poems]
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
    .slice(0, 7)

  const recentPoems = poems.slice(0, 4)
  const favoritePoems = poems.filter(p => favorites.includes(p.id))
  const filteredPoems = filterCategory === 'All' ? poems : poems.filter(p => p.category === filterCategory)
  const totalLikes = poems.reduce((sum, p) => sum + (p.likes || 0), 0)
  const totalReads = poems.reduce((sum, p) => sum + (p.reads || 0), 0)

  const categories = [
    'All', 'Romance', 'Love', 'Nature', 'Sadness', 'Motivation', 'Life',
    'Family', 'Spiritual', 'Funny', 'Reality', 'Dream', 'Lonely',
    'Struggle', 'Inspirational', 'Hope', 'Friendship', 'Peace', 'Nostalgia'
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading poetic realm...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">
          <i className="fas fa-feather-alt logo-icon"></i>
          <h2>Poet's Haven</h2>
        </div>
        <ul className="nav-menu">
          <li><button className={`nav-link ${currentView === 'dashboard' ? 'active' : ''}`} onClick={() => setCurrentView('dashboard')}><i className="fas fa-chart-line"></i><span>Dashboard</span></button></li>
          <li><button className={`nav-link ${currentView === 'poetry' ? 'active' : ''}`} onClick={() => setCurrentView('poetry')}><i className="fas fa-book-open"></i><span>Poetry Collection</span></button></li>
          <li><button className={`nav-link ${currentView === 'favorites' ? 'active' : ''}`} onClick={() => setCurrentView('favorites')}><i className="fas fa-heart"></i><span>Favorites</span></button></li>
          <li><button className={`nav-link ${currentView === 'write' ? 'active' : ''}`} onClick={() => setCurrentView('write')}><i className="fas fa-pen-fancy"></i><span>Write Poem</span></button></li>
          <li><button className={`nav-link ${currentView === 'about' ? 'active' : ''}`} onClick={() => setCurrentView('about')}><i className="fas fa-info-circle"></i><span>About</span></button></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <div className="header-title">
            <h1>Welcome back, {user?.email?.split('@')[0] || 'Poet'}</h1>
            <p>Express your soul through words</p>
          </div>
          <div className="user-info">
            <i className="fas fa-bell notification-icon"></i>
            <div className="avatar"><i className="fas fa-user"></i></div>
          </div>
        </div>

        {/* Dashboard View */}
        {currentView === 'dashboard' && (
          <>
            <div className="stats-grid">
              <div className="stat-card"><div className="stat-info"><h3>Total Poems</h3><div className="stat-number">{poems.length}</div></div><i className="fas fa-book stat-icon"></i></div>
              <div className="stat-card"><div className="stat-info"><h3>Total Reads</h3><div className="stat-number">{totalReads}</div></div><i className="fas fa-eye stat-icon"></i></div>
              <div className="stat-card"><div className="stat-info"><h3>Likes Received</h3><div className="stat-number">{totalLikes}</div></div><i className="fas fa-heart stat-icon"></i></div>
              <div className="stat-card"><div className="stat-info"><h3>Categories</h3><div className="stat-number">{categories.length - 1}</div></div><i className="fas fa-tags stat-icon"></i></div>
            </div>

            {topLikedPoems.length > 0 && (
              <>
                <div className="section-header"><h2>🏆 Most Liked Poems</h2></div>
                <div className="poetry-grid">
                  {topLikedPoems.map((poem, index) => (
                    <MostLikedPoemCard key={poem.id} poem={poem} rank={index + 1} isLiked={favorites.includes(poem.id)} onLike={() => toggleFavorite(poem.id)} onClick={() => openPoemModal(poem)} />
                  ))}
                </div>
              </>
            )}

            <div className="section-header" style={{ marginTop: '2rem' }}>
              <h2>Recent Poems</h2>
              <button className="btn-create" onClick={openCreateModal}><i className="fas fa-plus"></i> Write Poem</button>
            </div>
            <div className="poetry-grid">
              {recentPoems.map(poem => (
                <PoemCard key={poem.id} poem={poem} isLiked={favorites.includes(poem.id)} onLike={() => toggleFavorite(poem.id)} onClick={() => openPoemModal(poem)} />
              ))}
            </div>
          </>
        )}

        {/* Poetry Collection View */}
        {currentView === 'poetry' && (
          <>
            <div className="section-header"><h2>Poetry Collection</h2><button className="btn-create" onClick={openCreateModal}><i className="fas fa-plus"></i> Write Poem</button></div>
            <div className="categories">
              {categories.map(cat => <button key={cat} className={`category-tag ${filterCategory === cat ? 'active' : ''}`} onClick={() => setFilterCategory(cat)}>{cat}</button>)}
            </div>
            <div className="poetry-grid">
              {filteredPoems.map(poem => <PoemCard key={poem.id} poem={poem} isLiked={favorites.includes(poem.id)} onLike={() => toggleFavorite(poem.id)} onClick={() => openPoemModal(poem)} />)}
            </div>
          </>
        )}

        {/* Favorites View */}
        {currentView === 'favorites' && (
          <>
            <div className="section-header"><h2>Your Favorite Poems</h2></div>
            <div className="poetry-grid">
              {favoritePoems.map(poem => <PoemCard key={poem.id} poem={poem} isLiked={true} onLike={() => toggleFavorite(poem.id)} onClick={() => openPoemModal(poem)} />)}
            </div>
          </>
        )}

        {/* Write View */}
        {currentView === 'write' && (
          <>
            <div className="section-header"><h2>Write a New Poem</h2></div>
            <div style={{ background: 'white', borderRadius: '20px', padding: '2rem' }}>
              <input type="text" id="new-poem-title" placeholder="Poem Title" style={{ width: '100%', padding: '12px', marginBottom: '1rem', border: '2px solid #e2e8f0', borderRadius: '10px' }} />
              <input type="text" id="new-poem-author" placeholder="Your Name" style={{ width: '100%', padding: '12px', marginBottom: '1rem', border: '2px solid #e2e8f0', borderRadius: '10px' }} />
              <select id="new-poem-category" style={{ width: '100%', padding: '12px', marginBottom: '1rem', border: '2px solid #e2e8f0', borderRadius: '10px' }}>
                <option value="Romance">Romance</option><option value="Love">Love</option><option value="Nature">Nature</option><option value="Sadness">Sadness</option>
                <option value="Motivation">Motivation</option><option value="Life">Life</option><option value="Family">Family</option><option value="Spiritual">Spiritual</option>
                <option value="Funny">Funny</option><option value="Reality">Reality</option><option value="Dream">Dream</option><option value="Lonely">Lonely</option>
                <option value="Struggle">Struggle</option><option value="Inspirational">Inspirational</option><option value="Hope">Hope</option><option value="Friendship">Friendship</option>
                <option value="Peace">Peace</option><option value="Nostalgia">Nostalgia</option>
              </select>
              <textarea id="new-poem-content" placeholder="Write your poem here..." rows="10" style={{ width: '100%', padding: '12px', marginBottom: '1rem', border: '2px solid #e2e8f0', borderRadius: '10px', fontFamily: 'var(--font-playfair), serif' }}></textarea>
              <div className="modal-buttons" style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button className="btn-submit" onClick={saveNewPoem}>Publish Poem</button>
                <button className="btn-cancel" onClick={() => { document.getElementById('new-poem-title').value = ''; document.getElementById('new-poem-author').value = ''; document.getElementById('new-poem-content').value = ''; }}>Clear</button>
              </div>
            </div>
          </>
        )}

        {/* About View */}
        {currentView === 'about' && (
          <div className="about-card">
            <div className="about-icon"><i className="fas fa-feather-alt"></i></div>
            <h2>Poet's Haven</h2>
            <p>A sanctuary for poetic souls, a digital space where words dance and emotions flow freely.</p>
            <p>Share your poetic creations, discover inspiring works from fellow poets, and build a community that celebrates the beauty of expression through verses.</p>
            <div className="features-grid">
              <div className="feature-item"><i className="fas fa-pen-fancy"></i><span>Write & publish original poems</span></div>
              <div className="feature-item"><i className="fas fa-heart"></i><span>Like & favorite poems</span></div>
              <div className="feature-item"><i className="fas fa-search"></i><span>Discover by category</span></div>
              <div className="feature-item"><i className="fas fa-chart-line"></i><span>Track your poetry stats</span></div>
            </div>
          </div>
        )}
      </div>

      {/* Poem Modal */}
      <div id="poem-modal" className="modal" onClick={(e) => { if (e.target === e.currentTarget) closePoemModal() }}>
        <div className="modal-content">
          <span className="close-modal" onClick={closePoemModal}>&times;</span>
          {currentPoem && (
            <>
              <h2 style={{ fontFamily: 'var(--font-playfair), serif', fontWeight: 600, fontSize: '1.8rem' }}>{currentPoem.title}</h2>
              <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>By {currentPoem.author} • {currentPoem.category} • {new Date(currentPoem.created_at).toLocaleDateString()}</p>
              <div className="poem-full-content">{currentPoem.content}</div>
              <div className="modal-buttons" style={{ marginTop: '2rem' }}>
                <button onClick={() => toggleFavorite(currentPoem.id)} style={{ background: 'none', border: 'none', fontSize: '2rem', cursor: 'pointer' }}>
                  {favorites.includes(currentPoem.id) ? '❤️' : '🤍'}
                </button>
                <button className="btn-cancel" onClick={closePoemModal}>Close</button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Create Modal */}
      <div id="create-modal" className="modal" onClick={(e) => { if (e.target === e.currentTarget) closeCreateModal() }}>
        <div className="modal-content">
          <span className="close-modal" onClick={closeCreateModal}>&times;</span>
          <h2>Create New Poem</h2>
          <input type="text" id="modal-poem-title-input" placeholder="Poem Title" />
          <input type="text" id="modal-poem-author-input" placeholder="Your Name" />
          <select id="modal-poem-category">
            <option value="Romance">💖 Romance</option><option value="Love">💕 Love</option><option value="Nature">🌿 Nature</option>
            <option value="Sadness">😢 Sadness</option><option value="Motivation">⚡ Motivational</option><option value="Life">🌱 Life</option>
            <option value="Family">👨‍👩‍👧‍👦 Family</option><option value="Spiritual">🕊️ Spiritual</option><option value="Funny">😄 Funny</option>
            <option value="Reality">🎭 Reality</option><option value="Dream">🌙 Dream</option><option value="Lonely">🥀 Lonely</option>
            <option value="Struggle">💪 Struggle</option><option value="Inspirational">✨ Inspirational</option><option value="Hope">🕯️ Hope</option>
            <option value="Friendship">🤝 Friendship</option><option value="Peace">☮️ Peace</option><option value="Nostalgia">📜 Nostalgia</option>
          </select>
          <textarea id="modal-poem-content-input" placeholder="Write your poem here..." rows="8"></textarea>
          <div className="modal-buttons">
            <button className="btn-submit" onClick={saveNewPoem}>Publish</button>
            <button className="btn-cancel" onClick={closeCreateModal}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Poem Card Component
function PoemCard({ poem, isLiked, onLike, onClick }) {
  const excerpt = poem.content?.split('\n').slice(0, 3).join(' ') + (poem.content?.split('\n').length > 3 ? '...' : '')
  return (
    <div className="poem-card" onClick={onClick}>
      <div className="poem-header">
        <div className="poem-title">{poem.title}</div>
        <div className="poem-author">
          <i className="fas fa-user"></i> {poem.author}
        </div>
      </div>
      <div className="poem-body">
        <div className="poem-excerpt">{excerpt}</div>
        <div className="poem-meta">
          <div className="poem-stats">
            <button 
              onClick={(e) => { e.stopPropagation(); onLike() }} 
              className="like-button"
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '5px', padding: '0' }}
            >
              <i className={`${isLiked ? 'fas' : 'far'} fa-heart`} style={{ color: isLiked ? '#ef4444' : '#64748b' }}></i>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{poem.likes || 0}</span>
            </button>
            <span><i className="fas fa-eye"></i> {poem.reads || 0}</span>
            <span><i className="fas fa-tag"></i> {poem.category}</span>
          </div>
          <span className="read-more">Read More →</span>
        </div>
      </div>
    </div>
  )
}

// Most Liked Poem Card with Medal
function MostLikedPoemCard({ poem, rank, isLiked, onLike, onClick }) {
  const excerpt = poem.content?.split('\n').slice(0, 3).join(' ') + (poem.content?.split('\n').length > 3 ? '...' : '')
  const getMedal = (r) => r === 1 ? '🥇' : r === 2 ? '🥈' : r === 3 ? '🥉' : `${r}th`
  return (
    <div className="poem-card relative" onClick={onClick}>
      <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold z-10">
        <span className={rank === 1 ? 'text-yellow-500' : rank === 2 ? 'text-gray-400' : rank === 3 ? 'text-amber-600' : 'text-zinc-500'}>{getMedal(rank)}</span>
      </div>
      <div className="poem-header">
        <div className="poem-title">{poem.title}</div>
        <div className="poem-author">
          <i className="fas fa-user"></i> {poem.author}
        </div>
      </div>
      <div className="poem-body">
        <div className="poem-excerpt">{excerpt}</div>
        <div className="poem-meta">
          <div className="poem-stats">
            <button 
              onClick={(e) => { e.stopPropagation(); onLike() }} 
              className="like-button"
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '5px', padding: '0' }}
            >
              <i className={`${isLiked ? 'fas' : 'far'} fa-heart`} style={{ color: isLiked ? '#ef4444' : '#64748b' }}></i>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{poem.likes || 0}</span>
            </button>
            <span><i className="fas fa-eye"></i> {poem.reads || 0}</span>
            <span><i className="fas fa-tag"></i> {poem.category}</span>
          </div>
          <span className="read-more">Read More →</span>
        </div>
      </div>
    </div>
  )
}