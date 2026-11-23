# Savage Rise — introduction historique

Mode : Experience. Extension ciblée du Store validé ; aucune nouvelle direction globale.

Référence : `9c0cd28606bc28a14600a9531320bb7e63d943d3`, composants EntranceAnimation et EntranceWrapper, palette et polices historiques. La refonte `1f49f78` a retiré le wrapper du layout sans supprimer les composants. Vidéos de reproduction : `artifacts/entrance-restoration/original/`.

Focal moment : deux portes noires à encadrements et poignées dorées s'écartent pour révéler le mot-symbole Savage Rise et les textes d'origine. Conserver cette signature, en affinant les traits et la lumière dans le noir/ivoire/or du Store.

Continuity : la composition centrale se dissout sur la vraie homepage. Le DOM du Store reste monté ; le Hero est suspendu jusqu'à la fin du fondu puis repart sur son image pendant deux secondes.

Feedback : « Passer l’introduction », Échap, focus contenu dans l'introduction puis rendu au Store. Une fois par sessionStorage, comme l'historique ; aucune répétition à la navigation ou à l'actualisation de la même session. Preview privée sans introduction.

Budget : environ 3,3 s au lieu de 5 s ; uniquement transformations et opacité animées, six points lumineux déterministes et finis. Aucun nouveau média, filtre flou animé ou dépendance. Mouvement réduit : signature statique 300 ms et fondu 150 ms. Un contrôleur léger avant le premier affichage termine la séquence même si les chunks React échouent. Sans JavaScript, le contenu reste visible.

Validation : 320, 375, 390, 768, 1440 px ; vidéos et images séquencées ; disponibilité des contrôles, retour du scroll, sessions, CMS, erreur média, nettoyage, absence d'erreurs et délai image du Hero mesuré après introduction. La preuve navigateur finale utilise un serveur de fixture local et ne modifie aucune donnée de production.
