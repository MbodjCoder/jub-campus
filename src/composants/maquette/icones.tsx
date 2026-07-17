/* JUB Campus · Icônes — port 1:1 de la maquette (components.jsx).
   Trait fin (strokeWidth 1.75), inspirées de lucide. */

import type { CSSProperties, ReactNode } from "react";

interface ProprietesIcone {
  size?: number;
  className?: string;
  style?: CSSProperties;
}

const IconBase = ({
  children, size = 18, className, style,
}: ProprietesIcone & { children: ReactNode }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    // eslint-disable-next-line react/forbid-dom-props -- passe-plat hérité (appelants legacy)
    style={style}
    aria-hidden="true"
  >
    {children}
  </svg>
);

export const Icon = {
  Arrow: (p: ProprietesIcone) => <IconBase {...p}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></IconBase>,
  ArrowLeft: (p: ProprietesIcone) => <IconBase {...p}><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></IconBase>,
  ArrowUpRight: (p: ProprietesIcone) => <IconBase {...p}><path d="M7 7h10v10" /><path d="M7 17 17 7" /></IconBase>,
  Search: (p: ProprietesIcone) => <IconBase {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></IconBase>,
  Filter: (p: ProprietesIcone) => <IconBase {...p}><path d="M3 5h18" /><path d="M6 11h12" /><path d="M10 17h4" /></IconBase>,
  Check: (p: ProprietesIcone) => <IconBase {...p}><path d="M20 6 9 17l-5-5" /></IconBase>,
  Plus: (p: ProprietesIcone) => <IconBase {...p}><path d="M12 5v14" /><path d="M5 12h14" /></IconBase>,
  X: (p: ProprietesIcone) => <IconBase {...p}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></IconBase>,
  Menu: (p: ProprietesIcone) => <IconBase {...p}><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" /></IconBase>,
  Bell: (p: ProprietesIcone) => <IconBase {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10 21a2 2 0 0 0 4 0" /></IconBase>,
  ShieldCheck: (p: ProprietesIcone) => <IconBase {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></IconBase>,
  Sparkles: (p: ProprietesIcone) => <IconBase {...p}><path d="M12 3v3" /><path d="M12 18v3" /><path d="M3 12h3" /><path d="M18 12h3" /><path d="m5.6 5.6 2.1 2.1" /><path d="m16.3 16.3 2.1 2.1" /><path d="m5.6 18.4 2.1-2.1" /><path d="m16.3 7.7 2.1-2.1" /></IconBase>,
  GraduationCap: (p: ProprietesIcone) => <IconBase {...p}><path d="M22 10 12 5 2 10l10 5 10-5Z" /><path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" /></IconBase>,
  Award: (p: ProprietesIcone) => <IconBase {...p}><circle cx="12" cy="9" r="6" /><path d="M9 14.5V22l3-2 3 2v-7.5" /></IconBase>,
  Wallet: (p: ProprietesIcone) => <IconBase {...p}><path d="M19 7H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z" /><path d="M16 14h.01" /><path d="M3 9V6a2 2 0 0 1 2-2h11l3 3" /></IconBase>,
  Handshake: (p: ProprietesIcone) => <IconBase {...p}><path d="m11 17 2 2a1 1 0 1 0 1.4-1.4" /><path d="m14 14 2.5 2.5a1 1 0 0 0 1.4-1.4L17 14" /><path d="m17 13 2.5 2.5a1 1 0 0 0 1.4-1.4L18 11" /><path d="M3 14h2l3-4 5 5" /><path d="M11 11s2-2 4-2 3 1 4 2" /></IconBase>,
  Calendar: (p: ProprietesIcone) => <IconBase {...p}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" /></IconBase>,
  Clock: (p: ProprietesIcone) => <IconBase {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></IconBase>,
  MapPin: (p: ProprietesIcone) => <IconBase {...p}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></IconBase>,
  Users: (p: ProprietesIcone) => <IconBase {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></IconBase>,
  Briefcase: (p: ProprietesIcone) => <IconBase {...p}><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></IconBase>,
  FileText: (p: ProprietesIcone) => <IconBase {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M8 13h8" /><path d="M8 17h6" /></IconBase>,
  Upload: (p: ProprietesIcone) => <IconBase {...p}><path d="M12 3v12" /><path d="m7 8 5-5 5 5" /><path d="M5 21h14" /></IconBase>,
  Download: (p: ProprietesIcone) => <IconBase {...p}><path d="M12 15V3" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></IconBase>,
  QrCode: (p: ProprietesIcone) => <IconBase {...p}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><path d="M14 14h3v3h-3z" /><path d="M21 14v3" /><path d="M14 21h7" /><path d="M17 17v4" /></IconBase>,
  Settings: (p: ProprietesIcone) => <IconBase {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1.07-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" /></IconBase>,
  Home: (p: ProprietesIcone) => <IconBase {...p}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></IconBase>,
  LogOut: (p: ProprietesIcone) => <IconBase {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /></IconBase>,
  Star: (p: ProprietesIcone) => <IconBase {...p}><path d="m12 2 3.1 6.5L22 9.7l-5 4.7L18.2 22 12 18.5 5.8 22 7 14.4l-5-4.7 6.9-1.2Z" /></IconBase>,
  TrendingUp: (p: ProprietesIcone) => <IconBase {...p}><path d="m22 7-8.5 8.5-5-5L2 17" /><path d="M16 7h6v6" /></IconBase>,
  Chat: (p: ProprietesIcone) => <IconBase {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></IconBase>,
  Kanban: (p: ProprietesIcone) => <IconBase {...p}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v12" /><path d="M15 3v8" /></IconBase>,
  Layers: (p: ProprietesIcone) => <IconBase {...p}><path d="m12 2 10 5-10 5L2 7z" /><path d="m2 12 10 5 10-5" /><path d="m2 17 10 5 10-5" /></IconBase>,
  Heart: (p: ProprietesIcone) => <IconBase {...p}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" /></IconBase>,
  Bookmark: (p: ProprietesIcone) => <IconBase {...p}><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></IconBase>,
  Globe: (p: ProprietesIcone) => <IconBase {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a14 14 0 0 1 0 18" /><path d="M12 3a14 14 0 0 0 0 18" /></IconBase>,
  ChevronRight: (p: ProprietesIcone) => <IconBase {...p}><path d="m9 6 6 6-6 6" /></IconBase>,
  ChevronDown: (p: ProprietesIcone) => <IconBase {...p}><path d="m6 9 6 6 6-6" /></IconBase>,
  Eye: (p: ProprietesIcone) => <IconBase {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" /><circle cx="12" cy="12" r="3" /></IconBase>,
  Link: (p: ProprietesIcone) => <IconBase {...p}><path d="M9 17H7a5 5 0 1 1 0-10h2" /><path d="M15 7h2a5 5 0 1 1 0 10h-2" /><path d="M8 12h8" /></IconBase>,
  Send: (p: ProprietesIcone) => <IconBase {...p}><path d="m22 2-7 20-4-9-9-4z" /><path d="M22 2 11 13" /></IconBase>,
  More: (p: ProprietesIcone) => <IconBase {...p}><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></IconBase>,
  Whatsapp: (p: ProprietesIcone) => <IconBase {...p}><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 3.42z" /><path d="M9 10c0 1.5 1.5 4 3 5.5 1.5 1.5 4 3 5.5 3 1 0 1.5-.5 2-1l-1.5-1.5a.6.6 0 0 0-.7-.1L16 17a8 8 0 0 1-3-2c-.9-.9-2-3-2-3l1.1-1.2a.6.6 0 0 0-.1-.7L10.5 8.5c-.5.5-1.5 1-1.5 1.5z" /></IconBase>,
  Facebook: (p: ProprietesIcone) => <IconBase {...p}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></IconBase>,
  Instagram: (p: ProprietesIcone) => <IconBase {...p}><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" /></IconBase>,
  Tiktok: (p: ProprietesIcone) => <IconBase {...p}><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></IconBase>,
  Linkedin: (p: ProprietesIcone) => <IconBase {...p}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-13h4v2a4 4 0 0 1 2-2" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></IconBase>,
  Mail: (p: ProprietesIcone) => <IconBase {...p}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 7L2 7" /></IconBase>,
  Share: (p: ProprietesIcone) => <IconBase {...p}><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><path d="m16 6-4-4-4 4" /><path d="M12 2v13" /></IconBase>,
  Copy: (p: ProprietesIcone) => <IconBase {...p}><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></IconBase>,
};
