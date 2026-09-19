import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.js';
import { DualInputMode } from './components/DualInputMode.js';
import { CharacterCustomizer } from './components/CharacterCustomizer.js';
import { PipelineStepper } from './components/PipelineStepper.js';
import { ScriptSceneViewer } from './components/ScriptSceneViewer.js';
import { VoiceoverPanel } from './components/VoiceoverPanel.js';
import { VideoSynthesisPanel } from './components/VideoSynthesisPanel.js';
import { VideoPlayerOutput } from './components/VideoPlayerOutput.js';
import { ViralSeoBox } from './components/ViralSeoBox.js';
import { PromptTemplatesModal } from './components/PromptTemplatesModal.js';
import { DeploymentGuideModal } from './components/DeploymentGuideModal.js';
import { ArchitectureBentoModal } from './components/ArchitectureBentoModal.js';
import { StatsCounter } from './components/ui/StatsCounter.js';
import { SpotlightNavbar, NavItem } from './components/ui/SpotlightNavbar.js';
import { MusicPlayer, MusicTrack } from './components/ui/MusicPlayer.js';

import {
  CharacterIdentity,
  InputMode,
  PipelineProgress,
  PromptTemplateDoc,
  RemixSettings,
  ScriptBreakdown,
  VideoSynthesisConfig,
  VisualStyle,
  YouTubeAnalysisResult,
  YouTubeSEOData,
} from './types.js';
import { PRESET_CHARACTERS, SAMPLE_PROMPTS, VISUAL_STYLES } from './data/presets.js';
import { AlertTriangle, CheckCircle2, ShieldCheck, Film, ExternalLink, Activity, Clock, FileText, Zap } from 'lucide-react';

const STUDIO_SOUNDTRACKS: MusicTrack[] = [
  {
    title: "Cinematic Atmosphere",
    artist: "Minimalist Ambient Score",
    src: "https://actions.google.com/sounds/v1/ambiences/humming_drone.ogg",
    artwork: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=150&auto=format&fit=crop&q=80",
  },
  {
    title: "Cyberpunk Pulse",
    artist: "Synth Arp Resonance",
    src: "https://actions.google.com/sounds/v1/science_fiction/scifi_hum.ogg",
    artwork: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=150&auto=format&fit=crop&q=80",
  },
  {
    title: "Documentary Horizon",
    artist: "Natural World Cadence",
    src: "https://actions.google.com/sounds/v1/ambiences/wind_synth.ogg",
    artwork: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=150&auto=format&fit=crop&q=80",
  },
];

const STUDIO_NAV_ITEMS: NavItem[] = [
  { label: "Studio Input", href: "#remix-input" },
  { label: "Character Style", href: "#character" },
  { label: "Pipeline", href: "#pipeline" },
  { label: "Script Scenes", href: "#stage-view" },
  { label: "Voiceover", href: "#stage-view" },
  { label: "Video Synthesis", href: "#stage-view" },
  { label: "Player & Launch Pack", href: "#stage-view" },
];

