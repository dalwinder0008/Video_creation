import React, { useState } from 'react';
import {
  PenLine,
  FileText,
  Youtube,
  Sparkles,
  Scissors,
  Check,
  Loader2,
  ShieldCheck,
  Sliders,
  Play,
  ArrowRight,
  ExternalLink,
  Info,
} from 'lucide-react';
import { InputMode, RemixSettings, YouTubeAnalysisResult } from '../types.js';
import { SAMPLE_PROMPTS, SAMPLE_RAW_TRANSCRIPT } from '../data/presets.js';
import { StatsCounter } from './ui/StatsCounter.js';

interface WorkflowInputSectionProps {
  inputMode: InputMode;
  setInputMode: (mode: InputMode) => void;
  // Prompt mode
  customPrompt: string;
  setCustomPrompt: (prompt: string) => void;
  // Transcript mode
  rawTranscript: string;
  setRawTranscript: (text: string) => void;
  cleanedTranscript: string;
  setCleanedTranscript: (text: string) => void;
  cleanerStats: {
    timestampsRemoved: number;
    speakerLabelsRemoved: number;
    originalChars: number;
    cleanedChars: number;
  } | null;
  onCleanTranscript: (raw: string) => void;
  isCleaning: boolean;
  // YouTube URL Remixer mode
  youtubeUrl: string;
  setYoutubeUrl: (url: string) => void;
  remixSettings: RemixSettings;
  setRemixSettings: React.Dispatch<React.SetStateAction<RemixSettings>>;
  onAnalyzeYouTubeUrl: () => void;
  isAnalyzingUrl: boolean;
  analysisProgressStep: string;
  analysisResult: YouTubeAnalysisResult | null;
}

