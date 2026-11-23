---
name: "Savage Rise / FAZA"
description: "Streetwear premium, photographie réelle et hiérarchie éditoriale de mode."
colors:
  accent: "hsl(39 64% 35%)"
  gold: "#D4AF37"
  primary: "hsl(24 12% 9%)"
  primary-foreground: "hsl(42 30% 96%)"
  background: "hsl(36 33% 96%)"
  foreground: "hsl(35 12% 11%)"
  card: "hsl(36 33% 97%)"
  border: "hsl(34 20% 79%)"
  muted: "hsl(38 18% 89%)"
  muted-foreground: "hsl(30 8% 37%)"
  header: "#191813"
  inverse-foreground: "hsl(36 25% 94%)"
  header-border: "hsl(35 14% 26%)"
  header-accent: "hsl(43 65% 62%)"
  photo-foreground: "#fffaf2"
  white: "#ffffff"
  black: "#000000"
  dark-background: "hsl(30 8% 7%)"
  dark-card: "hsl(30 8% 10%)"
  dark-border: "hsl(30 10% 29%)"
  dark-muted-foreground: "hsl(34 12% 69%)"
  dark-accent: "hsl(43 63% 62%)"
typography:
  display:
    fontFamily: "var(--font-playfair)"
    fontSize: "clamp(3rem, 5.5vw, 5.25rem)"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-.025em"
  headline:
    fontFamily: "var(--font-playfair)"
    fontSize: "clamp(2rem, 3.3vw, 2.8rem)"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-.025em"
  detail-title:
    fontFamily: "var(--font-playfair)"
    fontSize: "clamp(1.8rem, 2.6vw, 2.4rem)"
    fontWeight: 500
    lineHeight: 1.12
    letterSpacing: "-.025em"
  title:
    fontFamily: "var(--font-playfair)"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.25
  price:
    fontFamily: "var(--font-playfair)"
    fontSize: "18px"
    fontWeight: 600
  body:
    fontFamily: "var(--font-inter)"
  description:
    fontFamily: "var(--font-inter)"
    fontSize: "14px"
    lineHeight: 1.625
  label:
    fontFamily: "var(--font-inter)"
    fontSize: "10px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: ".24em"
  navigation:
    fontFamily: "var(--font-inter)"
    fontSize: "11px"
    fontWeight: 600
    letterSpacing: ".18em"
  purchase-label:
    fontFamily: "var(--font-playfair), serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: ".15em"
rounded:
  square: "0"
  photo-card: "1px"
  thumbnail: "2px"
  control: "4px"
  circle: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  compact: "10px"
  md: "12px"
  lg: "16px"
  section: "24px"
  wide: "32px"
components:
  button-purchase:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.purchase-label}"
    rounded: "{rounded.control}"
    padding: "12px 16px"
  button-purchase-outline:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    typography: "{typography.purchase-label}"
    rounded: "{rounded.control}"
    padding: "12px 16px"
  button-hero:
    backgroundColor: "{colors.white}"
    textColor: "{colors.black}"
    rounded: "{rounded.photo-card}"
    padding: "8px 24px"
    height: "48px"
  button-hero-outline:
    backgroundColor: "transparent"
    textColor: "{colors.white}"
    rounded: "{rounded.photo-card}"
    padding: "8px 24px"
    height: "48px"
  search-input:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.square}"
    padding: "8px 12px 8px 40px"
    height: "44px"
  desktop-navigation:
    backgroundColor: "{colors.header}"
    textColor: "{colors.inverse-foreground}"
    typography: "{typography.navigation}"
  size-option:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.control}"
    padding: "8px 12px"
  product-card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.photo-card}"
  color-option:
    rounded: "{rounded.circle}"
    size: "48px"
---

# Design System: Savage Rise / FAZA

## Overview

**Creative North Star: "L’éditorial de mode Savage Rise"**

L’éditorial de mode Savage Rise associe le contraste des titres de couture à la présence directe du streetwear. Les photographies des pièces publiées dominent ; l’ivoire, l’encre et les traits fins construisent un cadre calme. L’or sert de repère pour la marque, les états et les petits intitulés approuvés.

