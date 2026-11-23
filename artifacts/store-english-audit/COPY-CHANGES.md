# Journal des textes et modifications frontend

État comparé au commit de départ `05c964a757dffe30992c0d0455031ce39a756ed6`. Les tableaux relèvent les littéraux retirés et ajoutés ; une ligne multiple correspond à un même bloc de code modifié. Aucun dictionnaire de traduction à l’exécution.

## app/api/preview/route.ts

| Avant | Après |
|---|---|
| Origine de l’aperçu refusée | Preview origin not allowed |
| Accès temporaire manquant. Ouvrez un nouvel aperçu depuis Studio. | Temporary access is missing. Open a new preview from Studio. |
| Le service d’aperçu est mal configuré. Contactez votre administrateur. | Preview is not configured correctly. Contact your administrator. |
| Le service d’aperçu a renvoyé une réponse incompatible. Contactez votre administrateur. | Preview returned an incompatible response. Contact your administrator. |
| Renouvelez l’aperçu après la mise à jour des services. | Open a new preview after the services have been updated. |
| Votre accès temporaire a expiré. Renouvelez l’aperçu depuis Studio. | Your temporary access has expired. Open a new preview from Studio. |
| Le navigateur ne conserve pas l’accès privé dans cet aperçu. Ouvrez le brouillon enregistré dans un onglet. | Your browser cannot retain private access in this preview. Open the saved draft in a new tab. |

## app/checkout/page.tsx

| Avant | Après |
|---|---|
| Chargement de votre commande… | Loading your order… |
| Les achats sont désactivés dans l’aperçu privé. | Purchases are disabled in private preview. |
| Votre total a été actualisé. Vérifiez le montant puis cliquez sur Commander pour confirmer. | Your total has been updated. Review the amount, then select Place Order to confirm. |
| Cet achat rapide a expiré. Votre panier habituel est conservé. | This quick checkout has expired. Your regular bag is saved. |
| Retrouver mon panier | Return to My Bag |
| Cet achat rapide a expiré. Revenez à la fiche pour retrouver votre modèle. / Achat rapide · votre panier habituel est conservé. | This quick checkout has expired. Return to the product to select your options again. / Quick checkout · your regular bag is saved. |
| Retour au produit | Back to Product |
| Retrouver mon panier | Return to My Bag |
| Commande | Checkout |
| • Qté : | • Qty: |
| • Qté : | • Qty: |
| Informations de livraison | Shipping Details |
| Téléphone * | Phone * |
| Adresse * | Address * |
| Note facultative | Order Note (Optional) |
| Livraison | Shipping |
| Calcul de la livraison… | Calculating shipping… |
| À calculer | To Be Calculated |
| Total validé. Paiement à la livraison, sans encaissement immédiat. / Vérification automatique du total et de la livraison en cours. | Total confirmed. Pay on delivery; you will not be charged now. / Confirming your order total and shipping. |
| Paiement à la livraison | Cash on Delivery |
| Confirmation… / Commander • | Confirming… / Place Order • |

## app/checkout/success/page.tsx

| Avant | Après |
|---|---|
| Commande reçue | Order Received |
| Total validé · paiement à la livraison | Total confirmed · cash on delivery |

## app/components/AuthModal.tsx

| Avant | Après |
|---|---|
| Enter your email above, then click if you did not receive the email. | Enter your email address above to request a new verification email. |

## app/components/Cart.tsx

