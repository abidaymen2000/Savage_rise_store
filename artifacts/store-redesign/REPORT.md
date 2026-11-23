# Savage Rise — refonte et recette du 23 novembre 2026

Les templates de l'accueil, du catalogue et de la fiche produit ont été refondus localement sur `main`. La palette ivoire/noir/or, la typographie Bodoni Moda, les cartes photographiques, les couleurs circulaires et la galerie manuelle suivent les deux maquettes tout en conservant les données YOVO. Aucun commit, push, déploiement, changement backend ou écriture de données de production n'a été effectué.

La recette frontend est validée ci-dessous. Une limite préexistante empêche d'affirmer que **toutes** les sections sont administrables dans Studio : le contrat reçu ne contient pas de configuration FAZA/lookbook. Ces replis existants sont conservés et décrits dans la section compatibilité.

## 1. Diagnostic des bugs

| Sujet | Constat vérifié | Traitement |
|---|---|---|
| A — Hoodies sur l'accueil | La source était la liste locale `categoryFeatures` (T-shirts/Pants/Packs), avec recherche par nom et limitation à trois entrées. Hoodies n'en faisait pas partie. | Découverte des catégories actives à partir de l'arbre ERP et des produits éligibles, descendants compris. L'unique catégorie racine de regroupement est déroulée vers ses départements. Aucun nom ni nombre fixe de catégories. Images des catégories ERP ; fond neutre si absent. |
| B — Hoodie absent du catalogue | Au contrôle public du 23 novembre, `/products` et l'API renvoient **cinq produits, hoodie compris**. L'absence historique à quatre produits n'est donc pas reproduite. Le code chargeait une seule page API de 100 éléments, ce qui pouvait omettre des produits si le serveur limitait la taille de page ou si le catalogue dépassait cette limite. | Chargement de toutes les pages avec la pagination retournée par Core, déduplication et arrêt explicite sur page répétée. Test avec deux éléments par page et OMBRA en dernière page. Recherche API, catégories descendantes et route historique de catégorie vérifiées. Aucune visibilité forcée. La pagination est une fragilité corrigée, **pas une cause historique démontrée**. |
| C — 52 DT | Aucun `52 DT` statique trouvé dans le code actuel ni le rendu public examiné. Le sous-titre publié dans Studio contient actuellement 89,900 DT. | Aucun prix CMS supprimé arbitrairement. Les prix des cartes et variantes restent ceux du catalogue. Test navigateur vérifiant l'absence de « 52 DT ». |
| D — Vidéos | Les algorithmes existants implémentaient déjà le cycle Hero et la boucle FAZA sans Pause. | Comportements conservés, maintenant vérifiés dans Chrome avec une vraie vidéo de test : image 2 s → vidéo entière → image 2 s ; boucle FAZA, erreurs, autoplay refusé et réduction des animations. La limite de source CMS de FAZA reste distincte du lecteur. |

L'audit public a commencé à **07:02, heure de Paris**, uniquement en GET/HEAD. Les pages et réponses API utiles ont renvoyé HTTP 200. OMBRA (`6b032d527b49ec9b6c39ec4d`) est retourné par l'API storefront comme produit physique actif et disponible, associé à Hoodies, avec 30 variantes. Son champ `published_at` est nul dans cette réponse ; le frontend conserve l'éligibilité décidée par l'API publique et n'invente pas un filtre supplémentaire sur ce champ.

Le tenant est sélectionné par les en-têtes existants `X-Store-Domain: savagerise.com` et, en SSR, `Origin: https://savagerise.com`. Aucun défaut de résolution de tenant ni blocage backend n'est démontré par ces réponses. Les pages concernées restent `force-dynamic` et Studio est chargé avec `cache: no-store`. Les changements de révision sont vérifiés au rechargement ; l'audit ne prouve pas l'état d'un ancien cache CDN.

Preuves : [audit HTTP](C:/Users/ASUS/Desktop/Savage_Rise/Savage_rise_store/artifacts/store-redesign/before/audit.json), [lecture navigateur](C:/Users/ASUS/Desktop/Savage_Rise/Savage_rise_store/artifacts/store-redesign/before/browser-audit.json), [réponse catalogue](C:/Users/ASUS/Desktop/Savage_Rise/Savage_rise_store/artifacts/store-redesign/before/products.json).

## 2. Corrections et présentation

