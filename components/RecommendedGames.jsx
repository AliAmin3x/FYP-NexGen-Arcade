import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { db, auth } from "../firebase";
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

const cardAnimation = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeInOut" },
};

const RecommendedGames = () => {
  const router = useRouter();
  const [games, setGames] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const getRandomElements = (arr, num) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
  };

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const q = query(
          collection(db, "games"),
          where("type", "==", "recommended")
        );
        const querySnapshot = await getDocs(q);
        const gamesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const randomGames = getRandomElements(gamesList, 6);
        setGames(randomGames);
        setFavorites(randomGames.map(() => false));
      } catch (e) {
        console.error("Error fetching games: ", e);
        toast.error("Error fetching games");
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
        const favDocRef = doc(favCollectionRef, `${user.uid}_${game.id}`);
        await deleteDoc(favDocRef);
        toast.success("Removed from favorites!");
      } else {
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
    event.stopPropagation();

    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("User not logged in");
        toast.error("User not logged in");
        return;
      }

      const cartCollectionRef = collection(db, "cart");

      const cartData = {
        uid: user.uid,
        name: game.title,
        price: game.price,
        image: game.imageUrl,
        description: game.description,
      };

      await addDoc(cartCollectionRef, cartData);
      console.log("Game added to cart successfully!");
      toast.success("Game added to cart successfully!");
    } catch (e) {
      console.error("Error adding game to cart: ", e);
      toast.error("Error adding game to cart!");
    }
  };

  const handleGameClick = (gameId) => {
    router.push(`/discover?gameId=${gameId}`);
  };

  return (
    <div className="px-24 py-8 bg-[#181818]">
      <h2 className="text-3xl text-center text-white font-semibold mb-4">
        Recommended Games
      </h2>
      <motion.div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {games.map((game, index) => (
          <motion.div
            key={game.id}
            className="relative bg-[#303030] shadow-purple-300 p-4 rounded-lg shadow-md h-[440px]"
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              transition: { duration: 0.3 },
            }}
            {...cardAnimation}
            onClick={() => handleGameClick(game.id)}
          >
            <div className="w-full h-[308px] relative mb-2">
              <Image
                layout="fill"
                objectFit="cover"
                src={game.imageUrl}
                alt={game.title}
                className="rounded-lg"
              />
            </div>
            <h3 className="text-white text-lg font-semibold">{game.title}</h3>
            <p className="text-gray-300">PKR {game.price}</p>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="mt-2 bg-[#71319f] text-white px-4 py-2 rounded-md overflow-hidden"
              onClick={(event) => handleAddToCart(game, event)}
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
        ))}
      </motion.div>
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

export default RecommendedGames;
