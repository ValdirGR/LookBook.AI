"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import type { GeneratedImage } from "@prisma/client";

interface LookLightboxProps {
  look: GeneratedImage | null;
  onClose: () => void;
}

export function LookLightbox({ look, onClose }: LookLightboxProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Close on escape
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (look) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [look, onClose]);

  if (!look || !mounted) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Content */}
      <div className="relative w-full h-full max-w-5xl max-h-screen flex flex-col items-center justify-center pointer-events-none">
        
        {/* Top controls */}
        <div className="absolute top-0 right-0 p-4 flex items-center gap-4 z-10 pointer-events-auto">
          <a
            href={look.imageUrl}
            download={`lookbook-${look.id}.jpg`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur transition-colors"
            title="Baixar imagem"
          >
            <Download size={18} />
          </a>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur transition-colors"
            title="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Selected Image */}
        <div className="relative w-full h-[85vh] flex justify-center pointer-events-auto shadow-2xl">
          <img
            src={look.imageUrl}
            alt={look.promptUsed || "Lookbook image"}
            className="max-w-full max-h-full object-contain rounded-md"
          />
        </div>

        {/* Footer data */}
        {look.promptUsed && (
          <div className="absolute bottom-0 inset-x-0 p-6 flex justify-center pointer-events-none">
            <div className="pointer-events-auto max-w-2xl text-center bg-black/60 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 shadow-lg">
              <p className="text-white/80 text-sm">{look.promptUsed}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
