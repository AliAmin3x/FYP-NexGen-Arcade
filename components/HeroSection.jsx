"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const HERO_GAMES = [
  {
    title: "Cyber Nexus 2077",
    genre: "Action RPG",
    desc: "Immerse yourself in a neon-drenched open world where every choice reshapes your destiny across 100+ hours of breathtaking story.",
    image: "/img1.jpg",
    price: "4,999",
    originalPrice: "7,999",
    badge: "NEW RELEASE",
    badgeType: "new",
    rating: 4.8,
    reviews: "24.6K",
    tags: ["Open World", "Cyberpunk", "RPG"],
    accent: "#06b6d4",
    accentRgb: "6,182,212",
    publisher: "NexGen Studios",
    year: "2024",
    platform: "PC · Console",
  },
  {
    title: "Phantom Warfare",
    genre: "FPS Tactical",
    desc: "Elite squad tactics meet breathtaking visuals in the most realistic military shooter ever crafted. 60 maps, endless strategy.",
    image: "/img2.jpg",
    price: "3,599",
    originalPrice: "3,599",
    badge: "TRENDING",
    badgeType: "hot",
    rating: 4.6,
    reviews: "18.3K",
    tags: ["Multiplayer", "Tactical", "FPS"],
    accent: "#f0c040",
    accentRgb: "240,192,64",
    publisher: "WarForge Interactive",
    year: "2024",
    platform: "PC · Xbox · PS5",
  },
  {
    title: "Realm of Shadows",
    genre: "Dark Fantasy",
    desc: "Ancient kingdoms shattered. Forge an alliance between light and darkness in this sweeping 80-hour epic co-op adventure.",
    image: "/img3.jpg",
    price: "3,849",
    originalPrice: "5,499",
    badge: "SALE −30%",
    badgeType: "sale",
    rating: 4.9,
    reviews: "31.2K",
    tags: ["Fantasy", "Adventure", "Co-op"],
    accent: "#a855f7",
    accentRgb: "168,85,247",
    publisher: "Darkside Games",
    year: "2024",
    platform: "All Platforms",
  },
  {
    title: "Velocity Rush",
    genre: "Arcade Racing",
    desc: "200 MPH. 60 tracks. Infinite glory. Push supercars to their absolute breaking point across stunning real-world circuits.",
    image: "/img4.jpg",
    price: "2,999",
    originalPrice: "2,999",
    badge: "TOP RATED",
    badgeType: "gold",
    rating: 4.5,
    reviews: "12.7K",
    tags: ["Racing", "Arcade", "Online"],
    accent: "#10b981",
    accentRgb: "16,185,129",
    publisher: "Turbo Labs",
    year: "2023",
    platform: "PC · Console",
  },
  {
    title: "Galactic Siege",
    genre: "Space Strategy",
    desc: "Command fleets across 30 star systems. Diplomacy or destruction — your galaxy, your rules. The ultimate 4X experience.",
    image: "/img7.jpg",
    price: "3,799",
    originalPrice: "3,799",
    badge: "EDITOR'S PICK",
    badgeType: "pick",
    rating: 4.7,
    reviews: "9.8K",
    tags: ["Strategy", "Space", "4X"],
    accent: "#e8192c",
    accentRgb: "232,25,44",
    publisher: "Orbital Games",
    year: "2024",
    platform: "PC",
  },
];

const BADGE_STYLES = {
  new:  { bg: 'linear-gradient(135deg,#06b6d4,#7c3aed)',    color:'#fff' },
  hot:  { bg: 'linear-gradient(135deg,#e8192c,#f97316)',    color:'#fff' },
  sale: { bg: 'linear-gradient(135deg,#e8192c,#b01020)',    color:'#fff' },
  gold: { bg: 'linear-gradient(135deg,#f0c040,#c49a2a)',    color:'#000' },
  pick: { bg: 'rgba(255,255,255,0.1)', color:'#fff', border:'1px solid rgba(255,255,255,0.25)' },
};

