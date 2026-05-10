"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

const GENRE_COLORS = {
  Action: '#ef4444', Adventure: '#f97316', RPG: '#8b5cf6', Strategy: '#3b82f6',
  Sports: '#10b981', Racing: '#f59e0b', Puzzle: '#ec4899', Simulation: '#14b8a6',
  'Battle Royale': '#dc2626', 'Open-World': '#6366f1', default: '#00d4ff',
};

const GameCard = ({ game, isFav, onFav, onCart, onClick, variant = 'default' }) => {
  const accentColor = GENRE_COLORS[game.category] || GENRE_COLORS.default;
  const isFree = !game.price || game.price === '0' || parseFloat(game.price) === 0;

  return (
    <motion.div
      className="game-card cursor-pointer group"
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative w-full aspect-[16/10] overflow-hidden">
        <Image src={game.imageUrl} alt={game.title} fill style={{ objectFit: 'cover' }}
          className="transition-transform duration-500 group-hover:scale-105" />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Top badges */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          {isFree ? (
            <span className="free-badge">Free</span>
          ) : (
            <span className="new-badge">{game.type === 'featured' ? 'Featured' : 'New'}</span>
          )}
          {game.category && (
            <span className="text-xs px-2 py-0.5 rounded font-semibold tracking-wide"
              style={{ background: `${accentColor}22`, color: accentColor, border: `1px solid ${accentColor}44`, fontFamily: 'var(--font-display)', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {game.category}
            </span>
          )}
        </div>

        {/* Fav button */}
        <motion.button
          whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.stopPropagation(); onFav && onFav(); }}
          className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 hover:border-pink-400/40 transition-all duration-200">
          {isFav
            ? <AiFillHeart size={14} className="text-pink-400" />
            : <AiOutlineHeart size={14} className="text-white/70 hover:text-pink-400" />}
        </motion.button>

        {/* Bottom accent bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `linear-gradient(to right, transparent, ${accentColor}, transparent)` }} />
      </div>

      {/* Info */}
      <div className="p-3.5">
        <h3 className="text-sm font-bold text-white truncate mb-0.5 group-hover:text-cyan-400 transition-colors duration-200"
          style={{ fontFamily: 'var(--font-body)', letterSpacing: '0.03em', fontSize: '0.95rem' }}>
          {game.title}
        </h3>

        <div className="flex items-center justify-between">
          <span className={`text-sm font-bold price-tag ${isFree ? 'text-emerald-400' : 'gradient-text-cyan'}`}>
            {isFree ? 'FREE' : `PKR ${game.price}`}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={(e) => { e.stopPropagation(); onCart && onCart(e); }}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all duration-200"
            style={{
              background: 'rgba(0,212,255,0.1)',
              border: '1px solid rgba(0,212,255,0.3)',
              color: '#00d4ff',
              fontFamily: 'var(--font-display)',
              letterSpacing: '0.06em'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,212,255,0.2)'; e.currentTarget.style.boxShadow = '0 0 15px rgba(0,212,255,0.3)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,212,255,0.1)'; e.currentTarget.style.boxShadow = 'none'; }}>
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
