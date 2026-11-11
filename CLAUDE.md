# Projet : refonte du portfolio Pericless

## Qui
Je suis Pericless, illustrateur, graphiste et concept artist (jeu vidéo et animation). Je suis débutant en développement web : explique-moi simplement, en français, ce que tu fais et pourquoi.

## Objectif
Un portfolio professionnel moderne et immersif pour des recruteurs, directeurs artistiques et studios de jeux vidéo. Il remplacera à terme mon site WordPress pericless.fr, qui doit rester en ligne tant que le nouveau n'est pas terminé. Ne touche jamais à ce site.

## Direction artistique
Minimaliste, moderne, dominante sombre (dark mode fixe), inspirée des portfolios de concept artists pro. Typographie élégante et imposante : Cormorant Garamond pour les titres (classe font-display), Geist pour le texte. Artworks en grand format, au centre de l'expérience. Animations et transitions fluides. Navigation simple.

## Pages
Home, Projects, Character Design, Environment Design, About, Contact.

## Stack
Next.js 16 (App Router, dossier app, sans src), React, TypeScript, Tailwind CSS 4, Motion pour les animations, composants 21st.dev (via shadcn), GitHub (dépôt periclessjpg/pericless-portfolio, branche main), Vercel (projet pericless-portfolio, déploiement automatique à chaque push), Visual Studio Code sous Windows (PowerShell).

## État actuel
Fait : page d'accueil sombre, les 5 autres pages (titres seulement), barre de navigation commune (app/components/Navbar.tsx branchée dans app/layout.tsx), polices Geist et Cormorant, thème sombre fixe dans app/globals.css. Le site est en ligne sur Vercel.
shadcn/ui installé (style nova, base Radix, couleur neutre, icônes Lucide) : components.json, lib/utils.ts, composants dans components/ui (button.tsx, pas encore utilisé). Le thème sombre fixe est assuré par la classe `dark` sur la balise html (app/layout.tsx) ; dans app/globals.css, --font-sans pointe vers --font-geist-sans (shadcn l'avait cassé, à revérifier après chaque commande shadcn).
Pas encore fait : composants 21st.dev, grille d'artworks, animations Motion, menu mobile, contenu des pages About et Contact, domaine pericless.fr.

## Règles de travail
- Avant toute modification importante, explique ce que tu vas faire et demande confirmation.
- Ne supprime ni n'écrase jamais un fichier sans me le demander.
- Ne fais jamais de git commit ni de git push sans que je te le demande.
- N'installe pas de paquet sans m'expliquer à quoi il sert.
- Ne mets jamais de clé API, de mot de passe ou de secret dans un fichier du projet.
- Avance une étape à la fois et vérifie que le site fonctionne (npm run dev) avant la suivante.
- Les artworks sont mes propres œuvres : ne les modifie pas et n'en invente pas.
