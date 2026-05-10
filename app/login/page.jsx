"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "../../lib/SessionContext";
import Image from "next/image";

const roles = [
  {
    id: "user", label: "Player", description: "Browse, buy, and play games",
    icon: "🎮", redirect: "/homepage", accent: "#00d4ff",
    features: ["Browse 1,200+ games", "Manage wishlist", "Track purchases"],
  },
  {
    id: "developer", label: "Developer", description: "Upload and manage your games",
    icon: "⚙️", redirect: "/dashboard", accent: "#8b5cf6",
    features: ["Upload games", "View analytics", "Manage revenue"],
  },
  {
    id: "admin", label: "Admin", description: "Approve games and manage the platform",
    icon: "🛡️", redirect: "/admin/game-approvals", accent: "#f97316",
    features: ["Approve submissions", "Manage users", "Platform analytics"],
  },
];

const Login = () => {
  const router = useRouter();
  const { switchRole } = useSession();
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState("");
  const [hovered, setHovered] = useState(null);

  const handleRoleSelect = async (role) => {
    setLoading(role.id);
    setError("");
    try {
      await switchRole(role.id);
      router.push(role.redirect);
    } catch (err) {
      setError(err.message);
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{background:'var(--bg-primary)'}}>
      {/* Background effects */}
      <div className="absolute inset-0" style={{
        background: `radial-gradient(ellipse 70% 50% at 20% 50%, rgba(0,212,255,0.06) 0%, transparent 60%),
                     radial-gradient(ellipse 50% 60% at 80% 50%, rgba(139,92,246,0.06) 0%, transparent 60%)`
      }} />
      
      {/* Animated grid */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `linear-gradient(rgba(0,212,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
        maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent)'
      }} />

      <div className="relative z-10 w-full max-w-3xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Image src="/logo.png" alt="NexGen" width={60} height={60} />
              <div className="absolute inset-0 bg-cyan-400/30 blur-xl rounded-full" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3" style={{fontFamily:'var(--font-display)', letterSpacing:'-0.02em'}}>
            NEXGEN <span className="gradient-text-cyan">ARCADE</span>
          </h1>
          <p className="text-slate-400 text-sm" style={{fontFamily:'var(--font-ui)'}}>
            Select your role to continue
          </p>
        </motion.div>

        {error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-red-400 text-center mb-6 text-sm p-3 rounded-lg bg-red-400/10 border border-red-400/20"
            style={{fontFamily:'var(--font-ui)'}}>
            {error}
          </motion.p>
        )}

        {/* Role cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {roles.map((role, i) => (
            <motion.button
              key={role.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => handleRoleSelect(role)}
              onMouseEnter={() => setHovered(role.id)} onMouseLeave={() => setHovered(null)}
              disabled={!!loading}
              className="relative text-left p-6 rounded-2xl border transition-all duration-300 disabled:opacity-60 disabled:cursor-wait overflow-hidden"
              style={{
                background: hovered === role.id ? `rgba(${role.accent === '#00d4ff' ? '0,212,255' : role.accent === '#8b5cf6' ? '139,92,246' : '249,115,22'},0.08)` : 'var(--bg-card)',
                borderColor: hovered === role.id ? role.accent + '60' : 'rgba(255,255,255,0.06)',
                boxShadow: hovered === role.id ? `0 0 30px ${role.accent}20, 0 20px 40px rgba(0,0,0,0.3)` : 'none',
              }}>
              
              {/* Accent corner */}
              <div className="absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-20" style={{background: role.accent}} />

              <div className="text-4xl mb-4">{role.icon}</div>
              
              <p className="text-lg font-black text-white mb-1" style={{fontFamily:'var(--font-display)', letterSpacing:'0.05em'}}>
                {loading === role.id ? "Loading..." : role.label}
              </p>
              <p className="text-xs text-slate-400 mb-5" style={{fontFamily:'var(--font-ui)'}}>{role.description}</p>
              
              <ul className="space-y-1.5">
                {role.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs text-slate-300" style={{fontFamily:'var(--font-ui)'}}>
                    <span className="w-1 h-1 rounded-full flex-shrink-0" style={{background: role.accent}} />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex items-center gap-2 text-xs font-bold tracking-widest uppercase" style={{color: role.accent, fontFamily:'var(--font-display)', letterSpacing:'0.12em'}}>
                Enter
                <svg className={`w-3 h-3 transition-transform duration-200 ${hovered === role.id ? 'translate-x-1' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </motion.button>
          ))}
        </div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="text-center mt-8 text-xs text-slate-600" style={{fontFamily:'var(--font-ui)'}}>
          NexGen Arcade — Dev Mode — Authentication bypassed
        </motion.p>
      </div>
    </div>
  );
};

export default Login;
