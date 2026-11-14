// Consignes pour les moteurs de recherche : /robots.txt.
// Tout le site peut être indexé, sauf les adresses techniques (/api, outils d'édition locaux).

import type { MetadataRoute } from "next";
import { absoluteUrl } from "./lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
