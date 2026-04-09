"use client";

import { useState } from "react";
import type { GeneratedImage } from "@prisma/client";
import { LookCard } from "./look-card";
import { LookLightbox } from "./look-lightbox";

// Extensão com nomes das coleções de forma opcional (para o Master Gallery)
export interface LookWithMeta extends GeneratedImage {
  collection?: {
    name: string;
  };
}

interface GalleryGridProps {
  looks: LookWithMeta[];
}

export function GalleryGrid({ looks }: GalleryGridProps) {
  const [selectedLook, setSelectedLook] = useState<LookWithMeta | null>(null);

  if (looks.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center border-2 border-dashed border-[var(--color-light-gray)] rounded-2xl bg-[var(--color-cream)]/30 dark:bg-[#151413]">
        <div className="mb-6 opacity-50">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <rect x="12" y="12" width="40" height="40" rx="4" stroke="var(--color-warm-gray)" strokeWidth="2" strokeDasharray="4 4" />
            <circle cx="32" cy="32" r="8" stroke="var(--color-warm-gray)" strokeWidth="2" />
            <path d="M12 40L24 28L40 44" stroke="var(--color-warm-gray)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="font-display text-xl mb-2 text-[var(--color-charcoal)] dark:text-[var(--color-cream)]">
          Sua galeria está vazia
        </h3>
        <p className="text-sm text-[var(--color-warm-gray)] max-w-sm mb-6">
          Vá para a seção "Gerar" para criar seus primeiros lookbooks editoriais e exibi-los aqui.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
        {looks.map((look) => (
          <LookCard 
            key={look.id} 
            look={look} 
            onClick={() => setSelectedLook(look)} 
            showCollectionBadge={!!look.collection?.name}
            collectionName={look.collection?.name}
          />
        ))}
      </div>

      <LookLightbox 
        look={selectedLook} 
        onClose={() => setSelectedLook(null)} 
      />
    </>
  );
}