| Avant | Après |
|---|---|
| Final prices and shipping are confirmed by the backend at checkout | Final prices and shipping are confirmed at checkout. |
| Livraison | Shipping |
| To calculate | Calculated at Checkout |
| — | Open Bag ( / ) |
| Cart ( | Bag ( |
| Your cart is empty | Your bag is empty |
| Add products to start shopping | Find your next piece in the shop. |
| Couleur : | Color: |
| Taille : | Size: |

## app/components/CurtainAnimation.tsx

| Avant | Après |
|---|---|
| Entrez dans l&apos;excellence | Enter a World of Excellence |

## app/components/EntranceAnimation.tsx

| Avant | Après |
|---|---|
| Introduction Savage Rise | Savage Rise Introduction |
| Passer l’introduction | Skip Introduction |

## app/components/FeaturedProducts.tsx

| Avant | Après |
|---|---|
| Composer le pack | Build the Pack |
| Acces rapide | Quick Access |
| Boutique | Shop |
| Voir tout | View All |
| Nouveautés | New Arrivals |
| Voir la collection | View the Collection |
| Aucun produit actif disponible pour le moment. | No pieces available right now. Check back for the next drop. |
| Packs actifs | Available Packs |

## app/components/Footer.tsx

| Avant | Après |
|---|---|
| Streetwear born in Tunisia. Chaque Drop ouvre un nouveau chapitre; FAZA transforme le quotidien tunisien en pieces limitees. | Streetwear born in Tunisia. Every drop opens a new chapter. FAZA turns everyday Tunisian life into limited pieces. |
| Tunisie · | Tunisia · |
| · Paiement a la livraison | · Cash on Delivery |

## app/components/Header.tsx

| Avant | Après |
|---|---|
| Nouveautes | New Arrivals |
| Boutique | Shop |
| Voir tout | View All |
| Notre histoire | About |
| Guide des tailles | Size Guide |
| Livraison et echanges | Shipping & Exchanges |
| Recherche | Search |
| Mon profil | My Profile |
| Mes commandes | My Orders |
| Se deconnecter | Sign Out |
| Compte | Account |
| Fermer le menu / Ouvrir le menu | Close Menu / Open Menu |
| Fermer | Close |
| Menu mobile | Mobile Menu |
| Fermer le menu | Close Menu |
| Boutique, Drops et FAZA | Shop, Drops & FAZA |
| Compte | Account |
| Mon profil | My Profile |
| Se deconnecter | Sign Out |
| Se connecter | Sign In |

## app/components/Hero.tsx

| Avant | Après |
|---|---|
| Disponible maintenant / j | Available Now / d |
| Drop disponible | Drop Available |
| Voir le Drop | Explore the Drop |

## app/components/Newsletter.tsx

| Avant | Après |
|---|---|
| react / @/components/ui/button / @/components/ui/input | — |
| @/lib/store-analytics / idle / loading / error / disabled / idle / L'inscription newsletter sera activee prochainement. / error / Entre une adresse email valide. / loading / form_submitted / newsletter / homepage_newsletter / pending / disabled / Merci. L'inscription automatique n'est pas encore connectee; suis Instagram pour les Drops en attendant. | — |
| text-xs font-semibold uppercase tracking-[0.24em] text-accent / Newsletter | text-xs font-semibold uppercase tracking-[0.24em] text-foreground dark:text-accent / THE INNER CIRCLE |
| mt-4 max-w-xl leading-7 text-stone-300 / space-y-3 / newsletter-email / sr-only / Email / flex flex-col gap-3 sm:flex-row / newsletter-email / email / email@example.com / h-12 rounded-none border-input bg-card text-card-foreground placeholder:text-muted-foreground dark:bg-black dark:text-white / newsletter-status / submit / loading / h-12 rounded-none bg-primary px-6 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground hover:bg-accent hover:text-accent-foreground / loading / Verification / Recevoir les Drops / newsletter-status / error / alert / status / text-sm / error / text-red-300 / text-stone-400 | mt-4 max-w-xl leading-7 text-foreground dark:text-stone-200 / max-w-xl leading-7 text-foreground dark:text-stone-200 / Something exclusive is coming. Stay tuned for early access to our next drops. |

## app/components/ThemeToggle.tsx

| Avant | Après |
|---|---|
| Systeme / Systeme | System / System |
| Clair / Clair | Light / Light |
| Sombre / Sombre | Dark / Dark |

## app/error.tsx

| Avant | Après |
|---|---|
| La boutique est momentanément indisponible. | The store is temporarily unavailable. |
| Vos informations restent dans votre navigateur. Réessayez dans un instant. | Your details are saved in your browser. Please try again shortly. |
| Réessayer | Try Again |

## app/layout.tsx

| Avant | Après |
|---|---|
| La boutique est momentanement en maintenance. Nous revenons tres vite. / La boutique est actuellement indisponible. | The store is undergoing maintenance. Please check back soon. / The store is currently unavailable. Please check back soon. |
| Boutique indisponible | Store Unavailable |
| — | en |

## app/packs/[id]/page.tsx

| Avant | Après |
|---|---|
| Impossible de préparer cet achat. / Acheter maintenant | This purchase could not be prepared. Please try again. / Buy Now |
| Ajouter au panier | Add to Bag |

## app/packs/page.tsx

| Avant | Après |
|---|---|
| No active packs available yet. | No packs available right now. Explore our latest pieces in the shop. |

## app/preview/route.ts

| Avant | Après |
|---|---|
| <!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="robots" content="noindex,nofollow"><title>Aperçu de la boutique</title><style nonce=" / ">body{margin:0;padding:32px 20px;background:#f8faf9;color:#17251f;font:16px/1.6 system-ui,sans-serif}main{max-width:560px;margin:10vh auto;background:white;padding:28px;border:1px solid #dce5df;border-radius:16px}h1{font-size:24px;line-height:1.3}a{display:inline-block;color:#175a3b;padding:12px 0}a:focus-visible{outline:3px solid #175a3b;outline-offset:4px}</style></head><body><main><h1>Ouverture de l’aperçu</h1><p id="state" role="status">Vérification de votre accès temporaire…</p> | <!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="robots" content="noindex,nofollow"><title>Store Preview</title><style nonce=" / ">body{margin:0;padding:32px 20px;background:#f8faf9;color:#17251f;font:16px/1.6 system-ui,sans-serif}main{max-width:560px;margin:10vh auto;background:white;padding:28px;border:1px solid #dce5df;border-radius:16px}h1{font-size:24px;line-height:1.3}a{display:inline-block;color:#175a3b;padding:12px 0}a:focus-visible{outline:3px solid #175a3b;outline-offset:4px}</style></head><body><main><h1>Opening Preview</h1><p id="state" role="status">Checking your temporary access…</p> |
| /admin/cms/website-studio" target="_top" rel="noreferrer">Retourner dans Studio</a> | /admin/cms/website-studio" target="_top" rel="noreferrer">Return to Studio</a> |
| ,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token,path}),signal:AbortSignal.timeout(25000)}); const result=await response.json().catch(()=>({})); if(!response.ok){report(result.code\|\|'PREVIEW_UNAVAILABLE',response.status);throw new Error(result.error \|\| 'Le service d’aperçu est indisponible.');} if(typeof result.location!=='string'\|\|!result.location.startsWith('/')\|\|result.location.startsWith('//'))throw new Error('Adresse d’aperçu invalide.'); const confirmation=await fetch( / ,{cache:'no-store',signal:AbortSignal.timeout(10000)}); if(!confirmation.ok){report('PREVIEW_COOKIE_UNAVAILABLE',401);throw new Error('Le navigateur ne conserve pas l’accès privé. Ouvrez le brouillon enregistré dans un onglet.');} location.replace(result.location); }catch(error){const state=document.getElementById('state');state.setAttribute('role','alert');state.textContent=error.name==='TimeoutError'?'Le service d’aperçu met trop de temps à répondre. Réessayez depuis Studio.':error.message;if(error.name==='TimeoutError'\|\|error.name==='TypeError')report('PREVIEW_UNAVAILABLE',503);} })();</script></body></html> | ,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token,path}),signal:AbortSignal.timeout(25000)}); const result=await response.json().catch(()=>({})); if(!response.ok){report(result.code\|\|'PREVIEW_UNAVAILABLE',response.status);throw new Error(result.error \|\| 'Preview is unavailable. Please try again.');} if(typeof result.location!=='string'\|\|!result.location.startsWith('/')\|\|result.location.startsWith('//'))throw new Error('Invalid preview address.'); const confirmation=await fetch( / ,{cache:'no-store',signal:AbortSignal.timeout(10000)}); if(!confirmation.ok){report('PREVIEW_COOKIE_UNAVAILABLE',401);throw new Error('Your browser cannot retain private access. Open the saved draft in a new tab.');} location.replace(result.location); }catch(error){const state=document.getElementById('state');state.setAttribute('role','alert');state.textContent=error.name==='TimeoutError'?'Preview is taking too long to respond. Please try again from Studio.':error.message;if(error.name==='TimeoutError'\|\|error.name==='TypeError')report('PREVIEW_UNAVAILABLE',503);} })();</script></body></html> |

