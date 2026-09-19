import React, { useState } from 'react';
import {
  Youtube,
  PenLine,
  FileText,
  Sliders,
  Palette,
  Mic,
  Video,
  Sparkles,
  Scissors,
  Check,
  Loader2,
  Camera,
  Play,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Info,
  Layers,
  Wand2,
} from 'lucide-react';
import {
  CharacterIdentity,
  InputMode,
  RemixSettings,
  SynthesisEngine,
  VideoSynthesisConfig,
  VisualStyle,
  YouTubeAnalysisResult,
} from '../types.js';
import { PRESET_CHARACTERS, SAMPLE_PROMPTS, SAMPLE_RAW_TRANSCRIPT, VISUAL_STYLES } from '../data/presets.js';

interface StudioSidebarProps {
  // Input mode
  inputMode: InputMode;
  setInputMode: (mode: InputMode) => void;
  // Prompt mode
  customPrompt: string;
  setCustomPrompt: (prompt: string) => void;
  // Transcript mode
  rawTranscript: string;
  setRawTranscript: (text: string) => void;
  cleanedTranscript: string;
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
  // Aesthetic & Persona
  selectedStyle: VisualStyle;
  setSelectedStyle: (style: VisualStyle) => void;
  character: CharacterIdentity;
  setCharacter: React.Dispatch<React.SetStateAction<CharacterIdentity>>;
  // Video Engine config
  config: VideoSynthesisConfig;
  setConfig: React.Dispatch<React.SetStateAction<VideoSynthesisConfig>>;
  // Pipeline trigger
  onRunFullPipeline: () => void;
  isProcessing: boolean;
  canRun: boolean;
}

