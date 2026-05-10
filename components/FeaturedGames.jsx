"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import GameCard from "./GameCard";

// Fallback games when DB is empty
const FALLBACK_GAMES = [
  { id: 'f1', title: 'Elden Ring', category: 'RPG', price: '6999', imageUrl: '/img1.jpg', description: 'Open-world action RPG' },
  { id: 'f2', title: 'Call of Duty: MW3', category: 'Action', price: '7999', imageUrl: '/img2.jpg', description: 'FPS military shooter' },
  { id: 'f3', title: 'Red Dead Redemption 2', category: 'Adventure', price: '4999', imageUrl: '/img3.jpg', description: 'Epic western' },
  { id: 'f4', title: 'FIFA 2024', category: 'Sports', price: '5499', imageUrl: '/img4.jpg', description: 'Football simulation' },
  { id: 'f5', title: 'Cyberpunk 2077', category: 'Open-World', price: '3999', imageUrl: '/img7.jpg', description: 'Cyberpunk RPG' },
  { id: 'f6', title: 'God of War Ragnarök', category: 'Action', price: '8999', imageUrl: '/img8.jpg', description: 'Norse mythology adventure' },
];

const SectionHeader = ({ title, subtitle, link, linkLabel }) => {
  const router = useRouter();
  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        <p className="text-xs tracking-widest text-cyan-400 uppercase mb-2" style={{fontFamily:'var(--font-display)'}}>
          ◆ {subtitle}
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-white section-heading" style={{fontFamily:'var(--font-display)'}}>
          {title}
        </h2>
      </div>
      {link && (
        <button onClick={() => router.push(link)}
          className="text-xs text-slate-400 hover:text-cyan-400 transition-colors duration-200 flex items-center gap-1.5 pb-1"
          style={{fontFamily:'var(--font-display)', letterSpacing:'0.08em', textTransform:'uppercase'}}>
          {linkLabel}
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
};

const FeaturedGames = () => {
  const router = useRouter();
  const [games, setGames] = useState([]);
  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    fetch("/api/games?type=featured&status=Approved&limit=6")
      .then(r => r.json())
      .then(data => {
        const arr = Array.isArray(data) ? data : [];
        setGames(arr.length > 0 ? arr.slice(0, 6) : FALLBACK_GAMES);
      })
      .catch(() => setGames(FALLBACK_GAMES));
  }, []);

  const handleFav = async (game, index) => {
    if (favorites[game.id]) { toast.info("Remove via Favourites page"); return; }
    const res = await fetch("/api/favorites", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId: game.id, name: game.title, price: game.price, image: game.imageUrl }),
    });
    if (!res.ok) { toast.error("Must be logged in"); return; }
    setFavorites(p => ({...p, [game.id]: true}));
    toast.success("Added to wishlist!");
  };

  const handleCart = async (game, event) => {
    event.stopPropagation();
    const res = await fetch("/api/cart", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: game.title, price: game.price, image: game.imageUrl, description: game.description }),
    });
    if (!res.ok) { toast.error("Must be logged in"); return; }
    toast.success("Added to cart!");
  };

  return (
    <section className="py-16 px-4 sm:px-6" style={{background:'var(--bg-primary)'}}>
      <div className="max-w-7xl mx-auto">
        <SectionHeader title="Featured Games" subtitle="Handpicked for You" link="/featuredGames" linkLabel="View All" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {games.map((game, i) => (
            <motion.div key={game.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.4 }}>
              <GameCard game={game} isFav={favorites[game.id]}
                onFav={() => handleFav(game, i)}
                onCart={(e) => handleCart(game, e)}
                onClick={() => router.push(`/discover?gameId=${game.id}`)} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedGames;
export { SectionHeader };
