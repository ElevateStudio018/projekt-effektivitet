// Loopingmodellen som spiral uppåt: varje loop (besluta, genomföra,
// kontrollera, slutföra) hamnar ett steg högre – förmågan växer för
// varje varv. Färger styrs av temats CSS (--diagram-line, --diagram-accent,
// --diagram-label). Stegen själva visas som text bredvid diagrammet.

let uid = 0;

export function loopDiagram({ steps, compact = false } = {}) {
  const id = `ld-${++uid}`;
  const loops = [
    { x: 175, y: 300, label: 'Loop 1' },
    { x: 455, y: 215, label: 'Loop 2' },
    { x: 735, y: 130, label: 'Loop 3' },
  ];
  return `<svg class="loop-diagram loop-spiral${compact ? ' loop-diagram--compact' : ''}" viewBox="0 0 1000 440" role="img" aria-labelledby="${id}">
  <title id="${id}">Loopingmodellen: ${steps.map((s) => s.short).join(', ')} – varje loop börjar ett steg högre</title>
  <path class="ld-road" d="M30 420 C160 420 250 380 250 300 C250 230 175 205 135 235 C95 265 120 350 230 360 C390 375 530 300 530 215 C530 145 455 120 415 150 C375 180 400 265 510 275 C670 290 810 215 810 130 C810 60 735 35 695 65 C655 95 680 180 790 190 C880 198 930 120 965 60"/>
  <path class="ld-arrow" d="M-14,-12 L14,0 L-14,12 Z" transform="translate(966 58) rotate(-58)"/>
  ${loops
    .map(
      (l, i) => `<g class="ld-node"><circle cx="${l.x}" cy="${l.y}" r="24"/><text x="${l.x}" y="${l.y}" dy="0.36em" text-anchor="middle">${i + 1}</text></g>
  <text class="ld-label" x="${l.x}" y="${l.y - 118}" text-anchor="middle">${l.label}</text>`
    )
    .join('\n  ')}
  <text class="ld-note" x="975" y="250" text-anchor="end">Nästa loop</text>
</svg>`;
}
