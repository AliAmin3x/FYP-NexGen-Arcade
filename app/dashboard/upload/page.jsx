"use client";

import React, { useState } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { motion } from "framer-motion";
import { AiOutlineCloudUpload } from "react-icons/ai";
import Link from "next/link";
import { db, auth } from "../../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const categoryOptions = [
    "Action",
    "Adventure",
    "Puzzle",
    "Strategy",
    "Racing",
    "RPG",
    "Sports",
    "Simulation",
    "Battle Royale",
    "Open-World"
];

const sectionAnimation = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeInOut" },
};

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

const UploadGames = () => {
    const [gameTitle, setGameTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState(categoryOptions[0]);
    const [price, setPrice] = useState("");
    const [image, setImage] = useState(null);
    const [type, setType] = useState("recommended");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");

        try {
            if (!image) {
                throw new Error("Please select an image to upload.");
            }

            // Ensure the user is logged in
            const user = auth.currentUser;
            if (!user) {
                throw new Error("User not logged in.");
            }

            // Upload image to Firebase Storage
            const storage = getStorage();
            const storageRef = ref(storage, `gameImages/${image.name}`);
            await uploadBytes(storageRef, image);
            const imageUrl = await getDownloadURL(storageRef);

            // Add game to Firestore
            const gamesCollectionRef = collection(db, "games");
            await addDoc(gamesCollectionRef, {
                title: gameTitle,
                description,
                category,
                price: parseFloat(price),
                imageUrl,
                type,
                uid: user.uid,
                status: 'Pending'  // Set status to 'Pending'
            });

            setSuccessMessage("Game uploaded successfully!");
            setGameTitle("");
            setDescription("");
            setCategory(categoryOptions[0]);
            setPrice("");
            setImage(null);
            setType("recommended");
        } catch (error) {
            console.error("Error uploading game: ", error);
            setErrorMessage(error.message);
        }
    };

    return (
        <div className="bg-[#181818] flex flex-col min-h-screen">
            <Navbar />
            <div className="container mx-auto text-white py-8">
                <motion.h2
                    className="text-4xl text-center text-white font-semibold mb-8"
                    variants={sectionAnimation}
                    initial="initial"
                    animate="animate"
                >
                    Upload Game
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
                    <motion.form
                        onSubmit={handleSubmit}
                        className="ml-8 bg-[#303030] p-8 rounded-lg shadow-md w-full md:w-3/4 mx-auto"
                        variants={sectionAnimation}
                        initial="initial"
                        animate="animate"
                    >
                        {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
                        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
                        <div className="mb-4">
                            <label className="block text-gray-300 mb-1" htmlFor="gameTitle">
                                Game Title
                            </label>
                            <input
                                type="text"
                                id="gameTitle"
                                value={gameTitle}
                                onChange={(e) => setGameTitle(e.target.value)}
                                className="border-none w-full text-white py-2 px-3  bg-[#4e4949] rounded-lg"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-300 mb-1" htmlFor="description">
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="bg-[#4e4949] border-none w-full text-white py-2 px-3 focus:outline-none rounded-lg"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-300 mb-1" htmlFor="type">
                                Game Type
                            </label>
                            <select
                                id="type"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="border-none w-full text-white py-2 px-3 focus:outline-none bg-[#4e4949] rounded-lg"
                                required
                            >
                                <option value="recommended" className="text-white">Recommended</option>
                                <option value="featured" className="text-white">Featured</option>
                                <option value="free" className="text-white">Free</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-300 mb-1" htmlFor="category">
                                Game Category
                            </label>
                            <select
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="border-none w-full text-white py-2 px-3 focus:outline-none bg-[#4e4949] rounded-lg"
                                required
                            >
                                {categoryOptions.map((option) => (
                                    <option key={option} value={option} className="text-white">
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-300 mb-1" htmlFor="price">
                                Game Price (PKR)
                            </label>
                            <input
                                type="number"
                                id="price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="border-none w-full text-white py-2 px-3 focus:outline-none bg-[#4e4949] rounded-lg"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-300 mb-1" htmlFor="image">
                                Game Image
                            </label>
                            <div className="flex items-center bg-[#4e4949] rounded-lg px-3 py-2">
                                <AiOutlineCloudUpload className="text-gray-400 mr-3" />
                                <input
                                    type="file"
                                    id="image"
                                    onChange={handleImageChange}
                                    className="bg-transparent border-none w-full text-white py-2 focus:outline-none"
                                    required
                                />
                            </div>
                        </div>
                        <motion.button
                            type="submit"
                            className="w-full bg-[#71319f]   text-white py-2 rounded-lg hover:bg-purple-600 transition-colors duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
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
