import React from "react";
import heroImg from "../assets/hero_img.webp";

import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const handleShopNow = () => {
    navigate("/collection");
  };

  return (
    <div className="flex flex-col sm:flex-row border border-gray-400">
      {/* Hero Left Side */}
      <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">
        <div className="text-[#414141]">
          <div className="flex items-center gap-2">
            <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
            <p className="font-medium text-sm md:text-base">OUR BESTSELLERS</p>
          </div>

          <h1 className="prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed">
            Latest Arrivals
          </h1>

          {/* 👉 SHOP NOW Button */}
          <button
            onClick={handleShopNow}
            className="mt-6 inline-block bg-[#bfa67a] cursor-pointer text-white px-6 py-2 rounded-full text-sm md:text-base hover:bg-[#a88e65] transition-all duration-200"
          >
            SHOP NOW →
          </button>
        </div>
      </div>

      {/* Hero Right Side */}
      <img
        className="w-full sm:w-1/2"
        src={heroImg}
        alt="Hero"
        loading="eager"
        width="600"
        height="600"
      />
    </div>
  );
};

export default Hero;
