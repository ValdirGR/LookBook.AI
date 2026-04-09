"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GarmentUploader } from "./garment-uploader";

interface AddGarmentButtonProps {
  collectionId: string;
}

export function AddGarmentButton({ collectionId }: AddGarmentButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="primary" size="md" onClick={() => setOpen(true)}>
        <Plus size={16} />
        Nova Peça
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Fazer Upload</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <GarmentUploader 
            collectionId={collectionId} 
            onSuccess={() => setOpen(false)} 
          />
        </DialogBody>
      </Dialog>
    </>
  );
}
