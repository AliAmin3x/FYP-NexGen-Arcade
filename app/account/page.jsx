"use client";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "../../lib/SessionContext";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/account", label: "Account Info", icon: "👤", desc: "Personal details" },
  { href: "/account/password", label: "Security", icon: "🔒", desc: "Password & 2FA" },
  { href: "/account/orders", label: "Order History", icon: "📦", desc: "Past purchases" },
];

const AccountSettings = () => {
  const { user } = useSession();
  const pathname = usePathname();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) { setUsername(user.username || ""); setEmail(user.email || ""); }
  }, [user]);

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ background: "var(--bg-primary)", minHeight: "100vh" }}>
      <Navbar userEmail={user?.email} username={user?.username} />

      {/* Header */}
      <div className="relative pt-24 pb-8 px-4 sm:px-6 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(37,99,235,0.08) 0%, transparent 70%)"
        }} />
        <div className="max-w-5xl mx-auto">
          <p className="text-xs tracking-widest text-blue-400 uppercase mb-2" style={{ fontFamily: "var(--font-display)" }}>◆ Profile</p>
          <h1 className="text-3xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>Account Settings</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="md:w-56 flex-shrink-0">
            <div className="game-card overflow-hidden">
              {/* Avatar */}
              <div className="p-5 border-b border-white/5">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl mb-3"
                  style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.2), rgba(124,58,237,0.2))", border: "1px solid rgba(37,99,235,0.3)" }}>
                  👤
                </div>
                <p className="text-sm font-bold text-white truncate" style={{ fontFamily: "var(--font-body)" }}>{username || "Player"}</p>
                <p className="text-xs text-slate-500 truncate" style={{ fontFamily: "var(--font-mono)" }}>{email || "—"}</p>
              </div>
              <nav className="p-2">
                {NAV_ITEMS.map(item => (
                  <Link key={item.href} href={item.href}>
                    <motion.div whileHover={{ x: 2 }}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all ${
                        pathname === item.href
                          ? "bg-blue-400/10 border border-blue-400/20"
                          : "hover:bg-white/5 border border-transparent"
                      }`}>
                      <span className="text-base">{item.icon}</span>
                      <div>
                        <p className={`text-sm font-semibold ${pathname === item.href ? "text-blue-400" : "text-white"}`}
                          style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem" }}>{item.label}</p>
                        <p className="text-xs text-slate-600" style={{ fontFamily: "var(--font-ui)", fontSize: "0.65rem" }}>{item.desc}</p>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="game-card p-6">
              <h2 className="text-lg font-bold text-white mb-6" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.05em" }}>
                Account Information
              </h2>

              <form onSubmit={handleSaveChanges} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-display)" }}>
                    Username
                  </label>
                  <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", fontFamily: "var(--font-body)" }}
                    onFocus={e => e.target.style.borderColor = "rgba(37,99,235,0.5)"}
                    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-display)" }}>
                    Email Address
                  </label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", fontFamily: "var(--font-body)" }}
                    onFocus={e => e.target.style.borderColor = "rgba(37,99,235,0.5)"}
                    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-display)" }}>
                    Account Type
                  </label>
                  <div className="px-4 py-3 rounded-xl text-sm text-slate-400"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", fontFamily: "var(--font-body)" }}>
                    Player · Standard Account
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="px-6 py-2.5 rounded-xl text-sm font-bold transition-all"
                    style={{ background: saved ? "rgba(16,185,129,0.2)" : "rgba(37,99,235,0.2)", border: `1px solid ${saved ? "rgba(16,185,129,0.4)" : "rgba(37,99,235,0.4)"}`, color: saved ? "#10b981" : "#3b82f6", fontFamily: "var(--font-display)", letterSpacing: "0.06em" }}>
                    {saved ? "✓ SAVED" : "SAVE CHANGES"}
                  </motion.button>
                  <button type="button" onClick={() => { setUsername(user?.username || ""); setEmail(user?.email || ""); }}
                    className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:text-white transition-colors"
                    style={{ fontFamily: "var(--font-display)", letterSpacing: "0.06em" }}>
                    CANCEL
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Danger Zone */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="game-card p-6 mt-4"
              style={{ borderColor: "rgba(232,25,44,0.1)" }}>
              <h3 className="text-sm font-bold mb-3" style={{ fontFamily: "var(--font-display)", color: "#e8192c", letterSpacing: "0.08em" }}>
                DANGER ZONE
              </h3>
              <p className="text-xs text-slate-500 mb-3" style={{ fontFamily: "var(--font-ui)" }}>
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <button className="text-xs px-4 py-2 rounded-lg font-bold transition-all"
                style={{ background: "rgba(232,25,44,0.1)", border: "1px solid rgba(232,25,44,0.2)", color: "#e8192c", fontFamily: "var(--font-display)", letterSpacing: "0.08em" }}>
                DELETE ACCOUNT
              </button>
            </motion.div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AccountSettings;
