"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import Link from "next/link";
import { MoreVertical, Edit2, Trash2, Image as ImageIcon } from "lucide-react";
import { deleteCollection } from "@/actions/collections";
import { cn } from "@/lib/utils";
import type { Collection } from "@prisma/client";

interface CollectionCardProps {
  collection: Collection;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isPending, startTransition] = useTransition();

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = () => {
    if (confirm(`Tem certeza que deseja excluir a coleção "${collection.name}"?`)) {
      startTransition(async () => {
        const result = await deleteCollection(collection.id);
        if (result?.error) {
          alert(result.error);
        }
      });
    }
    setMenuOpen(false);
  };

  return (
    <div className={cn("group flex flex-col rounded-xl border border-[var(--color-light-gray)] bg-white dark:bg-[#151413] shadow-sm hover:shadow-md transition-all duration-300", isPending && "opacity-50 pointer-events-none")}>
      
      {/* Cover Image Area */}
      <Link href={`/collections/${collection.id}`} className="relative aspect-[4/3] bg-[var(--color-cream)] dark:bg-[#0A0A0A] overflow-hidden block rounded-t-xl">
        {collection.coverImageUrl ? (
          <img 
            src={collection.coverImageUrl} 
            alt={collection.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-[var(--color-warm-gray)] transition-transform duration-700 group-hover:scale-105">
            <ImageIcon strokeWidth={1} size={48} className="opacity-20 mb-2" />
            <span className="text-xs uppercase tracking-widest opacity-50">Sem capa</span>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-white/90 dark:bg-black/80 backdrop-blur text-[var(--color-charcoal)] dark:text-[var(--color-cream)] border border-black/5 dark:border-white/10">
            {collection.status === 'DRAFT' && <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>}
            {collection.status === 'ACTIVE' && <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]"></span>}
            {collection.status === 'ARCHIVED' && <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>}
            {collection.status}
          </span>
        </div>
      </Link>

      {/* Content Area */}
      <div className="p-4 flex items-start gap-3">
        <Link href={`/collections/${collection.id}`} className="flex-1 min-w-0">
          <h3 className="font-display text-sm font-semibold text-[var(--color-charcoal)] dark:text-[var(--color-cream)] truncate group-hover:text-[var(--color-rose-gold)] transition-colors">
            {collection.name}
          </h3>
          <p className="text-xs text-[var(--color-warm-gray)] mt-1 truncate">
            {collection.season || 'Sem temporada definida'}
          </p>
        </Link>
        
        {/* Menu Actions */}
        <div className="relative shrink-0" ref={menuRef}>
          <button 
            onClick={(e) => { e.preventDefault(); setMenuOpen(!menuOpen); }}
            className="p-1.5 rounded-md text-[var(--color-warm-gray)] hover:bg-[var(--color-light-gray)] hover:text-[var(--color-charcoal)] dark:hover:text-white transition-colors"
            aria-label="Opções"
          >
            <MoreVertical size={16} />
          </button>
          
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-40 py-1 bg-white dark:bg-[#1c1b1a] border border-[var(--color-light-gray)] rounded-lg shadow-xl z-30">
              <button 
                className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 text-[var(--color-charcoal)] dark:text-[var(--color-cream)] hover:bg-[var(--color-cream)] dark:hover:bg-[#2A2928] transition-colors"
                onClick={() => {
                  setMenuOpen(false);
                }}
              >
                <Edit2 size={14} /> Editar
              </button>
              <button 
                className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 text-[var(--color-error)] hover:bg-[var(--color-error-light)] transition-colors"
                onClick={handleDelete}
              >
                <Trash2 size={14} /> Excluir
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
