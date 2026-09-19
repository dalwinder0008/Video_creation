import React, { useState } from 'react';
import {
  Copy,
  Check,
  TrendingUp,
  Tag,
  Hash,
  Sparkles,
  FileText,
  Clock,
  Layers,
} from 'lucide-react';
import { YouTubeSEOData } from '../types.js';

interface ViralSeoBoxProps {
  seo: YouTubeSEOData | null;
  onSelectTitleIndex?: (index: number) => void;
}

export const ViralSeoBox: React.FC<ViralSeoBoxProps> = ({
  seo,
  onSelectTitleIndex,
}) => {
  const [selectedTitleIdx, setSelectedTitleIdx] = useState(0);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!seo) {
    return (
      <div className="bg-[#0D0F16] rounded-xl border border-white/[0.08] p-8 text-center space-y-3 shadow-sm">
        <TrendingUp className="w-7 h-7 text-zinc-500 mx-auto" />
        <h3 className="text-xs font-semibold text-white tracking-wide uppercase font-mono">
          YouTube Launch Pack &bull; Standby
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
          Run the production pipeline to generate CTR-predicted titles, mobile-hook descriptions, chapters, and viral metadata.
        </p>
      </div>
    );
  }

  const activeTitle = seo.titles[selectedTitleIdx] || seo.titles[0];

  const handleCopyText = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const getFullDescriptionFormatted = () => {
    const chaptersText = seo.description.chapters
      .map((c) => `${c.timestamp} - ${c.label}`)
      .join('\n');

    return `${seo.description.aboveFoldHook}

${seo.description.narrativeSummary}

TIMESTAMPS:
${chaptersText}

${seo.description.callToAction}

${seo.description.socialAndCredits}

${seo.hashtags.join(' ')}`;
  };

  const getCopyEverythingText = () => {
    return `=== HIGH-CTR TITLE ===
${activeTitle.title}

=== YOUTUBE DESCRIPTION ===
${getFullDescriptionFormatted()}

=== VIRAL SEO TAGS ===
${seo.tags.join(', ')}

=== TRENDING HASHTAGS ===
${seo.hashtags.join(' ')}`;
  };

  return (
    <div className="bg-[#0D0F16] rounded-xl border border-white/[0.08] p-5 sm:p-6 shadow-sm space-y-5">
      {/* Launch Pack Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-white tracking-tight">
              YouTube Launch Pack &amp; Algorithm Metadata
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-white/[0.06] text-zinc-300 border border-white/[0.08]">
              Score: {seo.viralScore}/100
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Engineered for high CTR, recommendation algorithm triggers, and mobile audience retention.
          </p>
        </div>

        {/* High-Contrast "Copy All" Button */}
        <button
          id="btn-copy-launch-pack"
          type="button"
          onClick={() => handleCopyText(getCopyEverythingText(), 'everything')}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-xs transition-all active:scale-98 shadow-md"
        >
          {copiedSection === 'everything' ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Launch Pack Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Full Launch Pack</span>
            </>
          )}
        </button>
      </div>

      {/* 1. High-CTR Titles (<60 Chars) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
            <span>High-CTR Mobile Titles</span>
            <span className="text-zinc-500 font-normal">(&lt;60 chars &bull; Mobile Safe)</span>
          </label>
          <span className="text-[11px] text-zinc-400">
            Selected: <strong className="text-white">Option #{selectedTitleIdx + 1}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {seo.titles.map((titleItem, idx) => {
            const isSelected = selectedTitleIdx === idx;
            return (
              <div
                key={idx}
                onClick={() => {
                  setSelectedTitleIdx(idx);
                  if (onSelectTitleIndex) onSelectTitleIndex(idx);
                }}
                className={`cursor-pointer rounded-lg p-3 border transition-all text-left flex flex-col justify-between ${
                  isSelected
                    ? 'bg-zinc-800/95 border-white/30 ring-1 ring-white/20 shadow-md'
                    : 'bg-[#11141E] border-white/[0.06] hover:border-white/[0.15]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-black/40 text-zinc-400 border border-white/[0.06]">
                      Variant {idx + 1}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                      {titleItem.ctrScore}% CTR
                    </span>
                  </div>

                  <h3 className="text-xs font-semibold text-white leading-snug">
                    {titleItem.title}
                  </h3>

                  <div className="mt-2 text-[10px] text-zinc-400">
                    <span className="text-zinc-500">Trigger:</span> {titleItem.formula}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-white/[0.06] text-[11px]">
                  <span className="text-zinc-500 font-mono text-[10px]">{titleItem.title.length} chars</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyText(titleItem.title, `title-${idx}`);
                    }}
                    className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
                  >
                    {copiedSection === `title-${idx}` ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                        <span className="text-emerald-400 text-[10px]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span className="text-[10px]">Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Above-the-Fold Description & Chapters */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-zinc-200">
            SEO Description &amp; Rich Chapters
          </label>
          <button
            type="button"
            onClick={() => handleCopyText(getFullDescriptionFormatted(), 'description')}
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            {copiedSection === 'description' ? (
              <>
                <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy Description</span>
              </>
            )}
          </button>
        </div>

        <div className="p-3.5 rounded-lg bg-[#11141E] border border-white/[0.06] space-y-3 font-mono text-xs text-zinc-300">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase block mb-1">
              Above-the-Fold Hook (Visible before &quot;Show More&quot;):
            </span>
            <p className="text-white font-sans text-xs leading-relaxed bg-[#161A26] p-2.5 rounded border border-white/[0.06]">
              {seo.description.aboveFoldHook}
            </p>
          </div>

          <div>
            <span className="text-[10px] text-zinc-500 uppercase block mb-1">
              Narrative Summary:
            </span>
            <p className="text-zinc-300 font-sans text-xs leading-relaxed">
              {seo.description.narrativeSummary}
            </p>
          </div>

          {/* Chapters grid */}
          <div>
            <span className="text-[10px] text-zinc-500 uppercase block mb-1">
              Video Chapters (Timestamps):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-0.5">
              {seo.description.chapters.map((ch, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#161A26] border border-white/[0.06] text-[11px]"
                >
                  <Clock className="w-3 h-3 text-zinc-400" />
                  <span className="text-zinc-200 font-semibold">{ch.timestamp}</span>
                  <span className="text-zinc-400 truncate">{ch.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Tags and Hashtags */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-zinc-400" />
            <span>Search &amp; Algorithmic Tags ({seo.tags.length})</span>
          </label>
          <button
            type="button"
            onClick={() => handleCopyText(seo.tags.join(', '), 'tags')}
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            {copiedSection === 'tags' ? (
              <>
                <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy Tags</span>
              </>
            )}
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 p-3 rounded-lg bg-[#11141E] border border-white/[0.06]">
          {seo.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded text-[11px] bg-[#161A26] border border-white/[0.06] text-zinc-300 font-mono"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Trending Hashtags */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-[11px] text-zinc-500 font-medium">Trending Hashtags:</span>
          <div className="flex flex-wrap gap-1.5">
            {seo.hashtags.map((ht, idx) => (
              <span
                key={idx}
                className="text-xs text-zinc-300 font-medium hover:text-white transition-colors cursor-pointer"
                onClick={() => handleCopyText(ht, `ht-${idx}`)}
              >
                {ht}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
