"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { SectionHeader } from "./FeaturedGames";

const FALLBACK = [
  { id:'r1', title:"Baldur's Gate 3",  category:'RPG',       price:'7499', imageUrl:'/img1.jpg', description:'The definitive deep CRPG with unmatched player freedom.' },
  { id:'r2', title:'Hogwarts Legacy',   category:'Adventure', price:'5999', imageUrl:'/img2.jpg', description:'Step into a magical open world set in the 1800s.' },
  { id:'r3', title:'Starfield',         category:'Open-World',price:'6999', imageUrl:'/img3.jpg', description:'Explore the galaxy in Bethesda\'s epic space RPG.' },
  { id:'r4', title:'Lies of P',         category:'Action',    price:'4299', imageUrl:'/img4.jpg', description:'Dark soulslike retelling of Pinocchio.' },
];

const GENRE_COLORS = {
  Action:'#e8192c', Adventure:'#e8b923', RPG:'#a855f7', Strategy:'#3b82f6',
  Sports:'#00d68f', Racing:'#f97316', 'Open-World':'#6933ff', default:'#00c8ff'
};

const RecommendedGames = () => {
  const router = useRouter();
  const [games, setGames] = useState([]);
  const [favs, setFavs] = useState({});

  useEffect(() => {
    fetch("/api/games?type=recommended&status=Approved")
      .then(r => r.json())
      .then(data => {
        const arr = Array.isArray(data) ? data : [];
        const shuffled = [...arr].sort(() => 0.5 - Math.random()).slice(0,4);
        setGames(shuffled.length > 0 ? shuffled : FALLBACK);
      })
      .catch(() => setGames(FALLBACK));
  }, []);

  const handleFav = async (game) => {
    if (favs[game.id]) { toast.info("Remove via Favourites page"); return; }
    const res = await fetch("/api/favorites", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ gameId:game.id, name:game.title, price:game.price, image:game.imageUrl }),
    });
    if (!res.ok) { toast.error("Must be logged in"); return; }
    setFavs(p => ({...p, [game.id]:true}));
    toast.success("Added to wishlist!");
  };

  const handleCart = async (game, e) => {
    e.stopPropagation();
    const res = await fetch("/api/cart", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ name:game.title, price:game.price, image:game.imageUrl, description:game.description }),
    });
    if (!res.ok) { toast.error("Must be logged in"); return; }
    toast.success("Added to cart!");
  };

  return (
    <section className="py-20 px-4 sm:px-6 relative" style={{
      background:'linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 50%, var(--bg-primary) 100%)'
    }}>
      <div className="max-w-7xl mx-auto">
        <SectionHeader title="Recommended for You" subtitle="Based on Your Taste" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {games.map((game, i) => {
            const accent = GENRE_COLORS[game.category] || GENRE_COLORS.default;
            const isFree = !game.price || parseFloat(game.price) === 0;
            return (
              <motion.div key={game.id}
                initial={{ opacity:0, y:24 }}
                whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }}
                transition={{ delay:i * 0.1, duration:0.45 }}
                className="game-card group cursor-pointer"
                onClick={() => router.push(`/discover?gameId=${game.id}`)}>

                <div className="relative aspect-video overflow-hidden">
                  <Image src={game.imageUrl} alt={game.title} fill
                    style={{objectFit:'cover'}}
                    className="transition-transform duration-600 group-hover:scale-108" />
                  <div className="absolute inset-0" style={{
                    background:'linear-gradient(to top, rgba(2,3,10,0.85) 0%, rgba(2,3,10,0.2) 50%, transparent 80%)'
                  }} />

                  {/* Accent flash */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                    style={{background:`radial-gradient(ellipse 80% 60% at 50% 100%, ${accent}18, transparent 70%)`}} />

                  {/* Category badge */}
                  {game.category && (
                    <div className="absolute top-2.5 left-2.5">
                      <span className="genre-badge">{game.category}</span>
                    </div>
                  )}

                  {/* Fav */}
                  <button onClick={(e) => { e.stopPropagation(); handleFav(game); }}
                    className="absolute top-2.5 right-2.5 w-7 h-7 flex items-center justify-center rounded transition-all"
                    style={{background:'rgba(2,3,10,0.6)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.08)'}}>
                    {favs[game.id]
                      ? <AiFillHeart size={13} style={{color:'#e8192c'}} />
                      : <AiOutlineHeart size={13} style={{color:'rgba(255,255,255,0.5)'}} />}
                  </button>

                  {/* Price */}
                  <div className="absolute bottom-2.5 left-2.5">
                    <span style={{fontFamily:"'JetBrains Mono', monospace", fontSize:'0.9rem', fontWeight:700,
                      color: isFree ? 'var(--accent-emerald)' : 'var(--accent-gold)'}}>
                      {isFree ? 'FREE' : `PKR ${game.price}`}
                    </span>
                  </div>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                    style={{background:`linear-gradient(to right, ${accent}, transparent)`}} />
                </div>

                <div className="p-4 flex flex-col gap-3">
                  <h3 className="font-bold group-hover:text-amber-300 transition-colors leading-tight"
                    style={{fontFamily:"'Barlow Condensed', sans-serif", fontWeight:700, fontSize:'1rem', letterSpacing:'0.03em', color:'var(--text-primary)'}}>
                    {game.title}
                  </h3>
                  <p className="line-clamp-2 leading-relaxed"
                    style={{fontFamily:"'DM Sans', sans-serif", fontSize:'0.78rem', color:'var(--text-muted)', fontWeight:300}}>
                    {game.description || "An epic gaming experience awaits you."}
                  </p>
                  <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                    onClick={(e) => handleCart(game, e)}
                    className="w-full py-2.5 rounded-sm font-bold tracking-wider transition-all duration-200"
                    style={{
                      background:`rgba(${accent.replace('#','').match(/../g).map(h=>parseInt(h,16)).join(',')},0.08)`,
                      border:`1px solid ${accent}30`,
                      color: accent,
                      fontFamily:"'Barlow Condensed', sans-serif",
                      fontSize:'0.78rem',
                      letterSpacing:'0.14em'
                    }}>
                    ADD TO CART
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RecommendedGames;