const StarRating = ({ rating, reviews }) => (
  <div className="flex items-center gap-2">
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} className="w-3.5 h-3.5" viewBox="0 0 20 20"
          fill={i <= Math.floor(rating) ? "#f0c040" : "none"}
          stroke={i <= Math.floor(rating) ? "#f0c040" : "#2d3555"} strokeWidth={1}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
    <span style={{fontFamily:"'JetBrains Mono', monospace", fontSize:'0.78rem', color:'var(--accent-gold)', fontWeight:600}}>{rating}</span>
    <span style={{fontFamily:"'JetBrains Mono', monospace", fontSize:'0.7rem', color:'var(--text-muted)'}}>({reviews})</span>
  </div>
);

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [direction, setDirection] = useState(1);

  const navigate = useCallback((to) => {
    setDirection(to > current ? 1 : -1);
    setCurrent(to);
  }, [current]);

  useEffect(() => {
    if (!autoPlay) return;
    const t = setInterval(() => {
      setDirection(1);
      setCurrent(c => (c + 1) % HERO_GAMES.length);
    }, 7000);
    return () => clearInterval(t);
  }, [autoPlay]);

  const game = HERO_GAMES[current];
  const badgeStyle = BADGE_STYLES[game.badgeType] || BADGE_STYLES.pick;
  const hasSale = game.price !== game.originalPrice;

  return (
    <section className="relative min-h-screen w-full overflow-hidden" style={{background:'var(--bg-void)'}}>

      {/* ── Background image ── */}
      <AnimatePresence mode="sync">
        <motion.div key={`bg-${current}`}
          initial={{ opacity:0, scale:1.07 }}
          animate={{ opacity:1, scale:1 }}
          exit={{ opacity:0 }}
          transition={{ duration:1.1, ease:[0.16,1,0.3,1] }}
          className="absolute inset-0">
          <Image src={game.image} alt={game.title} fill
            style={{ objectFit:"cover", objectPosition:"center 20%" }} priority quality={95} />

          {/* Multi-layer cinematic overlay */}
          <div className="absolute inset-0" style={{
            background:`
              linear-gradient(to right,
                rgba(1,2,8,0.99) 0%,
                rgba(1,2,8,0.92) 32%,
                rgba(1,2,8,0.55) 58%,
                rgba(1,2,8,0.08) 100%
              ),
              linear-gradient(to top,
                rgba(1,2,8,0.98) 0%,
                rgba(1,2,8,0.5) 25%,
                transparent 55%
              )
            `
          }} />

          {/* Accent colour wash */}
          <motion.div className="absolute inset-0 transition-all duration-1500"
            animate={{ opacity: 1 }}
            style={{
              background:`radial-gradient(ellipse 50% 65% at 72% 50%, rgba(${game.accentRgb},0.09) 0%, transparent 65%)`
            }} />
        </motion.div>
      </AnimatePresence>

      {/* ── Scanlines ── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage:'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.03) 3px, rgba(0,0,0,0.03) 4px)',
        zIndex:1
      }} />

      {/* ── Grid lines (subtle) ── */}
      <div className="absolute inset-0 grid-lines opacity-25 pointer-events-none" style={{zIndex:1}} />

      {/* ── Left accent line ── */}
      <div className="absolute left-0 top-0 h-full w-px" style={{
        background:`linear-gradient(to bottom, transparent 10%, rgba(${game.accentRgb},0.45) 50%, transparent 90%)`
      }} />

      {/* ── Main content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex flex-col justify-center min-h-screen pt-28 pb-28">
        <div className="max-w-[620px]">
          <AnimatePresence mode="wait">
            <motion.div key={`content-${current}`}
              initial={{ opacity:0, x: direction * -40 }}
              animate={{ opacity:1, x:0 }}
              exit={{ opacity:0, x: direction * 40 }}
              transition={{ duration:0.6, ease:[0.16,1,0.3,1] }}
              className="flex flex-col gap-5">

              {/* Publisher + Year */}
              <motion.div initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} transition={{delay:0.08}}
                className="flex items-center gap-3">
                <div className="h-px w-8" style={{background:`rgba(${game.accentRgb},0.7)`}} />
                <span style={{
                  fontFamily:"'JetBrains Mono', monospace",
                  fontSize:'0.6rem',
                  letterSpacing:'0.32em',
                  color:`rgba(${game.accentRgb},0.85)`,
                  textTransform:'uppercase',
                  fontWeight:500,
                }}>
                  {game.publisher} · {game.year} · {game.platform}
                </span>
              </motion.div>

              {/* Badge + Genre */}
              <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} transition={{delay:0.14}}
                className="flex items-center gap-3 flex-wrap">
                <span className="px-3 py-1 rounded-md text-xs font-bold tracking-wider"
                  style={{
                    background: badgeStyle.bg,
                    color: badgeStyle.color,
                    fontFamily:"'JetBrains Mono', monospace",
                    letterSpacing:'0.15em',
                    fontSize:'0.6rem',
                    border: badgeStyle.border || 'none',
                    boxShadow: game.badgeType !== 'pick' ? `0 4px 15px rgba(${game.accentRgb},0.35)` : 'none',
                  }}>
                  {game.badge}
                </span>
                <span style={{
                  fontFamily:"'Barlow Condensed', sans-serif",
                  fontWeight:700,
                  fontSize:'0.75rem',
                  letterSpacing:'0.22em',
                  color:`rgba(${game.accentRgb},0.9)`,
                  textTransform:'uppercase'
                }}>
                  {game.genre}
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.2}}
                style={{
                  fontFamily:"'Barlow Condensed', sans-serif",
                  fontSize:'clamp(3.2rem,8.5vw,6rem)',
                  lineHeight:0.88,
                  color:'#fff',
                  letterSpacing:'-0.01em',
                  fontWeight:800,
                  textShadow:`0 0 80px rgba(${game.accentRgb},0.18), 0 4px 50px rgba(0,0,0,0.95)`
                }}>
                {game.title}
              </motion.h1>

              {/* Rating */}
              <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.28}}>
                <StarRating rating={game.rating} reviews={game.reviews} />
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:0.33}}
                style={{
                  fontFamily:"'DM Sans', sans-serif",
                  fontSize:'1rem',
                  fontWeight:400,
                  lineHeight:1.72,
                  color:'rgba(238,242,255,0.65)',
                  maxWidth:'480px'
                }}>
                {game.desc}
              </motion.p>

              {/* Tags */}
              <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.4}}
                className="flex flex-wrap gap-2">
                {game.tags.map(t => (
                  <span key={t} className="genre-badge">{t}</span>
                ))}
              </motion.div>

              {/* Price + CTA */}
              <motion.div
                initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.46}}
                className="flex flex-wrap items-center gap-5 pt-2">
                <div className="flex flex-col gap-1">
                  {hasSale && (
                    <span style={{fontFamily:"'JetBrains Mono', monospace", fontSize:'0.75rem', color:'var(--text-muted)', textDecoration:'line-through', letterSpacing:'0.04em'}}>
                      PKR {game.originalPrice}
                    </span>
                  )}
                  <span style={{fontFamily:"'JetBrains Mono', monospace", fontSize:'1.7rem', fontWeight:700, color:'var(--accent-gold)', letterSpacing:'0.03em', lineHeight:1}}>
                    PKR {game.price}
                  </span>
                  {hasSale && (
                    <span style={{fontFamily:"'JetBrains Mono', monospace", fontSize:'0.6rem', color:'#10b981', letterSpacing:'0.15em', textTransform:'uppercase'}}>
                      ◆ Limited time deal
                    </span>
                  )}
                </div>

                <div className="flex gap-3 flex-wrap">
                  <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
                    className="btn-primary px-7 py-3.5 text-sm"
                    style={{letterSpacing:'0.12em', boxShadow:`0 0 30px rgba(232,25,44,0.45), 0 8px 30px rgba(0,0,0,0.5)`}}>
                    Add to Cart
                  </motion.button>
                  <Link href="/Games">
                    <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
                      className="btn-ghost px-7 py-3.5 text-sm"
                      style={{letterSpacing:'0.12em'}}>
                      Browse Store
                    </motion.button>
                  </Link>
                </div>
              </motion.div>

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Progress dots (bottom) ── */}
      <div className="absolute bottom-10 left-4 sm:left-6 z-20 flex items-center gap-3">
        {HERO_GAMES.map((g, i) => (
          <button key={i}
            onClick={() => { navigate(i); setAutoPlay(false); }}
            className="relative overflow-hidden transition-all duration-350"
            style={{
              width: i === current ? 40 : 12,
              height: 3,
              borderRadius: 2,
              background: i === current ? `rgba(${g.accentRgb},1)` : 'rgba(255,255,255,0.12)'
            }}>
            {i === current && (
              <motion.div className="absolute inset-0 origin-left"
                style={{ background:`rgba(${g.accentRgb},1)` }}
                initial={{ scaleX:0 }} animate={{ scaleX:1 }}
                transition={{ duration:7, ease:'linear' }} key={current} />
            )}
          </button>
        ))}
        <span style={{fontFamily:"'JetBrains Mono', monospace", fontSize:'0.58rem', letterSpacing:'0.22em', color:'var(--text-muted)', marginLeft:'8px'}}>
          {String(current+1).padStart(2,'0')} / {String(HERO_GAMES.length).padStart(2,'0')}
        </span>
      </div>

      {/* ── Right thumbnail strip ── */}
      <div className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col gap-3">
        {HERO_GAMES.map((g, i) => (
          <motion.button key={i}
            onClick={() => { navigate(i); setAutoPlay(false); }}
            whileHover={{ scale:1.08, x:-5 }} whileTap={{ scale:0.93 }}
            className="relative w-[76px] h-[52px] rounded-lg overflow-hidden transition-all duration-300"
            style={{
              border: `1px solid ${i === current ? `rgba(${g.accentRgb},0.8)` : 'rgba(255,255,255,0.07)'}`,
              opacity: i === current ? 1 : 0.42,
              boxShadow: i === current ? `0 0 24px rgba(${g.accentRgb},0.35)` : 'none'
            }}>
            <Image src={g.image} alt={g.title} fill style={{objectFit:'cover'}} />
            {i === current && (
              <div className="absolute inset-0" style={{boxShadow:`inset 0 0 20px rgba(${g.accentRgb},0.45)`}} />
            )}
          </motion.button>
        ))}
      </div>

      {/* ── Keyboard navigation hint ── */}
      <div className="absolute bottom-10 right-4 sm:right-6 z-20 hidden md:flex items-center gap-2 opacity-30">
        {['◀','▶'].map((a,i) => (
          <button key={i}
            onClick={() => {
              const next = i === 0 ? (current - 1 + HERO_GAMES.length) % HERO_GAMES.length : (current + 1) % HERO_GAMES.length;
              navigate(next);
              setAutoPlay(false);
            }}
            className="w-7 h-7 flex items-center justify-center rounded border border-white/10 text-white/50 hover:border-white/30 hover:text-white/80 transition-all"
            style={{fontFamily:"'JetBrains Mono', monospace", fontSize:'0.6rem'}}>
            {a}
          </button>
        ))}
      </div>

      {/* ── Bottom fade ── */}
      <div className="absolute bottom-0 left-0 right-0 h-36 pointer-events-none z-10" style={{
        background:'linear-gradient(to top, var(--bg-primary), transparent)'
      }} />
    </section>
  );
};

export default HeroSection;
