"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useSession } from "../lib/SessionContext";
import { useRouter, usePathname } from "next/navigation";

const NAV_LINKS = [
  {
    href: "/homepage", label: "Store",
    icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" /></svg>
  },
  {
    href: "/Games", label: "Browse",
    icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
  },
  {
    href: "/freegames", label: "Free",
    icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  },
  {
    href: "/library", label: "Library",
    icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
  },
];

const Navbar = ({ userEmail, username }) => {
  const { user, logout } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [showPopup, setShowPopup] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${scrolled ? "navbar-glass" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">

        {/* ── Logo ── */}
        <Link href="/homepage" className="flex items-center gap-3 group flex-shrink-0">
          <div className="relative w-8 h-8">
            <Image src="/logo.png" alt="NexGen" fill style={{objectFit:'contain'}} className="relative z-10" />
          </div>
          <div className="hidden sm:flex flex-col leading-none gap-[2px]">
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1.15rem',
              letterSpacing: '0.2em',
              lineHeight: 1,
              color: '#ffffff',
              textTransform: 'uppercase',
            }}>
              NEXGEN
            </span>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.55rem',
              letterSpacing: '0.4em',
              color: 'rgba(255,255,255,0.35)',
              lineHeight: 1,
              fontWeight: 500,
              textTransform: 'uppercase',
            }}>ARCADE</span>
          </div>
        </Link>

        {/* ── Desktop Nav ── */}
        <div className="hidden md:flex items-center gap-0.5">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link key={link.href} href={link.href}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-sm transition-all duration-200 ${
                  active ? "text-white" : "text-neutral-500 hover:text-neutral-200"
                }`}
                style={{fontFamily:'var(--font-display)', fontWeight: 600, letterSpacing:'0.1em', fontSize:'0.82rem', textTransform:'uppercase'}}>
                {active && (
                  <motion.div layoutId="nav-active-bg"
                    className="absolute inset-0 rounded-sm"
                    style={{background:'rgba(255,255,255,0.06)'}}
                    transition={{ type:"spring", stiffness:400, damping:38 }}
                  />
                )}
                <span className="relative z-10 opacity-50">{link.icon}</span>
                <span className="relative z-10">{link.label}</span>
                {active && (
                  <motion.div layoutId="nav-indicator"
                    className="absolute bottom-0 left-3 right-3 h-px"
                    style={{background:'rgba(255,255,255,0.5)'}}
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
            <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
              className="btn-icon relative p-2.5 rounded-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-[17px] h-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
            </motion.button>
          </Link>

          {/* Wishlist */}
          <Link href="/favorite">
            <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
              className="btn-icon p-2.5 rounded-sm hover:text-red-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-[17px] h-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </motion.button>
          </Link>

          {/* User dropdown */}
          <div className="relative" ref={popupRef}>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => setShowPopup(!showPopup)}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-sm border transition-all duration-200"
              style={{
                background: showPopup ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)',
                borderColor: showPopup ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)',
              }}>
              {/* Avatar */}
              <div className="w-7 h-7 rounded-sm flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{background:'var(--accent-blue)'}}>
                <span className="text-white" style={{fontFamily:'var(--font-display)', fontWeight:800, fontSize:'0.85rem'}}>
                  {displayName ? displayName[0].toUpperCase() : "G"}
                </span>
              </div>
              <span className="hidden sm:block text-neutral-300"
                style={{fontFamily:'var(--font-display)', fontWeight:600, letterSpacing:'0.08em', maxWidth:'72px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontSize:'0.78rem', textTransform:'uppercase'}}>
                {displayName || "GUEST"}
              </span>
              <svg className={`w-3 h-3 text-neutral-600 transition-transform duration-200 ${showPopup ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </motion.button>

            <AnimatePresence>
              {showPopup && (
                <motion.div
                  initial={{ opacity:0, y:8, scale:0.96 }}
                  animate={{ opacity:1, y:0, scale:1 }}
                  exit={{ opacity:0, y:8, scale:0.96 }}
                  transition={{ duration:0.16, ease:[0.16,1,0.3,1] }}
                  className="absolute right-0 top-full mt-2 w-60 rounded-sm border overflow-hidden z-50"
                  style={{
                    background:'rgba(14,14,14,0.99)',
                    backdropFilter:'blur(24px)',
                    borderColor:'rgba(255,255,255,0.1)',
                    boxShadow:'0 24px 80px rgba(0,0,0,0.9)'
                  }}>

                  {/* User info */}
                  <div className="p-4" style={{borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-sm flex items-center justify-center text-base font-bold text-white flex-shrink-0"
                        style={{background:'var(--accent-blue)'}}>
                        <span style={{fontFamily:'var(--font-display)', fontWeight:800, fontSize:'1rem'}}>
                          {displayName ? displayName[0].toUpperCase() : "G"}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white truncate" style={{fontFamily:'var(--font-display)', letterSpacing:'0.06em', fontSize:'0.88rem', textTransform:'uppercase'}}>
                          {displayName || "GUEST"}
                        </p>
                        <p className="text-xs text-neutral-500 truncate mt-0.5" style={{fontFamily:'var(--font-mono)', fontSize:'0.62rem'}}>
                          {displayEmail || "Not signed in"}
                        </p>
                        {user?.role && (
                          <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-sm text-xs font-bold uppercase tracking-wider"
                            style={{
                              color:'#fff',
                              fontFamily:'var(--font-display)',
                              fontSize:'0.6rem',
                              background:'var(--accent-blue)',
                              letterSpacing:'0.1em',
                            }}>
                            {user.role}
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
                      { href:'/favorite', label:'Wishlist',         icon:'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z' },
                    ].map(item => (
                      <Link key={item.href} href={item.href} onClick={() => setShowPopup(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-neutral-400 hover:text-white hover:bg-white/5 transition-all duration-150 group">
                        <svg className="w-4 h-4 flex-shrink-0 text-neutral-600 group-hover:text-neutral-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                        </svg>
                        <span style={{fontFamily:'var(--font-body)', fontWeight:500, fontSize:'0.85rem'}}>{item.label}</span>
                      </Link>
                    ))}
                    <div className="my-1 divider-gold" />
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-neutral-400 hover:text-red-400 hover:bg-red-500/5 transition-all duration-150 text-left group">
                      <svg className="w-4 h-4 flex-shrink-0 text-neutral-600 group-hover:text-red-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                      </svg>
                      <span style={{fontFamily:'var(--font-body)', fontWeight:500, fontSize:'0.85rem'}}>Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden btn-icon p-2.5 rounded-sm" onClick={() => setMobileOpen(!mobileOpen)}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
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
          <motion.div
            initial={{ opacity:0, height:0 }}
            animate={{ opacity:1, height:'auto' }}
            exit={{ opacity:0, height:0 }}
            className="md:hidden border-t overflow-hidden"
            style={{ background:'rgba(10,10,10,0.98)', borderColor:'rgba(255,255,255,0.07)', backdropFilter:'blur(24px)' }}>
            <div className="px-4 py-3 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-bold tracking-wider uppercase transition-all ${
                    isActive(link.href)
                      ? 'text-white bg-white/6 border border-white/10'
                      : 'text-neutral-500 hover:text-white hover:bg-white/4'
                  }`}
                  style={{fontFamily:'var(--font-display)', letterSpacing:'0.1em', fontSize:'0.82rem'}}>
                  <span className="opacity-60">{link.icon}</span>
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
