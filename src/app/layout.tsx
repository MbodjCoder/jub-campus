import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
};

export default function RacineMise({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-fond text-texte">
        {children}
      </body>
    </html>
  );
}
