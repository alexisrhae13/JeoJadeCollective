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
