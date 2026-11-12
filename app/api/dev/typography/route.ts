// MODE ÉDITION LOCAL : enregistre la typographie (content/typography.json) et copie les
// fichiers des polices choisies dans public/fonts/ pour que les visiteurs les voient.
// Sur le site publié (production), cette adresse répond toujours 404.
//
// Protections : développement uniquement, requêtes locales uniquement ; les polices ne
// sont lues que dans les dossiers de polices du système (identifiant vérifié, pas de "..",
// pas de lien symbolique) ; une police dont le fichier interdit l'intégration (licence)
// est refusée ; 15 Mo maximum ; copie sans jamais écraser un fichier ; toutes les valeurs
// sont nettoyées. Aucun fichier n'est modifié ni supprimé dans les dossiers du système.

import { checkLocalRequest, errorResponse, isDevelopment, notFoundResponse } from "../../../lib/dev-guard";

const MAX_FONT_SIZE = 15 * 1024 * 1024;

type RoleRequest = {
  /** "" = garder la police actuelle ; "default" = Geist ; sinon identifiant d'une police installée. */
  fontId?: unknown;
  weight?: unknown;
  scale?: unknown;
  tracking?: unknown;
  uppercase?: unknown;
};

export async function POST(request: Request) {
  // 1. Uniquement en développement.
  if (!isDevelopment()) return notFoundResponse();

  const fs = await import("node:fs");
  const path = await import("node:path");
  const { ROLES, safeFamily, sanitizeTypography } = await import("../../../lib/typography");
  const { TYPOGRAPHY_FILE, getTypography } = await import("../../../lib/typography-server");
  const { listSystemFonts, resolveSystemFont } = await import("../../../lib/system-fonts");
  const { slugify } = await import("../../../lib/artwork-names");

  // 2. Requête locale uniquement.
  const forbidden = checkLocalRequest(request);
  if (forbidden) return errorResponse(forbidden, 403);

  let body: { roles?: Record<string, RoleRequest> };
  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid request");
  }
  if (!body.roles || typeof body.roles !== "object") return errorResponse("Invalid request");

  const current = getTypography();
  const next: Record<string, Record<string, unknown>> = {};
  const fontsDir = path.join(process.cwd(), "public", "fonts");

  for (const { name } of ROLES) {
    const asked = body.roles[name] ?? {};
    const role: Record<string, unknown> = { ...current[name] };
    role.weight = asked.weight;
    role.scale = asked.scale;
    role.tracking = asked.tracking;
    role.uppercase = asked.uppercase;

    const fontId = typeof asked.fontId === "string" ? asked.fontId : "";
    if (fontId === "default") {
      role.family = "";
      role.file = "";
    } else if (fontId) {
      // 3. Police installée : vérifiée, puis copiée dans public/fonts/.
      const source = resolveSystemFont(fontId);
      const info = listSystemFonts().find((font) => font.id === fontId);
      if (!source || !info) return errorResponse(`Font not found (${name})`);
      if (info.restricted) {
        return errorResponse(
          `"${info.family} ${info.style}" does not allow web embedding (license). Please choose another font.`,
        );
      }
      if (info.size > MAX_FONT_SIZE) return errorResponse(`"${info.family}" is larger than 15 MB`);

      if (fs.existsSync(fontsDir) && fs.lstatSync(fontsDir).isSymbolicLink()) return errorResponse("Invalid fonts folder");
      fs.mkdirSync(fontsDir, { recursive: true });

      // Nom du fichier copié : famille-graisse-style.ext (ex. "inter-700-bold.ttf").
      const base = `${slugify(info.family) || "font"}-${info.weight}-${slugify(info.style) || "regular"}`;
      const content = fs.readFileSync(source.path);
      let fileName = `${base}${source.extension}`;
      for (let n = 2; ; n++) {
        const target = path.join(fontsDir, fileName);
        if (!fs.existsSync(target)) {
          fs.writeFileSync(target, content, { flag: "wx" });
          break;
        }
        // Même fichier déjà copié : on le réutilise.
        if (fs.readFileSync(target).equals(content)) break;
        fileName = `${base}-${n}${source.extension}`;
      }

      role.family = safeFamily(info.family);
      role.file = `/fonts/${fileName}`;
      role.weight = info.weight; // graisse du fichier choisi
    }
    next[name] = role;
  }

  const typography = sanitizeTypography(next);

  // Dossier content/ à la racine du projet (créé si besoin, jamais un lien symbolique).
  const dir = path.dirname(TYPOGRAPHY_FILE);
  if (fs.existsSync(dir) && fs.lstatSync(dir).isSymbolicLink()) return errorResponse("Invalid folder");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(TYPOGRAPHY_FILE, `${JSON.stringify(typography, null, 2)}\n`);

  return Response.json({ typography });
}

/** Toute autre méthode (ex. simple visite de l'adresse) : 404, en développement comme en production. */
export function GET() {
  return notFoundResponse();
}
export const PUT = GET;
export const PATCH = GET;
export const DELETE = GET;