- Header compact, logo CMS conservé, navigation existante et menus mobiles accessibles ; un lien de page masquée est maintenant filtré après résolution de sa destination `system_route`.
- Hero photographique horizontal sur desktop, texte italique et actions lisibles ; image/vidéo et actions Studio conservées. L'ancien écran d'introduction décoratif a été retiré du layout pour rendre le contenu immédiatement visible.
- Catégories dynamiques, quatre nouveautés sur desktop, deux cartes sur mobile et disposition adaptée à la largeur réelle des cartes. Les actions restent alignées lorsque les couleurs occupent plusieurs rangées.
- Catalogue commun à `/products` et à `/categories/[name]`, compteur, recherche, catégories imbriquées, couleur, taille, disponibilité, tri et pagination de présentation existants. Les changements de filtres depuis l'ancienne route rejoignent `/products`.
- Pastilles nommées et sélection visible. L'adaptateur utilise désormais le `swatch` de l'axe couleur ERP dans le champ frontend `color_code`, sans changer les identifiants ni les valeurs métier des variantes.
- Rotation des cartes : une image principale par couleur, intervalle de deux secondes ; les tailles et photos secondaires n'ajoutent pas de diapositives. Le survol/sélection visuelle d'une pastille ne modifie pas la variante d'achat.
- Fiche : rail de miniatures, grande photo, zoom, couleurs et tailles en boutons, quantité et actions existantes. La galerie est manuelle ; Brown/M → Brown/L conserve la photo, puis Green/L change de galerie.
- Un attribut de disponibilité après hydratation permet aux tests de commencer après activation réelle des contrôles. Les messages, validations d'origine et signatures de prévisualisation Studio restent inchangés.

## 3. Compatibilité YOVO

| Domaine | Préservé et vérifié | Limite exacte |
|---|---|---|
| Studio | Document publié, texte et média Hero, poster, remplacement vidéo, révision, visibilité des pages et liens, document privé de prévisualisation, achats bloqués en preview. Les variables typographiques et de grilles existantes restent prioritaires. | La recette de publication utilise des réponses locales simulées, pas une session d'administration Studio réelle. |
| Sections de l'accueil | Les composants existants et leurs données restent en place. | `getStorefrontContent()` retourne encore `content-fallbacks.ts`. FAZA, lookbook et certaines réassurances/annonces sont des replis locaux préexistants. Le manifeste Studio reçu n'expose pas leurs champs ; `home.content_blocks` est vide. Les paramètres Vlog/Chapters ne sont pas réinterprétés comme FAZA. Une administration complète de ces sections nécessite une capacité CMS/contrat explicite hors de cette mission frontend. |
| Core | Catégories, sous-catégories, recherche, produits publics, prix, variantes, nuances ERP, disponibilité, ruptures forcées, favoris, panier et corps de commande. | Aucun microservice, schéma généré, endpoint ou règle métier modifié. Le coût de lecture augmente avec un très grand catalogue puisque toutes les pages éligibles sont chargées pour les filtres existants. |
| Media | URLs existantes, loader d'images, chargement différé, lecteur vidéo, poster et repli d'erreur. | Aucun nouveau raster commercial généré ou ajouté au site. Les snapshots reprennent les médias publics existants. |
| Commande/paiement | Parcours existant jusqu'au succès, quantité, identifiant de variante, paiement `cod` et clé d'idempotence contrôlés. | Commande enregistrée uniquement dans la mémoire du serveur de fixture ; aucune commande réelle créée. |

Le média FAZA historique reste `https://ik.imagekit.io/deuxug3j0/static/Sequence%2007.mp4`. Sa lecture en boucle est testée ; son édition dans Studio n'est pas revendiquée. La newsletter était déjà sans service d'inscription et reste dans cet état.

## 4. Captures avant/après

Avant : Store public réel, lecture seule. Après : code local et réponses publiques rejouées par un serveur de fixture local. Les contenus, prix et photographies proviennent du snapshot YOVO ; l'ordre du catalogue de fixture place volontairement OMBRA en dernière page API pour vérifier sa découverte. Les captures de comparaison utilisent la préférence de réduction des animations pour stabiliser les photos.

