// MODE ÉDITION LOCAL : liste des polices installées sur l'ordinateur (lecture seule).
//
// Utilisé uniquement par les routes /api/dev/fonts et /api/dev/typography, qui
// répondent 404 hors développement. Lit seulement les dossiers de polices du système
// (Windows : C:\Windows\Fonts et les polices installées pour ton compte) et
// seulement l'en-tête des fichiers .ttf / .otf / .woff / .woff2. Ne modifie rien.

import "server-only";

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { FONT_FORMATS } from "./typography";

export type SystemFont = {
  /** Identifiant : "<dossier>/<fichier>" (ex. "system/arialbd.ttf"). */
  id: string;
  family: string;
  style: string;
  weight: number;
  /** true si le fichier indique que sa licence interdit l'intégration (usage web non autorisé). */
  restricted: boolean;
  /** Taille du fichier, en octets. */
  size: number;
};

/** Dossiers de polices lus (lecture seule), selon le système. */
function fontDirectories(): Record<string, string> {
  if (process.platform === "win32") {
    const dirs: Record<string, string> = {
      system: path.join(process.env.WINDIR ?? "C:\\Windows", "Fonts"),
    };
    if (process.env.LOCALAPPDATA) dirs.user = path.join(process.env.LOCALAPPDATA, "Microsoft", "Windows", "Fonts");
    return dirs;
  }
  if (process.platform === "darwin") {
    return { system: "/Library/Fonts", user: path.join(os.homedir(), "Library", "Fonts") };
  }
  return { system: "/usr/share/fonts", user: path.join(os.homedir(), ".local", "share", "fonts") };
}

// ───────────── Lecture de l'en-tête d'un fichier de police (format OpenType) ─────────────

function readBytes(fd: number, offset: number, length: number) {
  const buffer = Buffer.alloc(length);
  const read = fs.readSync(fd, buffer, 0, length, offset);
  return buffer.subarray(0, read);
}

function decodeName(bytes: Buffer, platformId: number) {
  if (platformId === 3 || platformId === 0) {
    // UTF-16 gros-boutiste (Windows / Unicode)
    let text = "";
    for (let i = 0; i + 1 < bytes.length; i += 2) text += String.fromCharCode(bytes.readUInt16BE(i));
    return text;
  }
  return bytes.toString("latin1"); // Mac Roman (approximation suffisante pour un nom)
}

/** Lit nom de famille, style, graisse et indication de licence d'un fichier .ttf / .otf. */
function readFontInfo(file: string): Omit<SystemFont, "id" | "size"> | null {
  let fd: number | undefined;
  try {
    fd = fs.openSync(file, "r");
    const header = readBytes(fd, 0, 12);
    if (header.length < 12) return null;
    const version = header.readUInt32BE(0);
    // 0x00010000 = TrueType, "OTTO" = OpenType CFF, "true" = TrueType Mac.
    if (version !== 0x00010000 && version !== 0x4f54544f && version !== 0x74727565) return null;
    const numTables = header.readUInt16BE(4);
    if (numTables > 200) return null;

    const directory = readBytes(fd, 12, numTables * 16);
    const tables: Record<string, { offset: number; length: number }> = {};
    for (let i = 0; i < numTables; i++) {
      const tag = directory.toString("latin1", i * 16, i * 16 + 4);
      tables[tag] = { offset: directory.readUInt32BE(i * 16 + 8), length: directory.readUInt32BE(i * 16 + 12) };
    }

    // Table OS/2 : graisse (usWeightClass) et droits d'intégration (fsType).
    let weight = 400;
    let restricted = false;
    if (tables["OS/2"]) {
      const os2 = readBytes(fd, tables["OS/2"].offset, 10);
      if (os2.length >= 10) {
        weight = os2.readUInt16BE(4) || 400;
        const fsType = os2.readUInt16BE(8);
        restricted = (fsType & 0x000f) === 0x0002; // "Restricted License embedding"
      }
    }

    // Table name : nom de famille (16 sinon 1) et style (17 sinon 2).
    if (!tables.name || tables.name.length > 1024 * 1024) return null;
    const name = readBytes(fd, tables.name.offset, tables.name.length);
    const count = name.readUInt16BE(2);
    const stringOffset = name.readUInt16BE(4);
    const found: Record<number, { text: string; score: number }> = {};
    for (let i = 0; i < count; i++) {
      const record = 6 + i * 12;
      if (record + 12 > name.length) break;
      const platformId = name.readUInt16BE(record);
      const languageId = name.readUInt16BE(record + 4);
      const nameId = name.readUInt16BE(record + 6);
      const length = name.readUInt16BE(record + 8);
      const offset = name.readUInt16BE(record + 10);
      if (![1, 2, 16, 17].includes(nameId)) continue;
      // Préférence : Windows anglais, puis Windows, puis Unicode, puis Mac.
      const score = platformId === 3 ? (languageId === 0x409 ? 4 : 3) : platformId === 0 ? 2 : 1;
      if (found[nameId] && found[nameId].score >= score) continue;
      const start = stringOffset + offset;
      if (start + length > name.length) continue;
      found[nameId] = { text: decodeName(name.subarray(start, start + length), platformId).trim(), score };
    }
    const family = found[16]?.text || found[1]?.text;
    const style = found[17]?.text || found[2]?.text || "Regular";
    if (!family) return null;
    return { family, style, weight: Math.min(900, Math.max(100, Math.round(weight / 100) * 100)), restricted };
  } catch {
    return null;
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
  }
}

