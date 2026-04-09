"use client";

import { useState, useRef, useTransition } from "react";
import { UploadCloud, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { createGarment } from "@/actions/garments";

interface GarmentUploaderProps {
  collectionId: string;
  onSuccess?: () => void;
}

export function GarmentUploader({ collectionId, onSuccess }: GarmentUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    // Validation
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError("Formato inválido. Use JPG, PNG ou WEBP.");
      return;
    }
    
    // 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      setError("O arquivo deve ter no máximo 10MB.");
      return;
    }
    
    setError(null);
    setIsUploading(true);
    setProgress(10); // Fake initial progress

    try {
      const supabase = createClient();

      // Ensure unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${collectionId}/${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

      // Upload to Supabase Storage Bucket: 'garments'
      const { data, error: uploadError } = await supabase.storage
        .from('garments')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      setProgress(60);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('garments')
        .getPublicUrl(fileName);

      setProgress(80);

      // Create Garment in DB via Server Action
      startTransition(async () => {
        const result = await createGarment(
          {}, 
          {
            collectionId,
            name: file.name.replace(`.${fileExt}`, ''),
            referenceImage: publicUrl,
          }
        );

        if (result.error) {
          setError(result.error);
          setIsUploading(false);
        } else {
          setProgress(100);
          setTimeout(() => {
            setIsUploading(false);
            setProgress(0);
            if (onSuccess) onSuccess();
          }, 500);
        }
      });

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ocorreu um erro no upload.");
      setIsUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="w-full">
      <div 
        className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all duration-200 
          ${isDragOver ? "border-[var(--color-rose-gold)] bg-[var(--color-rose-gold)]/5 scale-[1.02]" : "border-[var(--color-light-gray)] hover:border-[var(--color-rose-gold-light)] bg-transparent"}
          ${isUploading ? "pointer-events-none opacity-80" : "cursor-pointer"}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/jpeg, image/png, image/webp" 
          className="hidden" 
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center justify-center py-4">
            <Loader2 size={32} className="text-[var(--color-rose-gold)] animate-spin mb-4" />
            <p className="text-sm font-medium text-[var(--color-charcoal)] dark:text-[var(--color-cream)] mb-2">
              Processando imagem...
            </p>
            <div className="w-48 h-1.5 bg-[var(--color-light-gray)] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[var(--color-rose-gold)] transition-all duration-300 ease-out" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors
              ${isDragOver ? "bg-[var(--color-rose-gold)] text-white" : "bg-[var(--color-cream)] dark:bg-[#1a1918] text-[var(--color-warm-gray)]"}
            `}>
              <UploadCloud size={24} />
            </div>
            <h4 className="font-display text-lg text-[var(--color-charcoal)] dark:text-[var(--color-cream)] mb-1">
              Arraste sua peça para cá
            </h4>
            <p className="text-xs text-[var(--color-warm-gray)] mb-4">
              ou clique para selecionar do seu computador (JPG, PNG, WEBP)
            </p>
            <div className="text-[10px] font-semibold tracking-wider uppercase px-2 py-1 bg-[var(--color-light-gray)]/50 rounded-md text-[var(--color-warm-gray-dark)]">
              Max 10MB
            </div>
          </>
        )}
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 p-3 text-sm rounded-lg bg-[var(--color-error-light)] text-[var(--color-error)]">
          <XCircle size={16} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
