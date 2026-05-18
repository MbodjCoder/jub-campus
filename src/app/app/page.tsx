// Tableau de bord étudiant — port 1:1 de la maquette (PageTableauDeBord).

import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PHOTOS, imageProjet } from "@/lib/medias";
import { maintenantMs } from "@/lib/utils";
import { fmt } from "@/composants/maquette/format";
import { Bouton } from "@/composants/maquette/primitifs";
import { Icon } from "@/composants/maquette/icones";

export const metadata = { title: "Tableau de bord" };
export const dynamic = "force-dynamic";

const STATUTS_ACTIFS = ["EQUIPE_EN_CONSTITUTION", "EN_COURS", "EN_REVISION"];

export default async function PageTableauDeBord() {
  const session = await auth();
  if (!session?.user?.id) redirect("/connexion");

  const etudiant = await prisma.etudiant.findUnique({
    where: { utilisateurId: session.user.id },
    select: {
      id: true,
      prenom: true,
      candidatures: { where: { statut: "EN_ATTENTE" }, select: { id: true } },
      membreEquipes: {
        select: {
          equipe: {
            select: {
              projet: {
                select: {
                  id: true, slug: true, titre: true, statut: true, dureeJours: true,
                  dateDebut: true, imageCouvertureUrl: true, categorie: true,
                  entreprise: { select: { raisonSociale: true } },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!etudiant) {
    return (
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px" }}>
        <div className="carte" style={{ padding: 32, textAlign: "center" }}>Profil étudiant introuvable.</div>
      </main>
    );
  }

  const projetsActifs = etudiant.membreEquipes
    .map((m) => m.equipe.projet)
    .filter((p) => STATUTS_ACTIFS.includes(p.statut));
  const jobEnCours = projetsActifs[0] ?? null;

  const taches = jobEnCours
    ? await prisma.tache.findMany({
        where: { projetId: jobEnCours.id, assigneeId: etudiant.id, statut: { not: "TERMINEE" } },
        orderBy: { echeance: "asc" },
        take: 3,
        select: { id: true, titre: true, echeance: true },
      })
    : [];

  const recommandes = await prisma.projet.findMany({
    where: {
      statut: { in: ["PUBLIE", "CANDIDATURES_OUVERTES", "EQUIPE_EN_CONSTITUTION"] },
      visibilite: "PUBLIQUE",
    },
    orderBy: { publieLe: "desc" },
    take: 4,
    select: {
      slug: true, titre: true, categorie: true, imageCouvertureUrl: true,
      entreprise: { select: { raisonSociale: true } },
    },
  });

  const jourActuel =
    jobEnCours && jobEnCours.dateDebut
      ? Math.min(
          jobEnCours.dureeJours,
          Math.max(0, Math.floor((maintenantMs() - new Date(jobEnCours.dateDebut).getTime()) / 86_400_000)),
        )
      : 0;
  const nbActions = etudiant.candidatures.length;

  return (
    <main className="fadein" style={{ padding: "8px 20px 32px", maxWidth: 1100, margin: "0 auto" }}>
      {/* Salutation */}
      <section
        style={{
          marginTop: 8,
          marginBottom: 28,
          position: "relative",
          padding: "20px 24px",
          borderRadius: 18,
          overflow: "hidden",
          background: "linear-gradient(135deg, var(--sage-900), var(--sage-800))",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.18,
            backgroundImage: `url(${PHOTOS.travail})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 90% 10%, color-mix(in oklab, var(--orange-500) 35%, transparent), transparent 55%)",
          }}
        />
        <div
          style={{
            position: "relative",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "clamp(1.5rem, 3.5vw, 2rem)",
                fontWeight: 600,
                letterSpacing: "-0.025em",
                color: "white",
                margin: 0,
                lineHeight: 1.15,
              }}
            >
              Bonjour,{" "}
              <span className="t-display" style={{ color: "var(--orange-400)", fontSize: "1.05em" }}>
                {etudiant.prenom}.
              </span>
            </h1>
            <p className="t-small" style={{ color: "var(--sage-100)", marginTop: 10, marginBottom: 0 }}>
              {nbActions > 0
                ? `Tu as ${nbActions} action${nbActions > 1 ? "s" : ""} en attente.`
                : "Prêt à trouver ton prochain job ?"}
            </p>
          </div>
          <Bouton
            as={Link}
            href="/projets"
            variant="accent"
            taille="md"
            iconRight={<Icon.Arrow size={14} />}
            style={{ marginLeft: "auto" }}
          >
            Voir les jobs
          </Bouton>
        </div>
      </section>

      <div style={{ display: "grid", gap: 20, gridTemplateColumns: "minmax(0, 1fr)" }} className="tdb-grid">
        {/* Job en cours */}
        <div>
          <h2
            style={{
              marginTop: 0,
              marginBottom: 12,
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 17,
              fontWeight: 600,
              letterSpacing: "-0.015em",
              color: "var(--sage-900)",
            }}
          >
            <Icon.Kanban size={19} style={{ color: "var(--sage-700)", flexShrink: 0 }} />
            Job en cours
            <span style={{ color: "var(--texte-discret)", fontWeight: 400 }}>· {projetsActifs.length}</span>
          </h2>
          {jobEnCours ? (
            <div
              style={{
                background: "var(--fond-eleve)",
                border: "1px solid var(--bordure)",
                borderRadius: 14,
                padding: 20,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "40%",
                  height: "100%",
                  backgroundImage: `url(${imageProjet(jobEnCours)})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  opacity: 0.12,
                  maskImage: "linear-gradient(to right, transparent, black)",
                  WebkitMaskImage: "linear-gradient(to right, transparent, black)",
                }}
              />
              <div style={{ position: "relative" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="t-xs t-discret">{jobEnCours.entreprise?.raisonSociale ?? "JUB Campus"}</div>
                    <h3 style={{ fontSize: 17, fontWeight: 600, margin: "4px 0 0", letterSpacing: "-0.01em" }}>
                      {jobEnCours.titre}
                    </h3>
                  </div>
                  <span className="pilule pilule--orange">En cours</span>
                </div>

                <div style={{ marginTop: 16 }}>
                  <div style={{ height: 4, borderRadius: 999, background: "white", overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${(jourActuel / jobEnCours.dureeJours) * 100}%`,
                        height: "100%",
                        background: "var(--orange-500)",
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                    <span className="t-xs t-discret">Jour {jourActuel}</span>
                    <span className="t-xs t-discret">{Math.max(0, jobEnCours.dureeJours - jourActuel)}j restants</span>
                  </div>
                </div>

                <div style={{ marginTop: 22 }}>
                  <div className="t-eyebrow" style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                    <Icon.Check size={12} style={{ color: "var(--sage-500)" }} />À faire · {taches.length}
                  </div>
                  {taches.length > 0 ? (
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 2 }}>
                      {taches.map((t) => (
                        <li
                          key={t.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "10px 0",
                            borderBottom: "1px solid var(--bordure)",
                          }}
                        >
                          <span
                            style={{ width: 14, height: 14, borderRadius: 3, border: "1.5px solid var(--sage-400)", flexShrink: 0 }}
                          />
                          <span style={{ flex: 1, fontSize: 14 }}>{t.titre}</span>
                          {t.echeance ? <span className="t-xs t-discret">{fmt.dateCourt(t.echeance)}</span> : null}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="t-small" style={{ margin: 0 }}>Aucune tâche en attente.</p>
                  )}
                </div>

                <Bouton
                  as={Link}
                  href={`/app/projet/${jobEnCours.id}`}
                  variant="primaire"
                  iconRight={<Icon.Arrow size={14} />}
                  style={{ marginTop: 16, width: "100%" }}
                >
                  Ouvrir
                </Bouton>
              </div>
            </div>
          ) : (
            <div
              style={{
                background: "var(--fond-eleve)",
                border: "1px solid var(--bordure)",
                borderRadius: 14,
                padding: 32,
                textAlign: "center",
              }}
            >
              <p className="t-small" style={{ margin: "0 0 14px" }}>
                Aucun job en cours. Postule à ton premier job&nbsp;!
              </p>
              <Bouton as={Link} href="/projets" variant="accent">
                Découvrir les jobs
              </Bouton>
            </div>
          )}
        </div>

        {/* Pour toi */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <h2
              style={{
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 17,
                fontWeight: 600,
                letterSpacing: "-0.015em",
                color: "var(--sage-900)",
              }}
            >
              <Icon.Sparkles size={19} style={{ color: "var(--sage-700)", flexShrink: 0 }} />
              Pour toi
            </h2>
            <Link
              href="/projets"
              className="t-xs"
              style={{ background: "transparent", border: 0, color: "var(--orange-600)", fontWeight: 600, cursor: "pointer" }}
            >
              Tout voir
            </Link>
          </div>
          <div
            style={{
              display: "grid",
              gap: 1,
              background: "var(--bordure)",
              border: "1px solid var(--bordure)",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            {recommandes.map((pp) => (
              <Link
                key={pp.slug}
                href={`/projets/${pp.slug}`}
                style={{
                  background: "var(--fond-eleve)",
                  border: 0,
                  padding: "12px 14px",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    flexShrink: 0,
                    backgroundImage: `url(${imageProjet(pp)})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {pp.titre}
                  </div>
                  <div className="t-xs t-discret">{pp.entreprise?.raisonSociale ?? "JUB Campus"}</div>
                </div>
                <Icon.ChevronRight size={14} style={{ color: "var(--sage-400)" }} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .tdb-grid { grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) !important; gap: 24px !important; }
        }
      `}</style>
    </main>
  );
}
