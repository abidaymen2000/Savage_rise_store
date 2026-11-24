# Déploiement manuel — Windows CMD

Commandes destinées à l'opérateur, **non exécutées par Codex**. Lire le verdict final avant de les utiliser. Vérifier `main` et examiner les différences indexées avant chaque commit ; ne pas intégrer d'autres travaux par inadvertance. Aucun changement de configuration CMS/ERP, de Gateway, de données ni migration n'est requis.

## Core en premier

Inclut les optimisations compactes et SEO précédemment préparées, encore absentes de la release observée `04fddcf6`. Le Store conserve sa compatibilité avec l'ancien Core, mais le gain sur les cartes nécessite ces champs compacts.

```cmd
cd /d C:\Users\ASUS\Desktop\YOVO\Back-end\yovo-core-service
git branch --show-current
git status --short
git diff --check
git add app/schemas/catalog/product.py app/services/catalog/category_service.py app/services/catalog/product_service.py app/services/catalog/media_service.py app/services/cms/seo_service.py
git add tests/unit/catalog/test_product_listing_summary.py tests/unit/catalog/test_category_seo_batch.py tests/unit/catalog/test_storefront_read_plan.py
git diff --cached --stat
git diff --cached
git commit -m "Optimize live storefront catalogue and product reads"
heroku git:remote -a yovo-core-service
git push heroku main
heroku releases --app yovo-core-service --num 2
```

La commande `git push heroku main` déploie Core. Contrôler les GET existants via Gateway : catégories complètes, champs compacts `sku`, `position`, `status`, `track_inventory`, prix/stock/options inchangés, média principal par couleur. Aucun test ne doit créer de commande réelle. Les variables et secrets Heroku existants sont conservés.

## Store ensuite

```cmd
cd /d C:\Users\ASUS\Desktop\Savage_Rise\Savage_rise_store
git branch --show-current
git status --short
git diff --check
git add "app/products/[id]/page.tsx" components/studio-hero-action.tsx components/product-canonical-location.tsx lib/hero-purchase.ts
git add tests/hero-purchase.test.mjs tests/e2e/hero-navigation.mjs scripts/measure-hero-navigation.mjs scripts/probe-store-latency.mjs scripts/measure-store-performance.mjs
git add artifacts/hero-navigation-performance/FINAL-REPORT.md artifacts/hero-navigation-performance/PERFORMANCE-MEASUREMENTS.md artifacts/hero-navigation-performance/MANUAL-DEPLOYMENT.md
git diff --cached --stat
git diff --cached
git commit -m "Navigate Studio Hero actions to the configured premium product"
git push origin main
```

Le push utilise le pipeline Vercel habituel. Vérifier le SHA et le domaine `www.savagerise.com`. Ne pas transférer les dossiers `.tmp/qa`, les URL `127.0.0.1` de recette ni les tokens fictifs dans l'environnement de production. Aucun `next start` local n'est nécessaire ni proposé.

## Contrôles publics après déploiement

En fenêtre privée : Hero → fiche configurée sans modale ; Shop → produit → retour ; catégories et variantes complètes ; Black, prix et SKU historiques conservés ; introduction et cycle image/vidéo. Répéter sur mobile et dans l'application Instagram réelle. Les essais d'achat restent sur fixtures.

Pour refaire uniquement les mesures GET publiques :

```cmd
cd /d C:\Users\ASUS\Desktop\Savage_Rise\Savage_rise_store
node scripts/probe-store-latency.mjs
```

Cette commande actualise les fichiers locaux `evidence/public*`. Archiver d'abord la série précédente si elle doit être conservée. Comparer les médianes avec les mêmes données, réseau et état de cache ; ne pas présenter le gain de 48,6 % du banc Core comme un gain de bout en bout déjà acquis.
