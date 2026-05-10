"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { SectionHeader } from "./FeaturedGames";

const FALLBACK = [
  { id: 'r1', title: 'Baldur\'s Gate 3', category: 'RPG', price: '7499', imageUrl: '/img1.jpg', description: 'Deep CRPG' },
  { id: 'r2', title: 'Hogwarts Legacy', category: 'Adventure', price: '5999', imageUrl: '/img2.jpg', description: 'Magical RPG' },
  { id: 'r3', title: 'Starfield', category: 'Open-World', price: '6999', imageUrl: '/img3.jpg', description: 'Space exploration' },
  { id: 'r4', title: 'Lies of P', category: 'Action', price: '4299', imageUrl: '/img4.jpg', description: 'Soulslike action' },
];

const RecommendedGames = () => {
  const router = useRouter();
  const [games, setGames] = useState([]);
  const [favs, setFavs] = useState({});

  useEffect(() => {
    fetch("/api/games?type=recommended&status=Approved")
      .then(r => r.json())
      .then(data => {
        const arr = Array.isArray(data) ? data : [];
        const shuffled = [...arr].sort(() => 0.5 - Math.random()).slice(0, 4);
        setGames(shuffled.length > 0 ? shuffled : FALLBACK);
      })
      .catch(() => setGames(FALLBACK));
  }, []);

  const handleFav = async (game) => {
    if (favs[game.id]) { toast.info("Remove via Favourites page"); return; }
    const res = await fetch("/api/favorites", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId: game.id, name: game.title, price: game.price, image: game.imageUrl }),
    });
    if (!res.ok) { toast.error("Must be logged in"); return; }
    setFavs(p => ({...p, [game.id]: true}));
    toast.success("Added to wishlist!");
  };

  const handleCart = async (game, e) => {
    e.stopPropagation();
    const res = await fetch("/api/cart", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: game.title, price: game.price, image: game.imageUrl, description: game.description }),
    });
    if (!res.ok) { toast.error("Must be logged in"); return; }
    toast.success("Added to cart!");
  };

  return (
    <section className="py-16 px-4 sm:px-6" style={{background:'linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 50%, var(--bg-primary) 100%)'}}>
      <div className="max-w-7xl mx-auto">
        <SectionHeader title="Recommended for You" subtitle="Based on Your Taste" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.map((game, i) => (
            <motion.div key={game.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.4 }}
              className="game-card group cursor-pointer" onClick={() => router.push(`/discover?gameId=${game.id}`)}>
              
              <div className="relative aspect-video overflow-hidden">
                <Image src={game.imageUrl} alt={game.title} fill style={{objectFit:'cover'}} className="transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                
                {/* Category pill */}
                {game.category && (
                  <div className="absolute top-2 left-2">
                    <span className="genre-badge">{game.category}</span>
                  </div>
                )}

                {/* Fav */}
                <button onClick={(e) => { e.stopPropagation(); handleFav(game); }}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 backdrop-blur-sm border border-white/10 hover:border-pink-400/40 transition-all">
                  {favs[game.id] ? <AiFillHeart size={14} className="text-pink-400" /> : <AiOutlineHeart size={14} className="text-white/70" />}
                </button>

                {/* Price overlay */}
                <div className="absolute bottom-2 left-2">
                  <span className="text-sm font-bold gradient-text-cyan" style={{fontFamily:'var(--font-display)'}}>
                    {!game.price || game.price === '0' ? 'FREE' : `PKR ${game.price}`}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-white font-bold mb-3 group-hover:text-cyan-400 transition-colors" style={{fontFamily:'var(--font-body)', fontSize:'1rem'}}>
                  {game.title}
                </h3>
                <p className="text-xs text-slate-400 mb-4 line-clamp-2 leading-relaxed" style={{fontFamily:'var(--font-ui)'}}>
                  {game.description || "An epic gaming experience awaits you."}
                </p>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={(e) => handleCart(game, e)}
                  className="w-full py-2.5 rounded-lg text-xs font-bold tracking-wider transition-all duration-200"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(59,130,246,0.15))',
                    border: '1px solid rgba(0,212,255,0.3)',
                    color: '#00d4ff',
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '0.08em'
                  }}>
                  ADD TO CART
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendedGames;
