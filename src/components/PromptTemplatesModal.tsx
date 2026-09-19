import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Layers } from 'lucide-react';
import { PromptTemplateDoc } from '../types.js';

interface PromptTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: PromptTemplateDoc[];
}

export const PromptTemplatesModal: React.FC<PromptTemplatesModalProps> = ({
  isOpen,
  onClose,
  templates,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const filtered = selectedCategory === 'all'
    ? templates
    : templates.filter(t => t.category === selectedCategory);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-4xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-zinc-800 text-zinc-200 border border-zinc-700">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white tracking-tight">
                Prompt Architecture &amp; Fair Use Rules
              </h2>
              <p className="text-xs text-zinc-400">
                Exact backend system prompts for screenplay formation, YouTube remixing, and SEO engineering.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Categories */}
        <div className="px-6 py-2.5 bg-zinc-950/60 border-b border-zinc-800/80 flex items-center gap-2 text-xs">
          <span className="text-zinc-500 font-medium mr-1">Filter Engine:</span>
          {['all', 'script', 'seo', 'visual-synthesis', 'voiceover'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-md capitalize font-medium text-xs transition-all ${
                selectedCategory === cat
                  ? 'bg-zinc-800 text-white border border-zinc-600'
                  : 'text-zinc-400 hover:text-zinc-200 bg-zinc-950 border border-zinc-800'
              }`}
            >
              {cat.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Modal Body / Templates List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {filtered.map((tpl, idx) => (
            <div
              key={tpl.name}
              className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-semibold text-white">{tpl.name}</h3>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-zinc-900 text-zinc-400 border border-zinc-800">
                      {tpl.category}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-xs mt-0.5">{tpl.description}</p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      `SYSTEM INSTRUCTION:\n${tpl.systemInstruction}\n\nUSER PROMPT TEMPLATE:\n${tpl.userPromptTemplate}`,
                      idx
                    )
                  }
                  className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 transition-colors self-start sm:self-auto text-xs"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Full Prompt</span>
                    </>
                  )}
                </button>
              </div>

              {/* System Instruction */}
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">
                  System Instruction:
                </span>
                <pre className="p-3 rounded-md bg-zinc-900/70 border border-zinc-800/70 text-zinc-300 font-mono text-[11px] whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                  {tpl.systemInstruction}
                </pre>
              </div>

              {/* User Prompt Template */}
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">
                  User Prompt Template &amp; JSON Schema:
                </span>
                <pre className="p-3 rounded-md bg-zinc-900/70 border border-zinc-800/70 text-zinc-300 font-mono text-[11px] whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                  {tpl.userPromptTemplate}
                </pre>
              </div>

              {/* Variables */}
              <div className="flex flex-wrap items-center gap-1 text-[10px] text-zinc-500 pt-1">
                <span className="font-mono">Injected Variables:</span>
                {tpl.variables.map((v) => (
                  <code key={v} className="px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                    {`{{${v}}}`}
                  </code>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
