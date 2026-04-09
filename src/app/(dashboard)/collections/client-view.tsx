"use client";

import { useState } from "react";
import { FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CollectionDialog } from "@/components/collections/collection-dialog";
import { CollectionCard } from "@/components/collections/collection-card";
import type { Collection } from "@prisma/client";

export function CollectionsClientView({ collections }: { collections: Collection[] }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl text-[var(--color-charcoal)] dark:text-[var(--color-cream)]">
            Suas Coleções
          </h1>
          <p className="text-sm text-[var(--color-warm-gray)] mt-1">
            Organize suas peças em coleções e gere lookbooks editoriais.
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} variant="primary" size="md" className="hidden sm:flex">
          <FolderPlus size={16} />
          Nova Coleção
        </Button>
      </div>

      {collections.length === 0 ? (
        <div className="flex flex-col items-center text-center py-20 px-8 border-2 border-dashed border-[var(--color-light-gray)] rounded-2xl mt-8">
          <div className="mb-6">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <rect x="8" y="12" width="48" height="40" rx="4" stroke="var(--color-light-gray)" strokeWidth="2" strokeDasharray="4 4"/>
              <path d="M24 36l6-8 6 8" stroke="var(--color-rose-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="40" cy="24" r="4" stroke="var(--color-blush)" strokeWidth="2"/>
            </svg>
          </div>
          <h3 className="font-display text-xl mb-2 text-[var(--color-charcoal)] dark:text-[var(--color-cream)]">
            Nenhuma coleção ainda
          </h3>
          <p className="w-full max-w-md text-sm text-[var(--color-warm-gray)] leading-relaxed mb-8 text-balance">
            Crie sua primeira coleção para começar a organizar suas peças e gerar lookbooks editoriais incríveis.
          </p>
          <Button onClick={() => setIsDialogOpen(true)} variant="primary" size="lg">
            <FolderPlus size={18} />
            Criar Coleção
          </Button>
        </div>
      ) : (
        <>
          <div className="sm:hidden mb-6">
             <Button onClick={() => setIsDialogOpen(true)} variant="primary" size="md" className="w-full">
              <FolderPlus size={16} />
              Nova Coleção
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {collections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        </>
      )}

      <CollectionDialog 
        open={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
      />
    </>
  );
}
