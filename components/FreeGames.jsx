"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { SectionHeader } from "./FeaturedGames";

const FALLBACK = [
  { id:'fr1', title:'Fortnite',          category:'Battle Royale', price:'0', imageUrl:'/img5.jpg', description:'Free-to-play battle royale with 100 players.' },
  { id:'fr2', title:'Apex Legends',      category:'Battle Royale', price:'0', imageUrl:'/img6.jpg', description:'High-octane squad-based hero shooter.' },
  { id:'fr3', title:'Valorant',          category:'Action',        price:'0', imageUrl:'/img7.jpg', description:'5v5 tactical FPS with unique agents.' },
  { id:'fr4', title:'League of Legends', category:'Strategy',      price:'0', imageUrl:'/img8.jpg', description:'The definitive MOBA experience.' },
  { id:'fr5', title:'Genshin Impact',    category:'RPG',           price:'0', imageUrl:'/img1.jpg', description:'Breathtaking open-world action RPG.' },
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
      body: JSON.stringify({ name:game.title, price:'0', image:game.imageUrl, description:game.description }),
    });
    if (!res.ok) { toast.error("Must be logged in"); return; }
    toast.success("Game added to library!");
  };

  return (
    <section className="py-20 px-4 sm:px-6 relative overflow-hidden" style={{background:'var(--bg-secondary)'}}>
      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{
        background:'linear-gradient(to right, transparent, rgba(0,214,143,0.3), transparent)'
      }} />

      <div className="max-w-7xl mx-auto">
        <SectionHeader title="Free to Play" subtitle="No Cost, All Fun" link="/freegames" linkLabel="See All Free Games" />

        {/* Horizontal scroll strip */}
        <div className="flex gap-4 overflow-x-auto pb-4" style={{scrollbarWidth:'none', msOverflowStyle:'none'}}>
          {games.map((game, i) => (
            <motion.div key={game.id}
              initial={{ opacity:0, x:20 }}
              whileInView={{ opacity:1, x:0 }}
              viewport={{ once:true }}
              transition={{ delay:i*0.08, duration:0.4 }}
              className="flex-shrink-0 w-52 game-card group cursor-pointer"
              onClick={() => router.push(`/discover?gameId=${game.id}`)}>

              <div className="relative w-full h-36 overflow-hidden">
                <Image src={game.imageUrl} alt={game.title} fill
                  style={{objectFit:'cover'}}
                  className="transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0" style={{
                  background:'linear-gradient(to top, rgba(2,3,10,0.9) 0%, rgba(2,3,10,0.2) 50%, transparent 80%)'
                }} />

                {/* Free badge */}
                <div className="absolute top-2 left-2">
                  <span className="free-badge">FREE</span>
                </div>

                {/* Fav */}
                <button onClick={(e) => { e.stopPropagation(); handleFav(game); }}
                  className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded transition-all"
                  style={{background:'rgba(2,3,10,0.6)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.08)'}}>
                  {favs[game.id]
                    ? <AiFillHeart size={11} style={{color:'#e8192c'}} />
                    : <AiOutlineHeart size={11} style={{color:'rgba(255,255,255,0.5)'}} />}
                </button>

                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <p className="text-xs font-bold text-white truncate" style={{fontFamily:"'Barlow Condensed', sans-serif", fontWeight:700}}>
                    {game.title}
                  </p>
                </div>

                {/* Bottom accent */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                  style={{background:'linear-gradient(to right, var(--accent-emerald), transparent)'}} />
              </div>

              <div className="p-3 flex items-center justify-between">
                <span style={{fontFamily:"'JetBrains Mono', monospace", fontSize:'0.78rem', color:'var(--accent-emerald)', fontWeight:700}}>
                  FREE
                </span>
                <motion.button whileHover={{ scale:1.08 }} whileTap={{ scale:0.93 }}
                  onClick={(e) => handleCart(game, e)}
                  className="text-xs px-3 py-1 rounded-sm font-bold transition-all"
                  style={{
                    background:'rgba(0,214,143,0.12)',
                    border:'1px solid rgba(0,214,143,0.3)',
                    color:'var(--accent-emerald)',
                    fontFamily:"'Barlow Condensed', sans-serif",
                    letterSpacing:'0.12em',
                    fontSize:'0.68rem'
                  }}>
                  GET
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FreeGames;
