import React from 'react';
import {
  Film,
  RotateCcw,
  BookOpen,
  Terminal,
  Download,
  Share2,
  Tv,
  Smartphone,
} from 'lucide-react';
import { AspectRatio } from '../types.js';

interface NavbarProps {
  onOpenPromptsModal: () => void;
  onOpenDeploymentModal: () => void;
  onOpenArchitectureModal?: () => void;
  onResetProject: () => void;
  isGenerating: boolean;
  hasGeneratedContent: boolean;
  aspectRatio: AspectRatio;
  onToggleAspectRatio: (ratio: AspectRatio) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenPromptsModal,
  onOpenDeploymentModal,
  onOpenArchitectureModal,
  onResetProject,
  isGenerating,
  hasGeneratedContent,
  aspectRatio,
  onToggleAspectRatio,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#0A0C11]/90 backdrop-blur-xl">
      <div className="max-w-[1520px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Left: Studio Identity & Document breadcrumbs */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.12] text-white shadow-xs">
            <Film className="w-4 h-4 text-zinc-100" />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight text-white uppercase font-mono">
              STUDIO
            </span>
            <span className="text-zinc-600 text-xs">/</span>
            <span className="text-xs text-zinc-300 font-medium hidden sm:inline">
              AI Video Remaker &amp; SEO
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/[0.04] text-zinc-400 border border-white/[0.06]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Fair Use Synthesis Core</span>
          </div>
        </div>

        {/* Center: Live Aspect Ratio & Format Controls */}
        <div className="flex items-center bg-[#131722] p-0.5 rounded-lg border border-white/[0.08] text-xs">
          <button
            type="button"
            onClick={() => onToggleAspectRatio('16:9')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
              aspectRatio === '16:9'
                ? 'bg-zinc-800 text-white shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="16:9 Cinema Landscape (YouTube Main)"
          >
            <Tv className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">16:9 Cinema</span>
            <span className="sm:hidden">16:9</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleAspectRatio('9:16')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
              aspectRatio === '9:16'
                ? 'bg-zinc-800 text-white shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="9:16 Shorts & Reels Portrait"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">9:16 Shorts</span>
            <span className="sm:hidden">9:16</span>
          </button>
        </div>

        {/* Right: Quick Studio Actions & Docs */}
        <div className="flex items-center gap-2">
          {/* Architecture Bento Modal Trigger */}
          {onOpenArchitectureModal && (
            <button
              type="button"
              onClick={onOpenArchitectureModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-colors"
              title="Inspect autonomous 5-step pipeline architecture bento"
            >
              <Film className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden md:inline">Architecture</span>
            </button>
          )}

          {/* Prompt Architecture Modal Trigger */}
          <button
            type="button"
            onClick={onOpenPromptsModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-colors"
            title="Inspect Gemini prompt templates & fair use algorithms"
          >
            <Terminal className="w-3.5 h-3.5 text-zinc-500" />
            <span className="hidden md:inline">Prompts</span>
          </button>

          {/* Docs Modal */}
          <button
            type="button"
            onClick={onOpenDeploymentModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-colors"
            title="Deployment and cloud workflow guide"
          >
            <BookOpen className="w-3.5 h-3.5 text-zinc-500" />
            <span className="hidden md:inline">Docs</span>
          </button>

          {/* Reset Session */}
          {hasGeneratedContent && (
            <button
              type="button"
              onClick={onResetProject}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/[0.04] border border-white/[0.08] transition-colors disabled:opacity-50"
              title="Reset current project"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Remake</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

