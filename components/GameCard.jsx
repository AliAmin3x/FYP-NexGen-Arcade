"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

const GENRE_COLORS = {
  Action:       '#e8192c',
  Adventure:    '#e8b923',
  RPG:          '#a855f7',
  Strategy:     '#3b82f6',
  Sports:       '#00d68f',
  Racing:       '#f97316',
  Puzzle:       '#ec4899',
  Simulation:   '#14b8a6',
  'Battle Royale': '#e8192c',
  'Open-World': '#6933ff',
  default:      '#00c8ff',
};

const GameCard = ({ game, isFav, onFav, onCart, onClick, variant = 'default' }) => {
  const accentColor = GENRE_COLORS[game.category] || GENRE_COLORS.default;
  const isFree = !game.price || game.price === '0' || parseFloat(game.price) === 0;

  return (
    <motion.div
      className="game-card cursor-pointer group"
      whileHover={{ y:-6, transition:{ duration:0.22 } }}
      whileTap={{ scale:0.98 }}
      onClick={onClick}
    >
      {/* ── Image area ── */}
      <div className="relative w-full aspect-[3/4] overflow-hidden">
        <Image src={game.imageUrl} alt={game.title} fill
          style={{ objectFit:'cover' }}
          className="transition-transform duration-600 group-hover:scale-108" />

        {/* Dark gradient */}
        <div className="absolute inset-0" style={{
          background:'linear-gradient(to top, rgba(2,3,10,0.92) 0%, rgba(2,3,10,0.3) 45%, transparent 70%)'
        }} />

        {/* Accent corner flash on hover */}
        <div className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{background:`radial-gradient(circle at top right, ${accentColor}25, transparent 70%)`}} />

        {/* ── Top badges ── */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {isFree ? (
            <span className="free-badge">FREE</span>
          ) : (
            <span className="new-badge">NEW</span>
          )}
          {game.category && (
            <span className="text-xs px-2 py-0.5 rounded-sm font-bold tracking-wider"
              style={{
                background:`${accentColor}18`,
                color: accentColor,
                border:`1px solid ${accentColor}38`,
                fontFamily:'var(--font-mono)',
                fontSize:'0.55rem',
                letterSpacing:'0.14em',
                textTransform:'uppercase'
              }}>
              {game.category}
            </span>
          )}
        </div>

        {/* ── Fav button ── */}
        <motion.button
          whileHover={{ scale:1.2 }} whileTap={{ scale:0.85 }}
          onClick={(e) => { e.stopPropagation(); onFav && onFav(); }}
          className="absolute top-2.5 right-2.5 w-7 h-7 flex items-center justify-center rounded transition-all duration-200"
          style={{background:'rgba(2,3,10,0.6)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.08)'}}>
          {isFav
            ? <AiFillHeart size={13} style={{color:'#e8192c'}} />
            : <AiOutlineHeart size={13} style={{color:'rgba(255,255,255,0.5)'}} />}
        </motion.button>

        {/* ── Bottom accent stripe ── */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
          style={{background:`linear-gradient(to right, ${accentColor}, transparent)`}} />
      </div>

      {/* ── Info ── */}
      <div className="p-3.5 flex flex-col gap-2.5">
        <h3 className="text-sm font-bold truncate group-hover:text-amber-300 transition-colors duration-200 leading-tight"
          style={{fontFamily:'var(--font-heading)', fontWeight:700, letterSpacing:'0.04em', fontSize:'0.9rem', color:'var(--text-primary)'}}>
          {game.title}
        </h3>

        <div className="flex items-center justify-between gap-2">
          <span style={{
            fontFamily:'var(--font-mono)',
            fontSize:'0.85rem',
            fontWeight:700,
            color: isFree ? 'var(--accent-emerald)' : 'var(--accent-gold)',
            letterSpacing:'0.04em'
          }}>
            {isFree ? 'FREE' : `PKR ${game.price}`}
          </span>

          <motion.button
            whileHover={{ scale:1.06 }} whileTap={{ scale:0.93 }}
            onClick={(e) => { e.stopPropagation(); onCart && onCart(e); }}
            className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-sm transition-all duration-200"
            style={{
              background: isFree ? 'rgba(0,214,143,0.12)' : 'rgba(232,185,35,0.1)',
              border:`1px solid ${isFree ? 'rgba(0,214,143,0.3)' : 'rgba(232,185,35,0.28)'}`,
              color: isFree ? 'var(--accent-emerald)' : 'var(--accent-gold)',
              fontFamily:'var(--font-heading)',
              letterSpacing:'0.1em',
              fontSize:'0.72rem'
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
