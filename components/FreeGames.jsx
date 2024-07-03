import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import { db, auth } from '../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import 'react-toastify/dist/ReactToastify.css';

const FreeGames = () => {
    const [games, setGames] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const router = useRouter(); // Initialize useRouter hook

    const handleFreeGamesClick = () => {
        router.push('/freegames');
    };

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const q = query(collection(db, 'games'), where('type', '==', 'free'));
                const querySnapshot = await getDocs(q);
                const gamesList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setGames(gamesList);
                setFavorites(gamesList.map(() => false));
            } catch (e) {
                console.error("Error fetching games: ", e);
                toast.error("Error fetching games");
            }
        };

        fetchGames();
    }, []);

    const handleFavourite = async (game, index) => {
        try {
            const user = auth.currentUser;
            if (!user) {
                console.error("User not logged in");
                toast.error("User not logged in");
                return;
            }

            const favCollectionRef = collection(db, 'favorites');
            const favData = {
                uid: user.uid,
                gameId: game.id,
                name: game.title,
                price: game.price,
                image: game.imageUrl,
            };

            if (favorites[index]) {
                // Remove from favorites
                const favDocRef = doc(favCollectionRef, `${user.uid}_${game.id}`);
                await deleteDoc(favDocRef);
                toast.success("Removed from favorites!");
            } else {
                // Add to favorites
                await addDoc(favCollectionRef, favData);
                toast.success("Added to favorites!");
            }

            setFavorites(favorites.map((fav, i) => (i === index ? !fav : fav)));
        } catch (e) {
            console.error("Error handling favorite: ", e);
            toast.error("Error handling favorite!");
        }
    };

    const handleAddToCart = async (game) => {
        try {
            const user = auth.currentUser;
            if (!user) {
                console.error("User not logged in");
                toast.error("User not logged in");
                return;
            }

            const cartCollectionRef = collection(db, 'cart');

            const cartData = {
                uid: user.uid,
                name: game.title,
                description: game.description,
                image: game.imageUrl,
                price: game.price,
            };

            await addDoc(cartCollectionRef, cartData);
            console.log("Game added to cart successfully!");
            toast.success("Game added to cart successfully!");
        } catch (e) {
            console.error("Error adding game to cart: ", e);
            toast.error("Error adding game to cart!");
        }
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: Math.min(3, games.length),
        slidesToScroll: 3,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: Math.min(2, games.length),
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <div className="container text-center mx-auto py-8 bg-[#181818]">
            <button 
                onClick={handleFreeGamesClick}
                className="text-3xl text-center text-white font-semibold mb-4 hover:text-purple-400 transition-colors duration-300"
            >
                Free Games
            </button>
            <Slider {...settings}>
                {games.map((game, index) => (
                    <div key={game.id} className="flex p-2">
                        <div className="relative bg-[#303030] p-4 rounded-lg shadow-md">
                            <div className="image-container w-full h-48 relative">
                                <Image
                                    layout="fill"
                                    objectFit="cover"
                                    src={game.imageUrl}
                                    alt={game.title}
                                    className="rounded-lg"
                                />
                            </div>
                            <h3 className="text-white text-lg font-semibold mt-2">{game.title}</h3>
                            <button
                                className="mt-2 bg-[#71319f] text-white px-4 py-2 rounded-md"
                                onClick={() => handleAddToCart(game)}
                            >
                                Add to Cart
                            </button>

                            <div className="absolute bottom-2 right-2">
                                {favorites[index] ? (
                                    <AiFillHeart
                                        size={24}
                                        onClick={() => handleFavourite(game, index)}
                                        className='cursor-pointer text-purple-400'
                                    />
                                ) : (
                                    <AiOutlineHeart
                                        size={24}
                                        onClick={() => handleFavourite(game, index)}
                                        className='cursor-pointer text-purple-400'
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
            <ToastContainer />
        </div>
    );
};

export default FreeGames;
