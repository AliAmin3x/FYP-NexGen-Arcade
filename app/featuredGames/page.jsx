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

const ITEMS_PER_PAGE = 20;
const GENRE_COLORS = {
  Action: "#ef4444", Adventure: "#f97316", RPG: "#8b5cf6", Strategy: "#3b82f6",
  Sports: "#10b981", Racing: "#f59e0b", Puzzle: "#ec4899", Simulation: "#14b8a6",
  "Battle Royale": "#dc2626", "Open-World": "#6366f1",
};

const FeaturedGames = () => {
  const router = useRouter();
  const { user } = useSession();
  const [games, setGames] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [spotlight, setSpotlight] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/games?type=featured&status=Approved")
      .then(r => r.json())
      .then(data => {
        const arr = Array.isArray(data) ? data : [];
        setGames(arr);
        if (arr.length > 0) setSpotlight(arr[0]);
        setLoading(false);
      })
      .catch(() => { toast.error("Error fetching games"); setLoading(false); });
  }, []);

  const handleFavourite = async (game) => {
    if (!user) { toast.error("Please select a role first"); return; }
    try {
      const isFav = favorites[game.id];
      if (isFav) {
        await fetch(`/api/favorites/${isFav}`, { method: "DELETE" });
        setFavorites(prev => { const n = { ...prev }; delete n[game.id]; return n; });
        toast.success("Removed from wishlist!");
      } else {
        const res = await fetch("/api/favorites", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gameId: game.id, name: game.title, price: game.price, image: game.imageUrl }),
        });
        const data = await res.json();
        setFavorites(prev => ({ ...prev, [game.id]: data.id }));
        toast.success("Added to wishlist!");
      }
    } catch { toast.error("Error handling wishlist!"); }
  };

  const handleAddToCart = async (game, event) => {
    if (event) event.stopPropagation();
    if (!user) { toast.error("Please select a role first"); return; }
    try {
      const res = await fetch("/api/cart", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: game.title, price: game.price, image: game.imageUrl, description: game.description }),
      });
      if (!res.ok) throw new Error();
      toast.success("Added to cart!");
    } catch { toast.error("Error adding to cart!"); }
  };

  const totalPages = Math.ceil(games.length / ITEMS_PER_PAGE);
  const paginatedGames = games.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <Navbar />

      {/* Spotlight Hero */}
      {!loading && spotlight && (
        <div className="relative h-[50vh] min-h-64 overflow-hidden">
          <Image src={spotlight.imageUrl} alt={spotlight.title} fill style={{ objectFit: "cover" }} priority />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to right, rgba(3,4,13,0.95) 30%, rgba(3,4,13,0.6) 60%, rgba(3,4,13,0.3) 100%), linear-gradient(to top, rgba(3,4,13,1) 0%, transparent 50%)"
          }} />
          <div className="absolute inset-0 flex items-end px-4 sm:px-6 pb-12">
            <div className="max-w-7xl mx-auto w-full">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                    style={{ background: "rgba(240,192,64,0.15)", border: "1px solid rgba(240,192,64,0.4)", color: "#f0c040", fontFamily: "var(--font-display)", fontSize: "0.6rem", letterSpacing: "0.15em" }}>
                    ★ SPOTLIGHT
                  </span>
                  {spotlight.category && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                      style={{ background: `${GENRE_COLORS[spotlight.category] || "#7c3aed"}22`, border: `1px solid ${GENRE_COLORS[spotlight.category] || "#7c3aed"}44`, color: GENRE_COLORS[spotlight.category] || "#7c3aed", fontFamily: "var(--font-display)", fontSize: "0.6rem", letterSpacing: "0.1em" }}>
                      {spotlight.category}
                    </span>
                  )}
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-white mb-3" style={{ fontFamily: "var(--font-display)" }}>
                  {spotlight.title}
                </h2>
                <p className="text-slate-300 text-sm mb-5 max-w-md" style={{ fontFamily: "var(--font-ui)" }}>
                  {spotlight.description?.slice(0, 120)}{spotlight.description?.length > 120 ? "..." : ""}
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black gradient-text-cyan" style={{ fontFamily: "var(--font-display)" }}>
                    PKR {spotlight.price}
                  </span>
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    onClick={() => handleAddToCart(spotlight, null)}
                    className="btn-primary px-6 py-2 text-sm">
                    Add to Cart
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    onClick={() => router.push(`/discover?gameId=${spotlight.id}`)}
                    className="btn-ghost px-6 py-2 text-sm">
                    View Details
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-6">
        <p className="text-xs tracking-widest text-amber-400 uppercase mb-2" style={{ fontFamily: "var(--font-display)" }}>◆ Hand-Picked</p>
        <h1 className="text-3xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>
          Featured <span style={{ background: "linear-gradient(135deg, #f0c040, #f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Games</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1" style={{ fontFamily: "var(--font-ui)" }}>
          {loading ? "Loading..." : `${games.length} curated titles`}
        </p>
      </div>

      {/* Games Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="game-card overflow-hidden">
                <div className="aspect-video bg-white/5 animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-white/5 rounded animate-pulse" />
                  <div className="h-3 bg-white/5 rounded w-2/3 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : paginatedGames.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">⭐</p>
            <p className="text-slate-400" style={{ fontFamily: "var(--font-body)" }}>No featured games at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <AnimatePresence>
              {paginatedGames.map((game, i) => {
                const accentColor = GENRE_COLORS[game.category] || "#f0c040";
                const isFree = !game.price || game.price === "0" || parseFloat(game.price) === 0;
                return (
                  <motion.div key={game.id}
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="game-card group cursor-pointer overflow-hidden"
                    onClick={() => { setSpotlight(game); router.push(`/discover?gameId=${game.id}`); }}>
                    <div className="relative aspect-video overflow-hidden">
                      <Image src={game.imageUrl} alt={game.title} fill style={{ objectFit: "cover" }}
                        className="transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute top-2 left-2 flex gap-1">
                        <span className="text-xs px-1.5 py-0.5 rounded font-bold"
                          style={{ background: "rgba(240,192,64,0.2)", color: "#f0c040", border: "1px solid rgba(240,192,64,0.3)", fontFamily: "var(--font-display)", fontSize: "0.5rem", letterSpacing: "0.1em" }}>
                          ★
                        </span>
                        {game.category && (
                          <span className="text-xs px-1.5 py-0.5 rounded font-bold"
                            style={{ background: `${accentColor}22`, color: accentColor, border: `1px solid ${accentColor}44`, fontFamily: "var(--font-display)", fontSize: "0.55rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                            {game.category}
                          </span>
                        )}
                      </div>
                      <button onClick={e => { e.stopPropagation(); handleFavourite(game); }}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 hover:border-amber-400/40 transition-all">
                        {favorites[game.id] ? <AiFillHeart size={12} className="text-amber-400" /> : <AiOutlineHeart size={12} className="text-white/60" />}
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }} />
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-bold text-white truncate mb-2 group-hover:text-amber-400 transition-colors" style={{ fontFamily: "var(--font-body)" }}>
                        {game.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-black ${isFree ? "text-emerald-400" : "gradient-text-cyan"}`} style={{ fontFamily: "var(--font-display)" }}>
                          {isFree ? "FREE" : `PKR ${game.price}`}
                        </span>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          onClick={e => handleAddToCart(game, e)}
                          className="text-xs px-3 py-1.5 rounded-lg font-bold tracking-wide transition-all"
                          style={{ background: "rgba(240,192,64,0.1)", border: "1px solid rgba(240,192,64,0.3)", color: "#f0c040", fontFamily: "var(--font-display)", letterSpacing: "0.06em", fontSize: "0.6rem" }}>
                          {isFree ? "GET" : "BUY"}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}
              className="btn-ghost px-4 py-2 text-xs disabled:opacity-30">← Prev</button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setCurrentPage(p)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${currentPage === p ? "bg-amber-400 text-black" : "bg-white/5 text-slate-400 hover:bg-white/10"}`}>
                {p}
              </button>
            ))}
            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}
              className="btn-ghost px-4 py-2 text-xs disabled:opacity-30">Next →</button>
          </div>
        )}
      </div>

      <Footer />
      <ToastContainer position="bottom-right" autoClose={3000} theme="dark"
        toastStyle={{ background: "var(--bg-card)", border: "1px solid rgba(240,192,64,0.2)", fontFamily: "var(--font-body)" }} />
    </div>
  );
};

export default FeaturedGames;
