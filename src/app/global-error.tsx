"use client";

// Frontière d'erreur racine — capture les erreurs du layout racine lui-même.
// Doit fournir ses propres <html>/<body>.

export default function ErreurGlobale({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#ececea",
          color: "#1c1917",
        }}
      >
        <div style={{ textAlign: "center", padding: 24, maxWidth: 380 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600 }}>Service momentanément indisponible</h1>
          <p style={{ fontSize: 14, color: "#78716c" }}>
            Une erreur critique est survenue. Réessaie dans un instant.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: 16,
              background: "#ffaa00",
              color: "#141a13",
              border: 0,
              borderRadius: 999,
              padding: "10px 22px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  );
}
