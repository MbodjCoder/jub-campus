import { EnTeteSite } from "@/composants/site/en-tete";
import { PiedSite } from "@/composants/site/pied";

export default function MisePublique({ children }: { children: React.ReactNode }) {
  return (
    <>
      <EnTeteSite />
      <main className="flex-1 pt-16">{children}</main>
      <PiedSite />
    </>
  );
}
