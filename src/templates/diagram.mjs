// Loopingmodellen som SVG. Inspirerad av originalbilden
// (loopingmodellen_overgripande.jpg): en väg med en stor loop och två
// mindre som följer. Färger styrs helt av temats CSS.

let uid = 0;

export function loopDiagram({ steps, compact = false } = {}) {
  const id = `ld-${++uid}`;
  const cx = 260, cy = 190, r = 140;
  const nodes = [
    { x: cx, y: cy - r, lx: cx, ly: 24, anchor: 'middle' },
    { x: cx + r, y: cy, lx: cx + r + 28, ly: cy + 6, anchor: 'start' },
    { x: cx, y: cy + r, lx: cx, ly: 376, anchor: 'middle' },
    { x: cx - r, y: cy, lx: cx - r - 28, ly: cy + 6, anchor: 'end' },
  ];
  const arrows = [45, 135, 225, 315].map((deg) => {
    const t = (deg * Math.PI) / 180;
    const x = (cx + r * Math.sin(t)).toFixed(1);
    const y = (cy - r * Math.cos(t)).toFixed(1);
    return `<path class="ld-arrow" d="M-8,-7 L8,0 L-8,7 Z" transform="translate(${x} ${y}) rotate(${deg})"/>`;
  });
  return `<svg class="loop-diagram${compact ? ' loop-diagram--compact' : ''}" viewBox="0 0 720 400" role="img" aria-labelledby="${id}">
  <title id="${id}">Loopingmodellen: ${steps.map((s) => s.short).join(', ')} – och vidare till nästa loop</title>
  <path class="ld-road" d="M8 330 H712"/>
  <circle class="ld-loop" cx="${cx}" cy="${cy}" r="${r}"/>
  <circle class="ld-loop ld-loop--next" cx="500" cy="290" r="40"/>
  <circle class="ld-loop ld-loop--next" cx="640" cy="280" r="50"/>
  <text class="ld-note" x="640" y="212" text-anchor="middle">Nästa loop</text>
  ${arrows.join('\n  ')}
  ${nodes
    .map(
      (n, i) => `<g class="ld-node"><circle cx="${n.x}" cy="${n.y}" r="19"/><text x="${n.x}" y="${n.y}" dy="0.36em" text-anchor="middle">${i + 1}</text></g>
  <text class="ld-label" x="${n.lx}" y="${n.ly}" text-anchor="${n.anchor}">${steps[i].short}</text>`
    )
    .join('\n  ')}
</svg>`;
}
