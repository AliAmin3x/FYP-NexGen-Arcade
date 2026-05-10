"use client";
import React from "react";
import HeroSection from "../../components/HeroSection";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import RecommendedGames from "../../components/RecommendedGames";
import FeaturedGames from "../../components/FeaturedGames";
import FreeGames from "../../components/FreeGames";
import { useSession } from "../../lib/SessionContext";

const HomePage = () => {
  const { user } = useSession();
  return (
    <div>
      <Navbar userEmail={user?.email} username={user?.username} />
      <HeroSection />
      <RecommendedGames />
      <FeaturedGames />
      <FreeGames />
      <Footer />
    </div>
  );
};

export default HomePage;
