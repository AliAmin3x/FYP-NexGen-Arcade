"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [games, setGames] = useState([]);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const router = useRouter();

  const fetchGames = useCallback(async (term) => {
    if (!term.trim()) { setGames([]); return; }
    try {
      const res = await fetch(`/api/games?status=Approved`);
      const data = await res.json();
      const filtered = (Array.isArray(data) ? data : []).filter(g =>
        g.title?.toLowerCase().includes(term.toLowerCase())
      ).slice(0, 6);
      setGames(filtered);
    } catch { setGames([]); }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchGames(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm, fetchGames]);

  useEffect(() => {
    const handleKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className="relative w-full max-w-xl mx-auto" style={{fontFamily:"'DM Sans', sans-serif"}}>
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300 ${
        focused ? 'border-cyan-400/60 bg-white/[0.04]' : 'border-white/8 bg-white/[0.03]'
      }`} style={{backdropFilter:'blur(12px)'}}>
        <svg className={`w-4 h-4 flex-shrink-0 transition-colors duration-200 ${focused ? 'text-cyan-400' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search games, genres, publishers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-slate-500"
        />
        <kbd className="hidden sm:flex items-center gap-1 text-xs text-slate-500 bg-white/5 border border-white/10 rounded px-1.5 py-0.5">
          <span>⌘</span><span>K</span>
        </kbd>
      </div>

      <AnimatePresence>
        {focused && searchTerm && games.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-white/10 overflow-hidden z-50"
            style={{ background: 'rgba(8,11,20,0.97)', backdropFilter: 'blur(20px)', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
            {games.map((game, i) => (
              <motion.button key={game.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                onClick={() => { router.push(`/discover?gameId=${game.id}`); setSearchTerm(""); }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors duration-150 text-left border-b border-white/5 last:border-0">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-slate-800">
                  {game.imageUrl && <Image src={game.imageUrl} alt={game.title} fill style={{objectFit:'cover'}} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate" style={{fontFamily:"'DM Sans', sans-serif"}}>{game.title}</p>
                  <p className="text-xs text-slate-400">{game.category} • {game.price === '0' || !game.price ? 'Free' : `PKR ${game.price}`}</p>
                </div>
                <svg className="w-4 h-4 text-slate-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            ))}
            <div className="px-4 py-2 bg-white/[0.02] text-xs text-slate-500 text-center">
              Press Enter to see all results
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
