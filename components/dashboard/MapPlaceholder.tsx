"use client";
import { motion } from "framer-motion";
import { MapPin, Globe, Loader2 } from "lucide-react";

export const MapPlaceholder = () => {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-200/50">
      <div className="text-center space-y-4 p-8">
        {/* Animated Globe Icon */}
        <div className="relative flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="relative"
          >
            <Globe className="h-16 w-16 text-slate-400" />
          </motion.div>
          
          {/* Floating pins around the globe */}
          <motion.div
            animate={{ 
              y: [0, -8, 0],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 0 
            }}
            className="absolute -top-2 -right-2"
          >
            <MapPin className="h-4 w-4 text-red-400" />
          </motion.div>
          
          <motion.div
            animate={{ 
              y: [0, -6, 0],
              opacity: [0.4, 0.8, 0.4]
            }}
            transition={{ 
              duration: 2.5, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 0.5 
            }}
            className="absolute -bottom-1 -left-2"
          >
            <MapPin className="h-3 w-3 text-orange-400" />
          </motion.div>
          
          <motion.div
            animate={{ 
              y: [0, -4, 0],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 1.8, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 1 
            }}
            className="absolute top-3 -left-3"
          >
            <MapPin className="h-3 w-3 text-green-400" />
          </motion.div>
        </div>

        {/* Loading text and spinner */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
            <span className="text-sm font-medium text-slate-600">
              Memuat Peta Distribusi
            </span>
          </div>
          <p className="text-xs text-slate-500 max-w-xs">
            Sedang memproses data geospasial pengaduan untuk tampilan analitik
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-1">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2,
              }}
              className="w-2 h-2 bg-slate-400 rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
}; 