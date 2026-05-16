// Document PDF du certificat JUB Campus.
// Rendu via @react-pdf/renderer (runtime Node).

import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";

interface ProprietesDocument {
  numeroPublic: string;
  hashIntegrite: string;
  etudiantPrenom: string;
  etudiantNom: string;
  universiteNom: string;
  niveau: string;
  projetTitre: string;
  organisationNom: string | null;
  roleJoue: string;
  periodeDebut: Date;
  periodeFin: Date;
  dureeJours: number;
  scoreFinal: number;
  competencesValidees: string[];
  appreciation: string;
  mentorNom: string;
  emisLe: Date;
  qrDataUrl: string;
  urlVerification: string;
}

const COULEURS = {
  fond: "#f5f4f1",
  encre: "#1f2820",     // sage-900
  sage: "#5f6c57",      // sage-500
  sageClair: "#ced4d2", // sage-100
  orange: "#ffaa00",    // orange-500
  gris: "#78716c",      // pierre-500
} as const;

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: COULEURS.fond,
    padding: 36,
    fontFamily: "Helvetica",
  },
  cadre: {
    flexGrow: 1,
    border: `2pt solid ${COULEURS.sage}`,
    padding: 28,
    position: "relative",
  },
  ruban: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: COULEURS.orange,
  },
  enTete: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  logo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoCercle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COULEURS.orange,
    alignItems: "center",
    justifyContent: "center",
  },
  logoPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COULEURS.sage,
  },
  logoTexte: {
    fontFamily: "Helvetica-Bold",
    fontSize: 18,
    color: COULEURS.orange,
  },
  logoCampus: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    color: COULEURS.sage,
  },
  numero: {
    fontSize: 9,
    color: COULEURS.gris,
    fontFamily: "Courier",
  },
  titrePrincipal: {
    fontFamily: "Helvetica-Bold",
    fontSize: 32,
    color: COULEURS.sage,
    textAlign: "center",
    marginTop: 12,
    letterSpacing: 2,
  },
  sousTitre: {
    fontSize: 10,
    color: COULEURS.gris,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 4,
    marginBottom: 24,
  },
  attribution: {
    fontSize: 10,
    color: COULEURS.gris,
    textAlign: "center",
    marginTop: 14,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  nomEtudiant: {
    fontFamily: "Helvetica-Bold",
    fontSize: 36,
    color: COULEURS.encre,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 4,
  },
  metaEtudiant: {
    fontSize: 11,
    color: COULEURS.sage,
    textAlign: "center",
    marginBottom: 22,
    fontStyle: "italic",
  },
  intro: {
    fontSize: 11,
    color: COULEURS.encre,
    textAlign: "center",
    marginBottom: 6,
  },
  nomProjet: {
    fontFamily: "Helvetica-Bold",
    fontSize: 14,
    color: COULEURS.encre,
    textAlign: "center",
    marginBottom: 4,
  },
  organisationLigne: {
    fontSize: 10,
    color: COULEURS.gris,
    textAlign: "center",
    marginBottom: 18,
  },
  grilleStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 14,
    paddingVertical: 12,
    borderTop: `1pt solid ${COULEURS.sageClair}`,
    borderBottom: `1pt solid ${COULEURS.sageClair}`,
  },
  stat: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 7,
    color: COULEURS.gris,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  statValeur: {
    fontFamily: "Helvetica-Bold",
    fontSize: 14,
    color: COULEURS.encre,
  },
  scoreOrange: {
    fontFamily: "Helvetica-Bold",
    fontSize: 14,
    color: COULEURS.orange,
  },
  competencesTitre: {
    fontSize: 8,
    color: COULEURS.gris,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 6,
  },
  competencesLigne: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 6,
  },
  competencePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: COULEURS.sage,
    borderRadius: 10,
    fontSize: 9,
    color: COULEURS.orange,
    fontFamily: "Helvetica-Bold",
  },
  appreciation: {
    fontSize: 10,
    color: COULEURS.encre,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 18,
    marginHorizontal: 20,
    lineHeight: 1.4,
  },
  pied: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: "auto",
    paddingTop: 14,
    borderTop: `1pt solid ${COULEURS.sageClair}`,
  },
  signature: {
    flex: 1,
  },
  signatureLabel: {
    fontSize: 8,
    color: COULEURS.gris,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  signatureNom: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    color: COULEURS.encre,
  },
  qrZone: {
    alignItems: "center",
  },
  qrImage: {
    width: 70,
    height: 70,
  },
  qrLegende: {
    fontSize: 7,
    color: COULEURS.gris,
    marginTop: 4,
    textAlign: "center",
    maxWidth: 110,
  },
  hash: {
    marginTop: 8,
    fontSize: 6,
    color: COULEURS.gris,
    fontFamily: "Courier",
    textAlign: "center",
  },
});

