"use client";

import React from 'react';
import { motion } from 'framer-motion';
import SearchBar from './SearchBar';
import Slider from 'react-slick';
import Image from 'next/image';

const HeroSection = () => {

    const imageUrls = [
        '/img1.jpg',
        '/img2.jpg',
        '/img3.jpg',
        '/img4.jpg',
        '/img7.jpg',
        '/img8.jpg',
    ];

    const settings = {
        dots: true,
        infinite: true,
        speed: 400,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        arrows: false
    };

    return (
        <div className='h-full flex flex-col items-center bg-[#181818] text-white font-bold text-4xl'>
            {/* Search Bar */}
            <SearchBar />

            {/* Div for heading and images */}
            <div className='mt-6 sm:mt-12 flex flex-col items-center gap-4 w-full h-[calc(100vh-80px)]'>
                {/* Animated Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className='text-3xl sm:text-4xl text-center'
                >
                    Welcome to{' '}
                    <span className='text-purple-400 font-bold italic tracking-widest'>
                        NexGen{' '}
                    </span>
                    Arcade
                </motion.h1>

                {/* Animated Description */}
                <motion.p
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className='text-sm sm:text-lg text-gray-300 text-center font-normal w-4/5 sm:w-1/2'
                >
                    where reality ends and the Game begins.
                    </motion.p>

                {/* Line Behind 'NexGen' Text */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className='w-1/2 sm:w-1/4 h-0.5 bg-white'
                />

                {/* Here Implement the React Carousel using react-slick */}
                <div className='w-11/12 sm:w-[60%] h-[60vh] sm:h-screen mx-auto'>
                    <Slider {...settings} className='text-white'>
                        {imageUrls.map((imageUrl, index) => (
                            <div key={index}>
                                <Image
                                    width={1280}
                                    height={720}
                                    src={imageUrl} alt={`Image ${index + 1}`}
                                    className='rounded-lg'
                                />
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
