# Savage Rise — Black et performances

Date : 24 novembre 2026, Europe/Paris. Travaux sur `main`, sans commit, push, déploiement ni écriture en production.

## État de la recette

**NON VALIDÉ — avec les seuls problèmes réellement ouverts.**

Les correctifs Black, catalogue, marge mobile et les parcours fonctionnels autorisés sont validés localement. Le critère global « Store public rapide et corrigé » n'est pas encore démontré : les nouvelles sources ne sont pas déployées, le runtime local de production est interdit et les cibles mobiles doivent être mesurées sur le nouveau build public. Le cycle réel de sauvegarde/publication Studio reste également à vérifier dans un tenant de recette autorisé. Aucun de ces contrôles n'est remplacé par un PASS de fixture.

`PASS` : exécuté et réussi. `FAIL` : défaut reproduit. `BLOCKED` : accès interdit. `NOT TESTED` : vérification non exécutée.

## Black : cause démontrée

Le dernier déploiement Production déclaré réussi par Vercel/GitHub, le 24 novembre à 00:05 heure de Paris, porte le SHA `0cb61581ad7b4fd61a1bed048b38c802e341c006`. Il correspond à l'état initial du Store. Déploiement GitHub `8013476639`, URL Vercel `https://savage-rise-store-n0zo5bk48-abidaymen2000s-projects.vercel.app`, métadonnées revérifiées dans `evidence/vercel-deployment.json`. La protection SSO de cette URL n'a pas été contournée ; les mesures ont utilisé le domaine public. L'association effective du domaine à ce binaire n'a pas été certifiée par une API Vercel authentifiée : le SHA est celui du dernier déploiement Production déclaré, pas une empreinte extraite du HTML public.

L'API publique Gateway → Core renvoie le même produit par ID et par slug : `6b032d527b49ec9b6c39ec4d`, couleur `6a544d1081bf79b294333ca4`, code `black`, libellé `Black`. Les cinq tailles XS/S/M/L/XL ont un prix de 89,900 DT et conservent leurs SKU historiques `SR-9EC4D-DARK-BLACK-*`. Les photos noires sont celles des variantes Core. Aucune migration ni modification de SKU n'a été réalisée.

Sur le Store public, Shop → OMBRA affiche encore « Dark Black », tandis qu'un rafraîchissement affiche « Black ». Le corps RSC reçu contient déjà l'ancienne couleur : l'hydratation ne l'invente pas.

Le rejeu GET de la même navigation confirme :

| Requête publique | Couleur reçue | Durée |
|---|---|---:|
| Même requête RSC avec arbre de navigation | Dark Black | 458 ms |
| Clé `_rsc` différente, même arbre | Dark Black | 263 ms |
| Même requête sans arbre de navigation | Black | 9 187 ms |

Les réponses portent `x-vercel-cache: MISS`, `age: 0` et des directives HTTP sans cache. Le défaut se trouve dans le Data Cache Next utilisé par les GET du SDK pendant un rendu RSC partiel. Le vrai moteur `patchFetch` de Next 14.2.16 reproduit ce comportement dans le test : après changement de la source, `force-dynamic` seul conserve l'ancienne valeur ; `default-no-store` relit Black. La politique existait sur Shop, mais manquait sur la fiche produit.

Le correctif ajoute cette politique à la fiche produit. Le résolveur canonique existant est conservé, sans alias OMBRA ni remplacement de texte. L'ancien libellé inconnu déclenchait le swatch de secours calculé à partir du nom ; le libellé canonique Black utilise la pastille noire existante.

Preuves : `evidence/public/slug.json`, `id.json`, `black-cache-replay.json`, `same.rsc.txt`, `no-tree.rsc.txt`, `evidence/public-browser/measurements.json`, `tests/catalog-next-cache.test.mjs`.

