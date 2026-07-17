// Pied de page public — migré maquette → classes ; hover CSS, plus de
// "use client" (aucun état ni gestionnaire).

import Link from "next/link";
import { Logo } from "@/composants/ui/logo";
import { Icon } from "@/composants/maquette/icones";

const LIENS = [
  { l: "À propos", href: "/a-propos" },
  { l: "Comment ça marche", href: "/comment-ca-marche" },
  { l: "Entreprises", href: "/entreprises" },
  { l: "Vérifier un certificat", href: "/verifier" },
  { l: "Contact", href: "/contact" },
];

const SOCIALS = [
  { l: "WhatsApp", icon: <Icon.Whatsapp size={15} />, href: "https://wa.me/221XXXXXXXXX", classe: "text-[#25D366]" },
  { l: "Facebook", icon: <Icon.Facebook size={15} />, href: "https://facebook.com/jubcampus", classe: "text-[#1877F2]" },
  { l: "Instagram", icon: <Icon.Instagram size={15} />, href: "https://instagram.com/jubcampus", classe: "text-[#E4405F]" },
  { l: "TikTok", icon: <Icon.Tiktok size={15} />, href: "https://tiktok.com/@jubcampus", classe: "text-[#010101]" },
  { l: "LinkedIn", icon: <Icon.Linkedin size={15} />, href: "https://linkedin.com/company/jubcampus", classe: "text-[#0A66C2]" },
  { l: "Email", icon: <Icon.Mail size={15} />, href: "mailto:contact@jubcampus.sn", classe: "text-sage-500" },
];

export function PiedSite() {
  return (
    <footer className="mt-16 border-t border-bordure px-5 pb-7 pt-10">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-5">
        {/* Bloc identité */}
        <div className="flex items-center gap-2.5">
          <Logo mot />
          <span className="t-xs t-discret">·</span>
          <span className="t-xs t-discret">Sénégal</span>
        </div>

        {/* Liens texte */}
        <div className="flex flex-wrap gap-[18px]">
          {LIENS.map((item) => (
            <Link key={item.href} href={item.href} className="t-xs cursor-pointer font-medium text-sage-700">
              {item.l}
            </Link>
          ))}
        </div>

        {/* Icônes sociales */}
        <div className="flex gap-1">
          {SOCIALS.map((s) => (
            <a
              key={s.l}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.l}
              title={s.l}
              className={`inline-flex h-[30px] w-[30px] items-center justify-center rounded-full transition-colors duration-100 hover:bg-fond-eleve ${s.classe}`}
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-[1180px] border-t border-bordure pt-4 text-center">
        <span className="t-xs t-discret">© 2026 JUB</span>
      </div>
    </footer>
  );
}
