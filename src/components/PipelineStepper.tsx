import React from 'react';
import {
  FileText,
  Mic,
  Video,
  Layers,
  Check,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { PipelineProgress } from '../types.js';
import { GenerateButton } from './ui/GenerateButton.js';
import { StatsCounter } from './ui/StatsCounter.js';

interface PipelineStepperProps {
  progress: PipelineProgress;
  activeViewStep: number;
  setActiveViewStep: (step: number) => void;
  isProcessing: boolean;
  onRunFullPipeline?: () => void;
  canRun?: boolean;
}

export const PipelineStepper: React.FC<PipelineStepperProps> = ({
  progress,
  activeViewStep,
  setActiveViewStep,
  isProcessing,
  onRunFullPipeline,
  canRun = true,
}) => {
  const steps = [
    {
      number: 1,
      name: '01 Screenplay',
      subtitle: '5-Beat Narrative Arc',
      icon: FileText,
      status: progress.step1Script,
    },
    {
      number: 2,
      name: '02 Voiceover',
      subtitle: 'Audio Cadence & SFX',
      icon: Mic,
      status: progress.step2Audio,
    },
    {
      number: 3,
      name: '03 Diffusion',
      subtitle: 'Camera Prompts',
      icon: Video,
      status: progress.step3Visuals,
    },
    {
      number: 4,
      name: '04 Master & SEO',
      subtitle: 'Video Cut & Launch Pack',
      icon: Layers,
      status: progress.step4Compilation,
    },
  ];

  return (
    <div className="bg-[#0D0F16] rounded-xl border border-white/[0.08] p-3 sm:p-4 shadow-sm space-y-3">
      {/* Top Bar with Stage Selector and the requested GenerateButton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-sky-400 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Pipeline Controls
            </span>
            <span className="text-zinc-600">&bull;</span>
            <span className="text-xs text-zinc-400">
              <StatsCounter value={progress.overallProgress} duration={0.8} suffix="% Complete" />
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            Click any step to inspect modular artifacts or trigger the automated full studio pipeline.
          </p>
        </div>

        {onRunFullPipeline && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <GenerateButton
              hue={215}
              isGenerating={isProcessing}
              disabled={!canRun || isProcessing}
              onClick={onRunFullPipeline}
              className="text-xs"
              title={canRun ? 'Execute complete pipeline from source to video and SEO' : 'Provide a source story or URL first'}
            />
          </div>
        )}
      </div>

      {/* Connected Track Segment */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
        {steps.map((step) => {
          const Icon = step.icon;
          const isCurrentActive = activeViewStep === step.number;
          const isCompleted = step.status === 'completed';
          const isInProgress = step.status === 'in-progress';

          return (
            <button
              key={step.number}
              type="button"
              onClick={() => setActiveViewStep(step.number)}
              className={`p-2.5 rounded-lg text-left transition-all border flex items-center justify-between group ${
                isCurrentActive
                  ? 'bg-zinc-800/95 border-white/30 ring-1 ring-white/20 shadow-md'
                  : 'bg-[#11141E] border-white/[0.05] hover:border-white/[0.12] hover:bg-zinc-900/50'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 text-xs font-semibold transition-colors ${
                    isCompleted
                      ? 'bg-emerald-500 text-zinc-950 font-bold'
                      : isInProgress
                      ? 'bg-white text-zinc-950'
                      : isCurrentActive
                      ? 'bg-zinc-700 text-white'
                      : 'bg-zinc-800/80 text-zinc-500'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : isInProgress ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Icon className="w-3.5 h-3.5" />
                  )}
                </div>

                <div className="min-w-0">
                  <span className="text-xs font-semibold text-white block leading-tight truncate">
                    {step.name}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono block truncate">
                    {step.subtitle}
                  </span>
                </div>
              </div>

              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ml-1.5 ${
                  isCompleted
                    ? 'bg-emerald-400'
                    : isInProgress
                    ? 'bg-white animate-ping'
                    : 'bg-zinc-700'
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Progress status bar during execution */}
      {isProcessing && (
        <div className="p-2.5 rounded-lg bg-[#11141E] border border-white/[0.06] text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-zinc-300 min-w-0">
            <Loader2 className="w-3.5 h-3.5 text-white animate-spin shrink-0" />
            <span className="truncate text-[11px]">
              Processing: <strong className="text-white font-medium">{progress.statusMessage}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-20 bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-white h-full transition-all duration-300"
                style={{ width: `${progress.overallProgress}%` }}
              />
            </div>
            <span className="text-zinc-400 font-mono text-[10px]">
              <StatsCounter value={progress.overallProgress} suffix="%" />
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

