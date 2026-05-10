"use client";
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import Image from "next/image";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

const FreeGames = () => {
  const [games, setGames] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/games?type=free&status=Approved")
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
    setFavorites(favorites.map((f, i) => i === index ? !f : f));
  };

  const handleAddToCart = async (game, event) => {
    event.stopPropagation();
    const res = await fetch("/api/cart", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: game.title, price: game.price, image: game.imageUrl, description: game.description }) });
    if (!res.ok) { toast.error("Must be logged in"); return; }
    toast.success("Game added to cart!");
  };

  const settings = { dots: true, infinite: true, speed: 500, slidesToShow: Math.min(3, games.length || 1), slidesToScroll: 3, responsive: [{ breakpoint: 1024, settings: { slidesToShow: Math.min(2, games.length || 1), slidesToScroll: 3, infinite: true, dots: true } }, { breakpoint: 600, settings: { slidesToShow: 1, slidesToScroll: 1 } }] };

  return (
    <div className="container text-center mx-auto py-8 bg-[#181818]">
      <button onClick={() => router.push("/freegames")} className="text-3xl text-center text-white font-semibold mb-4 hover:text-purple-400 transition-colors duration-300">Free Games</button>
      <Slider {...settings}>
        {games.map((game, index) => (
          <motion.div key={game.id} className="flex p-2" onClick={() => router.push(`/discover?gameId=${game.id}`)} whileHover={{ scale: 1.05 }}>
            <div className="relative bg-[#303030] p-4 rounded-lg shadow-md">
              <div className="image-container w-full h-48 relative">
                <Image layout="fill" objectFit="cover" src={game.imageUrl} alt={game.title} className="rounded-lg" />
              </div>
              <h3 className="text-white text-lg font-semibold mt-2">{game.title}</h3>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="mt-2 bg-[#71319f] text-white px-4 py-2 rounded-md" onClick={e => handleAddToCart(game, e)}>Add to Cart</motion.button>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="absolute bottom-2 right-2">
                {favorites[index] ? <AiFillHeart size={24} onClick={() => handleFavourite(game, index)} className="cursor-pointer text-purple-400" /> : <AiOutlineHeart size={24} onClick={() => handleFavourite(game, index)} className="cursor-pointer text-purple-400" />}
              </motion.div>
            </div>
          </motion.div>
        ))}
      </Slider>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default FreeGames;
