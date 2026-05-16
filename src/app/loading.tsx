// État de chargement global — affiché pendant les transitions de route.

export default function Chargement() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          width: 28,
          height: 28,
          borderRadius: 999,
          border: "3px solid var(--bordure-forte)",
          borderTopColor: "var(--orange-500)",
          display: "inline-block",
          animation: "spin 700ms linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
