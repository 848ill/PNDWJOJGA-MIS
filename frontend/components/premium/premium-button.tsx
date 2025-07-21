"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const PremiumButton = ({
  children,
  className,
  variant = "primary",
  onClick,
  disabled = false,
}: {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "ghost" | "neon";
  onClick?: () => void;
  disabled?: boolean;
}) => {
  const variants = {
    primary: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40",
    secondary: "bg-white/80 backdrop-blur-md text-slate-700 border border-slate-200 shadow-lg hover:bg-white/90 hover:shadow-xl",
    ghost: "text-slate-700 hover:bg-slate-100/50 backdrop-blur-sm",
    neon: "bg-slate-900 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/40 hover:border-cyan-400/50",
  };

  return (
    <motion.button
      className={cn(
        "px-6 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden",
        variants[variant],
        className
      )}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}; 