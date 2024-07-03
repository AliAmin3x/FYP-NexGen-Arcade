"use client";
import React, { useEffect, useState } from 'react';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from 'next/image';
import { db } from "../../firebase"; // Adjust the import path according to your project structure
import { collection, query, where, getDocs } from "firebase/firestore";

const dashboardSections = [
  {
    id: 1,
    title: "Dashboard",
    description: "View your account details and settings.",
    href: "/dashboard",
  },
  {
    id: 2,
    title: "Upload Game",
    description: "Add a new game to your account.",
    href: "/dashboard/upload",
  },
  {
    id: 3,
    title: "Manage Games",
    description: "Edit or delete your existing games.",
    href: "/dashboard/games",
  },
];

const sectionAnimation = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeInOut" },
};

const Dashboard = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const gamesCollection = collection(db, 'games');
        const q = query(gamesCollection, where('status', '!=', null));
        const gamesSnapshot = await getDocs(q);
        const gamesList = gamesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setGames(gamesList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching games: ", error);
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#181818] flex flex-col min-h-screen justify-center items-center text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#181818] flex flex-col min-h-screen">
      <Navbar />
      <div className="container mx-auto text-white py-8">
        <motion.h2
          className="italic text-2xl text-center text-white font-semibold mb-8"
          variants={sectionAnimation}
          initial="initial"
          animate="animate"
        >
          Dashboard
        </motion.h2>
        <div className="flex flex-col md:flex-row justify-between">
          <motion.div
            className="bg-[#303030] p-6 rounded-lg shadow-md w-full md:w-1/4 mb-4 md:mb-0"
            variants={sectionAnimation}
            initial="initial"
            animate="animate"
          >
            <h3 className="text-xl font-semibold mb-4">Dashboard</h3>
            {dashboardSections.map((section) => (
              <div key={section.id} className="mb-4">
                <Link
                  href={section.href}
                  className="text-lg font-semibold hover:text-purple-500">{section.title}</Link>
                <p className="text-gray-300">{section.description}</p>
              </div>
            ))}
          </motion.div>
          <motion.div
            className="ml-8 bg-[#303030] p-6 rounded-lg shadow-md w-full md:w-3/4"
            variants={sectionAnimation}
            initial="initial"
            animate="animate"
          >
            <h3 className="text-xl font-semibold mb-4">Dashboard</h3>
            {games.map((game) => (
              <div key={game.id} className="flex gap-4 items-center mb-4 bg-[#4e4949] p-4 rounded-lg shadow-md hover:bg-[#606060] transition-colors duration-300 hover:scale-95 justify-around">
                <Image
                  src={game.imageUrl}
                  alt={game.title}
                  className="w-16 h-16 rounded-lg"
                  width={64}
                  height={64}
                />
                <h4 className="flex justify-center items-center text-lg font-semibold">{game.title}</h4>
                <div className='flex flex-col gap-1 items-end'>
                  <p className="text-gray-300">{game.category}</p>
                  <p className="text-gray-400">${game.price}</p>
                </div>
                <div className={`flex flex-col items-center px-4 py-1 rounded-lg text-white ${game.status === 'Pending' ? 'bg-yellow-500' : 'bg-green-500'}`}>
                  <p className="font-semibold">{game.status}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;
