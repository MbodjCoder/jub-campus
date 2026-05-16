import Link from "next/link";
import { Bouton } from "@/composants/ui/bouton";

export function NavApp() {
  return (
    <div className="flex items-center gap-3">
      <Link href="/app/notifications" className="text-sm text-texte-discret hover:text-texte">Notifications</Link>
      <Link href="/connexion">
        <Bouton apparence="contour" taille="sm">Se déconnecter</Bouton>
      </Link>
    </div>
  );
}
