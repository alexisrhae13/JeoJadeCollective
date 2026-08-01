# JeoJadeCollective
Jeo Jade is a hand-picked collection of home decor and art.

## Adding items to the gallery (`finds.csv`)

Each row in `finds.csv` is one card in the gallery. Columns:

- **`image_url`** — direct link to the image file. The full image is always shown (never cropped).
- **`link`** — the product/listing page the card opens in a new tab. Leave this blank if you don't have a link — the card will still show the image, but it won't be clickable.
- **`title`** — used as the image's alt text. Two special values change how the card behaves:
  - `color` or `inspo` — marks the card as a static swatch/inspiration image. It never gets the hover effect.
  - anything else — a normal find. Gets a small glimmer in the top-right corner on hover.
- **`filter`** — the category tag used for the filter pills above the gallery. Must be exactly one of these (lowercase, no typos, or it just gets lumped into `idk`):
  - `paint`
  - `wallpaper`
  - `furniture`
  - `decor`
  - `art`
  - `vintage`
  - `handmade`
  - `idk` — the catch-all for anything that doesn't fit, or leave the cell blank and it becomes this automatically.

The gallery lays cards out Pinterest-style: fixed-width columns, and each image keeps its own natural shape (no cropping, no fixed height), so don't worry about an image's orientation or size — just drop in the URL.

Rows show up on the page in the same top-to-bottom order they're listed in the CSV — so if you want your newest find to show up first, add its row to the top.

## Before this goes live

A few placeholders you'll want to swap out once you have a real domain and photo:

- **`https://www.jeojadecollective.com/`** — used in `index.html` (canonical link, Open Graph/Twitter tags), `robots.txt`, and `sitemap.xml`. Find-and-replace it with your real domain everywhere.
- **The About section portrait** (`index.html`, `<section id="about">`) — currently a placeholder image. Swap the `src` for a real photo.
- **`og:image`** — not set yet (there's a `TODO` comment for it in `index.html`'s `<head>`). Add one once you have a logo or a nice screenshot of the site — it's what shows up when the site is shared on social media.
- **The affiliate disclosure** in the footer — reads fine as a generic disclosure, but double check it matches whatever affiliate programs you actually join (Etsy, furniture retailers, etc.) — some programs have required wording.

## Outbound links are marked as affiliate/sponsored

Every gallery card link goes out with `rel="sponsored"` (in `script.js`) since these are meant to be monetized/affiliate links — that's the attribute Google recommends for paid or affiliate links, so it doesn't confuse the site's own SEO.

## The corner lamp

The little lamp icon in the bottom-right corner (`index.html`, near the bottom, and `.corner-lamp` in `styles.css`) is just decorative right now — clicking it flickers, that's it. It's meant to eventually become a dark-mode toggle; the click handler in `script.js` (`initCornerLamp`) is where that logic will hook in later.
