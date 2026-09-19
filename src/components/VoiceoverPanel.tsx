import React, { useState, useEffect } from 'react';
import {
  Mic,
  Play,
  Square,
  Volume2,
  Sliders,
  Sparkles,
  Radio,
  CheckCircle2,
  Info,
  Music,
} from 'lucide-react';
import { CharacterIdentity, ScriptBreakdown, ScriptScene } from '../types.js';
import { MusicPlayer, MusicTrack } from './ui/MusicPlayer.js';

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

interface VoiceoverPanelProps {
  script: ScriptBreakdown | null;
  character: CharacterIdentity;
  voiceSpeed: number;
  setVoiceSpeed: (speed: number) => void;
}

export const VoiceoverPanel: React.FC<VoiceoverPanelProps> = ({
  script,
  character,
  voiceSpeed,
  setVoiceSpeed,
}) => {
  const [playingSceneIndex, setPlayingSceneIndex] = useState<number | null>(null);
  const [isPlayingAll, setIsPlayingAll] = useState(false);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stopAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setPlayingSceneIndex(null);
    setIsPlayingAll(false);
  };

  const speakText = (text: string, emotionTag: string, sceneIndex: number, onEndCallback?: () => void) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech synthesis is not supported in this browser window.');
      return;
    }

    window.speechSynthesis.cancel();

    // Strip emotion tag for speech engine
    const cleanText = text.replace(/\[.*?\]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Adapt pitch and rate according to voice archetype & emotion
    let pitch = 1.0;
    let rate = voiceSpeed;

    if (character.voiceArchetype === 'deep-dramatic') {
      pitch = 0.8;
    } else if (character.voiceArchetype === 'whimsical-companion') {
      pitch = 1.25;
      rate = voiceSpeed * 1.1;
    } else if (character.voiceArchetype === 'tech-futurist') {
      pitch = 1.05;
      rate = voiceSpeed * 1.08;
    }

    if (emotionTag.includes('whisper')) {
      pitch = 0.9;
      rate = rate * 0.9;
    } else if (emotionTag.includes('intense')) {
      rate = rate * 1.15;
    } else if (emotionTag.includes('triumphant')) {
      pitch = 1.1;
    }

    utterance.pitch = pitch;
    utterance.rate = rate;

    // Pick suitable voice if available
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    setPlayingSceneIndex(sceneIndex);

    utterance.onend = () => {
      setPlayingSceneIndex(null);
      if (onEndCallback) {
        onEndCallback();
      }
    };

    utterance.onerror = () => {
      setPlayingSceneIndex(null);
      setIsPlayingAll(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const playFullVoiceover = () => {
    if (!script || script.scenes.length === 0) return;
    setIsPlayingAll(true);

    let current = 0;
    const playNext = () => {
      if (current >= script.scenes.length) {
        setIsPlayingAll(false);
        setPlayingSceneIndex(null);
        return;
      }
      const scene = script.scenes[current];
      const nextIdx = current + 1;
      current++;
      speakText(scene.narration, scene.emotionTag, scene.sceneNumber - 1, () => {
        playNext();
      });
    };

    playNext();
  };

  if (!script) {
    return (
      <div className="bg-[#0D0F16] rounded-xl border border-white/[0.08] p-8 text-center space-y-3 shadow-sm">
        <Mic className="w-7 h-7 text-zinc-500 mx-auto" />
        <h3 className="text-xs font-semibold text-white tracking-wide uppercase font-mono">
          Voiceover Engine &bull; Awaiting Screenplay
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
          Generate the screenplay first in Step 1 to produce the emotion-tagged voiceover tracks.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#0D0F16] rounded-xl border border-white/[0.08] p-5 sm:p-6 shadow-sm space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
            <Radio className="w-4 h-4 text-zinc-300" />
            Emotion-Tagged Voiceover &amp; TTS Pipeline
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Dynamic cadence with emotion cues compatible with ElevenLabs and Gemini Speech.
          </p>
        </div>

        {/* Global Audition Buttons */}
        <div className="flex items-center gap-2">
          {isPlayingAll ? (
            <button
              type="button"
              onClick={stopAudio}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium border border-white/[0.08] transition-colors"
            >
              <Square className="w-3.5 h-3.5 fill-current text-rose-400" />
              <span>Stop Audition</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={playFullVoiceover}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white hover:bg-zinc-100 text-zinc-950 text-xs font-bold shadow-md transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Audition Full ({script.scenes.length} Scenes)</span>
            </button>
          )}
        </div>
      </div>

      {/* Voice Controls Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-lg bg-[#11141E] border border-white/[0.06] text-xs">
        {/* Active Archetype */}
        <div className="space-y-1">
          <span className="text-[11px] text-zinc-400 font-medium block">Active Profile:</span>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-white capitalize">
              {character.name} &bull; {character.voiceArchetype.replace('-', ' ')}
            </span>
          </div>
        </div>

        {/* Speed Slider */}
        <div className="space-y-1 sm:col-span-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-zinc-400 font-medium flex items-center gap-1">
              <Sliders className="w-3 h-3 text-zinc-400" /> Speed Multiplier:
            </span>
            <span className="font-mono text-zinc-200 font-semibold">{voiceSpeed.toFixed(2)}x</span>
          </div>
          <input
            type="range"
            min="0.8"
            max="1.3"
            step="0.05"
            value={voiceSpeed}
            onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
            className="w-full accent-white cursor-pointer h-1.5 bg-zinc-800 rounded-lg mt-1"
          />
        </div>
      </div>

      {/* Cinematic Background Audio Player */}
      <div className="p-3.5 rounded-lg bg-[#11141E] border border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
            <Music className="w-3.5 h-3.5 text-sky-400" />
            <span>Cinematic Ambient Score Audition</span>
          </div>
          <p className="text-[11px] text-zinc-400">
            Audition ambient background score tracks beneath the narration to verify cadence and emotional punch.
          </p>
        </div>

        <div className="self-end sm:self-auto shrink-0 pt-2 sm:pt-0">
          <MusicPlayer
            tracks={STUDIO_SOUNDTRACKS}
            accentColor="#38bdf8"
            defaultCollapsed={false}
          />
        </div>
      </div>

      {/* Scene Audio Cards */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
          <Volume2 className="w-3.5 h-3.5 text-zinc-400" />
          Scene Voice Tracks &amp; Performance Cues:
        </h4>

        {script.scenes.map((scene, idx) => {
          const isPlayingThis = playingSceneIndex === idx;

          return (
            <div
              key={scene.sceneNumber}
              className={`p-3 rounded-lg border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isPlayingThis
                  ? 'bg-zinc-800/95 border-white/30 ring-1 ring-white/20'
                  : 'bg-[#11141E] border-white/[0.06] hover:border-white/[0.15]'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (isPlayingThis) {
                      stopAudio();
                    } else {
                      speakText(scene.narration, scene.emotionTag, idx);
                    }
                  }}
                  className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-all ${
                    isPlayingThis
                      ? 'bg-rose-600 text-white'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white border border-zinc-700'
                  }`}
                  title={isPlayingThis ? 'Stop scene narration' : 'Play scene narration'}
                >
                  {isPlayingThis ? (
                    <Square className="w-3 h-3 fill-current" />
                  ) : (
                    <Play className="w-3 h-3 fill-current translate-x-0.5" />
                  )}
                </button>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-zinc-300">
                      Scene {scene.sceneNumber} ({scene.timestamp})
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-zinc-900 text-zinc-400 border border-zinc-800">
                      {scene.emotionTag}
                    </span>
                    {isPlayingThis && (
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Auditioning...
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white leading-relaxed">
                    &ldquo;{scene.narration}&rdquo;
                  </p>
                </div>
              </div>

              {/* Audio SFX indicator */}
              <div className="text-right shrink-0">
                {scene.audioEffect ? (
                  <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                    Cue: {scene.audioEffect}
                  </span>
                ) : (
                  <span className="text-[10px] text-zinc-500 font-mono">Dialogue</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
