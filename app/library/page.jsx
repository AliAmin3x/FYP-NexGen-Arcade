"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useSession } from "../../lib/SessionContext";

const STATIC_LIBRARY = [
  { id: "lib1", title: "Cyberpunk 2077", imageUrl: "/img1.jpg", category: "RPG", price: "1499", playtime: "47h", lastPlayed: "2 days ago", size: "70 GB" },
  { id: "lib2", title: "Tomb Raider", imageUrl: "/img2.jpg", category: "Adventure", price: "1099", playtime: "22h", lastPlayed: "1 week ago", size: "25 GB" },
  { id: "lib3", title: "Days Gone", imageUrl: "/img3.jpg", category: "Action", price: "1499", playtime: "38h", lastPlayed: "3 days ago", size: "32 GB" },
  { id: "lib4", title: "Marvel's Spider-Man 2", imageUrl: "/img4.jpg", category: "Action", price: "999", playtime: "15h", lastPlayed: "Yesterday", size: "58 GB" },
  { id: "lib5", title: "Spider-Man: Miles Morales", imageUrl: "/img5.jpg", category: "Action", price: "1499", playtime: "12h", lastPlayed: "5 days ago", size: "50 GB" },
  { id: "lib6", title: "The Last of Us", imageUrl: "/img6.jpg", category: "Adventure", price: "1699", playtime: "19h", lastPlayed: "2 weeks ago", size: "72 GB" },
  { id: "lib7", title: "God of War", imageUrl: "/img7.jpg", category: "Action", price: "1399", playtime: "30h", lastPlayed: "4 days ago", size: "45 GB" },
  { id: "lib8", title: "Elden Ring", imageUrl: "/img8.jpg", category: "RPG", price: "1499", playtime: "88h", lastPlayed: "Today", size: "44 GB" },
];

const GENRE_COLORS = {
  Action: "#ef4444", Adventure: "#f97316", RPG: "#8b5cf6", Strategy: "#3b82f6",
  Sports: "#10b981", Racing: "#f59e0b", Puzzle: "#ec4899", Simulation: "#14b8a6",
};