// ───────────── Liste (gardée en mémoire 5 minutes) ─────────────

let cache: { at: number; fonts: SystemFont[] } | null = null;

/** Polices installées, triées par famille puis graisse. */
export function listSystemFonts(): SystemFont[] {
  if (cache && Date.now() - cache.at < 5 * 60 * 1000) return cache.fonts;

  const fonts: SystemFont[] = [];
  for (const [key, dir] of Object.entries(fontDirectories())) {
    let names: string[] = [];
    try {
      names = fs.readdirSync(dir);
    } catch {
      continue;
    }
    for (const fileName of names) {
      const extension = path.extname(fileName).toLowerCase();
      // .woff / .woff2 sont compressés : leur en-tête n'est pas lisible ici (rarement installés).
      if (extension !== ".ttf" && extension !== ".otf") continue;
      const file = path.join(dir, fileName);
      let size = 0;
      try {
        const stat = fs.lstatSync(file);
        if (!stat.isFile()) continue;
        size = stat.size;
      } catch {
        continue;
      }
      const info = readFontInfo(file);
      if (info) fonts.push({ id: `${key}/${fileName}`, size, ...info });
    }
  }
  fonts.sort((a, b) => a.family.localeCompare(b.family) || a.weight - b.weight || a.style.localeCompare(b.style));
  cache = { at: Date.now(), fonts };
  return fonts;
}

/**
 * Chemin réel d'une police à partir de son identifiant, vérifié : dossier de polices
 * connu, nom de fichier simple (sans "..", sans "/"), extension de police, fichier
 * existant (pas un lien symbolique). Renvoie null sinon.
 */
export function resolveSystemFont(id: string): { path: string; fileName: string; extension: string } | null {
  const match = /^([a-z]+)\/([^/\\]+)$/.exec(id);
  if (!match) return null;
  const base = fontDirectories()[match[1]];
  const fileName = match[2];
  const extension = path.extname(fileName).toLowerCase();
  if (!base || !FONT_FORMATS[extension] || fileName.startsWith(".")) return null;
  // turbopackIgnore : chemin connu seulement à l'exécution, hors du projet ; à ne pas inclure dans le paquet du site.
  const resolved = path.resolve(/* turbopackIgnore: true */ base, fileName);
  if (path.dirname(resolved) !== path.resolve(/* turbopackIgnore: true */ base)) return null;
  try {
    const stat = fs.lstatSync(resolved);
    if (!stat.isFile() || stat.isSymbolicLink()) return null;
  } catch {
    return null;
  }
  return { path: resolved, fileName, extension };
}
