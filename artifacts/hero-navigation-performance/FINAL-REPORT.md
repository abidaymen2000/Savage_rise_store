# Hero Shop Now et performance — 24 novembre 2026

**VALIDÉ — prêt pour déploiement manuel.** Validation des corrections locales et de leur recette ; aucun déploiement effectué.

Le problème du Hero venait de `StudioHeroAction` : l'action Studio `buy_product` chargeait le produit et la configuration, puis ouvrait Quick Buy pour choisir les variantes. Elle est maintenant un lien vers la fiche premium à partir de l'ID Studio. Le slug actuel est obtenu par la lecture normale de la fiche, puis inscrit dans l'URL sans nouvelle navigation. Aucun ID/slug OMBRA n'est codé en dur, aucun réglage CMS n'est modifié. Les actions produit, pages et sections restent pilotées par le manifeste Studio. Quick Add des cartes et Buy Now de la fiche sont conservés.

Les principaux coûts mesurés sont dans Core et ses lectures Mongo/Media, avec un chemin de compatibilité coûteux tant que la projection compacte Core n'est pas déployée. Le correctif mutualise les médias produit/variantes, exécute les lectures indépendantes en parallèle et évite l'enrichissement d'une liste vide. Publication, prix, promotions, stock, SKU, options, isolation des tenants et transactions sont conservés. Aucun endpoint, routage Gateway, cache persistant, donnée métier ou migration n'est ajouté.

| Mesure contrôlée Core, mêmes données et 150 ms/lecture | Avant | Après |
|---|---:|---:|
| Temps médian du traitement produit | 1 580 ms | 811 ms (−48,6 %) |
| Lectures d'adaptateurs | 10 | 8 |
| Résolution des assets, fixture avec galerie produit | 2 | 1 |
| Contenu métier renvoyé | référence | strictement identique |

En production actuelle, les médianes TTFB restent de 6,10 s pour OMBRA via Gateway et 6,60 s pour sa page Next.js. **Le gain global après déploiement n'est pas encore mesuré.** Le banc navigateur à API constante ne montre pas de gain frontend uniforme ; les chiffres complets et leurs limites sont dans `PERFORMANCE-MEASUREMENTS.md`.

| Contrôle sur la dernière version | Statut |
|---|---|
| Hero dynamique, changement de produit Studio, aucun Quick Buy ; 320/375/390/768/1440 px | PASS — 10 groupes fonctionnels |
| ID/slug, rafraîchissement, retour/avance, URL canonique, produit épuisé | PASS |
| Quick Add, Buy Now, galerie, variantes, panier, checkout local, preview privée et CMS | PASS — 7 groupes commerce |
| Catalogue complet, erreurs/retards, pagination, concurrence et responsive | PASS — 26 groupes |
| Avant/après navigateur desktop et Instagram simulé | PASS — 48 étapes, zéro erreur JS |
| Tests unitaires Store / Core | PASS — 205 / 42 |
| TypeScript / lint Store | PASS — zéro erreur, 6 avertissements préexistants |
| Build production Store | PASS — 27 pages ; aucun serveur de production lancé |
| Compilation Python Core / cohérence des dépendances | PASS |
| Revue visuelle Impeccable manuelle | PASS — présentation premium, CTA, responsive préservés ; lanceur non relancé après son échec antérieur |
| Introduction, sessions, Échap, passage anticipé, mouvement réduit | PASS — 14 groupes |
| Hero avec la vidéo Studio publiée, desktop/mobile | PASS — 2 groupes ; film complet de 20,121 s, image ≥ 2 s avant/après |
| Médias lents, absents, corrompus, suspendus ; refus de stockage | PASS — 15 scénarios + 1 intégration stockage |
| FAZA, rotation des cartes, galerie manuelle, autoplay et nettoyage des timers | PASS — 8 tests médias |
| `next start` / Atlas direct | BLOCKED — refus antérieurs respectés |
| Production après livraison / Instagram réel / nouvelle release Core | NOT TESTED — aucun déploiement |

Fichiers applicatifs Store modifiés : `components/studio-hero-action.tsx`, `lib/hero-purchase.ts`, `components/product-canonical-location.tsx` (nouveau), `app/products/[id]/page.tsx`. Tests/preuves : `tests/hero-purchase.test.mjs`, `tests/e2e/hero-navigation.mjs`, `scripts/measure-hero-navigation.mjs`, `scripts/probe-store-latency.mjs`, `scripts/measure-store-performance.mjs` (distinction Early Hints / réponse finale) et les rapports de ce dossier.

Nouveaux correctifs Core : `app/services/catalog/product_service.py`, `app/services/catalog/media_service.py`, `tests/unit/catalog/test_storefront_read_plan.py`. Les changements précédents sont conservés dans `app/schemas/catalog/product.py`, `app/services/catalog/category_service.py`, `app/services/cms/seo_service.py`, `tests/unit/catalog/test_product_listing_summary.py`, `tests/unit/catalog/test_category_seo_batch.py`, ainsi que la projection déjà ajoutée dans `product_service.py`.

Les deux dépôts sont sur `main`, sans commit, push ni déploiement. Le code de l'introduction, du cycle Hero, de FAZA, des variantes et de la galerie n'a pas été modifié. Les commandes Windows CMD de livraison figurent dans `MANUAL-DEPLOYMENT.md` ; **Core doit être livré avant Store** pour activer la lecture compacte déjà prévue.

Les vidéos définitives, réalisées avec le code ayant passé le build, sont disponibles : [desktop 1440 px](C:/Users/ASUS/Desktop/Savage_Rise/Savage_rise_store/artifacts/hero-navigation-performance/evidence/entrance/restored-1440.webm) et [mobile 390 px](C:/Users/ASUS/Desktop/Savage_Rise/Savage_rise_store/artifacts/hero-navigation-performance/evidence/entrance/restored-390.webm). Captures des portes, mot-symbole, transition, image et vidéo dans `evidence/entrance/` ; captures Hero/PDP aux cinq largeurs dans `evidence/functional/`. Les sources du build et de la recette sont identiques, vérification par SHA-256. Les seuls serveurs de recette lancés pour cette tâche ont été arrêtés ; aucun conflit avec un autre serveur Next n'a été observé.

**Aucun problème fonctionnel reproduit ne reste ouvert.** Restent à confirmer après déploiement manuel : gain global de latence, comportement dans Instagram réel et validation du nouveau runtime Heroku. Le coût de permissions Core reste mesuré et inchangé. Les vérifications bloquées ci-dessus ne sont pas déclarées PASS.
