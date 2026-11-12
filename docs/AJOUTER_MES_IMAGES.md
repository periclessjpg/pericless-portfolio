# Ajouter mes images et mes textes

Le site lit **automatiquement** les images rangées dans `public/artworks/`. Tu n'as jamais besoin de toucher au code pour ajouter une œuvre. Deux méthodes, au choix :

- **Méthode 1 : glisser-déposer sur le site, en local** (la plus simple) ;
- **Méthode 2 : ranger les fichiers à la main** dans les dossiers.

Les deux donnent exactement le même résultat.

---

## Les dossiers

```
public/artworks/
├── concept-art/              → page Concept Art
│   ├── character-design/     → carte et filtre « Character Design »
│   ├── environments/         → carte et filtre « Environments »
│   └── all/                  → images visibles seulement dans « All »
├── illustration/             → page Illustration
│   └── all/                  → tes illustrations
├── home/                     → « Selected Works » sur l'accueil (plein écran)
└── about/                    → page About : portrait.jpg + autres photos
```

- **Chaque sous-dossier de `concept-art/` ou `illustration/` devient un filtre** (une carte sur la page). Crée un dossier `props/` : une carte « Props » apparaît.
- **« All » est toujours la première carte** et montre toutes les images de la catégorie.
- Une image dans `character-design/` apparaît dans « Character Design » **et** dans « All ». Une image dans `all/` (ou posée directement dans `concept-art/`) apparaît **seulement** dans « All ».
- Dans `illustration/`, tant qu'il n'y a que `all/`, la page affiche directement la liste. Dès que tu crées un sous-dossier, les cartes apparaissent.
- Un dossier vide affiche simplement « Coming soon ».
- Chaque dossier contient un `LISEZ-MOI.txt` : il est ignoré par le site, tu peux le laisser.

---

## Méthode 1 : glisser-déposer sur le site (local uniquement)

> ⚠️ **Ce mode d'édition n'existe que sur ton ordinateur**, quand `npm run dev` tourne et que tu regardes **localhost:3000**. Il n'existe pas du tout sur le site publié : personne d'autre ne peut ajouter d'images.

