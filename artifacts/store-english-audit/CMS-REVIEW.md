# Contenus dynamiques conservés

Audit des réponses publiques du 23 novembre 2026. Aucune modification dans Studio, Core, Media, Gateway ou en production.

## À revoir dans Studio si la marque souhaite aussi des contenus éditoriaux anglais

| Emplacement publié | Valeur conservée | Observation |
|---|---|---|
| `studio.hero.eyebrow` | `DISPONIBLE MAINTENANT` | Texte CMS, inchangé. |
| `studio.hero.subtitle` | `Une pièce oversized inspirée par l’esprit rebelle de l’hiver tunisien. Disponible maintenant à 89,900 DT.` | Texte et prix publiés conservés, sans substitution frontend. |
| Page `home`, `title` | `Accueil` | Titre de la page dans le document Studio ; conservé même si le Hero affiche son propre titre. |
| Page `about`, bloc de chiffres, description du premier élément | `FONDATION` | Présent dans les `props` et leur projection du document publié. |
| Page `about`, bloc de chiffres, description du troisième élément | `PAYS` | Même conservation du contenu publié. |

Les chiffres **2025**, **50+ ARTISANS** et **3** sont bien présents dans le document About publié. Leur présence dans le CMS a été vérifiée ; ce contrôle ne constitue pas une vérification indépendante de ces affirmations commerciales. Ils n’ont pas été changés. Le badge **100% FAIT MAIN**, ajouté directement par le renderer indépendamment des données CMS, a en revanche été retiré.

## Données Core à ne pas corriger dans le frontend

- OMBRA : sa description commence par « Découvrez le SR OMBRA OVERSIZED HOODIE ». La description et ses projections SEO restent identiques au catalogue.
- Hoodies : description et description SEO « Une pièce oversized inspirée par l’esprit rebelle de l’hiver tunisien », conservées.
- Les descriptions des autres produits et tout texte SEO du catalogue restent fournis par Core. Les réponses complètes sont dans `evidence/public/product-*.json` et `evidence/public/categories.json`.
- Le snapshot OMBRA renvoie les libellés de couleur **`red`, `Brown`, `Pink`, `Green`, `White`, `Black`**. Le frontend conserve ces chaînes, y compris le `r` minuscule. Il ne remplace pas `red` par `Red`, ni `Black` par `Dark Black`.
- Les tests unitaires vérifient séparément les six valeurs demandées **`Brown`, `Red`, `Pink`, `Green`, `White`, `Dark Black`**, ainsi que les espaces, underscores, accents et caractères arabes. Ces données de test ne sont jamais injectées dans le catalogue public.

Les noms commerciaux, dont le titre arabe de FAZA, ne sont pas considérés comme des erreurs de langue. Aucune traduction automatique ne leur est appliquée. Les formats monétaires et le paramètre de locale de la boutique restent ceux de la configuration dynamique.

## Origine de la newsletter

`lib/storefront/content.ts` renvoie `storefrontFallbackContent`. Le titre et la description de cette section sont statiques ; aucune connexion CMS de newsletter n’existait à supprimer. Le formulaire retiré ne transmettait aucune inscription à un service : il attendait puis émettait un événement analytique. L’état d’attente décrit maintenant cette disponibilité sans proposer de saisie trompeuse.

Preuves : `evidence/public/studio.json`, `evidence/cms-copy-to-review.json`, `evidence/english-browser.json`, `evidence/flows/checks.json`, `evidence/preservation.json`.
