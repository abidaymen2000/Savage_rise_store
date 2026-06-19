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
- `utm_source`
- `utm_medium`
- `has_account`
- `event_category`
- `page_path`
- `page_title`
- `device_type`
- `metadata.path`
- `metadata.search`
- `metadata.title`
- `metadata.url`
- `metadata.occurred_at`
- `metadata.session_started_at`
- viewport, screen, language, timezone and connection context
- `Authorization` header when the user is signed in

Do not send passwords, raw tokens, full addresses, payment data, or sensitive personal data in `metadata`.

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
- `form_submitted`
- `form_field_changed`
- `cart_quantity_changed`
- `cart_cleared`
- `session_started`
- `session_heartbeat`
- `session_ended`
- `page_hidden`
- `page_visible`
- `page_engagement`
- `page_exited`
- `user_activity`
- `user_idle`
- `form_field_focused`
- `scroll_depth_reached`

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
