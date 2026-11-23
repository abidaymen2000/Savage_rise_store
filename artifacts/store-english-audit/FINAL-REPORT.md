# Savage Rise Store — rapport final de l’audit anglais

**VALIDÉ — prêt pour déploiement manuel du code frontend.** Aucun commit, push, déploiement ni changement en production n’a été effectué.

Recette du 23 novembre 2026, branche **main**, commit de départ et HEAD conservé : `05c964a757dffe30992c0d0455031ce39a756ed6`. Le périmètre est la copie statique anglaise, les défauts confirmés et leur non-régression. Les textes dynamiques ne sont pas traduits : le Store conserve donc volontairement certains passages français publiés par Studio/Core.

## Problèmes confirmés et corrections

| Constat | Correction / résultat |
|---|---|
| Textes statiques français et vocabulaire incohérent | Harmonisation des CTA, filtres, galerie, panier, checkout, compte, erreurs, preview, statuts, navigation, footer et contenus statiques. Journal complet dans [COPY-CHANGES.md](COPY-CHANGES.md). |
| Description de newsletter presque invisible | Contraste passé de **1,18:1** à **13,29:1** en clair et **15,68:1** en sombre. Le petit libellé passe aussi AA. Polices, grille et palette globale conservées. |
| Formulaire de newsletter sans service d’inscription | Champ, bouton et fausse soumission retirés. Titre et textes demandés, dont le message d’attente, appliqués à la source statique existante. Aucun service inventé. |
| Modification des libellés ERP par le frontend | Suppression du remplacement des underscores et du nettoyage des espaces dans les valeurs d’affichage. Les identifiants/codes utilisés pour sélectionner les variantes sont inchangés. |
| Grammaire de Chapters | « When we publish a new chapter… » et description statique anglaise. Les contenus de chapitre et médias dynamiques restent inchangés. |
| Badge « 100% FAIT MAIN » injecté hors CMS | Badge retiré du renderer. Les chiffres réellement publiés dans About sont conservés. |
| Langue racine et textes SEO statiques | `lang="en"`, fallbacks de métadonnées anglais. Routes et stratégie de métadonnées existantes conservées. |
| OMBRA supposé absent de la boutique | **Non reproductible** lors du diagnostic public : cinq produits éligibles et les mêmes cinq dans le DOM, sans doublon. Aucune nouvelle modification de pagination, publication ou filtrage. |

## OMBRA, Hoodies et données YOVO

La lecture publique a utilisé le tenant `savagerise.com`. Les trois pages API de taille deux réunissent exactement les cinq identifiants présents dans le DOM de `/products`. Ensemble vide pour les produits manquants, supplémentaires et doublons : [diagnostic](evidence/catalog-diagnosis.json). L’accueil affiche sa sélection éditoriale, un sous-ensemble du catalogue ; cette sélection n’est pas forcée à afficher tous les produits.

OMBRA : `6b032d527b49ec9b6c39ec4d`, slug `sr-ombra-oversized-hoodie`, actif, disponible, non forcé en rupture. Hoodies : `6b0327e27b49ec9b6c39eaf3`, enfant actif de Clothing, image ERP et lien `/products?category=hoodies` conservés. Recherche OMBRA, filtre Hoodies, filtre parent Pants/produit Baggy, tri et compteur ont été exercés dans le navigateur.

Les valeurs demandées **Brown, Red, Pink, Green, White, Dark Black** passent les tests de conservation, sans toucher aux codes techniques. Le snapshot public actuel utilise pour OMBRA **red, Brown, Pink, Green, White, Black** : ces valeurs réelles, y compris leur casse, sont conservées dans les chaînes et noms accessibles du DOM aux cinq largeurs. La typographie du template reste en place. Prix, noms, descriptions, tailles, SKU, disponibilités et médias n’ont reçu aucun dictionnaire de traduction.

La preview privée, l’interdiction d’achat en preview, les révisions et masquages Studio, le changement d’un prix ERP et la rupture forcée passent les contrôles sur le serveur local en mémoire. Le contrat et les services YOVO ne sont pas modifiés. Les seules retouches de routes Next de preview portent sur leurs messages d’erreur frontend.

**Contenus à corriger éventuellement dans les outils éditoriaux :** [CMS-REVIEW.md](CMS-REVIEW.md). Hero en français, titre CMS « Accueil », légendes About et descriptions/SEO Core y sont documentés. Les chiffres About 2025, 50+ et 3 proviennent du CMS ; ils ne sont pas présentés comme des faits vérifiés indépendamment.

## Résultats de validation

PASS signifie exécuté et réussi. BLOCKED désigne une vérification interdite. NOT TESTED signifie non exécuté ou sans résultat exploitable. Les échecs intermédiaires ne sont pas comptés comme des réussites.