La densité reste commerciale : découvrir, comparer puis sélectionner une couleur et une taille. Les commandes sont sobres, les prix distincts et les images généreuses. Ce document décrit les valeurs par défaut des templates livrés ; les choix de typographie et de grille publiés dans Studio conservent leur priorité. Savage Rise, FAZA et les médias existants restent les références de marque.

**Key Characteristics:**

- Titres à fort contraste en Bodoni Moda, texte fonctionnel en Inter.
- Ivoire chaud, encre et anthracite, avec un or mesuré.
- Photographies réelles, cadres presque droits et séparateurs fins.
- Sélection explicite, contrôles tactiles et composition verticale sur mobile.

Source normative : `app/storefront.css` après `app/globals.css`, composants existants et police chargée dans `app/layout.tsx`. `app/studio.css` porte les sélecteurs de personnalisation Studio. Les règles ci-dessous décrivent le système réutilisé, sans transformer les données de démonstration en contenu commercial.

## Colors

La palette est chaude et peu saturée ; l’ivoire met les photos en avant, l’encre rend l’achat lisible et l’or ponctue la lecture.

### Primary

- **Or de lecture** (`accent`) : liens et états sur fond clair, légendes, contours de sélection et focus global.
- **Or de marque** (`gold`) : identité et intitulé du Hero ; il reste distinct de l’or de lecture plus sombre.
- **Or sur anthracite** (`header-accent`, `dark-accent`) : variante claire pour le header et le thème sombre.

### Neutral

- **Ivoire papier** (`background`) et **ivoire de carte** (`card`) : fond et surfaces commerciales.
- **Encre de texte** (`foreground`) et **encre d’action** (`primary`) : contenu et commandes pleines.
- **Ivoire d’action** (`primary-foreground`) : texte des commandes pleines claires.
- **Pierre discrète** (`muted`, `muted-foreground`, `border`) : support média, texte secondaire et séparateurs.
- **Anthracite de navigation** (`header`) : bande de marque fixe ; `inverse-foreground` et `header-border` portent ses textes et lignes.
- **Ivoire photographique** (`photo-foreground`) : descriptions et commandes sur image ; blanc et noir francs restent les couleurs des CTA du Hero.
- **Tons sombres** (`dark-background`, `dark-card`, `dark-border`, `dark-muted-foreground`) : valeurs réellement définies pour le thème sombre. Son texte principal utilise `inverse-foreground`.

Les indicateurs de disponibilité conservent leurs couleurs sémantiques existantes. Une pastille produit représente la couleur publiée du vêtement ; elle n’est pas une couleur de marque.

**The Measured Gold Rule.** L’or signale les petits intitulés, liens actifs, contours de sélection et repères de marque. Les grandes surfaces restent ivoire ou sombres.

## Typography

**Display Font:** Bodoni Moda, chargé par Next Font sous la variable historique `--font-playfair`. Le nom de cette variable ne désigne pas Playfair Display.

**Body Font:** Inter, chargé sous `--font-inter`.

**Character:** Empattements à fort contraste pour l’expression de mode ; sans empattements discret pour les décisions et les explications. Le Hero emploie l’italique, les titres de section et les noms de produits restent droits.

### Hierarchy

- **Display** : titre du Hero, échelle fluide du frontmatter ; la variante mobile utilise `clamp(2.9rem,13vw,4rem)`.
- **Headline** : titres de sections ; ils passent à (32px) sous le seuil mobile.
- **Detail title** : nom de la pièce sur la fiche ; variante mobile (32px).
- **Title / Price** : noms en capitales et prix des cartes, avec chiffres tabulaires pour les prix. Sur mobile : nom (14px), prix (17px). Le prix de fiche utilise (2.5rem), puis (32px) sur mobile.
- **Body / Description** : Inter pour contenu, filtres et instructions. La description produit est italique ; celle du Hero est limitée à (44ch), en (15px), puis (14px) sur mobile.
- **Label / Navigation** : capitales espacées pour les petits intitulés approuvés et la navigation. Les libellés couleur/taille emploient (12px), poids (600), espacement (.17em).
- **Purchase label** : Bodoni Moda en capitales sur la fiche ; sur mobile, taille (12px) et espacement (.1em).

