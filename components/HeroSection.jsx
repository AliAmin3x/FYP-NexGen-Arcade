"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const HERO_GAMES = [
  {
    title: "Cyber Nexus 2077",
    genre: "Action RPG",
    desc: "Immerse yourself in a neon-drenched open world where every choice reshapes your destiny across 100+ hours of story.",
    image: "/img1.jpg",
    price: "4,999",
    badge: "NEW RELEASE",
    rating: 4.8,
    reviews: "24.6K",
    tags: ["Open World", "Cyberpunk", "RPG"],
    accent: "#00c8ff",
    accentRgb: "0,200,255",
    publisher: "NexGen Studios",
    year: "2024",
  },
  {
    title: "Phantom Warfare",
    genre: "FPS Tactical",
    desc: "Elite squad tactics meet breathtaking graphics in the most realistic military shooter ever crafted.",
    image: "/img2.jpg",
    price: "3,599",
    badge: "TRENDING",
    rating: 4.6,
    reviews: "18.3K",
    tags: ["Multiplayer", "Tactical", "FPS"],
    accent: "#e8b923",
    accentRgb: "232,185,35",
    publisher: "WarForge Interactive",
    year: "2024",
  },
  {
    title: "Realm of Shadows",
    genre: "Dark Fantasy",
    desc: "Ancient kingdoms shattered. Forge an alliance between light and darkness in this sweeping epic.",
    image: "/img3.jpg",
    price: "5,499",
    badge: "SALE −30%",
    rating: 4.9,
    reviews: "31.2K",
    tags: ["Fantasy", "Adventure", "Co-op"],
    accent: "#a855f7",
    accentRgb: "168,85,247",
    publisher: "Darkside Games",
    year: "2024",
  },
  {
    title: "Velocity Rush",
    genre: "Arcade Racing",
    desc: "200MPH. 60 tracks. Infinite glory. Push supercars to their absolute breaking point.",
    image: "/img4.jpg",
    price: "2,999",
    badge: "TOP RATED",
    rating: 4.5,
    reviews: "12.7K",
    tags: ["Racing", "Arcade", "Online"],
    accent: "#00d68f",
    accentRgb: "0,214,143",
    publisher: "Turbo Labs",
    year: "2023",
  },
  {
    title: "Galactic Siege",
    genre: "Space Strategy",
    desc: "Command fleets across 30 star systems. Diplomacy or destruction — your galaxy, your rules.",
    image: "/img7.jpg",
    price: "3,799",
    badge: "EDITOR'S PICK",
    rating: 4.7,
    reviews: "9.8K",
    tags: ["Strategy", "Space", "4X"],
    accent: "#e8192c",
    accentRgb: "232,25,44",
    publisher: "Orbital Games",
    year: "2024",
  },
];

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-1.5">
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} className="w-3.5 h-3.5" fill={i <= Math.floor(rating) ? "#e8b923" : "none"}
          stroke={i <= Math.floor(rating) ? "#e8b923" : "#363f5c"} strokeWidth={1} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
    <span style={{fontFamily:'var(--font-mono)', fontSize:'0.78rem', color:'var(--accent-gold)'}}>{rating}</span>
    <span style={{fontFamily:'var(--font-body)', fontSize:'0.72rem', color:'var(--text-muted)'}}>({reviews} reviews)</span>
  </div>
);
StarRating.defaultProps = { reviews: "0" };

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;
    const t = setInterval(() => setCurrent(c => (c + 1) % HERO_GAMES.length), 6000);
    return () => clearInterval(t);
  }, [autoPlay]);

  const game = HERO_GAMES[current];

  return (
    <section className="relative min-h-screen w-full overflow-hidden" style={{background:'var(--bg-void)'}}>

      {/* ── Background image with cinematic overlay ── */}
      <AnimatePresence mode="sync">
        <motion.div key={current}
          initial={{ opacity:0, scale:1.06 }}
          animate={{ opacity:1, scale:1 }}
          exit={{ opacity:0 }}
          transition={{ duration:1, ease:"easeInOut" }}
          className="absolute inset-0">
          <Image src={game.image} alt={game.title} fill
            style={{ objectFit:"cover", objectPosition:"center top" }} priority quality={90} />

          {/* Layered overlays for cinematic feel */}
          <div className="absolute inset-0" style={{
            background:`
              linear-gradient(to right,
                rgba(2,3,10,0.98) 0%,
                rgba(2,3,10,0.88) 35%,
                rgba(2,3,10,0.5) 60%,
                rgba(2,3,10,0.15) 100%
              ),
              linear-gradient(to top,
                rgba(2,3,10,0.95) 0%,
                rgba(2,3,10,0.4) 30%,
                transparent 60%
              )
            `
          }} />

          {/* Accent colour wash */}
          <div className="absolute inset-0 transition-all duration-1000" style={{
            background:`radial-gradient(ellipse 55% 70% at 75% 50%, rgba(${game.accentRgb},0.08) 0%, transparent 65%)`
          }} />
        </motion.div>
      </AnimatePresence>

      {/* ── Decorative vertical lines ── */}
      <div className="absolute left-0 top-0 h-full w-px opacity-60" style={{
        background:`linear-gradient(to bottom, transparent 10%, rgba(${game.accentRgb},0.5) 50%, transparent 90%)`
      }} />

      {/* ── Scanlines ── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage:'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)',
        zIndex:1
      }} />

      {/* ── Main content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex flex-col justify-center min-h-screen pt-24 pb-24">
        <div className="max-w-xl xl:max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div key={current}
              initial={{ opacity:0, x:-30 }}
              animate={{ opacity:1, x:0 }}
              exit={{ opacity:0, x:30 }}
              transition={{ duration:0.55, ease:[0.25,0.46,0.45,0.94] }}
              className="flex flex-col gap-5">

              {/* Publisher + Year */}
              <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} transition={{delay:0.1}}
                className="flex items-center gap-3">
                <div className="h-px w-8" style={{background:`rgba(${game.accentRgb},0.6)`}} />
                <span style={{
                  fontFamily:'var(--font-mono)',
                  fontSize:'0.62rem',
                  letterSpacing:'0.28em',
                  color:`rgba(${game.accentRgb},0.8)`,
                  textTransform:'uppercase'
                }}>{game.publisher} · {game.year}</span>
              </motion.div>

              {/* Badge + Genre */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="px-3 py-1 rounded-sm text-xs font-bold tracking-wider"
                  style={{
                    background: game.badge.includes('SALE') ? 'var(--accent-red)' :
                                game.badge === 'TRENDING' ? 'var(--accent-gold)' :
                                game.badge.includes('PICK') ? `rgba(${game.accentRgb},0.9)` :
                                'rgba(255,255,255,0.12)',
                    color: game.badge === 'TRENDING' ? '#000' : '#fff',
                    fontFamily:'var(--font-mono)',
                    letterSpacing:'0.16em',
                    fontSize:'0.62rem',
                    border: `1px solid rgba(${game.accentRgb},0.4)`
                  }}>
                  {game.badge}
                </span>
                <span style={{
                  fontFamily:'var(--font-heading)',
                  fontWeight:700,
                  fontSize:'0.78rem',
                  letterSpacing:'0.2em',
                  color:`rgba(${game.accentRgb},0.9)`,
                  textTransform:'uppercase'
                }}>
                  {game.genre}
                </span>
              </div>

              {/* Title */}
              <h1 style={{
                fontFamily:'var(--font-display)',
                fontSize:'clamp(3rem,8vw,5.5rem)',
                lineHeight:0.9,
                color:'#fff',
                letterSpacing:'0.02em',
                textShadow:`0 0 60px rgba(${game.accentRgb},0.2), 0 4px 40px rgba(0,0,0,0.9)`
              }}>
                {game.title}
              </h1>

              {/* Rating */}
              <StarRating rating={game.rating} reviews={game.reviews} />

              {/* Description */}
              <p style={{
                fontFamily:'var(--font-body)',
                fontSize:'1rem',
                fontWeight:300,
                lineHeight:1.7,
                color:'rgba(240,244,255,0.72)',
                maxWidth:'480px'
              }}>
                {game.desc}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {game.tags.map(t => (
                  <span key={t} className="genre-badge">{t}</span>
                ))}
              </div>

              {/* Price + CTA */}
              <div className="flex flex-wrap items-center gap-5 pt-2">
                <div className="flex flex-col gap-0.5">
                  <span style={{fontFamily:'var(--font-mono)', fontSize:'0.58rem', letterSpacing:'0.22em', color:'var(--text-muted)', textTransform:'uppercase'}}>
                    Price
                  </span>
                  <span style={{fontFamily:'var(--font-mono)', fontSize:'1.6rem', fontWeight:700, color:'var(--accent-gold)', letterSpacing:'0.04em'}}>
                    PKR {game.price}
                  </span>
                </div>
                <div className="flex gap-3">
                  <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
                    className="btn-primary px-7 py-3.5 text-sm"
                    style={{fontFamily:'var(--font-heading)', fontSize:'0.85rem', letterSpacing:'0.14em',
                      boxShadow:`0 0 25px rgba(232,25,44,0.4)`}}>
                    Add to Cart
                  </motion.button>
                  <Link href="/Games">
                    <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
                      className="btn-ghost px-7 py-3.5 text-sm"
                      style={{fontFamily:'var(--font-heading)', fontSize:'0.85rem', letterSpacing:'0.14em'}}>
                      Browse All
                    </motion.button>
                  </Link>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Bottom progress indicators ── */}
      <div className="absolute bottom-8 left-4 sm:left-6 z-20 flex items-center gap-3">
        {HERO_GAMES.map((g, i) => (
          <button key={i}
            onClick={() => { setCurrent(i); setAutoPlay(false); }}
            className="relative overflow-hidden transition-all duration-300"
            style={{ width: i === current ? 36 : 14, height: 3, borderRadius:2,
              background: i === current ? `rgba(${g.accentRgb},0.9)` : 'rgba(255,255,255,0.15)' }}>
            {i === current && (
              <motion.div className="absolute inset-0 origin-left"
                style={{ background:`rgba(${game.accentRgb},1)` }}
                initial={{ scaleX:0 }} animate={{ scaleX:1 }}
                transition={{ duration:6, ease:'linear' }} key={current} />
            )}
          </button>
        ))}
        <span style={{fontFamily:'var(--font-mono)', fontSize:'0.6rem', letterSpacing:'0.2em', color:'var(--text-muted)', marginLeft:'6px'}}>
          {String(current+1).padStart(2,'0')} / {String(HERO_GAMES.length).padStart(2,'0')}
        </span>
      </div>

      {/* ── Right thumbnail strip ── */}
      <div className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col gap-2.5">
        {HERO_GAMES.map((g, i) => (
          <motion.button key={i}
            onClick={() => { setCurrent(i); setAutoPlay(false); }}
            whileHover={{ scale:1.1, x:-4 }} whileTap={{ scale:0.94 }}
            className="relative w-[72px] h-[50px] rounded overflow-hidden transition-all duration-300"
            style={{
              border: `1px solid ${i === current ? `rgba(${g.accentRgb},0.7)` : 'rgba(255,255,255,0.08)'}`,
              opacity: i === current ? 1 : 0.45,
              boxShadow: i === current ? `0 0 20px rgba(${g.accentRgb},0.3)` : 'none'
            }}>
            <Image src={g.image} alt={g.title} fill style={{objectFit:'cover'}} />
            {i === current && (
              <div className="absolute inset-0" style={{boxShadow:`inset 0 0 15px rgba(${game.accentRgb},0.4)`}} />
            )}
          </motion.button>
        ))}
      </div>

      {/* ── Bottom fade ── */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none" style={{
        background:'linear-gradient(to top, var(--bg-primary), transparent)'
      }} />
    </section>
  );
};

export default HeroSection;
