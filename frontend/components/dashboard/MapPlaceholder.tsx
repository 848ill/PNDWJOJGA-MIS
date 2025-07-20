"use client";
import { MapPin, Globe } from "lucide-react";

export const MapPlaceholder = () => {
  return (
    <div className="flex h-full w-full items-center justify-center bg-background rounded-lg border border-border">
      <div className="text-center space-y-4 p-8">
        {/* Premium Globe Icon */}
        <div className="relative flex items-center justify-center">
          <div className="relative">
            <Globe className="h-16 w-16 text-muted-foreground" />
          </div>
          
          {/* Premium static pins - using consistent colors */}
          <div className="absolute -top-2 -right-2">
            <MapPin className="h-4 w-4 text-muted-foreground/70" />
          </div>
          
          <div className="absolute -bottom-1 -left-2">
            <MapPin className="h-3 w-3 text-muted-foreground/60" />
          </div>
          
          <div className="absolute top-3 -left-3">
            <MapPin className="h-3 w-3 text-muted-foreground/80" />
          </div>
        </div>

        {/* Premium loading text */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-muted-foreground/30 border-t-foreground rounded-full animate-spin"></div>
            <span className="text-sm font-medium sophisticated-text">
              Memuat Peta Distribusi
            </span>
          </div>
          <p className="text-xs premium-text max-w-xs">
            Sedang memproses data geospasial pengaduan untuk tampilan analitik
          </p>
        </div>

        {/* Premium dots for simplicity */}
        <div className="flex justify-center gap-1">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="w-2 h-2 bg-muted-foreground/40 rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
}; 