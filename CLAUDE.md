# Projet : refonte du portfolio Pericless

## Qui
Je suis Pericless, illustrateur, graphiste et concept artist (jeu vidéo et animation). Je suis débutant en développement web : explique-moi simplement, en français, ce que tu fais et pourquoi.

## Objectif
Un portfolio professionnel moderne et immersif pour des recruteurs, directeurs artistiques et studios de jeux vidéo. Il remplacera à terme mon site WordPress pericless.fr, qui doit rester en ligne tant que le nouveau n'est pas terminé. Ne touche jamais à ce site.

## Direction artistique
Minimaliste, moderne, dominante sombre (dark mode fixe), inspirée des portfolios de concept artists pro. Typographie élégante et imposante : Cormorant Garamond pour les titres (classe font-display), Geist pour le texte. Artworks en grand format, au centre de l'expérience. Animations et transitions fluides. Navigation simple.

## Pages
Menu (bouton « Menu » sur tous les écrans, même style que le texte de gauche ; les liens apparaissent en fondu sous le mot « Menu », sur un voile sombre) : Concept Art, Illustration, About, Contact. Texte en haut à gauche : « Concept Artist & Illustrator » (lien vers Home).
Autres pages : Home, Projects (tous les projets, accessible depuis « View all projects »), pages détail des projets.
Concept Art regroupe les catégories Character Design et Environment Design (avec un filtre) ; Illustration est une catégorie à part.

## Stack
Next.js 16 (App Router, dossier app, sans src), React, TypeScript, Tailwind CSS 4, Motion pour les animations, composants 21st.dev (via shadcn), GitHub (dépôt periclessjpg/pericless-portfolio, branche main), Vercel (projet pericless-portfolio, déploiement automatique à chaque push), Visual Studio Code sous Windows (PowerShell).

## État actuel
Fait : structure complète du portfolio, avec du contenu provisoire. Le site est en ligne sur Vercel.
- Thème et polices : polices Geist et Cormorant, thème sombre fixe (classe `dark` sur la balise html dans app/layout.tsx). Dans app/globals.css, --font-sans pointe vers --font-geist-sans (shadcn l'avait cassé, à revérifier après chaque commande shadcn).
- shadcn/ui installé (style nova, base Radix, couleur neutre, icônes Lucide) : components.json, lib/utils.ts, components/ui/button.tsx (pas encore utilisé).
- Données : app/data/site.ts (nom, accroche, vision, email, réseaux sociaux) et app/data/projects.ts (type Project, 8 projets d'exemple, champ `featured` pour Selected Works, fonctions utiles). Images provisoires SVG dans public/placeholders/ ; les vraies images iront dans public/artworks/<slug>/. Guide utilisateur : docs/AJOUTER_MES_IMAGES.md.
- Pages : Home (hero, Scroll to explore, Selected Works en plein écran via app/components/FullscreenProjects.tsx, images recadrées au centre, Vision), /projects (grille + filtre par catégorie), /concept-art (Character + Environment, filtre), /illustration, /character-design et /environment-design (redirigent vers /concept-art avec permanentRedirect), /projects/[slug] (bouton « Back » via app/components/BackButton.tsx et app/lib/navigation-history.ts : revient à la page précédente du site, sinon va vers /concept-art ou /illustration ; generateStaticParams, generateMetadata, notFound + not-found.tsx, projet précédent/suivant), /about (portrait, bio, compétences, logiciels, expériences, bouton CV vers /cv.pdf), /contact (mailto + réseaux, sans formulaire).
- Composants (app/components/) : Navbar (fixe, bouton Menu sur tous les écrans, liens animés avec Motion sous le bouton, voile sombre, lien actif, clavier), Footer, ProjectCard (vignette 4:3 recadrée), ProjectGrid, CategoryFilter, SocialLinks, ScrollIndicator, PageHeader, styles.ts (container, focusRing, eyebrow).
- Layout : lien « Skip to content », balise main#main-content, Footer sur toutes les pages, metadata avec title.template et Open Graph via app/lib/metadata.ts.
- Animations avec Motion (`motion`, import depuis "motion/react") dans app/components/motion/ : MotionProvider (reducedMotion="user"), Reveal, StaggerList/StaggerItem, réglages dans easing.ts. Transition de page dans app/template.tsx. Le zoom au survol des vignettes est fait en CSS.
- Conventions Next.js 16 : `params` est asynchrone, `preload` remplace `priority` pour next/image, `cacheComponents` est activé (`dynamicParams` n'est pas disponible). Les textes provisoires commencent par "[À REMPLACER]".
- `npm audit` signale des failles venant du paquet shadcn : ne pas lancer `npm audit fix --force` (il rétrograderait shadcn).

Pas encore fait : vrais textes et vraies images (remplacer les "[À REMPLACER]" et les placeholders), cv.pdf, vrais liens sociaux et email, composants 21st.dev, domaine pericless.fr.

## Règles de travail
- Avant toute modification importante, explique ce que tu vas faire et demande confirmation.
- Ne supprime ni n'écrase jamais un fichier sans me le demander.
- Ne fais jamais de git commit ni de git push sans que je te le demande.
- N'installe pas de paquet sans m'expliquer à quoi il sert.
- Ne mets jamais de clé API, de mot de passe ou de secret dans un fichier du projet.
- Avance une étape à la fois et vérifie que le site fonctionne (npm run dev) avant la suivante.
- Les artworks sont mes propres œuvres : ne les modifie pas et n'en invente pas.
