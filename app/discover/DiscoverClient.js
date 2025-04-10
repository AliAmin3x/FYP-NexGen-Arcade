// app/discover/DiscoverClient.js
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Image from "next/image";
import { db, auth } from "../../firebase";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DiscoverClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gameId = searchParams.get("gameId");
  const [gameDetails, setGameDetails] = useState(null);
  const [currentImage, setCurrentImage] = useState("");

  useEffect(() => {
    const fetchGameDetails = async () => {
      if (gameId) {
        try {
          const gameDocRef = doc(db, "games", gameId);
          const gameDoc = await getDoc(gameDocRef);
          if (gameDoc.exists()) {
            const gameData = gameDoc.data();
            setGameDetails(gameData);
            setCurrentImage(gameData.imageUrl);
          } else {
            console.error("No such game!");
          }
        } catch (e) {
          console.error("Error fetching game details: ", e);
        }
      }
    };

    fetchGameDetails();
  }, [gameId]);

  if (!gameDetails) return <div>Loading...</div>;

  const handlePrevImage = () => {};
  const handleNextImage = () => {};

  const handleAddToCart = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("User not logged in");
        return;
      }

      const cartCollectionRef = collection(db, "cart");
      await addDoc(cartCollectionRef, {
        uid: user.uid,
        name: gameDetails.title,
        price: gameDetails.price,
        image: gameDetails.imageUrl,
        description: gameDetails.description,
      });
      toast.success("Game added to cart successfully!");
    } catch (e) {
      toast.error("Error adding game to cart!");
    }
  };

  return (
    <div className="bg-[#181818] flex flex-col min-h-screen">
      <Navbar />
      <div className="container mx-auto text-white py-8 px-4">
        <motion.h2 className="text-4xl text-center font-semibold mb-8">
          Discover
        </motion.h2>
        <motion.div className="flex flex-col items-center">
          <div className="relative w-full md:w-2/3 flex justify-center items-center mb-8">
            <button onClick={handlePrevImage} className="absolute left-0 text-white text-2xl bg-gray-700 rounded-full p-2 hover:bg-purple-500 transition-colors duration-300">
              <AiOutlineLeft />
            </button>
            <Image
              src={currentImage}
              alt={gameDetails.title}
              className="rounded-lg"
              width={800}
              height={450}
              layout="responsive"
            />
            <button onClick={handleNextImage} className="absolute right-0 text-white text-2xl bg-gray-700 rounded-full p-2 hover:bg-purple-500 transition-colors duration-300">
              <AiOutlineRight />
            </button>
          </div>
          <div className="mt-8 w-full md:w-3/4 pl-12 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">
              Game Title: {gameDetails.title}
            </h3>
            <p className="mb-2"><strong>Publisher:</strong> Ali Amin</p>
            <p className="mb-2"><strong>Genre:</strong> {gameDetails.category}</p>
            <p className="mb-4"><strong>Description:</strong> {gameDetails.description}</p>
            <div className="flex justify-end gap-4">
              <motion.button
                className="w-32 bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
              >
                Add to Cart
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default DiscoverClient;
