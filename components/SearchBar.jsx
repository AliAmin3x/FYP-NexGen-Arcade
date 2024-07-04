import React, { useState, useEffect, useRef } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { TbAdjustmentsSearch } from "react-icons/tb";
import { firestore } from "../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import debounce from "lodash.debounce";

const gamesRef = collection(firestore, "games");

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [games, setGames] = useState([]);
  const [showNoGamesFound, setShowNoGamesFound] = useState(false);
  const searchInputRef = useRef(null);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClickOutside = (event) => {
    if (
      searchInputRef.current &&
      !searchInputRef.current.contains(event.target)
    ) {
      setSearchTerm("");
      setGames([]);
      setShowNoGamesFound(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchGames = async (searchTerm) => {
    try {
      if (searchTerm.trim() !== "") {
        const q = query(
          gamesRef,
          where("title", ">=", searchTerm.trim().toLowerCase()),
          where("title", "<=", searchTerm.trim().toLowerCase() + "\uf8ff"),
          orderBy("title"),
          limit(10)
        );
        const querySnapshot = await getDocs(q);
        const gameList = querySnapshot.docs.map((doc) => doc.data());
        setGames(gameList);
        setShowNoGamesFound(gameList.length === 0);
      } else {
        setGames([]);
        setShowNoGamesFound(false);
      }
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };

  const debouncedFetchGames = useRef(
    debounce((term) => {
      fetchGames(term);
    }, 300)
  ).current;

  useEffect(() => {
    debouncedFetchGames(searchTerm);

    return () => {
      debouncedFetchGames.cancel();
    };
  }, [searchTerm]);

  return (
    <div className="relative w-full mt-4 flex flex-col items-center">
      <div className="flex items-center justify-center gap-2 sm:gap-4 w-full h-16 sm:h-20 bg-[#181818] text-white font-bold text-2xl sm:text-4xl">
        <div
          className="w-3/4 sm:w-1/2 h-12 bg-transparent rounded-md flex items-center justify-center text-black font-normal text-lg border border-white focus-within:border-purple-400 transition-all duration-300 ease-in-out"
          ref={searchInputRef}
        >
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
      {searchTerm && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-full max-w-screen-md mt-2 bg-[#181818] border border-gray-700 rounded-md z-10 flex flex-col items-center">
          {games.length > 0 ? (
            games.map((game, index) => (
              <div
                key={index}
                className="flex items-center bg-[#303030] text-white p-2 rounded-md mb-2 w-full"
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
            ))
          ) : showNoGamesFound ? (
            <p className="text-white text-lg mt-4 p-2">No games found.</p>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
