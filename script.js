/* ==========================================================================
   JEO JADE COLLECTIVE — SCRIPT
   ==========================================================================
   This file just handles two small things:
   1. Stamping the current year into the footer
   2. Validating and "submitting" the join-the-collective form

   IMPORTANT: The form does not actually send data anywhere yet. Canva's
   version saved entries to Canva's own storage, which won't work outside
   of Canva. To collect real sign-ups once this is on GitHub Pages (or any
   static host), pick one of these and drop the code in where marked below:

     - Formspree (https://formspree.io) — easiest, no backend needed
     - Google Forms embedded / linked
     - Mailchimp / ConvertKit signup form embed
     - Your own backend endpoint (fetch('/api/join', { method: 'POST', ... }))
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  stampFooterYear();
  initGallery();
});

async function initGallery() {
  const grid = document.getElementById('gallery-grid');

  if (!grid) return;

  try {
    const response = await fetch('finds.csv');
    if (!response.ok) throw new Error('Unable to load finds.csv');

    const csvText = await response.text();
    const items = parseGalleryData(csvText);
    renderGallery(grid, items);
  } catch (error) {
    console.error('Gallery failed to load:', error);
    renderGallery(grid, getFallbackGalleryItems());
  }
}

function getFallbackGalleryItems() {
  return [
    {
      imageUrl: 'https://placehold.co/1200x900/8f3544/f5f0e5?text=Find+1',
      link: '',
      title: 'Sample find',
      size: 'landscape',
      aspectRatio: '3 / 2',
    },
  ];
}

function renderGallery(grid, items) {
  grid.innerHTML = '';

  if (!items.length) {
    const emptyState = document.createElement('p');
    emptyState.className = 'gallery-toolbar__hint';
    emptyState.textContent = 'Add a few rows to the CSV box to populate the gallery.';
    grid.appendChild(emptyState);
    return;
  }

  items.forEach((item) => {
    const card = document.createElement('article');

    // Titles "color" or "inspo" are static swatches: no hover glimmer.
    // Everything else is a normal find and gets the responsive glimmer.
    const titleKey = (item.title || '').trim().toLowerCase();
    const isStatic = titleKey === 'color' || titleKey === 'inspo';
    card.className = `gallery-card ${isStatic ? 'gallery-card--static' : 'gallery-card--responsive'}`;
    card.style.setProperty('--aspect-ratio', item.aspectRatio);

    // No link in the CSV means the card isn't clickable.
    const hasLink = Boolean(item.link) && item.link !== '#';
    const wrapper = document.createElement(hasLink ? 'a' : 'div');
    wrapper.className = 'gallery-card__link';

    if (hasLink) {
      wrapper.href = item.link;
      wrapper.target = '_blank';
      wrapper.rel = 'noopener noreferrer';
      wrapper.setAttribute('aria-label', `${item.title || 'Collection item'} — open listing`);
    } else {
      wrapper.classList.add('gallery-card__link--static');
    }

    const image = document.createElement('img');
    image.className = 'gallery-card__image';
    image.src = item.imageUrl;
    image.alt = item.title || 'Collection item';
    image.loading = 'lazy';

    wrapper.appendChild(image);
    card.appendChild(wrapper);
    grid.appendChild(card);

    requestAnimationFrame(() => {
      card.classList.add('gallery-card--visible');
    });
  });
}

function parseGalleryData(rawText) {
  const rows = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!rows.length) return [];

  const headers = parseCsvLine(rows[0]).map((header) => header.trim().toLowerCase());
  const items = [];

  rows.slice(1).forEach((row) => {
    const values = parseCsvLine(row);
    if (!values.length) return;

    const record = {};
    headers.forEach((header, index) => {
      record[header] = values[index] ? values[index].trim() : '';
    });

    const size = normalizeSize(record.size);
    items.push({
      imageUrl: record.image_url || record.imageurl || '',
      link: record.link || record.url || '',
      title: record.title || 'Collection item',
      size: size.label,
      aspectRatio: size.aspectRatio,
      date: record.date_added || record.date || record.added || record.added_on || '',
    });
  });

  return sortGalleryItems(items);
}

function sortGalleryItems(items) {
  const hasDates = items.some((item) => item.date);

  if (!hasDates) {
    return items.reverse();
  }

  return items
    .slice()
    .sort((a, b) => {
      const aTime = Date.parse(a.date);
      const bTime = Date.parse(b.date);

      if (Number.isNaN(aTime) && Number.isNaN(bTime)) return 0;
      if (Number.isNaN(aTime)) return 1;
      if (Number.isNaN(bTime)) return -1;
      return bTime - aTime;
    });
}

function parseCsvLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];

    if (character === '"') {
      if (inQuotes && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (character === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += character;
    }
  }

  values.push(current.trim());
  return values;
}

// Only two categories: "landscape" (wider than tall) and "portrait"
// (taller than wide). Every card renders at the same fixed height
// (see .gallery-card in styles.css) — this only controls its width.
function normalizeSize(value) {
  const size = (value || '').trim().toLowerCase();

  if (size === 'landscape') {
    return { label: 'landscape', aspectRatio: '3 / 2' };
  }

  return { label: 'portrait', aspectRatio: '2 / 3' };
}

/**
 * Puts the current year into the footer's "© <year>" line.
 */
function stampFooterYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

async function sendToBackend(payload) {
  // TODO: replace with a real request. For now, this just simulates
  // a short delay so the "Saving your note..." message is visible.
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log('Form payload (not yet sent anywhere):', payload);
}

/**
 * Small helper to update the status message text + styling under the form.
 */
function setStatus(el, message, kind) {
  el.textContent = message;
  el.className = 'form-status' + (kind ? ` form-status--${kind}` : '');
}
