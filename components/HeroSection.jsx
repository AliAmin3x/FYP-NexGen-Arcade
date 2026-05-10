"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const HERO_GAMES = [
  {
    title: "Cyber Nexus 2077",
    genre: "Action RPG",
    desc: "Immerse yourself in a neon-drenched open world where every choice reshapes your destiny.",
    image: "/img1.jpg",
    price: "PKR 4,999",
    badge: "NEW",
    rating: 4.8,
    tags: ["Open World", "Cyberpunk", "RPG"],
    accent: "#00d4ff",
  },
  {
    title: "Phantom Warfare",
    genre: "FPS Tactical",
    desc: "Elite squad tactics meet breathtaking graphics in the most realistic military shooter ever made.",
    image: "/img2.jpg",
    price: "PKR 3,599",
    badge: "HOT",
    rating: 4.6,
    tags: ["Multiplayer", "Tactical", "FPS"],
    accent: "#f97316",
  },
  {
    title: "Realm of Shadows",
    genre: "Dark Fantasy",
    desc: "Ancient kingdoms shattered. Only you can forge an alliance between light and darkness.",
    image: "/img3.jpg",
    price: "PKR 5,499",
    badge: "SALE",
    rating: 4.9,
    tags: ["Fantasy", "Adventure", "Co-op"],
    accent: "#8b5cf6",
  },
  {
    title: "Velocity Rush",
    genre: "Racing",
    desc: "200MPH. 60 tracks. Infinite glory. Push machines to their absolute limits.",
    image: "/img4.jpg",
    price: "PKR 2,999",
    badge: "TOP RATED",
    rating: 4.5,
    tags: ["Racing", "Arcade", "Online"],
    accent: "#10b981",
  },
  {
    title: "Galactic Siege",
    genre: "Strategy",
    desc: "Command fleets across 30 star systems. Diplomacy or destruction — your galaxy, your rules.",
    image: "/img7.jpg",
    price: "PKR 3,799",
    badge: "NEW",
    rating: 4.7,
    tags: ["Strategy", "Space", "4X"],
    accent: "#ec4899",
  },
];

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-1">
    {[1,2,3,4,5].map(i => (
      <svg key={i} className={`w-3.5 h-3.5 ${i <= Math.floor(rating) ? 'text-yellow-400' : 'text-slate-600'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
    <span className="text-xs text-slate-400 ml-1" style={{fontFamily:'var(--font-ui)'}}>{rating}</span>
  </div>
);

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => setCurrent(c => (c + 1) % HERO_GAMES.length), 5000);
    return () => clearInterval(timer);
  }, [autoPlay]);

  const game = HERO_GAMES[current];

  return (
    <section className="relative min-h-screen w-full overflow-hidden" style={{background:'var(--bg-primary)'}}>
      {/* Background Image */}
      <AnimatePresence mode="sync">
        <motion.div key={current} initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0">
          <Image src={game.image} alt={game.title} fill style={{ objectFit: "cover", objectPosition: "center" }} priority quality={85} />
          <div className="absolute inset-0" style={{
            background: `linear-gradient(to right, rgba(8,11,20,0.97) 0%, rgba(8,11,20,0.85) 40%, rgba(8,11,20,0.4) 70%, rgba(8,11,20,0.15) 100%),
                         linear-gradient(to top, rgba(8,11,20,0.9) 0%, transparent 50%)`
          }} />
        </motion.div>
      </AnimatePresence>

      {/* Animated accent line */}
      <div className="absolute left-0 top-0 h-full w-px" style={{background:`linear-gradient(to bottom, transparent, ${game.accent}, transparent)`, opacity: 0.5}} />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex flex-col justify-center min-h-screen pt-20">
        <div className="max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div key={current} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.5, ease: "easeOut" }} className="space-y-5">

              {/* Badge + Genre */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold px-3 py-1 rounded" style={{
                  background: game.badge === 'SALE' ? 'linear-gradient(135deg,#ef4444,#dc2626)' :
                               game.badge === 'HOT' ? 'linear-gradient(135deg,#f97316,#ea580c)' :
                               game.badge === 'TOP RATED' ? 'linear-gradient(135deg,#8b5cf6,#7c3aed)' :
                               'linear-gradient(135deg,#00d4ff,#3b82f6)',
                  color: '#000', fontFamily:'var(--font-display)', letterSpacing:'0.1em'
                }}>
                  {game.badge}
                </span>
                <span className="text-xs tracking-widest uppercase font-semibold" style={{color: game.accent, fontFamily:'var(--font-display)'}}>
                  {game.genre}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-none tracking-tight" style={{fontFamily:'var(--font-display)', color:'#fff',
                textShadow: `0 0 40px ${game.accent}33, 0 4px 30px rgba(0,0,0,0.8)`}}>
                {game.title}
              </h1>

              {/* Stars */}
              <StarRating rating={game.rating} />

              {/* Description */}
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-lg" style={{fontFamily:'var(--font-body)', fontWeight:300}}>
                {game.desc}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {game.tags.map(t => (
                  <span key={t} className="genre-badge">{t}</span>
                ))}
              </div>

              {/* Price + CTA */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-widest mb-0.5" style={{fontFamily:'var(--font-display)'}}>Price</p>
                  <p className="text-2xl font-bold gradient-text-cyan" style={{fontFamily:'var(--font-display)'}}>{game.price}</p>
                </div>
                <div className="flex gap-3">
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    className="btn-primary px-6 py-3 text-sm"
                    style={{fontFamily:'var(--font-display)', boxShadow:`0 0 20px ${game.accent}40`}}>
                    Add to Cart
                  </motion.button>
                  <Link href="/Games">
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                      className="btn-ghost px-6 py-3 text-sm">
                      Browse All
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-10 left-4 sm:left-6 flex items-center gap-3">
          {HERO_GAMES.map((g, i) => (
            <button key={i} onClick={() => { setCurrent(i); setAutoPlay(false); }}
              className="relative overflow-hidden rounded-sm transition-all duration-300"
              style={{ width: i === current ? 32 : 16, height: 3, background: i === current ? game.accent : 'rgba(255,255,255,0.2)' }}>
              {i === current && (
                <motion.div className="absolute inset-0 origin-left" style={{ background: game.accent }}
                  initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 5, ease: 'linear' }} key={current} />
              )}
            </button>
          ))}
          <span className="text-xs text-slate-500 ml-2" style={{fontFamily:'var(--font-ui)'}}>
            {String(current + 1).padStart(2,'0')} / {String(HERO_GAMES.length).padStart(2,'0')}
          </span>
        </div>

        {/* Right: thumbnail strip */}
        <div className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3">
          {HERO_GAMES.map((g, i) => (
            <motion.button key={i} onClick={() => { setCurrent(i); setAutoPlay(false); }}
              whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
              className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 transition-all duration-300 ${i === current ? 'border-cyan-400' : 'border-transparent opacity-50 hover:opacity-80'}`}>
              <Image src={g.image} alt={g.title} fill style={{objectFit:'cover'}} />
              {i === current && <div className="absolute inset-0" style={{boxShadow:`inset 0 0 12px ${game.accent}50`}} />}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
