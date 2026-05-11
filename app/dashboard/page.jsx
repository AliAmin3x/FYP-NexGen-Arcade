"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "../../lib/SessionContext";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: "📊", desc: "Your stats" },
  { href: "/dashboard/upload", label: "Upload Game", icon: "⬆️", desc: "Add new game" },
  { href: "/dashboard/games", label: "Manage Games", icon: "🎮", desc: "Edit or delete" },
];

const STATUS_CONFIG = {
  Approved: { color: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.3)" },
  Pending: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.3)" },
  Rejected: { color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.3)" },
};

const Dashboard = () => {
  const { user } = useSession();
  const pathname = usePathname();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/games")
      .then(r => r.json())
      .then(data => { setGames(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const approved = games.filter(g => g.status === "Approved").length;
  const pending = games.filter(g => g.status === "Pending").length;
  const totalRevenue = games.filter(g => g.status === "Approved").reduce((s, g) => s + (parseFloat(g.price) || 0), 0);

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <Navbar userEmail={user?.email} username={user?.username} />

      {/* Header */}
      <div className="relative pt-24 pb-8 px-4 sm:px-6 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(105,51,255,0.08) 0%, transparent 70%)"
        }} />
        <div className="max-w-6xl mx-auto">
          <p className="text-xs tracking-widest text-violet-400 uppercase mb-2" style={{ fontFamily: "var(--font-display)" }}>◆ Developer</p>
          <h1 className="text-3xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>Developer Dashboard</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="md:w-56 flex-shrink-0">
            <div className="game-card overflow-hidden">
              <div className="p-5 border-b border-white/5">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-3"
                  style={{ background: "linear-gradient(135deg, rgba(105,51,255,0.2), rgba(124,58,237,0.2))", border: "1px solid rgba(105,51,255,0.3)" }}>
                  ⚙️
                </div>
                <p className="text-sm font-bold text-white" style={{ fontFamily: "var(--font-body)" }}>{user?.username || "Developer"}</p>
                <p className="text-xs text-slate-500" style={{ fontFamily: "var(--font-mono)" }}>Developer Account</p>
              </div>
              <nav className="p-2">
                {NAV_ITEMS.map(item => (
                  <Link key={item.href} href={item.href}>
                    <motion.div whileHover={{ x: 2 }}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all ${
                        pathname === item.href
                          ? "bg-violet-400/10 border border-violet-400/20"
                          : "hover:bg-white/5 border border-transparent"
                      }`}>
                      <span className="text-base">{item.icon}</span>
                      <div>
                        <p className={`text-sm font-semibold ${pathname === item.href ? "text-violet-400" : "text-white"}`}
                          style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem" }}>{item.label}</p>
                        <p className="text-xs text-slate-600" style={{ fontFamily: "var(--font-ui)", fontSize: "0.65rem" }}>{item.desc}</p>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Total Games", value: games.length, color: "#7c3aed", icon: "🎮" },
                { label: "Live Games", value: approved, color: "#10b981", icon: "✅" },
                { label: "Pending", value: pending, color: "#f59e0b", icon: "⏳" },
              ].map(stat => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="game-card p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xl">{stat.icon}</span>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: stat.color }} />
                  </div>
                  <p className="text-2xl font-black" style={{ fontFamily: "var(--font-display)", color: stat.color }}>{stat.value}</p>
                  <p className="text-xs text-slate-500 mt-1" style={{ fontFamily: "var(--font-ui)" }}>{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3">
              <Link href="/dashboard/upload">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2">
                  <span>⬆️</span> Upload New Game
                </motion.button>
              </Link>
              <Link href="/dashboard/games">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-ghost px-5 py-2.5 text-sm">
                  Manage All Games
                </motion.button>
              </Link>
            </div>

            {/* Games Table */}
            <div className="game-card overflow-hidden">
              <div className="p-5 border-b border-white/5 flex items-center justify-between">
                <h3 className="font-bold text-white text-sm" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.08em" }}>
                  YOUR GAMES
                </h3>
                <span className="text-xs text-slate-500" style={{ fontFamily: "var(--font-mono)" }}>{games.length} total</span>
              </div>

              {loading ? (
                <div className="p-6 space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-14 h-10 bg-white/5 rounded-lg animate-pulse" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 bg-white/5 rounded animate-pulse w-1/3" />
                        <div className="h-2 bg-white/5 rounded animate-pulse w-1/5" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : games.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-3xl mb-3">🚀</p>
                  <p className="text-sm text-slate-400 mb-4" style={{ fontFamily: "var(--font-body)" }}>You haven&apos;t uploaded any games yet.</p>
                  <Link href="/dashboard/upload">
                    <button className="btn-primary px-5 py-2 text-sm">Upload Your First Game</button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {games.map((game, i) => {
                    const s = STATUS_CONFIG[game.status] || STATUS_CONFIG.Pending;
                    return (
                      <motion.div key={game.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex items-center gap-4 p-4 hover:bg-white/3 transition-colors">
                        <div className="relative w-14 h-10 rounded-lg overflow-hidden flex-shrink-0">
                          <Image src={game.imageUrl} alt={game.title} fill style={{ objectFit: "cover" }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-white truncate" style={{ fontFamily: "var(--font-body)" }}>{game.title}</h4>
                          <p className="text-xs text-slate-500 mt-0.5" style={{ fontFamily: "var(--font-mono)" }}>{game.category}</p>
                        </div>
                        <div className="text-right flex-shrink-0 mr-4">
                          <p className="text-sm font-bold gradient-text-cyan" style={{ fontFamily: "var(--font-display)" }}>PKR {game.price}</p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className="text-xs px-2.5 py-1 rounded-lg font-bold"
                            style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color, fontFamily: "var(--font-display)", fontSize: "0.6rem", letterSpacing: "0.1em" }}>
                            {game.status?.toUpperCase()}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
