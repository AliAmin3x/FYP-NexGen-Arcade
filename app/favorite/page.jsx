"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { motion } from "framer-motion";
import Image from "next/image";
import { useSession } from "../../lib/SessionContext";

const Favourites = () => {
  const { user } = useSession();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/favorites")
      .then(r => r.json())
      .then(data => { setFavorites(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleRemoveFavorite = async (id) => {
    await fetch(`/api/favorites/${id}`, { method: "DELETE" });
    setFavorites(favorites.filter(f => f.id !== id));
  };

  return (
    <div className="bg-[#181818] flex flex-col min-h-screen">
      <Navbar userEmail={user?.email} username={user?.username} />
      <div className="container mx-auto text-white py-8">
        <motion.h2 className="text-4xl text-center font-semibold mb-8" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}>Favourites</motion.h2>
        {loading ? <div className="text-center text-white">Loading...</div> : (
          <motion.div className="grid grid-cols-2 md:grid-cols-3 gap-4" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}>
            {favorites.map(game => (
              <motion.div key={game.id} className="bg-[#303030] p-6 rounded-lg shadow-md" whileHover={{ scale: 1.05 }}>
                <div className="flex flex-col items-center">
                  <Image width={220} height={220} src={game.image} alt={game.name} className="w-full h-auto mb-2" />
                  <h3 className="text-white text-lg font-semibold">{game.name}</h3>
                  <p className="text-gray-400 mt-2">{game.price} PKR</p>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md" onClick={() => handleRemoveFavorite(game.id)}>Remove from Favorite</motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Favourites;
