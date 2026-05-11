"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useSession } from "../lib/SessionContext";
import { useRouter, usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/homepage", label: "Store",   icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href: "/Games",    label: "Browse",  icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" },
  { href: "/freegames",label: "Free",    icon: "M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" },
  { href: "/library",  label: "Library", icon: "M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" },
];

const Navbar = ({ userEmail, username }) => {
  const { user, logout } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [showPopup, setShowPopup] = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const popupRef = useRef(null);

  const displayEmail = userEmail || user?.email;
  const displayName  = username  || user?.username;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) setShowPopup(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const handleLogout = async () => { await logout(); router.push("/"); };
  const isActive = (href) => pathname === href || pathname.startsWith(href + "/");

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "navbar-glass shadow-2xl" : "bg-transparent"}`}>
      {/* Top accent line — animated gradient */}
      <div className="h-px w-full" style={{
        background: 'linear-gradient(to right, transparent 0%, rgba(232,25,44,0.6) 20%, rgba(232,185,35,0.8) 50%, rgba(105,51,255,0.5) 80%, transparent 100%)'
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* ── Logo ── */}
        <Link href="/homepage" className="flex items-center gap-3 group flex-shrink-0">
          <div className="relative w-9 h-9">
            <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full group-hover:bg-red-500/40 transition-all duration-400 scale-150" />
            <Image src="/logo.png" alt="NexGen" fill style={{objectFit:'contain'}} className="relative z-10 drop-shadow-lg" />
          </div>
          <div className="hidden sm:flex flex-col leading-none gap-0.5">
            <span className="gradient-gold tracking-[0.2em] text-sm" style={{fontFamily:'var(--font-display)', fontWeight:400, lineHeight:1}}>
              NEXGEN
            </span>
            <span style={{
              fontFamily:'var(--font-mono)',
              fontSize:'0.52rem',
              letterSpacing:'0.4em',
              color:'rgba(232,25,44,0.7)',
              lineHeight:1
            }}>ARCADE</span>
          </div>
        </Link>

        {/* ── Desktop Nav ── */}
        <div className="hidden md:flex items-center">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link key={link.href} href={link.href}
                className={`relative flex items-center gap-2 px-4 py-2 text-xs tracking-widest uppercase transition-all duration-200 ${
                  active ? "text-white" : "text-slate-500 hover:text-slate-200"
                }`}
                style={{fontFamily:'var(--font-heading)', fontWeight:700, letterSpacing:'0.14em', fontSize:'0.78rem'}}>
                {active && (
                  <motion.div layoutId="nav-active-bg"
                    className="absolute inset-0 rounded-sm"
                    style={{background:'rgba(232,185,35,0.06)', border:'1px solid rgba(232,185,35,0.15)'}}
                    transition={{ type:"spring", stiffness:380, damping:35 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
                {active && (
                  <motion.div layoutId="nav-indicator"
                    className="absolute bottom-0 left-2 right-2 h-px"
                    style={{background:'linear-gradient(to right, transparent, var(--accent-gold), transparent)'}}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* ── Right actions ── */}
        <div className="flex items-center gap-1.5">

          {/* Cart */}
          <Link href="/cart">
            <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
              className="relative p-2.5 rounded-md text-slate-500 hover:text-white transition-all duration-200"
              style={{'--hover-bg':'rgba(232,185,35,0.07)'}}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
            </motion.button>
          </Link>

          {/* Wishlist */}
          <Link href="/favorite">
            <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
              className="p-2.5 rounded-md text-slate-500 hover:text-red-400 transition-all duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </motion.button>
          </Link>

          {/* User dropdown */}
          <div className="relative" ref={popupRef}>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => setShowPopup(!showPopup)}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-md border transition-all duration-200"
              style={{
                background: showPopup ? 'rgba(232,185,35,0.06)' : 'rgba(255,255,255,0.025)',
                borderColor: showPopup ? 'rgba(232,185,35,0.35)' : 'rgba(255,255,255,0.05)',
              }}>
              {/* Avatar */}
              <div className="w-7 h-7 rounded flex items-center justify-center text-xs font-bold flex-shrink-0 relative overflow-hidden"
                style={{background:'linear-gradient(135deg, #e8192c, #e8b923)'}}>
                <span className="relative z-10 text-black font-bold" style={{fontFamily:'var(--font-heading)'}}>
                  {displayName ? displayName[0].toUpperCase() : "G"}
                </span>
              </div>
              <span className="hidden sm:block text-xs font-semibold text-slate-300"
                style={{fontFamily:'var(--font-heading)', letterSpacing:'0.06em', maxWidth:'75px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
                {displayName || "GUEST"}
              </span>
              <svg className={`w-3 h-3 text-slate-600 transition-transform duration-200 ${showPopup ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </motion.button>

            <AnimatePresence>
              {showPopup && (
                <motion.div initial={{ opacity:0, y:8, scale:0.95 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:8, scale:0.95 }}
                  transition={{ duration:0.15 }}
                  className="absolute right-0 top-full mt-2 w-60 rounded-lg border overflow-hidden z-50"
                  style={{
                    background:'rgba(2,3,10,0.98)',
                    backdropFilter:'blur(28px)',
                    borderColor:'rgba(232,185,35,0.1)',
                    boxShadow:'0 35px 80px rgba(0,0,0,0.95), 0 0 60px rgba(232,185,35,0.04)'
                  }}>

                  {/* User info header */}
                  <div className="p-4 relative overflow-hidden" style={{borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                    <div className="absolute inset-0" style={{background:'linear-gradient(135deg, rgba(232,185,35,0.04) 0%, transparent 60%)'}} />
                    <div className="relative flex items-center gap-3">
                      <div className="w-11 h-11 rounded-lg flex items-center justify-center text-base font-bold text-black flex-shrink-0"
                        style={{background:'linear-gradient(135deg, #e8192c, #e8b923)'}}>
                        <span style={{fontFamily:'var(--font-heading)', fontWeight:700}}>
                          {displayName ? displayName[0].toUpperCase() : "G"}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white truncate" style={{fontFamily:'var(--font-heading)', letterSpacing:'0.05em'}}>
                          {displayName || "GUEST"}
                        </p>
                        <p className="text-xs text-slate-500 truncate" style={{fontFamily:'var(--font-mono)', fontSize:'0.65rem'}}>
                          {displayEmail || "Not signed in"}
                        </p>
                        {user?.role && (
                          <span className="text-xs font-bold uppercase tracking-wider" style={{color:'var(--accent-gold)', fontFamily:'var(--font-heading)', fontSize:'0.65rem'}}>
                            ◆ {user.role}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="p-1.5 flex flex-col gap-0.5">
                    {[
                      { href:'/account', label:'Account Settings', icon:'M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z' },
                      { href:'/library',  label:'My Library',       icon:'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25' },
                    ].map(item => (
                      <Link key={item.href} href={item.href} onClick={() => setShowPopup(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-md text-slate-400 hover:text-white transition-all duration-150 group"
                        style={{background:'transparent'}}>
                        <svg className="w-4 h-4 flex-shrink-0 text-slate-600 group-hover:text-amber-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                        </svg>
                        <span style={{fontFamily:'var(--font-heading)', fontWeight:600, fontSize:'0.82rem', letterSpacing:'0.04em'}}>{item.label}</span>
                      </Link>
                    ))}
                    <div className="my-1 h-px" style={{background:'rgba(255,255,255,0.04)'}} />
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-slate-400 hover:text-red-400 transition-all duration-150 text-left group">
                      <svg className="w-4 h-4 flex-shrink-0 text-slate-600 group-hover:text-red-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                      </svg>
                      <span style={{fontFamily:'var(--font-heading)', fontWeight:600, fontSize:'0.82rem', letterSpacing:'0.04em'}}>Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2.5 rounded-md text-slate-500 hover:text-white transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
            className="md:hidden border-t"
            style={{ background:'rgba(2,3,10,0.98)', borderColor:'rgba(232,185,35,0.07)', backdropFilter:'blur(28px)' }}>
            <div className="px-4 py-3 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-bold tracking-widest uppercase transition-all ${
                    isActive(link.href)
                      ? 'text-amber-400 bg-amber-400/06 border border-amber-400/15'
                      : 'text-slate-500 hover:text-white'
                  }`}
                  style={{fontFamily:'var(--font-heading)', letterSpacing:'0.12em'}}>
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
