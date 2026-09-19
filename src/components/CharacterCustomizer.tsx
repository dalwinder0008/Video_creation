import React, { useState } from 'react';
import {
  Palette,
  User,
  Check,
  Sparkles,
  Mic,
  Camera,
  Layers,
} from 'lucide-react';
import { CharacterIdentity, VisualStyle } from '../types.js';
import { PRESET_CHARACTERS, VISUAL_STYLES } from '../data/presets.js';

interface CharacterCustomizerProps {
  selectedStyle: VisualStyle;
  setSelectedStyle: (style: VisualStyle) => void;
  character: CharacterIdentity;
  setCharacter: React.Dispatch<React.SetStateAction<CharacterIdentity>>;
}

export const CharacterCustomizer: React.FC<CharacterCustomizerProps> = ({
  selectedStyle,
  setSelectedStyle,
  character,
  setCharacter,
}) => {
  const [activeTab, setActiveTab] = useState<'style' | 'character'>('style');

  return (
    <div className="bg-[#0D0F16] rounded-xl border border-white/[0.08] p-4 sm:p-6 shadow-sm space-y-4">
      {/* Header with Subtle Sub-tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
        <div>
          <h2 className="text-sm font-semibold text-white tracking-tight">
            Visual Style &amp; Character Persona
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Configure visual aesthetic, rendering archetype, and vocal pacing.
          </p>
        </div>

        {/* Minimalist Tab Toggle with responsive mobile layout */}
        <div className="grid grid-cols-2 sm:inline-flex rounded-lg bg-[#11141E] p-1 border border-white/[0.06] text-xs font-medium w-full sm:w-auto gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('style')}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-md transition-all touch-manipulation ${
              activeTab === 'style'
                ? 'bg-zinc-800 text-white font-semibold shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Aesthetic ({selectedStyle.name.split(' ')[0]})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('character')}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-md transition-all touch-manipulation ${
              activeTab === 'character'
                ? 'bg-zinc-800 text-white font-semibold shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Character ({character.name.split(' ')[0]})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Modern Visual Thumbnail Cards */}
      {activeTab === 'style' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {VISUAL_STYLES.map((style) => {
              const isSelected = selectedStyle.id === style.id;
              // Clean tag mapping
              const cleanTagMap: Record<string, string> = {
                'pixar-3d': 'Storytelling',
                'cyberpunk-anime': 'Action & Sci-Fi',
                'hyper-realistic': 'Cinematic Master',
                'comic-book-noir': 'Mystery & Thriller',
                'studio-ghibli': 'Emotional Journey',
                'claymation-fantasy': 'Artistic Depth',
              };
              const tag = cleanTagMap[style.id] || 'Universal';

              return (
                <div
                  key={style.id}
                  onClick={() => setSelectedStyle(style)}
                  className={`cursor-pointer rounded-lg p-3 border transition-all text-left flex flex-col justify-between relative group ${
                    isSelected
                      ? 'bg-zinc-800/95 border-white/30 ring-1 ring-white/20 shadow-md'
                      : 'bg-[#11141E] border-white/[0.06] hover:border-white/[0.15]'
                  }`}
                >
                  <div>
                    {/* Visual Color Palette Swatch bar */}
                    <div className="flex items-center gap-1 mb-2.5">
                      {style.colorPalette.slice(0, 3).map((c, i) => (
                        <span
                          key={i}
                          className="w-2.5 h-2.5 rounded-full border border-black/40"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>

                    <div className="flex items-start justify-between gap-1">
                      <h3 className="text-xs font-semibold text-white leading-tight">
                        {style.name}
                      </h3>
                      {isSelected && (
                        <span className="w-4 h-4 rounded-full bg-white text-zinc-950 flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                      )}
                    </div>

                    <span className="inline-block text-[10px] font-medium text-zinc-400 mt-1">
                      {tag}
                    </span>
                  </div>

                  <div className="pt-2 mt-2 border-t border-white/[0.06] text-[10px] text-zinc-500 truncate">
                    {style.lightingStyle.split(' ')[0]} lighting
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Style Prompt Modifiers Callout */}
          <div className="p-3 rounded-lg bg-[#11141E] border border-white/[0.06] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-zinc-400">
              <Camera className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span className="font-mono text-[11px] text-zinc-300 truncate max-w-2xl">
                Active Diffusion: {selectedStyle.promptModifier}
              </span>
            </div>
            <span className="text-[11px] text-zinc-500 shrink-0">
              {selectedStyle.lightingStyle}
            </span>
          </div>
        </div>
      )}

      {/* TAB 2: Clean Character Customizer */}
      {activeTab === 'character' && (
        <div className="space-y-4">
          {/* Preset Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-zinc-500 text-[11px] font-medium mr-1">Preset Cast:</span>
            {PRESET_CHARACTERS.map((preset) => {
              const isSelected = character.name === preset.name;
              return (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => setCharacter({ ...preset })}
                  className={`px-3 py-1 rounded-md text-xs font-medium border transition-colors ${
                    isSelected
                      ? 'bg-zinc-800 text-white border-zinc-600 font-semibold'
                      : 'bg-[#11141E] text-zinc-400 border-white/[0.06] hover:text-white hover:border-white/[0.15]'
                  }`}
                >
                  {preset.name} ({preset.role})
                </button>
              );
            })}
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <label htmlFor="input-char-name" className="text-[11px] font-medium text-zinc-400">
                Character Name
              </label>
              <input
                id="input-char-name"
                type="text"
                value={character.name}
                onChange={(e) => setCharacter((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-md bg-[#11141E] border border-white/[0.08] focus:border-white/20 focus:ring-1 focus:ring-white/20 p-2 text-xs text-white outline-none"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="select-char-voice" className="text-[11px] font-medium text-zinc-400">
                Voice Cadence &amp; Archetype
              </label>
              <select
                id="select-char-voice"
                value={character.voiceArchetype}
                onChange={(e) =>
                  setCharacter((prev) => ({
                    ...prev,
                    voiceArchetype: e.target.value as CharacterIdentity['voiceArchetype'],
                  }))
                }
                className="w-full rounded-md bg-[#11141E] border border-white/[0.08] focus:border-white/20 focus:ring-1 focus:ring-white/20 p-2 text-xs text-white outline-none"
              >
                <option value="deep-dramatic">Deep Dramatic (Cinematic Suspense)</option>
                <option value="heroic-storyteller">Heroic Storyteller (Warm &amp; Authoritative)</option>
                <option value="tech-futurist">Tech Futurist (Fast-Paced Analytical)</option>
                <option value="warm-documentary">Warm Documentary (Exploratory)</option>
                <option value="whimsical-companion">Whimsical Companion (Playful)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="textarea-char-appearance" className="text-[11px] font-medium text-zinc-400">
                Visual Wardrobe &amp; Features
              </label>
              <textarea
                id="textarea-char-appearance"
                rows={2}
                value={character.appearance}
                onChange={(e) => setCharacter((prev) => ({ ...prev, appearance: e.target.value }))}
                className="w-full rounded-md bg-[#11141E] border border-white/[0.08] focus:border-white/20 focus:ring-1 focus:ring-white/20 p-2 text-xs text-white outline-none resize-none leading-relaxed"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="textarea-char-personality" className="text-[11px] font-medium text-zinc-400">
                Driving Motivation &amp; Tone
              </label>
              <textarea
                id="textarea-char-personality"
                rows={2}
                value={character.personality}
                onChange={(e) => setCharacter((prev) => ({ ...prev, personality: e.target.value }))}
                className="w-full rounded-md bg-[#11141E] border border-white/[0.08] focus:border-white/20 focus:ring-1 focus:ring-white/20 p-2 text-xs text-white outline-none resize-none leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
