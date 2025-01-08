"use client"

import { motion } from "framer-motion";

export const NameAnimation = () => {
  const nameVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5,
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.h1
      className="text-white mix-blend-difference text-6xl font-light tracking-widest sm:text-6xl md:text-8xl lg:text-9xl"
      initial="hidden"
      animate="visible"
      variants={nameVariants}
    >
      Junu
    </motion.h1>
  );
};

export default NameAnimation;