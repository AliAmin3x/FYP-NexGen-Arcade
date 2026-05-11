"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "../../lib/SessionContext";
import Image from "next/image";

const roles = [
  {
    id: "user",
    label: "PLAYER",
    description: "Browse, buy & play games",
    icon: "🎮",
    redirect: "/homepage",
    accent: "#e8b923",
    accentRgb: "232,185,35",
    features: ["Browse 1,200+ games", "Manage wishlist", "Track purchases"],
  },
  {
    id: "developer",
    label: "DEVELOPER",
    description: "Upload & manage your games",
    icon: "⚙️",
    redirect: "/dashboard",
    accent: "#6933ff",
    accentRgb: "105,51,255",
    features: ["Upload games", "View analytics", "Manage revenue"],
  },
  {
    id: "admin",
    label: "ADMIN",
    description: "Approve games & manage platform",
    icon: "🛡️",
    redirect: "/admin/game-approvals",
    accent: "#e8192c",
    accentRgb: "232,25,44",
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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{background:'var(--bg-void)'}}>

      {/* ── Background effects ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid lines */}
        <div className="absolute inset-0 grid-lines opacity-30" />
        {/* Radial gradients */}
        <div className="absolute inset-0" style={{
          background:`
            radial-gradient(ellipse 60% 50% at 10% 50%, rgba(232,185,35,0.04) 0%, transparent 55%),
            radial-gradient(ellipse 60% 50% at 90% 50%, rgba(232,25,44,0.04)  0%, transparent 55%)
          `
        }} />
        {/* Scanlines */}
        <div className="absolute inset-0" style={{
          backgroundImage:'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)',
          opacity: 0.6
        }} />
      </div>

      <div className="relative z-10 w-full max-w-3xl">

        {/* ── Header ── */}
        <motion.div initial={{ opacity:0, y:-30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}
          className="text-center mb-14">

          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full scale-150" />
              <div className="relative w-16 h-16">
                <Image src="/logo.png" alt="NexGen" fill style={{objectFit:'contain'}} />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 mb-4">
            <h1 style={{fontFamily:'var(--font-display)', fontSize:'clamp(2.5rem,7vw,4rem)', lineHeight:0.9, letterSpacing:'0.05em', color:'#fff'}}>
              NEXGEN{" "}
              <span className="gradient-fire">ARCADE</span>
            </h1>
            <div className="flex items-center gap-3">
              <div className="h-px w-16" style={{background:'linear-gradient(to right, transparent, rgba(232,185,35,0.4))'}} />
              <span style={{fontFamily:'var(--font-mono)', fontSize:'0.6rem', letterSpacing:'0.3em', color:'var(--text-muted)', textTransform:'uppercase'}}>
                Select Your Role
              </span>
              <div className="h-px w-16" style={{background:'linear-gradient(to left, transparent, rgba(232,185,35,0.4))'}} />
            </div>
          </div>
        </motion.div>

        {/* ── Error ── */}
        {error && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
            className="mb-6 p-3 rounded text-center text-sm"
            style={{background:'rgba(232,25,44,0.08)', border:'1px solid rgba(232,25,44,0.2)', color:'#ff6b7a', fontFamily:'var(--font-body)'}}>
            {error}
          </motion.div>
        )}

        {/* ── Role cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {roles.map((role, i) => (
            <motion.div key={role.id}
              initial={{ opacity:0, y:40 }}
              animate={{ opacity:1, y:0 }}
              transition={{ delay:0.1 + i*0.12, duration:0.5 }}
              onHoverStart={() => setHovered(role.id)}
              onHoverEnd={() => setHovered(null)}>

              <motion.button
                whileHover={{ y:-5, scale:1.02 }}
                whileTap={{ scale:0.97 }}
                onClick={() => handleRoleSelect(role)}
                disabled={loading !== null}
                className="w-full flex flex-col items-center text-left rounded-lg p-6 relative overflow-hidden transition-all duration-300"
                style={{
                  background: hovered === role.id ? `rgba(${role.accentRgb},0.06)` : 'rgba(12,14,29,0.8)',
                  border:`1px solid ${hovered === role.id ? `rgba(${role.accentRgb},0.4)` : 'rgba(255,255,255,0.06)'}`,
                  backdropFilter:'blur(20px)',
                  boxShadow: hovered === role.id ? `0 20px 60px rgba(${role.accentRgb},0.15), 0 0 0 1px rgba(${role.accentRgb},0.1)` : 'none'
                }}>

                {/* Background glow */}
                <motion.div className="absolute inset-0 pointer-events-none"
                  animate={{ opacity: hovered === role.id ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  style={{background:`radial-gradient(ellipse 80% 80% at 50% 100%, rgba(${role.accentRgb},0.12), transparent 70%)`}} />

                {/* Top accent bar */}
                <motion.div className="absolute top-0 left-0 right-0 h-0.5"
                  animate={{ scaleX: hovered === role.id ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  style={{background:`linear-gradient(to right, transparent, rgba(${role.accentRgb},0.8), transparent)`, transformOrigin:'center'}} />

                {/* Icon */}
                <div className="relative z-10 mb-5 w-14 h-14 flex items-center justify-center rounded text-3xl"
                  style={{
                    background:`rgba(${role.accentRgb},0.1)`,
                    border:`1px solid rgba(${role.accentRgb},0.2)`
                  }}>
                  {role.icon}
                </div>

                <div className="relative z-10 w-full">
                  <h3 className="mb-1" style={{
                    fontFamily:'var(--font-display)',
                    fontSize:'1.5rem',
                    lineHeight:0.9,
                    letterSpacing:'0.08em',
                    color: hovered === role.id ? role.accent : 'var(--text-primary)'
                  }}>
                    {role.label}
                  </h3>
                  <p className="mb-5" style={{fontFamily:'var(--font-body)', fontSize:'0.78rem', color:'var(--text-muted)', fontWeight:300, lineHeight:1.5}}>
                    {role.description}
                  </p>

                  <ul className="flex flex-col gap-2">
                    {role.features.map(f => (
                      <li key={f} className="flex items-center gap-2"
                        style={{fontFamily:'var(--font-body)', fontSize:'0.75rem', color:'var(--text-secondary)'}}>
                        <div className="w-1 h-1 rounded-full flex-shrink-0" style={{background:role.accent}} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Enter indicator */}
                <motion.div className="relative z-10 mt-6 w-full flex items-center justify-between"
                  animate={{ opacity: hovered === role.id ? 1 : 0.4 }}>
                  <div className="h-px flex-1" style={{background:`rgba(${role.accentRgb},0.2)`}} />
                  <div className="flex items-center gap-2 px-3">
                    {loading === role.id ? (
                      <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" style={{color:role.accent}} />
                    ) : (
                      <>
                        <span style={{fontFamily:'var(--font-mono)', fontSize:'0.6rem', letterSpacing:'0.2em', color:role.accent}}>ENTER</span>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{color:role.accent}}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </div>
                  <div className="h-px flex-1" style={{background:`rgba(${role.accentRgb},0.2)`}} />
                </motion.div>
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.6 }}
          className="text-center mt-10"
          style={{fontFamily:'var(--font-mono)', fontSize:'0.6rem', letterSpacing:'0.22em', color:'var(--text-muted)', textTransform:'uppercase'}}>
          NexGen Arcade · Premium Digital Game Store
        </motion.p>
      </div>
    </div>
  );
};

export default Login;