## app/products/[id]/ProductDetailClient.tsx

| Avant | Après |
|---|---|
| Retour boutique | Back to Shop |
| Agrandir la photo | Enlarge Image |
| Galerie produit | Product Gallery |
| Photo précédente | Previous Image |
| Photo suivante | Next Image |
| En stock | In Stock |
| Stock faible — bientôt épuisé | Low Stock — Selling Fast |
| Couleur | Color |
| Couleur | Color |
| Taille | Size |
| Guide des tailles | Size Guide |
| stock limite | Limited Stock |
| Quantité | Quantity |
| Diminuer la quantité | Decrease Quantity |
| Augmenter la quantité | Increase Quantity |
| Ajouter au panier - / Choisir une taille | Add to Bag - / Select Size |
| Achat rapide indisponible. | Quick checkout is unavailable. |
| Acheter maintenant | Buy Now |
| Completer le look | Complete the Look |
| Couleur coordonnee : / Couleur du set : | Matching Color: / Set Color: |
| Commande la piece seule ou complete le set lorsque le pack est disponible. | Shop the piece on its own or complete the look with an available pack. |
| Economise | Save |
| Set coordonne. Choisis la taille de chaque piece separement. | A coordinated set. Choose the size of each piece separately. |
| Ajouter le pack - | Add Pack to Bag - |
| Details produit | Product Details |
| Matiere : | Fabric: |
| Composition : | Composition: |
| Entretien : | Care: |
| Livraison dans toute la Tunisie | Shipping Across Tunisia |
| Echange de taille disponible selon disponibilite | Size Exchanges Subject to Availability |
| Paiement a la livraison | Cash on Delivery |