| Surface | Avant desktop | Après desktop | Avant mobile | Après mobile |
|---|---|---|---|---|
| Accueil | [1440 px](C:/Users/ASUS/Desktop/Savage_Rise/Savage_rise_store/artifacts/store-redesign/before/home-desktop.png) | [1440 px](C:/Users/ASUS/Desktop/Savage_Rise/Savage_rise_store/artifacts/store-redesign/after/home-1440.png) | [390 px](C:/Users/ASUS/Desktop/Savage_Rise/Savage_rise_store/artifacts/store-redesign/before/home-mobile.png) | [390 px](C:/Users/ASUS/Desktop/Savage_Rise/Savage_rise_store/artifacts/store-redesign/after/home-390.png) |
| Boutique | [1440 px](C:/Users/ASUS/Desktop/Savage_Rise/Savage_rise_store/artifacts/store-redesign/before/shop-desktop.png) | [1440 px](C:/Users/ASUS/Desktop/Savage_Rise/Savage_rise_store/artifacts/store-redesign/after/shop-1440.png) | [390 px](C:/Users/ASUS/Desktop/Savage_Rise/Savage_rise_store/artifacts/store-redesign/before/shop-mobile.png) | [390 px](C:/Users/ASUS/Desktop/Savage_Rise/Savage_rise_store/artifacts/store-redesign/after/shop-390.png) |
| Fiche OMBRA | [1440 px](C:/Users/ASUS/Desktop/Savage_Rise/Savage_rise_store/artifacts/store-redesign/before/product-desktop.png) | [1440 px](C:/Users/ASUS/Desktop/Savage_Rise/Savage_rise_store/artifacts/store-redesign/after/product-1440.png) | [390 px](C:/Users/ASUS/Desktop/Savage_Rise/Savage_rise_store/artifacts/store-redesign/before/product-mobile.png) | [390 px](C:/Users/ASUS/Desktop/Savage_Rise/Savage_rise_store/artifacts/store-redesign/after/product-390.png) |

Les captures des **320, 375, 390, 768, 1024 et 1440 px** sont dans [after](C:/Users/ASUS/Desktop/Savage_Rise/Savage_rise_store/artifacts/store-redesign/after). Des vues défilées montrent également les [cartes mobiles](C:/Users/ASUS/Desktop/Savage_Rise/Savage_rise_store/artifacts/store-redesign/after/home-products-390.png), les [options produit](C:/Users/ASUS/Desktop/Savage_Rise/Savage_rise_store/artifacts/store-redesign/after/product-options-390.png) et les [actions à 320 px](C:/Users/ASUS/Desktop/Savage_Rise/Savage_rise_store/artifacts/store-redesign/after/product-purchase-320.png).

## 5. Résultats de recette

Environnement : Windows, Node 22.16.0, Next 14.2.16, Chrome installé en mode headless, Playwright 1.65.1 isolé dans `.tmp/qa`. Les fixtures écoutent uniquement `127.0.0.1`. Les tests navigateur interdisent les écritures externes ; seuls les GET de médias ImageKit sont autorisés pour les captures avec photos réelles. Les tests médias synthétiques n'accèdent pas à la production.

| Vérification | Résultat | Preuve |
|---|---|---|
| Tests unitaires et contrats existants | **159/159 réussis**, aucun ignoré | [tests.log](C:/Users/ASUS/Desktop/Savage_Rise/Savage_rise_store/artifacts/store-redesign/tests.log) |
| TypeScript `tsc --noEmit` | **Code 0**, aucune erreur | [typecheck.log](C:/Users/ASUS/Desktop/Savage_Rise/Savage_rise_store/artifacts/store-redesign/typecheck.log) |
| Lint | **Code 0**, huit avertissements préexistants dans checkout, profil, avis, contact et studio-hero-action | [lint.log](C:/Users/ASUS/Desktop/Savage_Rise/Savage_rise_store/artifacts/store-redesign/lint.log) |
| Build production | **Code 0**, 27 pages statiques traitées, routes dynamiques compilées | [build.log](C:/Users/ASUS/Desktop/Savage_Rise/Savage_rise_store/artifacts/store-redesign/build.log) |
| Médias dans Chrome | **8/8 scénarios réussis**, aucune reprise automatique de test | [media-checks.json](C:/Users/ASUS/Desktop/Savage_Rise/Savage_rise_store/artifacts/store-redesign/media-checks.json) |
| Parcours CMS/ERP/commerce | **7/7 groupes réussis**, aucune erreur JavaScript collectée | [functional-checks.json](C:/Users/ASUS/Desktop/Savage_Rise/Savage_rise_store/artifacts/store-redesign/functional-checks.json) |
| Responsive | **18/18 contrôles**, aucun débordement horizontal ni image cassée visible, aucune erreur JavaScript collectée | [layout-checks.json](C:/Users/ASUS/Desktop/Savage_Rise/Savage_rise_store/artifacts/store-redesign/after/layout-checks.json) |
| Revue indépendante Impeccable | **ship** sur les quatre corrections demandées ; 32 recaptures valides | [finish-review.md](C:/Users/ASUS/Desktop/Savage_Rise/Savage_rise_store/artifacts/store-redesign/finish-review.md) |

