# Mesures Black et performances — 24 novembre 2026

Mesures de laboratoire Chrome. Un passage par profil navigateur ; aucun p75 ou INP de terrain. Desktop : 1440 × 1000, CPU/réseau sans limitation. Mobile : 390 × 844, DPR 2, CPU ×4, descendant 1,6 Mbit/s, montant 750 kbit/s, latence 150 ms. Les navigations chaudes réutilisent le même contexte. Les écritures externes sont bloquées.

Les comparaisons avant/après utilisent le même Next de développement autorisé, des routes précompilées, les mêmes instantanés publics et le même délai API injecté de 1 000 ms. La charge de la machine partagée varie : les écarts de rendu/CPU, particulièrement desktop, ne sont pas tous attribuables au correctif. Les bundles de développement ne représentent pas ceux de production.

TTFB/LCP concernent les chargements de document. « — » sur navigation client signifie non applicable, pas zéro. Interaction max est la plus longue interaction observée pendant cette étape, pas un INP certifié. JS mesure les octets transférés observés, pas le poids total du code exécuté. Le nombre d’images compte les requêtes déclenchées dans cette fenêtre, y compris le lazy loading ; il ne mesure pas seul une économie.

## Comparaison navigateur locale (avant → après)

### desktop

| Parcours | Navigation ms | TTFB ms | LCP ms | Interaction max ms | CLS |
|---|---:|---:|---:|---:|---:|
| cold-home | 17 013 → 4 087 | 7 971 → 1 148 | 17 256 → 3 104 | — → — | 0.0045 → 0.0045 |
| home-shop | 9 254 → 2 006 | — → — | — → — | 40 → 24 | 0.0639 → 0.0000 |
| shop-ombra | 5 752 → 1 626 | — → — | — → — | 80 → 32 | 0.0000 → 0.0000 |
| ombra-shop | 294 → 143 | — → — | — → — | 72 → 32 | 0.0000 → 0.0000 |
| shop-ombra-warm | 130 → 87 | — → — | — → — | 40 → 32 | 0.0000 → 0.0000 |
| refresh-ombra | 7 990 → 2 753 | 2 004 → 1 110 | 2 496 → 1 756 | — → — | 0.0005 → 0.0005 |
| id-ombra | 5 224 → 2 804 | 1 329 → 1 131 | 3 940 → 1 264 | — → — | 0.0005 → 0.0005 |
| about | 4 750 → 417 | — → — | — → — | 376 → 32 | 0.0000 → 0.0000 |
| back | 89 → 48 | — → — | — → — | — → — | 0.0000 → 0.0000 |
| on-route | 4 612 → 1 382 | 4 060 → 1 194 | 4 744 → 1 332 | — → — | 0.0005 → 0.0005 |
| on-shop | 7 391 → 1 535 | — → — | — → — | 24 → 32 | 0.0000 → 0.0000 |

| Parcours | Appels API observés côté fixture (après) | JS Kio avant → après | Images avant → après | Fenêtre données produits après, ms |
|---|---:|---:|---:|---:|
| cold-home | 5 | 8465.4 → 8474.4 | 18 → 18 | 1 023 |
| home-shop | 3 | 1064.5 → 1069.8 | 6 → 9 | 1 019 |
| shop-ombra | 3 | 1018.1 → 1022.9 | 4 → 4 | 1 010 |
| ombra-shop | 0 | 0.0 → 0.0 | 12 → 3 | — |
| shop-ombra-warm | 0 | 0.0 → 0.0 | 0 → 3 | — |
| refresh-ombra | 5 | 8405.6 → 8414.4 | 5 → 5 | 1 013 |
| id-ombra | 5 | 8405.6 → 8414.4 | 5 → 5 | 1 013 |
| about | 4 | 73.6 → 73.6 | 0 → 0 | — |
| back | 0 | 0.0 → 0.0 | 0 → 0 | — |
| on-route | 3 | 7289.7 → 7292.4 | 1 → 1 | — |
| on-shop | 3 | 1064.5 → 1069.8 | 15 → 14 | 1 035 |

### mobile

| Parcours | Navigation ms | TTFB ms | LCP ms | Interaction max ms | CLS |
|---|---:|---:|---:|---:|---:|
| cold-home | 57 473 → 54 641 | 2 718 → 1 163 | 57 640 → 54 604 | — → — | 0.0015 → 0.0001 |
| home-shop | 14 303 → 9 831 | — → — | — → — | 1 264 → 624 | 0.1090 → 0.0000 |
| shop-ombra | 8 771 → 8 221 | — → — | — → — | 232 → 48 | 0.0000 → 0.0000 |
| ombra-shop | 1 918 → 1 133 | — → — | — → — | 128 → 64 | 0.0000 → 0.0000 |
| shop-ombra-warm | 1 090 → 868 | — → — | — → — | 112 → 48 | 0.0000 → 0.0000 |
| refresh-ombra | 48 826 → 48 028 | 1 335 → 1 139 | 3 980 → 2 264 | — → — | 0.0000 → 0.0000 |
| id-ombra | 48 926 → 47 666 | 1 232 → 1 145 | 2 856 → 2 204 | — → — | 0.0000 → 0.0000 |
| about | 2 307 → 2 048 | — → — | — → — | 464 → 320 | 0.0000 → 0.0000 |
| back | 824 → 393 | — → — | — → — | — → — | 0.0000 → 0.0000 |
| on-route | 3 125 → 2 491 | 1 300 → 1 071 | 2 672 → 2 272 | — → — | 0.0000 → 0.0000 |
| on-shop | HARNESS ERROR → 45 822 | — → — | — → — | — → 344 | — → 0.0000 |

