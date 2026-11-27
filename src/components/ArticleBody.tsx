import React from 'react';
import { parseBlocks } from '../lib/markdown';
import { assetUrl } from '../lib/assets';
import { brandAlt } from '../i18n/config';
import { ARTICLE_INLINE_IMAGES } from '../data/articleImages';

// نمایش **پررنگ** و [متن لینک](https://...) داخل یک بند
const Inline: React.FC<{ text: string }> = ({ text }) => (
  <>
    {text.split(/(\*\*.+?\*\*|\[[^\]]+\]\(https?:\/\/[^)\s]+\))/g).map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
      const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/);
      if (link) return <a key={i} href={link[2]} target="_blank" rel="noopener noreferrer" className="text-[#0369A1] underline underline-offset-2 break-all">{link[1]}</a>;
      return <React.Fragment key={i}>{part}</React.Fragment>;
    })}
  </>
);

const InlineFigure: React.FC<{ src: string; alt: string; index: number }> = ({ src, alt, index }) => (
  <figure key={`article-inline-${index}`} className="my-7 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
    <img src={assetUrl(src)} alt={brandAlt(alt)} width={1200} height={675} loading="lazy" decoding="async" className="block w-full h-auto aspect-video object-cover" />
  </figure>
);

export const ArticleBody: React.FC<{ content: string; articleSlug?: string }> = ({ content, articleSlug }) => {
  const blocks = parseBlocks(content);
  const imageSet = articleSlug ? ARTICLE_INLINE_IMAGES[articleSlug] : undefined;
  const used = new Set<number>();
  const rendered: React.ReactNode[] = [];
  let headingCount = 0;

  blocks.forEach((block, i) => {
    if (block.type === 'h2' || block.type === 'h3') {
      headingCount += 1;
      rendered.push(block.type === 'h2'
        ? <h2 key={i} className="font-header text-xl font-black text-[#0F172A] pt-4">{block.text}</h2>
        : <h3 key={i} className="font-header text-base font-black text-[#0F172A] pt-2">{block.text}</h3>);
      if (imageSet && used.size < 2) {
        const normalized = block.text.toLocaleLowerCase('fa');
        const closingSection = ['پرسش', 'سوال', 'جمع‌بندی', 'مراجع', 'منابع'].some((word) => normalized.includes(word));
        const keywordMatch = !closingSection && imageSet.headingKeywords.some((word) => normalized.includes(word.toLocaleLowerCase('fa')));
        const fallbackSlot = !closingSection && (used.size === 0 ? headingCount >= 2 : headingCount >= 4);
        if (keywordMatch || fallbackSlot) {
          const nextIndex = used.size;
          rendered.push(<InlineFigure key={`article-inline-${nextIndex}`} src={imageSet.images[nextIndex].src} alt={imageSet.images[nextIndex].alt} index={nextIndex} />);
          used.add(nextIndex);
        }
      }
      return;
    }
    if (block.type === 'p') rendered.push(<p key={i}><Inline text={block.text} /></p>);
    else if (block.type === 'img') rendered.push(<figure key={i} className="my-6"><img src={assetUrl(block.src)} alt={brandAlt(block.alt)} width={1200} height={675} loading="lazy" decoding="async" className="w-full rounded-2xl" /></figure>);
    else if (block.type === 'table') rendered.push(
      <div key={i} className="my-6 overflow-x-auto rounded-xl border border-slate-200"><table className="w-full min-w-[520px] text-sm text-start"><thead className="bg-slate-50"><tr>{block.headers.map((cell,j)=><th key={j} scope="col" className="px-4 py-3 font-bold text-slate-900 border-b border-slate-200"><Inline text={cell}/></th>)}</tr></thead><tbody>{block.rows.map((row,r)=><tr key={r} className="odd:bg-white even:bg-slate-50">{row.map((cell,c)=><td key={c} className="px-4 py-3 border-b border-slate-100 align-top"><Inline text={cell}/></td>)}</tr>)}</tbody></table></div>
    );
    else {
      const Tag = block.type === 'ol' ? 'ol' : 'ul';
      rendered.push(<Tag key={i} className={`${block.type === 'ol' ? 'list-decimal' : 'list-disc'} ps-5 space-y-1.5`}>{('items' in block ? block.items : []).map((item,j)=><li key={j}><Inline text={item}/></li>)}</Tag>);
    }
  });

  // Short articles without enough matching headings still receive both images at sensible paragraph boundaries.
  if (imageSet && used.size < 2) {
    const missing = imageSet.images.slice(used.size);
    missing.forEach((img, i) => rendered.push(<InlineFigure key={`article-inline-fallback-${used.size+i}`} src={img.src} alt={img.alt} index={used.size+i} />));
  }
  return <div className="font-sans text-sm text-slate-700 leading-loose space-y-4">{rendered}</div>;
};

export default ArticleBody;
