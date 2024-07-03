"use client";

import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { motion } from "framer-motion";
import { AiOutlineUser } from 'react-icons/ai';
import Link from 'next/link';


const sectionAnimation = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeInOut" },
};

const GameApprovals = () => {
    const [games, setGames] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const q = query(collection(db, 'games'), where('status', '==', 'Pending'));
                const querySnapshot = await getDocs(q);
                const gamesList = [];
                querySnapshot.forEach((doc) => {
                    gamesList.push({ id: doc.id, ...doc.data() });
                });
                setGames(gamesList);
            } catch (err) {
                setError('Failed to fetch games');
                console.error(err);
            }
        };

        fetchGames();
    }, []);

    const handleApprove = async (gameId) => {
        try {
            const gameRef = doc(db, 'games', gameId);
            await updateDoc(gameRef, { status: 'Approved' });
            setGames(games.filter((game) => game.id !== gameId));
        } catch (err) {
            setError('Failed to approve game');
            console.error(err);
        }
    };

    const handleReject = async (gameId) => {
        try {
            const gameRef = doc(db, 'games', gameId);
            await updateDoc(gameRef, { status: 'Rejected' });
            setGames(games.filter((game) => game.id !== gameId));
        } catch (err) {
            setError('Failed to reject game');
            console.error(err);
        }
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

            <div
            className='flex flex-1'
            >
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
                    Game Approvals
                </motion.h2>
                    {error && <p className="text-red-500">{error}</p>}
                    {
                        games.length === 0 && !error && (
                            <p className="text-center text-sm text-gray-300">No games to approve</p>
                        )
                    }
                <div className="space-y-4">
                    {games.map((game) => (
                        <motion.div
                            key={game.id}
                            className="bg-[#303030] p-4 rounded-lg shadow-md"
                            variants={sectionAnimation}
                            initial="initial"
                            animate="animate"
                        >
                            <h3 className="text-xl font-semibold">{game.title}</h3>
                            <p>{game.description}</p>
                            <div className="flex space-x-4 mt-4">
                                <button
                                    onClick={() => handleApprove(game.id)}
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleReject(game.id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                >
                                    Reject
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default GameApprovals;