const Library = () => {
  const { user } = useSession();
  const router = useRouter();
  const [favorites, setFavorites] = useState({});
  const [search, setSearch] = useState("");
  const [view, setView] = useState("grid");
  const [sortBy, setSortBy] = useState("lastPlayed");

  const filtered = STATIC_LIBRARY
    .filter(g => g.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "name") return a.title.localeCompare(b.title);
      if (sortBy === "playtime") return parseInt(b.playtime) - parseInt(a.playtime);
      return 0;
    });

  const totalPlaytime = STATIC_LIBRARY.reduce((sum, g) => sum + parseInt(g.playtime), 0);

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero Header */}
      <div className="relative pt-24 pb-12 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124,58,237,0.12) 0%, transparent 70%)"
        }} />
        <div className="max-w-7xl mx-auto relative z-10">
          <p className="text-xs tracking-widest text-violet-400 uppercase mb-2" style={{ fontFamily: "var(--font-display)" }}>◆ My Collection</p>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3" style={{ fontFamily: "var(--font-display)" }}>
            Game <span className="gradient-ice">Library</span>
          </h1>
          {/* Stats Row */}
          <div className="flex flex-wrap gap-6 mt-6">
            {[
              { label: "Games Owned", value: STATIC_LIBRARY.length, accent: "#7c3aed" },
              { label: "Total Playtime", value: `${totalPlaytime}h`, accent: "#06b6d4" },
              { label: "Recent Plays", value: "4", accent: "#10b981" },
            ].map(stat => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="w-1 h-8 rounded-full" style={{ background: stat.accent }} />
                <div>
                  <p className="text-xl font-black" style={{ fontFamily: "var(--font-display)", color: stat.accent }}>{stat.value}</p>
                  <p className="text-xs text-slate-500" style={{ fontFamily: "var(--font-ui)" }}>{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="sticky top-16 z-30 border-b border-white/5" style={{ background: "rgba(3,4,13,0.95)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-48 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text" placeholder="Search your library..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg outline-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", fontFamily: "var(--font-ui)" }}
            />
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="text-xs rounded-lg px-3 py-2 outline-none"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", fontFamily: "var(--font-ui)" }}>
            <option value="lastPlayed" style={{ background: "#0d1220" }}>Last Played</option>
            <option value="name" style={{ background: "#0d1220" }}>Name A-Z</option>
            <option value="playtime" style={{ background: "#0d1220" }}>Most Played</option>
          </select>
          <div className="flex gap-1">
            {["grid", "list"].map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`p-2 rounded-lg transition-all ${view === v ? "bg-violet-400/20 text-violet-400" : "text-slate-500 hover:text-white"}`}>
                {v === "grid"
                  ? <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                  : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>}
              </button>
            ))}
          </div>
          <span className="text-xs text-slate-500 ml-auto" style={{ fontFamily: "var(--font-ui)" }}>{filtered.length} games</span>
        </div>
      </div>

      {/* Games Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">📚</p>
            <p className="text-slate-400" style={{ fontFamily: "var(--font-body)" }}>No games match your search.</p>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence>
              {filtered.map((game, i) => {
                const accentColor = GENRE_COLORS[game.category] || "#00d4ff";
                return (
                  <motion.div key={game.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="game-card group cursor-pointer overflow-hidden">
                    <div className="relative aspect-video overflow-hidden">
                      <Image src={game.imageUrl} alt={game.title} fill style={{ objectFit: "cover" }}
                        className="transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute top-2 left-2">
                        <span className="text-xs px-1.5 py-0.5 rounded font-bold"
                          style={{ background: `${accentColor}22`, color: accentColor, border: `1px solid ${accentColor}44`, fontFamily: "var(--font-display)", fontSize: "0.55rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                          {game.category}
                        </span>
                      </div>
                      {/* Last played badge */}
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                        <span className="text-xs text-white/60" style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem" }}>{game.lastPlayed}</span>
                        <span className="text-xs font-bold" style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: accentColor }}>{game.playtime}</span>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-bold text-white truncate mb-2 group-hover:text-violet-400 transition-colors" style={{ fontFamily: "var(--font-body)" }}>
                        {game.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                          className="flex-1 text-xs py-1.5 rounded-lg font-bold tracking-wide transition-all flex items-center justify-center gap-1"
                          style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", color: "#7c3aed", fontFamily: "var(--font-display)", letterSpacing: "0.06em", fontSize: "0.6rem" }}>
                          ▶ PLAY
                        </motion.button>
                        <button className="p-1.5 rounded-lg text-slate-500 hover:text-white/60 transition-colors border border-white/5"
                          style={{ fontFamily: "var(--font-display)", fontSize: "0.6rem" }}>
                          ⋯
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((game, i) => {
              const accentColor = GENRE_COLORS[game.category] || "#00d4ff";
              return (
                <motion.div key={game.id} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="game-card p-4 flex items-center gap-4 group cursor-pointer hover:bg-white/5 transition-colors">
                  <div className="relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={game.imageUrl} alt={game.title} fill style={{ objectFit: "cover" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white truncate group-hover:text-violet-400 transition-colors" style={{ fontFamily: "var(--font-body)" }}>{game.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: `${accentColor}22`, color: accentColor, fontFamily: "var(--font-display)", fontSize: "0.55rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>{game.category}</span>
                      <span className="text-xs text-slate-500" style={{ fontFamily: "var(--font-mono)" }}>{game.playtime} played</span>
                      <span className="text-xs text-slate-600" style={{ fontFamily: "var(--font-mono)" }}>{game.size}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-slate-500 mb-1" style={{ fontFamily: "var(--font-ui)" }}>{game.lastPlayed}</p>
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                      className="text-xs px-4 py-1.5 rounded-lg font-bold"
                      style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", color: "#7c3aed", fontFamily: "var(--font-display)", letterSpacing: "0.06em", fontSize: "0.6rem" }}>
                      ▶ PLAY
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
      <ToastContainer position="bottom-right" autoClose={3000} theme="dark"
        toastStyle={{ background: "var(--bg-card)", border: "1px solid rgba(124,58,237,0.2)", fontFamily: "var(--font-body)" }} />
    </div>
  );
};

export default Library;
