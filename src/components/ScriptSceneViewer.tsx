import React, { useState } from 'react';
import {
  FileText,
  Camera,
  MessageSquare,
  Copy,
  Check,
  Clapperboard,
  Compass,
  Volume2,
  Clock,
} from 'lucide-react';
import { ScriptBreakdown, ScriptScene } from '../types.js';

interface ScriptSceneViewerProps {
  script: ScriptBreakdown | null;
  onSelectSceneForAudition?: (scene: ScriptScene) => void;
}

export const ScriptSceneViewer: React.FC<ScriptSceneViewerProps> = ({
  script,
  onSelectSceneForAudition,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!script) {
    return (
      <div className="bg-[#0D0F16] rounded-xl border border-white/[0.08] p-8 text-center space-y-3 shadow-sm">
        <Clapperboard className="w-7 h-7 text-zinc-500 mx-auto" />
        <h3 className="text-xs font-semibold text-white tracking-wide uppercase font-mono">
          Screenplay &bull; Awaiting Synthesis
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
          Configure your prompt or YouTube URL in the inspector and trigger generation to synthesize the multi-scene screenplay.
        </p>
      </div>
    );
  }

  const handleCopyPrompt = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Narrative Arc & Logline Box */}
      <div className="bg-[#0D0F16] rounded-xl border border-white/[0.08] p-5 shadow-sm space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-zinc-300" />
            <h3 className="text-sm font-semibold text-white tracking-tight">Narrative Arc Architecture</h3>
          </div>
          <span className="text-xs text-zinc-400 flex items-center gap-1.5 font-mono">
            <Clock className="w-3.5 h-3.5 text-zinc-500" />
            {script.targetDurationSeconds}s &bull; {script.scenes.length} Scenes
          </span>
        </div>

        {/* Logline */}
        <div className="p-3 rounded-lg bg-[#11141E] border border-white/[0.06] text-xs">
          <span className="text-zinc-400 font-mono uppercase text-[10px] block mb-1">
            Screenplay Logline:
          </span>
          <p className="text-zinc-200 text-xs font-medium leading-relaxed italic">
            &ldquo;{script.logline}&rdquo;
          </p>
        </div>

        {/* 5-Stage Narrative Progression */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
          <div className="p-2.5 rounded-lg bg-[#11141E] border border-white/[0.06]">
            <span className="text-zinc-300 font-semibold block text-[11px] mb-1">1. Hook</span>
            <p className="text-zinc-400 text-[11px] leading-relaxed">{script.narrativeArc.hook}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-[#11141E] border border-white/[0.06]">
            <span className="text-zinc-300 font-semibold block text-[11px] mb-1">2. Inciting</span>
            <p className="text-zinc-400 text-[11px] leading-relaxed">{script.narrativeArc.incitingIncident}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-[#11141E] border border-white/[0.06]">
            <span className="text-zinc-300 font-semibold block text-[11px] mb-1">3. Rising Action</span>
            <p className="text-zinc-400 text-[11px] leading-relaxed">{script.narrativeArc.risingAction}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-[#11141E] border border-white/[0.06]">
            <span className="text-zinc-300 font-semibold block text-[11px] mb-1">4. Climax</span>
            <p className="text-zinc-400 text-[11px] leading-relaxed">{script.narrativeArc.climax}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-[#11141E] border border-white/[0.06]">
            <span className="text-zinc-300 font-semibold block text-[11px] mb-1">5. Resolution</span>
            <p className="text-zinc-400 text-[11px] leading-relaxed">{script.narrativeArc.resolutionLesson}</p>
          </div>
        </div>
      </div>

      {/* Scene-by-Scene Visual Breakdown Cards */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5 font-mono uppercase tracking-wider">
            <Clapperboard className="w-3.5 h-3.5 text-zinc-400" />
            <span>Scene Screenplay Breakdown ({script.scenes.length} Scenes)</span>
          </h3>
          <span className="text-[11px] text-zinc-500 font-mono">
            Optimized for Runway Gen-3 &bull; Luma &bull; Kling
          </span>
        </div>

        <div className="space-y-2.5">
          {script.scenes.map((scene, idx) => (
            <div
              key={scene.sceneNumber}
              className="bg-[#0D0F16] rounded-xl border border-white/[0.08] p-4 hover:border-white/[0.15] transition-all shadow-sm space-y-3"
            >
              {/* Scene Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded bg-zinc-800 text-white text-xs font-mono font-bold">
                    {scene.sceneNumber}
                  </span>
                  <div>
                    <h4 className="text-xs font-semibold text-white">{scene.title}</h4>
                    <span className="text-[10px] font-mono text-zinc-500">{scene.timestamp}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#191D2B] text-zinc-300 border border-white/[0.08]">
                    {scene.cameraAngle}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#191D2B] text-zinc-400 border border-white/[0.06]">
                    {scene.emotionTag}
                  </span>
                </div>
              </div>

              {/* Visual Prompt for Video Synthesizer */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase flex items-center gap-1">
                    <Camera className="w-3 h-3 text-zinc-400" />
                    Video Generation Prompt (Runway / Luma / Kling):
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyPrompt(scene.visualPrompt, idx)}
                    className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-white transition-colors"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Prompt</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="p-2.5 rounded-lg bg-[#11141E] border border-white/[0.06] font-mono text-[11px] text-zinc-300 leading-relaxed">
                  {scene.visualPrompt}
                </p>
              </div>

              {/* Narration and Character Action */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-[#11141E] border border-white/[0.06] space-y-1">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase flex items-center gap-1">
                    <MessageSquare className="w-3 h-3 text-zinc-400" />
                    Spoken Narration:
                  </span>
                  <p className="text-zinc-200 text-xs leading-relaxed">
                    <span className="text-zinc-400 font-mono font-medium">{scene.emotionTag}</span> &ldquo;{scene.narration}&rdquo;
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-[#11141E] border border-white/[0.06] space-y-1">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">
                    Character Action &amp; SFX:
                  </span>
                  <p className="text-zinc-300 text-xs leading-relaxed">
                    {scene.characterAction}
                  </p>
                  {scene.audioEffect && (
                    <span className="text-[10px] text-zinc-500 font-mono block pt-0.5">
                      Audio Cue: {scene.audioEffect}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
