import { permanentRedirect } from "next/navigation";

// Ancienne adresse : Character Design et Environment Design sont maintenant
// regroupés dans la rubrique Concept Art. On redirige les visiteurs vers /concept-art.
export default function Page() {
  permanentRedirect("/concept-art");
}
