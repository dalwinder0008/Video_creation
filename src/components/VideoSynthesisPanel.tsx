import React, { useState } from 'react';
import {
  Video,
  Code2,
  Copy,
  Check,
} from 'lucide-react';
import { AspectRatio, ScriptBreakdown, SynthesisEngine, VideoSynthesisConfig, VisualStyle } from '../types.js';

interface VideoSynthesisPanelProps {
  script: ScriptBreakdown | null;
  style: VisualStyle;
  config: VideoSynthesisConfig;
  setConfig: React.Dispatch<React.SetStateAction<VideoSynthesisConfig>>;
}

export const VideoSynthesisPanel: React.FC<VideoSynthesisPanelProps> = ({
  script,
  style,
  config,
  setConfig,
}) => {
  const [selectedSceneIndex, setSelectedSceneIndex] = useState(0);
  const [copiedPayload, setCopiedPayload] = useState(false);

  const engines: Array<{
    id: SynthesisEngine;
    name: string;
    description: string;
    badge: string;
    strengths: string;
  }> = [
    {
      id: 'runway-gen3',
      name: 'Runway Gen-3 Alpha',
      description: 'Industry standard for cinematic camera physics and photorealism.',
      badge: 'Benchmark',
      strengths: 'Complex cinematic camera motions, continuous tracking',
    },
    {
      id: 'luma-dream',
      name: 'Luma Dream Machine',
      description: 'Fast rendering engine known for spatial realism and fluid physics.',
      badge: 'High Fluidity',
      strengths: '3D environment navigation, particle physics',
    },
    {
      id: 'kling-ai',
      name: 'Kling AI 1.5 Pro',
      description: 'High prompt adherence for character faces, hands, and motion.',
      badge: 'Detail',
      strengths: 'Expressive character close-ups, choreography',
    },
    {
      id: 'gemini-veo',
      name: 'Gemini Veo 3.1',
      description: 'Advanced video generation with deep multimodal semantic reasoning.',
      badge: 'Multimodal',
      strengths: 'Temporal consistency, complex narrative logic',
    },
    {
      id: 'heygen-avatar',
      name: 'HeyGen / D-ID',
      description: 'Expressive talking-head avatar synthesis with lip-sync.',
      badge: 'Avatar',
      strengths: 'Exact lip-sync, presenter formats',
    },
  ];

  if (!script) {
    return (
      <div className="bg-[#0D0F16] rounded-xl border border-white/[0.08] p-8 text-center space-y-3 shadow-sm">
        <Video className="w-7 h-7 text-zinc-500 mx-auto" />
        <h3 className="text-xs font-semibold text-white tracking-wide uppercase font-mono">
          Video Synthesis &bull; Awaiting Screenplay
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
          Synthesize your screenplay in Step 1 to generate modular video generation prompts for Runway, Luma, and Kling.
        </p>
      </div>
    );
  }

  const currentScene = script.scenes[selectedSceneIndex] || script.scenes[0];

  const sampleApiPayload = {
    engine: config.engine,
    model_version: 'v3-turbo',
    aspect_ratio: config.aspectRatio,
    duration_seconds: currentScene.estimatedDurationSeconds,
    prompt: `${currentScene.visualPrompt}. Style: ${style.name}. ${style.promptModifier}. Lighting: ${style.lightingStyle}.`,
    negative_prompt: 'blurry, low quality, deformed, extra fingers, text watermark, flickering',
    camera_control: {
      type: config.cameraMovement,
      speed: config.motionIntensity * 0.1,
    },
    seed: 42891 + selectedSceneIndex * 777,
    fps: config.fps,
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(JSON.stringify(sampleApiPayload, null, 2));
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  return (
    <div className="bg-[#0D0F16] rounded-xl border border-white/[0.08] p-5 sm:p-6 shadow-sm space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
            <Video className="w-4 h-4 text-zinc-300" />
            Visual Generation &amp; Synthesis Controls
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Configure target video diffusion models, aspect ratios, and camera movement parameters.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-400">Aspect Ratio:</span>
          <div className="inline-flex rounded-lg bg-[#11141E] p-1 border border-white/[0.06]">
            <button
              type="button"
              onClick={() => setConfig((prev) => ({ ...prev, aspectRatio: '16:9' }))}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                config.aspectRatio === '16:9'
                  ? 'bg-zinc-800 text-white shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              16:9 (Landscape)
            </button>
            <button
              type="button"
              onClick={() => setConfig((prev) => ({ ...prev, aspectRatio: '9:16' }))}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                config.aspectRatio === '9:16'
                  ? 'bg-zinc-800 text-white shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              9:16 (Shorts)
            </button>
          </div>
        </div>
      </div>

      {/* 100% Free AI Video Guide Banner */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex flex-col sm:flex-row items-start gap-3.5 text-xs">
        <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
          <Code2 className="w-4 h-4" />
        </div>
        <div className="space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-white">How to Generate Videos 100% Free (No Paid API Needed):</span>
            <span className="px-1.5 py-0.5 text-[10px] font-mono font-medium rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Free Tier Available
            </span>
          </div>
          <p className="text-[11px] leading-relaxed text-zinc-300">
            <strong>Important note regarding your screenshot:</strong> You opened <em>lu.ma</em> (the calendar &amp; event management tool which requires &quot;Luma Plus&quot;). The AI video generator is <strong>Luma Dream Machine</strong> (<a href="https://lumalabs.ai/dream-machine" target="_blank" rel="noopener noreferrer" className="text-sky-400 underline hover:text-sky-300 font-mono">lumalabs.ai/dream-machine</a>) or <strong>Kling AI</strong> (<a href="https://klingai.com" target="_blank" rel="noopener noreferrer" className="text-sky-400 underline hover:text-sky-300 font-mono">klingai.com</a>). Both provide <strong>free daily web credits</strong>.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1">
            <div className="p-2 rounded bg-black/40 border border-white/[0.06] text-[11px] space-y-1">
              <span className="font-semibold text-sky-300 block">1. Luma Dream Machine</span>
              <p className="text-zinc-400 text-[10px]">Free 30 generations/month on web. Copy the visual prompt from each scene below and paste at lumalabs.ai.</p>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/[0.06] text-[11px] space-y-1">
              <span className="font-semibold text-purple-300 block">2. Kling AI (Free Daily)</span>
              <p className="text-zinc-400 text-[10px]">Gives 66 free daily credits every 24h at klingai.com. Great character fidelity with no card required.</p>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/[0.06] text-[11px] space-y-1">
              <span className="font-semibold text-emerald-300 block">3. Haiper &amp; Runway Free</span>
              <p className="text-zinc-400 text-[10px]">Haiper.ai offers free HD video generation every day, plus Runway gives 125 free one-time credits.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Synthesis Engine Picker */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-zinc-300 block">
          Synthesis Engine:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {engines.map((eng) => {
            const isSelected = config.engine === eng.id;
            return (
              <button
                key={eng.id}
                type="button"
                onClick={() => setConfig((prev) => ({ ...prev, engine: eng.id }))}
                className={`p-3 rounded-lg text-left border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-zinc-800/95 border-white/30 ring-1 ring-white/20 shadow-md'
                    : 'bg-[#11141E] border-white/[0.06] hover:border-white/[0.15]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-semibold text-white">{eng.name}</span>
                  </div>
                  <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-mono bg-white/[0.04] text-zinc-400 border border-white/[0.06] mb-1">
                    {eng.badge}
                  </span>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-snug">
                    {eng.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Camera & Motion Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-lg bg-[#11141E] border border-white/[0.06] text-xs">
        {/* Camera Movement */}
        <div className="space-y-1">
          <label htmlFor="camera-movement" className="text-[11px] text-zinc-400 font-medium block">
            Camera Movement:
          </label>
          <select
            id="camera-movement"
            value={config.cameraMovement}
            onChange={(e) =>
              setConfig((prev) => ({
                ...prev,
                cameraMovement: e.target.value as VideoSynthesisConfig['cameraMovement'],
              }))
            }
            className="w-full rounded-md bg-[#161A26] border border-white/[0.08] focus:border-white/20 p-2 text-xs text-white outline-none"
          >
            <option value="cinematic-smooth">Cinematic Smooth Dolly &amp; Drift</option>
            <option value="dynamic-action">Dynamic High-Intensity Action Track</option>
            <option value="slow-push-in">Dramatic Slow Push-In</option>
            <option value="static-aesthetic">Fixed Aesthetic Anamorphic Frame</option>
          </select>
        </div>

        {/* Motion Intensity */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-zinc-400 font-medium">Motion Intensity (1-10):</span>
            <span className="text-zinc-200 font-mono font-semibold">{config.motionIntensity} / 10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={config.motionIntensity}
            onChange={(e) => setConfig((prev) => ({ ...prev, motionIntensity: parseInt(e.target.value) }))}
            className="w-full accent-white cursor-pointer h-1.5 bg-zinc-800 rounded-lg mt-2"
          />
        </div>

        {/* Frame Rate & Upscale */}
        <div className="space-y-1 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-zinc-400 font-medium">Frame Rate &amp; 4K:</span>
            <span className="text-zinc-200 font-mono">{config.fps} FPS</span>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={config.upscale4K}
                onChange={(e) => setConfig((prev) => ({ ...prev, upscale4K: e.target.checked }))}
                className="rounded accent-white"
              />
              <span>Enable 4K Upscaler</span>
            </label>
          </div>
        </div>
      </div>

      {/* JSON Payload Inspection & Copy */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <Code2 className="w-3.5 h-3.5 text-zinc-400" />
            <span className="font-semibold text-zinc-300">Direct API Payload (Scene #{currentScene.sceneNumber}):</span>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedSceneIndex}
              onChange={(e) => setSelectedSceneIndex(parseInt(e.target.value))}
              className="bg-[#11141E] border border-white/[0.08] text-[11px] rounded px-2 py-1 text-zinc-300 outline-none"
            >
              {script.scenes.map((s, idx) => (
                <option key={s.sceneNumber} value={idx}>
                  Scene {s.sceneNumber} ({s.timestamp})
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleCopyPayload}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#11141E] hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/[0.08] text-xs transition-colors"
            >
              {copiedPayload ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy Payload</span>
                </>
              )}
            </button>
          </div>
        </div>

        <pre className="p-3 rounded-lg bg-[#11141E] border border-white/[0.08] text-zinc-400 font-mono text-[11px] overflow-x-auto leading-relaxed max-h-44">
          {JSON.stringify(sampleApiPayload, null, 2)}
        </pre>
      </div>

      {/* Free Direct Prompt Copy Bar for Scene */}
      <div className="p-3.5 rounded-lg bg-[#11141E] border border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-0.5">
          <span className="font-semibold text-white flex items-center gap-1.5">
            <span>Free Web Direct Prompt (Scene #{currentScene.sceneNumber})</span>
            <span className="text-[10px] text-emerald-400 font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/20">Ready to Paste</span>
          </span>
          <p className="text-[11px] text-zinc-400 line-clamp-1">
            {currentScene.visualPrompt}. Style: {style.name}. {style.promptModifier}.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(`${currentScene.visualPrompt}. Style: ${style.name}. ${style.promptModifier}. Lighting: ${style.lightingStyle}.`);
              setCopiedPayload(true);
              setTimeout(() => setCopiedPayload(false), 2000);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-black font-semibold text-xs transition-colors shadow-sm"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Free Prompt</span>
          </button>
          <a
            href="https://lumalabs.ai/dream-machine"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-zinc-200 border border-white/[0.1] text-xs font-medium transition-colors"
          >
            Open Luma Web &rarr;
          </a>
          <a
            href="https://klingai.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-zinc-200 border border-white/[0.1] text-xs font-medium transition-colors"
          >
            Open Kling Web &rarr;
          </a>
        </div>
      </div>
    </div>
  );
};
