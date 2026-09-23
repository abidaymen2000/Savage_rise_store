# Savage Rise : diagnostic et corrections du 23 septembre 2026

Les corrections sont locales, sans commit, push ni déploiement. Le storefront ne
peut pas retrouver un catalogue réel tant que le Gateway ne publie pas ses routes
storefront. Aucun appel n'a contourné le Gateway vers l'ancien backend. Aucune
commande réelle, aucun OTP et aucun email n'ont été envoyés.

## Cause du rendu /products

Avant correction, `getProductsPageData` dans `app/products/page.tsx` absorbait
l'échec de `api.getCategories()` avec `catch(() => [])`, puis appelait
`api.getProducts(0, 100, { productKind: "physical", q: null })`. Le client généré
effectue `GET /api/core/catalog/products?page=1&page_size=100&product_kind=physical`.
Kong répond 404 avec `message: "no Route matched with those values"` ; `withApiErrors`
relance cette erreur. Le rendu serveur échoue avant l'hydratation des détails
produits. Next masque le message serveur en production, et l'ancienne frontière
d'erreur affichait précisément ce message générique. Le navigateur de production
a confirmé cet écran. Les analytics ne sont pas la cause de cette exception SSR.

Les logs privés Vercel et les variables du déploiement ne sont pas accessibles
dans cette session (pas de connexion Vercel ni de projet CLI lié). Ce diagnostic
est reproduit par le code local, le build avec la vraie API et les réponses
publiques, mais ne constitue pas une lecture de la stack du déploiement Vercel.
Pour la corrélation finale : fournir le deployment ID/commit, l'heure UTC, le
digest et la stack de la fonction `/products`. Après déploiement, rechercher
`[storefront-api]` : méthode, chemin sans query ni corps, domaine tenant, statut,
code et request ID. Ne pas exporter les en-têtes Authorization/cookies/secrets.

## Contrat et composition des URL

La découverte authentifiée `/docs/services` annonce Core à
`https://yovo-api-gateway-a8da1d8e66a3.herokuapp.com/docs/schemas/core.json`.
Le schéma OpenAPI 3.1 a `servers: [{"url":"/"}]` et des chemins `/api/core/...`.
La génération enlève ce préfixe des chemins et le place une seule fois dans
`OpenAPI.BASE`. La base runtime accepte l'origine ou l'origine suivie de
`/api/core`, et refuse un préfixe doublé ou un autre chemin.

Commande conservée : `npm run api:generate`, soit `node scripts/generate-api.mjs`.
Le script utilise openapi-typescript-codegen, `./lib/api/generated`, le client
fetch, `--useOptions` et `--useUnionTypes`. Aucune édition manuelle du généré.
L'exécution authentifiée réelle du 23 septembre échoue volontairement avec
« Core schema is missing storefront operations (51) … Existing client preserved ».
Le schéma actuellement publié expose les opérations admin/platform, mais omet
les opérations publiques consommées (catalogue, auth, CMS, commandes, profil,
wishlist, avis, promotions, livraison, fidélité et ingestion analytics).

Le client déjà présent correspond au contrat Gateway local documenté dans les
dépôts YOVO. Il n'a pas été remplacé par le schéma public incomplet. Les routes
catalogue/commandes sont également attestées par le manifeste Gateway et les
routers Core locaux, et non inventées à partir de noms supposés.

Exemples finaux :

- SSR : `GET https://yovo-api-gateway-a8da1d8e66a3.herokuapp.com/api/core/catalog/products?page=1&page_size=100&product_kind=physical`.
- Navigateur : `POST https://yovo-api-gateway-a8da1d8e66a3.herokuapp.com/api/core/orders/quote`.

Les deux transmettent `X-Store-Domain: savagerise.com`. Core résout
X-Store-Domain, puis Origin, puis Host vers le tenant actif. Aucun Origin n'est
fabriqué côté SSR, aucun tenant alternatif n'est choisi. Bearer et clé
d'idempotence de commande restent transmis. Les médias CDN gardent leurs URL.
Les recherches dans le code runtime n'ont trouvé aucun recours à l'ancien backend.
Pas de rewrite API vers un monolithe ; le proxy Next de vérification d'email
utilise la même configuration Gateway et le contexte tenant.

