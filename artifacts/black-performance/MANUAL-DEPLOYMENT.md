# Déploiement manuel — commandes Windows CMD

Ces commandes sont fournies pour l'opérateur. Aucune n'a été exécutée pour créer un commit, pousser ou déployer. Lire d'abord le verdict et les limites de `FINAL-REPORT.md`. Ne pas déployer les copies `.tmp/qa` : elles utilisent une API de recette locale.

L'extension Core est additive. Déployer Core avant le Store permet de bénéficier immédiatement de la suppression des lectures complètes par carte. Avec l'ancien Core, le Store conserve son chemin de lecture complet. Aucune migration MongoDB n'est nécessaire.

## 1. Core

Vérifier que la branche est toujours `main` et examiner les changements sélectionnés, notamment si un autre travail a été ajouté depuis cette recette.

```cmd
cd /d C:\Users\ASUS\Desktop\YOVO\Back-end\yovo-core-service
git branch --show-current
git status --short
git diff --check
git diff -- app/schemas/catalog/product.py app/services/catalog/product_service.py app/services/catalog/category_service.py app/services/cms/seo_service.py tests/unit/catalog/test_product_listing_summary.py
git add app/schemas/catalog/product.py app/services/catalog/product_service.py app/services/catalog/category_service.py app/services/cms/seo_service.py tests/unit/catalog/test_product_listing_summary.py tests/unit/catalog/test_category_seo_batch.py
git diff --cached --stat
git diff --cached
git commit -m "Optimize storefront catalogue projections and category SEO reads"
heroku git:remote -a yovo-core-service
git push heroku main
```

La dernière commande déclenche le déploiement Heroku. Vérifier ensuite les réponses publiques existantes via Gateway : `include=variant_summary` doit fournir les SKU, positions, statuts, suivi d'inventaire et catégories complètes. Les cinq variantes OMBRA doivent toujours exposer Black, 89,900 DT et leurs SKU historiques. Les réglages SEO de catégories restent frais entre deux requêtes.

## 2. Store

```cmd
cd /d C:\Users\ASUS\Desktop\Savage_Rise\Savage_rise_store
git branch --show-current
git status --short
git diff --check
git add app/components/FeaturedProducts.tsx app/layout.tsx app/page.tsx "app/products/[id]/page.tsx" app/products/page.tsx lib/api/catalog-api.ts lib/catalog-card-detail.ts lib/storefront/catalog-server.ts
git add tests/catalog-next-cache.test.mjs tests/catalog-card-performance.test.mjs tests/e2e/catalog-resilience-server.mjs scripts/measure-store-data.mjs scripts/measure-store-performance.mjs scripts/verify-black-performance.mjs
git add artifacts/black-performance/FINAL-REPORT.md artifacts/black-performance/PERFORMANCE-MEASUREMENTS.md artifacts/black-performance/MANUAL-DEPLOYMENT.md
git diff --cached --stat
git diff --cached
git commit -m "Refresh canonical product data and reduce storefront request waterfalls"
git push origin main
```

Le push doit déclencher le pipeline Vercel habituel du dépôt. Vérifier le SHA du nouveau déploiement et l'association au domaine `www.savagerise.com`. Utiliser les variables de production existantes ; aucune variable de la fixture locale ne doit être transférée. Aucun lancement local de `next start` n'est demandé ici : son refus reste respecté.

## 3. Contrôles après déploiement

1. En fenêtre privée, ouvrir l'accueil puis Shop → OMBRA. Répéter avec rafraîchissement, retour navigateur, navigation chaude et URL par ID. Le corps RSC et le DOM doivent contenir Black ; la pastille doit être noire. Vérifier XS/S/M/L/XL, photos, 89,900 DT et SKU historiques, sans commande commerciale réelle.
2. Contrôler les journaux GET Core/Gateway : une page de cartes ne doit plus demander une fiche complète par produit avec le nouveau contrat. Comparer les durées des catégories et le nombre de lectures SEO aux preuves avant. Vérifier la fraîcheur du prix, du stock et des devis checkout ; ne pas soumettre de commande de production.
3. Vérifier les contenus publiés et menus Studio sur le domaine public. Tester la sauvegarde, l'aperçu privé et la publication dans un tenant de recette autorisé, puis l'invalidation côté Store. Aucun contenu public ne doit être remplacé pour ce test.
4. Aux largeurs 320, 375, 390, 768 et 1440 px : portes/mot-symbole, transition avec image ou secours local, image deux secondes, film complet, image deux secondes, répétition ; pas de rejeu à chaque navigation. Vérifier Échap, passage, mouvement réduit, stockage refusé, FAZA, galeries manuelles, panier et navigation mobile. `/on` reste une 404 et doit permettre de revenir à Shop.
5. Rejouer le protocole navigateur à froid et à chaud sur le **nouveau build public**, avec réseau et CPU mobiles limités et desktop. Conserver TTFB, LCP, CLS, interactions, octets JS/images, durées API et erreurs. Diagnostiquer tout écart à CLS ≤ 0,1 et interactions ≤ 200 ms. La cible LCP mobile p75 ≤ 2,5 s exige un échantillon suffisant ; un passage de laboratoire ne la prouve pas. N'activer aucune nouvelle télémétrie ni modifier le consentement pour obtenir ces mesures.
6. Confirmer la récupération après panne/retard image, vidéo et catalogue dans l'environnement de recette. Sur production, rester en lecture seule et vérifier les erreurs effectivement remontées. Le verdict global ne devient validé qu'une fois les critères fonctionnels et de performance encore ouverts satisfaits. Les restrictions d'accès restent documentées ; elles n'autorisent aucun contournement.
