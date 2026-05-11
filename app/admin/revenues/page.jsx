"use client";
import React, { useEffect, useState } from "react";
import Footer from "../../../components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ADMIN_NAV = [
  { href: "/admin/game-approvals", label: "Game Approvals", icon: "🎮" },
  { href: "/admin/revenues", label: "Revenues", icon: "💰" },
];

const Revenues = () => {
  const pathname = usePathname();
  const [games, setGames] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/games?status=Approved")
      .then(r => r.json())
      .then(data => { setGames(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setError("Failed to fetch games"); setLoading(false); });
  }, []);

  const totalRevenue = games.reduce((sum, g) => sum + Number(g.price) * 0.2, 0);
  const totalGMV = games.reduce((sum, g) => sum + Number(g.price), 0);

  const generatePDF = () => {
    const doc = new jsPDF();
    const tableRows = games.map(g => [g.title, `PKR ${Number(g.price).toFixed(0)}`, `PKR ${(Number(g.price) * 0.2).toFixed(0)}`]);
    doc.autoTable(["Game Name", "Game Price", "Platform Revenue (20%)"], tableRows, { startY: 20 });
    doc.text("NexGen Arcade — Revenue Report", 14, 15);
    doc.save("nexgen_revenue_report.pdf");
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
        </aside>

        {/* Main */}
        <main className="flex-1 px-6 py-8">
          <div className="max-w-5xl">
            <div className="mb-8 flex items-start justify-between">
              <div>
                <p className="text-xs tracking-widest text-amber-400 uppercase mb-2" style={{ fontFamily: "var(--font-display)" }}>◆ Analytics</p>
                <h1 className="text-3xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>Revenue Dashboard</h1>
                <p className="text-slate-400 text-sm mt-1" style={{ fontFamily: "var(--font-ui)" }}>20% platform fee on all approved games</p>
              </div>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={generatePDF}
                className="px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2"
                style={{ background: "rgba(240,192,64,0.1)", border: "1px solid rgba(240,192,64,0.3)", color: "#f0c040", fontFamily: "var(--font-display)", letterSpacing: "0.06em" }}>
                📄 Export PDF
              </motion.button>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: "Total Games", value: games.length, color: "#7c3aed", icon: "🎮" },
                { label: "Total GMV", value: `PKR ${totalGMV.toFixed(0)}`, color: "#06b6d4", icon: "💳" },
                { label: "Platform Revenue", value: `PKR ${totalRevenue.toFixed(0)}`, color: "#f0c040", icon: "💰" },
              ].map(stat => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="game-card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl">{stat.icon}</span>
                    <div className="w-2 h-2 rounded-full" style={{ background: stat.color }} />
                  </div>
                  <p className="text-xl font-black mb-1" style={{ fontFamily: "var(--font-display)", color: stat.color }}>{stat.value}</p>
                  <p className="text-xs text-slate-500" style={{ fontFamily: "var(--font-ui)" }}>{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {error && (
              <div className="p-4 rounded-xl mb-6 text-sm"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", fontFamily: "var(--font-body)" }}>
                {error}
              </div>
            )}

            {/* Revenue Table */}
            <div className="game-card overflow-hidden">
              <div className="p-5 border-b border-white/5 flex items-center justify-between">
                <h3 className="font-bold text-white text-sm" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.08em" }}>
                  REVENUE BREAKDOWN
                </h3>
                <span className="text-xs text-slate-500" style={{ fontFamily: "var(--font-mono)" }}>{games.length} approved games</span>
              </div>

              {loading ? (
                <div className="p-6 space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 py-2">
                      <div className="h-3 bg-white/5 rounded animate-pulse flex-1" />
                      <div className="h-3 bg-white/5 rounded animate-pulse w-24" />
                      <div className="h-3 bg-white/5 rounded animate-pulse w-24" />
                    </div>
                  ))}
                </div>
              ) : games.length === 0 && !error ? (
                <div className="p-12 text-center">
                  <p className="text-3xl mb-3">📊</p>
                  <p className="text-slate-400 text-sm" style={{ fontFamily: "var(--font-body)" }}>No approved games yet</p>
                </div>
              ) : (
                <>
                  {/* Table Header */}
                  <div className="grid grid-cols-3 px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5"
                    style={{ fontFamily: "var(--font-display)" }}>
                    <span>Game</span>
                    <span className="text-center">Price</span>
                    <span className="text-right">Platform Revenue</span>
                  </div>
                  <div className="divide-y divide-white/5">
                    {games.map((game, i) => (
                      <motion.div key={game.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="grid grid-cols-3 items-center px-5 py-3.5 hover:bg-white/3 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-7 rounded-lg overflow-hidden flex-shrink-0">
                            <Image src={game.imageUrl} alt={game.title} fill style={{ objectFit: "cover" }} />
                          </div>
                          <span className="text-sm font-semibold text-white truncate" style={{ fontFamily: "var(--font-body)" }}>{game.title}</span>
                        </div>
                        <span className="text-center text-sm text-slate-300" style={{ fontFamily: "var(--font-mono)" }}>
                          PKR {Number(game.price).toFixed(0)}
                        </span>
                        <span className="text-right text-sm font-bold" style={{ fontFamily: "var(--font-display)", color: "#f0c040" }}>
                          PKR {(Number(game.price) * 0.2).toFixed(0)}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                  {/* Total row */}
                  <div className="grid grid-cols-3 px-5 py-4 border-t border-white/10 bg-white/3">
                    <span className="text-sm font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>TOTAL</span>
                    <span className="text-center text-sm font-bold text-cyan-400" style={{ fontFamily: "var(--font-display)" }}>
                      PKR {totalGMV.toFixed(0)}
                    </span>
                    <span className="text-right text-sm font-black" style={{ fontFamily: "var(--font-display)", color: "#f0c040" }}>
                      PKR {totalRevenue.toFixed(0)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Revenues;
