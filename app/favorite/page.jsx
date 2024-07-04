"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { motion } from "framer-motion";
import Image from "next/image";
import { db, auth } from "../../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { getCurrentUserEmail } from "../../firebase";

const cardAnimation = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeInOut" },
};

const headingAnimation = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeInOut" },
};

const Favourites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const favCollectionRef = collection(db, "favorites");
          const q = query(favCollectionRef, where("uid", "==", user.uid));
          const querySnapshot = await getDocs(q);
          const items = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setFavorites(items);
        } catch (e) {
          console.error("Error fetching favorites: ", e);
        } finally {
          setLoading(false);
        }
      } else {
        // User is not logged in
        setFavorites([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleRemoveFavorite = async (gameId) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("User not logged in");
        return;
      }

      const favDocRef = doc(db, "favorites", gameId);
      await deleteDoc(favDocRef);
      setFavorites(favorites.filter((game) => game.id !== gameId));
    } catch (e) {
      console.error("Error removing favorite: ", e);
    }
  };

  return (
    <div className="bg-[#181818] flex flex-col min-h-screen">
      <Navbar email={getCurrentUserEmail()} />
      <div className="container mx-auto text-white py-8">
        <motion.h2
          className="text-4xl text-center text-white font-semibold mb-8"
          {...headingAnimation}
        >
          Favourites
        </motion.h2>
        {loading ? (
          <div className="text-center text-white">Loading...</div>
        ) : (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
            {...cardAnimation}
          >
            {favorites.map((game) => (
              <motion.div
                key={game.id}
                className="bg-[#303030] p-6 rounded-lg shadow-md"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col items-center">
                  <Image
                    width={220}
                    height={220}
                    src={game.image}
                    alt={game.name}
                    className="w-full h-auto mb-2"
                  />
                  <h3 className="text-white text-lg font-semibold">
                    {game.name}
                  </h3>
                  <p className="text-gray-400 mt-2">{game.price}</p>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md"
                    onClick={() => handleRemoveFavorite(game.id)}
                  >
                    Remove from Favorite
                  </motion.button>
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
