import React from 'react';
import { parseBlocks } from '../lib/markdown';

// نمایش **پررنگ** داخل یک بند
const Inline: React.FC<{ text: string }> = ({ text }) => (
  <>
    {text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
      i % 2 === 1 ? (
        <strong key={i} className="font-bold text-slate-900">{part}</strong>
      ) : (
        <React.Fragment key={i}>{part}</React.Fragment>
      ),
    )}
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
