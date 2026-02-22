import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { useLocation } from "react-router-dom";
import React, { useRef } from "react";

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();

  // 🔥 Track previous route (VERY IMPORTANT for reverse animation)
  const prevPath = useRef(location.pathname);

  const getDirection = () => {
    const order = ["/login", "/signup", "/otp", "/forgot_password"];

    const prevIndex = order.indexOf(prevPath.current);
    const currentIndex = order.indexOf(location.pathname);

    prevPath.current = location.pathname;

    return currentIndex > prevIndex ? "forward" : "backward";
  };

  const pageVariants: Variants = {
    initial: (direction: string) => ({
      opacity: 0,
      rotateY: direction === "forward" ? 90 : -90,
      scale: 0.8,
    }),
    animate: {
      opacity: 1,
      rotateY: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeInOut" as const,
      },
    },
    exit: (direction: string) => ({
      opacity: 0,
      rotateY: direction === "forward" ? -90 : 90,
      scale: 0.8,
      transition: {
        duration: 0.4,
        ease: "easeInOut" as const,
      },
    }),
  };

  const direction = getDirection();

  return (
    <div
      style={{
        perspective: "1200px",
        width: "100%",
        height: "100%",
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        background: "inherit",
      }}
    >
      {/* ❌ custom yaha nahi dena */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          custom={direction}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            inset: 0,
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
            transformPerspective: 1200, // 🔥 hidden 3D fix
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PageTransition;