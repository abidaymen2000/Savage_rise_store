# Mesures — Hero et navigation, 24 novembre 2026

## Production, lectures seules

Trois échantillons GET par endpoint, même tenant `savagerise.com`, sans commande, connexion client, changement CMS ou écriture métier. Médianes mesurées depuis le poste de recette :

| Ressource publique | TTFB | Réponse complète |
|---|---:|---:|
| Catégories via Gateway | 6 679 ms | 6 692 ms |
| Catalogue avec `variant_summary` | 7 011 ms | 7 318 ms |
| OMBRA, 30 variantes | 6 096 ms | 6 415 ms |
| Page Shop Next.js | 7 281 ms | 14 060 ms |
| Fiche OMBRA Next.js | 6 600 ms | 6 716 ms |

Sources locales : `evidence/public-latency.json`, `core-profiles.json`, journaux GET Core/Gateway. La release Core observée est `04fddcf6` du 23 novembre ; les améliorations Core présentes dans l'espace de travail ne sont pas déployées.

Les traces Core confirment l'essentiel de l'attente serveur. Exemple de fiche : 6 091 ms dans Core, dont 5 366 ms cumulées dans les commandes Mongo observées par le client ; 15 `find` et une agrégation. Le contrôle de tenant/permissions prend environ 2 115 ms, dont 1 518 ms pour lire 298 entrées de permissions. Ces durées Mongo comprennent transfert et décodage côté client : elles ne prouvent pas un mauvais index ou un temps d'exécution Atlas équivalent.

Les lectures d'inventaire, promotions, métadonnées d'options et médias étaient séquentielles après les variantes. Les affectations média étaient relues pour la galerie produit ; quand cette galerie possède des affectations, les assets étaient aussi résolus une seconde fois auprès de Media. Pour OMBRA, les galeries sont portées par les variantes : la seconde lecture d'affectations revient vide, donc pas de deuxième appel d'assets dans ce cas précis.

Le catalogue actuellement publié ne fournit pas encore tous les champs de la projection compacte attendue par le Store. Son chemin de compatibilité effectue donc des lectures complètes de produits après la liste. Les optimisations Core déjà présentes corrigent ce point et mutualisent les réglages SEO des catégories. Elles ont été conservées intégralement, sans cache entre requêtes.

Le coût de validation du schéma et de sérialisation de la réponse publique OMBRA est de **1,96 ms en médiane locale**, 100 répétitions, 30 variantes. C'est une mesure locale, pas un profil CPU de la production. Elle ne révèle pas de problème de sérialisation comparable aux secondes d'attente des lectures.

Une observation navigateur supplémentaire en production, un contexte froid par profil et tous les POST bloqués, montre que l'image principale pèse **26 808 octets transférés**. Son chargement commence seulement à 7,71 s desktop / 7,10 s mobile simulé, puis dure 632 / 457 ms. L'attente en amont des médias domine donc ce cas ; le CDN ne suffit pas à expliquer les secondes perdues. La présence des contrôles activés après le marqueur d'hydratation a été observée à 8,28 / 11,51 s ; cette observation n'est pas un INP ni une mesure dans Instagram réel. Les ressources et timings sont conservés dans `evidence/public-media/measurements.json`. L'image y est vérifiée après les contrôles ; le champ historique `heroImageVisibleMs` est donc une borne supérieure de vérification, pas l'instant exact de sa première peinture.

