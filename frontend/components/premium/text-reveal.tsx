"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const TextReveal = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      x: -20,
      y: 10,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      style={{ overflow: "hidden", display: "flex", flexWrap: "wrap" }}
      variants={container}
      initial="hidden"
      animate="visible"
      className={cn("", className)}
    >
      {words.map((word, index) => (
        <motion.span
          variants={child}
          style={{ marginRight: "5px" }}
          key={index}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

export const TypewriterEffect = ({
  words,
  className,
}: {
  words: {
    text: string;
    className?: string;
  }[];
  className?: string;
}) => {
  return (
    <div className={cn("", className)}>
      {words.map((word, idx) => (
        <motion.span
          key={idx}
          className={cn("text-black", word.className)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.25,
            delay: idx * 0.1,
          }}
        >
          {word.text}
        </motion.span>
      ))}
    </div>
  );
}; 