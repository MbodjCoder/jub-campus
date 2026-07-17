// État de chargement global — affiché pendant les transitions de route.

export default function Chargement() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <span className="inline-block h-7 w-7 animate-spin rounded-full border-[3px] border-bordure-forte border-t-orange-500" />
    </div>
  );
}
