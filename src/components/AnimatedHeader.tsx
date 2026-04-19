"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface NavLink {
  href: string;
  label: string;
  colorClass?: string;
}

interface AnimatedHeaderProps {
  navLinks: NavLink[];
}

export function AnimatedHeader({ navLinks }: AnimatedHeaderProps) {
  const [isAtTop, setIsAtTop] = useState(true);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrollingUp, setIsScrollingUp] = useState(false);

  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearHideTimer() {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  }

  const handleScroll = useCallback(() => {
    const scrollY = Math.max(0, window.scrollY); // clamp negatives from iOS overscroll

    if (scrollY === 0) {
      setIsAtTop(true);
      setShowHeader(true);
      setIsScrollingUp(false);
      clearHideTimer();
    } else {
      setIsAtTop(false);

      if (scrollY < lastScrollY) {
        // Scrolling up
        setIsScrollingUp(true);
        setShowHeader(true);
        clearHideTimer();
      } else if (scrollY > lastScrollY && scrollY > 5) {
        // Scrolling down — ignore tiny snapback from overscroll
        setIsScrollingUp(false);
        if (showHeader) {
          clearHideTimer();
          hideTimer.current = setTimeout(() => {
            setShowHeader(false);
          }, 0);
        }
      }
    }

    setLastScrollY(scrollY);
  }, [lastScrollY, showHeader]);

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  function handleMouseEnterTopZone() {
    clearHideTimer();
    if (!isAtTop) {
      setShowHeader(true);
    }
  }

  function handleMouseLeaveHeader() {
    clearHideTimer();
    if (!isAtTop && !isScrollingUp) {
      hideTimer.current = setTimeout(() => {
        setShowHeader(false);
      }, 1000); // Increased delay to 1000ms
    }
  }

  return (
    <>
      {!isAtTop && (
        <div
          className="fixed top-0 left-0 z-[9998] w-full h-[40px]"
          onMouseEnter={handleMouseEnterTopZone}
        />
      )}

      <motion.header
        className="fixed top-0 left-0 right-0 z-[9999] h-14 flex items-center 
                   backdrop-blur-sm shadow bg-opacity-30 px-4 lg:px-6"
        onMouseLeave={handleMouseLeaveHeader}
        initial={false}
        animate={{
          y: showHeader ? 0 : -80,
          opacity: showHeader ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <nav className="mx-auto flex gap-4 sm:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              className={`${link.colorClass || "text-white"}
                          hover:underline underline-offset-4
                          font-normal sm:text-sm md:text-base lg:text-lg`}
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </motion.header>
    </>
  );
}