La hiérarchie est composée par rôle ; aucune progression mathématique unique n’est imposée. Les titres et noms longs peuvent revenir à la ligne et acceptent les textes publiés en plusieurs écritures.

**The Two Voices Rule.** Bodoni Moda porte titres, noms de produits, prix et libellés d’achat de la fiche ; Inter porte navigation, descriptions et contrôles courants. Les choix typographiques publiés dans Studio restent prioritaires.

## Layout

Le contenu courant est centré, avec une largeur maximale de (1224px) et des marges latérales de (24px). La fiche atteint (1280px). Sous (768px), les deux conteneurs gardent (16px) de marge de chaque côté. L’annonce et la navigation fixes occupent ensemble (92px) ; les débuts de page et le défilement réservent cette hauteur.

La grille par défaut de l’accueil présente quatre produits ; le catalogue en présente trois. Sous (1024px), ces grilles utilisent trois colonnes, puis deux sous (768px). L’espacement produit passe de (16px) à (10px). Les réglages Studio petit/moyen/grand remplacent ces nombres : conserver leurs sélecteurs et leur adaptation à (1023px) et (640px).

Le catalogue dispose d’une colonne de filtres de (12rem) sur grand écran, séparée des produits par (28px). Sous (1024px), les filtres passent dans un panneau inférieur à hauteur maximale de (85dvh). La recherche et le tri s’empilent aux petites largeurs.

La fiche est composée de deux colonnes ; la galerie contient un rail de miniatures de (80px) et un écart de (16px). Sous (1024px), les miniatures deviennent horizontales ; sous (768px), la fiche devient une colonne. La photo principale passe d’un cadre (2:3) recadré à un cadre mobile (4:5) en `contain`, afin de garder la pièce entière visible.

Les cartes utilisent un cadre photo horizontal (1.55) sur l’accueil desktop et (3:4) dans le catalogue et sur mobile. Leurs actions s’organisent en une action principale et deux commandes ; sous (1024px), ou si la carte est plus étroite que (260px), l’action principale occupe une ligne entière. Les commandes de carte, de taille et de quantité gardent une hauteur minimale de (44px) ; les boutons d’achat atteignent au moins (48px).

Les catégories sont trois cadres panoramiques sur desktop. Sur mobile, elles forment une piste horizontale avec accroche au défilement, chaque carte prenant (78%) de la largeur disponible. Les compositions précises de l’accueil restent consignées dans `.impeccable/surfaces/storefront.md`.

## Elevation & Depth

Le système principal est plat : différence de ton, bordures fines et photographie créent la profondeur. Les dégradés sur image protègent le texte ; ils ne sont pas des fonds décoratifs autonomes. Les menus superposés conservent leur ombre et leur flou existants. La pastille de carte possède une petite ombre (`0 1px 2px rgb(0 0 0 / .1)`).

Le Hero applique un voile horizontal sur desktop et vertical sur mobile. Les changements de couleur et de bordure restent courts ; les photos de carte utilisent une transition de (300ms), et les catégories une transformation de (500ms). Les cartes peuvent présenter une image principale par couleur toutes les (2000ms), sans sélectionner de variante d’achat. La galerie de fiche reste manuelle. La réduction du mouvement supprime les transitions et animations du Hero, des cartes produit et des catégories.

**The Photograph First Rule.** Les cartes produit restent plates au repos. La séparation vient du ton de surface et du trait ; les ombres restent locales aux pastilles et aux éléments superposés.

## Shapes

Les cadres sont rectilignes, avec un très léger adoucissement pour cartes et CTA photographiques. Les champs et CTA du catalogue sont carrés. Les sélecteurs de taille, commandes d’achat et quantité gardent un petit arrondi de contrôle ; les miniatures emploient un arrondi plus fin.