## app/products/[id]/error.tsx

| Avant | Après |
|---|---|
| Produit momentanément indisponible | Product Temporarily Unavailable |
| La connexion se rétablit automatiquement. Votre panier est conservé. | Reconnecting automatically. Your bag is saved. |

## app/products/[id]/page.tsx

| Avant | Après |
|---|---|
| Produit introuvable \| Savage Rise | Product Not Found \| Savage Rise |
| Produit Savage Rise | Savage Rise Product |

## app/products/error.tsx

| Avant | Après |
|---|---|
| Impossible de charger le catalogue. | The catalog could not be loaded. |
| Reessayer | Try Again |

## app/products/page.tsx

| Avant | Après |
|---|---|
| Boutique | Shop |
| produit | product |
| Aucun produit trouve. | No products found. |
| Essaie une autre taille, couleur ou categorie. | Try another size, color, or category. |
| Voir toute la boutique | View All Products |
| Pagination catalogue | Catalog Pages |
| Precedent | Previous |
| Suivant | Next |

## app/products/products-controls.tsx

| Avant | Après |
|---|---|
| Categorie / Catégorie | Category / Category |
| Toutes | All |
| Couleur / Couleur | Color / Color |
| Toutes | All |
| Taille / Taille | Size / Size |
| Toutes | All |
| Disponibilite / Disponibilité | Availability / Availability |
| Toutes | All |
| Disponible | In Stock |
| Epuise | Sold Out |
| Reinitialiser | Reset |
| Filtres | Filters |
| Rechercher / Rechercher un produit | Search / Search Products |
| Trier les produits | Sort Products |
| Nouveautés | New Arrivals |
| Prix croissant | Price: Low to High |
| Prix decroissant / Nom A-Z / Nouveautés | Price: High to Low / Name: A–Z / New Arrivals |
| Nouveautes | New Arrivals |
| Prix croissant | Price: Low to High |
| Prix decroissant | Price: High to Low |
| Nom A-Z | Name: A–Z |
| Filtres | Filters |
| Filtres | Filters |
| Appliquer | Apply |

