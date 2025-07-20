"use client";
import { motion } from "framer-motion";

export const BackgroundBeams = ({ className }: { className?: string }) => {
  const paths = [
    "M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875",
    "M-373 -197C-373 -197 -305 208 159 335C623 462 691 867 691 867", 
    "M-366 -205C-366 -205 -298 200 166 327C630 454 698 859 698 859",
    "M-359 -213C-359 -213 -291 192 173 319C637 446 705 851 705 851",
    "M-352 -221C-352 -221 -284 184 180 311C644 438 712 843 712 843",
    "M-345 -229C-345 -229 -277 176 187 303C651 430 719 835 719 835",
  ];

  return (
    <div className={`absolute inset-0 ${className}`}>
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 696 895"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {paths.map((path, index) => (
          <motion.path
            key={index}
            d={path}
            stroke={`url(#gradient${index})`}
            strokeWidth="2"
            strokeOpacity="1"
            pathLength="0"
            animate={{
              pathLength: [0, 1, 0],
            }}
            transition={{
              duration: 10 + index * 2,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
              delay: index * 1,
            }}
          />
        ))}
        <defs>
          {paths.map((_, index) => (
            <linearGradient
              key={index}
              id={`gradient${index}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="1" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
      </svg>
    </div>
  );
}; 