Le build existant désactive sa propre étape TypeScript/lint ; ces deux contrôles ont donc été exécutés séparément et réussissent. L'avertissement Browserslist sur une base `caniuse-lite` ancienne demeure ; aucun changement de dépendance de production n'a été effectué.

Les tests médias couvrent trois largeurs, la vidéo entière et son redémarrage après deux secondes, deux boucles FAZA, le cycle complet de six couleurs, une couleur fixe, deux couleurs avec mesure d'intervalle, les images manquantes, le nettoyage des timers, la galerie manuelle et les contraintes d'autoplay/mouvement. Les parcours couvrent aussi recherche, catégories descendantes, tri conservant la priorité aux produits disponibles, favoris, panier, checkout, modifications publiées et privées, prix actualisé, rupture forcée et filtres/menu mobiles.

Pendant la mise au point, des chargements à froid du serveur Next de développement ont produit une erreur de script tronqué/chargé pendant la compilation. La préparation explicite des routes avant ouverture de Chrome et l'attente d'hydratation rendent la recette finale stable. Les résultats ci-dessus sont ceux de la dernière exécution complète, pas des échecs intermédiaires.

## 6. Fichiers et système de design

La liste exhaustive des fichiers source et de recette créés/modifiés par cette mission figure dans [changed-files.txt](C:/Users/ASUS/Desktop/Savage_Rise/Savage_rise_store/artifacts/store-redesign/changed-files.txt). Les snapshots, images et logs sont regroupés dans ce dossier de livraison. Les dossiers `.agents/`, `.codex/` et `skills-lock.json` étaient déjà non suivis avant intervention et ne sont pas attribués à cette refonte.

Les changements de production concernent les templates `app`, la navigation/cartes de `components`, le signal d'hydratation Studio et l'adaptation de présentation/pagination de `lib`. Aucun fichier de contrat généré ni logique de checkout/commande backend n'a été changé. Les dépendances du projet et leurs lockfiles n'ont pas changé.

[PRODUCT.md](C:/Users/ASUS/Desktop/Savage_Rise/Savage_rise_store/PRODUCT.md) fixe le contexte et les contraintes. [DESIGN.md](C:/Users/ASUS/Desktop/Savage_Rise/Savage_rise_store/DESIGN.md) et son [sidecar](C:/Users/ASUS/Desktop/Savage_Rise/Savage_rise_store/.impeccable/design.json) décrivent les valeurs réellement implémentées. Le verdict visuel est qualitatif : aucun score de comparaison pixel ou résultat de gate natif Impeccable n'est inventé.

## 7. Limites restantes

1. FAZA, lookbook et certaines réassurances restent des replis locaux tant qu'un contrat CMS les exposant n'est pas disponible. Ce point empêche de certifier l'administration intégrale de l'accueil depuis Studio.
2. L'absence historique d'OMBRA sur une capture à quatre produits n'est pas reproduite sur le Store public actuel. La correction de pagination est prouvée par fixture, pas attribuée sans preuve à cet incident historique.
3. Le contrôle automatique d'approbation a refusé la commande de lancement du **serveur local de production**, avec le motif « blocked by policy ». Le build de production est validé ; les interactions ont été testées sur le serveur de développement. Aucune validation navigateur du serveur `next start` n'est revendiquée.
4. Les largeurs mobiles sont testées dans Chrome avec viewport adapté, pas sur des appareils iOS/Android physiques ni Safari. Les erreurs/autoplay sont simulés dans Chrome ; aucune mesure de performance terrain ou certification d'accessibilité exhaustive n'est revendiquée.
5. Aucun test ne modifie le vrai Studio, le vrai ERP ou une commande réelle. L'accès d'administration et la livraison de commande réelle ne font pas partie de cette preuve.

## 8. Commandes Windows CMD

Ces commandes sont fournies pour exécution manuelle. Aucun déploiement n'a été exécuté. Utiliser des fenêtres **CMD**, arrêter les serveurs des ports 49171/49172 avant de lancer une autre suite sur ces ports et interrompre la séquence si une commande échoue.

### Vérifications générales

Depuis le projet, avec les dépendances déjà installées :

