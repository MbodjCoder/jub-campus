// Chargé par vitest AVANT l'import des fichiers de test : les variables
// de .env.local (DATABASE_URL, AUTH_SECRET…) sont disponibles quand
// src/lib/env.ts valide l'environnement à l'import.
import { config } from "dotenv";

config({ path: ".env.local" });
