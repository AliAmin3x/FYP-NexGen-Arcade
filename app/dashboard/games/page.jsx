"use client";
import { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { motion } from "framer-motion";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "../../../lib/SessionContext";

const categoryOptions = ["Action","Adventure","Puzzle","Strategy","Racing","RPG","Sports","Simulation"];
const sectionAnimation = { initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } };
const dashboardSections = [
  { id: 1, title: "Dashboard", description: "View your account details.", href: "/dashboard" },
  { id: 2, title: "Upload Game", description: "Add a new game.", href: "/dashboard/upload" },
  { id: 3, title: "Manage Games", description: "Edit or delete your games.", href: "/dashboard/games" },
];

const ManageGames = () => {
  const { user } = useSession();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editGame, setEditGame] = useState(null);

  useEffect(() => {
    fetch("/api/games")
      .then(r => r.json())
      .then(data => { setGames(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSaveEdit = async () => {
    if (!editGame) return;
    const res = await fetch(`/api/games/${editGame.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editGame.title, category: editGame.category, price: editGame.price }),
    });
    if (res.ok) {
      setGames(games.map(g => g.id === editGame.id ? editGame : g));
      setEditGame(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this game?")) return;
    const res = await fetch(`/api/games/${id}`, { method: "DELETE" });
    if (res.ok) setGames(games.filter(g => g.id !== id));
  };

  if (loading) return <div className="bg-[#181818] flex flex-col min-h-screen justify-center items-center text-white"><p>Loading...</p></div>;

  return (
    <div className="bg-[#181818] flex flex-col min-h-screen">
      <Navbar userEmail={user?.email} username={user?.username} />
      <div className="container mx-auto text-white py-8">
        <motion.h2 className="text-4xl text-center font-semibold mb-8" variants={sectionAnimation} initial="initial" animate="animate">Manage Games</motion.h2>
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
          <motion.div className="ml-8 bg-[#303030] p-8 rounded-lg shadow-md w-full md:w-3/4" variants={sectionAnimation} initial="initial" animate="animate">
            {games.map(game => (
              <div key={game.id} className="flex gap-4 items-center mb-4 bg-[#4e4949] p-4 rounded-lg shadow-md hover:bg-[#606060] transition-colors duration-300 hover:scale-95 justify-between">
                <div className="flex items-center gap-4">
                  <Image src={game.imageUrl} alt={game.title} className="w-16 h-16 rounded-lg" width={64} height={64} />
                  <div>
                    <h4 className="text-lg font-semibold">{game.title}</h4>
                    <p className="text-gray-300">{game.category}</p>
                    <p className="text-gray-400">${game.price}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button className="text-yellow-400 hover:text-yellow-500" onClick={() => setEditGame(game)}><AiOutlineEdit size={24} /></button>
                  <button className="text-red-400 hover:text-red-500" onClick={() => handleDelete(game.id)}><AiOutlineDelete size={24} /></button>
                </div>
              </div>
            ))}
            {editGame && (
              <div className="bg-gray-700 p-4 rounded-lg mt-4">
                <h3 className="text-xl font-semibold mb-4">Edit Game</h3>
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">Title</label>
                  <input type="text" value={editGame.title} onChange={e => setEditGame({...editGame, title: e.target.value})} className="w-full p-2 rounded bg-[#4e4949] text-white" />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">Category</label>
                  <select value={editGame.category} onChange={e => setEditGame({...editGame, category: e.target.value})} className="w-full p-2 rounded bg-[#4e4949] text-white">
                    {categoryOptions.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">Price</label>
                  <input type="number" value={editGame.price} onChange={e => setEditGame({...editGame, price: e.target.value})} className="w-full p-2 rounded bg-[#4e4949] text-white" />
                </div>
                <button onClick={handleSaveEdit} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded">Save Changes</button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ManageGames;
