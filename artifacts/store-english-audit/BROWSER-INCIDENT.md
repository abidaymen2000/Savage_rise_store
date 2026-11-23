# Incident de recette : bundle de développement pendant une recompilation

Une première exécution de la suite médias a réussi 7 scénarios sur 8. Le dernier a échoué avant de pouvoir vérifier la suppression des timers : l’application n’était pas hydratée.

## Éléments observés

- Requête de `/_next/static/chunks/app/layout.js` commencée le 23 novembre 2026 à **20:52:55.450 UTC**, durée **8,858 s**, statut HTTP **200**, type `application/javascript; charset=UTF-8`, réponse compressée.
- La dernière correction du libellé accessible du menu dans `app/components/Header.tsx` a été enregistrée à **20:52:57.443 UTC**, donc pendant cette requête. Une recompilation figure dans le journal du serveur de développement.
- Le navigateur signale `Invalid or unexpected token`, puis `ChunkLoadError: Loading chunk app/layout failed`, dans le chargement Webpack. L’erreur précède l’hydratation et les assertions de galerie/timers.
- Playwright n’a pas conservé le corps de cette réponse (`content.size: -1`) : il n’est pas présenté comme un fichier analysé.
- Une première nouvelle lecture pendant la recompilation renvoie **6 422 528 octets** ; l’analyse syntaxique JavaScript échoue à la ligne 3301. SHA-256 : `5cccf5327f51677254445bb408e77333329c577bae3ececa509fe7daff163f26`. Ce corps n’a pas été conservé ; son résultat d’analyse a été enregistré.
- Après stabilisation, le fichier sur disque et la réponse HTTP contiennent tous deux **21 188 303 octets**, passent l’analyse syntaxique et ont le même SHA-256 : `3ae1cea88e25fdaba9eab42c6360d4b83ec932f8f1fb74dbecde6bc2a509c1ea`.

Ces observations identifient un chargement incomplet du bundle de développement concomitant à l’édition/recompilation. Elles ne démontrent aucun défaut dans l’introduction, le Hero ou les timers. Aucun serveur de production n’a été démarré pour contourner l’incident ou le refus antérieur de `next start`.

## Traitement de la recette

La dernière correction de texte a été copiée dans les deux espaces de contrôle, les routes ont été précompilées, le bundle complet a été vérifié, puis les sources ont été laissées stables pendant la nouvelle exécution. La suite médias vérifie désormais l’absence d’erreur JavaScript dans chacun de ses huit scénarios. Les résultats de cette nouvelle exécution sont consignés dans le rapport final ; le premier échec n’est pas compté comme un PASS.

Preuves locales : `evidence/chunk-incident-network.json`, `evidence/chunk-incident-diagnosis.json`, `evidence/chunk-refetched-layout.js`, `evidence/media-tests-intermediate.json`, `evidence/dev.log` et `evidence/media-tests.json` pour le résultat final.

Autre faux positif de recette corrigé : le script de test anglais injectait initialement un accès à `sessionStorage` dans l’iframe de Contact. La stack pointait vers cette injection, sans fichier applicatif. L’initialisation de test est désormais limitée au document principal ; les erreurs JavaScript de l’application restent intégralement contrôlées. Le résultat intermédiaire est conservé dans `evidence/english-browser-intermediate.json`.