export const StudioSidebar: React.FC<StudioSidebarProps> = ({
  inputMode,
  setInputMode,
  customPrompt,
  setCustomPrompt,
  rawTranscript,
  setRawTranscript,
  cleanedTranscript,
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
  selectedStyle,
  setSelectedStyle,
  character,
  setCharacter,
  config,
  setConfig,
  onRunFullPipeline,
  isProcessing,
  canRun,
}) => {
  const [sidebarTab, setSidebarTab] = useState<'source' | 'style' | 'camera'>('source');
  const [isCharacterDrawerOpen, setIsCharacterDrawerOpen] = useState(false);

  const sampleYouTubeVideos = [
    { label: 'Veritasium Paradox', url: 'https://www.youtube.com/watch?v=Uj3_KqkI9Zo' },
    { label: 'Kurzgesagt Mariana', url: 'https://www.youtube.com/watch?v=9UDPTr5C47g' },
    { label: 'ColdFusion AI Future', url: 'https://www.youtube.com/watch?v=2r1pQZ0yH_8' },
  ];

  const engines: Array<{ id: SynthesisEngine; name: string; tag: string }> = [
    { id: 'runway-gen3', name: 'Runway Gen-3 Alpha', tag: 'Cinematic' },
    { id: 'luma-dream', name: 'Luma Dream Machine', tag: 'Fluidity' },
    { id: 'kling-ai', name: 'Kling AI 1.5 Pro', tag: 'Adherence' },
    { id: 'gemini-veo', name: 'Gemini Veo 3.1', tag: 'Multimodal' },
    { id: 'heygen-avatar', name: 'HeyGen / D-ID', tag: 'Avatar' },
  ];

  return (
    <aside className="w-full lg:w-[390px] shrink-0 flex flex-col bg-[#0D0F16] border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl">
      {/* Studio Inspector Header */}
      <div className="p-3.5 border-b border-white/[0.06] bg-[#0A0C11] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-mono tracking-wider uppercase text-zinc-400 font-medium">
            Production Inspector
          </span>
        </div>

        {/* Low-profile Segmented Tabs */}
        <div className="flex items-center bg-[#131722] p-0.5 rounded-lg border border-white/[0.06]">
          <button
            type="button"
            onClick={() => setSidebarTab('source')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
              sidebarTab === 'source'
                ? 'bg-zinc-800 text-white shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Source
          </button>
          <button
            type="button"
            onClick={() => setSidebarTab('style')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
              sidebarTab === 'style'
                ? 'bg-zinc-800 text-white shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Aesthetic
          </button>
          <button
            type="button"
            onClick={() => setSidebarTab('camera')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
              sidebarTab === 'camera'
                ? 'bg-zinc-800 text-white shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Engine
          </button>
        </div>
      </div>

      {/* Main Tab Body */}
      <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-280px)] min-h-[460px]">
        {/* ================= TAB 1: SOURCE ================= */}
        {sidebarTab === 'source' && (
          <div className="space-y-4">
            {/* Input Mode Switcher */}
            <div>
              <label className="text-[11px] font-mono uppercase text-zinc-400 mb-1.5 block">
                Workflow Mode
              </label>
              <div className="grid grid-cols-3 gap-1 bg-[#131722] p-1 rounded-lg border border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setInputMode('youtube-url')}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded text-center transition-all ${
                    inputMode === 'youtube-url'
                      ? 'bg-zinc-800 text-white shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Youtube className="w-3.5 h-3.5 mb-1" />
                  <span className="text-[10px] font-medium leading-none">URL Remix</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInputMode('custom-prompt')}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded text-center transition-all ${
                    inputMode === 'custom-prompt'
                      ? 'bg-zinc-800 text-white shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <PenLine className="w-3.5 h-3.5 mb-1" />
                  <span className="text-[10px] font-medium leading-none">Prompt</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInputMode('youtube-transcript')}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded text-center transition-all ${
                    inputMode === 'youtube-transcript'
                      ? 'bg-zinc-800 text-white shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 mb-1" />
                  <span className="text-[10px] font-medium leading-none">Transcript</span>
                </button>
              </div>
            </div>

            {/* Mode 1: YouTube URL Remixer */}
            {inputMode === 'youtube-url' && (
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-medium text-zinc-300">
                      YouTube Video URL or ID
                    </label>
                    <span className="text-[10px] font-mono text-emerald-400">Fair Use Engine</span>
                  </div>
                  <div className="relative">
                    <input
                      type="url"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full pl-3 pr-8 py-2 rounded-lg bg-[#141722] border border-white/[0.08] focus:border-white/30 focus:ring-1 focus:ring-white/20 text-xs text-white placeholder:text-zinc-600 outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Quick Presets */}
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 block mb-1">
                    Load Test Benchmarks:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {sampleYouTubeVideos.map((sample) => (
                      <button
                        key={sample.label}
                        type="button"
                        onClick={() => {
                          setYoutubeUrl(sample.url);
                          setRemixSettings((prev) => ({ ...prev, originalVideoUrl: sample.url }));
                        }}
                        className="px-2 py-0.5 rounded text-[10px] bg-[#141722] hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/[0.06] transition-colors"
                      >
                        {sample.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Remix Tone & Transform Slider */}
                <div className="p-3 rounded-lg bg-[#11141E] border border-white/[0.06] space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400 text-[11px]">Transform Tone:</span>
                    <select
                      value={remixSettings.tone}
                      onChange={(e) =>
                        setRemixSettings((prev) => ({
                          ...prev,
                          tone: e.target.value as RemixSettings['tone'],
                        }))
                      }
                      className="bg-[#191D2B] border border-white/[0.08] text-white text-[11px] rounded px-2 py-1 outline-none font-medium"
                    >
                      <option value="documentary">Authoritative Documentary</option>
                      <option value="cyberpunk">Cyberpunk Noir Analysis</option>
                      <option value="satire">Satirical &amp; Provocative</option>
                      <option value="academic">High-Yield Academic</option>
                      <option value="cinematic-epic">Cinematic Blockbuster</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-zinc-400">Transformative Strength:</span>
                      <span className="text-emerald-400 font-mono font-semibold">
                        {remixSettings.transformStrength}% Safe
                      </span>
                    </div>
                    <input
                      type="range"
                      min="70"
                      max="100"
                      value={remixSettings.transformStrength}
                      onChange={(e) =>
                        setRemixSettings((prev) => ({
                          ...prev,
                          transformStrength: parseInt(e.target.value),
                        }))
                      }
                      className="w-full accent-white cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Mode 2: Custom Story Prompt */}
            {inputMode === 'custom-prompt' && (
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-medium text-zinc-300">
                      Story Premise &amp; Concept
                    </label>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {customPrompt.length} chars
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Describe your story concept, characters, conflict, and key message..."
                    className="w-full p-2.5 rounded-lg bg-[#141722] border border-white/[0.08] focus:border-white/30 focus:ring-1 focus:ring-white/20 text-xs text-white placeholder:text-zinc-600 outline-none resize-none leading-relaxed"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-mono text-zinc-500 block mb-1">
                    Narrative Presets:
                  </span>
                  <div className="space-y-1">
                    {SAMPLE_PROMPTS.map((sample) => (
                      <button
                        key={sample.title}
                        type="button"
                        onClick={() => setCustomPrompt(sample.content)}
                        className="w-full text-left p-2 rounded bg-[#11141E] hover:bg-zinc-800/80 border border-white/[0.06] text-[11px] text-zinc-300 hover:text-white transition-colors flex items-center justify-between group"
                      >
                        <span className="font-medium truncate">{sample.title}</span>
                        <ArrowRight className="w-3 h-3 text-zinc-600 group-hover:text-zinc-300 shrink-0 ml-1" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Mode 3: YouTube Transcript */}
            {inputMode === 'youtube-transcript' && (
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-medium text-zinc-300">
                      Raw Subtitle / Transcript
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setRawTranscript(SAMPLE_RAW_TRANSCRIPT);
                        onCleanTranscript(SAMPLE_RAW_TRANSCRIPT);
                      }}
                      className="text-[10px] text-zinc-400 hover:text-white font-mono underline underline-offset-2"
                    >
                      Load Sample
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={rawTranscript}
                    onChange={(e) => {
                      setRawTranscript(e.target.value);
                      onCleanTranscript(e.target.value);
                    }}
                    placeholder="Paste YouTube transcript with timestamps (00:01)..."
                    className="w-full p-2.5 rounded-lg bg-[#141722] border border-white/[0.08] focus:border-white/30 text-xs text-white placeholder:text-zinc-600 outline-none resize-none font-mono text-[11px]"
                  />
                </div>

                {cleanerStats && (
                  <div className="p-2.5 rounded-lg bg-[#11141E] border border-white/[0.06] text-[10px] font-mono text-zinc-400 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-emerald-400 font-medium">
                      <Scissors className="w-3 h-3" />
                      <span>{cleanerStats.timestampsRemoved} timestamps stripped</span>
                    </div>
                    <span>{cleanerStats.cleanedChars} chars cleaned</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: AESTHETIC & PERSONA ================= */}
        {sidebarTab === 'style' && (
          <div className="space-y-4">
            {/* Visual Style Palette */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase text-zinc-400">
                  Visual Grade &amp; Style
                </label>
                <span className="text-[10px] font-mono text-zinc-500">
                  {selectedStyle.name.split(' ')[0]}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {VISUAL_STYLES.map((style) => {
                  const isSelected = selectedStyle.id === style.id;
                  return (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setSelectedStyle(style)}
                      className={`p-2 rounded-lg text-left border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-zinc-800/95 border-white/40 ring-1 ring-white/30 shadow-md'
                          : 'bg-[#11141E] border-white/[0.06] hover:border-white/[0.15] hover:bg-zinc-900/60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1">
                          {style.colorPalette.slice(0, 3).map((c, i) => (
                            <span
                              key={i}
                              className="w-2 h-2 rounded-full border border-black/40"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-xs font-semibold text-white leading-tight">
                        {style.name}
                      </span>
                      <span className="text-[9px] text-zinc-400 mt-1 truncate">
                        {style.lightingStyle.split(' ')[0]} lighting
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Character & Voice Archetype */}
            <div className="p-3 rounded-lg bg-[#11141E] border border-white/[0.06] space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-white font-medium">
                  <Mic className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Narrator Persona</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCharacterDrawerOpen(!isCharacterDrawerOpen)}
                  className="text-[10px] font-mono text-zinc-400 hover:text-white flex items-center gap-0.5"
                >
                  <span>{character.name}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>

              {/* Character Presets */}
              <div className="flex flex-wrap gap-1">
                {PRESET_CHARACTERS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setCharacter(preset)}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium border transition-colors ${
                      character.name === preset.name
                        ? 'bg-zinc-800 text-white border-white/20'
                        : 'bg-[#141722] text-zinc-400 border-white/[0.06] hover:text-white'
                    }`}
                  >
                    {preset.name.split(' ')[0]}
                  </button>
                ))}
              </div>

              {/* Voice Cadence */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] text-zinc-400 font-medium block">Voice Cadence:</span>
                <select
                  value={character.voiceArchetype}
                  onChange={(e) =>
                    setCharacter((prev) => ({
                      ...prev,
                      voiceArchetype: e.target.value as CharacterIdentity['voiceArchetype'],
                    }))
                  }
                  className="w-full bg-[#191D2B] border border-white/[0.08] text-white text-[11px] rounded p-1.5 outline-none font-medium"
                >
                  <option value="deep-dramatic">Deep Dramatic (Cinematic Suspense)</option>
                  <option value="heroic-storyteller">Heroic Storyteller (Authoritative)</option>
                  <option value="tech-futurist">Tech Futurist (Fast-Paced Analytical)</option>
                  <option value="warm-documentary">Warm Documentary (Exploratory)</option>
                  <option value="whimsical-companion">Whimsical Companion (Playful)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: ENGINE & CAMERA ================= */}
        {sidebarTab === 'camera' && (
          <div className="space-y-3.5">
            {/* Video Diffusion Engine */}
            <div>
              <label className="text-[11px] font-mono uppercase text-zinc-400 mb-1.5 block">
                Diffusion Engine
              </label>
              <div className="space-y-1">
                {engines.map((eng) => {
                  const isSelected = config.engine === eng.id;
                  return (
                    <button
                      key={eng.id}
                      type="button"
                      onClick={() => setConfig((prev) => ({ ...prev, engine: eng.id }))}
                      className={`w-full p-2 rounded-lg text-left border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-zinc-800/90 border-white/30 text-white shadow-xs'
                          : 'bg-[#11141E] border-white/[0.06] text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <span className="text-xs font-semibold">{eng.name}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-black/40 text-zinc-400 border border-white/[0.06]">
                        {eng.tag}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Camera Movement */}
            <div className="p-3 rounded-lg bg-[#11141E] border border-white/[0.06] space-y-2.5">
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 font-medium block">
                  Camera Choreography:
                </label>
                <select
                  value={config.cameraMovement}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      cameraMovement: e.target.value as VideoSynthesisConfig['cameraMovement'],
                    }))
                  }
                  className="w-full bg-[#191D2B] border border-white/[0.08] text-white text-[11px] rounded p-1.5 outline-none font-medium"
                >
                  <option value="cinematic-smooth">Cinematic Smooth Dolly &amp; Drift</option>
                  <option value="dynamic-action">Dynamic High-Intensity Action Track</option>
                  <option value="slow-push-in">Dramatic Slow Push-In</option>
                  <option value="static-aesthetic">Fixed Aesthetic Anamorphic Frame</option>
                </select>
              </div>

              {/* Motion Intensity Slider */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-400">Motion Velocity:</span>
                  <span className="text-white font-mono font-medium">{config.motionIntensity}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={config.motionIntensity}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, motionIntensity: parseInt(e.target.value) }))
                  }
                  className="w-full accent-white cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                />
              </div>

              {/* Upscale */}
              <label className="flex items-center gap-2 text-xs text-zinc-300 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.upscale4K}
                  onChange={(e) => setConfig((prev) => ({ ...prev, upscale4K: e.target.checked }))}
                  className="rounded accent-white"
                />
                <span className="text-[11px]">Enable 4K Cinema Upscaling</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Primary Action Button Bar (Fixed Dock at Bottom) */}
      <div className="p-3.5 border-t border-white/[0.06] bg-[#0A0C11] space-y-2">
        <button
          id="btn-sidebar-generate"
          type="button"
          disabled={!canRun || isProcessing}
          onClick={onRunFullPipeline}
          className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-semibold tracking-wide transition-all active:scale-98 ${
            isProcessing
              ? 'bg-zinc-800 text-zinc-400 border border-white/[0.08] cursor-not-allowed'
              : 'bg-white hover:bg-zinc-100 text-zinc-950 font-bold shadow-lg hover:shadow-white/10'
          }`}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Synthesizing Production...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>Generate Remake &amp; Launch Pack</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono bg-black/20 text-zinc-700 rounded border border-black/20">
                ⌘↵
              </kbd>
            </>
          )}
        </button>

        <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono px-0.5">
          <span>Target: {config.aspectRatio === '16:9' ? '16:9 Cinema' : '9:16 Shorts'}</span>
          <span>Engine: {config.engine.split('-')[0].toUpperCase()}</span>
        </div>
      </div>
    </aside>
  );
};
