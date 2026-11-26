// تبدیل محتوای مقاله به بلوک‌های ساختاریافته برای رندر یکسان در مرورگر و HTML ایستا.
export type Block =
  | { type: 'h2' | 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul' | 'ol'; items: string[] }
  | { type: 'img'; src: string; alt: string }
  | { type: 'table'; headers: string[]; rows: string[][] };

export function parseBlocks(src: string): Block[] {
  const blocks: Block[] = [];
  let para: string[] = [];
  let list: { type: 'ul' | 'ol'; items: string[] } | null = null;
  const flushPara = () => { if (para.length) { blocks.push({ type: 'p', text: para.join(' ') }); para = []; } };
  const flushList = () => { if (list) { blocks.push(list); list = null; } };
  const cells = (line: string) => line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((v) => v.trim());
  const lines = src.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) { flushPara(); flushList(); continue; }
    if (line.startsWith('|') && i + 1 < lines.length && /^\|?[-:| ]+\|?$/.test(lines[i + 1].trim())) {
      flushPara(); flushList();
      const headers = cells(line);
      i++;
      const rows: string[][] = [];
      while (i + 1 < lines.length && lines[i + 1].trim().startsWith('|')) rows.push(cells(lines[++i].trim()));
      blocks.push({ type: 'table', headers, rows });
      continue;
    }
    const img = line.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/);
    if (img) { flushPara(); flushList(); blocks.push({ type: 'img', alt: img[1], src: img[2] }); continue; }
    if (line.startsWith('## ')) { flushPara(); flushList(); blocks.push({ type: 'h2', text: line.slice(3) }); continue; }
    if (line.startsWith('### ')) { flushPara(); flushList(); blocks.push({ type: 'h3', text: line.slice(4) }); continue; }
    const ul = line.match(/^[-*]\s+(.*)$/);
    const ol = line.match(/^[0-9۰-۹]+[.)]\s+(.*)$/);
    if (ul || ol) {
      flushPara(); const type = ul ? 'ul' : 'ol'; const text = ul ? ul[1] : ol![1];
      if (!list || list.type !== type) { flushList(); list = { type, items: [] }; }
      list.items.push(text); continue;
    }
    flushList(); para.push(line);
  }
  flushPara(); flushList(); return blocks;
}
