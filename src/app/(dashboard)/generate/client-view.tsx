"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Image as ImageIcon, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateLookbook } from "@/actions/generate";
import type { Collection, Garment } from "@prisma/client";

interface CollectionWithGarments extends Collection {
  garments: Garment[];
}

export function GenerationStudioClient({ 
  collections, 
  credits 
}: { 
  collections: CollectionWithGarments[];
  credits: number;
}) {
  const router = useRouter();
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>(collections[0]?.id || "");
  const [selectedGarmentId, setSelectedGarmentId] = useState<string>("");
  const [prompt, setPrompt] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const selectedCollection = collections.find(c => c.id === selectedCollectionId);
  const selectedGarment = selectedCollection?.garments.find(g => g.id === selectedGarmentId);

  const handleGenerate = () => {
    if (!selectedGarmentId) {
      setError("Por favor, selecione uma peça de roupa.");
      return;
    }
    if (prompt.length < 5) {
      setError("O prompt precisa ser mais detalhado (mínimo 5 caracteres).");
      return;
    }
    
    setError(null);
    startTransition(async () => {
      const result = await generateLookbook({}, {
        garmentId: selectedGarmentId,
        prompt
      });

      if (result.error) {
        setError(result.error);
      } else {
        router.push("/gallery");
      }
    });
  };

  if (collections.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[var(--color-cream)] dark:bg-black">
        <ImageIcon size={48} className="text-[var(--color-light-gray)] mb-4" />
        <h2 className="font-display text-2xl text-[var(--color-charcoal)] dark:text-[var(--color-cream)] mb-2">
          Nenhuma peça encontrada
        </h2>
        <p className="text-[var(--color-warm-gray)] max-w-md mb-6">
          Para gerar lookbooks, você primeiro precisa criar uma coleção e fazer o upload de uma peça de roupa.
        </p>
        <Button onClick={() => router.push("/collections")} variant="primary">
          Ir para Coleções
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col lg:flex-row bg-[#FDFDFC] dark:bg-[#0A0A0A] overflow-hidden">
      
      {/* LEFT PANEL: Controls */}
      <div className="w-full lg:w-[40%] flex flex-col border-r border-[var(--color-light-gray)] bg-white dark:bg-[#151413] shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
        
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto">
          <div className="mb-8">
            <h1 className="font-display text-2xl text-[var(--color-charcoal)] dark:text-[var(--color-cream)] mb-1">
              Estúdio de Geração
            </h1>
            <p className="text-sm text-[var(--color-warm-gray)] flex items-center gap-2">
              <span className="inline-flex w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse"></span>
              {credits} Créditos disponíveis
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-[var(--color-error-light)] text-[var(--color-error)] text-sm font-medium border border-red-100 dark:border-red-900/30">
              {error}
            </div>
          )}

          {/* Step 1: Collection & Garment */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-rose-gold)] text-white text-xs font-bold">1</div>
              <h2 className="font-medium text-[var(--color-charcoal)] dark:text-[var(--color-cream)]">Coleção e Peça</h2>
            </div>
            
            <div className="space-y-4 ml-8">
              <select 
                value={selectedCollectionId}
                onChange={(e) => {
                  setSelectedCollectionId(e.target.value);
                  setSelectedGarmentId(""); // reset garment when collection changes
                }}
                className="w-full px-4 py-3 bg-[var(--color-cream)]/50 dark:bg-[#1a1918] border border-[var(--color-light-gray)] rounded-xl text-[var(--color-charcoal)] dark:text-[var(--color-cream)] text-sm focus:border-[var(--color-rose-gold)] focus:ring-1 focus:ring-[var(--color-rose-gold)] transition-all outline-none"
              >
                {collections.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              {/* Garment Scroller */}
              {selectedCollection?.garments.length === 0 ? (
                <div className="p-4 text-center text-sm text-[var(--color-warm-gray)] border border-dashed border-[var(--color-light-gray)] rounded-xl bg-[var(--color-cream)]/30 dark:bg-black/20">
                  Esta coleção não possui peças ainda.
                </div>
              ) : (
                <div className="flex gap-3 overflow-x-auto pb-4 pt-2 px-1 snap-x scrollbar-thin">
                  {selectedCollection?.garments.map(g => (
                    <button
                      key={g.id}
                      onClick={() => setSelectedGarmentId(g.id)}
                      className={`relative flex-shrink-0 w-20 h-28 rounded-xl overflow-hidden snap-start transition-all duration-200 border-2 ${selectedGarmentId === g.id ? "border-[var(--color-rose-gold)] ring-4 ring-[var(--color-rose-gold-light)] scale-105" : "border-transparent opacity-70 hover:opacity-100"}`}
                    >
                      <img src={g.referenceImage} alt={g.name} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Prompt */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-rose-gold)] text-white text-xs font-bold">2</div>
              <h2 className="font-medium text-[var(--color-charcoal)] dark:text-[var(--color-cream)]">Direção Criativa</h2>
            </div>
            
            <div className="ml-8">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Exibi-la em uma modelo asiática andando pelas ruas ensolaradas do Soho em NY..."
                rows={4}
                className="w-full p-4 bg-[var(--color-cream)]/50 dark:bg-[#1a1918] border border-[var(--color-light-gray)] rounded-2xl text-[var(--color-charcoal)] dark:text-[var(--color-cream)] text-sm focus:border-[var(--color-rose-gold)] focus:ring-1 focus:ring-[var(--color-rose-gold)] transition-all outline-none resize-none"
              />
            </div>
          </div>

        </div>

        {/* Generate Button Container */}
        <div className="p-6 border-t border-[var(--color-light-gray)] bg-white/50 dark:bg-[#151413]/80 backdrop-blur-md">
          <Button 
            variant="primary" 
            size="lg" 
            className="w-full text-base h-14"
            onClick={handleGenerate}
            disabled={!selectedGarmentId || isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Gerando Imagem Mágica...
              </>
            ) : (
              <>
                <Sparkles size={20} className="mr-2" />
                Gerar Lookbook
              </>
            )}
          </Button>
        </div>
      </div>

      {/* RIGHT PANEL: Preview / Output */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-[var(--color-cream)] dark:bg-[#0A0A0A] p-12 relative overflow-hidden">
        
        {/* Background Decorative Pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }} 
        />

        {isPending ? (
          <div className="relative animate-pulse flex flex-col items-center">
            <div className="w-[400px] h-[500px] border border-[var(--color-light-gray)]/50 bg-white/50 dark:bg-black/50 rounded-2xl shadow-xl flex items-center justify-center overflow-hidden backdrop-blur-sm">
               <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-rose-gold)]/5 via-transparent to-[var(--color-rose-gold)]/10" />
               <Loader2 className="animate-spin text-[var(--color-rose-gold)]/40" size={64} />
            </div>
            <p className="mt-8 text-[var(--color-warm-gray)] font-display text-xl tracking-wide animate-pulse">
              A IA está moldando a sua peça...
            </p>
          </div>
        ) : selectedGarmentId ? (
          <div className="relative animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* The base garment placeholder in a huge canvas */}
            <div className="w-[400px] h-[500px] border border-[var(--color-light-gray)] bg-white dark:bg-[#151413] rounded-2xl shadow-2xl p-4 flex flex-col items-center justify-center gap-6 relative group">
              <span className="absolute top-4 left-4 text-[10px] uppercase tracking-widest font-bold text-[var(--color-warm-gray-dark)]">Input Escaneado</span>
              <img src={selectedGarment?.referenceImage} className="max-w-[70%] max-h-[70%] object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-500" />
            </div>
          </div>
        ) : (
          <div className="text-center opacity-30">
            <ImageIcon size={64} className="mx-auto mb-4" />
            <p className="font-display text-2xl tracking-wide">Selecione uma peça</p>
          </div>
        )}
      </div>
    </div>
  );
}
