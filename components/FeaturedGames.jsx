"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import GameCard from "./GameCard";

const FALLBACK_GAMES = [
  { id:'f1', title:'Elden Ring',              category:'RPG',        price:'6999', imageUrl:'/img1.jpg', description:'Open-world action RPG masterpiece from FromSoftware.' },
  { id:'f2', title:'Call of Duty: MW III',    category:'Action',     price:'7999', imageUrl:'/img2.jpg', description:'Next-gen FPS military shooter with stunning visuals.' },
  { id:'f3', title:'Red Dead Redemption 2',   category:'Adventure',  price:'4999', imageUrl:'/img3.jpg', description:'Epic open-world western adventure.' },
  { id:'f4', title:'EA Sports FC 25',         category:'Sports',     price:'5499', imageUrl:'/img4.jpg', description:'The most authentic football simulation ever.' },
  { id:'f5', title:'Cyberpunk 2077',          category:'Open-World', price:'3999', imageUrl:'/img7.jpg', description:'Sprawling dystopian RPG set in Night City.' },
  { id:'f6', title:"God of War Ragnarök",     category:'Action',     price:'8999', imageUrl:'/img8.jpg', description:'Norse mythology epic concludes in stunning fashion.' },
];

export const SectionHeader = ({ title, subtitle, link, linkLabel }) => {
  const router = useRouter();
  return (
    <div className="flex items-end justify-between mb-10">
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-3">
          <div className="w-1 h-4 rounded-full" style={{background:'linear-gradient(to bottom, var(--accent-red), var(--accent-gold))'}} />
          <span style={{fontFamily:'var(--font-mono)', fontSize:'0.6rem', letterSpacing:'0.3em', color:'var(--accent-gold)', textTransform:'uppercase', fontWeight:600}}>
            {subtitle}
          </span>
        </div>
        <h2 style={{
          fontFamily:'var(--font-display)',
          fontSize:'clamp(1.9rem,4.5vw,2.8rem)',
          lineHeight:0.92,
          color:'var(--text-primary)',
          letterSpacing:'-0.01em',
          fontWeight:800,
        }}>
          {title}
        </h2>
      </div>
      {link && (
        <button onClick={() => router.push(link)}
          className="flex items-center gap-2 transition-all duration-200 group"
          style={{fontFamily:'var(--font-display)', fontWeight:700, fontSize:'0.8rem', letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--text-muted)'}}>
          <span className="group-hover:text-amber-400 transition-colors">{linkLabel}</span>
          <svg className="w-3.5 h-3.5 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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
        setGames(arr.length > 0 ? arr.slice(0,6) : FALLBACK_GAMES);
      })
      .catch(() => setGames(FALLBACK_GAMES));
  }, []);

  const handleFav = async (game) => {
    if (favorites[game.id]) { toast.info("Remove via Favourites page"); return; }
    const res = await fetch("/api/favorites", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ gameId:game.id, name:game.title, price:game.price, image:game.imageUrl }),
    });
    if (!res.ok) { toast.error("Must be logged in"); return; }
    setFavorites(p => ({...p, [game.id]:true}));
    toast.success("Added to wishlist!");
  };

  const handleCart = async (game, event) => {
    event.stopPropagation();
    const res = await fetch("/api/cart", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ name:game.title, price:game.price, image:game.imageUrl, description:game.description }),
    });
    if (!res.ok) { toast.error("Must be logged in"); return; }
    toast.success("Added to cart!");
  };

  return (
    <section className="py-20 px-4 sm:px-6 relative" style={{background:'var(--bg-primary)'}}>
      <div className="absolute inset-0 grid-lines opacity-35 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader title="Featured Games" subtitle="Handpicked for You" link="/featuredGames" linkLabel="View All" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {games.map((game, i) => (
            <motion.div key={game.id}
              initial={{ opacity:0, y:28 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }}
              transition={{ delay:i * 0.07, duration:0.5, ease:[0.16,1,0.3,1] }}>
              <GameCard game={game} isFav={favorites[game.id]}
                onFav={() => handleFav(game)}
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
