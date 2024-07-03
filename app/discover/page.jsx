"use client";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { motion } from "framer-motion";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import Image from "next/image";

const gameDetails = {
    title: "Marvel's Spiderman",
    publisher: "Marvel",
    genre: "Action, Strategy",
    features: "Single Player",
    description: `Swing into action and embrace the exhilarating thrill of becoming New York City's friendly neighborhood superhero in Marvel's Spider-Man: Web of Adventures. Developed by Insomniac Games and published by Sony Interactive Entertainment, this iconic action-adventure game brings the iconic Marvel hero to life in an immersive open-world experience like never before.
    
    Step into the shoes of Peter Parker, a.k.a. Spider-Man, as he navigates the bustling streets of Manhattan, fighting crime, and protecting its citizens from threats both old and new. Using his agility, acrobatic abilities, and web-slinging abilities, Spider-Man traverses the city skyline with speed and grace, delivering justice to villains who dare to threaten the peace.
    
    In Marvel's Spider-Man: Web of Adventures, players will explore a vibrant and dynamic rendition of New York City, filled with iconic landmarks, detailed neighborhoods, and hidden secrets waiting to be discovered. From the towering skyscrapers of Midtown to the gritty alleys of Hell's Kitchen, every corner of the city offers opportunities for excitement and heroism.
    
    As Spider-Man, players will face off against a rogues' gallery of classic villains from the Marvel universe, including the likes of Green Goblin, Doctor Octopus, and Venom. Each of these iconic foes has unique and formidable abilities, posing a significant threat that will test the player's skills and strategy. To overcome these challenges, players can utilize a variety of combat moves, gadgets, and suit upgrades.
    
    Being a hero isn't just about fighting crime – it's also about balancing Peter Parker's personal life with his superhero duties. The game delves into Peter's interactions with friends, family, and love interests, as he navigates the complexities of maintaining dual identities and protecting those he cares about.`,
    image: "/img2.jpg"
};

const sectionAnimation = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeInOut" },
};

const Discover = () => {
    const [currentImage, setCurrentImage] = useState(gameDetails.image);

    const handlePrevImage = () => {
        if (currentImage === "/img2.jpg")
            setCurrentImage("/img6.jpg");
        else if (currentImage === "/img4.jpg")
            setCurrentImage("/img2.jpg");
        else if (currentImage === "/img5.jpg")
            setCurrentImage("/img4.jpg");
        else setCurrentImage("/img5.jpg");
    };

    const handleNextImage = () => {
        if (currentImage === "/img2.jpg")
            setCurrentImage("/img4.jpg");
        else if (currentImage === "/img4.jpg")
            setCurrentImage("/img5.jpg");
        else if (currentImage === "/img5.jpg")
            setCurrentImage("/img6.jpg");
        else setCurrentImage("/img2.jpg");
    };

    return (
        <div className="bg-[#181818] flex flex-col min-h-screen">
            <Navbar />
            <div className="container mx-auto text-white py-8 px-4">
                <motion.h2
                    className="text-4xl text-center text-white font-semibold mb-8"
                    variants={sectionAnimation}
                    initial="initial"
                    animate="animate"
                >
                    Discover
                </motion.h2>
                <motion.div
                    className="flex flex-col items-center"
                    variants={sectionAnimation}
                    initial="initial"
                    animate="animate"
                >
                    <div className="relative w-full md:w-2/3 flex justify-center items-center mb-8 md:mb-0">
                        <button
                            onClick={handlePrevImage}
                            className="absolute left-0 text-white text-2xl bg-gray-700 rounded-full p-2 hover:bg-purple-500 transition-colors duration-300"
                        >
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
                        <button
                            onClick={handleNextImage}
                            className="absolute right-0 text-white text-2xl bg-gray-700 rounded-full p-2 hover:bg-purple-500 transition-colors duration-300"
                        >
                            <AiOutlineRight />
                        </button>
                    </div>
                    <div className="mt-8 w-full md:w-3/4 pl-12 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4">Game Title: {gameDetails.title}</h3>
                        <p className="mb-2"><strong>Publisher:</strong> {gameDetails.publisher}</p>
                        <p className="mb-2"><strong>Genre:</strong> {gameDetails.genre}</p>
                        <p className="mb-2"><strong>Features:</strong> {gameDetails.features}</p>
                        <p className="mb-4 mt-6"><strong>Description:</strong> {gameDetails.description}</p>
                        <div className="flex justify-end gap-4">
                            <motion.button
                                className="w-32 bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Buy Now
                            </motion.button>
                            <motion.button
                                className="w-32 bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Add to cart
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
            <Footer />
        </div>
    );
};

export default Discover;
