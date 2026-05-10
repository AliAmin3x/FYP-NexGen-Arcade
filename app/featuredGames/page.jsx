"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useSession } from "../../lib/SessionContext";

const cardAnimation = { initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, ease: "easeInOut" } };
const ITEMS_PER_PAGE = 20;

const FeaturedGames = () => {
  const router = useRouter();
  const { user } = useSession();
  const [games, setGames] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch("/api/games?type=featured&status=Approved")
      .then((r) => r.json())
      .then((data) => setGames(Array.isArray(data) ? data : []))
      .catch(() => toast.error("Error fetching games"));
  }, []);

  const handleFavourite = async (game) => {
    if (!user) { toast.error("Please select a role first"); return; }
    try {
      const isFav = favorites[game.id];
      if (isFav) {
        await fetch(`/api/favorites/${isFav}`, { method: "DELETE" });
        setFavorites((prev) => { const n = { ...prev }; delete n[game.id]; return n; });
        toast.success("Removed from favorites!");
      } else {
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gameId: game.id, name: game.title, price: game.price, image: game.imageUrl }),
        });
        const data = await res.json();
        setFavorites((prev) => ({ ...prev, [game.id]: data.id }));
        toast.success("Added to favorites!");
      }
    } catch { toast.error("Error handling favorite!"); }
  };

  const handleAddToCart = async (game, event) => {
    event.stopPropagation();
    if (!user) { toast.error("Please select a role first"); return; }
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: game.title, price: game.price, image: game.imageUrl, description: game.description }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success("Game added to cart successfully!");
    } catch (e) { toast.error("Error adding game to cart!"); }
  };

  const totalPages = Math.ceil(games.length / ITEMS_PER_PAGE);
  const paginatedGames = games.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const changePage = (page) => { if (page < 1 || page > totalPages) return; setCurrentPage(page); };

  return (
    <div className="bg-[#181818] flex flex-col min-h-screen">
      <Navbar />
      <div className="container mx-auto text-white text-center py-8">
        <motion.h2 className="text-4xl font-semibold mb-8" {...cardAnimation}>Featured Games</motion.h2>
        <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {paginatedGames.map((game) => (
            <motion.div
              key={game.id}
              className="relative bg-[#303030] p-4 rounded-lg shadow-md shadow-purple-300"
              whileHover={{ scale: 1.05, boxShadow: "0px 4px 8px rgba(0,0,0,0.1)", transition: { duration: 0.6 } }}
              {...cardAnimation}
              onClick={() => router.push(`/discover?gameId=${game.id}`)}
            >
              <div className="relative w-full h-48 overflow-hidden rounded-lg">
                <Image src={game.imageUrl} alt={game.title} fill style={{ objectFit: "cover" }} className="rounded-lg" />
              </div>
              <h3 className="text-lg font-semibold mt-2">{game.title}</h3>
              <p className="text-gray-300">PKR {game.price}</p>
              <motion.button
                onClick={(e) => handleAddToCart(game, e)}
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                className="mt-2 bg-[#71319f] text-white px-4 py-2 rounded-md"
              >
                Add to Cart
              </motion.button>
              <motion.div
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                className="absolute bottom-2 right-2"
                onClick={(e) => { e.stopPropagation(); handleFavourite(game); }}
              >
                {favorites[game.id] ? <AiFillHeart size={24} className="cursor-pointer text-purple-400" /> : <AiOutlineHeart size={24} className="cursor-pointer text-purple-400" />}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
        <div className="flex justify-center mt-4">
          <button onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1} className="bg-[#71319f] text-white px-4 py-2 rounded-md mr-2 disabled:opacity-50">Previous</button>
          <button onClick={() => changePage(currentPage + 1)} disabled={currentPage === totalPages} className="bg-[#71319f] text-white px-4 py-2 rounded-md ml-2 disabled:opacity-50">Next</button>
        </div>
      </div>
      <Footer />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default FeaturedGames;
