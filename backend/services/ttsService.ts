export interface VoiceoverScenePlan {
  sceneNumber: number;
  emotionTag: string;
  narrationText: string;
  voiceArchetype: string;
  voiceId: string;
  stability: number;
  similarityBoost: number;
  styleExaggeration: number;
  pacingMultiplier: number;
  audioEffectsCue?: string;
}

export function buildVoiceoverPlan(scenes: Array<{ sceneNumber: number; narration: string; emotionTag: string; audioEffect?: string }>, voiceArchetype: string): VoiceoverScenePlan[] {
  return scenes.map(scene => {
    let stability = 0.5;
    let styleExaggeration = 0.4;

    if (scene.emotionTag === '[whisper]') {
      stability = 0.7;
      styleExaggeration = 0.6;
    } else if (scene.emotionTag === '[intense]') {
      stability = 0.35;
      styleExaggeration = 0.8;
    } else if (scene.emotionTag === '[triumphant]') {
      stability = 0.45;
      styleExaggeration = 0.75;
    }

    const voiceIds: Record<string, string> = {
      'heroic-storyteller': '21m00Tcm4TlvDq8ikWAM', // Adam
      'deep-dramatic': 'ErXwobaYiN019PkySvjV', // Antoni
      'tech-futurist': 'AZnzlk1XvdvUeBnXmlld', // Domi
      'warm-documentary': 'EXAVITQu4vr4xnSDxMaL', // Bella
      'whimsical-companion': 'MF3mGyEYCl7XYWbV9V6O' // Elli
    };

    return {
      sceneNumber: scene.sceneNumber,
      emotionTag: scene.emotionTag,
      narrationText: scene.narration,
      voiceArchetype,
      voiceId: voiceIds[voiceArchetype] || '21m00Tcm4TlvDq8ikWAM',
      stability,
      similarityBoost: 0.85,
      styleExaggeration,
      pacingMultiplier: 1.0,
      audioEffectsCue: scene.audioEffect
    };
  });
}
