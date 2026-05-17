import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { EnregistreurSW } from "@/composants/site/enregistreur-sw";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// Police d'affichage — titres « display » en italique serif.
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "JUB Campus — L'expérience pro qui change tout",
    template: "%s · JUB Campus",
  },
  description:
    "JUB Campus : la plateforme sénégalaise de stages par projets, de certification et d'insertion professionnelle pour les étudiants. Lancement à l'UGB de Saint-Louis.",
  keywords: [
    "stage", "stages Sénégal", "UGB", "projet étudiant", "certification",
    "portfolio étudiant", "insertion professionnelle", "Saint-Louis",
  ],
  authors: [{ name: "JUB Campus" }],
  openGraph: {
    title: "JUB Campus",
    description: "Prouve tes compétences. Trouve ta place.",
    locale: "fr_SN",
    type: "website",
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "JUB", statusBarStyle: "default" },
  icons: { icon: "/icone.svg", apple: "/icone.svg" },
};

export const viewport: Viewport = {
  themeColor: "#1f2820",
  width: "device-width",
  initialScale: 1,
};

export default function RacineMise({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-fond text-texte">
        {children}
        <EnregistreurSW />
      </body>
    </html>
  );
}