L'accès MongoDB direct est **BLOCKED** : l'organisation Atlas a désactivé l'accès MCP des clients IA. Aucun autre accès direct à la base n'a été tenté. La concordance Core est vérifiée par les API publiques ; les durées internes viennent des journaux applicatifs Heroku en lecture seule.

## Lenteur : mesures et corrections

Le catalogue faisait une requête de liste, puis une requête complète par produit. Le layout et la page relisaient les mêmes catégories. Le Hero attendait également toutes les données du catalogue. Sur la fiche, la recherche de packs démarrait après le produit.

Les journaux de production permettent d'aller au-delà d'une hypothèse sur MongoDB : une lecture des huit catégories prenait environ 6,3 s avec 20 opérations `find`. Après les contrôles de tenant, chaque catégorie relisait les mêmes réglages Store et Company pour son SEO, soit huit paires de lectures. Le correctif Core réutilise une seule lecture des réglages dans cette réponse. Les contrôles de tenant, d'autorisation et de publication restent exécutés.

Core proposait déjà `include=variant_summary`. Le contrat public omettait cependant les catégories secondaires, les SKU et les métadonnées nécessaires à la sélection identique des variantes. L'extension additive les expose à partir des données existantes, sans nouvelle requête. Le Store utilise ce résumé complet pour ses cartes ; une API plus ancienne garde le chemin complet. Un résumé incohérent est refusé, sans produire de prix ou de catalogue partiel fictif. Les fiches et le checkout conservent leurs lectures complètes.

Autres changements : catégories mémorisées uniquement pendant un rendu serveur React, lectures produit/packs parallèles, Hero séparé du chargement de la collection, suppression du chargement de l'ancien countdown quand Studio fournit déjà le Hero, retrait de la priorité réseau des cartes sous le Hero. Aucun cache persistant de stock ou de publication n'est ajouté.

Une seconde mesure mobile a identifié un déplacement de 92 px à la sortie de l'accueil. Le PerformanceObserver désigne le `<body>` : la marge du Hero traversait ses parents, puis cessait de le faire pendant le verrouillage du menu et lors du changement de page. `flow-root` sur le `<main>` de l'accueil contient cette marge sans changer le dessin. La contre-épreuve du même trajet donne un CLS de **0 au lieu de 0,1090**. Les sources des LayoutShift et leurs rectangles avant/après sont conservés dans `evidence/cls-diagnostic/checks.json` et `evidence/cls-diagnostic-after/checks.json`.

### Médias, navigation et travail JavaScript

Les cartes et menus utilisent déjà `next/link` ; les navigations normales observées chargent du RSC, sans rechargement complet du document. Le prefetch Next existant est conservé : aucun téléchargement anticipé massif de fiches ou de vidéos n'est ajouté. Les chargements de document du protocole sont les visites directes, rafraîchissements et accès à `/on`.

Les 101 réponses image relevées dans le parcours public sont en WebP. Le loader ImageKit existant produit des transformations de largeur, qualité et `f-auto`, avec `srcset` et `sizes`. Les tailles rendues/naturelles, priorités, URLs et volumes sont conservés dans `evidence/image-network-audit.json`. Les images Hero/PDP prioritaires restent prioritaires ; les cartes sous le Hero passent à la stratégie habituelle de chargement. Les fichiers ImageKit, galeries par couleur, poster et film Studio ne sont ni réimportés ni remplacés. Aucun gain AVIF n'est revendiqué : ce format n'a pas été observé sur ce profil.

Les polices, dépendances React, frontières client et animations existantes sont conservées. Le travail mesuré à réduire était principalement la chaîne de données. Le bundle initial de production de l'accueil reste autour de 174 kB, contre environ 173 kB dans le relevé précédent : ce travail ne prétend pas réduire sa taille. Les traces de laboratoire contiennent les longues tâches et latences d'interaction ; elles ne remplacent pas un profil de production après déploiement.

### Comparaison contrôlée des données

