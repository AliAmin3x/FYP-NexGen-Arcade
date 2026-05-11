"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

const Sidebar = ({ pathname, badge }) => (
  <aside style={{ width: 220, flexShrink: 0, borderRight: "1px solid rgba(255,255,255,0.06)", background: "#0d0d0d", position: "sticky", top: 56, height: "calc(100vh - 56px)", display: "flex", flexDirection: "column" }}>
    <div style={{ padding: "24px 12px 12px" }}>
      <p style={{ fontFamily: D, fontSize: "0.58rem", letterSpacing: "0.22em", color: "#3a3a3a", textTransform: "uppercase", marginBottom: 14, paddingLeft: 8 }}>Menu</p>
      <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {ADMIN_NAV.map(item => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", borderRadius: 4,
                background: active ? "rgba(0,116,228,0.1)" : "transparent",
                borderLeft: active ? "2px solid #0074e4" : "2px solid transparent",
                paddingLeft: active ? 10 : 12,
                transition: "all 0.18s",
              }}>
                <span style={{ color: active ? "#0074e4" : "#444" }}><NavIcon path={item.icon} /></span>
                <span style={{ fontFamily: B, fontWeight: 600, fontSize: "0.85rem", color: active ? "#fff" : "#555" }}>{item.label}</span>
                {item.href === "/admin/game-approvals" && badge > 0 && (
                  <span style={{ marginLeft: "auto", background: "#0074e4", color: "#fff", fontFamily: M, fontSize: "0.6rem", fontWeight: 700, padding: "1px 6px", borderRadius: 2 }}>{badge}</span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>
    </div>

    {/* Bottom system info */}
    <div style={{ marginTop: "auto", padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00c875" }} />
        <span style={{ fontFamily: M, fontSize: "0.6rem", color: "#3a3a3a", letterSpacing: "0.06em" }}>All systems normal</span>
      </div>
    </div>
  </aside>
);

export default function GameApprovals() {
  const pathname = usePathname();
  const [games, setGames] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState({});

  useEffect(() => {
    fetch("/api/games?status=Pending")
      .then(r => r.json())
      .then(data => { setGames(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setError("Failed to load games"); setLoading(false); });
  }, []);

  const handleApprove = async (id) => {
    setProcessing(p => ({ ...p, [id]: "approving" }));
    await fetch(`/api/games/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "Approved" }) });
    setGames(g => g.filter(x => x.id !== id));
    setProcessing(p => { const n = { ...p }; delete n[id]; return n; });
  };

  const handleReject = async (id) => {
    setProcessing(p => ({ ...p, [id]: "rejecting" }));
    await fetch(`/api/games/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "Rejected" }) });
    setGames(g => g.filter(x => x.id !== id));
    setProcessing(p => { const n = { ...p }; delete n[id]; return n; });
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
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00c875", animation: "pulse 2s infinite" }} />
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
        <Sidebar pathname={pathname} badge={games.length} />

        {/* Main content */}
        <main style={{ flex: 1, padding: "32px 36px", minWidth: 0 }}>

          {/* Page header */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontFamily: D, fontSize: "0.6rem", letterSpacing: "0.22em", color: "#0074e4", textTransform: "uppercase", fontWeight: 600 }}>Moderation</span>
              <span style={{ color: "#222", fontSize: "0.6rem" }}>/</span>
              <span style={{ fontFamily: D, fontSize: "0.6rem", letterSpacing: "0.22em", color: "#444", textTransform: "uppercase" }}>Queue</span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
              <div>
                <h1 style={{ fontFamily: D, fontWeight: 800, fontSize: "2.2rem", letterSpacing: "0.04em", color: "#fff", textTransform: "uppercase", lineHeight: 0.95, marginBottom: 8 }}>
                  Game Approvals
                </h1>
                <p style={{ fontFamily: B, fontSize: "0.85rem", color: "#555", fontWeight: 400 }}>
                  Review and moderate developer-submitted games
                </p>
              </div>
              {!loading && (
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: D, fontSize: "2.5rem", fontWeight: 800, color: games.length > 0 ? "#f5c842" : "#00c875", lineHeight: 1 }}>
                    {games.length}
                  </div>
                  <div style={{ fontFamily: B, fontSize: "0.75rem", color: "#555" }}>pending review</div>
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 28 }} />

          {error && (
            <div style={{ padding: "14px 16px", borderRadius: 4, marginBottom: 20, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", fontFamily: B, fontSize: "0.85rem" }}>
              {error}
            </div>
          )}

          {/* Loading skeletons */}
          {loading && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[1,2,3].map(i => (
                <div key={i} style={{ height: 120, borderRadius: 4, background: "#141414", border: "1px solid rgba(255,255,255,0.05)", animation: "pulse 1.5s ease-in-out infinite" }} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && games.length === 0 && !error && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ width: 56, height: 56, borderRadius: 4, background: "rgba(0,200,117,0.1)", border: "1px solid rgba(0,200,117,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <svg className="w-6 h-6" style={{ color: "#00c875" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 style={{ fontFamily: D, fontWeight: 700, fontSize: "1.4rem", color: "#fff", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>Queue Clear</h2>
              <p style={{ fontFamily: B, fontSize: "0.85rem", color: "#444" }}>No games pending review right now.</p>
            </motion.div>
          )}

          {/* Games list */}
          {!loading && games.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <AnimatePresence>
                {games.map((game, i) => (
                  <motion.div key={game.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 60, transition: { duration: 0.22 } }}
                    transition={{ delay: i * 0.05, duration: 0.28 }}
                    style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 4, overflow: "hidden", display: "flex", gap: 0 }}>

                    {/* Image */}
                    <div style={{ width: 160, flexShrink: 0, position: "relative" }}>
                      <Image src={game.imageUrl} alt={game.title} fill style={{ objectFit: "cover" }} />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent 70%, rgba(20,20,20,0.6))" }} />
                      {game.category && (
                        <div style={{ position: "absolute", top: 10, left: 10 }}>
                          <span style={{ background: "rgba(0,0,0,0.7)", color: "#a0a0a0", fontFamily: D, fontSize: "0.58rem", letterSpacing: "0.12em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 2, backdropFilter: "blur(4px)" }}>
                            {game.category}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, padding: "20px 24px", display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: 0 }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
                          <h3 style={{ fontFamily: D, fontWeight: 700, fontSize: "1.25rem", letterSpacing: "0.04em", color: "#fff", textTransform: "uppercase", lineHeight: 1.1 }}>
                            {game.title}
                          </h3>
                          <span style={{ flexShrink: 0, fontFamily: D, fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 2, background: "rgba(245,200,66,0.08)", border: "1px solid rgba(245,200,66,0.2)", color: "#f5c842" }}>
                            Pending
                          </span>
                        </div>
                        <p style={{ fontFamily: B, fontSize: "0.82rem", color: "#555", lineHeight: 1.6, marginBottom: 12, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {game.description || "No description provided."}
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                          <span style={{ fontFamily: M, fontSize: "0.95rem", fontWeight: 700, color: "#fff" }}>
                            PKR {game.price}
                          </span>
                          {game.developerEmail && (
                            <span style={{ fontFamily: M, fontSize: "0.65rem", color: "#444" }}>
                              by {game.developerEmail}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16 }}>
                        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                          onClick={() => handleApprove(game.id)}
                          disabled={!!processing[game.id]}
                          style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 20px", borderRadius: 3, background: "rgba(0,200,117,0.1)", border: "1px solid rgba(0,200,117,0.25)", color: "#00c875", fontFamily: D, fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", opacity: processing[game.id] ? 0.5 : 1, transition: "all 0.18s" }}>
                          {processing[game.id] === "approving"
                            ? <div style={{ width: 12, height: 12, border: "2px solid #00c875", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                            : <svg style={{ width: 14, height: 14 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                          }
                          Approve
                        </motion.button>

                        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                          onClick={() => handleReject(game.id)}
                          disabled={!!processing[game.id]}
                          style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 20px", borderRadius: 3, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", fontFamily: D, fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", opacity: processing[game.id] ? 0.5 : 1, transition: "all 0.18s" }}>
                          {processing[game.id] === "rejecting"
                            ? <div style={{ width: 12, height: 12, border: "2px solid #ef4444", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                            : <svg style={{ width: 14, height: 14 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                          }
                          Reject
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </main>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:.5 } }
      `}</style>
    </div>
  );
}
