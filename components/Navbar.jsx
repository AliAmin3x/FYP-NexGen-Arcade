"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useSession } from "../lib/SessionContext";
import { useRouter } from "next/navigation";

const NAV_LINKS = [
  { href: "/homepage", label: "Store", tag: null },
  { href: "/Games", label: "Browse", tag: null },
  { href: "/freegames", label: "Free", tag: "FREE" },
  { href: "/library", label: "Library", tag: null },
];

const SearchModal = ({ onClose }) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current?.focus(); }, []);
  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) { router.push(`/Games?search=${encodeURIComponent(query)}`); onClose(); }
  };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[200] flex items-start justify-center pt-24"
      style={{ background: 'rgba(3,5,10,0.85)', backdropFilter: 'blur(8px)' }}>
      <motion.div initial={{ opacity: 0, y: -20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.97 }} transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl mx-4 rounded-2xl overflow-hidden"
        style={{ background: 'var(--bg-card)', border: '1px solid rgba(245,200,66,0.2)', boxShadow: '0 40px 100px rgba(0,0,0,0.8), 0 0 60px rgba(245,200,66,0.06)' }}>
        <form onSubmit={handleSearch} className="flex items-center gap-4 p-4">
          <svg className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--gold)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search games, genres, developers..."
            className="flex-1 bg-transparent text-lg outline-none"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }} />
          <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 rounded text-xs" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ESC</kbd>
        </form>
        <div className="px-4 pb-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <p className="text-xs pt-3 pb-2" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>POPULAR SEARCHES</p>
          <div className="flex flex-wrap gap-2">
            {['Elden Ring', 'Call of Duty', 'FIFA 2025', 'Cyberpunk 2077', 'God of War'].map(term => (
              <button key={term} onClick={() => { setQuery(term); }}
                className="tag-pill text-xs">{term}</button>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Navbar = ({ userEmail, username }) => {
  const { user, logout } = useSession();
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const popupRef = useRef(null);

  const displayEmail = userEmail || user?.email;
  const displayName = username || user?.username;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') setShowSearch(false); if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setShowSearch(true); } };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) setShowPopup(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => { await logout(); router.push("/"); };

  return (
    <>
      <AnimatePresence>{showSearch && <SearchModal onClose={() => setShowSearch(false)} />}</AnimatePresence>

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "navbar-glass shadow-2xl shadow-black/70" : "bg-transparent"}`}>
        {/* Top accent line */}
        <div className="h-px w-full" style={{ background: 'linear-gradient(to right, transparent, rgba(245,200,66,0.5) 30%, rgba(61,155,255,0.4) 70%, transparent)' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/homepage" className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-300" style={{ background: 'var(--gold)' }} />
              <Image src="/logo.png" alt="NexGen" width={34} height={34} className="relative z-10 drop-shadow-lg" />
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="text-base font-black tracking-wide" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                NEXGEN<span className="text-gradient-gold">ARCADE</span>
              </span>
              <span className="text-[9px] tracking-[0.25em]" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>PREMIUM STORE</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href}
                className="relative px-4 py-2 text-sm font-medium transition-all duration-200 group flex items-center gap-2 rounded-lg hover:bg-white/[0.04]"
                style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)', letterSpacing: '0.02em' }}>
                <span className="group-hover:text-white transition-colors duration-200">{link.label}</span>
                {link.tag && (
                  <span className="text-[8px] font-black px-1.5 py-0.5 rounded leading-none" style={{ background: 'var(--jade)', color: '#000', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>
                    {link.tag}
                  </span>
                )}
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-px group-hover:w-1/2 transition-all duration-300" style={{ background: 'var(--gold)' }} />
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">

            {/* Search trigger */}
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setShowSearch(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <span className="hidden sm:block text-xs" style={{ fontFamily: 'var(--font-mono)' }}>⌘K</span>
            </motion.button>

            {/* Cart */}
            <Link href="/cart">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="relative p-2.5 rounded-lg transition-all duration-200 hover:bg-white/[0.05]"
                style={{ color: 'var(--text-secondary)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
              </motion.button>
            </Link>

            {/* Wishlist */}
            <Link href="/favorite">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="p-2.5 rounded-lg transition-all duration-200 hover:bg-white/[0.05]"
                style={{ color: 'var(--text-secondary)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </motion.button>
            </Link>

            {/* User dropdown */}
            <div className="relative" ref={popupRef}>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => setShowPopup(!showPopup)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl transition-all duration-200"
                style={{ background: 'rgba(245,200,66,0.07)', border: '1px solid rgba(245,200,66,0.2)' }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                  style={{ background: 'linear-gradient(135deg, var(--gold), #e8a900)', color: '#000', fontFamily: 'var(--font-display)' }}>
                  {displayName ? displayName[0].toUpperCase() : "G"}
                </div>
                <span className="hidden sm:block text-xs font-medium" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
                  {displayName || "Guest"}
                </span>
                <svg className={`w-3 h-3 transition-transform duration-200 ${showPopup ? 'rotate-180' : ''}`} style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </motion.button>

              <AnimatePresence>
                {showPopup && (
                  <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }} transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-68 rounded-2xl overflow-hidden"
                    style={{ background: 'rgba(6,8,16,0.98)', backdropFilter: 'blur(24px)', border: '1px solid rgba(245,200,66,0.15)', boxShadow: '0 30px 70px rgba(0,0,0,0.85), 0 0 50px rgba(245,200,66,0.04)', minWidth: '220px' }}>
                    <div className="p-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-base font-black"
                          style={{ background: 'linear-gradient(135deg, var(--gold), #e8a900)', color: '#000', fontFamily: 'var(--font-display)' }}>
                          {displayName ? displayName[0].toUpperCase() : "G"}
                        </div>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>{displayName || "Guest"}</p>
                          <p className="text-xs truncate max-w-[150px]" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>{displayEmail || "Not signed in"}</p>
                          {user?.role && <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: 'var(--gold)', fontFamily: 'var(--font-mono)' }}>{user.role}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      {[
                        { href: '/account', label: 'Account Settings', icon: 'M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z' },
                        { href: '/library', label: 'My Library', icon: 'M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z' },
                      ].map(item => (
                        <Link key={item.href} href={item.href} onClick={() => setShowPopup(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 text-sm group"
                          style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={item.icon} /></svg>
                          {item.label}
                        </Link>
                      ))}
                      <div className="my-1 mx-2" style={{ height: '1px', background: 'var(--border-subtle)' }} />
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 text-sm text-left"
                        style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,87,34,0.08)'; e.currentTarget.style.color = 'var(--ember)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                        </svg>
                        Switch Role / Log Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile menu toggle */}
            <button className="md:hidden p-2.5 rounded-lg transition-colors" style={{ color: 'var(--text-secondary)' }} onClick={() => setMobileOpen(!mobileOpen)}>
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
              className="md:hidden" style={{ background: 'rgba(3,5,10,0.98)', backdropFilter: 'blur(20px)', borderTop: '1px solid var(--border-subtle)' }}>
              <div className="px-4 py-4 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-150 text-sm font-medium"
                    style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,200,66,0.06)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                    {link.label}
                    {link.tag && <span className="text-[8px] font-black px-1.5 py-0.5 rounded" style={{ background: 'var(--jade)', color: '#000', fontFamily: 'var(--font-mono)' }}>{link.tag}</span>}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;