Même version Next en développement, mêmes instantanés publics, même fixture locale sans transfert vers la production, même délai de 1 000 ms par requête catalogue, routes précompilées. Médianes de **trois passages par route**. Les temps portent sur la réponse HTML complète, sans téléchargement des médias ni exécution JavaScript. Le gain Core du SEO n'est pas simulé dans ces durées : le délai reste identique avant/après.

| Page | TTFB avant → après | Données complètes avant → après | Appels API avant → après | Lectures produits avant → après | HTML brut avant → après |
|---|---:|---:|---:|---:|---:|
| Accueil | 2 272 → 1 131 ms | 2 337 → 1 168 ms | 12 → 5 | 7 → 2 | 458 350 → 388 859 octets |
| Shop | 1 147 → 1 111 ms | 2 218 → 1 122 ms | 10 → 4 | 6 → 1 | 374 467 → 271 492 octets |
| OMBRA par slug | 1 132 → 1 106 ms | 2 172 → 1 121 ms | 5 → 5 | 2 → 2 | 217 527 → 212 392 octets |
| OMBRA par ID | 1 154 → 1 083 ms | 2 170 → 1 101 ms | 5 → 5 | 2 → 2 | 217 523 → 212 388 octets |

Preuves dans `evidence/` : `before-data.json`, `after-data.json`, `data-comparison.json`. Chaque appel y conserve son chemin, sa durée et son statut. L'accueil/Shop gagnent environ 49–50 % et la fiche 48–49 % dans ce protocole ; ce ne sont pas des gains de production inventés.

### Navigateur et limites de mesure

Chrome desktop 1440 × 1000 sans limitation ; mobile 390 × 844, DPR 2, CPU ×4, réseau 1,6 Mbit/s descendant, 750 kbit/s montant, latence injectée 150 ms. Contextes neufs, puis parcours dans le même contexte pour les visites chaudes. Les écritures externes sont bloquées ; le cache HTTP est conservé via interception CDP. Un passage par profil : données de laboratoire, aucun percentile de terrain.

En production avant correction, accueil mobile : TTFB 1 246 ms, LCP 21 892 ms, CLS 0 ; accueil → Shop : environ 18 629 ms. La plus grande latence d'interaction observée sur ce parcours est de 520 ms, une mesure de laboratoire et non un INP de terrain. Un TTFB rapide peut ne représenter que le début du flux HTML : le contenu utile arrive bien plus tard.

Les mesures navigateur locales utilisent le serveur de développement autorisé. Ses bundles non minifiés, environ 8,7 Mo, rendent les chargements mobiles initiaux beaucoup plus lents qu'en production. La charge de cette machine partagée ajoute du bruit ; un passage n'établit pas un p75. Les cibles LCP ≤ 2,5 s / INP ≤ 200 ms ne seront pas déclarées atteintes à partir de ces observations.

Les [tableaux complets](PERFORMANCE-MEASUREMENTS.md) donnent TTFB, LCP, interaction maximale observée, CLS, durée, appels API, octets JavaScript, images et fenêtre de données produits. La dernière campagne contient **22 étapes réussies sans erreur JavaScript**. Sur mobile, accueil → Shop passe de **14 303 à 9 831 ms** dans ce laboratoire et son CLS de **0,1090 à 0**. OMBRA déjà visitée s'affiche en **87 ms desktop / 868 ms mobile**, sans nouvel appel API. L'interaction maximale mobile de **624 ms** et le LCP initial de développement de **54 604 ms** ne satisfont pas les seuils visés ; ils ne sont pas présentés comme des mesures du nouveau build de production. La durée du parcours inclut l'attente du contrôle cliquable et du contenu hydraté, notamment depuis la 404.

