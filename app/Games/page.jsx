"use client";
import React, { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useSession } from "../../lib/SessionContext";

const CATEGORIES = ["All", "Action", "Adventure", "Puzzle", "Simulation", "Sports", "RPG", "Racing", "Strategy", "Open-World", "Battle Royale"];
const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A-Z' },
  { value: 'name_desc', label: 'Name: Z-A' },
];
const ITEMS_PER_PAGE = 20;

const GENRE_COLORS = {
  Action:'#ef4444', Adventure:'#f97316', RPG:'#8b5cf6', Strategy:'#3b82f6',
  Sports:'#10b981', Racing:'#f59e0b', Puzzle:'#ec4899', Simulation:'#14b8a6',
  'Battle Royale':'#dc2626', 'Open-World':'#6366f1', default:'#00d4ff'
};

const GameGrid = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useSession();
  const [games, setGames] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || "All");
  const [sort, setSort] = useState('default');
  const [view, setView] = useState('grid');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ status: "Approved" });
    if (selectedCategory !== "All") params.set("category", selectedCategory);
    fetch(`/api/games?${params}`)
      .then(r => r.json())
      .then(data => {
        let arr = Array.isArray(data) ? data : [];
        if (selectedCategory !== "All") arr = arr.filter(g => g.category === selectedCategory);
        setGames(arr);
        setFavorites(arr.map(() => false));
        setCurrentPage(1);
      })
      .catch(() => toast.error("Error fetching games"))
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  const sortedGames = [...games].sort((a, b) => {
    if (sort === 'price_asc') return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);
    if (sort === 'price_desc') return (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0);
    if (sort === 'name_asc') return a.title?.localeCompare(b.title);
    if (sort === 'name_desc') return b.title?.localeCompare(a.title);
    return 0;
  });

  const handleFav = async (game) => {
    if (!user) { toast.error("Please select a role first"); return; }
    try {
      const isFav = favorites[game.id];
      if (isFav) {
        await fetch(`/api/favorites/${isFav}`, { method: "DELETE" });
        setFavorites(p => { const n = { ...p }; delete n[game.id]; return n; });
        toast.success("Removed from wishlist!");
      } else {
        const res = await fetch("/api/favorites", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gameId: game.id, name: game.title, price: game.price, image: game.imageUrl }),
        });
        const d = await res.json();
        setFavorites(p => ({ ...p, [game.id]: d.id }));
        toast.success("Added to wishlist!");
      }
    } catch { toast.error("Error handling wishlist!"); }
  };

  const handleCart = async (game, e) => {
    e.stopPropagation();
    if (!user) { toast.error("Please select a role first"); return; }
    try {
      const res = await fetch("/api/cart", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: game.title, price: game.price, image: game.imageUrl, description: game.description }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success("Added to cart!");
    } catch { toast.error("Error adding to cart!"); }
  };

  const totalPages = Math.ceil(sortedGames.length / ITEMS_PER_PAGE);
  const paginatedGames = sortedGames.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div>
      {/* Page header */}
      <div className="pt-24 pb-8 px-4 sm:px-6" style={{background:'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)'}}>
        <div className="max-w-7xl mx-auto">
          <p className="text-xs tracking-widest text-cyan-400 uppercase mb-2" style={{fontFamily:'var(--font-display)'}}>◆ Game Store</p>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2" style={{fontFamily:'var(--font-display)'}}>All Games</h1>
          <p className="text-slate-400 text-sm" style={{fontFamily:'var(--font-ui)'}}>
            {loading ? 'Loading...' : `${sortedGames.length} games available`}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-16 z-30 border-b border-white/5" style={{ background: 'rgba(8,11,20,0.95)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Category tabs */}
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-none" style={{scrollbarWidth:'none'}}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-cyan-400 text-black'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                style={{fontFamily:'var(--font-display)', letterSpacing:'0.06em', textTransform:'uppercase', fontSize:'0.65rem'}}>
                {cat}
              </button>
            ))}
          </div>

          {/* Sort + view */}
          <div className="flex items-center justify-between pb-3 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 flex-shrink-0" style={{fontFamily:'var(--font-ui)'}}>Sort by:</span>
              <select value={sort} onChange={e => setSort(e.target.value)}
                className="text-xs rounded-lg px-3 py-1.5 outline-none"
                style={{background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'#fff', fontFamily:'var(--font-ui)'}}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value} style={{background:'#0d1220'}}>{o.label}</option>)}
              </select>
            </div>
            <div className="flex gap-1">
              {['grid','list'].map(v => (
                <button key={v} onClick={() => setView(v)}
                  className={`p-1.5 rounded-lg transition-all duration-200 ${view === v ? 'bg-cyan-400/20 text-cyan-400' : 'text-slate-500 hover:text-white'}`}>
                  {v === 'grid'
                    ? <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                    : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Games */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className={`grid ${view === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'grid-cols-1'} gap-4`}>
            {Array.from({length: 10}).map((_, i) => (
              <div key={i} className="game-card overflow-hidden">
                <div className="aspect-video bg-white/5 animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-white/5 rounded animate-pulse" />
                  <div className="h-3 bg-white/5 rounded w-2/3 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : paginatedGames.length > 0 ? (
          <div className={`grid gap-4 ${view === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'grid-cols-1 sm:grid-cols-2'}`}>
            <AnimatePresence>
              {paginatedGames.map((game, i) => {
                const isFree = !game.price || game.price === '0' || parseFloat(game.price) === 0;
                const accentColor = GENRE_COLORS[game.category] || GENRE_COLORS.default;
                return (
                  <motion.div key={game.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                    className="game-card group cursor-pointer"
                    onClick={() => router.push(`/discover?gameId=${game.id}`)}>
                    <div className="relative aspect-video overflow-hidden">
                      <Image src={game.imageUrl} alt={game.title} fill style={{ objectFit: 'cover' }}
                        className="transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute top-2 left-2 flex gap-1">
                        {isFree && <span className="free-badge">Free</span>}
                        {game.category && (
                          <span className="text-xs px-1.5 py-0.5 rounded font-bold" style={{
                            background: `${accentColor}22`, color: accentColor,
                            border: `1px solid ${accentColor}44`,
                            fontFamily:'var(--font-display)', fontSize:'0.55rem', letterSpacing:'0.1em', textTransform:'uppercase'
                          }}>{game.category}</span>
                        )}
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); handleFav(game); }}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 hover:border-pink-400/40 transition-all">
                        {favorites[game.id] ? <AiFillHeart size={12} className="text-pink-400" /> : <AiOutlineHeart size={12} className="text-white/60" />}
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{background:`linear-gradient(90deg, transparent, ${accentColor}, transparent)`}} />
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-bold text-white truncate mb-2 group-hover:text-cyan-400 transition-colors" style={{fontFamily:'var(--font-body)'}}>
                        {game.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-black ${isFree ? 'text-emerald-400' : 'gradient-text-cyan'}`} style={{fontFamily:'var(--font-display)'}}>
                          {isFree ? 'FREE' : `PKR ${game.price}`}
                        </span>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          onClick={(e) => handleCart(game, e)}
                          className="text-xs px-3 py-1.5 rounded-lg font-bold tracking-wide transition-all"
                          style={{
                            background:'rgba(0,212,255,0.1)', border:'1px solid rgba(0,212,255,0.3)',
                            color:'#00d4ff', fontFamily:'var(--font-display)', letterSpacing:'0.06em', fontSize:'0.6rem'
                          }}>
                          {isFree ? 'GET' : 'BUY'}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🎮</p>
            <p className="text-slate-400" style={{fontFamily:'var(--font-body)'}}>No games in this category yet.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}
              className="btn-ghost px-4 py-2 text-xs disabled:opacity-30">← Prev</button>
            {Array.from({length: Math.min(totalPages, 7)}, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setCurrentPage(p)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${currentPage === p ? 'bg-cyan-400 text-black' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                style={{fontFamily:'var(--font-display)'}}>
                {p}
              </button>
            ))}
            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}
              className="btn-ghost px-4 py-2 text-xs disabled:opacity-30">Next →</button>
          </div>
        )}
      </div>
    </div>
  );
};

const AllGames = () => {
  const { user } = useSession();
  return (
    <div style={{background:'var(--bg-primary)', minHeight:'100vh'}}>
      <Navbar />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-cyan-400" style={{fontFamily:'var(--font-display)'}}>LOADING...</div></div>}>
        <GameGrid />
      </Suspense>
      <Footer />
      <ToastContainer position="bottom-right" autoClose={3000} theme="dark"
        toastStyle={{ background: 'var(--bg-card)', border: '1px solid rgba(0,212,255,0.2)', fontFamily: 'var(--font-body)' }} />
    </div>
  );
};

export default AllGames;
