import { cn } from "@/lib/utils";

export function Separateur({ className, orientation = "horizontal" }: { className?: string; orientation?: "horizontal" | "vertical" }) {
  return (
    <div
      role="separator"
      className={cn(
        orientation === "horizontal" ? "h-px w-full" : "w-px h-full",
        "bg-bordure",
        className,
      )}
    />
  );
}
