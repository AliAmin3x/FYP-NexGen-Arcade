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

const GENRES = ['Action','Adventure','RPG','Strategy','Sports','Racing','Puzzle','Simulation','Battle Royale','Open-World'];

const GenreSection = () => {
  const ICONS = { Action:'⚔️', Adventure:'🗺️', RPG:'🧙', Strategy:'♟️', Sports:'⚽', Racing:'🏎️', Puzzle:'🧩', Simulation:'🏙️', 'Battle Royale':'🎯', 'Open-World':'🌍' };
  const COLORS = {
    Action:'from-red-500/20 to-red-900/10 border-red-500/20',
    Adventure:'from-orange-500/20 to-orange-900/10 border-orange-500/20',
    RPG:'from-purple-500/20 to-purple-900/10 border-purple-500/20',
    Strategy:'from-blue-500/20 to-blue-900/10 border-blue-500/20',
    Sports:'from-emerald-500/20 to-emerald-900/10 border-emerald-500/20',
    Racing:'from-yellow-500/20 to-yellow-900/10 border-yellow-500/20',
    Puzzle:'from-pink-500/20 to-pink-900/10 border-pink-500/20',
    Simulation:'from-teal-500/20 to-teal-900/10 border-teal-500/20',
    'Battle Royale':'from-red-600/20 to-red-900/10 border-red-600/20',
    'Open-World':'from-indigo-500/20 to-indigo-900/10 border-indigo-500/20',
  };

  return (
    <section className="py-16 px-4 sm:px-6" style={{background:'var(--bg-secondary)'}}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="text-xs tracking-widest text-cyan-400 uppercase mb-2" style={{fontFamily:'var(--font-display)'}}>◆ Game Categories</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white" style={{fontFamily:'var(--font-display)'}}>Browse by Genre</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {GENRES.map((genre, i) => (
            <motion.a key={genre} href={`/Games?category=${genre}`}
              initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.04, y: -3 }}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br ${COLORS[genre]} border cursor-pointer transition-all duration-200 hover:shadow-lg`}>
              <span className="text-2xl">{ICONS[genre]}</span>
              <span className="text-xs font-bold text-white/80 text-center" style={{fontFamily:'var(--font-display)', letterSpacing:'0.06em', fontSize:'0.65rem', textTransform:'uppercase'}}>
                {genre}
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

const StatsBar = () => (
  <div className="py-10 px-4 sm:px-6 border-y" style={{ borderColor: 'rgba(0,212,255,0.06)', background: 'linear-gradient(135deg, rgba(0,212,255,0.02), rgba(59,130,246,0.02))' }}>
    <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
      {[
        { number: '1,200+', label: 'Games Available' },
        { number: '50K+', label: 'Players Worldwide' },
        { number: '100+', label: 'Free-to-Play' },
        { number: '4.9★', label: 'Average Rating' },
      ].map((stat, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
          <p className="text-2xl sm:text-3xl font-black gradient-text-cyan" style={{fontFamily:'var(--font-display)'}}>{stat.number}</p>
          <p className="text-xs text-slate-400 mt-1 tracking-widest uppercase" style={{fontFamily:'var(--font-ui)', letterSpacing:'0.1em'}}>{stat.label}</p>
        </motion.div>
      ))}
    </div>
  </div>
);

const HomePage = () => {
  const { user } = useSession();
  return (
    <div style={{background:'var(--bg-primary)', minHeight:'100vh'}}>
      <Navbar userEmail={user?.email} username={user?.username} />
      <HeroSection />
      
      {/* Search floating bar */}
      <div className="py-8 px-4 sm:px-6" style={{background:'var(--bg-secondary)'}}>
        <div className="max-w-7xl mx-auto">
          <SearchBar />
        </div>
      </div>

      <GenreSection />
      <StatsBar />
      <FeaturedGames />
      <RecommendedGames />
      <FreeGames />

      {/* CTA Banner */}
      <section className="py-20 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0" style={{background:'linear-gradient(135deg, rgba(0,212,255,0.06), rgba(139,92,246,0.06))'}} />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(0,212,255,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(139,92,246,0.08) 0%, transparent 50%)'
        }} />
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center relative z-10">
          <p className="text-xs tracking-widest text-cyan-400 uppercase mb-3" style={{fontFamily:'var(--font-display)', letterSpacing:'0.2em'}}>◆ Developer Portal</p>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4" style={{fontFamily:'var(--font-display)'}}>
            Publish Your Game on<br />
            <span className="gradient-text-cyan">NexGen Arcade</span>
          </h2>
          <p className="text-slate-400 mb-8 text-sm leading-relaxed" style={{fontFamily:'var(--font-ui)'}}>
            Join our developer community. Upload, manage, and monetize your games with powerful tools and real-time analytics.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.a href="/developer" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className="btn-primary px-8 py-4 text-sm inline-flex items-center gap-2 justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Start Publishing
            </motion.a>
            <motion.a href="/Games" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className="btn-ghost px-8 py-4 text-sm inline-flex items-center gap-2 justify-center">
              Explore Store
            </motion.a>
          </div>
        </motion.div>
      </section>

      <Footer />
      <ToastContainer position="bottom-right" autoClose={3000} theme="dark"
        toastStyle={{ background: 'var(--bg-card)', border: '1px solid rgba(0,212,255,0.2)', fontFamily: 'var(--font-body)' }} />
    </div>
  );
};

export default HomePage;