export default function App() {
  // Input State
  const [inputMode, setInputMode] = useState<InputMode>('youtube-url');
  const [customPrompt, setCustomPrompt] = useState<string>(SAMPLE_PROMPTS[0].content);
  const [rawTranscript, setRawTranscript] = useState<string>('');
  const [cleanedTranscript, setCleanedTranscript] = useState<string>('');
  const [cleanerStats, setCleanerStats] = useState<{
    timestampsRemoved: number;
    speakerLabelsRemoved: number;
    originalChars: number;
    cleanedChars: number;
  } | null>(null);
  const [isCleaning, setIsCleaning] = useState(false);

  // YouTube URL Remixer State
  const [youtubeUrl, setYoutubeUrl] = useState<string>('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [remixSettings, setRemixSettings] = useState<RemixSettings>({
    tone: 'documentary',
    transformStrength: 100,
    originalVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  });
  const [isAnalyzingUrl, setIsAnalyzingUrl] = useState(false);
  const [analysisProgressStep, setAnalysisProgressStep] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<YouTubeAnalysisResult | null>(null);

  // Creative & Character State
  const [selectedStyle, setSelectedStyle] = useState<VisualStyle>(VISUAL_STYLES[0]);
  const [character, setCharacter] = useState<CharacterIdentity>(PRESET_CHARACTERS[0]);

  // Video Synthesis Configuration
  const [config, setConfig] = useState<VideoSynthesisConfig>({
    engine: 'runway-gen3',
    aspectRatio: '16:9',
    cameraMovement: 'cinematic-smooth',
    motionIntensity: 7,
    upscale4K: false,
    fps: 30,
    voiceSpeed: 1.0,
  });

  // Pipeline Execution State
  const [script, setScript] = useState<ScriptBreakdown | null>(null);
  const [seo, setSeo] = useState<YouTubeSEOData | null>(null);
  const [activeViewStep, setActiveViewStep] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [pipelineProgress, setPipelineProgress] = useState<PipelineProgress>({
    currentStep: 1,
    step1Script: 'pending',
    step2Audio: 'pending',
    step3Visuals: 'pending',
    step4Compilation: 'pending',
    overallProgress: 0,
    statusMessage: 'Ready to synthesize video and viral SEO.',
  });

  // Modals
  const [isPromptsModalOpen, setIsPromptsModalOpen] = useState(false);
  const [isDeploymentModalOpen, setIsDeploymentModalOpen] = useState(false);
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState(false);
  const [promptTemplates, setPromptTemplates] = useState<PromptTemplateDoc[]>([]);

  // Fetch prompt templates from server
  useEffect(() => {
    fetch('/api/templates/prompts')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.templates) {
          setPromptTemplates(data.templates);
        }
      })
      .catch((err) => console.warn('Could not load prompt templates from server:', err));
  }, []);

  // Transcript Cleaner API handler
  const handleCleanTranscript = async (raw: string) => {
    if (!raw || raw.trim().length === 0) {
      setCleanedTranscript('');
      setCleanerStats(null);
      return;
    }

    setIsCleaning(true);
    try {
      const res = await fetch('/api/clean-transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: raw }),
      });

      if (!res.ok) throw new Error('Failed to clean transcript');
      const data = await res.json();
      setCleanedTranscript(data.cleanedText);
      setCleanerStats({
        timestampsRemoved: data.timestampsRemovedCount,
        speakerLabelsRemoved: data.speakerLabelsRemovedCount,
        originalChars: data.originalCharCount,
        cleanedChars: data.cleanedCharCount,
      });
    } catch (err) {
      console.error('Transcript cleaner failed:', err);
    } finally {
      setIsCleaning(false);
    }
  };

  // YouTube URL Remix Handler
  const handleRemixYouTubeUrl = async () => {
    if (!youtubeUrl.trim()) {
      setErrorMessage('Please enter a valid YouTube video URL or ID.');
      return;
    }

    setErrorMessage(null);
    setIsAnalyzingUrl(true);
    setIsProcessing(true);

    try {
      setAnalysisProgressStep('Fetching transcript & metadata...');
      setPipelineProgress({
        currentStep: 1,
        step1Script: 'in-progress',
        step2Audio: 'pending',
        step3Visuals: 'pending',
        step4Compilation: 'pending',
        overallProgress: 15,
        statusMessage: 'Step 1/4: Analyzing source YouTube video and extracting narrative structure...',
      });

      // Call remix endpoint
      setAnalysisProgressStep('Deconstructing hooks & structure...');
      const remixRes = await fetch('/api/remix-youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: youtubeUrl,
          settings: remixSettings,
          character,
          style: selectedStyle,
        }),
      });

      if (!remixRes.ok) {
        throw new Error('Failed to analyze and transform YouTube video.');
      }

      setAnalysisProgressStep('Generating 100% copyright-safe derivative script...');
      const remixData = await remixRes.json();
      
      setAnalysisResult(remixData.analysis);
      const generatedScript: ScriptBreakdown = remixData.script;
      setScript(generatedScript);

      // Step 2: Audio pass
      setPipelineProgress({
        currentStep: 2,
        step1Script: 'completed',
        step2Audio: 'in-progress',
        step3Visuals: 'pending',
        step4Compilation: 'pending',
        overallProgress: 45,
        statusMessage: 'Step 2/4: Generating emotion tags and voice cadence profiles...',
      });
      await new Promise((r) => setTimeout(r, 600));

      // Step 3: Visual synthesis pass
      setPipelineProgress({
        currentStep: 3,
        step1Script: 'completed',
        step2Audio: 'completed',
        step3Visuals: 'in-progress',
        step4Compilation: 'pending',
        overallProgress: 75,
        statusMessage: `Step 3/4: Engineering camera physics for ${config.engine}...`,
      });
      await new Promise((r) => setTimeout(r, 600));

      // Step 4: SEO metadata synthesis
      setPipelineProgress({
        currentStep: 4,
        step1Script: 'completed',
        step2Audio: 'completed',
        step3Visuals: 'completed',
        step4Compilation: 'in-progress',
        overallProgress: 90,
        statusMessage: 'Step 4/4: Stitching scenes & optimizing high-CTR YouTube metadata...',
      });

      const seoRes = await fetch('/api/generate-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script: generatedScript,
          characterName: character.name,
          style: selectedStyle,
        }),
      });

      if (seoRes.ok) {
        const generatedSeo: YouTubeSEOData = await seoRes.json();
        setSeo(generatedSeo);
      }

      setPipelineProgress({
        currentStep: 4,
        step1Script: 'completed',
        step2Audio: 'completed',
        step3Visuals: 'completed',
        step4Compilation: 'completed',
        overallProgress: 100,
        statusMessage: 'Remix complete! 100% copyright-safe video and Launch Pack ready.',
      });
      setActiveViewStep(4);
    } catch (err: any) {
      console.error('YouTube Remix failed:', err);
      setErrorMessage(err.message || 'An error occurred during YouTube URL remix.');
      setPipelineProgress((prev) => ({ ...prev, statusMessage: 'Error during remix.' }));
    } finally {
      setIsAnalyzingUrl(false);
      setIsProcessing(false);
      setAnalysisProgressStep('');
    }
  };

  // Full Automated Pipeline Orchestrator (handles custom prompt & raw transcript)
  const handleRunFullPipeline = async () => {
    if (inputMode === 'youtube-url') {
      return handleRemixYouTubeUrl();
    }

    const activeContent = inputMode === 'custom-prompt' ? customPrompt : (cleanedTranscript || rawTranscript);

    if (!activeContent || activeContent.trim().length === 0) {
      setErrorMessage(
        inputMode === 'custom-prompt'
          ? 'Please enter a story concept or prompt above before generating.'
          : 'Please paste a YouTube transcript or load the sample above.'
      );
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);

    try {
      // Step 1: Script & Scene Breakdown
      setPipelineProgress({
        currentStep: 1,
        step1Script: 'in-progress',
        step2Audio: 'pending',
        step3Visuals: 'pending',
        step4Compilation: 'pending',
        overallProgress: 25,
        statusMessage: 'Step 1/4: Deconstructing narrative arc and writing screenplay scenes...',
      });
      setActiveViewStep(1);

      const scriptRes = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputType: inputMode,
          content: activeContent,
          character,
          style: selectedStyle,
        }),
      });

      if (!scriptRes.ok) throw new Error('Script generation failed on server.');
      const generatedScript: ScriptBreakdown = await scriptRes.json();
      setScript(generatedScript);

      // Step 2: Voiceover & TTS Generation
      setPipelineProgress({
        currentStep: 2,
        step1Script: 'completed',
        step2Audio: 'in-progress',
        step3Visuals: 'pending',
        step4Compilation: 'pending',
        overallProgress: 50,
        statusMessage: 'Step 2/4: Generating emotion tags and audio narration profiles...',
      });
      setActiveViewStep(2);

      await new Promise((resolve) => setTimeout(resolve, 600));

      // Step 3: Scene-by-Scene Visual Synthesis
      setPipelineProgress({
        currentStep: 3,
        step1Script: 'completed',
        step2Audio: 'completed',
        step3Visuals: 'in-progress',
        step4Compilation: 'pending',
        overallProgress: 75,
        statusMessage: `Step 3/4: Engineering camera physics for ${config.engine}...`,
      });
      setActiveViewStep(3);

      await new Promise((resolve) => setTimeout(resolve, 600));

      // Step 4: Final Compilation & Viral SEO Engine
      setPipelineProgress({
        currentStep: 4,
        step1Script: 'completed',
        step2Audio: 'completed',
        step3Visuals: 'completed',
        step4Compilation: 'in-progress',
        overallProgress: 90,
        statusMessage: 'Step 4/4: Stitching scenes & optimizing high-CTR YouTube metadata...',
      });

      const seoRes = await fetch('/api/generate-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script: generatedScript,
          characterName: character.name,
          style: selectedStyle,
        }),
      });

      if (!seoRes.ok) throw new Error('SEO generation failed on server.');
      const generatedSeo: YouTubeSEOData = await seoRes.json();
      setSeo(generatedSeo);

      // Pipeline Complete!
      setPipelineProgress({
        currentStep: 4,
        step1Script: 'completed',
        step2Audio: 'completed',
        step3Visuals: 'completed',
        step4Compilation: 'completed',
        overallProgress: 100,
        statusMessage: 'Pipeline complete! Ready to preview, download MP4, and copy YouTube metadata.',
      });
      setActiveViewStep(4);
    } catch (err: any) {
      console.error('Pipeline orchestration failed:', err);
      setErrorMessage(err.message || 'An error occurred during pipeline generation. Please retry.');
      setPipelineProgress((prev) => ({
        ...prev,
        statusMessage: 'Error during generation.',
      }));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetProject = () => {
    setScript(null);
    setSeo(null);
    setAnalysisResult(null);
    setActiveViewStep(1);
    setPipelineProgress({
      currentStep: 1,
      step1Script: 'pending',
      step2Audio: 'pending',
      step3Visuals: 'pending',
      step4Compilation: 'pending',
      overallProgress: 0,
      statusMessage: 'Ready to synthesize video and viral SEO.',
    });
    setErrorMessage(null);
  };

  const getActiveSpotlightIndex = () => {
    switch (activeViewStep) {
      case 1:
        return 3;
      case 2:
        return 4;
      case 3:
        return 5;
      case 4:
        return 6;
      default:
        return 0;
    }
  };

  const handleSpotlightNavClick = (_item: NavItem, index: number) => {
    if (index === 0) {
      document.getElementById('remix-input')?.scrollIntoView({ behavior: 'smooth' });
    } else if (index === 1) {
      document.getElementById('character')?.scrollIntoView({ behavior: 'smooth' });
    } else if (index === 2) {
      document.getElementById('pipeline')?.scrollIntoView({ behavior: 'smooth' });
    } else if (index === 3) {
      setActiveViewStep(1);
      document.getElementById('stage-view')?.scrollIntoView({ behavior: 'smooth' });
    } else if (index === 4) {
      setActiveViewStep(2);
      document.getElementById('stage-view')?.scrollIntoView({ behavior: 'smooth' });
    } else if (index === 5) {
      setActiveViewStep(3);
      document.getElementById('stage-view')?.scrollIntoView({ behavior: 'smooth' });
    } else if (index === 6) {
      setActiveViewStep(4);
      document.getElementById('stage-view')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const hasContent = Boolean(script || seo);

  const canRunPipeline = Boolean(
    inputMode === 'youtube-url'
      ? youtubeUrl.trim()
      : inputMode === 'custom-prompt'
      ? customPrompt.trim()
      : (cleanedTranscript || rawTranscript).trim()
  );

  return (
    <div className="min-h-screen bg-[#0A0C11] text-zinc-100 flex flex-col font-sans selection:bg-zinc-700 selection:text-white">
      {/* Minimalist Top Navigation */}
      <Navbar
        aspectRatio={config.aspectRatio}
        onToggleAspectRatio={() =>
          setConfig((prev) => ({
            ...prev,
            aspectRatio: prev.aspectRatio === '16:9' ? '9:16' : '16:9',
          }))
        }
        onOpenPromptsModal={() => setIsPromptsModalOpen(true)}
        onOpenDeploymentModal={() => setIsDeploymentModalOpen(true)}
        onOpenArchitectureModal={() => setIsArchitectureModalOpen(true)}
        onResetProject={handleResetProject}
        isGenerating={isProcessing}
        hasGeneratedContent={hasContent}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="p-3.5 rounded-lg bg-rose-950/70 border border-rose-800/80 text-rose-200 text-xs flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-white text-xs font-medium px-2 py-0.5 rounded bg-rose-900/50"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Live Studio Telemetry Bar with animated StatsCounter */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-[#0D0F16] border border-white/[0.08] shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-white tracking-wider uppercase">STUDIO TELEMETRY</span>
            <span className="text-zinc-600">&bull;</span>
            <span className="text-[11px] text-zinc-400 font-mono">Gemini 2.5 Flash Autonomous Engine</span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 text-xs flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500 font-medium">Scenes:</span>
              <span className="font-mono text-white font-bold">
                <StatsCounter value={script?.scenes.length || 5} duration={1.2} />
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500 font-medium">Script Words:</span>
              <span className="font-mono text-white font-bold">
                <StatsCounter
                  value={script ? script.scenes.reduce((acc, s) => acc + s.narration.split(/\s+/).filter(Boolean).length, 0) : 185}
                  duration={1.4}
                />
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500 font-medium">Est. Runtime:</span>
              <span className="font-mono text-white font-bold">
                <StatsCounter
                  value={script ? script.scenes.reduce((acc, s) => acc + (s.estimatedDurationSeconds || 12), 0) : 60}
                  duration={1.5}
                  suffix="s"
                />
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500 font-medium">Retention Target:</span>
              <span className="font-mono text-emerald-400 font-bold">
                <StatsCounter value={seo ? 96 : 92} duration={1.6} suffix="%" />
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsArchitectureModalOpen(true)}
              className="text-[11px] text-sky-400 hover:text-sky-300 underline font-mono flex items-center gap-1 ml-auto"
            >
              View Architecture Bento &rarr;
            </button>
          </div>
        </div>

        {/* Studio Module Spotlight Interactive Navbar */}
        <div className="flex justify-center -mb-1">
          <SpotlightNavbar
            items={STUDIO_NAV_ITEMS}
            defaultActiveIndex={getActiveSpotlightIndex()}
            onItemClick={handleSpotlightNavClick}
            className="pt-1 pb-1"
          />
        </div>

        {/* Section 1 & 2: Creative Configuration Stack */}
        <div className="grid grid-cols-1 gap-5">
          {/* Dual/Triple Input Mode: URL Remixer vs Custom Prompt vs YouTube Transcript */}
          <div id="remix-input">
            <DualInputMode
              inputMode={inputMode}
              setInputMode={setInputMode}
              customPrompt={customPrompt}
              setCustomPrompt={setCustomPrompt}
              rawTranscript={rawTranscript}
              setRawTranscript={setRawTranscript}
              cleanedTranscript={cleanedTranscript}
              setCleanedTranscript={setCleanedTranscript}
              cleanerStats={cleanerStats}
              onCleanTranscript={handleCleanTranscript}
              isCleaning={isCleaning}
              youtubeUrl={youtubeUrl}
              setYoutubeUrl={setYoutubeUrl}
              remixSettings={remixSettings}
              setRemixSettings={setRemixSettings}
              onAnalyzeYouTubeUrl={handleRemixYouTubeUrl}
              isAnalyzingUrl={isAnalyzingUrl}
              analysisProgressStep={analysisProgressStep}
              analysisResult={analysisResult}
            />
          </div>

          {/* Character Identity & Visual Style Picker (Thumbnails) */}
          <div id="character">
            <CharacterCustomizer
              selectedStyle={selectedStyle}
              setSelectedStyle={setSelectedStyle}
              character={character}
              setCharacter={setCharacter}
            />
          </div>

          {/* Linear-Style Pipeline Stepper & Generation Launcher */}
          <div id="pipeline">
            <PipelineStepper
              progress={pipelineProgress}
              activeViewStep={activeViewStep}
              setActiveViewStep={setActiveViewStep}
              onRunFullPipeline={handleRunFullPipeline}
              isProcessing={isProcessing}
              canRun={canRunPipeline}
            />
          </div>
        </div>

        {/* Active Stage View Tab Content */}
        <div id="stage-view" className="pt-1 space-y-6">
          {activeViewStep === 1 && (
            <ScriptSceneViewer script={script} />
          )}

          {activeViewStep === 2 && (
            <VoiceoverPanel
              script={script}
              character={character}
              voiceSpeed={config.voiceSpeed}
              setVoiceSpeed={(speed) => setConfig((prev) => ({ ...prev, voiceSpeed: speed }))}
            />
          )}

          {activeViewStep === 3 && (
            <VideoSynthesisPanel
              script={script}
              style={selectedStyle}
              config={config}
              setConfig={setConfig}
            />
          )}

          {activeViewStep === 4 && (
            <div className="space-y-6">
              {/* If created via YouTube Remixer, show copyright-safe transformation badge card */}
              {analysisResult && (
                <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-2.5">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-xs font-semibold text-white">
                        YouTube Fair Use Transformation Certificate
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/50">
                      0.0% Content ID Risk &bull; Transformative Derivative
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
                    <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800">
                      <span className="text-[10px] text-zinc-500 uppercase font-mono block mb-0.5">Original Source:</span>
                      <span className="text-zinc-200 font-medium truncate block">{analysisResult.originalTitle}</span>
                      <span className="text-[10px] text-zinc-400">By {analysisResult.channelTitle}</span>
                    </div>

                    <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800">
                      <span className="text-[10px] text-zinc-500 uppercase font-mono block mb-0.5">Extracted Hook:</span>
                      <span className="text-zinc-300 text-[11px] leading-snug block line-clamp-2">{analysisResult.hookExtracted}</span>
                    </div>

                    <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800">
                      <span className="text-[10px] text-zinc-500 uppercase font-mono block mb-0.5">Transformative Premise:</span>
                      <span className="text-zinc-300 text-[11px] leading-snug block line-clamp-2">
                        {analysisResult.transformativeAngles?.[0] || analysisResult.coreNarrativePremise}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 2-Column Clean Studio Layout: Video Player on Left (7 cols), Launch Pack on Right (5 cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7">
                  <VideoPlayerOutput
                    script={script}
                    character={character}
                    style={selectedStyle}
                    aspectRatio={config.aspectRatio}
                  />
                </div>

                <div className="lg:col-span-5">
                  <ViralSeoBox seo={seo} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* If step 4 is not active but we already have generated output, render the Launch Pack below */}
        {activeViewStep !== 4 && seo && (
          <div className="pt-6 border-t border-zinc-800/80">
            <ViralSeoBox seo={seo} />
          </div>
        )}
      </main>

      {/* Clean Linear-Style Footer */}
      <footer className="w-full border-t border-zinc-800/80 bg-[#0B0F17] py-6 px-4 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-zinc-400" />
            <span className="text-zinc-300 font-medium">AI Video Remaker &amp; SEO Studio</span>
            <span>&bull; Full-Stack Generative Video Studio</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-400">
            <button
              type="button"
              onClick={() => setIsArchitectureModalOpen(true)}
              className="hover:text-white transition-colors text-sky-400"
            >
              Architecture Bento
            </button>
            <span>&bull;</span>
            <button
              type="button"
              onClick={() => setIsPromptsModalOpen(true)}
              className="hover:text-white transition-colors"
            >
              Prompt Architecture
            </button>
            <span>&bull;</span>
            <button
              type="button"
              onClick={() => setIsDeploymentModalOpen(true)}
              className="hover:text-white transition-colors"
            >
              Deployment Guide
            </button>
          </div>
        </div>
      </footer>

      {/* Floating Collapsible Music Player */}
      <div className="fixed bottom-5 right-5 z-40">
        <MusicPlayer
          tracks={STUDIO_SOUNDTRACKS}
          accentColor="#38bdf8"
          defaultCollapsed={true}
        />
      </div>

      {/* Modals */}
      <ArchitectureBentoModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
      />

      <PromptTemplatesModal
        isOpen={isPromptsModalOpen}
        onClose={() => setIsPromptsModalOpen(false)}
        templates={promptTemplates}
      />

      <DeploymentGuideModal
        isOpen={isDeploymentModalOpen}
        onClose={() => setIsDeploymentModalOpen(false)}
      />
    </div>
  );
}
