# Savage Rise

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Clients de la boutique de vêtements Savage Rise. Le parcours mobile est prioritaire : découvrir les collections, choisir une combinaison couleur/taille, commander et suivre sa commande. Le brief confirme le contexte tunisien ; la segmentation démographique et une stratégie internationale ne sont pas établies.

## Product Purpose

Présenter une boutique streetwear premium, avec les collections et le récit FAZA, et permettre un achat fiable à partir des données commerciales réelles. Le succès associe découverte du catalogue, choix compréhensible des variantes et conservation intégrale des parcours d'achat existants.

## Positioning

Streetwear premium de niveau international. Savage Rise et FAZA sont des engagements de marque confirmés par le brief du 23 novembre 2026. Les maquettes fournies fixent la direction de la refonte des templates, sans rendre leurs produits, prix ou médias illustratifs autoritaires.

## Operating Context

- YOVO Studio fournit sections, textes, médias, menus, configuration, publication et prévisualisation.
- YOVO Core fournit catégories et sous-catégories, produits, variantes, prix, disponibilités, stock et commandes.
- YOVO Media fournit les médias. Le Store Next.js existant reste leur frontend.
- Limite observée du contrat actuel : le Hero, la typographie, les grilles, les menus et la visibilité des pages sont configurables dans Studio. FAZA, le lookbook et certaines réassurances passent encore par `lib/storefront/content-fallbacks.ts` ; leur administration CMS n'est pas exposée par le manifeste reçu. Ne pas présenter ces anciens replis comme des sections CMS éditables.
- Le code permet le panier, l'achat immédiat, le checkout invité ou connecté, le paiement à la livraison et les fonctions de compte. Les fonctions optionnelles restent soumises à la configuration de la boutique.

## Capabilities and Constraints

- Aucune modification des microservices, contrats API, MongoDB ou règles de stock, commande et paiement.
- Les contenus commerciaux restent dynamiques ; aucune catégorie, fiche, image ou valeur de prix ne doit être inventée pour reproduire une maquette.
- Une variante indisponible ou un produit non publié ne devient pas achetable pour des raisons visuelles.
- La galerie produit est manuelle, attachée à la couleur et indépendante de la taille. Les cartes peuvent faire défiler une image principale par couleur toutes les deux secondes sans modifier la sélection d'achat.
- Le Hero alterne son image configurée pendant deux secondes et sa vidéo complète. FAZA lit sa vidéo en boucle. Aucun bouton Pause demandé ; prévoir repli sur image et respect des préférences de mouvement.
- Les montants, conditions de livraison, retours et promesses commerciales restent ceux des sources existantes. La newsletter de la version examinée n'est pas connectée à un service d'inscription.
- Travail local sur main ; aucun commit, push, déploiement ou changement de données de production autorisé dans cette mission.

## Brand Commitments

L'introduction historique à deux portes, poignées dorées et mot-symbole Savage Rise est un élément essentiel de l'identité. La conserver et la moderniser sans la retirer lors d'une refonte. Elle apparaît une fois par session ; le cycle du Hero ne commence qu'après sa disparition complète.

Préserver Savage Rise, FAZA, les logos et les contenus YOVO. La présentation suit les deux maquettes validées par le client. Les valeurs commerciales visibles dans ces images sont illustratives et ne remplacent pas le catalogue.

## Evidence on Hand

Brief client et deux maquettes fournis le 23 novembre 2026. Code et tests existants dans `app/`, `components/`, `lib/`, `tests/`. Sources de configuration et contrats : `lib/studio-contract.ts`, `lib/store-contract.ts`, `lib/api/`. Aucun témoignage, chiffre de vente ou nouvelle promesse commerciale à inventer.

## Product Principles

1. YOVO reste la source de vérité.
2. La présentation rend l'achat plus clair sans changer les règles métier.
3. Le mobile reçoit la même couverture fonctionnelle que le desktop.
4. Prix, disponibilité et sélection doivent rester cohérents du catalogue au checkout.
5. Les tests de publication et de catalogue utilisent des données locales isolées.

## Accessibility & Inclusion

Préserver l'accès clavier et les noms accessibles, rendre les cibles tactiles utilisables, respecter la réduction des animations et vérifier les contrastes. Valider les largeurs 320, 375, 390, 768, 1024 et 1440 px. La langue principale et les marchés supplémentaires restent des décisions ouvertes ; conserver les textes publiés.