| Parcours | Appels API observés côté fixture (après) | JS Kio avant → après | Images avant → après | Fenêtre données produits après, ms |
|---|---:|---:|---:|---:|
| cold-home | 5 | 8465.3 → 8474.4 | 10 → 9 | 1 015 |
| home-shop | 3 | 1064.5 → 1069.8 | 8 → 10 | 1 012 |
| shop-ombra | 3 | 1018.1 → 1022.9 | 6 → 5 | 1 007 |
| ombra-shop | 0 | 0.0 → 0.0 | 2 → 8 | — |
| shop-ombra-warm | 0 | 0.0 → 0.0 | 2 → 3 | — |
| refresh-ombra | 5 | 8405.6 → 8414.4 | 5 → 5 | 1 007 |
| id-ombra | 5 | 8405.6 → 8414.4 | 5 → 6 | 1 016 |
| about | 4 | 73.6 → 73.6 | 0 → 0 | — |
| back | 0 | 0.0 → 0.0 | 5 → 0 | — |
| on-route | 3 | 183.0 → 183.1 | 1 → 1 | — |
| on-shop | 3 | 0.0 → 1069.8 | 0 → 9 | 1 017 |

Les appels SSR avant n’étaient pas instrumentés dans la première campagne navigateur. La comparaison exacte avant/après des appels et durées de données figure dans FINAL-REPORT.md : trois passages HTML par route, chaque appel compté côté fixture. Les compteurs du parcours navigateur capturent les appels de la fenêtre de mesure, provenant du serveur et du navigateur. Une fenêtre sans lecture produit apparaît « — ». Les 22 étapes après réussissent sans erreur JavaScript. Le dernier trajet mobile `/on` → Shop avant est invalide : le script cliquait avant l’hydratation du menu 404 ; le harnais final attend celle-ci.

Le CLS de 0,1090 sur accueil → Shop a été diagnostiqué par les rectangles LayoutShift : la marge de 92 px du Hero se propageait au body. Le correctif contient cette marge dans le main. La contre-épreuve ciblée donne zéro déplacement non lié à une interaction ; la valeur du parcours complet final figure ci-dessus. Les interactions de laboratoire et le LCP de développement ne valident pas les seuils de production.

## Site public avant correction

Ce déploiement porte le SHA 0cb61581ad7b4fd61a1bed048b38c802e341c006. Les nouvelles sources ne sont pas déployées. Aucune comparaison directe entre ces temps de production et le serveur local de développement ne serait valide.

| Profil/parcours | Navigation ms | TTFB ms | LCP ms | Interaction max ms | CLS | JS Kio | Images |
|---|---:|---:|---:|---:|---:|---:|---:|
| desktop/cold-home | 18 273 | 227 | 20 148 | — | 0.0045 | 239.0 | 18 |
| desktop/home-shop | 18 406 | — | — | 24 | 0.0639 | 175.2 | 3 |
| desktop/shop-ombra | 2 330 | — | — | 40 | 0.0000 | 16.4 | 4 |
| desktop/ombra-shop | 295 | — | — | 24 | 0.0000 | 0.0 | 0 |
| desktop/shop-ombra-warm | 161 | — | — | 32 | 0.0000 | 0.0 | 0 |
| desktop/refresh-ombra | 9 291 | 85 | 9 272 | — | 0.0005 | 0.0 | 5 |
| desktop/id-ombra | 12 528 | 93 | 12 456 | — | 0.0005 | 0.0 | 5 |
| desktop/about | 10 866 | — | — | 24 | 0.0000 | 0.8 | 0 |
| desktop/back | 155 | — | — | — | 0.0000 | 0.0 | 0 |
| desktop/on-route | HARNESS ERROR | — | — | — | — | 0.0 | 1 |
| desktop/on-shop | 14 837 | — | — | 40 | 0.0000 | 0.0 | 13 |
| mobile/cold-home | 21 944 | 1 246 | 21 892 | — | 0.0000 | 507.9 | 9 |
| mobile/home-shop | 18 629 | — | — | 520 | 0.0000 | 6.3 | 10 |
| mobile/shop-ombra | 2 095 | — | — | 104 | 0.0000 | 16.3 | 4 |
| mobile/ombra-shop | 1 217 | — | — | 88 | 0.0000 | 0.0 | 8 |
| mobile/shop-ombra-warm | 1 308 | — | — | 88 | 0.0000 | 0.0 | 1 |
| mobile/refresh-ombra | 11 720 | 160 | 11 568 | — | 0.0000 | 0.0 | 5 |
| mobile/id-ombra | 11 841 | 158 | 11 676 | — | 0.0000 | 0.0 | 5 |
| mobile/about | 15 261 | — | — | 232 | 0.0000 | 0.8 | 0 |
| mobile/back | 623 | — | — | — | 0.0000 | 0.0 | 0 |
| mobile/on-route | HARNESS ERROR | — | — | — | — | 0.0 | 1 |
| mobile/on-shop | 14 886 | — | — | 192 | 0.0000 | 0.0 | 9 |

Les deux lignes publiques `/on-route` ont un timeout de harnais (attente de `<main>` absent de la 404). Le statut HTTP 404 et les sorties vers Shop ont été observés ; ces temps ne sont pas présentés comme des mesures valides. Shop → OMBRA public, y compris à chaud, reçoit encore Dark Black : cette réponse obsolète rapide ne peut servir de référence de réussite. Les requêtes SSR réelles ne sont pas visibles depuis le seul navigateur public.

Sources brutes : `evidence/public-browser/measurements.json`, `evidence/before-browser/measurements.json`, `evidence/after-browser-final-cls/measurements.json`, `evidence/data-comparison.json`. Les campagnes intermédiaires restent dans `after-browser` et `after-browser-final` ; elles ne sont pas présentées comme des mesures du dernier correctif de marge.
