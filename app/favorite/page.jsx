"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useSession } from "../../lib/SessionContext";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Favourites = () => {
  const { user } = useSession();
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/favorites")
      .then(r => r.json())
      .then(data => { setFavorites(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleRemoveFavorite = async (id) => {
    await fetch(`/api/favorites/${id}`, { method: "DELETE" });
    setFavorites(favorites.filter(f => f.id !== id));
    toast.success("Removed from wishlist");
  };

  const handleAddToCart = async (game) => {
    if (!user) { toast.error("Please select a role first"); return; }
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: game.name, price: game.price, image: game.image, description: "" }),
      });
      if (!res.ok) throw new Error();
      toast.success("Added to cart!");
    } catch { toast.error("Error adding to cart"); }
  };

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <Navbar userEmail={user?.email} username={user?.username} />

      {/* Header */}
      <div className="relative pt-24 pb-12 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(244,63,94,0.1) 0%, transparent 70%)"
        }} />
        <div className="max-w-7xl mx-auto relative z-10">
          <p className="text-xs tracking-widest text-rose-400 uppercase mb-2" style={{ fontFamily: "var(--font-display)" }}>◆ Wishlist</p>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3" style={{ fontFamily: "var(--font-display)" }}>
            My <span style={{ background: "linear-gradient(135deg, #f43f5e, #fb923c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Wishlist</span>
          </h1>
          <p className="text-slate-400 text-sm" style={{ fontFamily: "var(--font-ui)" }}>
            {loading ? "Loading..." : `${favorites.length} game${favorites.length !== 1 ? "s" : ""} saved`}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="game-card overflow-hidden">
                <div className="aspect-video bg-white/5 animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-white/5 rounded animate-pulse" />
                  <div className="h-3 bg-white/5 rounded w-2/3 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24">
            <div className="text-6xl mb-6">💔</div>
            <h2 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-display)" }}>Your wishlist is empty</h2>
            <p className="text-slate-400 mb-8 text-sm max-w-md mx-auto" style={{ fontFamily: "var(--font-ui)" }}>
              Discover amazing games and add them to your wishlist to keep track of what you want to play next.
            </p>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={() => router.push("/Games")} className="btn-primary px-8 py-3 text-sm">
              Browse Games
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <AnimatePresence>
              {favorites.map((game, i) => (
                <motion.div key={game.id}
                  initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="game-card group cursor-pointer overflow-hidden"
                  onClick={() => router.push(`/discover?gameId=${game.gameId}`)}>
                  <div className="relative aspect-video overflow-hidden">
                    <Image src={game.image} alt={game.name} fill style={{ objectFit: "cover" }}
                      className="transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    {/* Remove heart */}
                    <button onClick={e => { e.stopPropagation(); handleRemoveFavorite(game.id); }}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 backdrop-blur-sm border border-white/10 hover:border-rose-400/40 transition-all group/heart">
                      <svg className="w-3 h-3 text-rose-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-bold text-white truncate mb-1 group-hover:text-rose-400 transition-colors" style={{ fontFamily: "var(--font-body)" }}>
                      {game.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black gradient-text-cyan" style={{ fontFamily: "var(--font-display)" }}>
                        {game.price === "0" || !game.price ? "FREE" : `PKR ${game.price}`}
                      </span>
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={e => { e.stopPropagation(); handleAddToCart(game); }}
                        className="text-xs px-3 py-1.5 rounded-lg font-bold tracking-wide transition-all"
                        style={{ background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.3)", color: "#f43f5e", fontFamily: "var(--font-display)", letterSpacing: "0.06em", fontSize: "0.6rem" }}>
                        + CART
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <Footer />
      <ToastContainer position="bottom-right" autoClose={3000} theme="dark"
        toastStyle={{ background: "var(--bg-card)", border: "1px solid rgba(244,63,94,0.2)", fontFamily: "var(--font-body)" }} />
    </div>
  );
};

export default Favourites;