Le runtime `next start` reste **BLOCKED** par le refus antérieur. Aucun autre port, exécuteur ou serveur équivalent n'a été utilisé pour contourner ce refus. Le build de production est vérifié séparément. Aucune commande d'arrêt, redémarrage ou modification de fichiers n'a été adressée au processus externe observé pour 3100 ; les contrôles autorisés utilisent une copie isolée et `next dev` sur 49176. À la clôture, seuls nos processus 9452/8612/14224 sont arrêtés et les ports 49175/49176 sont libérés. L'ancien PID externe 21416 et le listener 3100 ne sont plus présents à l'inventaire final ; la cause de cette disparition n'est pas établie et aucune tentative de redémarrage n'a été faite. Voir `evidence/server-cleanup.json`.

La route `/on` est une **404** dans les sources et sur le site public. Elle n'est ni une route d'entrée ni une destination du menu Studio. Aucun comportement ou contenu ne lui a été inventé. L'introduction reste attachée à la première visite de la session, dans le layout persistant.

## Résultats de validation

| Contrôle | État | Résultat |
|---|---|---|
| API publique Core : identité Black | PASS | ID et slug concordants, cinq tailles, prix et SKU historiques |
| Store public avant correction : Shop → OMBRA | FAIL | Dark Black déjà présent dans la réponse RSC ; nouvelles sources non déployées |
| Unitaires Store | PASS | 204/204 sur le dernier état, 0 échec, 0 ignoré ; 47,1 s |
| Unitaires Core ciblés | PASS | 24/24, projections de liste, contrat HTTP, SEO par lot et fraîcheur entre requêtes |
| TypeScript | PASS | Aucun diagnostic sur la copie finale isolée de production |
| Lint | PASS | Huit avertissements préexistants, aucune nouvelle erreur |
| Build de production | PASS | Dernier état compilé, 27/27 pages générées ; `evidence/build-final.log` |
| Black et responsive | PASS | 5 largeurs × 5 tailles, swatch noir, photos/prix/SKU, navigation et sortie de `/on` |
| Résilience catalogue | PASS | 26 groupes, dont 10 visites stables, pagination, pannes et 6 requêtes simultanées par tenant |
| Commerce et contrat Studio | PASS | 7 groupes ; panier/COD en mémoire locale, aucune commande commerciale |
| Introduction | PASS après recontrôle | 14 groupes distincts ; un dépassement de temps réduit est conservé et détaillé ci-dessous |
| Résilience Hero | PASS | 15/15 sur le dernier code |
| Stockage refusé intégré | PASS | 1/1, navigation/hydratation et session analytique stable, 0 erreur JS |
| Film Studio réel | PASS | 2/2, desktop/mobile, film complet et intervalles image |
| FAZA, cartes et galeries | PASS | 8/8, boucle vidéo, couleurs, galerie manuelle, erreurs média et nettoyage des timers |
| Parcours de mesure finaux | PASS fonctionnel | 22/22, sans erreur JavaScript, sources finales |
| Seuils de performance mobile dans le laboratoire de développement | FAIL | Interaction maximale 624 ms ; LCP initial 54 604 ms ; ce n'est pas une mesure de terrain ni du nouveau runtime de production |
| Revue visuelle Impeccable | PASS manuel | Identité, responsive, lisibilité, transition et secours visuel inspectés ; aucun verdict automatique revendiqué |
| MongoDB direct | BLOCKED | Accès IA désactivé au niveau de l'organisation Atlas |
| Runtime local de production | BLOCKED | Refus `next start` respecté |
| Publication/commande en production | NOT TESTED | Aucune écriture de production effectuée ; seules les opérations locales de recette sont testées |
| p75 mobile après déploiement | NOT TESTED | Aucun déploiement effectué, aucune mesure de terrain disponible |

Les paramètres existants du projet ignorent TypeScript et lint pendant `next build`. Ils n'ont pas été modifiés ; les deux contrôles ont donc été exécutés séparément et réussissent. Le build conserve l'avertissement Browserslist préexistant, sans échec de compilation.

