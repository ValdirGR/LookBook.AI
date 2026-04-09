"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import Link from "next/link";
import { MoreVertical, Edit2, Trash2, Image as ImageIcon, FolderOpen } from "lucide-react";
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
    <div className={cn("group flex flex-col rounded-xl bg-[#151413] border border-[#1C1B1A] transition-all duration-300 hover:border-[#2E2D2A]", isPending && "opacity-50 pointer-events-none")}>
      
      {/* Cover Image Area */}
      <Link href={`/collections/${collection.id}`} className="relative aspect-[4/3] bg-[#0A0A0A] overflow-hidden block rounded-t-xl border-b border-[#1C1B1A]">
        {collection.coverImageUrl ? (
          <img 
            src={collection.coverImageUrl} 
            alt={collection.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-[#2E2D2A] transition-transform duration-700 group-hover:scale-105 bg-[#151413]">
            <FolderOpen strokeWidth={1.5} size={36} className="opacity-40" />
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-[#1E1D1B] text-[#9B9590] border border-[#2E2D2A]">
            {collection.status === 'ACTIVE' ? 'Ativa' : collection.status === 'DRAFT' ? 'Draft' : 'Arquivada'}
          </span>
        </div>
      </Link>

      {/* Content Area */}
      <div className="p-4">
        <Link href={`/collections/${collection.id}`} className="block w-full">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-semibold text-white truncate">
              {collection.name}
            </h3>
            
            {/* Menu Actions (integrated properly for the dark mode) */}
            <div className="relative shrink-0" ref={menuRef}>
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMenuOpen(!menuOpen); }}
                className="p-1 rounded-md text-[#6B6561] hover:text-white transition-colors h-6 w-6 flex items-center justify-center"
              >
                <MoreVertical size={16} />
              </button>
              
              {menuOpen && (
                <div className="absolute right-0 top-full mt-1 w-40 py-1 bg-[#1A1918] border border-[#2E2D2A] rounded-lg shadow-xl z-30">
                  <button 
                    className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 text-[#E8E4DF] hover:bg-[#2A2928] transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      setMenuOpen(false);
                    }}
                  >
                    <Edit2 size={14} /> Editar
                  </button>
                  <button 
                    className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 text-[#EF4444] hover:bg-[#2A2928] transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete();
                    }}
                  >
                    <Trash2 size={14} /> Excluir
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-[#6B6561] mt-1.5 font-medium">
            <span>{collection.season || 'Sem temporada'}</span>
            <span>•</span>
            <span>0 peças</span>
            <span>•</span>
            <span>0 fotos</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
