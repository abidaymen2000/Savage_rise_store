# Savage Rise — fiabilité du catalogue

Date : 23 novembre 2026, Europe/Paris. Branche `main`, HEAD conservé : `cc07f6d0003eca7d5d6281ed208e2a44b915f3f4`.

**VALIDÉ — prêt pour déploiement manuel.** Aucun problème fonctionnel restant dans le périmètre corrigé sur la version testée. Aucun commit, push, déploiement, changement backend ou écriture en production. Le domaine public utilise encore l'ancien code ; sa vérification après déploiement manuel reste à exécuter.

## Cause racine confirmée

Le défaut public dépend du parcours. Sur **50 chargements publics**, les dix navigations homepage → Shop et les dix retours fiche produit → Shop affichent **4 produits, sans OMBRA, et sans Hoodies**. Les trente accès directs, rafraîchissements et entrées directes en nouvelle session affichent **5 produits et Hoodies**. Les cinquante lectures Core de comparaison renvoient les cinq identifiants et les huit catégories.

| Parcours public avant correction | Chargements | Catalogue correct | OMBRA absent |
|---|---:|---:|---:|
| Accès direct | 10 | 10 | 0 |
| Rafraîchissement | 10 | 10 | 0 |
| Homepage → Shop | 10 | 0 | 10 |
| Fiche produit → Shop | 10 | 0 | 10 |
| Entrée directe en contexte privé neuf | 10 | 10 | 0 |

La réponse RSC reçue lors de la navigation contient déjà `children:[4," product","s"]`, les quatre cartes et les catégories sans Hoodies. Le DOM ne retire aucun produit après réception. Les documents complets contiennent cinq cartes. Les deux parcours utilisent le même build Next public `mtgQFFVDlbMo-UVKv-RZf` et les mêmes chunks.

Le rejeu GET de la requête de navigation confirme l'isolation :

- Avec `Next-Router-State-Tree` : quatre produits, réponse en environ 0,2–0,5 s.
- En changeant seulement la clé `_rsc` : toujours quatre produits.
- En retirant `Next-Router-State-Tree` : cinq produits, réponse complète en environ 19,6 s.
- Les réponses indiquent `x-vercel-cache: MISS`, `age: 0` et `Cache-Control: private, no-cache, no-store…`. Modifier le cache HTTP public n'est pas le correctif.

Dans **Next 14.2.16 installé**, `force-dynamic` ne suffit pas, dans cette configuration, à empêcher les GET du SDK sans option `cache` de réutiliser le **Data Cache** lors d'un rendu RSC partiel. Un rendu complet exécute aussi les lectures Studio sans cache du layout ; un rendu partiel peut les sauter. Le test `tests/catalog-next-cache.test.mjs` exécute le vrai `patchFetch` de Next : une source passée de quatre à cinq éléments continue à rendre quatre avec `forceDynamic` seul, puis rend cinq avec `fetchCache: "default-no-store"`. Le cache tient bien compte des en-têtes de tenant.

