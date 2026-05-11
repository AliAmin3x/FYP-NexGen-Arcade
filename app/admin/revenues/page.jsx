"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import jsPDF from "jspdf";
import "jspdf-autotable";

const D = "'Barlow Condensed', sans-serif";
const B = "'DM Sans', sans-serif";
const M = "'JetBrains Mono', monospace";

const NavIcon = ({ path }) => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

const ADMIN_NAV = [
  { href: "/admin/game-approvals", label: "Game Approvals", icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { href: "/admin/revenues",       label: "Revenue",        icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" },
];

const Sidebar = ({ pathname }) => (
  <aside style={{ width: 220, flexShrink: 0, borderRight: "1px solid rgba(255,255,255,0.06)", background: "#0d0d0d", position: "sticky", top: 56, height: "calc(100vh - 56px)", display: "flex", flexDirection: "column" }}>
    <div style={{ padding: "24px 12px 12px" }}>
      <p style={{ fontFamily: D, fontSize: "0.58rem", letterSpacing: "0.22em", color: "#3a3a3a", textTransform: "uppercase", marginBottom: 14, paddingLeft: 8 }}>Menu</p>
      <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {ADMIN_NAV.map(item => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 4, background: active ? "rgba(0,116,228,0.1)" : "transparent", borderLeft: active ? "2px solid #0074e4" : "2px solid transparent", paddingLeft: active ? 10 : 12, transition: "all 0.18s" }}>
                <span style={{ color: active ? "#0074e4" : "#444" }}><NavIcon path={item.icon} /></span>
                <span style={{ fontFamily: B, fontWeight: 600, fontSize: "0.85rem", color: active ? "#fff" : "#555" }}>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
    <div style={{ marginTop: "auto", padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00c875" }} />
        <span style={{ fontFamily: M, fontSize: "0.6rem", color: "#3a3a3a", letterSpacing: "0.06em" }}>All systems normal</span>
      </div>
    </div>
  </aside>
);

const StatCard = ({ label, value, sub, color, icon }) => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
    style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 4, padding: "22px 24px" }}>
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
      <div style={{ width: 36, height: 36, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", background: `${color}14`, border: `1px solid ${color}28` }}>
        <span style={{ fontSize: "1rem" }}>{icon}</span>
      </div>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: color, opacity: 0.7 }} />
    </div>
    <div style={{ fontFamily: D, fontWeight: 800, fontSize: "1.7rem", color, letterSpacing: "0.02em", lineHeight: 1, marginBottom: 4 }}>{value}</div>
    <div style={{ fontFamily: B, fontSize: "0.78rem", color: "#555", fontWeight: 400 }}>{label}</div>
    {sub && <div style={{ fontFamily: M, fontSize: "0.62rem", color: "#3a3a3a", marginTop: 4 }}>{sub}</div>}
  </motion.div>
);

export default function Revenues() {
  const pathname = usePathname();
  const [games, setGames] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/games?status=Approved")
      .then(r => r.json())
      .then(data => { setGames(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setError("Failed to load data"); setLoading(false); });
  }, []);

  const totalGMV = games.reduce((s, g) => s + Number(g.price), 0);
  const totalRev  = games.reduce((s, g) => s + Number(g.price) * 0.2, 0);
  const avgPrice  = games.length ? totalGMV / games.length : 0;

  const filtered = games.filter(g => g.title.toLowerCase().includes(search.toLowerCase()));

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("NexGen Arcade — Revenue Report", 14, 15);
    doc.autoTable(
      ["Game", "Price (PKR)", "Platform Revenue (PKR)"],
      games.map(g => [g.title, Number(g.price).toFixed(0), (Number(g.price) * 0.2).toFixed(0)]),
      { startY: 22 }
    );
    doc.save("nexgen_revenue_report.pdf");
  };

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", fontFamily: B }}>

      {/* Top Bar */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", background: "rgba(10,10,10,0.98)", borderBottom: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(20px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 24, height: 24, position: "relative" }}>
            <Image src="/logo.png" alt="NexGen" fill style={{ objectFit: "contain" }} />
          </div>
          <span style={{ fontFamily: D, fontWeight: 700, fontSize: "0.95rem", letterSpacing: "0.16em", color: "#fff", textTransform: "uppercase" }}>
            NexGen <span style={{ color: "#0074e4" }}>Admin</span>
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 3, background: "rgba(0,200,117,0.07)", border: "1px solid rgba(0,200,117,0.15)" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00c875" }} />
            <span style={{ fontFamily: M, fontSize: "0.62rem", color: "#00c875", letterSpacing: "0.08em" }}>LIVE</span>
          </div>
          <span style={{ fontFamily: M, fontSize: "0.65rem", color: "#444" }}>admin@nexgen.com</span>
          <Link href="/homepage" style={{ textDecoration: "none" }}>
            <div style={{ padding: "5px 12px", borderRadius: 3, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", cursor: "pointer" }}>
              <span style={{ fontFamily: D, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", color: "#666", textTransform: "uppercase" }}>← Store</span>
            </div>
          </Link>
        </div>
      </header>

      <div style={{ display: "flex", paddingTop: 56 }}>
        <Sidebar pathname={pathname} />

        <main style={{ flex: 1, padding: "32px 36px", minWidth: 0 }}>

          {/* Page header */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontFamily: D, fontSize: "0.6rem", letterSpacing: "0.22em", color: "#0074e4", textTransform: "uppercase", fontWeight: 600 }}>Analytics</span>
              <span style={{ color: "#222", fontSize: "0.6rem" }}>/</span>
              <span style={{ fontFamily: D, fontSize: "0.6rem", letterSpacing: "0.22em", color: "#444", textTransform: "uppercase" }}>Revenue</span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16 }}>
              <div>
                <h1 style={{ fontFamily: D, fontWeight: 800, fontSize: "2.2rem", letterSpacing: "0.04em", color: "#fff", textTransform: "uppercase", lineHeight: 0.95, marginBottom: 8 }}>
                  Revenue Dashboard
                </h1>
                <p style={{ fontFamily: B, fontSize: "0.85rem", color: "#555" }}>
                  Platform earns 20% on every approved game sale
                </p>
              </div>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={generatePDF}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 3, background: "rgba(0,116,228,0.1)", border: "1px solid rgba(0,116,228,0.25)", color: "#0074e4", fontFamily: D, fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", whiteSpace: "nowrap" }}>
                <svg style={{ width: 14, height: 14 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                Export PDF
              </motion.button>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 24 }} />

          {/* Stat cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
            <StatCard label="Total Games" value={loading ? "—" : games.length} color="#0074e4" icon="🎮" />
            <StatCard label="Total GMV" value={loading ? "—" : `PKR ${Math.round(totalGMV).toLocaleString()}`} color="#00c8d4" icon="💳" sub="gross merchandise value" />
            <StatCard label="Platform Revenue" value={loading ? "—" : `PKR ${Math.round(totalRev).toLocaleString()}`} color="#f5c842" icon="💰" sub="20% platform fee" />
            <StatCard label="Avg. Game Price" value={loading ? "—" : `PKR ${Math.round(avgPrice).toLocaleString()}`} color="#a78bfa" icon="📊" />
          </div>

          {error && (
            <div style={{ padding: "14px 16px", borderRadius: 4, marginBottom: 20, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", fontFamily: B, fontSize: "0.85rem" }}>
              {error}
            </div>
          )}

          {/* Table card */}
          <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 4, overflow: "hidden" }}>

            {/* Table toolbar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ fontFamily: D, fontWeight: 700, fontSize: "0.88rem", letterSpacing: "0.1em", color: "#fff", textTransform: "uppercase" }}>Revenue Breakdown</span>
              <div style={{ position: "relative" }}>
                <input
                  type="text" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search games..."
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 3, padding: "7px 12px 7px 32px", fontFamily: B, fontSize: "0.8rem", color: "#a0a0a0", outline: "none", width: 200 }}
                />
                <svg style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", width: 13, height: 13, color: "#444" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
            </div>

            {/* Table header */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "10px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              {["Game Title", "Price", "Rev. (20%)", "Share"].map(h => (
                <span key={h} style={{ fontFamily: D, fontSize: "0.6rem", letterSpacing: "0.18em", color: "#3a3a3a", textTransform: "uppercase", fontWeight: 600, textAlign: h === "Price" || h === "Rev. (20%)" || h === "Share" ? "right" : "left" }}>{h}</span>
              ))}
            </div>

            {/* Rows */}
            {loading ? (
              <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
                {[1,2,3,4,5].map(i => (
                  <div key={i} style={{ height: 32, background: "rgba(255,255,255,0.03)", borderRadius: 2, animation: "pulse 1.5s ease-in-out infinite" }} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: "48px 0", textAlign: "center" }}>
                <p style={{ fontFamily: B, fontSize: "0.85rem", color: "#444" }}>No games found</p>
              </div>
            ) : (
              <div>
                {filtered.map((game, i) => {
                  const price = Number(game.price);
                  const rev = price * 0.2;
                  const share = totalGMV > 0 ? ((price / totalGMV) * 100).toFixed(1) : "0.0";
                  return (
                    <motion.div key={game.id}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.025 }}
                      style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", alignItems: "center", padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.03)", transition: "background 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 40, height: 28, borderRadius: 2, overflow: "hidden", position: "relative", flexShrink: 0, background: "#0a0a0a" }}>
                          <Image src={game.imageUrl} alt={game.title} fill style={{ objectFit: "cover" }} />
                        </div>
                        <span style={{ fontFamily: B, fontWeight: 500, fontSize: "0.85rem", color: "#ccc", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{game.title}</span>
                      </div>
                      <span style={{ fontFamily: M, fontSize: "0.82rem", color: "#a0a0a0", textAlign: "right" }}>
                        {price.toLocaleString()}
                      </span>
                      <span style={{ fontFamily: M, fontSize: "0.82rem", fontWeight: 700, color: "#f5c842", textAlign: "right" }}>
                        {Math.round(rev).toLocaleString()}
                      </span>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end" }}>
                        <div style={{ flex: 1, maxWidth: 60, height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${share}%`, background: "#0074e4", borderRadius: 2 }} />
                        </div>
                        <span style={{ fontFamily: M, fontSize: "0.7rem", color: "#555", width: 34, textAlign: "right" }}>{share}%</span>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Total row */}
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", alignItems: "center", padding: "14px 20px", background: "rgba(255,255,255,0.03)", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                  <span style={{ fontFamily: D, fontWeight: 800, fontSize: "0.82rem", letterSpacing: "0.1em", color: "#fff", textTransform: "uppercase" }}>Total</span>
                  <span style={{ fontFamily: M, fontSize: "0.88rem", fontWeight: 700, color: "#0074e4", textAlign: "right" }}>
                    {Math.round(totalGMV).toLocaleString()}
                  </span>
                  <span style={{ fontFamily: M, fontSize: "0.88rem", fontWeight: 700, color: "#f5c842", textAlign: "right" }}>
                    {Math.round(totalRev).toLocaleString()}
                  </span>
                  <span style={{ fontFamily: M, fontSize: "0.75rem", color: "#555", textAlign: "right" }}>100%</span>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <style>{`
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:.4 } }
        input::placeholder { color: #3a3a3a; }
        input:focus { border-color: rgba(0,116,228,0.4) !important; box-shadow: 0 0 0 2px rgba(0,116,228,0.1); }
      `}</style>
    </div>
  );
}
