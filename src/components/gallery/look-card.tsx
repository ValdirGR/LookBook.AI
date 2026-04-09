"use client";

import { Eye, Clock, AlertTriangle } from "lucide-react";
import type { GeneratedImage } from "@prisma/client";

interface LookCardProps {
  look: GeneratedImage;
  onClick: (look: GeneratedImage) => void;
  showCollectionBadge?: boolean;
  collectionName?: string;
}

export function LookCard({ look, onClick, showCollectionBadge, collectionName }: LookCardProps) {
  // If still generating or failed, we show placeholders
  if (look.status === "PENDING") {
    return (
      <div className="relative break-inside-avoid mb-6 rounded-2xl bg-[var(--color-cream)] dark:bg-[#1a1918] aspect-[3/4] flex flex-col items-center justify-center p-6 text-center border border-[var(--color-light-gray)]">
        <Clock size={32} className="text-[var(--color-rose-gold)] animate-pulse mb-3" />
        <h4 className="font-display text-lg text-[var(--color-charcoal)] dark:text-[var(--color-cream)] mb-1">
          Gerando Imagem...
        </h4>
        <p className="text-xs text-[var(--color-warm-gray)]">
          O modelo de Inteligência Artificial está processando seu pedido.
        </p>
      </div>
    );
  }

  if (look.status === "FAILED") {
    return (
      <div className="relative break-inside-avoid mb-6 rounded-2xl bg-red-50 dark:bg-red-950/20 aspect-[3/4] flex flex-col items-center justify-center p-6 text-center border border-red-200 dark:border-red-900/50">
        <AlertTriangle size={32} className="text-red-500 mb-3" />
        <h4 className="font-display text-lg text-red-700 dark:text-red-400 mb-1">
          Falha na Geração
        </h4>
        <p className="text-xs text-red-600/70 dark:text-red-400/70">
          Não foi possível completar esta imagem. Tente alterar as configurações e gerar de novo.
        </p>
      </div>
    );
  }

  return (
    <div 
      className="group relative break-inside-avoid mb-6 rounded-2xl overflow-hidden cursor-zoom-in bg-[var(--color-cream)] dark:bg-black border border-[var(--color-light-gray)]"
      onClick={() => onClick(look)}
    >
      <img
        src={look.imageUrl}
        alt={look.promptUsed || "AI Generated Look"}
        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />
      
      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white font-medium">
          <Eye size={18} />
          <span>Ampliar</span>
        </div>
      </div>

      {/* Badges */}
      {showCollectionBadge && collectionName && (
        <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="px-3 py-1 flex items-center text-xs font-semibold uppercase tracking-wider rounded-md bg-white/90 dark:bg-black/80 backdrop-blur text-[var(--color-charcoal)] dark:text-[var(--color-cream)] shadow-sm">
            {collectionName}
          </span>
        </div>
      )}
    </div>
  );
}
