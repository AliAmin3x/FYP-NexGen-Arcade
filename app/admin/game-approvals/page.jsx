"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Footer from "../../../components/Footer";

const ADMIN_NAV = [
  { href: "/admin/game-approvals", label: "Game Approvals", icon: "🎮" },
  { href: "/admin/revenues", label: "Revenues", icon: "💰" },
];

const GameApprovals = () => {
  const pathname = usePathname();
  const [games, setGames] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState({});

  useEffect(() => {
    fetch("/api/games?status=Pending")
      .then(r => r.json())
      .then(data => { setGames(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setError("Failed to fetch games"); setLoading(false); });
  }, []);

  const handleApprove = async (id) => {
    setProcessing(p => ({ ...p, [id]: "approving" }));
    await fetch(`/api/games/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "Approved" }) });
    setGames(games.filter(g => g.id !== id));
    setProcessing(p => { const n = { ...p }; delete n[id]; return n; });
  };

  const handleReject = async (id) => {
    setProcessing(p => ({ ...p, [id]: "rejecting" }));
    await fetch(`/api/games/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "Rejected" }) });
    setGames(games.filter(g => g.id !== id));
    setProcessing(p => { const n = { ...p }; delete n[id]; return n; });
  };

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      {/* Admin Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5"
        style={{ background: "rgba(3,4,13,0.97)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link href="/admin/game-approvals">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded relative overflow-hidden">
                <Image src="/logo.png" alt="NexGen" fill style={{ objectFit: "contain" }} />
              </div>
              <span className="font-black text-white" style={{ fontFamily: "var(--font-display)", fontSize: "1rem", letterSpacing: "0.1em" }}>
                NEXGEN <span className="text-red-400">ADMIN</span>
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <span className="text-xs text-slate-400" style={{ fontFamily: "var(--font-mono)" }}>admin@nexgen.com</span>
          </div>
        </div>
      </nav>

      <div className="flex pt-16 min-h-screen">
        {/* Sidebar */}
        <aside className="w-56 flex-shrink-0 border-r border-white/5 pt-8 px-3" style={{ background: "rgba(6,7,20,0.8)" }}>
          <p className="text-xs text-slate-600 uppercase tracking-widest px-3 mb-3" style={{ fontFamily: "var(--font-display)" }}>Navigation</p>
          <nav className="space-y-1">
            {ADMIN_NAV.map(item => (
              <Link key={item.href} href={item.href}>
                <motion.div whileHover={{ x: 3 }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    pathname === item.href
                      ? "bg-red-400/10 border border-red-400/20"
                      : "hover:bg-white/5 border border-transparent"
                  }`}>
                  <span>{item.icon}</span>
                  <span className={`text-sm font-semibold ${pathname === item.href ? "text-red-400" : "text-white"}`}
                    style={{ fontFamily: "var(--font-body)" }}>{item.label}</span>
                </motion.div>
              </Link>
            ))}
          </nav>

          {/* Stats */}
          <div className="mt-8 px-3">
            <div className="game-card p-3 text-center">
              <p className="text-2xl font-black text-amber-400" style={{ fontFamily: "var(--font-display)" }}>
                {loading ? "..." : games.length}
              </p>
              <p className="text-xs text-slate-500" style={{ fontFamily: "var(--font-ui)" }}>Pending Review</p>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 px-6 py-8">
          <div className="max-w-4xl">
            <div className="mb-8">
              <p className="text-xs tracking-widest text-red-400 uppercase mb-2" style={{ fontFamily: "var(--font-display)" }}>◆ Moderation Queue</p>
              <h1 className="text-3xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>Game Approvals</h1>
              <p className="text-slate-400 text-sm mt-1" style={{ fontFamily: "var(--font-ui)" }}>
                Review and approve or reject developer-submitted games
              </p>
            </div>

            {error && (
              <div className="p-4 rounded-xl mb-6 text-sm"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", fontFamily: "var(--font-body)" }}>
                {error}
              </div>
            )}

            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="game-card p-5 flex gap-4">
                    <div className="w-32 h-20 bg-white/5 rounded-lg animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-white/5 rounded animate-pulse w-1/3" />
                      <div className="h-3 bg-white/5 rounded animate-pulse w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : games.length === 0 && !error ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
                <p className="text-5xl mb-4">✅</p>
                <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-display)" }}>All Clear!</h2>
                <p className="text-slate-400 text-sm" style={{ fontFamily: "var(--font-ui)" }}>No games are pending review right now.</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {games.map((game, i) => (
                    <motion.div key={game.id}
                      initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 40, height: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.3 }}
                      className="game-card p-5 flex flex-col sm:flex-row gap-4">
                      <div className="relative w-full sm:w-40 h-28 rounded-xl overflow-hidden flex-shrink-0">
                        <Image src={game.imageUrl} alt={game.title} fill style={{ objectFit: "cover" }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        {game.category && (
                          <div className="absolute bottom-2 left-2">
                            <span className="text-xs px-1.5 py-0.5 rounded font-bold"
                              style={{ background: "rgba(0,0,0,0.6)", color: "#e2e8f0", fontFamily: "var(--font-display)", fontSize: "0.55rem", letterSpacing: "0.1em" }}>
                              {game.category}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-body)" }}>{game.title}</h3>
                          <span className="flex-shrink-0 text-xs px-2 py-1 rounded-lg font-bold"
                            style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", color: "#f59e0b", fontFamily: "var(--font-display)", fontSize: "0.6rem", letterSpacing: "0.1em" }}>
                            ⏳ PENDING
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 mb-3 line-clamp-2" style={{ fontFamily: "var(--font-ui)" }}>
                          {game.description || "No description provided."}
                        </p>
                        <div className="flex items-center gap-4 mb-4">
                          <span className="text-sm font-black gradient-text-cyan" style={{ fontFamily: "var(--font-display)" }}>
                            PKR {game.price}
                          </span>
                          {game.developerEmail && (
                            <span className="text-xs text-slate-500" style={{ fontFamily: "var(--font-mono)" }}>
                              by {game.developerEmail}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <motion.button
                            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                            onClick={() => handleApprove(game.id)}
                            disabled={!!processing[game.id]}
                            className="px-5 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50 flex items-center gap-2"
                            style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981", fontFamily: "var(--font-display)", letterSpacing: "0.06em" }}>
                            {processing[game.id] === "approving" ? (
                              <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                            ) : "✓"} APPROVE
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                            onClick={() => handleReject(game.id)}
                            disabled={!!processing[game.id]}
                            className="px-5 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50 flex items-center gap-2"
                            style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", fontFamily: "var(--font-display)", letterSpacing: "0.06em" }}>
                            {processing[game.id] === "rejecting" ? (
                              <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                            ) : "✕"} REJECT
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default GameApprovals;