| Contrôle | Statut | Preuve / portée |
|---|---|---|
| Tests unitaires | **PASS** | **172/172**, zéro échec ; [journal](evidence/unit-tests-final.log). Trois tests ajoutés sur la conservation des labels ERP. |
| TypeScript | **PASS** | `tsc --project .tmp/qa/english-current/tsconfig.json --noEmit --incremental false`, code de sortie 0. |
| Lint | **PASS** | Code de sortie 0, **0 erreur, 8 avertissements préexistants** ; [journal](evidence/lint-final.log). |
| Build de production | **PASS** | `next build .tmp/qa/english-production`, code de sortie 0 ; [journal](evidence/build-production.log). |
| Syntaxe des bundles de production | **PASS** | **64 fichiers JavaScript** analysés statiquement, zéro erreur ; [preuve](evidence/production-chunks.json). Aucun serveur de production lancé. |
| Anglais, responsive, contrastes et états publics | **PASS** | **8 groupes**, 15 combinaisons accueil/catalogue/fiche aux cinq largeurs, puis 19 autres parcours/états à 390 px ; aucun `pageerror` ; [résultats](evidence/english-browser.json). |
| Catalogue, variantes, favoris, panier et checkout | **PASS** | **7 groupes**, commande simulée uniquement dans la fixture locale ; [résultats](evidence/flows/checks.json). |
| Introduction et Hero | **PASS** | **14 groupes**, zéro erreur JavaScript ; [résultats](evidence/entrance/browser-checks.json). |
| Médias et galeries | **PASS** | **8/8**, zéro échec, zéro flaky ; absence d’erreur JavaScript contrôlée dans les huit scénarios ; [résultats](evidence/media-tests.json). |
| Revue visuelle frontend-design / Impeccable | **PASS** | Revue de finition manuelle bornée au périmètre ; [verdict et limites](IMPECCABLE-REVIEW.md). |
| Détecteur automatique Impeccable | **NOT TESTED** | Lanceur resté sans réponse, tentative arrêtée ; aucun résultat inventé. |
| Exécution de production avec `next start` | **BLOCKED** | Refus antérieur « blocked by policy » respecté. Aucune nouvelle tentative, commande équivalente ou autre port utilisé pour le contourner. |
| Déploiement, vraies commandes, emails et achats de production | **NOT TESTED** | Hors autorisation ; aucune écriture distante de recette. |
| Safari/iOS et Android physiques | **NOT TESTED** | Recette effectuée avec Chrome/Chromium et dimensions contrôlées. |

TypeScript, lint et build ont été exécutés sur des copies isolées dont **1 077 fichiers** correspondent octet pour octet aux sources finales : [preuve](evidence/preservation.json). Cela évite de partager les sorties Next avec les autres serveurs. La configuration existante ignore lint et TypeScript pendant le build ; ces deux contrôles ont donc été exécutés **séparément**, avec succès, sans modifier ce réglage.

Le build de recette utilise les variables publiques de la fixture locale. Sa sortie `.next` ne doit pas être déployée : le déploiement manuel doit reconstruire les sources avec l’environnement habituel du Store. Les autres serveurs Next n’ont pas été arrêtés ni reconfigurés ; seuls les serveurs créés pour cette recette sont arrêtés en fin de travail.

Les huit avertissements lint concernent des dépendances de hooks existantes dans checkout, profil/commandes, avis, contact et studio-hero-action, ainsi qu’un `img` existant dans studio-hero-action. Ils n’ont pas été masqués.

## Animation, vidéos et galerie

Les portes noires, poignées dorées, mot-symbole et ouverture restent en place. Durée observée selon la largeur : **3,30 à 3,54 s**. Le secours local est présent à la révélation. Le Hero conserve l’image pendant au moins deux secondes, lit le film complet, revient à l’image deux secondes, puis recommence. Les contrôles de cycle utilisent un film local de 2,472 s pour vérifier effectivement sa fin ; ils ne prétendent pas avoir relu intégralement chaque vidéo distante de production.

Première visite, même session, nouvelle session, rafraîchissement, navigation interne, entrée directe sur fiche, Échap, mouvement réduit, clé de session inaccessible, chunks manquants, JavaScript désactivé, preview privée et échec vidéo sont couverts. La mécanique d’introduction, son CSS, le contrôleur vidéo et le correctif analytique précédent sont inchangés par cet audit.

FAZA : autoplay muet, inline, boucle réelle observée, sans contrôle Pause. Cartes : une image principale par couleur, rotation de deux secondes, absence de doublon par taille. Fiche : sélection manuelle, conservation de l’image lors du passage M→L, changement de galerie avec la couleur, zoom. Refus d’autoplay, média absent et suppression des timers après navigation sont testés.

Un échec intermédiaire lié au bundle de développement a été analysé, puis la suite complète a été relancée sur des sources stables : [BROWSER-INCIDENT.md](BROWSER-INCIDENT.md). Il n’est pas attribué à l’introduction ou au Hero. Le résultat final est 8/8, avec un contrôle explicite des erreurs JavaScript.

## SEO et limites de portée

Les métadonnées statiques et la langue du document ont été contrôlées ; les titres/descriptions produits gardent leur source ERP et les pages CMS gardent leurs métadonnées/canoniques existantes. Aucune route traduite, canonique ajoutée arbitrairement ou donnée structurée inventée. L’audit n’ajoute pas une nouvelle intégration du bloc Core `resolved_seo` aux templates qui ne le consommaient pas déjà ; la stratégie SEO existante reste inchangée.

