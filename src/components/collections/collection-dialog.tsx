"use client";

import { useActionState, useEffect, useState } from "react";
import { Dialog, DialogBody, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, FolderPlus } from "lucide-react";
import { createCollection } from "@/actions/collections";

interface CollectionDialogProps {
  open: boolean;
  onClose: () => void;
}

type CollectionState = { success?: boolean; error?: string };
const initialState: CollectionState = {};

export function CollectionDialog({ open, onClose }: CollectionDialogProps) {
  const [state, action, isPending] = useActionState(createCollection, initialState);
  const [name, setName] = useState("");
  const [season, setSeason] = useState("");
  const [description, setDescription] = useState("");

  // Only close if successful
  useEffect(() => {
    if (state.success) {
      onClose();
      // Reset form
      setName("");
      setSeason("");
      setDescription("");
    }
  }, [state.success, onClose]);

  return (
    <Dialog open={open} onClose={onClose} className="max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <FolderPlus size={20} className="text-[var(--color-rose-gold)]" />
          Nova Coleção
        </DialogTitle>
      </DialogHeader>

      <form action={action}>
        <DialogBody className="flex flex-col gap-4">
          {state.error && (
            <div className="flex items-center gap-2 p-3 text-sm rounded-lg bg-[var(--color-error-light)] text-[var(--color-error)]">
              <AlertCircle size={16} />
              <span>{state.error}</span>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Input
              label="Nome da Coleção"
              name="name"
              placeholder="Ex: Outono/Inverno 26"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Input
              label="Temporada (Opcional)"
              name="season"
              placeholder="Ex: FW26"
              value={season}
              onChange={(e) => setSeason(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5 mt-2">
            <label className="text-sm font-medium text-[var(--color-charcoal)] dark:text-[var(--color-cream)]">
              Descrição (Opcional)
            </label>
            <textarea
              name="description"
              rows={3}
              className="resize-none w-full px-4 py-2.5 bg-transparent border border-[var(--color-light-gray)] rounded-xl text-[var(--text-sm)] text-[var(--color-charcoal)] dark:text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-rose-gold)] focus:ring-1 focus:ring-[var(--color-rose-gold)] transition-colors"
              placeholder="Qual o mood ou direcionamento desta coleção?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </DialogBody>

        <DialogFooter className="flex justify-end gap-3 pt-6 border-t border-[var(--color-light-gray)]">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" loading={isPending}>
            Criar Coleção
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
