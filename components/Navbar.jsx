"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useSession } from "../lib/SessionContext";
import { useRouter } from "next/navigation";

const NAV_LINKS = [
  { href: "/homepage", label: "Store" },
  { href: "/Games", label: "Browse" },
  { href: "/freegames", label: "Free Games" },
  { href: "/library", label: "Library" },
];

const Navbar = ({ userEmail, username }) => {
  const { user, logout } = useSession();
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const popupRef = useRef(null);

  const displayEmail = userEmail || user?.email;
  const displayName = username || user?.username;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "navbar-glass shadow-lg shadow-black/50" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/homepage" className="flex items-center gap-3 group">
          <div className="relative">
            <Image src="/logo.png" alt="NexGen" width={36} height={36} className="relative z-10" />
            <div className="absolute inset-0 bg-cyan-400/20 blur-md rounded-full group-hover:bg-cyan-400/40 transition-all duration-300" />
          </div>
          <span className="font-display text-base sm:text-lg font-bold tracking-wider gradient-text-cyan hidden sm:block" style={{fontFamily: 'var(--font-display)'}}>
            NEXGEN <span className="text-white/60">ARCADE</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href}
              className="relative px-4 py-2 text-sm font-semibold text-slate-300 hover:text-cyan-400 transition-colors duration-200 group tracking-wide"
              style={{fontFamily: 'var(--font-body)', letterSpacing: '0.06em'}}>
              {link.label}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-cyan-400 group-hover:w-4/5 transition-all duration-300" />
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Cart */}
          <Link href="/cart">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="relative p-2 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
            </motion.button>
          </Link>

          {/* Wishlist */}
          <Link href="/favorite">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg text-slate-300 hover:text-pink-400 hover:bg-pink-400/10 transition-all duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </motion.button>
          </Link>

          {/* User */}
          <div className="relative" ref={popupRef}>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setShowPopup(!showPopup)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/40 hover:bg-cyan-400/5 transition-all duration-200">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-xs font-bold text-black">
                {displayName ? displayName[0].toUpperCase() : "G"}
              </div>
              <span className="hidden sm:block text-xs text-slate-300 font-medium" style={{fontFamily: 'var(--font-ui)'}}>
                {displayName || "Guest"}
              </span>
              <svg className={`w-3 h-3 text-slate-400 transition-transform ${showPopup ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </motion.button>

            <AnimatePresence>
              {showPopup && (
                <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-white/10 overflow-hidden"
                  style={{ background: 'rgba(8,11,20,0.97)', backdropFilter: 'blur(20px)', boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 40px rgba(0,212,255,0.05)' }}>
                  <div className="p-4 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-sm font-bold text-black">
                        {displayName ? displayName[0].toUpperCase() : "G"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white" style={{fontFamily:'var(--font-body)'}}>{displayName || "Guest"}</p>
                        <p className="text-xs text-slate-400" style={{fontFamily:'var(--font-ui)'}}>{displayEmail || "Not signed in"}</p>
                        {user?.role && <span className="text-xs text-cyan-400 font-medium capitalize">{user.role}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <Link href="/account" onClick={() => setShowPopup(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-150 text-sm"
                      style={{fontFamily:'var(--font-ui)'}}>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Account Settings
                    </Link>
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-400/5 transition-all duration-150 text-sm text-left"
                      style={{fontFamily:'var(--font-ui)'}}>
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
          <button className="md:hidden p-2 text-slate-300 hover:text-white" onClick={() => setMobileOpen(!mobileOpen)}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              {mobileOpen ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/5" style={{ background: 'rgba(8,11,20,0.97)', backdropFilter: 'blur(20px)' }}>
            <div className="px-4 py-3 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-white/5 transition-all font-semibold tracking-wide text-sm"
                  style={{fontFamily:'var(--font-body)'}}>
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
