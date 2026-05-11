"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Image from "next/image";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from "../../lib/SessionContext";

const GENRE_COLORS = {
  Action: "#ef4444", Adventure: "#f97316", RPG: "#8b5cf6", Strategy: "#3b82f6",
  Sports: "#10b981", Racing: "#f59e0b", Puzzle: "#ec4899", Simulation: "#14b8a6",
  "Battle Royale": "#dc2626", "Open-World": "#6366f1", default: "#00d4ff"
};

const DiscoverClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gameId = searchParams.get("gameId");
  const { user } = useSession();
  const [gameDetails, setGameDetails] = useState(null);
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!gameId) return;
    fetch(`/api/games/${gameId}`)
      .then(r => r.json())
      .then(data => { if (!data.error) setGameDetails(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [gameId]);

  const handleAddToCart = async () => {
    if (!user) { toast.error("Please select a role first"); return; }
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: gameDetails.title, price: gameDetails.price, image: gameDetails.imageUrl, description: gameDetails.description }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success("Added to cart!");
    } catch (e) { toast.error("Error adding to cart: " + e.message); }
  };

  const handleFav = async () => {
    if (!user) { toast.error("Please select a role first"); return; }
    setIsFav(!isFav);
    toast.success(isFav ? "Removed from wishlist" : "Added to wishlist!");
  };

  if (loading) {
    return (
      <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-400 text-sm" style={{ fontFamily: "var(--font-body)" }}>Loading game details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!gameDetails) {
    return (
      <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-5xl mb-4">🎮</p>
            <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-display)" }}>Game Not Found</h2>
            <p className="text-slate-400 mb-6 text-sm" style={{ fontFamily: "var(--font-ui)" }}>This game may have been removed or doesn't exist.</p>
            <button onClick={() => router.push("/Games")} className="btn-primary px-6 py-2.5 text-sm">Browse All Games</button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const accentColor = GENRE_COLORS[gameDetails.category] || GENRE_COLORS.default;
  const isFree = !gameDetails.price || gameDetails.price === "0" || parseFloat(gameDetails.price) === 0;

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero Image */}
      <div className="relative h-[45vh] min-h-64 overflow-hidden">
        <Image src={gameDetails.imageUrl} alt={gameDetails.title} fill style={{ objectFit: "cover" }} priority />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to top, rgba(3,4,13,1) 0%, rgba(3,4,13,0.5) 40%, rgba(3,4,13,0.1) 100%)"
        }} />
        {/* Accent line at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: `linear-gradient(to right, transparent, ${accentColor}80, transparent)` }} />
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-20 relative z-10 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Info */}
          <div className="flex-1">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {isFree && <span className="free-badge">FREE</span>}
                {gameDetails.category && (
                  <span className="text-xs px-2.5 py-1 rounded-lg font-bold"
                    style={{ background: `${accentColor}22`, color: accentColor, border: `1px solid ${accentColor}44`, fontFamily: "var(--font-display)", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    {gameDetails.category}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-4" style={{ fontFamily: "var(--font-display)", lineHeight: 1.1 }}>
                {gameDetails.title}
              </h1>

              {/* Publisher */}
              <div className="flex items-center gap-4 mb-6 text-sm text-slate-400" style={{ fontFamily: "var(--font-ui)" }}>
                <span>By <span className="text-white font-semibold">NexGen Developer</span></span>
                <span className="text-slate-600">·</span>
                <span>{gameDetails.category || "Game"}</span>
              </div>

              {/* Description */}
              <div className="game-card p-5 mb-6">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-display)" }}>About This Game</h3>
                <p className="text-sm text-slate-300 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                  {gameDetails.description || "An amazing gaming experience awaits. Dive into this incredible world and discover everything it has to offer."}
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Platform", value: "PC / Console" },
                  { label: "Genre", value: gameDetails.category || "Game" },
                  { label: "Release", value: "2024" },
                ].map(item => (
                  <div key={item.label} className="game-card p-3 text-center">
                    <p className="text-xs text-slate-500 mb-1" style={{ fontFamily: "var(--font-ui)" }}>{item.label}</p>
                    <p className="text-sm font-bold text-white" style={{ fontFamily: "var(--font-body)" }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Purchase Card */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="lg:w-72 flex-shrink-0">
            <div className="game-card p-5 sticky top-24">
              <div className="relative aspect-video overflow-hidden rounded-xl mb-4">
                <Image src={gameDetails.imageUrl} alt={gameDetails.title} fill style={{ objectFit: "cover" }} />
                <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${accentColor}20, transparent)` }} />
              </div>

              <div className="mb-5">
                <p className="text-xs text-slate-500 mb-1" style={{ fontFamily: "var(--font-ui)" }}>Price</p>
                <p className={`text-3xl font-black ${isFree ? "text-emerald-400" : "gradient-text-cyan"}`} style={{ fontFamily: "var(--font-display)" }}>
                  {isFree ? "FREE" : `PKR ${gameDetails.price}`}
                </p>
              </div>

              <div className="space-y-3">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={handleAddToCart}
                  className="w-full btn-primary py-3 text-sm font-bold flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {isFree ? "CLAIM FREE" : "ADD TO CART"}
                </motion.button>

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={handleFav}
                  className="w-full btn-ghost py-3 text-sm font-bold flex items-center justify-center gap-2">
                  {isFav ? <AiFillHeart className="text-rose-400" size={16} /> : <AiOutlineHeart size={16} />}
                  {isFav ? "IN WISHLIST" : "ADD TO WISHLIST"}
                </motion.button>
              </div>

              {/* Trust Badges */}
              <div className="mt-5 pt-4 border-t border-white/5 space-y-2">
                {["Secure checkout", "Instant delivery", "Money-back guarantee"].map(item => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-emerald-400" />
                    <span className="text-xs text-slate-400" style={{ fontFamily: "var(--font-ui)" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
      <ToastContainer position="bottom-right" autoClose={3000} theme="dark"
        toastStyle={{ background: "var(--bg-card)", border: "1px solid rgba(0,212,255,0.2)", fontFamily: "var(--font-body)" }} />
    </div>
  );
};

export default DiscoverClient;
