"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Adjusted import for useRouter
import { db, auth } from "../../firebase";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

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

const ITEMS_PER_PAGE = 20;

const FreeGames = () => {
  const router = useRouter();
  const [games, setGames] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        console.log("Fetching free games..."); // Debugging statement
        const q = query(collection(db, "games"), where("type", "==", "free"));
        const querySnapshot = await getDocs(q);
        const gamesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Free games fetched: ", gamesList); // Debugging statement
        setGames(gamesList);
        setFavorites(gamesList.map(() => false));
      } catch (e) {
        console.error("Error fetching free games: ", e);
        toast.error("Error fetching free games");
      }
    };

    fetchGames();
  }, []);

  const handleFavourite = async (game, index) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("User not logged in");
        toast.error("User not logged in");
        return;
      }

      const favCollectionRef = collection(db, "favorites");
      const favData = {
        uid: user.uid,
        gameId: game.id,
        name: game.title,
        price: game.price,
        image: game.imageUrl,
      };

      if (favorites[index]) {
        // Remove from favorites
        const favDocRef = doc(favCollectionRef, `${user.uid}_${game.id}`);
        await deleteDoc(favDocRef);
        toast.success("Removed from favorites!");
      } else {
        // Add to favorites
        await addDoc(favCollectionRef, favData);
        toast.success("Added to favorites!");
      }

      setFavorites(favorites.map((fav, i) => (i === index ? !fav : fav)));
    } catch (e) {
      console.error("Error handling favorite: ", e);
      toast.error("Error handling favorite!");
    }
  };

  const handleAddToCart = async (game, event) => {
    event.stopPropagation(); // Prevent the parent onClick event

    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("User not logged in");
        toast.error("User not logged in");
        return;
      }

      // Reference to the 'cart' collection
      const cartCollectionRef = collection(db, "cart");

      const cartData = {
        uid: user.uid,
        name: game.title,
        price: game.price,
        image: game.imageUrl,
        description: game.description,
      };

      // Add the game data to the 'cart' collection
      await addDoc(cartCollectionRef, cartData);
      console.log("Game added to cart successfully!");
      toast.success("Game added to cart successfully!");
    } catch (e) {
      console.error("Error adding game to cart: ", e);
      toast.error("Error adding game to cart!");
    }
  };

  // Calculate total number of pages
  const totalPages = Math.ceil(games.length / ITEMS_PER_PAGE);

  // Slice games array to show only games for the current page
  const paginatedGames = games.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="bg-[#181818] flex flex-col min-h-screen">
      <Navbar />
      <div className="container mx-auto text-white text-center py-8">
        <motion.h2
          className="text-4xl font-semibold mb-8"
          variants={headingAnimation}
        >
          Free Games
        </motion.h2>
        <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {paginatedGames.length > 0 ? (
            paginatedGames.map((game, index) => (
              <motion.div
                key={game.id}
                className="relative bg-[#303030] p-4 rounded-lg shadow-md shadow-purple-300"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  transition: { duration: 0.6 },
                }}
                {...cardAnimation}
              >
                <motion.div
                  className="relative w-full h-48 overflow-hidden rounded-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={game.imageUrl}
                    alt={game.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </motion.div>
                <h3 className="text-lg font-semibold mt-2">{game.title}</h3>
                <motion.button
                  onClick={(event) => handleAddToCart(game, event)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="mt-2 bg-[#71319f] text-white px-4 py-2 rounded-md"
                >
                  Add to Cart
                </motion.button>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-2 right-2"
                >
                  {favorites[index] ? (
                    <AiFillHeart
                      size={24}
                      onClick={() => handleFavourite(game, index)}
                      className="cursor-pointer text-purple-400"
                    />
                  ) : (
                    <AiOutlineHeart
                      size={24}
                      onClick={() => handleFavourite(game, index)}
                      className="cursor-pointer text-purple-400"
                    />
                  )}
                </motion.div>
              </motion.div>
            ))
          ) : (
            <p>No free games available at the moment.</p>
          )}
        </motion.div>
        {/* Pagination */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-[#71319f] text-white px-4 py-2 rounded-md mr-2 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-[#71319f] text-white px-4 py-2 rounded-md ml-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
      <Footer />
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
        toastClassName="bg-gray-800 text-white font-medium border border-gray-700 rounded-md shadow-lg"
      />
    </div>
  );
};

export default FreeGames;
