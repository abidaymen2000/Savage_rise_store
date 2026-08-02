# Store Analytics Tracking

The storefront sends internal analytics events to the backend endpoint:

```txt
POST https://savage-rise-backend-8f0f0a23c13f.herokuapp.com/analytics/savage-rise/events
```

Vercel must define:

```txt
NEXT_PUBLIC_API_BASE_URL=https://savage-rise-backend-8f0f0a23c13f.herokuapp.com
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

## Debugging

Errors are non-blocking during normal browsing. To inspect production analytics safely, open the storefront with:

```txt
https://savagerise.com/?analytics_debug=1
```

or run:

```js
localStorage.setItem("sr_analytics_debug", "1")
```

Debug logs include only the event name, POST URL, HTTP status and safe backend response. They do not print the full client payload.

## Local Diagnostic Page

In development only, `/analytics-diagnostics` sends a manual `page_view` and prints the final endpoint, status and safe response.

## Ignored UI Activity

`app/components/StoreAnalytics.tsx` also listens globally for clicks on:

- `button`
- `a`
- `[role="button"]`

Calls such as `button_clicked`, form events and engagement heartbeat are ignored by the internal analytics helper because the backend funnel only accepts the six business events above.

The component still uses these listeners for local page timing state:

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

Important business actions should call `trackEvent` directly with one of the six accepted event names.
