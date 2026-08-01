# JeoJadeCollective
Jeo Jade is a hand-picked collection of home decor and art.

## Adding items to the gallery (`finds.csv`)

Each row in `finds.csv` is one card in the gallery. Columns:

- **`image_url`** — direct link to the image file. The full image is always shown (never cropped).
- **`link`** — the product/listing page the card opens in a new tab. Leave this blank if you don't have a link — the card will still show the image, but it won't be clickable.
- **`title`** — used as the image's alt text. Two special values change how the card behaves:
  - `color` or `inspo` — marks the card as a static swatch/inspiration image. It never gets the hover effect.
  - anything else — a normal find. Gets a small glimmer in the top-right corner on hover.

The gallery lays cards out Pinterest-style: fixed-width columns, and each image keeps its own natural shape (no cropping, no fixed height), so don't worry about an image's orientation or size — just drop in the URL.
