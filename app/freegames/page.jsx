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

const FreeGames = () => {
  const router = useRouter();
  const { user } = useSession();
  const [games, setGames] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/games?type=free&status=Approved")
      .then(r => r.json())
      .then(data => { setGames(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { toast.error("Error fetching free games"); setLoading(false); });
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
    event.stopPropagation();
    if (!user) { toast.error("Please select a role first"); return; }
    try {
      const res = await fetch("/api/cart", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: game.title, price: game.price, image: game.imageUrl, description: game.description }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success("Added to library!");
    } catch { toast.error("Error claiming game!"); }
  };

  const totalPages = Math.ceil(games.length / ITEMS_PER_PAGE);
  const paginatedGames = games.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero Header */}
      <div className="relative pt-24 pb-12 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(16,185,129,0.1) 0%, transparent 70%)"
        }} />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <p className="text-xs tracking-widest text-emerald-400 uppercase" style={{ fontFamily: "var(--font-display)" }}>◆ No Cost</p>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold animate-pulse" style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981", fontFamily: "var(--font-display)", fontSize: "0.6rem", letterSpacing: "0.1em" }}>
              LIMITED TIME
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3" style={{ fontFamily: "var(--font-display)" }}>
            Free <span style={{ background: "linear-gradient(135deg, #10b981, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Games</span>
          </h1>
          <p className="text-slate-400 text-sm max-w-lg" style={{ fontFamily: "var(--font-ui)" }}>
            Claim these games for free and keep them in your library forever. No strings attached.
          </p>
          {!loading && (
            <div className="flex items-center gap-2 mt-4">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-400" style={{ fontFamily: "var(--font-mono)" }}>
                {games.length} free games available
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Games */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="game-card overflow-hidden">
                <div className="aspect-video bg-white/5 animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-white/5 rounded animate-pulse" />
                  <div className="h-6 bg-white/5 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : paginatedGames.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🎁</p>
            <p className="text-slate-400" style={{ fontFamily: "var(--font-body)" }}>No free games available right now. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <AnimatePresence>
              {paginatedGames.map((game, i) => (
                <motion.div key={game.id}
                  initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="game-card group cursor-pointer overflow-hidden"
                  onClick={() => router.push(`/discover?gameId=${game.id}`)}>
                  <div className="relative aspect-video overflow-hidden">
                    <Image src={game.imageUrl} alt={game.title} fill style={{ objectFit: "cover" }}
                      className="transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    {/* Free badge */}
                    <div className="absolute top-2 left-2">
                      <span className="free-badge">FREE</span>
                    </div>
                    {/* Wishlist */}
                    <button onClick={e => { e.stopPropagation(); handleFavourite(game); }}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 hover:border-emerald-400/40 transition-all">
                      {favorites[game.id]
                        ? <AiFillHeart size={12} className="text-emerald-400" />
                        : <AiOutlineHeart size={12} className="text-white/60" />}
                    </button>
                    {/* Bottom glow */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: "linear-gradient(90deg, transparent, #10b981, transparent)" }} />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-bold text-white truncate mb-2 group-hover:text-emerald-400 transition-colors" style={{ fontFamily: "var(--font-body)" }}>
                      {game.title}
                    </h3>
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                      onClick={e => handleAddToCart(game, e)}
                      className="w-full text-xs py-1.5 rounded-lg font-bold tracking-wide transition-all"
                      style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981", fontFamily: "var(--font-display)", letterSpacing: "0.06em", fontSize: "0.65rem" }}>
                      CLAIM FREE
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}
              className="btn-ghost px-4 py-2 text-xs disabled:opacity-30">← Prev</button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setCurrentPage(p)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${currentPage === p ? "bg-emerald-400 text-black" : "bg-white/5 text-slate-400 hover:bg-white/10"}`}>
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
        toastStyle={{ background: "var(--bg-card)", border: "1px solid rgba(16,185,129,0.2)", fontFamily: "var(--font-body)" }} />
    </div>
  );
};

export default FreeGames;
