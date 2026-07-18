// Stub du paquet "server-only" pour les tests d'intégration vitest.
// Dans Next, ce paquet empêche l'import côté client ; sous vitest il
// lèverait à tort — on le remplace par un module vide.
export {};
