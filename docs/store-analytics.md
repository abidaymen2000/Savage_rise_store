# Store Analytics Tracking

The storefront sends internal analytics events to the backend endpoint:

```txt
POST /analytics/events
```

All event calls should go through the centralized helper:

```ts
import { trackEvent } from "@/lib/store-analytics"

trackEvent("button_clicked", {
  product_id: "product-id",
  order_id: "order-id",
  metadata: {
    action: "clear_action_name",
  },
})
```

## Payload Context

`trackEvent` automatically adds:

- `anonymous_id`: stable visitor id in `localStorage`
- `session_id`: session id in `sessionStorage`
- `referrer`
- `source`
- `utm_campaign`
- `has_account`
- `metadata.path`
- `metadata.search`
- `metadata.title`
- `Authorization` header when the user is signed in

Do not send passwords, raw tokens, full addresses, or sensitive personal data in `metadata`.

## Business Events

The store currently tracks these business events:

- `page_viewed`
- `product_viewed`
- `collection_viewed`
- `search_submitted`
- `notify_me_clicked`
- `account_created`
- `login`
- `logout`
- `add_to_cart`
- `remove_from_cart`
- `cart_viewed`
- `checkout_started`
- `shipping_info_submitted`
- `payment_started`
- `payment_success`
- `payment_failed`
- `order_completed`
- `coupon_applied`
- `size_selected`
- `color_selected`
- `wishlist_added`
- `button_clicked`

## Automatic Safety Net

`app/components/StoreAnalytics.tsx` also listens globally for clicks on:

- `button`
- `a`
- `[role="button"]`

It records them as `button_clicked` with `metadata.auto = true`. This catches secondary UI actions without changing the user experience.

Important business actions should still call `trackEvent` directly with a precise event name and useful metadata.
