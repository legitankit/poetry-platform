'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function LandingPage() {
  const router = useRouter()
  const mainRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const ctx = gsap.context(() => {
      // Floating Lines Animation
      gsap.to(".floating-line", {
        y: -20,
        opacity: 0.6,
        duration: 2,
        stagger: { each: 0.5, repeat: -1, yoyo: true },
        ease: "power1.inOut"
      })

      // SECTION 2: Text Reveal
      gsap.fromTo(".section-two h2", 
        { x: -100, opacity: 0 },
        {
          x: 0, opacity: 1,
          scrollTrigger: {
            trigger: ".section-two",
            start: "top 80%",
            end: "top 30%",
            scrub: 1,
          }
        }
      )

      // SECTION 3: Footer Content Reveal
      gsap.fromTo(".footer-content",
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          stagger: 0.2,
          scrollTrigger: {
            trigger: "footer",
            start: "top 85%",
            end: "top 40%",
            scrub: 1,
          }
        }
      )
    }, mainRef)

    return () => {
      if (ctx) ctx.revert()
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  const navigateToDashboard = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => router.push('/dashboard'), 500)
      }
    })
    tl.to(".hero-content", { scale: 1.5, opacity: 0, duration: 0.6, ease: "power2.in" })
      .to(".floating-line", { opacity: 0, duration: 0.4, stagger: 0.05 }, "-=0.3")
      .to("section", { opacity: 0, duration: 0.5 }, "-=0.2")
  }

  return (
    <div ref={mainRef} className="bg-zinc-950 text-zinc-100 selection:bg-rose-500/30 min-h-screen">
      
      {/* SECTION 1: HERO */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="floating-line absolute top-1/4 left-10 h-[1px] w-48 bg-gradient-to-r from-transparent via-rose-500 to-transparent rotate-12" />
          <div className="floating-line absolute top-1/3 right-20 h-[1px] w-64 bg-gradient-to-r from-transparent via-zinc-500 to-transparent -rotate-12" />
          <div className="floating-line absolute bottom-1/4 left-1/4 h-[1px] w-32 bg-gradient-to-r from-transparent via-rose-400 to-transparent rotate-45" />
        </div>

        <div className="hero-content z-10 text-center px-4">
          <h1 className="text-6xl md:text-8xl font-light tracking-tighter mb-6">
            Poet's <span className="italic font-serif text-rose-500">Haven</span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-md mx-auto font-light mb-12">
            Where ink meets soul. A sanctuary for the modern wordsmith.
          </p>
          <button onClick={navigateToDashboard} className="group relative px-10 py-5 border-2 border-zinc-700 hover:border-rose-500 transition-colors duration-500 rounded-2xl overflow-hidden min-w-[280px]">
            <span className="relative z-10 tracking-widest uppercase flex items-center justify-center gap-3 font-medium">
              ✨ Enter the Arena ✨
            </span>
            <div className="absolute inset-0 bg-rose-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          </button>
        </div>
      </section>

      {/* SECTION 2: THE ESSENCE */}
      <section className="section-two h-screen flex items-center justify-center bg-zinc-900/20 px-8">
        <div className="max-w-4xl text-center">
          <h2 className="text-4xl md:text-6xl font-light mb-8">
            Raw. Unfiltered. <br/><span className="italic font-serif text-rose-500">Rhythmic.</span>
          </h2>
          <p className="text-zinc-500 text-lg md:text-xl leading-loose max-w-2xl mx-auto">
            Traditional publishing is closed. The Arena is open. Share your verses, challenge the greats, and find your voice.
          </p>
        </div>
      </section>

      {/* SECTION 3: FOOTER & CONTACT - MASSIVE SPACING & HIDDEN EMAIL TEXT */}
      <footer className="min-h-screen flex flex-col lg:flex-row border-t border-zinc-900 bg-zinc-950">
        
        {/* Left Side: Brand & Social Icons */}
        <div className="footer-content w-full lg:w-1/2 p-16 md:p-32 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-zinc-900">
          <div className="mb-24">
            <h3 className="text-6xl font-serif italic mb-10 text-rose-500">Poet's Haven</h3>
            <p className="text-zinc-400 text-xl leading-relaxed max-w-md">
              Building the future of literary expression, one stanza at a time. Join our global collective.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-12 mt-20">
            <a href="https://www.instagram.com/secretcoderss" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-rose-500 transition-all duration-300 hover:-translate-y-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-rose-500 transition-all duration-300 hover:-translate-y-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-rose-500 transition-all duration-300 hover:-translate-y-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            </a>
            <a href="https://www.linkedin.com/in/secretcoderss" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-rose-500 transition-all duration-300 hover:-translate-y-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
          </div>

          <p className="text-zinc-700 text-sm tracking-[0.5em] uppercase mt-24">
            © 2026 Poet's Haven
          </p>
        </div>

        {/* Right Side: Clean Form & Direct Mail */}
        <div className="footer-content w-full lg:w-1/2 p-16 md:p-32 flex flex-col justify-center">
          <div className="max-w-2xl w-full">
            <h4 className="text-sm uppercase tracking-[0.5em] text-rose-500 font-black mb-16">Connect</h4>
            
            {/* BIG Mail Us Button - No email text displayed */}
            <div className="mb-20">
              <a 
                href="mailto:chikupiku906@gmail.com" 
                className="flex items-center justify-between w-full p-10 md:p-14 bg-zinc-900/30 border border-zinc-800 rounded-[2.5rem] hover:border-rose-500/50 hover:bg-zinc-900 transition-all duration-700 group"
              >
                <span className="text-3xl md:text-4xl font-light text-zinc-200 group-hover:text-rose-500 transition-colors">Mail Us Directly</span>
                <div className="w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:rotate-[360deg] transition-all duration-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </div>
              </a>
            </div>

            {/* MESSAGE FORM - MASSIVE TEXTAREA */}
            <form className="space-y-10" onSubmit={(e) => { e.preventDefault(); alert('✨ Sent! ✨'); }}>
              <div className="space-y-8">
                <input 
                  type="email" 
                  placeholder="Your Email Address" 
                  className="w-full bg-zinc-900/40 border border-zinc-800 rounded-3xl py-8 px-10 outline-none focus:border-rose-500 transition-all text-zinc-100 placeholder:text-zinc-600 text-xl"
                />
                <textarea 
                  placeholder="Your Message..." 
                  rows="8"
                  className="w-full bg-zinc-900/40 border border-zinc-800 rounded-3xl py-8 px-10 outline-none focus:border-rose-500 transition-all resize-none text-zinc-100 placeholder:text-zinc-600 text-xl"
                ></textarea>
              </div>

              <button className="relative w-full py-8 md:py-10 bg-rose-500 hover:bg-rose-600 text-white rounded-3xl transition-all duration-500 font-black text-xl tracking-[0.2em] uppercase overflow-hidden group">
                <span className="relative z-10 flex items-center justify-center gap-6">
                  Send Message 
                  <svg className="group-hover:translate-x-3 transition-transform" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </span>
              </button>
            </form>
          </div>
        </div>

      </footer>
    </div>
  )
}