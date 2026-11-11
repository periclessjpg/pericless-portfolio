# Ajouter mes images et mes textes

Ce guide explique, pas à pas, comment remplacer le contenu provisoire du site par tes vraies œuvres.

Astuce : dans Visual Studio Code, fais **Ctrl + Maj + F** et cherche `[À REMPLACER]`. Tu verras tous les textes provisoires à changer.

---

## 1. Les deux fichiers à connaître

| Fichier | Ce qu'il contient |
|---|---|
| `app/data/site.ts` | Ton nom, ton accroche, ton texte de vision, ton email, tes réseaux sociaux |
| `app/data/projects.ts` | La liste de tous tes projets (titres, textes, images) |

Tu n'as presque jamais besoin de toucher aux autres fichiers pour changer le contenu.

---

## 2. Préparer une image

1. Exporte ton image en **JPG** (ou **WEBP**), environ **2400 pixels** sur le grand côté. C'est assez net pour les grands écrans, sans être trop lourd.
2. Nomme le fichier **en minuscules, sans espace ni accent** : `cover.jpg`, `sheet-01.jpg`, `lighting-study.jpg`.
3. Note sa **largeur** et sa **hauteur** en pixels : sous Windows, clic droit sur le fichier > **Propriétés** > onglet **Détails**.

---

## 3. Où ranger les images

Chaque projet a son propre dossier dans `public/artworks/`, qui porte le nom de son **slug** (l'identifiant du projet) :

```
public/
  artworks/
    character-project-01/
      cover.jpg
      sheet-01.jpg
      details.jpg
```

Si le dossier `artworks` n'existe pas encore, crée-le dans `public`.

---

## 4. Remplacer une image provisoire

Ouvre `app/data/projects.ts` et trouve ton projet. Une image provisoire ressemble à ceci :

```ts
cover: { ...P.tall2, alt: ALT },
```

Remplace-la par :

```ts
cover: {
  src: "/artworks/character-project-01/cover.jpg",
  alt: "Warrior in red armor, full body, front view",
  width: 2000,
  height: 2500,
},
```

Points importants :

- **`src`** commence par `/artworks/...`. N'écris **pas** `public` dans le chemin.
- **`alt`** est **obligatoire** : une courte phrase en anglais qui décrit l'image (pour les personnes malvoyantes et pour Google).
- **`width` et `height`** sont les vraies dimensions de ton image.

Pour les images de la page du projet (`images`), c'est pareil, avec en plus une légende facultative :

```ts
images: [
  {
    src: "/artworks/character-project-01/sheet-01.jpg",
    alt: "Character turnaround sheet with front, side and back views",
    width: 2400,
    height: 1350,
    caption: "Final turnaround",
  },
],
```

---

## 5. Ajouter un nouveau projet

1. Dans `app/data/projects.ts`, copie un bloc complet de projet, de `{` jusqu'à `},`.
2. Colle-le juste en dessous, dans la liste.
3. Change :
   - **`slug`** : identifiant unique, en minuscules avec des tirets (ex. `forest-guardian`). Il devient l'adresse de la page : `/projects/forest-guardian`.
   - **`title`**, **`year`**, **`summary`**, **`tools`**.
   - **`category`** : exactement `"Character Design"`, `"Environment Design"` ou `"Illustration"`. Les deux premières apparaissent dans la rubrique **Concept Art**, la troisième dans **Illustration**.
   - **`cover`** et **`images`** (voir plus haut).
   - **`featured: true`** si tu veux qu'il apparaisse dans « Selected Works » sur l'accueil (6 projets maximum). Sinon, supprime cette ligne.
4. Crée le dossier `public/artworks/<slug>/` et mets-y les images.
5. Enregistre : le site se met à jour tout seul dans le navigateur (localhost:3000).

L'ordre des projets dans le fichier est l'ordre d'affichage sur le site.

## 6. Supprimer un projet d'exemple

Supprime son bloc complet (de `{` jusqu'à `},`) dans `app/data/projects.ts`.

---

## 7. Autres contenus

- **Portrait (page About)** : mets ta photo dans `public/artworks/about/portrait.jpg`, puis change le chemin dans `app/about/page.tsx`.
- **CV** : dépose ton fichier sous le nom exact `cv.pdf` directement dans `public/`. Le bouton « Download CV » pointe déjà dessus.
- **Réseaux sociaux** : dans `app/data/site.ts`, remplace chaque `"#"` par l'adresse complète de ton profil (ex. `"https://www.artstation.com/tonnom"`).

---

## 8. En cas de problème

- **L'image ne s'affiche pas** : vérifie le chemin (majuscules/minuscules, extension `.jpg` ou `.png`) et que le fichier est bien dans `public/artworks/...`.
- **Erreur rouge à l'écran** : il manque souvent une virgule ou un guillemet. Compare avec un autre projet qui fonctionne.
- **L'image est déformée** : vérifie `width` et `height`.

Avant d'envoyer sur GitHub, lance `npm run build` dans le terminal pour vérifier que tout compile.