```bat
cd /d C:\Users\ASUS\Desktop\Savage_Rise\Savage_rise_store
set "NEXT_PUBLIC_STOREFRONT_DOMAIN=savagerise.com"
npm test
npx tsc --noEmit
npm run lint
npm run build
git diff --check
git status --short
```

Sur une nouvelle installation, `npm ci` prépare les dépendances à partir du lockfile existant. Le build doit être relancé avec les variables de l'environnement visé : le build de recette de cette mission utilisait explicitement l'API locale de fixture et ne constitue pas un artefact à déployer.

### Recette médias isolée

```bat
cd /d C:\Users\ASUS\Desktop\Savage_Rise\Savage_rise_store
npm install --prefix .tmp\qa --no-save --package-lock=false @playwright/test@1.65.1
set "NODE_PATH=%CD%\.tmp\qa\node_modules"
set "STORE_TEST_VIDEO=%CD%\.tmp\qa\test-video.webm"
set "STORE_TEST_OUTPUT=%TEMP%\savage-rise-media-manual"
set "STORE_TEST_RESULTS=%TEMP%\savage-rise-media-manual.json"
node tests\e2e\create-browser-test-video.mjs
node .tmp\qa\node_modules\@playwright\test\cli.js test -c tests\e2e\store-media.config.mjs
```

Chrome doit être installé. La configuration démarre et arrête elle-même ses deux serveurs. La vidéo créée est exclusivement un fichier de recette local, ignoré par Git.

### Captures et parcours fonctionnels isolés

Fenêtre CMD A — fixture issue des snapshots publics livrés :

```bat
cd /d C:\Users\ASUS\Desktop\Savage_Rise\Savage_rise_store
set "STORE_TEST_VIDEO=%CD%\.tmp\qa\test-video.webm"
node tests\e2e\store-redesign-server.mjs
```

Fenêtre CMD B — frontend local :

```bat
cd /d C:\Users\ASUS\Desktop\Savage_Rise\Savage_rise_store
set "NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:49171"
set "NEXT_PUBLIC_STOREFRONT_DOMAIN=fixture.local"
set "NEXT_PUBLIC_META_PIXEL_ID="
set "NEXT_TELEMETRY_DISABLED=1"
npm run dev -- -H 127.0.0.1 -p 49172
```

Fenêtre CMD C — exécuter successivement, sans lancer les deux scripts en parallèle :

```bat
cd /d C:\Users\ASUS\Desktop\Savage_Rise\Savage_rise_store
node scripts\verify-store-redesign.mjs
node scripts\verify-store-flows.mjs
```

L'aperçu est [http://127.0.0.1:49172](http://127.0.0.1:49172). `Ctrl+C` arrête chaque serveur. Pour refaire seulement l'audit public en lecture seule, les scripts livrés sont `scripts\audit-store-readonly.mjs` et `scripts\capture-store-before.mjs` ; leur exécution remplace les snapshots « avant ».

### Build et lancement manuels avec la configuration réelle

Dans une **nouvelle** fenêtre CMD, vérifier les variables de déploiement existantes puis préparer un nouveau build ; conserver toutes les autres variables/secrets existants du projet :

```bat
cd /d C:\Users\ASUS\Desktop\Savage_Rise\Savage_rise_store
set "NEXT_PUBLIC_API_BASE_URL=https://yovo-api-gateway-a8da1d8e66a3.herokuapp.com/api/core"
set "NEXT_PUBLIC_STOREFRONT_DOMAIN=savagerise.com"
npm run build
npm run start -- -H 127.0.0.1 -p 3000
```

Ce lancement sert une copie locale connectée à la configuration réelle ; il ne publie pas le site. Les actions commerciales effectuées manuellement sur cette copie utiliseraient les services réels.

### Déploiement manuel, uniquement si l'hébergement est Vercel

Le dépôt ne suffit pas à confirmer le fournisseur d'hébergement ou son projet cible. Si le projet Vercel existant est déjà correctement lié et ses variables Production configurées, le déploiement à partir des sources peut être lancé manuellement avec :

```bat
cd /d C:\Users\ASUS\Desktop\Savage_Rise\Savage_rise_store
npx vercel deploy --prod
```

Cette commande publie sur le projet lié ; elle n'est pas exécutée dans cette mission. Ne pas utiliser `--prebuilt` avec le build de fixture. La syntaxe et le ciblage Production sont documentés dans la [documentation officielle Vercel CLI](https://vercel.com/docs/cli/deploy). Pour un autre hébergeur, utiliser son pipeline existant plutôt qu'inventer une commande de publication.
