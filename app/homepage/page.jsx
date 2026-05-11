"use client";
import React from "react";
import HeroSection from "../../components/HeroSection";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import RecommendedGames from "../../components/RecommendedGames";
import FeaturedGames from "../../components/FeaturedGames";
import FreeGames from "../../components/FreeGames";
import SearchBar from "../../components/SearchBar";
import { motion } from "framer-motion";
import { useSession } from "../../lib/SessionContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GENRES = [
  { name:'Action',        icon:'⚔️', accent:'#e8192c', rgb:'232,25,44' },
  { name:'Adventure',     icon:'🗺️', accent:'#f97316', rgb:'249,115,22' },
  { name:'RPG',           icon:'🧙', accent:'#a855f7', rgb:'168,85,247' },
  { name:'Strategy',      icon:'♟️', accent:'#3b82f6', rgb:'59,130,246' },
  { name:'Sports',        icon:'⚽', accent:'#10b981', rgb:'16,185,129' },
  { name:'Racing',        icon:'🏎️', accent:'#f59e0b', rgb:'245,158,11' },
  { name:'Puzzle',        icon:'🧩', accent:'#ec4899', rgb:'236,72,153' },
  { name:'Simulation',    icon:'🏙️', accent:'#14b8a6', rgb:'20,184,166' },
  { name:'Battle Royale', icon:'🎯', accent:'#dc2626', rgb:'220,38,38' },
  { name:'Open-World',    icon:'🌍', accent:'#7c3aed', rgb:'124,58,237' },
];

