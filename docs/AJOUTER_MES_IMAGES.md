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
├── hero/                     → images de fond du haut de l'accueil + settings.json (réglages)
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
- il garde ta **taille d'origine jusqu'à 3840 px (4K)** sur le côté le plus long (une image plus grande est réduite à 3840 px, une plus petite n'est jamais agrandie) et l'enregistre en **WebP qualité 95** : la différence avec l'original est invisible à l'œil ;
- il **conserve le profil de couleur** de ton fichier (couleurs fidèles à ton logiciel de dessin) ;
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

**Changer l'ordre d'affichage** : utilise « Reorder » en local (voir plus haut), ou renomme les fichiers à la main (le numéro devant). Pour inverser l'ordre partout (le plus grand numéro en premier), change `SORT_ORDER` en `"desc"` tout en haut de `app/lib/artworks.ts`.

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

**Rendre une image cliquable** (images de l'accueil) : ajoute `"link"` avec l'adresse d'une page du site. Par exemple, dans `public/artworks/home/infos.json` :

```json
{
  "01-sicile.webp": { "title": "environment", "link": "/concept-art/environments" },
  "02-bionic-1.webp": { "title": "chara design", "link": "/concept-art/character-design" },
  "03-reproduction.webp": { "title": "illustration", "link": "/illustration" }
}
```

Seules les adresses internes au site sont acceptées (elles commencent par `/`, en minuscules : `/concept-art/all`, `/about`, `/contact`…). Une petite flèche « → » apparaît alors à côté du titre. Le lien suit l'image si tu la réordonnes.

**About** : nomme ton portrait `portrait.jpg` (ou `.webp`, `.png`…, et aussi `01-portrait.jpg`). Sans fichier « portrait », la première image sert de portrait. Les autres images s'affichent dans une grille en dessous.

---

## Choisir l'image de chaque carte (local uniquement)

Sur la page Concept Art (et Illustration, si tu y crées des sous-dossiers), chaque carte affiche par défaut la **première image** de son filtre. Pour en choisir une autre :

1. Avec `npm run dev`, ouvre la page sur localhost:3000 (outils affichés : « Show tools »).
2. Clique sur **« Choose image »** en haut à gauche d'une carte : les vignettes des images de ce filtre apparaissent (pour « All » : toutes les images de la catégorie).
3. Clique sur l'image voulue : la carte change. **« First image »** revient à la première image.

Le cadrage de l'image sur la carte se règle avec « Adjust framing ». Les choix sont enregistrés dans `public/artworks/concept-art/cards.json` (modifiable à la main : `{ "environments": "concept-art/environments/02-corridor-windows.webp" }`). Si l'image choisie est supprimée, la carte reprend la première image.

---

## Voir les images en grand

Sur les pages Environments, Character Design, All, Illustration, Projects et les photos d'About, **un clic sur une image l'ouvre en grand** dans une visionneuse plein écran : flèches ← → (à l'écran ou au clavier) pour passer à la suivante, glissement du doigt sur mobile, **Échap** ou **×** pour fermer. L'image entière est affichée (jamais recadrée), avec son titre en légende. Rien à régler : ça fonctionne aussi sur le site publié.

---

## Changer l'ordre en glissant (local uniquement)

Avec `npm run dev`, sur localhost:3000 (outils affichés) :

- **Ordre des images** : clique sur **« Reorder images »** (accueil, page d'un filtre, Illustration, About). Un panneau affiche les images en vignettes : glisse-les avec la poignée **≡** (souris ou doigt), ou utilise les flèches **↑ ↓** au clavier, puis **« Save »**.
- **Ordre des cartes** (Character Design, Environments…) : clique sur **« Reorder cards »** sur la page Concept Art ou Illustration. « All » reste toujours en premier.

Ce que fait « Save » : il **renumérote les noms** dans le nouvel ordre (`01-…`, `02-…`). Les fichiers (ou les dossiers, pour les cartes) sont seulement **renommés** : rien n'est effacé ni écrasé, les titres et cadrages de `infos.json` suivent les images, et les **adresses des pages ne changent pas**. « Undo changes » annule tes déplacements avant d'enregistrer, « Cancel » (ou Échap) ferme sans rien changer.

À savoir :
- Sur la page **« All »**, les images apparaissent d'abord dans l'ordre des cartes, puis celles du dossier `all/`. Le panneau y règle l'ordre des images du dossier `all/` ; l'ordre des autres se règle sur la page de leur filtre.
- Sur **About**, la première image sert de portrait (sauf si un fichier s'appelle `portrait`, ou `01-portrait`).
- Si un fichier est ouvert dans un autre logiciel (Photoshop…), le renommage peut échouer : ferme-le et réessaie. Rien n'est modifié en cas d'échec.

---

## Remplacer ou supprimer une image (local uniquement)

Avec `npm run dev`, sur localhost:3000, chaque image déjà en place a des boutons en haut à droite (interrupteur « Show tools » activé) :

- **« Replace »** : choisis une nouvelle image. Elle prend **la même place** (même numéro) et garde **le même titre** ; son cadrage repart du centre. Elle est optimisée comme à l'envoi (WebP, 2400 px, informations cachées supprimées).
- **« Delete »** : une confirmation s'affiche (« Delete this image? »), puis l'image disparaît du site.

**Rien n'est jamais effacé** : l'image supprimée ou remplacée est déplacée dans le dossier **`.artworks-trash/`** à la racine du projet (avec ses réglages dans un fichier `.infos.json` à côté). Son nom indique la date et le dossier d'origine, par exemple :
`2026-11-12_14-03-22__concept-art__character-design__01-dragon-knight.webp`

- **Récupérer une image** : remets-la dans son dossier d'origine et redonne-lui son nom (`01-dragon-knight.webp`).
- **Vider la corbeille** : supprime à la main le contenu de `.artworks-trash/` quand tu es sûr.
- Ce dossier n'est **jamais envoyé sur GitHub** ni publié (il est dans `.gitignore`).

Sur une carte de Concept Art ou d'Illustration, les boutons agissent sur l'image affichée (la première du filtre).

Sans le mode édition, tu peux aussi supprimer ou remplacer un fichier directement dans `public/artworks/` avec l'explorateur de fichiers.

---

## Modifier les textes du site (local uniquement)

Tous les textes du site sont modifiables sans toucher au code : haut de page et menu, titres et introductions des pages, sections de l'accueil, biographie, compétences, logiciels et expériences d'About, Contact, « Let's talk ! », « Back », « Coming soon », pied de page, noms des réseaux sociaux…

1. Avec `npm run dev`, ouvre le site sur localhost:3000.
2. Dans la bannière « Local edit mode » (en bas à gauche), active **« Edit texts »**.
3. Survole un texte : un contour en pointillés montre qu'il est modifiable. **Clique dessus** : une zone de saisie apparaît par-dessus, avec la même police.
4. Modifie le texte, puis **« Save »** (ou **Ctrl + Entrée**). **Échap** annule, **« Original text »** remet le texte d'origine.
5. Désactive « Edit texts » pour naviguer normalement (quand il est activé, un clic sur un lien ouvre son texte au lieu de changer de page). Pour modifier les liens du menu, ouvre d'abord le menu, puis active « Edit texts ».

À savoir :
- **Laisser un texte vide le masque** sur le site. En local, il reste visible sous la forme « (empty) » pour pouvoir le remplir plus tard.
- **About** : les listes ont des emplacements vides en plus (6 compétences, 6 logiciels, 4 expériences) : remplis-les pour ajouter des lignes.
- **L'email** est le même partout (pied de page, Contact, « Let's talk ! ») : le modifier une fois change aussi le lien qui ouvre la messagerie.
- Les textes sont du **texte simple** : les retours à la ligne sont gardés, mais aucun code (HTML) n'est interprété.
- Tes modifications sont enregistrées dans **`content/texts.json`** (seulement les textes différents de l'original). Tu peux aussi l'ouvrir et le modifier à la main. Supprimer une ligne de ce fichier remet le texte d'origine.
- Les titres des images (déduits du nom de fichier ou de `infos.json`) et les titres des cartes de filtres (déduits du nom du dossier) ne passent pas par ce système.

---

## Choisir les polices (local uniquement)

Comme des styles de paragraphe dans InDesign, chaque **rôle** a sa police et ses réglages :

| Rôle | Où | Réglages |
|---|---|---|
| **Page titles** | grand titre en haut de chaque page | police, graisse, taille, espacement, capitales |
| **Secondary titles** | sections, cartes, bandes, légendes de l'accueil | police, graisse, taille, espacement, capitales |
| **Header & menu** | nom en haut à gauche, « Menu », liens du menu, « Back » | police, graisse, taille, espacement, capitales |
| **Body text** | paragraphes, listes, liens, petits textes | police, graisse, espacement |

1. Avec `npm run dev`, ouvre le site sur localhost:3000 (outils affichés : « Show tools »).
2. Clique sur **« Typography »** en bas à droite. La liste de tes **polices installées sur Windows** se charge.
3. Pour chaque rôle : cherche une police, choisis son **style** (Regular, Bold, Light… : c'est ce qui fixe la graisse), règle la taille, l'espacement des lettres et les capitales. Le site change **en direct**.
4. **« Save »** : les fichiers des polices choisies sont **copiés dans `public/fonts/`** (pour que tes visiteurs les voient) et les réglages enregistrés dans **`content/typography.json`**. **« Reset all »** revient à Geist partout, **« Cancel »** (ou Échap) annule.

**Important : les licences.** Une police installée sur ton ordinateur n'est pas forcément autorisée sur un site web. **Vérifie la licence de chaque police avant de publier** (site de la fonderie, fichier de licence fourni). Les polices dont le fichier interdit l'intégration sont marquées « no web use » et refusées ; les polices de Windows (Arial, Segoe…) ne sont en général **pas** autorisées sur un site. Privilégie des polices libres (Google Fonts, licence SIL Open Font) ou achetées avec une licence « web ».

À savoir :
- Les polices **Adobe Fonts** (Creative Cloud) n'apparaissent pas : leurs fichiers sont protégés. Pour les utiliser sur le site, il faut un « projet web » Adobe Fonts (dis-le-moi si tu en as besoin).
- Seuls les fichiers `.ttf` et `.otf` sont listés. Chaque police ajoutée alourdit un peu le site : 2 ou 3 polices au maximum.
- Les anciennes polices copiées restent dans `public/fonts/` (rien n'est supprimé automatiquement) : tu peux supprimer celles que tu n'utilises plus.
- Le panneau ne fait que **lire** tes dossiers de polices Windows : rien n'y est modifié.

---

## Personnaliser le hero (haut de l'accueil)

Le hero est **entièrement réglable** : image, taille, transparence, filtres, voile, texte, animation.

**Avec le panneau (en local, le plus simple)** :
1. Avec `npm run dev`, ouvre l'accueil sur localhost:3000 (outils affichés : « Show tools »).
2. Clique sur **« Customize hero »** en bas à droite.
3. Bouge les curseurs : le hero change **en direct**. (Le choix de l'image et l'animation s'appliquent après « Save ».)
4. **« Save »** enregistre, **« Reset »** remet les réglages d'origine, **« Cancel »** (ou Échap) ferme sans enregistrer.

**Les images du hero** : dépose-les sur la tuile du hero (ou dans `public/artworks/hero/`), puis choisis laquelle afficher dans le panneau (menu « Background image »). Sur l'image affichée, « Adjust framing », « Replace » et « Delete » fonctionnent comme ailleurs.

**À la main** : tous les réglages sont dans `public/artworks/hero/settings.json` (créé au premier « Save »). Une valeur absente ou invalide est remplacée par la valeur par défaut : le site ne plante jamais.

| Réglage | Rôle | Valeurs (défaut) |
|---|---|---|
| `image` | image affichée (nom du fichier dans hero/) | `""` = la première |
| `height` | hauteur, en % de l'écran | 40 à 100 (100) |
| `imageOpacity` | opacité de l'image | 0 à 100 (100) |
| `zoom` | zoom de l'image | 100 à 200 (100) |
| `blur` | flou, en pixels | 0 à 20 (0) |
| `grayscale` | noir et blanc | 0 à 100 (0) |
| `saturation` / `brightness` / `contrast` | couleurs, luminosité, contraste | 0 à 200 (100) |
| `overlayColor` | couleur du voile | `#rrggbb` (`#0a0a0a`) |
| `overlayOpacity` | intensité du voile | 0 à 100 (30) |
| `gradient` | direction du dégradé | `bottom`, `left`, `bottom-left`, `none` (`bottom-left`) |
| `gradientStrength` | force du dégradé | 0 à 100 (100) |
| `textVertical` | position verticale de l'accroche | `top`, `center`, `bottom` (`center`) |
| `textHorizontal` | position horizontale | `left`, `center`, `right` (`left`) |
| `textSize` | taille de l'accroche, en pixels | 12 à 64 (18) |
| `textColor` | couleur de l'accroche | `#rrggbb` (`#e5e5e5`) |
| `showScroll` | afficher « Scroll to explore » | `true` / `false` (`true`) |
| `animation` | arrivée de l'image | `fade`, `zoom`, `none` (`fade`) |
| `animationDuration` | durée de l'arrivée, en secondes | 0.2 à 4 (0.8) |
| `parallax` | l'image défile plus lentement que la page | 0 à 100 (0) |

Pour revenir au hero d'origine : « Reset » puis « Save » dans le panneau, ou supprime `settings.json`.

Avec le réglage « réduire les animations » de l'ordinateur du visiteur, la parallaxe et le zoom d'arrivée sont désactivés automatiquement.

---

## Régler le cadrage d'une image

Quand une image est **recadrée** (fond du haut de l'accueil, « Selected Works », bandes de Concept Art et d'Illustration, cartes, portrait d'About), elle est centrée par défaut. Tu peux choisir la partie qui reste visible (par exemple garder le visage d'un personnage).

**Sur le site, en local (le plus simple)** :
1. Avec `npm run dev`, ouvre la page sur localhost:3000 (les outils doivent être affichés : interrupteur « Show tools » de la bannière).
2. Clique sur **« Adjust framing »** en haut à droite de l'image.
3. Clique sur la partie de l'image à garder visible : l'aperçu se recadre en direct (les flèches du clavier déplacent aussi la zone, Échap annule).
4. Clique sur **« Save »**. **« Reset »** revient au centre.

**À la main** : dans le `infos.json` du dossier de l'image, ajoute `"position"` :

```json
{
  "01-dragon-knight.webp": { "position": "50% 20%" }
}
```

Le premier nombre est l'horizontal (0 % = gauche, 100 % = droite), le second le vertical (0 % = haut, 100 % = bas). Le cadrage est réglé **une fois par image** : si elle sert à la fois de carte et de bande, il s'applique aux deux. La grille de la page Projects montre toujours les images entières.

---

## Tailles recommandées

- **Côté le plus long : jusqu'à 3840 px (4K).** Au-delà, l'envoi en local réduit l'image à 3840 px.
- **Format : WebP ou JPG en haute qualité (90 à 95)**, idéalement **moins de 3 Mo** par image.
- **À l'affichage**, le site sert tes images en **qualité 90** (réglage `images.qualities` dans `next.config.ts`) et en plusieurs tailles selon l'écran du visiteur.
- **Accueil (`home/`)** : images horizontales, sujet bien centré (elles remplissent tout l'écran, recadrées).
- **Fond du haut de l'accueil (`hero/`)** : une image horizontale ; le texte est en bas à gauche, un sujet plutôt à droite ou en haut reste bien visible. L'image est assombrie automatiquement.
- **Listes Concept Art / Illustration** : deux images par ligne (une sur mobile), au format 4:3, recadrées selon leur cadrage ; la page Projects montre les images entières.
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
