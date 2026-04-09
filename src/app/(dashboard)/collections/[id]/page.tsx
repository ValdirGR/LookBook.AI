import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AddGarmentButton } from "@/components/collections/add-garment-button";
import { GarmentUploader } from "@/components/collections/garment-uploader";
import { GalleryGrid } from "@/components/gallery/gallery-grid";

export default async function CollectionDetailsPage({ 
  params,
  searchParams 
}: { 
  params: { id: string };
  searchParams?: { tab?: string };
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const collection = await prisma.collection.findUnique({
    where: { id: params.id },
    include: {
      brand: { include: { members: true } },
      garments: {
        include: {
          generatedImages: { orderBy: { createdAt: "desc" } }
        }
      }
    }
  });

  if (!collection) {
    notFound();
  }

  // Authorize User
  const dbUser = await prisma.user.findUnique({ where: { authId: user.id } });
  if (!dbUser || !collection.brand.members.some(m => m.userId === dbUser.id)) {
    redirect("/collections"); // Unauthorized
  }

  const activeTab = searchParams?.tab || 'pieces';

  return (
    <div className="collection-details">
      <div className="mb-8">
        <Link 
          href="/collections" 
          className="inline-flex items-center gap-2 text-sm text-[var(--color-warm-gray)] hover:text-[var(--color-charcoal)] dark:hover:text-[var(--color-cream)] mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Voltar para Coleções
        </Link>
        
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-display text-3xl text-[var(--color-charcoal)] dark:text-[var(--color-cream)]">
                {collection.name}
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-md bg-[var(--color-light-gray)] text-[var(--color-warm-gray-dark)]">
                {collection.status}
              </span>
            </div>
            
            {(collection.season || collection.description) && (
              <div className="mt-2 text-[var(--color-warm-gray)] max-w-2xl">
                {collection.season && <p className="text-sm font-medium mb-1">Temporada: {collection.season}</p>}
                {collection.description && <p className="text-sm mt-2">{collection.description}</p>}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <AddGarmentButton collectionId={collection.id} />
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-[var(--color-light-gray)] mb-8 flex gap-8">
        <Link 
          href={`/collections/${collection.id}?tab=pieces`}
          className={`pb-3 border-b-2 font-medium text-sm transition-colors ${activeTab === 'pieces' ? 'border-[var(--color-rose-gold)] text-[var(--color-charcoal)] dark:text-[var(--color-cream)]' : 'border-transparent text-[var(--color-warm-gray)] hover:text-[var(--color-charcoal)] dark:hover:text-[var(--color-cream)]'}`}
        >
          Peças ({collection.garments.length})
        </Link>
        <Link 
          href={`/collections/${collection.id}?tab=looks`}
          className={`pb-3 border-b-2 font-medium text-sm transition-colors ${activeTab === 'looks' ? 'border-[var(--color-rose-gold)] text-[var(--color-charcoal)] dark:text-[var(--color-cream)]' : 'border-transparent text-[var(--color-warm-gray)] hover:text-[var(--color-charcoal)] dark:hover:text-[var(--color-cream)]'}`}
        >
          Lookbooks Gerados ({collection.garments.flatMap(g => g.generatedImages).length})
        </Link>
        <button className="pb-3 border-b-2 border-transparent text-[var(--color-warm-gray)] hover:text-[var(--color-charcoal)] dark:hover:text-[var(--color-cream)] font-medium text-sm transition-colors cursor-not-allowed opacity-50">
          Configurações
        </button>
      </div>
      
      {/* Tab Content */}
      {activeTab === 'pieces' && (
        <>
          {collection.garments.length === 0 ? (
            <div className="py-12 bg-[var(--color-cream)] dark:bg-[#151413] border-2 border-dashed border-[var(--color-light-gray)] rounded-2xl">
              <div className="max-w-md mx-auto">
                 <GarmentUploader collectionId={collection.id} />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {collection.garments.map((garment) => (
                <div key={garment.id} className="group relative rounded-xl border border-[var(--color-light-gray)] bg-white dark:bg-[#1a1918] overflow-hidden aspect-[3/4]">
                  <img 
                    src={garment.referenceImage} 
                    alt={garment.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                    <p className="text-white text-sm font-medium truncate drop-shadow-md">
                      {garment.name}
                    </p>
                    <div className="text-[10px] text-white/80 font-semibold tracking-wider uppercase mt-0.5">
                      {garment.detectedType}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'looks' && (
        <div className="mt-4">
          <GalleryGrid looks={collection.garments.flatMap(g => g.generatedImages) as any} />
        </div>
      )}
    </div>
  );
}
