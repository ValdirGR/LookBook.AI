"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      <div className="flex flex-col items-center text-center py-24 px-8 border-2 border-dashed border-[var(--color-light-gray)] rounded-2xl mt-8 bg-[var(--color-cream)]/30 dark:bg-[#151413]/50">
        <div className="mb-6 opacity-80">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
             <rect x="8" y="12" width="48" height="40" rx="4" stroke="var(--color-light-gray)" strokeWidth="2" strokeDasharray="4 4"/>
             <path d="M24 36l6-8 6 8" stroke="var(--color-rose-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
             <circle cx="40" cy="24" r="4" stroke="var(--color-blush)" strokeWidth="2"/>
          </svg>
        </div>
        <h3 className="font-display text-xl mb-2 text-[var(--color-charcoal)] dark:text-[var(--color-cream)] tracking-tight">
          Nenhum lookbook na galeria
        </h3>
        <p className="w-full max-w-md text-sm text-[var(--color-warm-gray)] leading-relaxed mb-8 text-balance">
          Sua galeria está vazia. Vá para a seção de geração para criar seus primeiros lookbooks editoriais com Inteligência Artificial.
        </p>
        <Link href="/generate" className="inline-flex">
          <Button variant="primary" size="lg">
            <Sparkles size={18} />
            Gerar Lookbook
          </Button>
        </Link>
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
