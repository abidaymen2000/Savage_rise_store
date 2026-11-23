# Storefront templates

Targets: app/page.tsx, app/products/page.tsx, app/products/[id]/ProductDetailClient.tsx, app/categories/[name]/page.tsx

Modes: home Persuade; catalog and product selection Operate.

## Direction contract

THESIS: Une boutique streetwear premium dont les photographies et les pièces publiées constituent le premier plan. Les templates existants restent connectés à YOVO.

OWN-WORLD: Ivoire clair, encre noire, anthracite et or mesuré ; titres de mode à empattements, texte fonctionnel sans empattements ; cartes photographiques et règles fines selon les maquettes validées.

STORY: Découvrir une collection, entrer dans une catégorie réelle, examiner couleurs et tailles, ajouter au panier ou acheter via le parcours existant.

FIRST VIEWPORT: Sur desktop, annonce et navigation noire compactes ; Hero photographique horizontal et texte aligné à gauche ; catégories panoramiques et grille de quatre produits. Sur fiche, rail de miniatures et grande photographie à gauche, informations et sélection à droite. Sur mobile, hiérarchie verticale, galerie manuelle, contrôles tactiles et filtres en panneau.

FORM: seed: none (pinned). « Implémenter le design de la première maquette validée » et « Implémenter la deuxième maquette validée ». Le brief et les images sont fournis directement par l'utilisateur. Les contenus et médias proviennent de YOVO, et non des pixels ou prix des maquettes.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Implementation constraints

Les maquettes sont la référence de composition. Aucun raster commercial n'est généré ou copié depuis la maquette : les photographies doivent provenir des données CMS/ERP. Les captures de recette utilisent une source locale distincte, explicitement identifiée. Les contenus, menus, masquages, brouillons et événements de preview demeurent actifs.
