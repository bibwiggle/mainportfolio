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
    <div onClick={handlePageClick} style={{ cursor: "pointer", userSelect: "none" }}>
      <motion.div
        className="text-white mix-blend-difference font-semibold opacity-95 tracking-normal text-8xl sm:text-9xl lg:text-9xl xl:text-10xl leading-[250px]"
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

