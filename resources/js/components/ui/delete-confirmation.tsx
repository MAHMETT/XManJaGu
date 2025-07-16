import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useLockBodyScroll } from "@/hooks/use-lock-body-scroll";

interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  className?: string;
  csrfToken: string;
  action?: string
}

export function DeleteConfirmation({
  isOpen,
  onClose,
  title = "Konfirmasi Penghapusan",
  message = "Apakah Anda yakin ingin menghapus data ini?",
  className,
  action,
  csrfToken = '',
}: DeleteConfirmationProps) {
  useLockBodyScroll(isOpen);
  if (!isOpen) return null;

  return (
    <form method="POST" action={action} className="inline">
    <input type="hidden" name="_method" value="DELETE" />
{csrfToken && <input type="hidden" name="_token" value={csrfToken} />}
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-opacity",
          "animate-in fade-in duration-300"
        )}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2",
          "transform animate-in zoom-in-95 duration-300",
          className
        )}
      >
        <div className="rounded-xl border bg-card p-6 shadow-lg">
          <div className="flex flex-col space-y-4">
            <div className="mx-auto rounded-full bg-destructive/10 p-3">
              <TrashIcon className="h-8 w-8 text-destructive" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-muted-foreground">{message}</p>
            </div>

            <div className="flex justify-center gap-3 pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                className="px-6 hover:bg-muted"
              >
                Batal
              </Button>
              <Button
                variant="destructive"
                type="submit"
                className="px-6 shadow-sm shadow-destructive/20 hover:bg-destructive/90"
              >
                Hapus
              </Button>
            </div>
          </div>
        </div>
      </div>
                                            </form>
  )
}
