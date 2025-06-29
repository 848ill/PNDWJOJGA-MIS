import { Globe } from "lucide-react";

export const MapPlaceholder = () => {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-100">
      <div className="relative flex items-center justify-center">
        <Globe className="h-24 w-24 text-gray-300" />
        <div className="absolute h-32 w-32 animate-ping rounded-full border-2 border-gray-300" />
      </div>
    </div>
  );
}; 