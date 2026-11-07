import React from 'react';
import { parseBlocks } from '../lib/markdown';
import { assetUrl } from '../lib/assets';

// نمایش **پررنگ** و [متن لینک](https://...) داخل یک بند
const Inline: React.FC<{ text: string }> = ({ text }) => (
  <>
    {text.split(/(\*\*.+?\*\*|\[[^\]]+\]\(https?:\/\/[^)\s]+\))/g).map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/);
      if (link) {
        return (
          <a key={i} href={link[2]} target="_blank" rel="noopener noreferrer" className="text-[#0284C7] underline underline-offset-2 break-all">
            {link[1]}
          </a>
        );
      }
      return <React.Fragment key={i}>{part}</React.Fragment>;
    })}
  </>
);

// رندر ساختاریافته مقاله با تیترهای واقعی (h3) و لیست‌ها، که برای سئو مفید است
export const ArticleBody: React.FC<{ content: string }> = ({ content }) => (
  <div className="font-sans text-sm text-slate-700 leading-loose space-y-4">
    {parseBlocks(content).map((block, i) => {
      if (block.type === 'h3') {
        return <h3 key={i} className="font-header text-base font-black text-[#0F172A] pt-2">{block.text}</h3>;
      }
      if (block.type === 'p') {
        return <p key={i}><Inline text={block.text} /></p>;
      }
      if (block.type === 'img') {
        return (
          <figure key={i} className="my-6">
            <img src={assetUrl(block.src)} alt={block.alt} width={1200} height={675} loading="lazy" className="w-full rounded-2xl" />
          </figure>
        );
      }
      const Tag = block.type === 'ol' ? 'ol' : 'ul';
      return (
        <Tag key={i} className={`${block.type === 'ol' ? 'list-decimal' : 'list-disc'} ps-5 space-y-1.5`}>
          {block.items.map((item, j) => (
            <li key={j}><Inline text={item} /></li>
          ))}
        </Tag>
      );
    })}
  </div>
);

export default ArticleBody;
