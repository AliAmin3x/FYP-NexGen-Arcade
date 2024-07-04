"use client";

import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { motion } from "framer-motion";
import { AiOutlineUser } from "react-icons/ai";
import Link from "next/link";
import jsPDF from "jspdf";
import "jspdf-autotable";

const sectionAnimation = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeInOut" },
};

const Revenues = () => {
  const [games, setGames] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const q = query(
          collection(db, "games"),
          where("status", "in", ["Approved", null])
        );
        const querySnapshot = await getDocs(q);
        const gamesList = [];
        querySnapshot.forEach((doc) => {
          gamesList.push({ id: doc.id, ...doc.data() });
        });
        setGames(gamesList);
      } catch (err) {
        setError("Failed to fetch games");
        console.error(err);
      }
    };

    fetchGames();
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Game Name", "Game Price", "Our Revenue"];
    const tableRows = [];

    games.forEach((game) => {
      const gameData = [
        game.title,
        `$${game.price.toFixed(2)}`,
        `$${(game.price * 0.2).toFixed(2)}`,
      ];
      tableRows.push(gameData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.text("Revenue Report", 14, 15);
    doc.save("revenue_report.pdf");
  };

  return (
    <div className="bg-[#181818] flex flex-col min-h-screen">
      <nav className="flex items-center justify-between px-4 py-4 bg-[#303030] shadow-md">
        <div className="text-2xl font-bold italic tracking-widest text-purple-400">
          NexGen Arcade
        </div>
        <div className="flex items-center gap-2">
          <AiOutlineUser className="text-2xl" />
          <span>admin@gmail.com</span>
        </div>
      </nav>

      <div className="flex flex-1">
        <aside className="w-64 bg-[#303030] p-4 shadow-lg">
          <ul className="space-y-4">
            <li>
              <Link href="/admin/game-approvals" passHref>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className="block py-2 px-4 rounded-lg hover:bg-[#4e4949] transition-colors duration-300"
                >
                  Game Approvals
                </motion.div>
              </Link>
            </li>
            <li>
              <Link href="/admin/revenues" passHref>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="block py-2 px-4 rounded-lg hover:bg-[#4e4949] transition-colors duration-300"
                >
                  Revenues
                </motion.div>
              </Link>
            </li>
          </ul>
        </aside>
        <div className="container mx-auto text-white py-8">
          <motion.h2
            className="italic text-2xl text-center text-white font-semibold mb-8"
            variants={sectionAnimation}
            initial="initial"
            animate="animate"
          >
            Revenues
          </motion.h2>
          {error && <p className="text-red-500">{error}</p>}
          {games.length === 0 && !error && (
            <p className="text-center text-sm text-gray-300">
              No approved games found
            </p>
          )}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-[#303030] rounded-lg">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-700">
                    Game Name
                  </th>
                  <th className="py-2 px-4 border-b border-gray-700">
                    Game Price
                  </th>
                  <th className="py-2 px-4 border-b border-gray-700">
                    Our Revenue
                  </th>
                </tr>
              </thead>
              <tbody>
                {games.map((game) => (
                  <tr key={game.id}>
                    <td className="text-center py-2 px-4 border-b border-gray-700">
                      {game.title}
                    </td>
                    <td className="text-center py-2 px-4 border-b border-gray-700">
                      ${game.price.toFixed(2)}
                    </td>
                    <td className="text-center py-2 px-4 border-b border-gray-700">
                      ${(game.price * 0.2).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8 flex justify-center">
            <button
              onClick={generatePDF}
              className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors duration-300"
            >
              Print Revenue Report
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Revenues;
