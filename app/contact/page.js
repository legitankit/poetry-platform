'use client'

import { useState } from 'react'
import { Toaster, toast } from 'react-hot-toast'

export default function ContactPage() {
  const [copied, setCopied] = useState(false)

  const copyEmail = () => {
    navigator.clipboard.writeText('chikupiku906@gmail.com')
    setCopied(true)
    toast.success('Email copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const socialLinks = [
    {
      name: 'Instagram',
      icon: 'fab fa-instagram',
      url: 'https://instagram.com/chikupiku',
      color: 'hover:bg-gradient-to-br from-purple-500 to-pink-500',
      username: '@chikupiku'
    },
    {
      name: 'Facebook',
      icon: 'fab fa-facebook-f',
      url: 'https://facebook.com/chikupiku',
      color: 'hover:bg-blue-600',
      username: 'chikupiku'
    },
    {
      name: 'GitHub',
      icon: 'fab fa-github',
      url: 'https://github.com/chikupiku',
      color: 'hover:bg-gray-800',
      username: 'chikupiku'
    },
    {
      name: 'LinkedIn',
      icon: 'fab fa-linkedin-in',
      url: 'https://linkedin.com/in/chikupiku',
      color: 'hover:bg-blue-700',
      username: 'chikupiku'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-12 px-4">
      <Toaster position="top-right" />
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6 shadow-xl">
            <i className="fas fa-envelope text-white text-3xl"></i>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Let's Connect
          </h1>
          <p className="text-purple-300/70 text-lg max-w-md mx-auto">
            Have a poem to share? Want to collaborate? I'd love to hear from you.
          </p>
        </div>

        {/* Email Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-purple-500/20 hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <i className="fas fa-envelope text-white text-xl"></i>
              </div>
              <div>
                <p className="text-purple-300 text-sm">Email Me</p>
                <p className="text-white font-medium text-lg">chikupiku906@gmail.com</p>
              </div>
            </div>
            <button
              onClick={copyEmail}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition flex items-center gap-2"
            >
              <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`}></i>
              {copied ? 'Copied!' : 'Copy Email'}
            </button>
          </div>
        </div>

        {/* Social Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all hover:scale-105 transform duration-300 ${social.color}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition">
                  <i className={`${social.icon} text-2xl text-purple-400`}></i>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg">{social.name}</h3>
                  <p className="text-purple-300 text-sm">{social.username}</p>
                </div>
                <i className="fas fa-arrow-right text-purple-400 group-hover:translate-x-1 transition"></i>
              </div>
            </a>
          ))}
        </div>

        {/* Quote */}
        <div className="text-center mt-12">
          <div className="inline-block bg-white/5 rounded-full px-6 py-3">
            <p className="text-purple-300/60 text-sm">
              <i className="fas fa-quote-left mr-2"></i>
              Every message is a new verse in our story
              <i className="fas fa-quote-right ml-2"></i>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}