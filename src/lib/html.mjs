// Små hjälpfunktioner för HTML-generering.

export const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// Taggad mall som slår ihop arrayer och hoppar över null/false.
export const html = (strings, ...values) =>
  strings.reduce((out, str, i) => {
    let v = values[i - 1];
    if (Array.isArray(v)) v = v.join('');
    if (v === null || v === undefined || v === false) v = '';
    return out + v + str;
  });

const MONTHS = ['januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december'];

export const formatDate = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
};

export const readingTime = (text) => Math.max(1, Math.round(text.split(/\s+/).length / 200));

// Pil som inline-SVG (Unicode-pilen saknas i de självhostade typsnittens latin-subset).
export const arrow = '<svg class="icon-arrow" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M1 8h13M9 3l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';
