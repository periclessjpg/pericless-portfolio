# Projet : refonte du portfolio Pericless

## Qui
Je suis Pericless, illustrateur, graphiste et concept artist (jeu vidéo et animation). Je suis débutant en développement web : explique-moi simplement, en français, ce que tu fais et pourquoi.

## Objectif
Un portfolio professionnel moderne et immersif pour des recruteurs, directeurs artistiques et studios de jeux vidéo. Il remplacera à terme mon site WordPress pericless.fr, qui doit rester en ligne tant que le nouveau n'est pas terminé. Ne touche jamais à ce site.

## Direction artistique
Minimaliste, moderne, dominante sombre (dark mode fixe), inspirée des portfolios de concept artists pro. Typographie élégante et imposante : Cormorant Garamond pour les titres (classe font-display), Geist pour le texte. Artworks en grand format, au centre de l'expérience. Animations et transitions fluides. Navigation simple.

## Pages
Menu (bouton « Menu » sur tous les écrans, même style que le texte de gauche ; les liens apparaissent en fondu sous le mot « Menu », sur un voile sombre) : Concept Art, Illustration, About, Contact. Texte en haut à gauche, sur deux lignes : « Concept Artist & Illustrator » puis « Rayan Houstti » (lien vers Home). Dans app/data/site.ts : name = « Rayan Houstti » (barre du haut, pied de page, onglets, partage), title = « Concept Artist & Illustrator ».
Autres pages : Home, Projects (tous les projets, accessible depuis « View all projects »), pages détail des projets.
Concept Art : page avec 3 cartes cliquables (image 4:5 + titre), définies dans app/data/concept-art.ts : « Chara Design » (/concept-art/character-design, catégorie Character Design), « Environment » (/concept-art/environment, catégorie Environment Design), « All » (/concept-art/all, les deux). Chaque sous-page montre ses projets en bandes pleine largeur (ProjectBannerList : image thumb recadrée en 21:9 / 16:9 mobile, titre et type par-dessus dans le style sobre `label` de styles.ts). Illustration est une catégorie à part, affichée elle aussi en bandes pleine largeur (ProjectBannerList).

## Stack
Next.js 16 (App Router, dossier app, sans src), React, TypeScript, Tailwind CSS 4, Motion pour les animations, composants 21st.dev (via shadcn), GitHub (dépôt periclessjpg/pericless-portfolio, branche main), Vercel (projet pericless-portfolio, déploiement automatique à chaque push), Visual Studio Code sous Windows (PowerShell).

## État actuel
Fait : structure complète du portfolio, avec du contenu provisoire. Le site est en ligne sur Vercel.
- Thème et polices : polices Geist et Cormorant, thème sombre fixe (classe `dark` sur la balise html dans app/layout.tsx). Dans app/globals.css, --font-sans pointe vers --font-geist-sans (shadcn l'avait cassé, à revérifier après chaque commande shadcn).
- shadcn/ui installé (style nova, base Radix, couleur neutre, icônes Lucide) : components.json, lib/utils.ts, components/ui/button.tsx (pas encore utilisé).
- Données : app/data/site.ts (nom, accroche, vision, email, réseaux sociaux) et app/data/projects.ts (type Project avec `kind`, `thumb`, `status?: "wip"` et `featured` ; 13 projets d'exemple dont 2 « wip » ; les projets wip n'ont pas de page détail et sont exclus de l'accueil, de /projects et du précédent/suivant via `publishedProjects`). Images provisoires SVG dans public/placeholders/ ; les vraies images iront dans public/artworks/<slug>/. Guide utilisateur : docs/AJOUTER_MES_IMAGES.md.
- Pages : Home (hero : accroche seule + h1 invisible, nom un peu plus gros en haut à gauche ; Scroll to explore, Selected Works en plein écran via app/components/FullscreenProjects.tsx, images recadrées au centre, légendes sur les images dans le style sobre `label`, Vision ; titres « Selected Works » et « Vision » dans le style sobre `label`), /projects (grille + filtre par catégorie), /concept-art (3 cartes SectionCards + LetsTalk), /concept-art/[section] (generateStaticParams sur les 3 cartes, BackButton vers /concept-art, ProjectBannerList + LetsTalk), /illustration (ProjectBannerList + LetsTalk) ; les anciennes pages /character-design et /environment-design ont été supprimées (404), /projects/[slug] (bouton « Back » via app/components/BackButton.tsx et app/lib/navigation-history.ts : revient à la page précédente du site, sinon va vers /concept-art ou /illustration ; generateStaticParams, generateMetadata, notFound + not-found.tsx, projet précédent/suivant), /about (portrait, bio, compétences, logiciels, expériences, bouton CV vers /cv.pdf), /contact (mailto + réseaux, sans formulaire).
- Composants (app/components/) : Navbar (fixe, bouton Menu sur tous les écrans, liens animés avec Motion sous le bouton, voile sombre, lien actif, clavier), Footer, ProjectCard (vignette 4:3 recadrée), ProjectGrid, CategoryFilter (prop layout "grid" ou "list"), ProjectList (rangées : vignette non recadrée, titre en majuscules, type ; survol/focus : autres rangées à 0,4, vignette agrandie, titre décalé ; effets en CSS), ProjectBannerList (bandes pleine largeur, texte par-dessus en style label, mêmes effets de survol que ProjectList), SectionCards (cartes 4:5 cliquables, titre en BlurText, zoom au survol), LetsTalk, BlurText (titres : apparition mot par mot en fondu avec un léger bruit, filtre SVG feTurbulence + feDisplacementMap animé avec attrScale puis retiré ; texte complet en sr-only, mots aria-hidden), SocialLinks, ScrollIndicator, PageHeader, styles.ts (container, focusRing, label, titleLarge, titleMedium, eyebrow).
- Layout : lien « Skip to content », balise main#main-content, Footer sur toutes les pages, metadata avec title.template et Open Graph via app/lib/metadata.ts.
- Animations avec Motion (`motion`, import depuis "motion/react") dans app/components/motion/ : MotionProvider (reducedMotion="user"), Reveal, StaggerList/StaggerItem, réglages dans easing.ts (dont le bloc `titleReveal` : durée du fondu, intensité et durée du bruit, finesse du grain, écart entre les mots). Tous les titres visibles utilisent BlurText, dans le style sobre de styles.ts (Geist, capitales espacées) : `titleLarge` pour le grand titre de chaque page, `titleMedium` pour les autres titres, `label` pour le haut de page ; Cormorant (classe font-display) n'est plus utilisé dans les pages, mais reste chargé dans app/layout.tsx et app/globals.css. Transition de page dans app/template.tsx. Le zoom au survol des vignettes est fait en CSS.
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
