"use client";
import React, { useState } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { motion } from "framer-motion";
import { AiOutlineCloudUpload } from "react-icons/ai";
import Link from "next/link";
import { useSession } from "../../../lib/SessionContext";

const categoryOptions = ["Action","Adventure","Puzzle","Strategy","Racing","RPG","Sports","Simulation","Battle Royale","Open-World"];
const sectionAnimation = { initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } };
const dashboardSections = [
  { id: 1, title: "Dashboard", description: "View your account details.", href: "/dashboard" },
  { id: 2, title: "Upload Game", description: "Add a new game.", href: "/dashboard/upload" },
  { id: 3, title: "Manage Games", description: "Edit or delete your games.", href: "/dashboard/games" },
];

const UploadGames = () => {
  const { user } = useSession();
  const [gameTitle, setGameTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categoryOptions[0]);
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [type, setType] = useState("recommended");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage(""); setErrorMessage("");
    if (!imageUrl) { setErrorMessage("Please provide an image URL."); return; }
    if (!user) { setErrorMessage("You must be logged in as a developer."); return; }

    const res = await fetch("/api/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: gameTitle, description, category, price: parseFloat(price), imageUrl, type }),
    });
    const data = await res.json();
    if (!res.ok) { setErrorMessage(data.error || "Upload failed"); return; }
    setSuccessMessage("Game uploaded successfully! Pending admin approval.");
    setGameTitle(""); setDescription(""); setCategory(categoryOptions[0]); setPrice(""); setImageUrl(""); setType("recommended");
  };

  return (
    <div className="bg-[#181818] flex flex-col min-h-screen">
      <Navbar userEmail={user?.email} username={user?.username} />
      <div className="container mx-auto text-white py-8">
        <motion.h2 className="text-4xl text-center font-semibold mb-8" variants={sectionAnimation} initial="initial" animate="animate">Upload Game</motion.h2>
        <div className="flex flex-col md:flex-row justify-between">
          <motion.div className="bg-[#303030] p-6 rounded-lg shadow-md w-full md:w-1/4 mb-4 md:mb-0" variants={sectionAnimation} initial="initial" animate="animate">
            <h3 className="text-xl font-semibold mb-4">Dashboard</h3>
            {dashboardSections.map(s => (
              <div key={s.id} className="mb-4">
                <Link href={s.href} className="text-lg font-semibold hover:text-purple-500">{s.title}</Link>
                <p className="text-gray-300">{s.description}</p>
              </div>
            ))}
          </motion.div>
          <motion.form onSubmit={handleSubmit} className="ml-8 bg-[#303030] p-8 rounded-lg shadow-md w-full md:w-3/4 mx-auto" variants={sectionAnimation} initial="initial" animate="animate">
            {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
            {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
            <div className="mb-4">
              <label className="block text-gray-300 mb-1">Game Title</label>
              <input type="text" value={gameTitle} onChange={e => setGameTitle(e.target.value)} className="border-none w-full text-white py-2 px-3 bg-[#4e4949] rounded-lg" required />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 mb-1">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} className="bg-[#4e4949] border-none w-full text-white py-2 px-3 focus:outline-none rounded-lg" required />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 mb-1">Game Type</label>
              <select value={type} onChange={e => setType(e.target.value)} className="border-none w-full text-white py-2 px-3 focus:outline-none bg-[#4e4949] rounded-lg" required>
                <option value="recommended">Recommended</option>
                <option value="featured">Featured</option>
                <option value="free">Free</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 mb-1">Game Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="border-none w-full text-white py-2 px-3 focus:outline-none bg-[#4e4949] rounded-lg" required>
                {categoryOptions.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 mb-1">Game Price (PKR)</label>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="border-none w-full text-white py-2 px-3 focus:outline-none bg-[#4e4949] rounded-lg" required />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 mb-1">Game Image URL</label>
              <div className="flex items-center bg-[#4e4949] rounded-lg px-3 py-2">
                <AiOutlineCloudUpload className="text-gray-400 mr-3" />
                <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." className="bg-transparent border-none w-full text-white py-2 focus:outline-none" required />
              </div>
            </div>
            <motion.button type="submit" className="w-full bg-[#71319f] text-white py-2 rounded-lg hover:bg-purple-600 transition-colors duration-300" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Upload Game
            </motion.button>
          </motion.form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UploadGames;