## app/profile/orders/[id]/page.tsx

| Avant | Après |
|---|---|
| Promo | Sale |

## app/profile/page.tsx

| Avant | Après |
|---|---|
| Log out | Sign Out |

## app/vlog/page.tsx

| Avant | Après |
|---|---|
| Les Drops Savage Rise ouvrent des chapitres. FAZA transforme une situation tunisienne en piece, film et energie visuelle. | Every Savage Rise drop opens a new chapter. FAZA turns everyday life in Tunisia into clothing, film, and visual storytelling. |
| When we publishes a chapter, this space will show its three drops, their videos, linked products, and the final short film. | When we publish a new chapter, this space will show its three drops, their videos, linked products, and the final short film. |

## components/store-pages/store-page-renderer.tsx

| Avant | Après |
|---|---|
| absolute -bottom-6 -left-6 bg-accent text-accent-foreground p-6 rounded-lg / text-2xl font-bold / 100% / text-sm font-semibold / FAIT MAIN | — |

## components/storefront/media/storefront-video.tsx

| Avant | Après |
|---|---|
| La vidéo sélectionnée ne peut pas être chargée. Son image poster est affichée. | The selected video could not be loaded. Its poster image is displayed. |

## components/storefront/product-card-actions.tsx

| Avant | Après |
|---|---|
| CHOISIR UNE TAILLE / VOIR LE PRODUIT | SELECT SIZE / VIEW PRODUCT |
| Ajouter rapidement au panier | Quick Add to Bag |

## components/storefront/product-card.tsx

| Avant | Après |
|---|---|
| Promo | Sale |
| Aperçu des couleurs | Color Preview |
| Aperçu | Preview |

## components/studio-hero-action.tsx

| Avant | Après |
|---|---|
| La destination ne peut pas être vérifiée pour le moment. | This destination could not be verified. Please try again. |
| Les achats sont désactivés dans cet aperçu privé. | Purchases are disabled in this private preview. |
| L’achat rapide de ce type de produit n’est pas disponible depuis ce bouton. / Choisissez un modèle disponible. / Cette quantité ou ce modèle n’est plus disponible. Choisissez un autre modèle. / Ce produit n’est plus disponible dans cette boutique. / Le produit ne peut pas être vérifié pour le moment. | Open the product page to purchase this item. / Select an available option. / This option or quantity is no longer available. Select another option. / This product is no longer available in this store. / This product could not be verified. Please try again. |
| Vérification… | Checking… |
| Choisir votre modèle / Choisissez votre modèle et votre quantité pour commander directement. Votre panier actuel est conservé. | Select Your Options / Choose your options and quantity to check out directly. Your current bag will be saved. |
| Modèle | Option |
| Choisir couleur / taille | Select Color / Size |
| Quantité | Quantity |
| Vérification… / Commander maintenant | Checking… / Shop Now |

## components/studio-runtime.tsx

| Avant | Après |
|---|---|
| Aperçu privé · Achats désactivés | Private Preview · Purchases Disabled |
| Quitter | Exit Preview |

## contexts/CartContext.tsx

