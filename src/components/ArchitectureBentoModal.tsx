import React from 'react';
import { X, Cpu, Layers } from 'lucide-react';
import { WhyUsBento } from './ui/WhyUsBento.js';

interface ArchitectureBentoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureBentoModal: React.FC<ArchitectureBentoModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-[#0A0C11] border border-white/[0.1] rounded-2xl p-5 sm:p-7 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                Studio Architecture &amp; Autonomous Pipeline
              </h2>
              <p className="text-xs text-zinc-400">
                End-to-end fair use transformation, multi-engine video synthesis, and real-time audio pipeline.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bento Grid */}
        <WhyUsBento />

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.08] text-xs text-zinc-500 font-mono">
          <span>PIPELINE SPEC: 5-BEAT NARRATIVE ARC &bull; CONTENT ID DEFENSE</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white hover:bg-zinc-200 text-zinc-950 font-bold font-sans transition-colors"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};
