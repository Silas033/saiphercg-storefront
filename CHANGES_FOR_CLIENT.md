# Storefront updates
- Contact number filters all non-digit characters on every keystroke and paste, with 15-digit maximum and autocomplete off.
- Transparent company gallery pictures have no dark frame, border or square crop. Tiny 10% image setting is respected.
- Checkout network errors show a customer-facing explanation and preserve the cart.
- Selected combination variants are sent to checkout as their actual combination `variant_id`. The database function saves the corresponding combined label.
- Mobile styles adjusted for narrower screens.

Apply the SQL included in the dashboard project first, then run `npm install && npm run build`. Configure `.env` from `.env.example`.