Les pastilles de couleur et commandes flottantes de galerie sont circulaires. Les séparateurs sont des lignes d’un pixel. La forme circulaire indique une couleur, un statut compact ou une commande superposée ; elle ne remplace pas le cadre photographique.

## Components

### Buttons

Commandes sobres et contrastées. L’achat principal utilise l’encre et l’ivoire d’action ; l’achat immédiat est transparent, bordé d’or, puis plein au survol. Les deux peuvent revenir à la ligne. Le Hero présente un CTA clair et un CTA transparent bordé de blanc ; leur hauteur reste identique.

Les boutons communs conservent les états du composant `Button` : changement de couleur, anneau de focus et réduction d’opacité lorsqu’ils sont désactivés. Le focus global utilise un contour d’accent (2px), décalé de (4px), sauf traitement de focus plus spécifique du composant.

### Chips

Les tailles sont des boutons à bordure, avec une hauteur minimale de (44px). La sélection inverse le fond et le texte. Une taille indisponible est désactivée et barrée ; la présentation ne change jamais sa disponibilité.

Les pastilles de couleur exposent leur nom accessible et un état pressé. Sur fiche, un contour d’or (2px) décalé de (4px) marque la sélection. Sur carte, les pastilles servent à l’aperçu : le disque est de (21px), dans une cible de (32px) sur desktop et (44px) sur mobile.

### Cards / Containers

La carte produit utilise une surface ivoire, une bordure fine et un cadre photographique presque droit. Son contour se teinte d’accent au survol ; elle n’est pas soulevée. Les informations disposent de (12px) de retrait, puis (10px) sur mobile. Les actions s’alignent en bas, même si le titre ou les couleurs occupent plusieurs lignes.

Le nom, le prix publié, les couleurs disponibles et les états réels constituent la carte. Les vignettes du sidecar emploient un emplacement média explicitement neutre : aucun produit, prix ou média commercial n’y est fabriqué.

### Inputs / Fields

Recherche et filtres utilisent un fond de carte, une bordure neutre et des coins carrés. Les champs du catalogue font (44px) de haut. La recherche réserve (40px) à gauche à son icône. Les contrôles gardent leurs noms accessibles, leur anneau de focus et leurs états désactivés.

### Navigation

Le header anthracite reste fixe et compact, avec l’annonce au-dessus de la ligne principale. La navigation desktop est en petites capitales Inter ; l’accent signale le lien actif et le survol. Les menus utilisent les items et visibilités publiés.

Sous (1024px), un bouton Menu ouvre une surface plein écran défilante, avec fermeture, focus contenu dans le dialogue et retour au déclencheur. Les sous-niveaux restent des branches développables. Les actions de compte et panier conservent leurs comportements existants.

### Product gallery

La grande image est accompagnée de miniatures manuelles liées à la couleur. La miniature active reçoit un contour d’accent ; le zoom ouvre le média dans un dialogue avec navigation précédente/suivante. La taille ne change pas la galerie. Les commandes flottantes circulaires restent lisibles sur la photo.

## Do's and Don'ts

### Do:

- **Do** conserver les logos Savage Rise, FAZA et les photographies provenant des chemins YOVO existants.
- **Do** préserver les petits intitulés approuvés, dont « Accès rapide », et leur hiérarchie discrète.
- **Do** appliquer les variables sémantiques et les styles de composant existants avant d’ajouter une nouvelle valeur.
- **Do** conserver la priorité des réglages Studio de typographie et de grille.
- **Do** garder une sélection de couleur visible, des tailles indisponibles désactivées et un focus clavier perceptible.
- **Do** adapter les actions étroites en lignes distinctes et respecter la préférence de mouvement réduit.

### Don't:

- **Don't** remplacer un média, un prix, un stock ou un contenu publié par une valeur illustrative issue des maquettes.
- **Don't** transformer les pastilles de couleur, la galerie ou les changements d’image en sélection d’achat implicite.
- **Don't** étendre les grands arrondis d’anciens modules conditionnels aux cartes et contrôles principaux.
- **Don't** traiter les contenus de repli FAZA ou lookbook comme des sections CMS éditables sans contrat correspondant.

