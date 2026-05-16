// Médias JUB Campus — photos d'illustration stables (Unsplash, libres).
// Une image par grande famille de catégorie + repli générique.
// Évite les requêtes aléatoires : URLs fixes → cache navigateur efficace.

const U = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const PHOTOS = {
  hero: U("1522202176988-66273c2fd55f", 2000),
  campus: U("1523240795612-9a054b0db644", 2000),
  travail: U("1531058020387-3be344556be6", 1600),
} as const;

// Photo par catégorie projet (clé = enum CategorieProjet).
const PAR_CATEGORIE: Record<string, string> = {
  WEB: U("1551434678-e076c223a692"),
  INFORMATIQUE: U("1518770660439-4636190af475"),
  MOBILE: U("1512941937669-90a1b58e7e9c"),
  DATA: U("1551288049-bebda4e38f71"),
  IA: U("1677442136019-21780ecad995"),
  UI_UX: U("1561070791-2526d30994b8"),
  MARKETING: U("1611162617474-5b21e879e113"),
  COMMUNICATION: U("1557804506-669a67965ba0"),
  GESTION: U("1454165804606-c3d57bc86b40"),
  FINANCE: U("1611974789855-9c2a0a7236a3"),
  COMPTABILITE: U("1554224155-6726b3ff858f"),
  DROIT: U("1589829545856-d10d557cf95f"),
  AGRICULTURE: U("1625246333195-78d9c38ad449"),
  SANTE: U("1505751172876-fa1923c5c528"),
  EDUCATION: U("1503676260728-1c00da094a0b"),
  ENVIRONNEMENT: U("1497435334941-8c899ee9e8e9"),
  ANNOTATION_DONNEES: U("1620712943543-bcc4688e7485e"),
  ENQUETE_TERRAIN: U("1523240795612-9a054b0db644"),
  RECHERCHE: U("1532094349884-543bc11b234d"),
};

const DEFAUT = U("1531403009284-440f080d1e12");

/** Image d'illustration d'un projet : couverture explicite sinon photo de catégorie. */
export function imageProjet(p: { imageCouvertureUrl?: string | null; categorie?: string | null }): string {
  if (p.imageCouvertureUrl) return p.imageCouvertureUrl;
  if (p.categorie && PAR_CATEGORIE[p.categorie]) return PAR_CATEGORIE[p.categorie];
  return DEFAUT;
}