function formaterDate(d: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  }).format(d);
}

export function DocumentCertificat(p: ProprietesDocument) {
  return (
    <Document
      title={`Certificat ${p.numeroPublic}`}
      author="JUB Campus"
      subject={`Certificat de réussite — ${p.etudiantPrenom} ${p.etudiantNom}`}
    >
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.cadre}>
          <View style={styles.ruban} />

          <View style={styles.enTete}>
            <View style={styles.logo}>
              <View style={styles.logoCercle}>
                <View style={styles.logoPoint} />
              </View>
              <Text style={styles.logoTexte}>JUB</Text>
              <Text style={styles.logoCampus}>Campus</Text>
            </View>
            <Text style={styles.numero}>{p.numeroPublic}</Text>
          </View>

          <Text style={styles.titrePrincipal}>CERTIFICAT</Text>
          <Text style={styles.sousTitre}>De Réussite</Text>

          <Text style={styles.attribution}>Décerné à</Text>
          <Text style={styles.nomEtudiant}>{p.etudiantPrenom} {p.etudiantNom}</Text>
          <Text style={styles.metaEtudiant}>{p.niveau} · {p.universiteNom}</Text>

          <Text style={styles.intro}>pour sa contribution au projet</Text>
          <Text style={styles.nomProjet}>« {p.projetTitre} »</Text>
          {p.organisationNom ? (
            <Text style={styles.organisationLigne}>
              avec {p.organisationNom} · en tant que {p.roleJoue}
            </Text>
          ) : (
            <Text style={styles.organisationLigne}>en tant que {p.roleJoue}</Text>
          )}

          <View style={styles.grilleStats}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Période</Text>
              <Text style={styles.statValeur}>
                {formaterDate(p.periodeDebut)} → {formaterDate(p.periodeFin)}
              </Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Durée</Text>
              <Text style={styles.statValeur}>{p.dureeJours} jours</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Score final</Text>
              <Text style={styles.scoreOrange}>{p.scoreFinal.toFixed(1)} / 10</Text>
            </View>
          </View>

          {p.competencesValidees.length > 0 ? (
            <>
              <Text style={styles.competencesTitre}>Compétences validées</Text>
              <View style={styles.competencesLigne}>
                {p.competencesValidees.slice(0, 8).map((c) => (
                  <Text key={c} style={styles.competencePill}>{c}</Text>
                ))}
              </View>
            </>
          ) : null}

          {p.appreciation ? (
            <Text style={styles.appreciation}>« {p.appreciation} »</Text>
          ) : null}

          <View style={styles.pied}>
            <View style={styles.signature}>
              <Text style={styles.signatureLabel}>Mentor</Text>
              <Text style={styles.signatureNom}>{p.mentorNom}</Text>
              <Text style={[styles.signatureLabel, { marginTop: 8 }]}>Émis le</Text>
              <Text style={styles.signatureNom}>{formaterDate(p.emisLe)}</Text>
            </View>
            <View style={styles.qrZone}>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image src={p.qrDataUrl} style={styles.qrImage} />
              <Text style={styles.qrLegende}>Vérifier l&apos;authenticité</Text>
              <Text style={styles.qrLegende}>{p.urlVerification}</Text>
            </View>
          </View>

          <Text style={styles.hash}>
            Empreinte d&apos;intégrité SHA-256 : {p.hashIntegrite}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
