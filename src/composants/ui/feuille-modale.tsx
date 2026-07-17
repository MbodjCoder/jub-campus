import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/composants/maquette/icones";

// Feuille modale — bottom-sheet plein écran sur mobile, boîte centrée
// à partir de 700px. Remplace les modales ad hoc à <style> inline.
export function FeuilleModale({
  onClose,
  surTitre,
  titre,
  children,
  className,
}: {
  onClose: () => void;
  /** Petite ligne discrète au-dessus du titre (ex. organisation). */
  surTitre?: string;
  titre?: string;
  children: ReactNode;
  /** Largeur max de la boîte (ex. "max-w-[560px]"). */
  className?: string;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center min-[700px]:items-center min-[700px]:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={titre}
    >
      <div className="absolute inset-0 bg-sage-950/50" onClick={onClose} />
      <div
        className={cn(
          "relative max-h-[92vh] w-full max-w-[560px] overflow-auto rounded-t-2xl bg-white p-6 min-[700px]:rounded-2xl",
          className,
        )}
      >
        {titre || surTitre ? (
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              {surTitre ? <div className="t-xs t-discret">{surTitre}</div> : null}
              {titre ? (
                <h2 className="mb-0 mt-1 text-xl font-semibold tracking-[-0.01em]">{titre}</h2>
              ) : null}
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-sage-50"
              aria-label="Fermer"
            >
              <Icon.X size={16} />
            </button>
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}
