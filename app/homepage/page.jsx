"use client";
import React from "react";
import HeroSection from "../../components/HeroSection";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import RecommendedGames from "../../components/RecommendedGames";
import FeaturedGames from "../../components/FeaturedGames";
import FreeGames from "../../components/FreeGames";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import { useState, useEffect } from "react";

const HomePage = () => {
  const [userEmail, setUserEmail] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);

        const db = getDatabase();
        const userRef = ref(db, "users/" + user.uid);
        onValue(userRef, (snapshot) => {
          const userData = snapshot.val();
          if (userData) {
            setUsername(userData.username);
          }
        });
      } else {
        setUserEmail("");
        setUsername("");
      }
    });

    return unsubscribe;
  }, []);

  return (
    <div>
      <Navbar userEmail={userEmail} username={username} />
      <HeroSection />
      <RecommendedGames />
      <FeaturedGames />
      <FreeGames />
      <Footer />
    </div>
  );
};

export default HomePage;
