# Store Analytics Tracking

The storefront sends internal analytics events to the backend endpoint:

```txt
POST /analytics/savage-rise/events
```

All event calls should go through the centralized helper:

```ts
import { trackEvent } from "@/lib/store-analytics"

trackEvent("add_to_cart", {
  product_id: "product-id",
  variant_id: "variant-id",
  currency: "TND",
  revenue: 149,
  metadata: {
    items: [],
  },
})
```

Only the internal funnel events recognized by the backend are sent. Legacy helper calls for UI activity are ignored by the client helper and do not hit the backend.

## Payload Context

`trackEvent` automatically adds:

- `anonymous_id`: stable visitor id in `localStorage`
- `session_id`: session id in `sessionStorage`
- `referrer`
- `source`
- `utm_campaign`
- `utm_source`
- `utm_medium`
- `has_account`
- `event_time`
- `page_path`
- `page_title`
- `device_type`
- `revenue`

Do not send passwords, raw tokens, full addresses, payment data, or sensitive personal data in `metadata`.

## Business Events

The store sends these internal business events:

- `session_started`
- `page_view`
- `product_view`
- `add_to_cart`
- `checkout_started`
- `purchase`

## Automatic Safety Net

`app/components/StoreAnalytics.tsx` also listens globally for clicks on:

- `button`
- `a`
- `[role="button"]`

It records them as `button_clicked` with `metadata.auto = true`. This catches secondary UI actions without changing the user experience.

It also tracks:

- page views on route/search changes
- session start, heartbeat, visibility changes and page end
- page engagement heartbeat every 15 seconds while visible
- page exit on route change, browser pagehide and component unmount
- time spent per page with `duration_ms`, `visible_ms`, `active_ms` and `idle_ms`
- max scroll depth and interaction count per page
- throttled activity signals for pointer movement, keyboard, clicks, form actions and scrolling
- form submits
- form field focus
- form field changes without field values
- scroll depth milestones at 25%, 50%, 75% and 90%

Important business actions should still call `trackEvent` directly with a precise event name and useful metadata.
