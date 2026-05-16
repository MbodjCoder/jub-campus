// Document PDF du portfolio étudiant (@react-pdf/renderer).
// Runtime Node uniquement (importé par la route /api/portfolio/pdf).

import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";

export interface DonneesPortfolioPdf {
  prenom: string;
  nom: string;
  universite: string;
  niveau: string;
  scoreJub: number;
  note: string;
  competences: { nom: string; niveau: number; valide: boolean }[];
  jobs: { titre: string; organisation: string; score: number }[];
  emisLe: Date;
}

const ORANGE = "#ffaa00";
const SAGE = "#5f6c57";
const SAGE_900 = "#1f2820";
const PIERRE = "#78716c";
const FOND = "#f5f4f1";
const BORDURE = "#e3e0db";

const s = StyleSheet.create({
  page: { padding: 40, fontSize: 10, color: SAGE_900, fontFamily: "Helvetica" },
  enTete: { borderBottomWidth: 2, borderBottomColor: SAGE_900, paddingBottom: 16, marginBottom: 20 },
  marque: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  pastille: { width: 14, height: 14, borderRadius: 7, backgroundColor: ORANGE, marginRight: 6 },
  marqueTexte: { fontSize: 13, fontFamily: "Helvetica-Bold", color: ORANGE },
  nom: { fontSize: 24, fontFamily: "Helvetica-Bold", letterSpacing: -0.5 },
  sousNom: { fontSize: 11, color: PIERRE, marginTop: 3 },
  stats: { flexDirection: "row", gap: 10, marginBottom: 22 },
  stat: { flex: 1, backgroundColor: FOND, borderWidth: 1, borderColor: BORDURE, borderRadius: 8, padding: 12, alignItems: "center" },
  statVal: { fontSize: 20, fontFamily: "Helvetica-Bold", color: SAGE_900 },
  statLib: { fontSize: 8, color: PIERRE, marginTop: 3, textTransform: "uppercase", letterSpacing: 0.5 },
  section: { marginBottom: 18 },
  titre: { fontSize: 9, fontFamily: "Helvetica-Bold", color: SAGE, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 },
  ligne: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: BORDURE },
  jobTitre: { fontSize: 10, fontFamily: "Helvetica-Bold" },
  jobOrg: { fontSize: 8, color: PIERRE, marginTop: 2 },
  jobScore: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#996600" },
  comps: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  comp: { backgroundColor: FOND, borderWidth: 1, borderColor: BORDURE, borderRadius: 999, paddingVertical: 3, paddingHorizontal: 8, fontSize: 8 },
  compValide: { borderColor: ORANGE, color: "#996600" },
  pied: { position: "absolute", bottom: 30, left: 40, right: 40, fontSize: 7, color: PIERRE, textAlign: "center", borderTopWidth: 1, borderTopColor: BORDURE, paddingTop: 8 },
});

export function DocumentPortfolio({ d }: { d: DonneesPortfolioPdf }) {
  return (
    <Document
      title={`Portfolio JUB — ${d.prenom} ${d.nom}`}
      author="JUB Campus"
    >
      <Page size="A4" style={s.page}>
        <View style={s.enTete}>
          <View style={s.marque}>
            <View style={s.pastille} />
            <Text style={s.marqueTexte}>JUB Campus</Text>
          </View>
          <Text style={s.nom}>
            {d.prenom} {d.nom}
          </Text>
          <Text style={s.sousNom}>
            {d.universite} · {d.niveau}
          </Text>
        </View>

        <View style={s.stats}>
          <View style={s.stat}>
            <Text style={s.statVal}>{d.jobs.length}</Text>
            <Text style={s.statLib}>Jobs livrés</Text>
          </View>
          <View style={s.stat}>
            <Text style={s.statVal}>{d.note}</Text>
            <Text style={s.statLib}>Note moyenne</Text>
          </View>
          <View style={s.stat}>
            <Text style={s.statVal}>{d.scoreJub}</Text>
            <Text style={s.statLib}>Score JUB</Text>
          </View>
        </View>

        <View style={s.section}>
          <Text style={s.titre}>Compétences</Text>
          {d.competences.length > 0 ? (
            <View style={s.comps}>
              {d.competences.map((c) => (
                <Text key={c.nom} style={[s.comp, ...(c.valide ? [s.compValide] : [])]}>
                  {c.nom} · {c.niveau}/5{c.valide ? " ✓" : ""}
                </Text>
              ))}
            </View>
          ) : (
            <Text style={{ fontSize: 9, color: PIERRE }}>Aucune compétence renseignée.</Text>
          )}
        </View>

        <View style={s.section}>
          <Text style={s.titre}>Jobs réalisés &amp; certifiés</Text>
          {d.jobs.length > 0 ? (
            d.jobs.map((j, i) => (
              <View key={i} style={s.ligne}>
                <View>
                  <Text style={s.jobTitre}>{j.titre}</Text>
                  <Text style={s.jobOrg}>{j.organisation}</Text>
                </View>
                <Text style={s.jobScore}>{j.score.toFixed(1).replace(".", ",")}/5</Text>
              </View>
            ))
          ) : (
            <Text style={{ fontSize: 9, color: PIERRE }}>Aucun job certifié pour l&apos;instant.</Text>
          )}
        </View>

        <Text style={s.pied}>
          Portfolio généré par JUB Campus le{" "}
          {d.emisLe.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
          {" "}· jubcampus.sn
        </Text>
      </Page>
    </Document>
  );
}