Le lanceur Impeccable était indisponible. La revue a suivi le chemin manuel prévu par [le skill](../../.agents/skills/impeccable/SKILL.md) : « On the first refusal or failure, don’t retry » puis lecture directe de PRODUCT.md et DESIGN.md et poursuite avec les outils permis. Les captures finales desktop/mobile, le mot-symbole, le secours SR et la fiche Black ont été inspectés. Ce PASS porte sur la revue visuelle du périmètre modifié ; il ne représente pas un score automatique ni une certification d'accessibilité globale.

## Introduction, Hero et preuves finales

L'animation historique, son contrôleur indépendant de React, les portes noires, poignées dorées et mot-symbole sont conservés. Les empreintes de ces composants sont identiques à l'état initial. Les 14 groupes couvrent les cinq largeurs, première visite, même session, nouvelle session, rafraîchissement, navigation interne, Échap, passage, mouvement réduit, absence de chunks, absence de JavaScript, stockage d'entrée refusé, aperçu et panne vidéo.

Un premier passage du mode réduit a mesuré **1 017,2 ms** et échoué au seuil de 900 ms. Cette preuve est conservée dans `evidence/entrance-first-attempt.json`. La continuation instrumentée, sur le même code et avec le même seuil, mesure **451,3 ms**, avec deux délais exécutés à 300,3 et 150,7 ms. Les six groupes restants réussissent. La cause précise du dépassement initial n'est pas établie ; aucun changement de temporisation ne l'a masqué. `evidence/browser-checks.json` rassemble les 14 groupes distincts et référence les deux exécutions, sans effacer cet incident de laboratoire.

Les 15 scénarios de résilience passent sur le dernier état : poster retardé desktop/mobile, réseau limité, image indisponible, corrompue ou suspendue, image arrivant pendant le film, poster absent, double panne image/vidéo, vidéo suspendue, Hero statique en panne, passage anticipé, mouvement réduit, sans JavaScript, chunks bloqués. Le secours local demeure visible ; aucun chargement média ne verrouille indéfiniment la navigation. Une vérification intégrée séparée du refus de `sessionStorage` passe : hydratation, navigation, une seule identité analytique en mémoire et aucune erreur JavaScript. Le code de consentement et de télémétrie n'a pas été modifié.

Les enregistrements définitifs utilisent le poster et le film publiés dans Studio, lus réellement sur ImageKit. Le film court local est réservé aux pannes déterministes.

| Mesure du film publié | Mobile 390 px | Desktop 1440 px |
|---|---:|---:|
| Introduction | 3 308,5 ms | 3 320,4 ms |
| Image avant le premier film, après activation | 2 019,2 ms | 2 148,7 ms |
| Film complet | 20,121 s | 20,121 s |
| Image entre fin du film et reprise | 2 013,3 ms | 2 015,0 ms |
| Erreurs JavaScript / débordement horizontal | 0 / aucun | 0 / aucun |

Preuves : `evidence/real-media-checks.json`, `evidence/entrance/restored-1440.webm`, `evidence/entrance/restored-390.webm`. Pour chaque largeur, le même dossier contient `doors`, `opening`, `wordmark`, `reveal`, `home`, `hero-image` et `hero-video` en PNG. Les versions 390/1440 proviennent de cette dernière lecture réelle, pas d'une ancienne vidéo.

Accès direct : [vidéo desktop 1440](C:/Users/ASUS/Desktop/Savage_Rise/Savage_rise_store/artifacts/black-performance/evidence/entrance/restored-1440.webm), [vidéo mobile 390](C:/Users/ASUS/Desktop/Savage_Rise/Savage_rise_store/artifacts/black-performance/evidence/entrance/restored-390.webm), [capture Black desktop](C:/Users/ASUS/Desktop/Savage_Rise/Savage_rise_store/artifacts/black-performance/evidence/black-final/black-1440.png), [capture Black mobile](C:/Users/ASUS/Desktop/Savage_Rise/Savage_rise_store/artifacts/black-performance/evidence/black-final/black-390.png). Le manifeste `evidence/delivery-media.json` conserve tailles et dates des quatorze médias principaux.

