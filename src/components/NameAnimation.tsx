"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export const NameAnimation = () => {
  const [text, setText] = useState("Junu"); // Default to English name
  const koreanText = "이준우"; // Korean name

  const handlePageClick = () => {
    setText((prevText) => (prevText === "Junu" ? koreanText : "Junu")); // Toggle between English and Korean
  };

  return (
    <div className="py-0" onClick={handlePageClick} style={{ cursor: "pointer", userSelect: "none" }}>
      <motion.div
        className="absolute text-sky-200 blur-md font-thin opacity-100 tracking-widest text-8xl sm:text-8xl lg:text-9xl xl:text-9xl 
        xl:leading-[270px] lg:leading-[270px] sm:leading-[170px] leading-[170px]"
        initial="initial"
        whileHover="hover"
      >
        {text.split("").map((char, index) => (
          <motion.span
            key={index}
            custom={index}
            style={{ display: "inline" }}
          >
            {char}
          </motion.span>
        ))}
      </motion.div>
      <motion.div
        className="relative text-white font-thin opacity-90 tracking-widest text-8xl sm:text-8xl lg:text-9xl xl:text-9xl 
        xl:leading-[270px] lg:leading-[270px] sm:leading-[170px] leading-[170px]"
        initial="initial"
        whileHover="hover"
      >
        {text.split("").map((char, index) => (
          <motion.span
            key={index}
            custom={index}
            style={{ display: "inline" }}
          >
            {char}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
};

