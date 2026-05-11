"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

const GENRE_COLORS = {
  Action:          '#e8192c',
  Adventure:       '#f97316',
  RPG:             '#a855f7',
  Strategy:        '#3b82f6',
  Sports:          '#10b981',
  Racing:          '#f59e0b',
  Puzzle:          '#ec4899',
  Simulation:      '#14b8a6',
  'Battle Royale': '#e8192c',
  'Open-World':    '#7c3aed',
  default:         '#06b6d4',
};

const GameCard = ({ game, isFav, onFav, onCart, onClick }) => {
  const accent = GENRE_COLORS[game.category] || GENRE_COLORS.default;
  const isFree = !game.price || game.price === '0' || parseFloat(game.price) === 0;

  return (
    <motion.div
      className="game-card cursor-pointer group relative"
      whileHover={{ y:-8, transition:{ duration:0.28, ease:[0.16,1,0.3,1] } }}
      whileTap={{ scale:0.98 }}
      onClick={onClick}
    >
      {/* ── Image ── */}
      <div className="relative w-full aspect-[3/4] overflow-hidden">
        <Image src={game.imageUrl} alt={game.title} fill
          style={{ objectFit:'cover' }}
          className="transition-transform duration-700 group-hover:scale-[1.08]" />

        {/* Layered gradient */}
        <div className="absolute inset-0" style={{
          background:'linear-gradient(to top, rgba(1,2,8,0.95) 0%, rgba(1,2,8,0.35) 45%, transparent 70%)'
        }} />

        {/* Accent corner glow on hover */}
        <div className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
          style={{background:`radial-gradient(circle at top right, ${accent}30, transparent 70%)`}} />

        {/* ── Top left badges ── */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {isFree ? (
            <span className="free-badge">FREE</span>
          ) : (
            <span className="new-badge">NEW</span>
          )}
          {game.category && (
            <span className="px-2 py-0.5 rounded text-white"
              style={{
                background:`${accent}22`,
                border:`1px solid ${accent}40`,
                fontFamily:'JetBrains Mono', monospace,
                fontSize:'0.52rem',
                letterSpacing:'0.14em',
                textTransform:'uppercase',
                fontWeight:600,
                color: accent,
              }}>
              {game.category}
            </span>
          )}
        </div>

        {/* ── Fav button ── */}
        <motion.button
          whileHover={{ scale:1.22 }} whileTap={{ scale:0.82 }}
          onClick={(e) => { e.stopPropagation(); onFav && onFav(); }}
          className="absolute top-2.5 right-2.5 w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-200 z-10"
          style={{
            background:'rgba(1,2,8,0.65)',
            backdropFilter:'blur(8px)',
            border:`1px solid ${isFav ? 'rgba(232,25,44,0.4)' : 'rgba(255,255,255,0.08)'}`,
          }}>
          {isFav
            ? <AiFillHeart size={13} style={{color:'#e8192c'}} />
            : <AiOutlineHeart size={13} style={{color:'rgba(255,255,255,0.45)'}} />}
        </motion.button>

        {/* ── Bottom accent stripe ── */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left z-10"
          style={{background:`linear-gradient(to right, ${accent}cc, transparent)`}} />
      </div>

      {/* ── Info ── */}
      <div className="p-3.5 flex flex-col gap-2.5">
        <h3 className="text-sm font-bold truncate leading-tight transition-colors duration-200 group-hover:text-amber-300"
          style={{
            fontFamily:'Barlow Condensed', sans-serif,
            fontWeight:700,
            letterSpacing:'0.02em',
            fontSize:'0.88rem',
            color:'var(--text-primary)',
          }}>
          {game.title}
        </h3>

        <div className="flex items-center justify-between gap-2">
          <span style={{
            fontFamily:'JetBrains Mono', monospace,
            fontSize:'0.85rem',
            fontWeight:700,
            color: isFree ? 'var(--accent-emerald)' : 'var(--accent-gold)',
            letterSpacing:'0.03em',
          }}>
            {isFree ? 'FREE' : `PKR ${game.price}`}
          </span>

          <motion.button
            whileHover={{ scale:1.08 }} whileTap={{ scale:0.92 }}
            onClick={(e) => { e.stopPropagation(); onCart && onCart(e); }}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all duration-200"
            style={{
              background: isFree ? 'rgba(16,185,129,0.12)' : 'rgba(240,192,64,0.1)',
              border:`1px solid ${isFree ? 'rgba(16,185,129,0.28)' : 'rgba(240,192,64,0.26)'}`,
              color: isFree ? 'var(--accent-emerald)' : 'var(--accent-gold)',
              fontFamily:'Barlow Condensed', sans-serif,
              letterSpacing:'0.08em',
              fontSize:'0.7rem',
            }}>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            {isFree ? 'GET' : 'BUY'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default GameCard;
