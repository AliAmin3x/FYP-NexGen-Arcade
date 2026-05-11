"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const LINKS = {
  Store: [
    { label:'Browse Games',  href:'/Games' },
    { label:'Free to Play',  href:'/freegames' },
    { label:'Featured',      href:'/featuredGames' },
    { label:'New Releases',  href:'/Games' },
  ],
  Account: [
    { label:'My Library',    href:'/library' },
    { label:'Wishlist',      href:'/favorite' },
    { label:'Cart',          href:'/cart' },
    { label:'Settings',      href:'/account' },
  ],
  Company: [
    { label:'Privacy Policy',    href:'#' },
    { label:'Terms of Service',  href:'#' },
    { label:'Contact Us',        href:'#' },
    { label:'Developer Portal',  href:'/developer' },
  ],
};

const SOCIAL_ICONS = {
  Twitter: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  Discord: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026c.462-.62.874-1.275 1.226-1.963.021-.04.001-.088-.041-.104a13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028z"/>
    </svg>
  ),
  YouTube: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
};

const Footer = () => (
  <footer className="relative" style={{ background:'var(--bg-void)', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
    {/* Top accent line */}
    <div className="h-px w-full" style={{
      background:'linear-gradient(to right, transparent 0%, rgba(232,25,44,0.5) 25%, rgba(232,185,35,0.6) 50%, rgba(105,51,255,0.4) 75%, transparent 100%)'
    }} />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12">

        {/* Brand */}
        <div className="col-span-2 md:col-span-1 flex flex-col gap-5">
          <Link href="/homepage" className="flex items-center gap-3 group w-fit">
            <div className="relative w-9 h-9 flex-shrink-0">
              <div className="absolute inset-0 bg-red-500/15 blur-lg rounded-full group-hover:bg-red-500/30 transition-all scale-150" />
              <Image src="/logo.png" alt="NexGen" fill style={{objectFit:'contain'}} className="relative z-10" />
            </div>
            <div className="flex flex-col leading-none gap-0.5">
              <span className="text-white tracking-[0.2em]" style={{fontFamily:'Barlow Condensed', sans-serif, fontSize:'1.1rem', lineHeight:1}}>
                NEXGEN
              </span>
              <span style={{fontFamily:'JetBrains Mono', monospace, fontSize:'0.5rem', letterSpacing:'0.4em', color:'rgba(232,25,44,0.6)', lineHeight:1}}>
                ARCADE
              </span>
            </div>
          </Link>

          <p style={{fontFamily:'DM Sans', sans-serif, fontSize:'0.82rem', lineHeight:1.65, color:'var(--text-muted)', fontWeight:300}}>
            Your premier destination for digital games. Discover, buy, and play the best titles across all genres.
          </p>

          {/* Social icons */}
          <div className="flex gap-2.5 mt-1">
            {Object.entries(SOCIAL_ICONS).map(([name, icon]) => (
              <motion.a key={name} href="#" whileHover={{ scale:1.12, y:-2 }}
                className="w-9 h-9 rounded flex items-center justify-center transition-all duration-200 text-slate-500 hover:text-amber-400"
                style={{background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)'}}>
                {icon}
              </motion.a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(LINKS).map(([section, links]) => (
          <div key={section} className="flex flex-col gap-4">
            <h4 style={{
              fontFamily:'Barlow Condensed', sans-serif,
              fontWeight:700,
              fontSize:'0.78rem',
              letterSpacing:'0.2em',
              textTransform:'uppercase',
              color:'var(--text-secondary)'
            }}>
              {section}
            </h4>
            <ul className="flex flex-col gap-2.5">
              {links.map(link => (
                <li key={link.label}>
                  <Link href={link.href}
                    className="transition-colors duration-200 hover:text-amber-400"
                    style={{fontFamily:'DM Sans', sans-serif, fontSize:'0.82rem', color:'var(--text-muted)', fontWeight:300}}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="mt-14 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{borderTop:'1px solid rgba(255,255,255,0.04)'}}>
        <p style={{fontFamily:'JetBrains Mono', monospace, fontSize:'0.62rem', letterSpacing:'0.14em', color:'var(--text-muted)'}}>
          © {new Date().getFullYear()} NEXGEN ARCADE. ALL RIGHTS RESERVED.
        </p>
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span style={{fontFamily:'JetBrains Mono', monospace, fontSize:'0.6rem', letterSpacing:'0.18em', color:'var(--text-muted)'}}>
            ALL SYSTEMS OPERATIONAL
          </span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
