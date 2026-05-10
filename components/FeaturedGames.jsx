"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const cardAnimation = { initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } };

const FeaturedGames = () => {
  const router = useRouter();
  const [games, setGames] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetch("/api/games?type=featured&status=Approved&limit=6")
      .then(r => r.json())
      .then(data => { const arr = Array.isArray(data) ? data : []; setGames(arr); setFavorites(arr.map(() => false)); })
      .catch(e => console.error(e));
  }, []);

  const handleFavourite = async (game, index) => {
    if (favorites[index]) { toast.info("Remove via Favourites page"); }
    else {
      const res = await fetch("/api/favorites", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ gameId: game.id, name: game.title, price: game.price, image: game.imageUrl }) });
      if (!res.ok) { toast.error("Must be logged in"); return; }
      toast.success("Added to favorites!");
    }
    setFavorites(prev => { const u = [...prev]; u[index] = !u[index]; return u; });
  };

  const handleAddToCart = async (game, event) => {
    event.stopPropagation();
    const res = await fetch("/api/cart", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: game.title, price: game.price, image: game.imageUrl, description: game.description }) });
    if (!res.ok) { toast.error("Must be logged in"); return; }
    toast.success("Game added to cart!");
  };

  return (
    <div className="px-24 text-center py-8 bg-[#181818]">
      <button onClick={() => router.push("/featuredGames")} className="text-3xl text-center text-white font-semibold mb-4 hover:text-purple-400 transition-colors duration-300">Featured Games</button>
      <motion.div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {games.map((game, index) => (
          <motion.div key={game.id} className="relative bg-[#303030] shadow-purple-300 p-4 rounded-lg shadow-md h-[440px]" whileHover={{ scale: 1.05 }} {...cardAnimation} onClick={() => router.push(`/discover?gameId=${game.id}`)}>
            <div className="w-full h-[308px] relative mb-2">
              <Image layout="fill" objectFit="cover" src={game.imageUrl} alt={game.title} className="rounded-lg" />
            </div>
            <h3 className="text-white text-lg font-semibold">{game.title}</h3>
            <p className="text-gray-300">PKR {game.price}</p>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="mt-2 bg-[#71319f] text-white px-4 py-2 rounded-md" onClick={e => handleAddToCart(game, e)}>Add to Cart</motion.button>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="absolute bottom-2 right-2">
              {favorites[index] ? <AiFillHeart size={24} onClick={() => handleFavourite(game, index)} className="cursor-pointer text-purple-400" /> : <AiOutlineHeart size={24} onClick={() => handleFavourite(game, index)} className="cursor-pointer text-purple-400" />}
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default FeaturedGames;