const GenreSection = () => (
  <section className="py-20 px-4 sm:px-6 relative" style={{background:'var(--bg-secondary)'}}>
    <div className="absolute inset-0 grid-lines opacity-30 pointer-events-none" />
    <div className="max-w-7xl mx-auto relative z-10">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1 h-4 rounded-full" style={{background:'linear-gradient(to bottom, var(--accent-red), var(--accent-gold))'}} />
          <span className="section-label">Categories</span>
        </div>
        <h2 className="section-heading text-3xl sm:text-4xl text-white">Browse by Genre</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {GENRES.map((genre, i) => (
          <motion.a key={genre.name} href={`/Games?category=${genre.name}`}
            initial={{ opacity:0, scale:0.88, y:16 }}
            whileInView={{ opacity:1, scale:1, y:0 }}
            viewport={{ once:true }}
            transition={{ delay:i * 0.045, duration:0.5, ease:[0.16,1,0.3,1] }}
            whileHover={{ scale:1.05, y:-4 }}
            whileTap={{ scale:0.97 }}
            className="group flex flex-col items-center gap-3 p-5 rounded-2xl cursor-pointer transition-all duration-300 relative overflow-hidden"
            style={{
              background:`rgba(${genre.rgb},0.06)`,
              border:`1px solid rgba(${genre.rgb},0.16)`,
            }}>
            {/* Hover glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{background:`radial-gradient(ellipse 100% 100% at 50% 50%, rgba(${genre.rgb},0.1), transparent 70%)`}} />

            <span className="relative z-10 text-3xl filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
              {genre.icon}
            </span>
            <span className="relative z-10 text-center font-bold transition-colors duration-200"
              style={{
                fontFamily:'var(--font-display)',
                letterSpacing:'0.08em',
                fontSize:'0.68rem',
                textTransform:'uppercase',
                color:`rgba(${genre.rgb},0.9)`,
              }}>
              {genre.name}
            </span>
          </motion.a>
        ))}
      </div>
    </div>
  </section>
);

const STATS = [
  { number:'1,200+', label:'Games Available',     icon:'🎮' },
  { number:'50K+',   label:'Players Worldwide',   icon:'🌍' },
  { number:'100+',   label:'Free-to-Play',         icon:'🆓' },
  { number:'4.9★',  label:'Average Rating',       icon:'⭐' },
];

const StatsBar = () => (
  <div className="py-12 px-4 sm:px-6 relative overflow-hidden" style={{
    background:'linear-gradient(135deg, rgba(6,182,212,0.03), rgba(124,58,237,0.03))',
    borderTop:'1px solid rgba(255,255,255,0.04)',
    borderBottom:'1px solid rgba(255,255,255,0.04)',
  }}>
    {/* Ambient glows */}
    <div className="absolute inset-0 pointer-events-none">
      <div style={{position:'absolute', left:'15%', top:'50%', transform:'translateY(-50%)', width:240, height:120, background:'radial-gradient(ellipse, rgba(6,182,212,0.08), transparent 70%)', filter:'blur(20px)'}} />
      <div style={{position:'absolute', right:'15%', top:'50%', transform:'translateY(-50%)', width:240, height:120, background:'radial-gradient(ellipse, rgba(124,58,237,0.08), transparent 70%)', filter:'blur(20px)'}} />
    </div>

    <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 relative z-10">
      {STATS.map((stat, i) => (
        <motion.div key={i}
          initial={{ opacity:0, y:16 }}
          whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }}
          transition={{ delay:i * 0.1, duration:0.5 }}
          className="text-center group">
          <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">{stat.icon}</div>
          <p className="text-2xl sm:text-3xl font-black mb-1 gradient-ice"
            style={{fontFamily:'var(--font-display)', letterSpacing:'-0.02em'}}>
            {stat.number}
          </p>
          <p style={{fontFamily:'var(--font-mono)', fontSize:'0.6rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--text-muted)'}}>
            {stat.label}
          </p>
        </motion.div>
      ))}
    </div>
  </div>
);

const DealBanner = () => (
  <section className="px-4 sm:px-6 py-8">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
        className="relative overflow-hidden rounded-2xl px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6"
        style={{
          background:'linear-gradient(135deg, rgba(232,25,44,0.12) 0%, rgba(240,192,64,0.08) 50%, rgba(124,58,237,0.1) 100%)',
          border:'1px solid rgba(240,192,64,0.15)',
        }}>
        {/* Decorative */}
        <div className="absolute inset-0 grid-lines opacity-20 pointer-events-none" />
        <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full pointer-events-none" style={{background:'radial-gradient(circle, rgba(240,192,64,0.1), transparent 70%)'}} />

        <div className="relative z-10 text-center md:text-left">
          <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
            <span className="badge-hot px-3 py-1">⚡ Flash Sale</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white mb-1" style={{fontFamily:'var(--font-display)', letterSpacing:'-0.01em'}}>
            Up to <span className="gradient-fire">70% OFF</span> Select Titles
          </h3>
          <p style={{fontFamily:'var(--font-body)', fontSize:'0.9rem', color:'var(--text-secondary)'}}>
            Limited time deals on top-rated games. Don't miss out.
          </p>
        </div>

        <motion.a href="/Games"
          whileHover={{scale:1.04}} whileTap={{scale:0.97}}
          className="btn-gold px-8 py-3.5 text-sm relative z-10 flex-shrink-0"
          style={{letterSpacing:'0.1em'}}>
          Shop Deals Now
        </motion.a>
      </motion.div>
    </div>
  </section>
);

const DevCTA = () => (
  <section className="py-20 px-4 sm:px-6 relative overflow-hidden">
    <div className="absolute inset-0" style={{
      backgroundImage:'radial-gradient(ellipse 40% 55% at 20% 50%, rgba(6,182,212,0.07) 0%, transparent 55%), radial-gradient(ellipse 40% 55% at 80% 50%, rgba(124,58,237,0.07) 0%, transparent 55%)'
    }} />
    <div className="absolute inset-0 grid-lines opacity-20 pointer-events-none" />

    <motion.div
      initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
      className="max-w-3xl mx-auto text-center relative z-10">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="h-px w-12" style={{background:'linear-gradient(to right, transparent, rgba(6,182,212,0.5))'}} />
        <span className="section-label">Developer Portal</span>
        <div className="h-px w-12" style={{background:'linear-gradient(to left, transparent, rgba(6,182,212,0.5))'}} />
      </div>

      <h2 className="text-3xl sm:text-4xl font-black text-white mb-4"
        style={{fontFamily:'var(--font-display)', letterSpacing:'-0.01em'}}>
        Publish Your Game on<br />
        <span className="gradient-ice">NexGen Arcade</span>
      </h2>
      <p style={{fontFamily:'var(--font-body)', fontSize:'0.95rem', color:'var(--text-secondary)', lineHeight:1.7, marginBottom:'2rem'}}>
        Join our developer community. Upload, manage, and monetize your games with powerful tools and real-time analytics.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <motion.a href="/developer" whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
          className="btn-primary px-8 py-4 text-sm inline-flex items-center gap-2 justify-center"
          style={{letterSpacing:'0.1em'}}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          Start Publishing
        </motion.a>
        <motion.a href="/Games" whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
          className="btn-ghost px-8 py-4 text-sm inline-flex items-center gap-2 justify-center"
          style={{letterSpacing:'0.1em'}}>
          Explore Store
        </motion.a>
      </div>
    </motion.div>
  </section>
);

const HomePage = () => {
  const { user } = useSession();
  return (
    <div style={{background:'var(--bg-primary)', minHeight:'100vh'}}>
      <Navbar userEmail={user?.email} username={user?.username} />
      <HeroSection />

      {/* Search bar */}
      <div className="py-8 px-4 sm:px-6" style={{background:'var(--bg-secondary)', borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
        <div className="max-w-7xl mx-auto">
          <SearchBar />
        </div>
      </div>

      <DealBanner />
      <GenreSection />
      <StatsBar />
      <FeaturedGames />
      <RecommendedGames />
      <FreeGames />
      <DevCTA />
      <Footer />

      <ToastContainer position="bottom-right" autoClose={3000} theme="dark"
        toastStyle={{
          background:'var(--bg-card)',
          border:'1px solid rgba(240,192,64,0.15)',
          fontFamily:'var(--font-body)',
          borderRadius:'12px',
        }} />
    </div>
  );
};

export default HomePage;
