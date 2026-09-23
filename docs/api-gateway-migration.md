# Gateway commune
`NEXT_PUBLIC_API_BASE_URL=https://yovo-api-gateway-a8da1d8e66a3.herokuapp.com/api/core` et
`NEXT_PUBLIC_STOREFRONT_DOMAIN=savagerise.com` au build et au runtime serveur.
Le client et analytics envoient X-Store-Domain en navigateur et SSR. Core contrôle
séparément les JWT et permissions. La vérification email utilise le relais Next
`/api/auth/verify-email` pour préserver le domaine puis valider la redirection.
`npm run api:generate` lit `/docs/schemas/core.json` sur la gateway avec les secrets
DOCS_USERNAME/DOCS_PASSWORD réservés au processus. Option locale explicite :
GATEWAY_SCHEMA_ORIGIN=http://127.0.0.1:18080. Génération locale vérifiée via Kong
devant Core local ; le schéma de production n’est pas supposé déjà à jour.
Aucun nouveau domaine API/DNS/TLS. Les blocs CMS et protections existantes restent.
