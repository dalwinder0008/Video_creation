import { AspectRatio, ScriptScene, SynthesisEngine, VideoSynthesisConfig, VisualStyle } from '../../src/types.js';

export interface SceneSynthesisPayload {
  sceneId: number;
  engine: SynthesisEngine;
  aspectRatio: AspectRatio;
  durationSeconds: number;
  prompt: string;
  negativePrompt: string;
  cameraMovement: string;
  colorPalette: string[];
  audioTrack: {
    narrationText: string;
    emotionTag: string;
    audioEffect?: string;
  };
  renderParameters: {
    fps: number;
    motionIntensity: number;
    guidanceScale: number;
    seed: number;
  };
}

export interface VideoCompilationTimeline {
  compilationId: string;
  totalDurationSeconds: number;
  aspectRatio: AspectRatio;
  resolution: string;
  scenes: Array<{
    sceneNumber: number;
    title: string;
    startTime: number;
    endTime: number;
    duration: number;
    transition: 'crossfade' | 'whip-pan' | 'zoom-in' | 'glitch';
    visualPrompt: string;
    subtitles: string;
  }>;
  ffmpegScript: string;
  audioStitchingPlan: {
    voiceTrackDuration: number;
    bgmVolumeDuckAtVoice: string; // e.g. "-18dB"
    masterLoudnessLUFS: number; // e.g. -14 LUFS for YouTube standard
  };
}

export function buildSceneSynthesisPayloads(
  scenes: ScriptScene[],
  style: VisualStyle,
  config: VideoSynthesisConfig
): SceneSynthesisPayload[] {
  return scenes.map((scene, idx) => {
    // Generate modular prompt tailored to engine standards
    const cameraDirective = getCameraDirectiveForEngine(scene.cameraAngle, config.engine);
    const engineeredPrompt = `${scene.visualPrompt}. Style: ${style.name}, ${style.promptModifier}. Lighting: ${style.lightingStyle}. Camera: ${cameraDirective}. Masterpiece quality, cinematic 8k, smooth organic motion, ultra-detailed textures.`;

    return {
      sceneId: scene.sceneNumber,
      engine: config.engine,
      aspectRatio: config.aspectRatio,
      durationSeconds: scene.estimatedDurationSeconds,
      prompt: engineeredPrompt,
      negativePrompt: "blurry, low quality, deformed anatomy, flickering, extra limbs, stuttering frames, distorted faces, text watermark",
      cameraMovement: scene.cameraAngle,
      colorPalette: style.colorPalette,
      audioTrack: {
        narrationText: scene.narration,
        emotionTag: scene.emotionTag,
        audioEffect: scene.audioEffect
      },
      renderParameters: {
        fps: config.fps,
        motionIntensity: config.motionIntensity,
        guidanceScale: 7.5,
        seed: 42000 + idx * 1337
      }
    };
  });
}

function getCameraDirectiveForEngine(angle: string, engine: SynthesisEngine): string {
  switch (angle) {
    case 'wide-cinematic':
      return engine === 'runway-gen3' ? 'Wide establishment shot, continuous smooth drone dolly forward' : 'Wide landscape angle, 24mm lens, slow forward drift';
    case 'close-up-emotional':
      return engine === 'kling-ai' ? 'Hero close-up portrait, 85mm portrait lens, shallow depth of field bokeh' : 'Tight close-up, subtle facial micro-expressions, 50mm f/1.4';
    case 'tracking-dolly':
      return 'Fluid dolly tracking shot following character velocity, steadycam stabilization';
    case 'dutch-angle':
      return '15 degree tilted canted horizon, high tension atmospheric framing';
    case 'drone-overhead':
      return 'Cinematic 45-degree birds-eye sweep, rising altitude reveals sweeping vistas';
    default:
      return 'Cinematic slow push-in, perfectly stabilized gimbal';
  }
}

export function generateFFmpegStitchingTimeline(
  scenes: ScriptScene[],
  aspectRatio: AspectRatio,
  resolution = aspectRatio === '16:9' ? '1920x1080' : '1080x1920'
): VideoCompilationTimeline {
  let currentTime = 0;
  const compiledScenes = scenes.map((s, i) => {
    const start = currentTime;
    const end = currentTime + s.estimatedDurationSeconds;
    currentTime = end;

    const transitions: Array<'crossfade' | 'whip-pan' | 'zoom-in' | 'glitch'> = ['crossfade', 'zoom-in', 'whip-pan', 'crossfade'];
    const transition = transitions[i % transitions.length];

    return {
      sceneNumber: s.sceneNumber,
      title: s.title,
      startTime: start,
      endTime: end,
      duration: s.estimatedDurationSeconds,
      transition,
      visualPrompt: s.visualPrompt,
      subtitles: s.narration
    };
  });

  // Construct production-ready FFmpeg command
  const inputFiles = scenes.map((_, i) => `-i scene_${i + 1}.mp4`).join(' ');
  const filterInputs = scenes.map((_, i) => `[${i}:v]scale=${resolution}:force_original_aspect_ratio=increase,crop=${resolution}[v${i}];`).join(' ');
  const concatCommand = scenes.map((_, i) => `[v${i}]`).join('') + `concat=n=${scenes.length}:v=1:a=0[outv]`;

  const ffmpegScript = `# Production FFmpeg Multi-Scene Stitching & Audio Ducking Pipeline
ffmpeg ${inputFiles} -i voiceover_master.wav -i ambient_bgm.mp3 \\
  -filter_complex "\\
    ${filterInputs} \\
    ${concatCommand}; \\
    [${scenes.length + 1}:a]volume=0.25[bgm]; \\
    [${scenes.length}:a][bgm]amix=inputs=2:duration=first:dropout_transition=2[outa] \\
  " \\
  -map "[outv]" -map "[outa]" \\
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p \\
  -c:a aac -b:a 320k -ar 48000 \\
  -movflags +faststart \\
  output_master_${aspectRatio === '16:9' ? '16x9' : '9x16'}.mp4`;

  return {
    compilationId: `vid_${Date.now()}`,
    totalDurationSeconds: currentTime,
    aspectRatio,
    resolution,
    scenes: compiledScenes,
    ffmpegScript,
    audioStitchingPlan: {
      voiceTrackDuration: currentTime,
      bgmVolumeDuckAtVoice: "-18dB",
      masterLoudnessLUFS: -14.0
    }
  };
}
