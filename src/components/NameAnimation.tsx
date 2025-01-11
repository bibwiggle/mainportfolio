"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const ShatterEffect = () => {
  const [text, setText] = useState("Junu"); // Default to English name
  const koreanText = "이준우"; // Korean name

  const shatterVariants = {
    initial: { opacity: 1, x: 0, y: 0 },
    hover: (i: number) => ({
      opacity: 1,
      x: Math.random() * 50 - 25, // Random displacement
      y: Math.random() * 50 - 25,
      transition: { duration: 0.5 },
    }),
  };

  const handlePageClick = () => {
    setText((prevText) => (prevText === "Junu" ? koreanText : "Junu")); // Toggle between English and Korean
  };

  return (
    <div onClick={handlePageClick} style={{ cursor: "pointer", userSelect: "none" }}>
      <motion.div
        className="flex text-white mix-blend-difference font-semibold opacity-95 tracking-tight text-8xl sm:text-9xl lg:text-9xl xl:text-10xl"
        initial="initial"
        whileHover="hover"
      >
        {text.split("").map((char, index) => (
          <motion.span
            key={index}
            custom={index}
            variants={shatterVariants}
            style={{ display: "inline-block" }}
          >
            {char}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
};

export default ShatterEffect;