L'erreur historique `Invalid or unexpected token` n'est pas reproduite à 768 px ni aux autres largeurs. Son diagnostic antérieur de chunk tronqué et la limitation des chemins Tailwind restent documentés dans `artifacts/entrance-restoration/FINAL-REPORT.md` ; ces fichiers correctifs n'ont pas été modifiés ici.

## Studio, données et limites des intégrations

Les instantanés initiaux proviennent de GET réels via le Gateway public : configuration, Studio publié, visibilité, catalogue, catégories et fiches par ID/slug. Les médias des captures finales sont les images publiques existantes. Les tests de panne et de nouvelles révisions utilisent ensuite une fixture locale qui ne transfère aucune écriture vers la production.

La recette Store vérifie les changements de titre, poster, révision et visibilité publiés, le retour au contenu publié après aperçu privé, l'interdiction d'acheter en aperçu, le rafraîchissement des prix et la mise en rupture manuelle. Le devis et la commande COD de test existent uniquement en mémoire locale. La sauvegarde/publication de bout en bout depuis le vrai éditeur Studio vers un tenant de recette n'a pas été exécutée ; elle n'est pas annoncée PASS. Le dépôt Studio n'est pas modifié.

Les journaux Core attestent aussi des coûts préexistants hors du lot SEO corrigé : environ 1,5 s de lecture des permissions et 3,5–5,1 s pour certaines lectures Studio. Les durées Mongo enregistrées incluent les attentes du client et du réseau ; elles ne constituent pas un `explain` ni une preuve d'index manquant. Aucun changement de permission, de tenant, d'index ou d'infrastructure n'a été improvisé. Leurs durées résiduelles après déploiement restent à mesurer.

## Fichiers modifiés et préservation

Store initial : `0cb61581ad7b4fd61a1bed048b38c802e341c006`. Core initial : `04fddcf6fca499e182c73b903f5bb99b108abfe7`. Les deux dépôts étaient propres et restent sur `main`, sans commit, push ni déploiement.

Sur les **1 084 fichiers frontend** de la copie finale, **1 076 sont inchangés**, six fichiers applicatifs sont modifiés et deux sont ajoutés. La copie de test, la copie de build et les sources concordent dans `evidence/source-consistency.json`. Les fiches clientes, variantes, galeries, animation, analytics et règles de checkout des travaux précédents sont conservées. Aucun autre serveur Next n'a été utilisé pour les contrôles.

| Dépôt Store : fichier | Rôle du changement |
|---|---|
| `app/products/[id]/page.tsx` | Lecture fraîche en RSC ; produit et packs parallèles |
| `app/page.tsx` | Hero séparé du catalogue ; skeleton ; marge confinée ; appels éditoriaux inutiles supprimés |
| `app/layout.tsx` | Catégories partagées pendant le rendu |
| `app/products/page.tsx` | Projection de cartes et catégories partagées |
| `app/components/FeaturedProducts.tsx` | Priorité réseau retirée des cartes sous le Hero |
| `lib/storefront/catalog-server.ts` | Nouveau mémo React limité au rendu serveur |
| `lib/catalog-card-detail.ts` | Nouveau adaptateur de projection compacte avec validation et compatibilité ancien Core |
| `lib/api/catalog-api.ts` | Lecture de cartes sans N+1 quand le contrat est complet |
| `tests/catalog-card-performance.test.mjs` | Nouveau contrat, couleurs/SKU/prix, disponibilité et erreurs |
| `tests/catalog-next-cache.test.mjs` | Contre-épreuve du cache Next réel et protection PDP |
| `tests/e2e/catalog-resilience-server.mjs` | Projection compacte de recette et mesure des appels |
| `scripts/measure-store-data.mjs` | Mesure de trois passages HTML/API par route |
| `scripts/measure-store-performance.mjs` | Parcours navigateur public/local, froid/chaud, mobile/desktop |
| `scripts/verify-black-performance.mjs` | Black et cinq tailles sur cinq largeurs |
| `artifacts/black-performance/FINAL-REPORT.md` | Présent rapport |
| `artifacts/black-performance/PERFORMANCE-MEASUREMENTS.md` | Tableaux de mesures détaillés |
| `artifacts/black-performance/MANUAL-DEPLOYMENT.md` | Commandes CMD et contrôles après déploiement |