**Piège de mesure identifié et corrigé :** `NavigationTiming.responseStart` affiche ici 399 / 312 ms, alors que le timing réseau du document donne 7 610 / 6 938 ms pour la réponse finale. Un GET de contrôle confirme une réponse **103 Early Hints de Vercel** à 259 ms, puis `finalResponseHeadersStart` à 6 746 ms (`evidence/early-hints.json`). La documentation [Chromium sur les réponses intermédiaires](https://groups.google.com/a/chromium.org/g/blink-dev/c/7Oiu59G4qcY) explique cette différence. Le script `measure-store-performance.mjs` utilise désormais l'heure des en-têtes finaux, avec repli pour les navigateurs anciens, et conserve séparément l'heure des Early Hints. Aucun de ces 259–399 ms n'est présenté comme le temps de disponibilité du produit.

## Comparaison du traitement Core réellement exécuté

Le même service Python `get_storefront_product_by_slug` est exécuté avant/après sur les mêmes fixtures et des adaptateurs de lecture à **150 ms par appel**, trois répétitions. Aucun réseau réel, middleware de tenant ou serveur Atlas n'est inclus. Prix de base, promotion, stock, SKU, options, galerie et sortie SEO sont strictement identiques.

| Mesure du banc Core | Avant | Après |
|---|---:|---:|
| Temps médian | 1 580 ms | 811 ms |
| Lectures d'adaptateurs | 10 | 8 |
| Lecture des affectations média | 2 | 1 |
| Résolution des assets, fixture avec galerie produit | 2 | 1 |
| Réponse métier | référence | identique |

Gain du traitement couvert : **48,6 %**. Ce pourcentage ne constitue pas une promesse de gain global en production. Le contrôle de tenant reste inchangé ; les transactions Motor conservent leurs opérations séquentielles. Les branches indépendantes sont annulées si l'une échoue : aucune fiche partielle achetable n'est renvoyée.

Une liste réellement vide ne lance plus de lectures d'enrichissement, notamment de promotions. Ce cas est fréquent pour les packs lorsque le tenant n'en publie aucun ; le contrôle d'accès et le comptage du catalogue restent exécutés.

## Contrôle navigateur à API constante

Mêmes snapshots publics et même délai de 1 000 ms par requête catalogue, Next **dev** précompilé. Desktop 1440 px ; simulation Instagram à 390 px, agent Android/Instagram, CPU ×4, 8 Mbit/s descendant, 1 Mbit/s montant, latence 150 ms. Trois répétitions par parcours, zéro erreur JavaScript. Les tests ne sont pas exécutés dans l'application Instagram réelle.

| Options utilisables / contenu prêt, médiane | Avant | Après |
|---|---:|---:|
| Desktop : Home → Shop | 2 020 ms | 1 965 ms |
| Desktop : Shop → produit, couleur/taille sélectionnées | 2 265 ms | 2 675 ms |
| Desktop : retour Shop | 164 ms | 228 ms |
| Instagram simulé : Home → Shop | 5 626 ms | 5 250 ms |
| Instagram simulé : Shop → produit, couleur/taille sélectionnées | 6 183 ms | 5 286 ms |
| Instagram simulé : retour Shop | 1 495 ms | 1 391 ms |

Cette fixture maintient volontairement le temps API constant et n'exécute pas le Core optimisé. Les variations du serveur de développement et du poste ne permettent donc pas d'attribuer ces différences à un gain frontend. **Aucun gain global de navigation n'est revendiqué sur ce tableau.** Le gain démontré à la source est celui du traitement Core ci-dessus ; il faut déployer Core pour le mesurer sur la chaîne réelle.

Le clic Hero avant correction ouvrait une modale en 1 652 ms desktop / 2 838 ms mobile ; il n'atteignait jamais la fiche. Après correction, il atteint la fiche utilisable en 2 404 / 5 714 ms dans ce banc. Ces durées correspondent à des résultats différents et ne sont pas comparées comme un gain de vitesse. Les deux GET de vérification dans le navigateur avant navigation sont supprimés. Le parcours courant demande trois GET serveur : produit, packs, configuration ; les options et images sont dans la réponse produit, sans requête par taille. Les POST de télémétrie restent inchangés et sont comptés séparément.

Next 14.2.16 en développement peut émettre un RSC de préchargement partiel puis un RSC de page, même avec préchargement automatique du lien désactivé. L'en-tête `next-router-prefetch: 1`, l'arbre `refetch` et `node_modules/next/dist/client/components/router-reducer/prefetch-cache-utils.js` l'attestent. Selon l'ordonnancement, cela peut relire les métadonnées produit. La canonicalisation de l'ID ne produit aucune requête vers le slug. Elle utilise l'[API History prise en charge par Next 14](https://nextjs.org/docs/14/app/building-your-application/routing/linking-and-navigating#using-the-native-history-api), vérifiée avec rafraîchissement et retour/avance navigateur.

## Limites respectées

- **BLOCKED** : lancement local `next start`, conformément au refus antérieur ; aucune commande équivalente utilisée.
- **BLOCKED** : diagnostic direct Atlas/explain, accès IA désactivé par l'organisation ; aucun contournement.
- **NOT TESTED** : performance après déploiement, build/release Heroku du nouveau Core et application Instagram réelle. Aucun déploiement effectué.
- Les lectures de permissions restent un coût mesuré ; leur logique de sécurité n'est pas modifiée. Le budget réseau de développement ne représente pas le bundle de production : le build annonce 181 kB de premier JavaScript pour la fiche produit.

Reproduction : `scripts/probe-store-latency.mjs`, `scripts/measure-hero-navigation.mjs`, `scripts/measure-store-data.mjs`, et le mode CLI de `tests/unit/catalog/test_storefront_read_plan.py` dans Core. Les résultats bruts sont conservés dans `evidence/`.
