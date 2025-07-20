"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const PremiumLoader = ({ className, variant = "dots" }: { className?: string; variant?: "dots" | "pulse" | "orbit" | "wave" }) => {
  if (variant === "dots") {
    return (
      <div className={cn("flex space-x-2", className)}>
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.2,
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <motion.div
        className={cn("w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full", className)}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    );
  }

  if (variant === "orbit") {
    return (
      <div className={cn("relative w-12 h-12", className)}>
        <motion.div
          className="absolute inset-0 border-2 border-transparent border-t-indigo-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute inset-1 border-2 border-transparent border-r-purple-500 rounded-full"
          animate={{ rotate: -360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    );
  }

  if (variant === "wave") {
    return (
      <div className={cn("flex space-x-1", className)}>
        {[0, 1, 2, 3, 4].map((index) => (
          <motion.div
            key={index}
            className="w-1 bg-gradient-to-t from-emerald-500 to-teal-500 rounded-full"
            animate={{
              height: [20, 40, 20],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.1,
            }}
          />
        ))}
      </div>
    );
  }

  return null;
}; 