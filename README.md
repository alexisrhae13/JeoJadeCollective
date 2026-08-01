# JeoJadeCollective
Jeo Jade is a hand-picked collection of home decor and art.

## Adding items to the gallery (`finds.csv`)

Each row in `finds.csv` is one card in the gallery. Columns:

- **`image_url`** — direct link to the image file. The full image is always shown (never cropped).
- **`link`** — the product/listing page the card opens in a new tab. Leave this blank if you don't have a link — the card will still show the image, but it won't be clickable.
- **`title`** — used as the image's alt text. Two special values change how the card behaves:
  - `color` or `inspo` — marks the card as a static swatch/inspiration image. It never gets the hover effect.
  - anything else — a normal find. Gets a small glimmer in the top-right corner on hover.
- **`size`** — either `landscape` or `portrait`. Controls the card's shape (width). Every card is the same height no matter what.
