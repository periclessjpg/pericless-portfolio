// Lien email protégé contre le spam (voir ProtectedEmail.tsx) : l'adresse des textes
// du site (common.email) est codée ici, côté serveur, avant d'être envoyée au navigateur.

import { getTexts } from "../lib/texts";
import { editable } from "../lib/texts-defaults";
import ProtectedEmail from "./ProtectedEmail";

/** Code l'adresse : à l'envers, puis en base64. */
export function encodeEmail(email: string): string {
  return Buffer.from(email.split("").reverse().join(""), "utf8").toString("base64");
}

export default async function EmailLink({ className }: { className?: string }) {
  const email = (await getTexts())["common.email"].trim();
  if (!email) return null;
  return <ProtectedEmail code={encodeEmail(email)} className={className} attributes={editable("common.email")} />;
}