export const DualInputMode: React.FC<WorkflowInputSectionProps> = ({
  inputMode,
  setInputMode,
  customPrompt,
  setCustomPrompt,
  rawTranscript,
  setRawTranscript,
  cleanedTranscript,
  setCleanedTranscript,
  cleanerStats,
  onCleanTranscript,
  isCleaning,
  youtubeUrl,
  setYoutubeUrl,
  remixSettings,
  setRemixSettings,
  onAnalyzeYouTubeUrl,
  isAnalyzingUrl,
  analysisProgressStep,
  analysisResult,
}) => {
  const [copiedCleaner, setCopiedCleaner] = useState(false);

  const sampleYouTubeUrls = [
    {
      title: 'Veritasium (The Infinite Hotel Paradox)',
      url: 'https://www.youtube.com/watch?v=Uj3_KqkI9Zo',
    },
    {
      title: 'Kurzgesagt (What If We Detonated a Nuclear Bomb in the Mariana Trench?)',
      url: 'https://www.youtube.com/watch?v=9UDPTr5C47g',
    },
    {
      title: 'ColdFusion (How AI is Rewriting the Future)',
      url: 'https://www.youtube.com/watch?v=2r1pQZ0yH_8',
    },
  ];

  return (
    <div className="bg-[#0D0F16] rounded-xl border border-white/[0.08] p-4 sm:p-6 shadow-sm space-y-4">
      {/* Top Segmented Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
        <div>
          <h2 className="text-sm font-semibold text-white tracking-tight">
            Source Story &amp; Concept
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Select an input method to initiate the screenplay transformation.
          </p>
        </div>

        {/* Minimalist Segmented Tabs with responsive mobile layout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 sm:inline-flex rounded-lg bg-[#11141E] p-1 border border-white/[0.06] text-xs font-medium w-full sm:w-auto gap-1">
          <button
            id="tab-custom-prompt"
            type="button"
            onClick={() => setInputMode('custom-prompt')}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-md transition-all touch-manipulation ${
              inputMode === 'custom-prompt'
                ? 'bg-zinc-800 text-white shadow-xs font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <PenLine className="w-3.5 h-3.5" />
            <span>Write Prompt</span>
          </button>

          <button
            id="tab-youtube-transcript"
            type="button"
            onClick={() => setInputMode('youtube-transcript')}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-md transition-all touch-manipulation ${
              inputMode === 'youtube-transcript'
                ? 'bg-zinc-800 text-white shadow-xs font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Paste Transcript</span>
          </button>

          <button
            id="tab-youtube-url"
            type="button"
            onClick={() => setInputMode('youtube-url')}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-md transition-all touch-manipulation ${
              inputMode === 'youtube-url'
                ? 'bg-zinc-800 text-white shadow-xs font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Youtube className="w-3.5 h-3.5 text-red-400" />
            <span>YouTube URL Remixer</span>
            <span className="ml-1 px-1.5 py-0.2 rounded text-[10px] font-mono bg-zinc-700 text-zinc-200">
              New
            </span>
          </button>
        </div>
      </div>

      {/* MODE 1: Write Prompt */}
      {inputMode === 'custom-prompt' && (
        <div className="space-y-3">
          {/* Quick Preset Ideas Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-zinc-500 text-[11px] font-medium mr-1">Sample Concepts:</span>
            {SAMPLE_PROMPTS.map((sample) => (
              <button
                key={sample.title}
                type="button"
                onClick={() => setCustomPrompt(sample.content)}
                className="px-2.5 py-1 rounded-md bg-[#11141E] hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/[0.06] text-[11px] transition-colors"
              >
                {sample.title}
              </button>
            ))}
          </div>

          <div className="relative">
            <textarea
              id="textarea-custom-prompt"
              rows={4}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Describe your story idea, core lesson, or cinematic visual premise..."
              className="w-full rounded-lg bg-[#11141E] border border-white/[0.08] focus:border-white/20 focus:ring-1 focus:ring-white/20 p-3.5 text-xs text-zinc-100 placeholder-zinc-500 outline-none resize-none leading-relaxed transition-colors"
            />
            <div className="absolute right-3 bottom-3 text-[11px] font-mono text-zinc-500 pointer-events-none flex items-center gap-1">
              <StatsCounter value={customPrompt.split(/\s+/).filter(Boolean).length} duration={0.8} /> words &bull; <StatsCounter value={customPrompt.length} duration={0.8} /> chars
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: Paste YouTube Transcript */}
      {inputMode === 'youtube-transcript' && (
        <div className="space-y-3">
          {/* Toolbar with Cleaner action */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500 text-[11px] font-medium">Sample Transcript:</span>
              <button
                type="button"
                onClick={() => {
                  setRawTranscript(SAMPLE_RAW_TRANSCRIPT);
                  onCleanTranscript(SAMPLE_RAW_TRANSCRIPT);
                }}
                className="px-2 py-0.5 rounded bg-[#11141E] hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/[0.06] text-[11px]"
              >
                Pareto Principle (80/20)
              </button>
            </div>

            <button
              id="btn-clean-transcript"
              type="button"
              disabled={!rawTranscript.trim() || isCleaning}
              onClick={() => onCleanTranscript(rawTranscript)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#191D2B] hover:bg-zinc-800 text-zinc-200 hover:text-white text-xs font-medium border border-white/[0.08] transition-colors disabled:opacity-40"
            >
              {isCleaning ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Cleaning Clutter...</span>
                </>
              ) : (
                <>
                  <Scissors className="w-3.5 h-3.5" />
                  <span>Clean Timestamps &amp; Intro Clutter</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Raw Transcript Area */}
            <div className="space-y-1">
              <label htmlFor="textarea-raw-transcript" className="text-[11px] font-medium text-zinc-400">
                Raw Transcript Input (with timestamps &amp; labels)
              </label>
              <textarea
                id="textarea-raw-transcript"
                rows={5}
                value={rawTranscript}
                onChange={(e) => setRawTranscript(e.target.value)}
                placeholder="Paste raw transcript directly from YouTube (e.g. 00:14 In this video, we'll explain...)"
                className="w-full rounded-lg bg-[#11141E] border border-white/[0.08] focus:border-white/20 focus:ring-1 focus:ring-white/20 p-3 text-xs text-zinc-200 placeholder-zinc-500 outline-none resize-none font-mono leading-relaxed"
              />
            </div>

            {/* Cleaned Transcript Area */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="textarea-cleaned-transcript" className="text-[11px] font-medium text-zinc-400">
                  Cleaned Story Narrative (Ready for Synthesis)
                </label>
                {cleanerStats && (
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    -{cleanerStats.timestampsRemoved} timestamps removed
                  </span>
                )}
              </div>
              <textarea
                id="textarea-cleaned-transcript"
                rows={5}
                value={cleanedTranscript}
                onChange={(e) => setCleanedTranscript(e.target.value)}
                placeholder="Cleaned prose with filler and timestamps removed will appear here..."
                className="w-full rounded-lg bg-[#11141E] border border-white/[0.08] focus:border-white/20 focus:ring-1 focus:ring-white/20 p-3 text-xs text-zinc-200 placeholder-zinc-500 outline-none resize-none leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}

      {/* MODE 3: YouTube URL Remixer & Copyright-Safe Recreator */}
      {inputMode === 'youtube-url' && (
        <div className="space-y-4">
          {/* URL Input Bar */}
          <div className="space-y-1.5">
            <label htmlFor="input-youtube-url" className="text-xs font-medium text-zinc-300 flex items-center justify-between">
              <span>Paste YouTube Video URL</span>
              <span className="text-[11px] text-zinc-500">
                Supports Standard, Short, and Embed links
              </span>
            </label>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <input
                  id="input-youtube-url"
                  type="text"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full rounded-lg bg-[#11141E] border border-white/[0.08] focus:border-white/20 focus:ring-1 focus:ring-white/20 p-2.5 pl-3.5 text-xs text-white placeholder-zinc-500 outline-none font-mono"
                />
              </div>

              <button
                id="btn-analyze-youtube-url"
                type="button"
                disabled={!youtubeUrl.trim() || isAnalyzingUrl}
                onClick={onAnalyzeYouTubeUrl}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white hover:bg-zinc-100 text-zinc-950 text-xs font-bold shadow-md transition-all disabled:opacity-50"
              >
                {isAnalyzingUrl ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{analysisProgressStep || 'Analyzing...'}</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Analyze &amp; Deconstruct</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick URL samples */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
              <span className="text-zinc-500">Try Sample URL:</span>
              {sampleYouTubeUrls.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setYoutubeUrl(sample.url)}
                  className="px-2 py-0.5 rounded bg-[#11141E] hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/[0.06] transition-colors"
                >
                  {sample.title.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Remix & Copyright-Safe Configuration Box */}
          <div className="p-4 rounded-lg bg-[#11141E] border border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
              <span className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-zinc-400" />
                Remix &amp; Copyright-Protection Directives
              </span>
              <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Fair Use Derivative
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Target Tone Shift */}
              <div className="space-y-1">
                <label htmlFor="select-remix-tone" className="text-[11px] font-medium text-zinc-400 block">
                  Target Tone Shift:
                </label>
                <select
                  id="select-remix-tone"
                  value={remixSettings.tone}
                  onChange={(e) =>
                    setRemixSettings((prev) => ({
                      ...prev,
                      tone: e.target.value as RemixSettings['tone'],
                    }))
                  }
                  className="w-full rounded-md bg-[#161A26] border border-white/[0.08] p-2 text-xs text-zinc-200 outline-none"
                >
                  <option value="documentary">Warm Documentary (National Geographic / BBC style)</option>
                  <option value="fast-paced">Fast-Paced Explainer (High-Retention / Kurzgesagt)</option>
                  <option value="serious-dramatic">Serious Dramatic (Cinematic / High-Stakes)</option>
                  <option value="humorous-satirical">Humorous Satirical (Witty &amp; Entertaining)</option>
                </select>
              </div>

              {/* Transform Strength Slider */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-medium text-zinc-400">Transformative Strength:</span>
                  <span className="font-mono text-zinc-200 font-semibold">
                    {remixSettings.transformStrength}% (Max Content ID Defense)
                  </span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="100"
                  step="5"
                  value={remixSettings.transformStrength}
                  onChange={(e) =>
                    setRemixSettings((prev) => ({
                      ...prev,
                      transformStrength: parseInt(e.target.value),
                    }))
                  }
                  className="w-full accent-white cursor-pointer h-1.5 bg-zinc-800 rounded-lg mt-2"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 pt-0.5">
                  <span>Balanced Paraphrase</span>
                  <span>100% Zero-Verbatim Rebuild</span>
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Result Preview Card */}
          {analysisResult && (
            <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 space-y-2.5 text-xs animate-fade-in">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 block">ORIGINAL BROADCAST DETECTED:</span>
                  <h4 className="text-xs font-semibold text-white mt-0.5">
                    {analysisResult.originalTitle}
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                  <StatsCounter value={analysisResult.copyrightSafetyScore} duration={1.2} suffix="% Safe Derivative" />
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-medium text-zinc-400">Deconstructed Core Thesis:</span>
                <p className="text-zinc-300 text-xs leading-relaxed italic">
                  &ldquo;{analysisResult.hookExtracted}&rdquo;
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px] text-zinc-400">
                {analysisResult.transformativeAngles.map((angle, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-zinc-500" />
                    <span>{angle}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
