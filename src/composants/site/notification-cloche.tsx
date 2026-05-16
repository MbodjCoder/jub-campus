"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { Bell, Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { formaterDate } from "@/lib/utils";
import {
  marquerNotificationLue,
  marquerToutesNotificationsLues,
} from "@/app/app/notifications/actions";

interface Notif {
  id: string;
  type: string;
  titre: string;
  contenu: string;
  lien: string | null;
  lue: boolean;
  creeLe: Date | string;
}

interface Proprietes {
  notifications: Notif[];
  nbNonLues: number;
  surFondSombre?: boolean;
}

export function NotificationCloche({ notifications, nbNonLues, surFondSombre = false }: Proprietes) {
  const [ouvert, setOuvert] = useState(false);
  const [enCours, demarrer] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function clicExterne(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOuvert(false);
    }
    function echap(e: KeyboardEvent) { if (e.key === "Escape") setOuvert(false); }
    document.addEventListener("mousedown", clicExterne);
    document.addEventListener("keydown", echap);
    return () => {
      document.removeEventListener("mousedown", clicExterne);
      document.removeEventListener("keydown", echap);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={`Notifications${nbNonLues > 0 ? ` (${nbNonLues} non lues)` : ""}`}
        onClick={() => setOuvert((v) => !v)}
        className={cn(
          "relative flex h-9 w-9 items-center justify-center rounded-full transition-colors",
          surFondSombre
            ? "text-jub-sage-100 hover:bg-jub-sage-700/80"
            : "text-jub-sage-700 hover:bg-jub-orange-50 hover:text-jub-orange-700",
        )}
      >
        <Bell className="h-4 w-4" />
        {nbNonLues > 0 ? (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-jub-orange-500 px-1 text-[9px] font-bold text-jub-sage-950 ring-2 ring-fond-eleve">
            {nbNonLues > 99 ? "99+" : nbNonLues}
          </span>
        ) : null}
      </button>

      {ouvert ? (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-80 origin-top-right overflow-hidden rounded-2xl border border-bordure bg-fond-eleve shadow-2xl ring-1 ring-jub-sage-900/5 animate-in fade-in zoom-in-95"
        >
          <div className="flex items-center justify-between border-b border-bordure px-4 py-3">
            <p className="text-sm font-bold">Notifications</p>
            {nbNonLues > 0 ? (
              <button
                type="button"
                disabled={enCours}
                onClick={() => demarrer(() => marquerToutesNotificationsLues())}
                className="inline-flex items-center gap-1 text-xs text-jub-orange-600 hover:underline disabled:opacity-50"
              >
                <CheckCheck className="h-3.5 w-3.5" /> Tout marquer lu
              </button>
            ) : null}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-texte-discret">
                Aucune notification.
              </p>
            ) : (
              <ul className="divide-y divide-bordure">
                {notifications.map((n) => (
                  <NotificationLigne key={n.id} notif={n} />
                ))}
              </ul>
            )}
          </div>

          <div className="border-t border-bordure bg-jub-pierre-50 p-2 text-center">
            <Link
              href="/app/notifications"
              onClick={() => setOuvert(false)}
              className="block rounded-md px-3 py-1.5 text-xs font-medium text-jub-sage-700 hover:bg-jub-orange-50 hover:text-jub-orange-700"
            >
              Voir toutes les notifications →
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function NotificationLigne({ notif }: { notif: Notif }) {
  const [enCours, demarrer] = useTransition();
  const date = typeof notif.creeLe === "string" ? new Date(notif.creeLe) : notif.creeLe;

  function marquer() {
    if (notif.lue) return;
    demarrer(() => marquerNotificationLue(notif.id));
  }

  const corps = (
    <div className={cn("flex items-start gap-3 px-4 py-3 transition-colors", !notif.lue && "bg-jub-orange-50/40")}>
      {!notif.lue ? (
        <span className="mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full bg-jub-orange-500" />
      ) : (
        <span className="mt-1.5 inline-block h-2 w-2 shrink-0" />
      )}
      <div className="min-w-0 flex-1">
        <p className={cn("text-sm leading-snug", !notif.lue && "font-semibold")}>{notif.titre}</p>
        <p className="mt-0.5 line-clamp-2 text-xs text-texte-discret">{notif.contenu}</p>
        <p className="mt-1 text-[10px] uppercase tracking-wider text-texte-discret">{formaterDate(date)}</p>
      </div>
      {!notif.lue ? (
        <button
          type="button"
          disabled={enCours}
          onClick={(e) => { e.preventDefault(); marquer(); }}
          className="shrink-0 rounded p-1 text-texte-discret hover:bg-jub-pierre-200 hover:text-jub-orange-700"
          aria-label="Marquer comme lu"
        >
          <Check className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </div>
  );

  if (notif.lien) {
    return (
      <li>
        <Link href={notif.lien} onClick={marquer} className="block hover:bg-jub-pierre-100/60">
          {corps}
        </Link>
      </li>
    );
  }
  return <li className="cursor-default">{corps}</li>;
}