| Dépôt Core : fichier | Rôle du changement |
|---|---|
| `app/schemas/catalog/product.py` | Champs additifs de la projection de liste |
| `app/services/catalog/product_service.py` | Projection des champs déjà lus, sans requête supplémentaire |
| `app/services/catalog/category_service.py` | Résolution SEO par lot pour les catégories publiques |
| `app/services/cms/seo_service.py` | Une lecture des réglages par réponse, sans cache entre requêtes |
| `tests/unit/catalog/test_product_listing_summary.py` | Contrat HTTP et conservation des valeurs canoniques |
| `tests/unit/catalog/test_category_seo_batch.py` | Une lecture pour huit catégories ; fraîcheur entre tenants/requêtes |

Les fichiers lourds de preuve sont locaux dans `evidence/`, exclus uniquement via `.git/info/exclude`. Les copies et adaptations des harnais résident dans `.tmp/qa/black-*.mjs`. Aucun `reset --hard`, `clean`, restauration globale, migration, accès direct alternatif à Atlas ou lancement de `next start` n'a été effectué.

## Reproduction et déploiement manuel

Les commandes Windows CMD et le plan complet de contrôle sur `savagerise.com` figurent dans [MANUAL-DEPLOYMENT.md](MANUAL-DEPLOYMENT.md). Core doit être déployé avant le Store pour activer immédiatement le nouveau chemin compact. Reconstruire les sources avec la configuration de production habituelle ; ne pas utiliser le build de recette comme paquet de déploiement.

Les preuves Black et responsive sont `evidence/black-final/black-320.png`, `black-375.png`, `black-390.png`, `black-768.png`, `black-1440.png`, avec les tailles, SKU, prix et URLs de photos dans `evidence/black-final/checks.json`.

## Seuls points encore ouverts

1. **Résultat sur le Store public et objectifs mobiles** — NOT TESTED pour les nouvelles sources. Il faut déployer manuellement Core/Store, confirmer le SHA associé au domaine et reprendre les mesures. Les gains de requêtes et de données sont démontrés en laboratoire ; ils ne prouvent ni LCP mobile p75 ≤ 2,5 s, ni INP ≤ 200 ms en production. Le dépassement d'interaction mesuré dans le laboratoire de développement ne reçoit pas de PASS de performance.
2. **Sauvegarde/publication Studio réelle de bout en bout** — NOT TESTED. Le contrat Store, l'aperçu et les changements de révision passent localement, mais aucun contenu de production n'a été modifié pour simuler ce contrôle.
3. **Contrôles interdits** — BLOCKED pour `next start` et pour l'accès MCP direct Atlas. Les alternatives explicitement autorisées ont été utilisées : build sans démarrage, navigateur sur `next dev`, GET publics et journaux applicatifs en lecture seule. Aucun contournement n'a été tenté.

Aucune régression fonctionnelle persistante n'est reproduite dans les parcours locaux validés. L'incident de temporisation réduit, la première mesure `/on` invalide et le redémarrage de développement pendant une copie initiale sont conservés comme incidents de recette ; ils ne sont ni dissimulés ni présentés comme des erreurs applicatives dont la cause aurait été prouvée. L'essai TypeScript initial sur le dossier généré du serveur actif avait rencontré des types supprimés pendant ce redémarrage ; le contrôle final utilise la copie indépendante et réussit.
