/**
 * useSEO — Dynamic per-page head tag management hook
 * Injects title, meta description, Open Graph, Twitter Card,
 * and JSON-LD structured data into <head> at runtime for each route.
 * 
 * Google uses the live DOM values, not just the static HTML.
 * This ensures every page has its own unique, keyword-rich metadata.
 */

const BASE_URL = 'https://shopgroundera.com';
const DEFAULT_IMAGE = `${BASE_URL}/logo.png`;

/**
 * Sets a <meta> tag in document.head by name or property attribute.
 * Creates it if missing, updates if already present.
 */
function setMeta(attr, key, content) {
    if (!content) return;
    let el = document.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
    }
    el.setAttribute('content', content);
}

/**
 * Sets or updates a <link> tag in document.head.
 */
function setLink(rel, href, extras = {}) {
    if (!href) return;
    let el = document.querySelector(`link[rel="${rel}"]`);
    if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
    }
    el.setAttribute('href', href);
    Object.entries(extras).forEach(([k, v]) => el.setAttribute(k, v));
}

/**
 * Injects or replaces a JSON-LD <script> block.
 * Uses a custom id attribute to uniquely identify each schema type.
 */
function injectJSONLD(id, schema) {
    let el = document.querySelector(`script[data-schema-id="${id}"]`);
    if (!el) {
        el = document.createElement('script');
        el.setAttribute('type', 'application/ld+json');
        el.setAttribute('data-schema-id', id);
        document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(schema, null, 2);
}

/**
 * Main SEO injection function — call this from each page component.
 *
 * @param {Object} config - SEO configuration
 * @param {string} config.title - Page <title>
 * @param {string} config.description - Meta description
 * @param {string} config.keywords - Meta keywords
 * @param {string} config.canonical - Canonical URL (absolute)
 * @param {string} config.image - OG/Twitter image URL
 * @param {string} config.type - OG type ('website' | 'product')
 * @param {Array}  config.schemas - Array of JSON-LD schema objects with { id, schema }
 */
export function applySEO({ title, description, keywords, canonical, image, type = 'website', schemas = [] }) {
    // Title
    if (title) document.title = title;

    // Core meta
    setMeta('name', 'description', description);
    setMeta('name', 'keywords', keywords);
    setMeta('name', 'thumbnail', image || DEFAULT_IMAGE);

    // Canonical
    setLink('canonical', canonical || BASE_URL);

    // Open Graph
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', canonical || BASE_URL);
    setMeta('property', 'og:image', image || DEFAULT_IMAGE);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:site_name', 'ShopGround Era');

    // Twitter Card
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', image || DEFAULT_IMAGE);
    setMeta('name', 'twitter:card', 'summary_large_image');

    // JSON-LD Schemas
    schemas.forEach(({ id, schema }) => injectJSONLD(id, schema));
}

export default applySEO;
