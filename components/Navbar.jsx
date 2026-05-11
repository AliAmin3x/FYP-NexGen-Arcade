"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useSession } from "../lib/SessionContext";
import { useRouter, usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/homepage", label: "Store" },
  { href: "/Games", label: "Browse" },
  { href: "/freegames", label: "Free" },
  { href: "/library", label: "Library" },
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
  const displayName = username || user?.username;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "navbar-glass shadow-xl" : "bg-transparent"}`}>
      {/* Top accent line */}
      <div className="h-px w-full" style={{background:'linear-gradient(to right, transparent, rgba(245,200,66,0.5), rgba(0,229,255,0.3), transparent)'}} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/homepage" className="flex items-center gap-3 group flex-shrink-0">
          <div className="relative w-8 h-8">
            <Image src="/logo.png" alt="NexGen" fill style={{objectFit:'contain'}} className="relative z-10 drop-shadow-lg" />
            <div className="absolute inset-0 bg-arcade-gold/20 blur-lg rounded-full group-hover:bg-arcade-gold/40 transition-all duration-300 scale-150" />
          </div>
          <div className="hidden sm:flex flex-col leading-none">
            <span className="gradient-gold font-display text-sm font-800 tracking-widest" style={{fontFamily:'var(--font-display)', fontWeight:800, letterSpacing:'0.15em'}}>
              NEXGEN
            </span>
            <span className="text-white/40 font-mono text-xs tracking-[0.25em]" style={{fontFamily:'var(--font-mono)', fontSize:'0.55rem'}}>
              ARCADE
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link key={link.href} href={link.href}
                className={`relative px-4 py-2 text-xs font-semibold tracking-widest uppercase transition-all duration-200 rounded-lg ${
                  active
                    ? "text-arcade-gold bg-arcade-gold/8"
                    : "text-slate-400 hover:text-white hover:bg-white/4"
                }`}
                style={{fontFamily:'var(--font-display)', letterSpacing:'0.1em'}}>
                {link.label}
                {active && (
                  <motion.span layoutId="nav-underline"
                    className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-px w-4/5 rounded-full"
                    style={{background:'var(--accent-gold)'}} />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">

          {/* Cart */}
          <Link href="/cart">
            <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
              className="relative p-2 rounded-xl text-slate-400 hover:text-arcade-gold transition-all duration-200 hover:bg-arcade-gold/8 border border-transparent hover:border-arcade-gold/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
            </motion.button>
          </Link>

          {/* Wishlist */}
          <Link href="/favorite">
            <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 transition-all duration-200 hover:bg-rose-400/8 border border-transparent hover:border-rose-400/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </motion.button>
          </Link>

          {/* User Dropdown */}
          <div className="relative" ref={popupRef}>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => setShowPopup(!showPopup)}
              className="flex items-center gap-2.5 pl-2.5 pr-3.5 py-2 rounded-xl border transition-all duration-200"
              style={{
                background: showPopup ? 'rgba(245,200,66,0.08)' : 'rgba(255,255,255,0.03)',
                borderColor: showPopup ? 'rgba(245,200,66,0.4)' : 'rgba(255,255,255,0.07)',
              }}>
              {/* Avatar */}
              <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-black flex-shrink-0"
                style={{background:'linear-gradient(135deg, #f5c842, #c9a22e)'}}>
                {displayName ? displayName[0].toUpperCase() : "G"}
              </div>
              <span className="hidden sm:block text-xs font-semibold text-slate-300" style={{fontFamily:'var(--font-body)', maxWidth:'80px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
                {displayName || "Guest"}
              </span>
              <svg className={`w-3 h-3 text-slate-500 transition-transform duration-200 ${showPopup ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </motion.button>

            <AnimatePresence>
              {showPopup && (
                <motion.div initial={{ opacity: 0, y: 10, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.94 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-full mt-2.5 w-64 rounded-2xl border overflow-hidden z-50"
                  style={{ background:'rgba(4,6,13,0.98)', backdropFilter:'blur(24px)', borderColor:'rgba(245,200,66,0.12)', boxShadow:'0 30px 70px rgba(0,0,0,0.9), 0 0 50px rgba(245,200,66,0.04)' }}>

                  {/* User info */}
                  <div className="p-4" style={{borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-black"
                        style={{background:'linear-gradient(135deg, #f5c842, #c9a22e)'}}>
                        {displayName ? displayName[0].toUpperCase() : "G"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate" style={{fontFamily:'var(--font-display)'}}>{displayName || "Guest"}</p>
                        <p className="text-xs text-slate-500 truncate" style={{fontFamily:'var(--font-body)'}}>{displayEmail || "Not signed in"}</p>
                        {user?.role && <span className="text-xs font-semibold capitalize" style={{color:'var(--accent-gold)'}}>{user.role}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="p-1.5">
                    {[
                      { href:'/account', icon:'M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z', label:'Account Settings' },
                      { href:'/library', icon:'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25', label:'My Library' },
                    ].map(item => (
                      <Link key={item.href} href={item.href} onClick={() => setShowPopup(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/4 transition-all duration-150"
                        style={{fontFamily:'var(--font-body)', fontSize:'0.85rem'}}>
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                        </svg>
                        {item.label}
                      </Link>
                    ))}
                    <div className="my-1 h-px" style={{background:'rgba(255,255,255,0.04)'}} />
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-400/5 transition-all duration-150 text-left"
                      style={{fontFamily:'var(--font-body)', fontSize:'0.85rem'}}>
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white" onClick={() => setMobileOpen(!mobileOpen)}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t" style={{ background: 'rgba(4,6,13,0.98)', borderColor:'rgba(245,200,66,0.08)', backdropFilter:'blur(24px)' }}>
            <div className="px-4 py-3 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold tracking-widest uppercase transition-all ${
                    isActive(link.href) ? 'text-arcade-gold bg-arcade-gold/8' : 'text-slate-400 hover:text-white hover:bg-white/4'
                  }`}
                  style={{fontFamily:'var(--font-display)', letterSpacing:'0.1em'}}>
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
