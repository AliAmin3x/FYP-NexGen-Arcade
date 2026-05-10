"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const LINKS = {
  Store: [
    { label: 'Browse Games', href: '/Games' },
    { label: 'Free Games', href: '/freegames' },
    { label: 'Featured', href: '/featuredGames' },
    { label: 'New Releases', href: '/Games' },
  ],
  Account: [
    { label: 'My Library', href: '/library' },
    { label: 'Wishlist', href: '/favorite' },
    { label: 'Cart', href: '/cart' },
    { label: 'Settings', href: '/account' },
  ],
  Company: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Contact Us', href: '#' },
    { label: 'Developer Portal', href: '/developer' },
  ],
};

const Footer = () => (
  <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid rgba(0,212,255,0.08)' }}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <Link href="/homepage" className="flex items-center gap-2 mb-4">
            <Image src="/logo.png" alt="NexGen" width={32} height={32} />
            <span className="font-bold text-white tracking-widest text-sm" style={{ fontFamily: 'var(--font-display)' }}>
              NEXGEN
            </span>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed mb-5" style={{ fontFamily: 'var(--font-ui)' }}>
            Your premier destination for digital games. Discover, buy, and play the best titles across all genres.
          </p>
          <div className="flex gap-3">
            {['Twitter', 'Discord', 'YouTube'].map((social) => (
              <motion.a key={social} href="#" whileHover={{ scale: 1.1, y: -2 }}
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:border-cyan-400/40 hover:bg-cyan-400/10 transition-all duration-200 text-slate-400 hover:text-cyan-400">
                <span className="text-xs" style={{ fontFamily: 'var(--font-display)', fontSize: '0.55rem', letterSpacing: '0.05em' }}>{social[0]}</span>
              </motion.a>
            ))}
          </div>
        </div>

        {/* Links */}
        {Object.entries(LINKS).map(([section, links]) => (
          <div key={section}>
            <h4 className="text-xs font-bold tracking-widest uppercase mb-4 text-slate-300" style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.15em' }}>
              {section}
            </h4>
            <ul className="space-y-2.5">
              {links.map(link => (
                <li key={link.label}>
                  <Link href={link.href}
                    className="text-xs text-slate-500 hover:text-cyan-400 transition-colors duration-200"
                    style={{ fontFamily: 'var(--font-ui)' }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-600" style={{ fontFamily: 'var(--font-ui)' }}>
          © {new Date().getFullYear()} NexGen Arcade. All rights reserved.
        </p>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-slate-500" style={{ fontFamily: 'var(--font-ui)' }}>
            All systems operational
          </span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