## Relevé réel : 2026-09-23 17:24:39 UTC

Base commune : `https://yovo-api-gateway-a8da1d8e66a3.herokuapp.com/api/core`.
Tous les appels ci-dessous ont reçu **404 Kong, no Route matched with those values**.

| Méthode | Chemin sous la base | Request ID |
|---|---|---|
| GET | `/catalog/products?page=1&page_size=100&product_kind=physical` | `87c0ad07617b4a6f4a56b3204b92cb45` |
| GET | `/catalog/categories` | `1cd50d367ffebd2629607e08a5370274` |
| GET | `/catalog/products/savage-rise-drop-2-pack` | `8292c44ebeaf0b2772a09d18e4b3371f` |
| GET | `/catalog/products?page=1&page_size=20&product_kind=bundle` | `2948cb63bc5caa7d920fcb158122a16c` |
| GET | `/catalog/categories/t-shirts/products` | `41a7811fc5602356daa83d3b3bfa251f` |
| GET | `/storefront/config` | `d7d1471a4c1a2d373a68a22d644ec417` |
| GET | `/storefront/navigation` | `ca78192cacf00448648a0228c7b34d66` |
| POST | `/orders/quote` (items vides, sonde de routage) | `0583861c5e5d1b2aa0d6426f8c433424` |
| OPTIONS | `/orders/` | `bfd86519ea2cf60fd7d5ff69dcad734f` |
| OPTIONS | `/orders/quote` | `692bb43600367e7281e57543ecbd7805` |
| OPTIONS | `/analytics/savage-rise/events` | `bee58919f385135cd071b024e82d557d` |

La sonde de devis n'est pas un devis commercial réussi. L'opération Core est un
calcul sans réservation de stock/promotion. Aucun POST `/orders/` réel n'a été
effectué. Les OPTIONS répondent déjà `Access-Control-Allow-Origin:
https://savagerise.com`, mais pas Allow-Headers ; le préflight reste en échec.
Ajouter seulement une origine CORS ne résout donc pas l'absence des routes.

## Correction nécessaire dans YOVO

Dans `yovo-api-gateway`, `scripts/heroku_runtime.py` initialise
`ENABLE_STOREFRONT=false` par défaut, et `scripts/generate.py:enabled` élimine les
entrées marquées storefront lorsque ce flag n'est pas true. Ces entrées existent
dans `config/routes/endpoints.json`. L'absence simultanée des routes et du contrat
publié est cohérente avec ce filtrage ; les variables privées Heroku n'ont pas
été lues, donc leur valeur effective n'est pas affirmée.

L'opérateur doit publier la version Gateway contenant ces routes et la correction
du hostname commun, activer `ENABLE_STOREFRONT=true`, puis régénérer/recharger la
configuration Kong et son manifeste de documentation. Conserver les autres
services, upstreams et secrets. Le plugin doit préserver X-Store-Domain sur le
hostname Gateway commun, comme prévu par `docs/stores-finalization.md` du dépôt
Gateway ; l'ancien mapping Host API → boutique ne doit pas écraser ce sélecteur.

Vérifier ensuite les préflights POST devis/commande/analytics : origine exacte
Savage autorisée, et en-têtes Content-Type, Authorization, X-Store-Domain,
Idempotency-Key autorisés. Fusionner les origines existantes, ne pas les remplacer
par une liste limitée à Savage. `config/kong.template.yml` contient déjà ces
en-têtes. Ne pas ouvrir les routes internes ni désactiver les permissions.

Dans `yovo-core-service`, `app/main.py` inclut déjà les routers `/catalog` et
`/orders` ; `app/tenant_context.py` contient le résolveur tenant. Aucune preuve
actuelle n'impose d'inventer une route Core. Après activation Gateway, si le
contrat manque encore, vérifier que le déploiement Core inclut effectivement ces
routers et que le manifeste Gateway provient de ce même contrat. Un futur
STORE_DOMAIN_UNKNOWN devra être résolu dans l'enregistrement de domaine Savage,
sans tenant par défaut. Les dépôts YOVO ont été consultés, pas modifiés ici.

## Variables Vercel/locales exactes

```dotenv
NEXT_PUBLIC_API_BASE_URL=https://yovo-api-gateway-a8da1d8e66a3.herokuapp.com/api/core
NEXT_PUBLIC_STOREFRONT_DOMAIN=savagerise.com
NEXT_PUBLIC_SITE_URL=https://savagerise.com
```

