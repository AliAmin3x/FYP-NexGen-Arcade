import React, { useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { TbAdjustmentsSearch } from "react-icons/tb";
import { firestore } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  startAt,
  endAt,
} from "firebase/firestore";
import debounce from "lodash.debounce";

const gamesRef = collection(firestore, "games");

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [games, setGames] = useState([]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const fetchGames = async () => {
      try {
        if (searchTerm.trim() === "") {
          setGames([]);
          return;
        }
        const formattedTerm = searchTerm.trim().charAt(0).toUpperCase() + searchTerm.trim().slice(1).toLowerCase();
        const q = query(
          gamesRef,
          where("title", ">=", formattedTerm),
          where("title", "<=", formattedTerm + "\uf8ff")
        );

        const querySnapshot = await getDocs(q);

        const gameList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        setGames(gameList);
      } catch (error) {
        console.error("Error searching games:", error);
      }
    };

    const debouncedFetchGames = debounce(fetchGames, 300);

    if (searchTerm.trim() !== "") {
      debouncedFetchGames();
    } else {
      setGames([]);
    }

    return () => {
      debouncedFetchGames.cancel();
    };
  }, [searchTerm]);

  return (
    <div className="relative w-full mt-4 flex flex-col items-center">
      <div className="flex items-center justify-center gap-2 sm:gap-4 w-full h-16 sm:h-20 bg-[#181818] text-white font-bold text-2xl sm:text-4xl">
        <div className="w-3/4 sm:w-1/2 h-12 bg-transparent rounded-md flex items-center justify-center text-black font-normal text-lg border border-white focus-within:border-purple-400 transition-all duration-300 ease-in-out">
          <TbAdjustmentsSearch className="px-1 text-3xl text-white" />
          <input
            type="text"
            placeholder="Search for games..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full h-full px-2 sm:px-4 bg-transparent outline-none text-white font-normal text-sm sm:text-base"
          />
        </div>
        <AiOutlineSearch className="text-4xl border border-purple-500 text-white rounded-md p-1 hover:bg-purple-500 transition-all duration-300 ease-in-out cursor-pointer" />
      </div>
      {searchTerm && games.length > 0 && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-full max-w-screen-md mt-2 bg-[#181818] border border-gray-700 rounded-md z-10 flex flex-col items-center">
          {games.map((game, index) => (
            <div
              key={index}
              className="flex items-center bg-[#303030] hover:bg-[#606060] text-white p-2 rounded-md mb-2 w-full transition-all duration-300 ease-in-out"
            >
              {game.imageUrl ? (
                <img
                  src={game.imageUrl}
                  alt={game.title}
                  className="w-16 h-16 rounded-md mr-4"
                />
              ) : (
                <div className="w-16 h-16 rounded-md mr-4 bg-gray-600 flex items-center justify-center">
                  <span className="text-sm text-white">No Image</span>
                </div>
              )}
              <h3 className="text-xl font-bold">{game.title}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