| Avant | Après |
|---|---|
| Cette quantité n’est pas disponible. | This quantity is unavailable. |
| Ce modèle n’est pas disponible. | This option is unavailable. |
| Ce pack n’est pas disponible. | This pack is unavailable. |

## hooks/use-checkout-quote.ts

| Avant | Après |
|---|---|
| Le montant ne peut pas être confirmé. | The order total could not be confirmed. |
| Connexion momentanément indisponible. La vérification reprend automatiquement. / Le total ne peut pas être validé. | Connection temporarily unavailable. Verification will resume automatically. / The order total could not be verified. |

## lib/availability.ts

| Avant | Après |
|---|---|
| Disponibilité à vérifier | Check Availability |
| Modèle indisponible | Option Unavailable |
| Disponible / Indisponible | In Stock / Unavailable |

## lib/catalog-option-display.ts

| Avant | Après |
|---|---|
| Valeur indisponible | Unavailable value |

## lib/checkout-flow.ts

| Avant | Après |
|---|---|
| Le montant ne peut pas être confirmé pour le moment. | The order total could not be confirmed. Please try again. |

## lib/hero-purchase.ts

| Avant | Après |
|---|---|
| Cette destination n’est pas disponible dans cette boutique. | This destination is unavailable in this store. |
| Cette page n’est plus disponible. | This page is no longer available. |
| Cette section n’est plus disponible. | This section is no longer available. |
| Modèle unique | Single Option |
| La boutique est actuellement fermée. / Ce produit n’est plus disponible dans cette boutique. | The store is currently closed. / This product is no longer available in this store. |
| La disponibilité ne peut pas être vérifiée pour le moment. / — ce produit ne peut pas être commandé actuellement. | Availability could not be confirmed. Please try again. / — this product cannot be ordered right now. |

## lib/order-conflicts.ts

| Avant | Après |
|---|---|
| Une erreur est survenue. | Something went wrong. Please try again. |

## lib/order-status.ts

| Avant | Après |
|---|---|
| En attente / Confirmée / En préparation / Expédiée / Livrée / Annulée / Refusée / Retour demandé / Retour en transit / Retour reçu / Retournée / Non payé / En attente / Payé / Collecté / Échoué / Remboursé / Partiellement remboursé / Annulé / Non préparée / Réservée / En traitement / Traitée / Retour / Retournée / Annulée | Pending / Confirmed / Preparing / Shipped / Delivered / Cancelled / Declined / Return Requested / Return in Transit / Return Received / Returned / Unpaid / Pending / Paid / Collected / Failed / Refunded / Partially Refunded / Cancelled / Unfulfilled / Reserved / Processing / Fulfilled / Returning / Returned / Cancelled |
| Inconnu / Inconnu / Inconnu | Unknown / Unknown / Unknown |

## lib/preview-access.ts

| Avant | Après |
|---|---|
| Votre accès temporaire a expiré. Renouvelez l’aperçu depuis Studio. | Your temporary access has expired. Open a new preview from Studio. |
| Cet accès d’aperçu n’est pas valide. Ouvrez un nouvel aperçu depuis Studio. | This preview access is invalid. Open a new preview from Studio. |
| La boutique doit être préparée dans Studio avant de pouvoir être prévisualisée. | Set up the store in Studio before opening a preview. |
| Cette adresse ne correspond pas à la boutique de l’aperçu. | This address does not match the preview store. |
| L’accès à l’aperçu de cette entreprise est refusé. | Access to this business preview is denied. |
| La boutique associée à cet aperçu est introuvable. | The store for this preview could not be found. |
| Le service d’aperçu est mal configuré. Signalez ce problème à votre administrateur. | Preview is not configured correctly. Report this issue to your administrator. |
| La configuration ou le contenu de la boutique doit être vérifié dans Studio. | Review the store configuration or content in Studio. |
| Le service refuse l’accès au brouillon de cette boutique fermée. Contactez votre administrateur. | Access to this closed store's draft is denied. Contact your administrator. |
| Le service d’aperçu est temporairement indisponible. Réessayez dans un instant. | Preview is temporarily unavailable. Please try again shortly. |

