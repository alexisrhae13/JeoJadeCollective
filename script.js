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
      imageUrl: 'https://placehold.co/900x1200/8f3544/f5f0e5?text=Find+1',
      link: '#',
      title: 'Sample find',
      size: 'large',
      spanX: 2,
      aspectRatio: '5 / 4',
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
    card.className = 'gallery-card';
    card.dataset.spanX = item.spanX;
    card.style.setProperty('--span-x', item.spanX);
    card.style.setProperty('--aspect-ratio', item.aspectRatio);

    const link = document.createElement('a');
    link.className = 'gallery-card__link';
    link.href = item.link || '#';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', `${item.title || 'Collection item'} — open listing`);

    const image = document.createElement('img');
    image.className = 'gallery-card__image';
    image.src = item.imageUrl;
    image.alt = item.title || 'Collection item';
    image.loading = 'lazy';

    link.appendChild(image);
    card.appendChild(link);
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

    const size = normalizeSize(record.size || 'medium');
    items.push({
      imageUrl: record.image_url || record.imageurl || '',
      link: record.link || record.url || '#',
      title: record.title || 'Collection item',
      size: size.label,
      spanX: size.spanX,
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

function normalizeSize(value) {
  const size = (value || 'medium').toLowerCase();

  switch (size) {
    case 'small':
      return { label: 'small', spanX: 1, aspectRatio: '1 / 1' };
    case 'wide':
      return { label: 'wide', spanX: 2, aspectRatio: '4 / 3' };
    case 'tall':
      return { label: 'tall', spanX: 1, aspectRatio: '3 / 5' };
    case 'large':
      return { label: 'large', spanX: 2, aspectRatio: '5 / 4' };
    case 'medium':
    default:
      return { label: size || 'medium', spanX: 1, aspectRatio: '4 / 5' };
  }
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
