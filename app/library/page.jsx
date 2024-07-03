// pages/library.js
"use client";
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { AiOutlineHeart } from 'react-icons/ai';
import { AiFillHeart } from 'react-icons/ai';

const gameData = [
    {
        id: 1,
        name: 'CyberPunk 2077',
        image: '/img1.jpg',
        description: 'This is a description of the game',
        price: 'PKR 1499',
    },
    {
        id: 2,
        name: 'Tomb Raider',
        image: '/img2.jpg',
        description: 'This is a description of the game',
        price: 'PKR 1099',
    },
    {
        id: 3,
        name: 'Daysgone',
        image: '/img3.jpg',
        description: 'This is a description of the game',
        price: 'PKR 1499',
    },
    {
        id: 4,
        name: "Marvel's Spiderman 2",
        image: '/img4.jpg',
        description: 'This is a description of the game',
        price: 'PKR 999',
    },
    {
        id: 5,
        name: 'Spiderman 1',
        image: '/img5.jpg',
        description: 'This is a description of the game',
        price: 'PKR 1499',
    },
    {
        id: 6,
        name: 'Spiderman 2',
        image: '/img6.jpg',
        description: 'This is a description of the game',
        price: 'PKR 1699',
    },
    {
        id: 1,
        name: 'God of War',
        image: '/img7.jpg',
        description: 'This is a description of the game',
        price: 'PKR 1399',
    },
    {
        id: 2,
        name: 'Elden Ring',
        image: '/img8.jpg',
        description: 'This is a description of the game',
        price: 'PKR 1499',
    },
];

const cardAnimation = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: 'easeInOut' },
};

const headingAnimation = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: 'easeInOut' },
};

const Library = () => {
    const [favorites, setFavorites] = useState(gameData.map(() => false));

    const handleFavourite = (index) => {
        setFavorites(favorites.map((fav, i) => (i === index ? !fav : fav)));
    };

    const handleDownload = (imageSrc, imageName) => {
        const link = document.createElement('a');
        link.href = imageSrc;
        link.download = imageName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className='bg-[#181818] flex flex-col'>
            <Navbar />
            <div className='h-full container mx-auto text-white text-center py-8'>
                <motion.h2 className="text-4xl text-center text-white font-semibold mb-8" variants={headingAnimation}>
                    Library
                </motion.h2>
                <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {gameData.map((game, index) => (
                        <motion.div
                            key={game.id}
                            className="relative bg-[#303030] shadow-purple-300 p-4 rounded-lg shadow-md"
                            whileHover={{
                                scale: 1.05,
                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                                transition: { duration: 0.6 },
                            }}
                            {...cardAnimation}
                        >
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Image
                                    width={220}
                                    height={220}
                                    src={game.image}
                                    alt={game.name}
                                    className="w-full h-auto mb-2"
                                />
                            </motion.div>
                            <h3 className="text-white text-lg font-semibold">{game.name}</h3>
                            <p className="text-gray-300">{game.description}</p>
                            <p className="text-gray-300">{game.price}</p>
                            <motion.button
                                onClick={() => handleDownload(game.image, `${game.name}.jpg`)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className="mt-2 bg-[#71319f] text-white px-4 py-2 rounded-md"
                            >
                                Download
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
                                        onClick={() => handleFavourite(index)}
                                        className='cursor-pointer text-purple-400'
                                    />
                                ) : (
                                    <AiOutlineHeart
                                        size={24}
                                        onClick={() => handleFavourite(index)}
                                        className='cursor-pointer text-purple-400'
                                    />
                                )}
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
            <Footer />
        </div>
    );
};

export default Library;
