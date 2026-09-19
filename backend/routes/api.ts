import { Router, Request, Response } from 'express';
import { cleanYouTubeTranscript } from '../services/transcriptCleaner.js';
import { generateScriptEngine } from '../services/scriptEngine.js';
import { generateViralSEOEngine } from '../services/seoEngine.js';
import { buildSceneSynthesisPayloads, generateFFmpegStitchingTimeline } from '../services/videoSynthesizer.js';
import { buildVoiceoverPlan } from '../services/ttsService.js';
import { remixYouTubeVideo } from '../services/youtubeRemixer.js';
import { INTERNAL_PROMPT_TEMPLATES } from '../prompts.js';
import { CharacterIdentity, RemixSettings, ScriptBreakdown, VideoSynthesisConfig, VisualStyle } from '../../src/types.js';

export const apiRouter = Router();

// Health Check
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'AI Video Remaker & SEO Studio Engine'
  });
});

// Environment / Integration Status (Safe boolean flags only)
apiRouter.get('/config-status', (_req: Request, res: Response) => {
  res.json({
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
    elevenLabsConfigured: Boolean(process.env.ELEVENLABS_API_KEY),
    runwayConfigured: Boolean(process.env.RUNWAY_API_KEY),
    lumaConfigured: Boolean(process.env.LUMA_API_KEY),
    klingConfigured: Boolean(process.env.KLING_API_KEY),
    nodeEnv: process.env.NODE_ENV || 'development'
  });
});

// Transcript Cleaner Tool
apiRouter.post('/clean-transcript', (req: Request, res: Response) => {
  try {
    const { transcript } = req.body;
    if (typeof transcript !== 'string') {
      res.status(400).json({ error: 'Missing or invalid transcript string' });
      return;
    }
    const result = cleanYouTubeTranscript(transcript);
    res.json(result);
  } catch (err) {
    console.error('Error cleaning transcript:', err);
    res.status(500).json({ error: 'Failed to process transcript' });
  }
});

// Script & Scene Breakdown Engine
apiRouter.post('/generate-script', async (req: Request, res: Response) => {
  try {
    const { inputType, content, character, style } = req.body as {
      inputType: 'custom-prompt' | 'youtube-transcript';
      content: string;
      character: CharacterIdentity;
      style: VisualStyle;
    };

    if (!content || !character || !style) {
      res.status(400).json({ error: 'Missing required parameters (content, character, style)' });
      return;
    }

    const script = await generateScriptEngine({
      inputType: inputType || 'custom-prompt',
      content,
      character,
      style
    });

    res.json(script);
  } catch (err) {
    console.error('Error in /generate-script:', err);
    res.status(500).json({ error: 'Script generation pipeline error' });
  }
});

// YouTube URL Remixer & Copyright-Safe Deconstructor
apiRouter.post('/remix-youtube', async (req: Request, res: Response) => {
  try {
    const { url, settings, character, style } = req.body as {
      url: string;
      settings: RemixSettings;
      character: CharacterIdentity;
      style: VisualStyle;
    };

    if (!url || !character || !style) {
      res.status(400).json({ error: 'Missing required parameters (url, character, style)' });
      return;
    }

    const result = await remixYouTubeVideo(url, settings, character, style);
    res.json(result);
  } catch (err) {
    console.error('Error in /remix-youtube:', err);
    res.status(500).json({ error: 'YouTube remix deconstruction pipeline error' });
  }
});

// Viral YouTube SEO Engine
apiRouter.post('/generate-seo', async (req: Request, res: Response) => {
  try {
    const { script, characterName, style } = req.body as {
      script: ScriptBreakdown;
      characterName: string;
      style: VisualStyle;
    };

    if (!script || !characterName || !style) {
      res.status(400).json({ error: 'Missing required parameters (script, characterName, style)' });
      return;
    }

    const seoData = await generateViralSEOEngine({
      script,
      characterName,
      style
    });

    res.json(seoData);
  } catch (err) {
    console.error('Error in /generate-seo:', err);
    res.status(500).json({ error: 'SEO generation pipeline error' });
  }
});

// Full Orchestration Pipeline
apiRouter.post('/orchestrate-pipeline', async (req: Request, res: Response) => {
  try {
    const { inputType, content, character, style, config } = req.body as {
      inputType: 'custom-prompt' | 'youtube-transcript';
      content: string;
      character: CharacterIdentity;
      style: VisualStyle;
      config: VideoSynthesisConfig;
    };

    if (!content || !character || !style || !config) {
      res.status(400).json({ error: 'Missing required orchestration parameters' });
      return;
    }

    // 1. Script generation
    const script = await generateScriptEngine({ inputType, content, character, style });

    // 2. SEO generation
    const seo = await generateViralSEOEngine({ script, characterName: character.name, style });

    // 3. Voiceover plan
    const voiceoverPlan = buildVoiceoverPlan(script.scenes, character.voiceArchetype);

    // 4. Video synthesis payloads
    const synthesisPayloads = buildSceneSynthesisPayloads(script.scenes, style, config);

    // 5. FFmpeg Stitching Timeline
    const timeline = generateFFmpegStitchingTimeline(script.scenes, config.aspectRatio);

    res.json({
      script,
      seo,
      voiceoverPlan,
      synthesisPayloads,
      timeline,
      renderedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error in /orchestrate-pipeline:', err);
    res.status(500).json({ error: 'Full orchestration pipeline encountered an error' });
  }
});

// Prompt Templates inspection endpoint
apiRouter.get('/templates/prompts', (_req: Request, res: Response) => {
  res.json({
    templates: INTERNAL_PROMPT_TEMPLATES
  });
});
