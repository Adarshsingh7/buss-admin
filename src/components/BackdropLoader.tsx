import React from "react";
import { Loader2 } from "lucide-react";

interface BackdropLoaderProps {
  isLoading: boolean;
}

export const BackdropLoader: React.FC<BackdropLoaderProps> = ({
  isLoading,
}) => {
  if (!isLoading) return null;
  // console.log("backdrop");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      aria-busy="true"
      aria-label="Loading"
    >
      <div className="rounded-lg bg-white p-4 shadow-xl">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    </div>
  );
};