Le correctif applique cette politique **aux routes de catalogue uniquement** : homepage, Shop, alias de catégorie. Les autres politiques de cache et les intégrations Studio/Core/Media sont conservées. Références : [cache Next 14](https://nextjs.org/docs/14/app/building-your-application/caching) et implémentation locale `node_modules/next/dist/server/lib/patch-fetch.js`.

Preuves : `evidence/public-series.json`, `evidence/rsc-request-probes.json`, `evidence/public/replay-same.txt`, `evidence/public/replay-no-tree.txt`, captures `evidence/public/final-failure-*.png`, test du moteur Next. Le serveur de développement seul n'a pas reproduit ce cache ancien ; la reproduction publique et le test du moteur sont donc conservés séparément. L'instant historique de création de l'ancienne entrée de cache n'est pas observable dans ces traces publiques.

## Trois fragilités supplémentaires reproduites et corrigées

Les trois défauts signalés sont confirmés sur les sources initiales et par navigateur avec API locale en mémoire :

| Injection avant correctif | Résultat reproduit | Comportement corrigé |
|---|---|---|
| Catégories HTTP 503 et filtre Hoodies | `0 products`, faux résultat vide | Produits accessibles sans filtre catégorie, message explicite, filtre désactivé, bouton de reprise |
| Détail produit HTTP 503 | Carte OMBRA à `0,000 DT`, sans variantes | Deux tentatives GET bornées ; ensuite erreur de collection complète, aucun prix fabriqué |
| HTTP 200 : quatre éléments pour un total de cinq | `4 products` présenté comme complet | Incohérence détectée, reprise bornée de la lecture, puis erreur explicite si persistante |

Autres protections : page attendue, taille et nombre de pages, total stable entre pages, `has_next`/`has_prev`, identifiants valides et uniques, chevauchements, total unique final, identité/type du détail enrichi. Le parcours respecte les tailles de pages plafonnées par Core. Aucun tableau partiel n'est renvoyé comme catalogue complet.

Chaque GET catalogue dispose de **deux tentatives au maximum**, d'un délai de **12 s par tentative** et d'une pause de **600 ms** avant la seconde. Le SDK est réellement annulé en cas de timeout. Les 400/401/403/404 ne sont pas relancés. Les délais publics observés ont été mesurés avant de choisir cette borne. Les erreurs de détail sont attendues ensemble avant de produire le diagnostic de la page. Les reprises des tests utilisent le bouton réel après rétablissement de l'API locale ; aucun retry automatique du runner ne transforme un échec en succès.

Une réponse ERP réussie avec un prix réel de zéro reste inchangée. Un prix absent n'est pas transformé en prix commercial de zéro. La suppression du fallback incomplet n'altère pas le mapping des réponses normales.

La homepage distingue également une collection indisponible d'une véritable collection vide. Les raccourcis de catégories indisponibles ne sont plus silencieusement assimilés à une suppression ERP. Les états de chargement, résultats vides et erreurs sont distincts ; le bouton `Try Again` effectue une nouvelle lecture complète.

## Validation

`PASS` = exécuté et réussi ; `FAIL` = défaut reproduit ; `BLOCKED` = vérification interdite ou protégée ; `NOT TESTED` = non exécutée.

| Contrôle | État | Preuve / résultat |
|---|---|---|
| Reproduction publique avant déploiement | FAIL confirmé | 20/50 parcours perdent OMBRA ; source Core 5/5 à chaque comparaison |
| Reproduction des trois fragilités initiales | FAIL confirmé avant correction | `before-browser.json`, `before-fault-reproductions.json` |
| Tests unitaires | PASS | **199/199**, `unit-final.log` ; 172 tests existants + 27 nouveaux |
| Reproduction/cache avec le moteur Next installé | PASS | Test réel de `patchFetch`, ancien cache 4 → source 5 → lecture fraîche 5 |
| Série stable sur code corrigé | PASS | **50/50**, mêmes cinq parcours, cinq produits et Hoodies à chaque chargement |
| Suite navigateur de résilience | PASS | **26/26 groupes**, `browser-final.json`, aucune erreur JavaScript |
| Reprises temporaires | PASS | Liste, catégories et détail : première lecture 503, deuxième lecture correcte |
| Catégories indisponibles | PASS | 503 et timeout, filtre Hoodies initial conservé dans l'URL, catalogue non filtré accessible, reprise fonctionnelle |
| Détails indisponibles ou incohérents | PASS | 503, timeout, JSON corrompu, mauvais type/identité : jamais de carte à prix inventé ni de faux catalogue complet |
| Pagination défaillante | PASS | Page 503, HTTP 200 tronqué, champ items absent, total changeant, page répétée |
| Pagination au-delà de 24 | PASS | 30 produits par navigateur : 24 + 6, aucun doublon ; 53 produits et 8 pages API en unitaire |
| Recherche et catégories imbriquées | PASS | Recherche des cinq produits, OMBRA, Hoodies, Clothing, Pants, T-shirts et vraie catégorie inconnue |
| SSR / hydratation retardée | PASS | Cinq cartes avant et après libération des scripts ; aucun produit retiré |
| Requêtes simultanées et tenant | PASS | Six contextes navigateur, cinq produits chacun, `X-Store-Domain: savagerise.com` ; isolation des chargements/diagnostics et des clés de cache en unitaire |
| Responsive | PASS | 320, 375, 390, 768 et 1440 px, catalogue normal et panne de catégories, sans débordement horizontal |
| Commerce et CMS | PASS | **7/7 groupes**, galerie, tailles/couleurs, favoris, quantité, panier, achat, checkout local, publication/preview Studio, stock forcé |
| Introduction et cycle Hero | PASS | **14/14 groupes**, cinq largeurs, 3,306–3,356 s ; même/nouvelle session, navigation, clavier, mouvement réduit, scripts absents, vidéo en échec ; aucune erreur JavaScript |
| Médias, FAZA, rotation des images | PASS | **8/8**, sans retry ni test instable : cycle Hero complet, poster 2 s, FAZA en boucle, six couleurs, galerie manuelle, image absente, autoplay refusé, mouvement réduit et nettoyage des timers |
| TypeScript | PASS | `tsc --noEmit --project .tmp/qa/catalog-final/tsconfig.json`, code 0 |
| Lint | PASS | Code 0, **8 avertissements préexistants**, aucune nouvelle erreur |
| Build de production | PASS | Compilation réussie, 27/27 pages générées ; routes catalogue dynamiques ; `build.log` |
| Concordance des sources testées et construites | PASS | 1 082 fichiers vérifiés par SHA-256 ; même contenu navigateur/build/arbre de travail |
| Runtime local `next start` | BLOCKED | Refus antérieur respecté ; aucune commande équivalente ni changement de port pour le contourner |
| Comparaison directe avec l'URL de déploiement Vercel protégée | BLOCKED | Réponse 302 vers SSO ; aucune tentative de contournement |
| Validation publique du correctif déployé | NOT TESTED | Aucun déploiement autorisé/exécuté ; la production reste sur son ancienne version |

Deux essais du nouveau harnais ont exposé ses propres erreurs : ouverture du menu avant hydratation après `reload`, et accès à `localStorage` sur `about:blank`. Les corrections concernent le script de recette ; elles ne filtrent aucune erreur de l'application. Les essais sont conservés dans `browser-harness-first.*` et `browser-harness-second.*`. La série finale repart de zéro et réussit ses cinquante chargements sans relance d'un scénario raté.

La fixture de l'ancienne suite média contenait un produit sans images **et sans prix**. Le nouveau contrôle l'a rejeté avec `missing_product_price`, comme attendu pour un objet commercial incomplet. La fixture reçoit désormais un prix explicite, uniquement en mémoire, afin de tester l'image manquante avec un produit valide. Les assertions de cette suite sont conservées. Le premier essai est archivé dans `media-fixture-first.*`.

Vidéos réalisées sur les sources finales : [desktop 1440 px](evidence/entrance/restored-1440.webm), [mobile 390 px](evidence/entrance/restored-390.webm). Les captures `doors-*`, `wordmark-*`, `opening-*`, `reveal-*`, `hero-image-*` et `hero-video-*` se trouvent dans `evidence/entrance/`. Le film de test local dure 2,472 s ; le cycle vérifie sa lecture complète et les deux secondes de poster, sans prétendre valider la disponibilité permanente du CDN.

## Déploiement, cache et sécurité des essais

L'API GitHub des déploiements atteste le déploiement Vercel Production `8011321459` réussi pour `cc07f6d0003eca7d5d6281ed208e2a44b915f3f4`, identique à HEAD examiné. Le build observé sur le domaine public est constant entre tous les parcours. L'URL spécifique du déploiement exige une authentification ; son contenu n'a pas été comparé au domaine public par contournement de cette protection.

Core renvoie les listes avec `Cache-Control: private, no-store` et un `Vary` incluant le tenant. Le Store sélectionne toujours `X-Store-Domain: savagerise.com` et, en SSR, `Origin: https://savagerise.com`. Aucun en-tête d'autorisation ni règle de tenant n'a été changé. Les snapshots publics et les journaux réseau distinguent les lectures Core, les réponses RSC serveur et le DOM hydraté.

Les lectures publiques sont exclusivement GET/HEAD. Les tentatives de télémétrie du navigateur public ont été bloquées par le harnais, sans modifier les règles de consentement du Store. Les commandes, favoris et commandes de checkout de recette n'affectent qu'une API locale en mémoire, qui ne transfère aucune écriture à Core.

Les sorties Next sont isolées dans `.tmp/qa/catalog-final` et `.tmp/qa/catalog-production`. Le serveur existant sur le port 3100 n'a pas été arrêté, réutilisé pour contourner un refus, ni écrasé par le build de recette.

Les deux serveurs de recette ont été arrêtés à la livraison ; seul le serveur antérieur sur le port 3100 reste à l'écoute parmi les trois ports vérifiés (`evidence/servers-after.json`). Le récapitulatif machine des résultats est dans `evidence/RESULTS.json`.

## Observabilité ajoutée

`createCatalogDiagnostics` émet un résumé JSON serveur par chargement anormal. Les succès restent silencieux par défaut ; `CATALOG_DIAGNOSTICS=1` active temporairement leurs résumés. Le contexte appartient au rendu courant, sans cache global de données commerciales.

Champs : tenant, surface/route, identifiant de corrélation, durée, appels de pages API, total annoncé, lignes reçues par page, catalogue complet chargé, résultat affiché, exclusions successives par type/catégorie/couleur/taille/disponibilité, statuts/durées/tentatives API, origine du fallback et raisons d'incohérence. Les identifiants manquants sont indiqués lorsque la liste fournit une comparaison fiable, notamment un détail manquant. Aucun identifiant absent d'une liste incohérente n'est deviné. Les textes de recherche, cookies, tokens, corps d'erreur et données client ne sont pas journalisés.

Exemples réels du correctif dans `evidence/dev-final.log` : total cinq, résultat cinq avec catégories indisponibles ; statut 408 après timeout ; liste HTTP 200 partielle rejetée ; identifiant du détail en échec ; total trente traversé sur cinq pages plafonnées à sept éléments. Pour une future différence 4/5, le total Core et les exclusions permettent de séparer une réponse amont de quatre éléments d'un filtrage frontend.

## Conservation et revue visuelle

`evidence/preservation.json` compare les objets produits et catégories réellement transformés par les versions avant/après : **égalité complète pour les cinq produits**, dont les prix, SKU, variantes, options, catégories et médias. Le snapshot CMS est identifié par SHA-256. **1 066 fichiers frontend sont inchangés**, dont les SDK générés, règles de stock, contrats Studio, contexte analytique, portes, Hero, composants médias, galerie produit, panier et checkout.

Revue manuelle selon les règles Impeccable `harden` et `craft-floor` : les messages d'erreur utilisent les composants et couleurs existants, restent lisibles sur mobile, exposent une reprise clavier, et n'introduisent aucun débordement dans les cinq largeurs vérifiées. Les captures `catalog-*.png` et `categories-unavailable-*.png` montrent la version corrigée. Le lanceur Impeccable précédemment indisponible n'a pas été retenté ; aucun verdict automatique n'est inventé.

## Fichiers modifiés

Frontend (16 fichiers) :

- `app/products/page.tsx`, `app/categories/[name]/page.tsx`, `app/page.tsx` : fraîcheur des lectures et chargements explicites.
- `lib/api/catalog-api.ts`, `lib/catalog-read.ts`, `lib/storefront/catalog-data.ts` : intégrité des pages/détails, suppression du fallback incomplet, reprises et annulation.
- `lib/storefront/catalog-categories.ts`, `lib/storefront/catalog-diagnostics.ts` : état distinct des catégories et diagnostics par rendu.
- `app/products/products-controls.tsx`, `app/products/loading.tsx`, `app/products/error.tsx` : filtres indisponibles, chargement et reprise.
- `components/storefront/catalog-retry.tsx`, `components/storefront/catalog-unavailable.tsx` : composants de récupération.
- `app/components/FeaturedProducts.tsx`, `app/components/Header.tsx`, `app/layout.tsx` : disponibilité explicite des catégories/produits sur les surfaces existantes.

Tests et diagnostic :

- `tests/catalog-resilience.test.mjs`, `tests/catalog-next-cache.test.mjs`.
- `tests/media-cutover.test.mjs`, `tests/storefront-availability.test.mjs` : seules les attentes de l'ancien fallback incomplet sont remplacées par le rejet explicite ; les contrôles médias/stock normaux restent présents.
- `tests/e2e/catalog-resilience-server.mjs` : API de panne locale sans transfert vers la production.
- `tests/e2e/store-media-server.mjs` : prix explicite du produit fictif sans images, afin de conserver le test du secours visuel avec un objet commercial valide.
- `scripts/verify-catalog-resilience.mjs` : cinquante chargements et matrice de résilience.
- `scripts/probe-catalog-public.mjs` : diagnostic public GET/HEAD reproductible, code de sortie non nul si la série échoue.
- Ce rapport. Les journaux, captures, snapshots et manifests se trouvent dans `artifacts/catalog-resilience/evidence/` ; les sorties lourdes de recette restent exclues localement de Git.

## Limites restantes

- La production n'a pas reçu le correctif : son défaut public est toujours celui du déploiement examiné. Après déploiement manuel, refaire la série publique, en particulier les deux parcours RSC.
- Une réponse Core cohérente annonçant quatre produits et contenant quatre produits ne permet pas au frontend de distinguer une dépublication légitime d'une omission interne à Core. Aucun ancien produit n'est réintroduit depuis un cache de secours. Ce cas n'a pas été observé dans les cinquante lectures Core ; les diagnostics permettront de le distinguer si cela survient.
- Sans version transactionnelle de catalogue dans le contrat Core, un changement simultané conservant exactement les mêmes totaux ne peut pas être détecté intégralement entre pages. Aucun contrat backend n'a été changé.
- Une panne durable produit un état d'erreur borné et une reprise manuelle, pas un catalogue partiel ni une disponibilité fictive.
- Le runtime de production local reste non testé en raison du refus `next start`. Le build, le moteur Next installé, le serveur de développement et les lectures publiques autorisées ont été utilisés.

## Commandes Windows CMD

Les commandes ci-dessous sont destinées à une exécution manuelle. Aucun commit, push ou déploiement n'a été exécuté par l'agent.

Vérification sans écraser les sorties d'un serveur Next existant :

```bat
cd /d C:\Users\ASUS\Desktop\Savage_Rise\Savage_rise_store
git branch --show-current
git status --short
git diff --check
set NEXT_PUBLIC_STOREFRONT_DOMAIN=savagerise.com
set NEXT_PUBLIC_API_BASE_URL=
npm test
node scripts\prepare-entrance-review.mjs .tmp/qa/catalog-manual artifacts/catalog-resilience/evidence/manual-source.json
node node_modules\typescript\bin\tsc --noEmit --project .tmp/qa/catalog-manual/tsconfig.json
node node_modules\next\dist\bin\next lint .tmp/qa/catalog-manual
node node_modules\next\dist\bin\next build .tmp/qa/catalog-manual
```

Recette navigateur avec le serveur de développement explicitement autorisé, dans trois fenêtres CMD, en conservant les ports de recette libres. Les snapshots de cette mission et Playwright dans `.tmp/qa/node_modules` sont requis ; le script ne crée aucun serveur de production :

```bat
rem Fenetre 1 : API locale, ecritures uniquement en memoire
cd /d C:\Users\ASUS\Desktop\Savage_Rise\Savage_rise_store
set CATALOG_FIXTURE_URL=file:///C:/Users/ASUS/Desktop/Savage_Rise/Savage_rise_store/artifacts/catalog-resilience/evidence/public/
node tests\e2e\catalog-resilience-server.mjs
```

```bat
rem Fenetre 2 : copie de recette independante
cd /d C:\Users\ASUS\Desktop\Savage_Rise\Savage_rise_store
set NEXT_PUBLIC_STOREFRONT_DOMAIN=savagerise.com
set NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:49175/api/core
set NEXT_TELEMETRY_DISABLED=1
set CATALOG_DIAGNOSTICS=1
node scripts\prepare-entrance-review.mjs .tmp/qa/catalog-manual-dev artifacts/catalog-resilience/evidence/manual-dev-source.json
node node_modules\next\dist\bin\next dev .tmp/qa/catalog-manual-dev --hostname 127.0.0.1 --port 49176
```

```bat
rem Fenetre 3 : controles, sans retries du runner
cd /d C:\Users\ASUS\Desktop\Savage_Rise\Savage_rise_store
node scripts\verify-catalog-resilience.mjs
```

Pour publier manuellement via la connexion Git/Vercel existante, relire d'abord le diff et les fichiers indexés. L'indexation ci-dessous vise uniquement ce correctif ; tout changement ajouté en parallèle doit être revu séparément :

```bat
git diff
git --literal-pathspecs add -- "app/categories/[name]/page.tsx" "app/components/FeaturedProducts.tsx" "app/components/Header.tsx" "app/layout.tsx" "app/page.tsx" "app/products/error.tsx" "app/products/loading.tsx" "app/products/page.tsx" "app/products/products-controls.tsx" "lib/api/catalog-api.ts" "lib/storefront/catalog-data.ts" "lib/catalog-read.ts" "lib/storefront/catalog-categories.ts" "lib/storefront/catalog-diagnostics.ts" "components/storefront/catalog-retry.tsx" "components/storefront/catalog-unavailable.tsx" "tests/catalog-resilience.test.mjs" "tests/catalog-next-cache.test.mjs" "tests/media-cutover.test.mjs" "tests/storefront-availability.test.mjs" "tests/e2e/catalog-resilience-server.mjs" "tests/e2e/store-media-server.mjs" "scripts/probe-catalog-public.mjs" "scripts/verify-catalog-resilience.mjs" "artifacts/catalog-resilience/FINAL-REPORT.md"
git diff --cached --stat
git diff --cached
git commit -m "fix: keep storefront catalog fresh and complete"
git push origin main
```

Vérifier ensuite le succès du nouveau déploiement Production dans Vercel et son SHA. Le contrôle public après déploiement n'écrit aucune commande ni donnée dans Core :

```bat
set CATALOG_PROBE_OUTPUT=artifacts/catalog-resilience/evidence/after-manual-deployment
node scripts\probe-catalog-public.mjs
```

Le résultat attendu est cinquante chargements réussis, les cinq produits actuels (dont OMBRA), Hoodies, et des réponses RSC cohérentes avec Core. Un changement ERP pendant la série est signalé comme modification de référence et demande une nouvelle analyse, pas un rétablissement forcé d'anciens produits.

