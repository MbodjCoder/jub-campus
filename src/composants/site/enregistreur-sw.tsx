"use client";

// Enregistre le service worker (PWA) une fois la page chargée.

import { useEffect } from "react";

export function EnregistreurSW() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const enregistrer = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // échec silencieux : l'app fonctionne sans PWA
      });
    };
    if (document.readyState === "complete") enregistrer();
    else window.addEventListener("load", enregistrer, { once: true });
  }, []);

  return null;
}
