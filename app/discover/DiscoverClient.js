"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from "../../lib/SessionContext";

const DiscoverClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gameId = searchParams.get("gameId");
  const { user } = useSession();
  const [gameDetails, setGameDetails] = useState(null);

  useEffect(() => {
    if (!gameId) return;
    fetch(`/api/games/${gameId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { console.error("Game not found"); return; }
        setGameDetails(data);
      })
      .catch((e) => console.error("Error fetching game details:", e));
  }, [gameId]);

  if (!gameDetails) return <div className="bg-[#181818] min-h-screen flex items-center justify-center text-white">Loading...</div>;

  const handleAddToCart = async () => {
    if (!user) { toast.error("Please select a role first"); return; }
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: gameDetails.title,
          price: gameDetails.price,
          image: gameDetails.imageUrl,
          description: gameDetails.description,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success("Game added to cart successfully!");
    } catch (e) {
      toast.error("Error adding game to cart: " + e.message);
    }
  };

  return (
    <div className="bg-[#181818] flex flex-col min-h-screen">
      <Navbar />
      <div className="container mx-auto text-white py-8 px-4">
        <motion.h2 className="text-4xl text-center font-semibold mb-8">Discover</motion.h2>
        <motion.div className="flex flex-col items-center">
          <div className="relative w-full md:w-2/3 flex justify-center items-center mb-8">
            <Image
              src={gameDetails.imageUrl}
              alt={gameDetails.title}
              className="rounded-lg"
              width={800}
              height={450}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
          <div className="mt-8 w-full md:w-3/4 pl-12 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Game Title: {gameDetails.title}</h3>
            <p className="mb-2"><strong>Publisher:</strong> NexGen Developer</p>
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
