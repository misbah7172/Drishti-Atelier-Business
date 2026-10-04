import { useEffect } from 'react';

/**
 * SEO component — sets document title and meta description.
 * Usage: <SEO title="Shop" description="Browse our collection" />
 */
export default function SEO({ title, description, keywords }) {
  useEffect(() => {
    const base = 'Drishti Atelier';
    document.title = title ? `${title} | ${base}` : base;

    // Meta description
    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.head.appendChild(meta);
      }
      meta.content = description;
    }

    // Meta keywords
    if (keywords) {
      let meta = document.querySelector('meta[name="keywords"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'keywords';
        document.head.appendChild(meta);
      }
      meta.content = keywords;
    }
  }, [title, description, keywords]);

  return null;
}