Les deux premières pilotent les appels réels ; SITE_URL sert aux URL publiques/SEO.
Configurer Production et les environnements Preview concernés, puis reconstruire
le frontend car NEXT_PUBLIC est intégré au bundle. `.env.local` a été lu pour
la vérification locale ; les valeurs effectives Vercel restent à confirmer.
Les valeurs de secours sont uniquement la Gateway et savagerise.com.
DOCS_USERNAME/DOCS_PASSWORD servent seulement à la génération shell/CI, jamais
au runtime navigateur ni dans NEXT_PUBLIC. Ne pas configurer l'override local
GATEWAY_SCHEMA_ORIGIN sur Vercel. Aucun secret ajouté aux fichiers.

## Corrections frontend

- `lib/api/api-error.ts` : distinction panne de routage/tenant et produit absent,
  diagnostics structurés serveur sans corps ni secrets.
- `lib/api/response-contracts.ts`, `catalog-api.ts` : validation pagination,
  catégories, détails, prix ; suppression des faux produits à prix zéro et des
  détails manquants silencieux ; effective_price et axes nommés couleur/taille ;
  vrais composants des packs pour leurs montants ; médias/stock conservés.
- `orders-api.ts` : lecture des totaux/remises canoniques et conservation de
  bundle_selection dans le devis ET la commande, avec idempotence existante.
- Pages home/products/packs/catégories et détails : erreurs visibles, pas de liste vide
  fabriquée ; échec des packs associés signalé sans bloquer un produit chargé.
  Frontières d'erreur partagées avec Réessayer/contact. Cache/revalidation 60 s,
  SSR et métadonnées conservés ; les échecs ne deviennent pas des données vides
  mises en cache. Les pages statiques peuvent afficher l'indisponibilité jusqu'à
  leur revalidation après réparation de l'API.
- `ProductDetailClient`, `lib/inventory.ts`, `CartContext` : prix de la variante
  choisie dans la fiche et le panier, SKU choisi, ajout au panier avant analytics.
- Checkout : message utile pour les erreurs API, invalidation immédiate du
  précédent devis et rejet des réponses tardives après modification du panier
  ou de la livraison.
- Analytics : délai réseau borné, échecs sync/async isolés, stockage facultatif
  et cookies malformés tolérés, erreurs Pixel sans blocage du parcours.
- `.env.example` : configuration unique, domaine tenant sans duplication.
- `tests/storefront-recovery.test.mjs` et `tests/fixtures/storefront-api.mjs` :
  tests de régression et API locale explicitement fictive, POST commande désactivé.

## Vérifications

- Suite automatisée : 106 tests réussis, incluant réponses invalides, routage404,
  absence de fuite de secrets dans les diagnostics, prix/axes/stock/images,
  sélections de packs, devis canonique et création de commande **simulée**.
- `tsc --noEmit --incremental false` : réussi séparément du build (le projet
  ignore historiquement les erreurs TypeScript pendant next build).
- `npm run build` : réussi avec la configuration Gateway réelle. Les lectures
  API404 sont signalées ; ce succès de compilation ne prouve pas le rétablissement
  du catalogue. Avertissement Browserslist ancien préexistant.
- Navigateur/API locale fictive : catalogue non vide → fiche → variante L90TND
  → ajout panier → devis97TND (90+7 livraison). Les analytics échouaient
  volontairement ; les actions restaient fonctionnelles. Pas de clic commande.
- Production : erreur SSR initiale observée et routes/API vérifiées réellement.
  Catalogue non vide, fiche réelle, variantes réelles, panier avec produit réel
  et devis réel encore **bloqués par le routage Gateway404**.
- Build de production local relié à la vraie Gateway : `/products` affiche
  « La boutique est momentanément indisponible », Réessayer/contact et une
  référence corrélable aux logs serveur ; le panier est conservé.
- Génération réelle : bloquée par les 51 opérations absentes ; client conservé.

Après correction Gateway, relancer la génération, les lectures et le parcours
réel jusqu'au devis, puis reconstruire/déployer le storefront. Tester la création
de commande uniquement en environnement de test ou par simulation.
