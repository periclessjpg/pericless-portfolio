// Compte les pages vues depuis l'arrivée sur le site (navigation interne).
// Sert au bouton "Back" : s'il y a une page précédente sur le site,
// on y retourne ; sinon on va vers une page par défaut.

let pagesVisited = 0;
let lastPath: string | null = null;

export function recordPageVisit(path: string) {
  // On ignore les doubles appels pour la même page (mode développement de React).
  if (path === lastPath) return;
  lastPath = path;
  pagesVisited += 1;
}

export function hasPreviousPageOnSite() {
  return pagesVisited > 1;
}
