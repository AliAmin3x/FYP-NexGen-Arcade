"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { AiOutlineSearch } from "react-icons/ai";
import { TbAdjustmentsSearch } from "react-icons/tb";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [games, setGames] = useState([]);

  const fetchGames = useCallback(async (term) => {
    if (!term.trim()) { setGames([]); return; }
    try {
      const res = await fetch(`/api/games?status=Approved`);
      const data = await res.json();
      const filtered = (Array.isArray(data) ? data : []).filter((g) =>
        g.title?.toLowerCase().includes(term.toLowerCase())
      );
      setGames(filtered);
    } catch {
      setGames([]);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchGames(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm, fetchGames]);

  return (
    <div className="relative w-full mt-4 flex flex-col items-center">
      <div className="flex items-center justify-center gap-2 sm:gap-4 w-full h-16 sm:h-20 bg-[#181818] text-white font-bold text-2xl sm:text-4xl">
        <div className="w-3/4 sm:w-1/2 h-12 bg-transparent rounded-md flex items-center justify-center text-black font-normal text-lg border border-white focus-within:border-purple-400 transition-all duration-300 ease-in-out">
          <TbAdjustmentsSearch className="px-1 text-3xl text-white" />
          <input
            type="text"
            placeholder="Search for games..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-full px-2 sm:px-4 bg-transparent outline-none text-white font-normal text-sm sm:text-base"
          />
        </div>
        <AiOutlineSearch className="text-4xl border border-purple-500 text-white rounded-md p-1 hover:bg-purple-500 transition-all duration-300 ease-in-out cursor-pointer" />
      </div>
      {searchTerm && games.length > 0 && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-full max-w-screen-md mt-2 bg-[#181818] border border-gray-700 rounded-md z-10 flex flex-col items-center">
          {games.map((game) => (
            <div
              key={game.id}
              className="flex items-center bg-[#303030] hover:bg-[#606060] text-white p-2 rounded-md mb-2 w-full transition-all duration-300 ease-in-out"
            >
              {game.imageUrl ? (
                <Image src={game.imageUrl} alt={game.title} width={64} height={64} className="rounded-md mr-4" />
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
