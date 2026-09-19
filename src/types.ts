export type InputMode = 'custom-prompt' | 'youtube-transcript' | 'youtube-url';

export interface RemixSettings {
  tone: 'documentary' | 'fast-paced' | 'serious-dramatic' | 'humorous-satirical';
  transformStrength: number; // 50 - 100
  characterOverride?: string;
  originalVideoUrl: string;
}

export interface YouTubeAnalysisResult {
  videoId: string;
  originalTitle: string;
  channelTitle: string;
  duration: string;
  hookExtracted: string;
  coreNarrativePremise: string;
  keyInsights: string[];
  rawTranscriptPreview: string;
  copyrightSafetyScore: number;
  transformativeAngles: string[];
}

export type VisualStyleId =
  | 'pixar-3d'
  | 'cyberpunk-anime'
  | 'hyper-realistic'
  | 'comic-book-noir'
  | 'studio-ghibli'
  | 'claymation-fantasy';

export interface VisualStyle {
  id: VisualStyleId;
  name: string;
  badge: string;
  description: string;
  promptModifier: string;
  lightingStyle: string;
  colorPalette: string[];
  sampleImage: string;
}

export interface CharacterIdentity {
  name: string;
  role: 'protagonist' | 'mentor' | 'antagonist' | 'narrator';
  appearance: string;
  personality: string;
  voiceArchetype: 'heroic-storyteller' | 'deep-dramatic' | 'tech-futurist' | 'warm-documentary' | 'whimsical-companion';
}

export interface ScriptScene {
  sceneNumber: number;
  timestamp: string; // e.g., "00:00 - 00:06"
  estimatedDurationSeconds: number;
  title: string;
  cameraAngle: 'wide-cinematic' | 'close-up-emotional' | 'drone-overhead' | 'tracking-dolly' | 'dutch-angle';
  visualPrompt: string; // Tailored for Runway Gen-3 / Luma / Kling
  characterAction: string;
  narration: string;
  emotionTag: '[curious]' | '[whisper]' | '[intense]' | '[triumphant]' | '[suspenseful]' | '[heartfelt]';
  audioEffect?: string;
  visualPreviewSeed?: string;
}

export interface ScriptBreakdown {
  originalCoreConcept: string;
  narrativeArc: {
    hook: string;
    incitingIncident: string;
    risingAction: string;
    climax: string;
    resolutionLesson: string;
  };
  logline: string;
  targetDurationSeconds: number;
  scenes: ScriptScene[];
}

export interface ClickbaitTitle {
  title: string;
  ctrScore: number; // e.g. 98%
  formula: string; // e.g. "Curiosity Gap + High Stakes"
  rationale: string;
}

export interface YouTubeSEOData {
  titles: ClickbaitTitle[];
  selectedTitleIndex: number;
  description: {
    aboveFoldHook: string; // 2 lines visible before "Show more"
    narrativeSummary: string; // keyword rich summary
    chapters: Array<{ timestamp: string; label: string }>;
    callToAction: string;
    socialAndCredits: string;
  };
  tags: string[]; // 15-20 comma-separated SEO tags
  hashtags: string[]; // 3-5 trending hashtags, e.g. #Shorts, #AIAnimation
  viralScore: number; // 0 - 100
  estimatedReachMultiplier: string;
}

export type SynthesisEngine = 'runway-gen3' | 'luma-dream' | 'kling-ai' | 'gemini-veo' | 'heygen-avatar';
export type AspectRatio = '16:9' | '9:16';

export interface VideoSynthesisConfig {
  engine: SynthesisEngine;
  aspectRatio: AspectRatio;
  cameraMovement: 'cinematic-smooth' | 'dynamic-action' | 'slow-push-in' | 'static-aesthetic';
  motionIntensity: number; // 1 - 10
  upscale4K: boolean;
  fps: 24 | 30 | 60;
  voiceSpeed: number; // 0.8 - 1.3
}

export type PipelineStepStatus = 'pending' | 'in-progress' | 'completed' | 'error';

export interface PipelineProgress {
  currentStep: number; // 1, 2, 3, 4
  step1Script: PipelineStepStatus;
  step2Audio: PipelineStepStatus;
  step3Visuals: PipelineStepStatus;
  step4Compilation: PipelineStepStatus;
  overallProgress: number; // 0 - 100%
  statusMessage: string;
}

export interface VideoCompilationOutput {
  id: string;
  videoUrl: string;
  durationSeconds: number;
  resolution: string;
  aspectRatio: AspectRatio;
  fileSizeBytes: number;
  renderedAt: string;
  scenesCount: number;
}

export interface PromptTemplateDoc {
  name: string;
  category: 'script' | 'seo' | 'visual-synthesis' | 'voiceover';
  description: string;
  systemInstruction: string;
  userPromptTemplate: string;
  variables: string[];
}