Les vérifications couvrent les pages éditoriales, les états visiteurs du compte, le checkout vide, les erreurs de vérification et les pages absentes. Elles ne constituent pas une campagne d’envoi de formulaires réels ni un audit exhaustif de tous les services tiers. Les scénarios de média lent/suspendu de la mission de restauration précédente n’ont pas été tous répétés : le contrôleur et le secours correspondants sont inchangés, et les scénarios médias pertinents ci-dessus ont été rejoués.

## Captures avant / après

Captures commerciales avec médias publics, réalisées dans la recette locale finale :

- [Newsletter avant, 1440 px](evidence/before/newsletter-1440.png) → [après clair](evidence/after/newsletter-1440-light.png), [après sombre](evidence/after/newsletter-1440-dark.png), [après mobile](evidence/after/newsletter-390-light.png).
- [Catalogue avant](evidence/before/catalog-1440.png) → [après 1440 px](evidence/after/catalog-1440.png), [après 390 px](evidence/after/catalog-390.png).
- [Fiche OMBRA, 390 px](evidence/after/product-390.png).

Les images SVG des tests médias sont des fixtures synthétiques et ne sont pas présentées comme photographies commerciales. Aucune nouvelle vidéo de démonstration n’a été produite inutilement. Les anciennes preuves de restauration sont conservées dans leur dossier d’origine.

Les journaux, réponses publiques, traces et captures restent **hors suivi Git** grâce à l’exclusion locale de `artifacts/store-english-audit/evidence/`. Les scripts temporaires et copies de travail restent sous `.tmp/qa/`.

## Fichiers frontend modifiés (50)

- `app/api/preview/route.ts`
- `app/checkout/page.tsx`
- `app/checkout/success/page.tsx`
- `app/components/AuthModal.tsx`
- `app/components/Cart.tsx`
- `app/components/CurtainAnimation.tsx`
- `app/components/EntranceAnimation.tsx`
- `app/components/FeaturedProducts.tsx`
- `app/components/Footer.tsx`
- `app/components/Header.tsx`
- `app/components/Hero.tsx`
- `app/components/Newsletter.tsx`
- `app/components/ThemeToggle.tsx`
- `app/error.tsx`
- `app/layout.tsx`
- `app/packs/[id]/page.tsx`
- `app/packs/page.tsx`
- `app/preview/route.ts`
- `app/products/[id]/ProductDetailClient.tsx`
- `app/products/[id]/error.tsx`
- `app/products/[id]/page.tsx`
- `app/products/error.tsx`
- `app/products/page.tsx`
- `app/products/products-controls.tsx`
- `app/profile/orders/[id]/page.tsx`
- `app/profile/page.tsx`
- `app/vlog/page.tsx`
- `components/store-pages/store-page-renderer.tsx`
- `components/storefront/media/storefront-video.tsx`
- `components/storefront/product-card-actions.tsx`
- `components/storefront/product-card.tsx`
- `components/studio-hero-action.tsx`
- `components/studio-runtime.tsx`
- `contexts/CartContext.tsx`
- `hooks/use-checkout-quote.ts`
- `lib/availability.ts`
- `lib/catalog-option-display.ts`
- `lib/checkout-flow.ts`
- `lib/hero-purchase.ts`
- `lib/order-conflicts.ts`
- `lib/order-status.ts`
- `lib/preview-access.ts`
- `lib/product-color-media.ts`
- `lib/quick-purchase.ts`
- `lib/store-config-shared.ts`
- `lib/store-contract.ts`
- `lib/store-pages/static-pages.ts`
- `lib/storefront/catalog-data.ts`
- `lib/storefront/content-fallbacks.ts`
- `lib/studio-server.ts`

## Tests et scripts de validation modifiés / ajoutés

- `scripts/verify-store-flows.mjs`
- `scripts/verify-store-english.mjs`
- `tests/catalog-label-preservation.test.mjs`
- `tests/availability-p1.test.mjs`
- `tests/catalog-discovery.test.mjs`
- `tests/contract-smoke.mjs`
- `tests/e2e/store-media.spec.mjs`
- `tests/hero-purchase.test.mjs`
- `tests/preview-access.test.mjs`
- `tests/theme.test.mjs`

Rapports ajoutés dans ce dossier : `FINAL-REPORT.md`, `COPY-CHANGES.md`, `CMS-REVIEW.md`, `IMPECCABLE-REVIEW.md`, `BROWSER-INCIDENT.md`.

## État de livraison

Aucun problème fonctionnel non résolu n’a été reproduit sur le dernier passage de recette. Les limites ouvertes sont la traduction éventuelle des contenus publiés depuis Studio/Core, le détecteur automatique indisponible et les environnements non testés explicitement listés. Le code peut être déployé manuellement par le processus habituel ; aucun serveur de production ni artefact de recette locale n’a été déployé.
