// Minimal Markdown-tolk för nyhetsartiklarna. Stöder front matter,
// rubriker (## / ###), stycken, punkt- och numrerade listor, citat,
// **fetstil**, *kursiv* och [länkar](url).
import { esc } from './html.mjs';

export function parseFrontMatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: src };
  const data = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i < 0) continue;
    const key = line.slice(0, i).trim();
    let val = line.slice(i + 1).trim();
    if (/^".*"$/.test(val)) val = val.slice(1, -1);
    data[key] = val;
  }
  return { data, body: m[2] };
}

// Interna länkar skrivs som /sökväg/ och översätts av `resolve` till
// relativa länkar för den aktuella sidan.
let resolve = (u) => u;
const inline = (s) =>
  esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[(.+?)\]\((.+?)\)/g, (_, t, u) => `<a href="${u.startsWith('/') ? resolve(u.slice(1)) : u}">${t}</a>`);

export function markdown(src, linkResolver) {
  if (linkResolver) resolve = linkResolver;
  const blocks = src.trim().split(/\n{2,}/);
  const out = [];
  for (const block of blocks) {
    const lines = block.split('\n');
    if (/^### /.test(block)) out.push(`<h3>${inline(block.slice(4))}</h3>`);
    else if (/^## /.test(block)) out.push(`<h2>${inline(block.slice(3))}</h2>`);
    else if (lines.every((l) => /^[-*] /.test(l)))
      out.push(`<ul>${lines.map((l) => `<li>${inline(l.slice(2))}</li>`).join('')}</ul>`);
    else if (lines.every((l) => /^\d+\. /.test(l)))
      out.push(`<ol>${lines.map((l) => `<li>${inline(l.replace(/^\d+\. /, ''))}</li>`).join('')}</ol>`);
    else if (lines.every((l) => /^> ?/.test(l)))
      out.push(`<blockquote><p>${inline(lines.map((l) => l.replace(/^> ?/, '')).join(' '))}</p></blockquote>`);
    else out.push(`<p>${inline(lines.join(' '))}</p>`);
  }
  return out.join('\n');
}

export const plainText = (src) => src.replace(/[#*>\[\]()-]/g, ' ');