## lib/product-color-media.ts

| Avant | Après |
|---|---|


## lib/quick-purchase.ts

| Avant | Après |
|---|---|
| Retour produit invalide. | Invalid product return link. |

## lib/store-config-shared.ts

| Avant | Après |
|---|---|
| Boutique indisponible | Store Unavailable |

## lib/store-contract.ts

| Avant | Après |
|---|---|
| La configuration de la boutique n’a pas été confirmée par Platform. / Cette adresse ne correspond plus à cette interface de boutique. | The store configuration has not been confirmed by Platform. / This address no longer matches this storefront. |
| Déclaration de domaine incohérente. | The domain configuration is inconsistent. |
| Domaine personnalisé absent. | The custom domain is missing. |
| L’adresse du Store personnalisé ne correspond pas à Platform. | The custom storefront address does not match Platform. |

## lib/store-pages/static-pages.ts

| Avant | Après |
|---|---|
| FONDATION | FOUNDED |
| DROPS LIMITES | LIMITED DROPS |
| PAYS | COUNTRIES |
| Sfax, Tunisie | Sfax, Tunisia |

## lib/storefront/catalog-data.ts

| Avant | Après |
|---|---|
| Le catalogue n’a pas pu être chargé entièrement. Réessayez. | The full catalog could not be loaded. Please try again. |

## lib/storefront/content-fallbacks.ts

| Avant | Après |
|---|---|
| Livraison dans toute la Tunisie / Paiement a la livraison / Echange de taille disponible | Shipping Across Tunisia / Cash on Delivery / Size Exchanges Available |
| Une piece inspiree par les etes tunisiens. / Commander maintenant | A piece inspired by Tunisian summers. / Shop Now |
| Decouvrir FAZA | Discover FAZA |
| Piece Savage Rise FAZA-001 | Savage Rise FAZA-001 piece |
| Piece Savage Rise FAZA-001 | Savage Rise FAZA-001 piece |
| Concept FAZA / Une situation tunisienne. Une piece. / Entre deux Drops, Savage Rise transforme une situation tunisienne en une piece. FAZA-001 raconte la chaleur, l'attente et l'energie d'un ete en Tunisie. / Decouvrir FAZA | The FAZA Concept / A Tunisian moment. A singular piece. / Between drops, Savage Rise turns everyday moments in Tunisia into clothing. FAZA-001 captures the heat, anticipation, and energy of a Tunisian summer. / Discover FAZA |
| Voir la boutique | Explore the Shop |
| Vidéo du concept FAZA Savage Rise | Savage Rise FAZA concept film |
| Campagne Savage Rise | Savage Rise campaign |
| Detail produit Savage Rise | Savage Rise product detail |
| Une direction creative nee dans la culture tunisienne. / Paiement a la livraison / Commande simple, reglement a la reception. / Livraison sur toute la Tunisie / Les options disponibles sont confirmees au checkout. / Assistance directe / Contact via Instagram, telephone ou email selon les canaux actifs. / Enter the next chapter / Recois les nouveaux Drops, les episodes FAZA et les acces anticipes. / Boutique / Nouveautes | Creative direction rooted in Tunisian culture. / Cash on Delivery / Order online. Pay when it arrives. / Shipping Across Tunisia / Available shipping options are confirmed at checkout. / Direct Support / Reach us through the contact channels listed below. / Be Part of the Next Chapter. / Be first to discover new drops, exclusive releases, and the latest from Savage Rise. / Shop / New Arrivals |
| Aide / Livraison | Help / Shipping |
| Echanges et retours | Exchanges & Returns |
| Guide des tailles | Size Guide |
| Notre histoire | About |

## lib/studio-server.ts

| Avant | Après |
|---|---|
| Le contenu de la boutique est momentanément indisponible. | Store content is temporarily unavailable. Please try again. |