1. Lance `npm run dev` (si ce n'est pas déjà fait) et ouvre **localhost:3000**.
2. Une bannière **« Local edit mode »** apparaît en bas à gauche. Son interrupteur **« Show tools »** masque ou affiche les outils, pour voir le site comme un visiteur.
3. Va sur la page voulue (Concept Art, une de ses cartes, Illustration, l'accueil ou About). Une tuile en pointillés **« Drop images here »** est placée à l'endroit des images, avec la même forme qu'elles.
4. **Glisse tes images** dessus (plusieurs d'un coup, 30 maximum), ou clique sur **« Browse files »**.
5. Un aperçu apparaît pour chaque image, avec les mêmes effets que sur le site. Tu peux :
   - donner un **titre** (facultatif) ; sinon il est déduit du nom du fichier ;
   - retirer une image de la file avec **×** ;
   - choisir le filtre de destination dans **« Destination »** (par défaut : celui de la page où tu es ; « All » = dossier `all/`) ;
   - créer un nouveau filtre avec **« New filter »**.
6. Clique sur **« Upload »**. Une barre de progression avance pour chaque image, puis la page se met à jour avec les vraies images.

Ce que fait l'envoi automatiquement :
- il **redresse** les photos prises de travers (orientation de l'appareil) ;
- il **supprime les informations cachées** de la photo (appareil, date, **position GPS**) ;
- il réduit l'image à **2400 px** sur le côté le plus long et l'enregistre en **WebP** (qualité 85), un format léger ;
- il **nomme le fichier** lui-même (ex. `03-dragon-knight.webp`, à la suite des précédents) et **n'écrase jamais** une image existante ;
- le titre éventuel est enregistré dans un fichier `infos.json` du même dossier.

**Garde toujours tes originaux sur ton ordinateur** : le site n'enregistre qu'une version allégée.

À savoir : les accents sont retirés des noms de fichiers (« Héros » → `heros`). Pour garder « Héros » dans le titre affiché, tape-le dans le champ **Title** avant l'envoi.

---

## Méthode 2 : ranger les fichiers à la main

1. Prépare ton image (voir « Tailles recommandées »).
2. Nomme-la simplement : **minuscules, chiffres et tirets**, sans espaces ni accents, avec un numéro devant pour l'ordre :
   `01-dragon-knight.webp`, `02-forest-temple.jpg`, `10-final-boss.png`
3. Glisse-la dans le bon dossier de `public/artworks/` (dans l'explorateur de fichiers ou dans VS Code).
4. Recharge la page sur localhost:3000 : elle apparaît.

**Règles de nommage**
- Le **numéro** au début fixe l'ordre (01, 02… 10 est bien après 09) et n'est **pas affiché**.
- Le **titre** est déduit du nom : `01-dragon-knight.webp` → « Dragon Knight ».
- Le **texte alternatif** (lu par les personnes malvoyantes et par Google) est créé automatiquement : « Dragon Knight – Character Design ».
- **Formats acceptés** : `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`. Les autres fichiers sont ignorés.
- Les noms avec espaces ou accents fonctionnent, mais les noms simples évitent toute surprise.

**Créer un filtre** : crée un sous-dossier dans `concept-art/` ou `illustration/` (ex. `props/`). Pour choisir l'ordre des cartes, mets un numéro devant : `01-character-design/`, `02-environments/`, `03-props/`. Le numéro n'est pas affiché.

**Masquer une image** sans la supprimer : ajoute `_` devant son nom (`_brouillon.jpg`). Elle disparaît des pages. Attention : si tu l'envoies sur GitHub, elle reste accessible à qui connaît son adresse exacte. Pour une image vraiment privée, ne la mets pas dans le projet.

**Changer l'ordre d'affichage** : renomme les fichiers (le numéro devant). Pour inverser l'ordre partout (le plus grand numéro en premier), change `SORT_ORDER` en `"desc"` tout en haut de `app/lib/artworks.ts`.

**Option : `infos.json`** (jamais obligatoire). Dans un dossier, ce fichier permet de changer le titre, l'année, la description ou le texte alternatif d'une image, par nom de fichier :

```json
{
  "01-dragon-knight.webp": {
    "title": "The Dragon Knight",
    "year": 2025,
    "description": "Key art for a personal project.",
    "alt": "Knight in red armor facing a dragon"
  }
}
```

**About** : nomme ton portrait `portrait.jpg` (ou `.webp`, `.png`…). Sans fichier « portrait », la première image sert de portrait. Les autres images s'affichent dans une grille en dessous.

---

## Tailles recommandées

- **Côté le plus long : environ 2400 px.**
- **Format : WebP ou JPG**, idéalement **moins de 1,5 Mo** par image.
- **Accueil (`home/`)** : images horizontales, sujet bien centré (elles remplissent tout l'écran, recadrées au centre).
- **Listes Concept Art / Illustration** : les bandes sont panoramiques (recadrées au centre) ; la page Projects montre les images entières.
- Avec la méthode 1, tu n'as pas à t'en occuper : l'envoi réduit et convertit l'image tout seul.

---

## Publier sur le site (3 commandes)

Quand tes nouvelles images te plaisent sur localhost:3000, dans le terminal de VS Code :

```
git add .
git commit -m "Add artworks"
git push
```

Vercel met le site en ligne à jour automatiquement en une ou deux minutes.

---

# Archive : ancienne méthode (plus utilisée)

> Les sections ci-dessous décrivent l'ancien système basé sur `app/data/projects.ts`. **Ce fichier n'est plus affiché sur le site** depuis le passage aux dossiers `public/artworks/` : ces instructions sont conservées pour mémoire uniquement.

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
   - **`kind`** : le type de réalisation, affiché en petit sous le titre dans les listes Concept Art et Illustration (ex. `"Key art"`, `"Character sheet"`, `"Environment study"`).
   - **`thumb`** : l'image du projet dans les listes Concept Art et Illustration. Même format que `cover` (`src`, `alt`, `width`, `height`), par exemple `public/artworks/<slug>/thumb.jpg`. Elle s'affiche en **bande pleine largeur** (format panoramique 21:9 sur ordinateur, 16:9 sur mobile), **recadrée au centre**, avec le titre par-dessus en bas à gauche. Utilise une image horizontale d'environ **2400 pixels de large**, avec le sujet bien centré (pour une œuvre verticale, prépare un recadrage horizontal d'un détail).
   - **`cover`** et **`images`** (voir plus haut).
   - **`featured: true`** si tu veux qu'il apparaisse dans « Selected Works » sur l'accueil (6 projets maximum). Sinon, supprime cette ligne.
   - **`status: "wip"`** pour un travail en cours : il apparaît dans la liste avec la mention « Work in progress », sans lien ni page. Supprime cette ligne quand le projet est terminé.
4. Crée le dossier `public/artworks/<slug>/` et mets-y les images.
5. Enregistre : le site se met à jour tout seul dans le navigateur (localhost:3000).

L'ordre des projets dans le fichier est l'ordre d'affichage sur le site.

## 6. Supprimer un projet d'exemple

Supprime son bloc complet (de `{` jusqu'à `},`) dans `app/data/projects.ts`.

---

## 7. Autres contenus

- **Cartes de la page Concept Art (Chara Design, Environment, All)** : mets tes images dans `public/artworks/concept-art/` (ex. `chara-design.jpg`), puis change `src`, `alt`, `width` et `height` de chaque carte dans `app/data/concept-art.ts`. Les cartes sont au format vertical 4:5 : choisis une image dont le sujet est centré. Tu peux aussi y changer le titre et l'introduction de chaque sous-page.
- **Portrait (page About)** : mets ta photo dans `public/artworks/about/portrait.jpg`, puis change le chemin dans `app/about/page.tsx`.
- **CV** : dépose ton fichier sous le nom exact `cv.pdf` directement dans `public/`. Le bouton « Download CV » pointe déjà dessus.
- **Réseaux sociaux** : dans `app/data/site.ts`, remplace chaque `"#"` par l'adresse complète de ton profil (ex. `"https://www.artstation.com/tonnom"`).

---

## 8. En cas de problème

- **L'image ne s'affiche pas** : vérifie le chemin (majuscules/minuscules, extension `.jpg` ou `.png`) et que le fichier est bien dans `public/artworks/...`.
- **Erreur rouge à l'écran** : il manque souvent une virgule ou un guillemet. Compare avec un autre projet qui fonctionne.
- **L'image est déformée** : vérifie `width` et `height`.

Avant d'envoyer sur GitHub, lance `npm run build` dans le terminal pour vérifier que tout compile.
