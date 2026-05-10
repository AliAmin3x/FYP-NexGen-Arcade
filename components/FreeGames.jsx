"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { SectionHeader } from "./FeaturedGames";

const FALLBACK = [
  { id: 'fr1', title: 'Fortnite', category: 'Battle Royale', price: '0', imageUrl: '/img5.jpg', description: 'Free-to-play battle royale' },
  { id: 'fr2', title: 'Apex Legends', category: 'Battle Royale', price: '0', imageUrl: '/img6.jpg', description: 'Hero shooter' },
  { id: 'fr3', title: 'Valorant', category: 'Action', price: '0', imageUrl: '/img7.jpg', description: 'Tactical FPS' },
  { id: 'fr4', title: 'League of Legends', category: 'Strategy', price: '0', imageUrl: '/img8.jpg', description: 'MOBA classic' },
  { id: 'fr5', title: 'Genshin Impact', category: 'RPG', price: '0', imageUrl: '/img1.jpg', description: 'Open-world RPG' },
];

const FreeGames = () => {
  const router = useRouter();
  const [games, setGames] = useState([]);
  const [favs, setFavs] = useState({});

  useEffect(() => {
    fetch("/api/games?type=free&status=Approved")
      .then(r => r.json())
      .then(data => {
        const arr = Array.isArray(data) ? data : [];
        setGames(arr.length > 0 ? arr : FALLBACK);
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
      body: JSON.stringify({ name: game.title, price: '0', image: game.imageUrl, description: game.description }),
    });
    if (!res.ok) { toast.error("Must be logged in"); return; }
    toast.success("Game added to library!");
  };

  return (
    <section className="py-16 px-4 sm:px-6" style={{background:'var(--bg-primary)'}}>
      <div className="max-w-7xl mx-auto">
        <SectionHeader title="Free to Play" subtitle="No Cost, All Fun" link="/freegames" linkLabel="See All Free Games" />

        {/* Big horizontal scroll strip */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none" style={{scrollbarWidth:'none'}}>
          {games.map((game, i) => (
            <motion.div key={game.id} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="flex-shrink-0 w-52 game-card group cursor-pointer"
              onClick={() => router.push(`/discover?gameId=${game.id}`)}>
              
              <div className="relative w-full h-36 overflow-hidden">
                <Image src={game.imageUrl} alt={game.title} fill style={{objectFit:'cover'}} className="transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                <div className="absolute top-2 left-2">
                  <span className="free-badge">Free</span>
                </div>

                <button onClick={(e) => { e.stopPropagation(); handleFav(game); }}
                  className="absolute top-2 right-2 p-1 rounded bg-black/50 backdrop-blur-sm border border-white/10 hover:border-pink-400/40 transition-all">
                  {favs[game.id] ? <AiFillHeart size={12} className="text-pink-400" /> : <AiOutlineHeart size={12} className="text-white/70" />}
                </button>

                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <p className="text-xs font-bold text-white truncate" style={{fontFamily:'var(--font-body)'}}>{game.title}</p>
                </div>
              </div>

              <div className="p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-emerald-400 font-bold" style={{fontFamily:'var(--font-display)'}}>FREE</span>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={(e) => handleCart(game, e)}
                    className="text-xs px-2.5 py-1 rounded font-bold"
                    style={{
                      background: 'linear-gradient(135deg,#10b981,#059669)',
                      color:'#000',
                      fontFamily:'var(--font-display)',
                      letterSpacing:'0.06em',
                      fontSize:'0.6rem'
                    }}>
                    GET
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FreeGames;
