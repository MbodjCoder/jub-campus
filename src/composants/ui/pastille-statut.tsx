import { Insigne, type ProprietesInsigne } from "@/composants/ui/insigne";
import {
  LIBELLES_STATUT_PROJET,
  LIBELLES_MODE_REMUNERATION,
} from "@/lib/constantes";

// PastilleStatut — mapping 1:1 enums Prisma → couleur + libellé.
// Règle : UNE couleur par statut, identique partout dans l'app.
// Toute page qui affiche un statut passe par ici, jamais par une pilule ad hoc.

type Ton = NonNullable<ProprietesInsigne["ton"]>;

const TON_STATUT_PROJET: Record<keyof typeof LIBELLES_STATUT_PROJET, Ton> = {
  BROUILLON: "neutre",
  EN_VALIDATION: "jaune",
  PUBLIE: "vert",
  CANDIDATURES_OUVERTES: "vert",
  EQUIPE_EN_CONSTITUTION: "jaune",
  EN_COURS: "sage",
  EN_REVISION: "jaune",
  TERMINE: "sage",
  CERTIFIE: "vert",
  ANNULE: "rouge",
  ARCHIVE: "neutre",
};

const LIBELLES_STATUT_CANDIDATURE = {
  EN_ATTENTE: "En attente",
  ACCEPTEE: "Acceptée",
  REFUSEE: "Refusée",
  RETIREE: "Retirée",
} as const;

const TON_STATUT_CANDIDATURE: Record<keyof typeof LIBELLES_STATUT_CANDIDATURE, Ton> = {
  EN_ATTENTE: "jaune",
  ACCEPTEE: "vert",
  REFUSEE: "rouge",
  RETIREE: "neutre",
};

const LIBELLES_STATUT_LIVRABLE = {
  EN_REVUE: "En revue",
  VALIDE: "Validé",
  A_CORRIGER: "À corriger",
  REJETE: "Rejeté",
} as const;

const TON_STATUT_LIVRABLE: Record<keyof typeof LIBELLES_STATUT_LIVRABLE, Ton> = {
  EN_REVUE: "jaune",
  VALIDE: "vert",
  A_CORRIGER: "orange",
  REJETE: "rouge",
};

const LIBELLES_STATUT_TACHE = {
  A_FAIRE: "À faire",
  EN_COURS: "En cours",
  EN_REVUE: "En revue",
  TERMINEE: "Terminée",
} as const;

const TON_STATUT_TACHE: Record<keyof typeof LIBELLES_STATUT_TACHE, Ton> = {
  A_FAIRE: "neutre",
  EN_COURS: "sage",
  EN_REVUE: "jaune",
  TERMINEE: "vert",
};

const LIBELLES_STATUT_CERTIFICAT = {
  VALIDE: "Valide",
  REVOQUE: "Révoqué",
  EXPIRE: "Expiré",
  EN_VERIFICATION: "En vérification",
} as const;

const TON_STATUT_CERTIFICAT: Record<keyof typeof LIBELLES_STATUT_CERTIFICAT, Ton> = {
  VALIDE: "vert",
  REVOQUE: "rouge",
  EXPIRE: "neutre",
  EN_VERIFICATION: "jaune",
};

const TON_MODE_REMUNERATION: Record<keyof typeof LIBELLES_MODE_REMUNERATION, Ton> = {
  APPRENTISSAGE: "neutre",
  PRIME: "orange",
  REMUNERE: "sage",
  SPONSORISE: "jaune",
};

const REGISTRES = {
  projet: { libelles: LIBELLES_STATUT_PROJET, tons: TON_STATUT_PROJET },
  candidature: { libelles: LIBELLES_STATUT_CANDIDATURE, tons: TON_STATUT_CANDIDATURE },
  livrable: { libelles: LIBELLES_STATUT_LIVRABLE, tons: TON_STATUT_LIVRABLE },
  tache: { libelles: LIBELLES_STATUT_TACHE, tons: TON_STATUT_TACHE },
  certificat: { libelles: LIBELLES_STATUT_CERTIFICAT, tons: TON_STATUT_CERTIFICAT },
  remuneration: { libelles: LIBELLES_MODE_REMUNERATION, tons: TON_MODE_REMUNERATION },
} as const;

type Domaine = keyof typeof REGISTRES;

export function PastilleStatut({
  domaine,
  statut,
  className,
}: {
  domaine: Domaine;
  statut: string;
  className?: string;
}) {
  const registre = REGISTRES[domaine];
  const libelles = registre.libelles as Record<string, string>;
  const tons = registre.tons as Record<string, Ton>;
  return (
    <Insigne ton={tons[statut] ?? "neutre"} className={className}>
      {libelles[statut] ?? statut}
    </Insigne>
  );
}
