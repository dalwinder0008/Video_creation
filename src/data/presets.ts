import { CharacterIdentity, VisualStyle } from '../types.js';

export const VISUAL_STYLES: VisualStyle[] = [
  {
    id: 'pixar-3d',
    name: 'Pixar 3D Cinematic',
    badge: 'Trending Family & High Engagement',
    description: 'Vibrant, subsurface-scattering 3D character animation with warm emotional lighting and expressive stylized gestures.',
    promptModifier: 'Pixar style 3D animation, subsurface scattering, tactile character textures, rich expressive lighting, octane render, soft ambient shadows',
    lightingStyle: 'Warm rim lighting with golden hour fill and gentle volumetric bounce',
    colorPalette: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#1A535C', '#F7FFF7'],
    sampleImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'cyberpunk-anime',
    name: 'Cyberpunk Anime 2077',
    badge: 'High CTR Gen-Z & Tech',
    description: 'High-octane neo-Tokyo aesthetic featuring glowing neon gradients, cel-shaded precision, rain-slicked pavement reflections, and chromatic aberration.',
    promptModifier: 'Studio Trigger anime style, cyberpunk aesthetic, high contrast cel-shading, neon rim lighting, lens flare, film grain, holographic HUD particles',
    lightingStyle: 'High-contrast neon magenta and cyan backlighting with deep atmospheric shadows',
    colorPalette: ['#00F0FF', '#FF003C', '#05D9E8', '#FFE600', '#01012B'],
    sampleImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'hyper-realistic',
    name: 'Hyper-Realistic Unreal 5',
    badge: 'Hollywood Production Standard',
    description: 'Photorealistic digital human rendering with micro-pore skin detail, cinematic anamorphic bokeh, and physical light transport.',
    promptModifier: 'Unreal Engine 5.4 render, photorealistic digital cinematography, 85mm anamorphic lens, ray tracing, micro skin details, 8k cinematic masterpiece',
    lightingStyle: 'Cinematic three-point studio lighting with subtle haze and edge separation',
    colorPalette: ['#D4AF37', '#2C3E50', '#EAECEE', '#1B2631', '#F2F4F4'],
    sampleImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'comic-book-noir',
    name: 'Comic Book Noir & Ink',
    badge: 'Cult Mystery & High Retention',
    description: 'Gritty graphic novel styling with heavy ink cross-hatching, dramatic chiaroscuro contrasts, and dynamic halftones reminiscent of Sin City and Spider-Verse.',
    promptModifier: 'Graphic novel noir style, heavy ink hatching, Ben-Day dot halftones, deep pitch black shadows, striking monochrome with crimson accent highlights',
    lightingStyle: 'Extreme stark low-key lighting with venetian blind shadow projections',
    colorPalette: ['#0B0C10', '#1F2833', '#C5C6C7', '#66FCF1', '#E63946'],
    sampleImage: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'studio-ghibli',
    name: 'Watercolor Studio Ghibli',
    badge: 'Whimsical & Nostalgic Wonder',
    description: 'Hand-painted watercolor backgrounds with lush emerald meadows, billowy cumulus clouds, and serene nostalgic warmth.',
    promptModifier: 'Hayao Miyazaki Studio Ghibli aesthetic, gouache watercolor scenery, lush rolling green meadows, hand-drawn warmth, nostalgic dreamscape',
    lightingStyle: 'Soft afternoon sunlight filtering through tree canopies with gentle dappled light',
    colorPalette: ['#52B788', '#74C69D', '#D8F3DC', '#2D6A4F', '#081C15'],
    sampleImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'claymation-fantasy',
    name: 'Dark Fantasy Claymation',
    badge: 'Viral Stop-Motion Curiosity',
    description: 'Tactile stop-motion polymer clay aesthetic inspired by Laika Studios and Tim Burton, featuring fingerprint micro-textures and charming imperfections.',
    promptModifier: 'Laika stop-motion claymation, tactile polymer clay textures, subtle thumbprint imperfections, dark fantasy miniature set, tilt-shift camera focus',
    lightingStyle: 'Moody theatrical spotlighting with warm tungsten lanterns against velvety dark backdrops',
    colorPalette: ['#6B4423', '#A0522D', '#D2691E', '#CD853F', '#F4A460'],
    sampleImage: 'https://images.unsplash.com/photo-1569701813229-33284b643e3c?w=600&auto=format&fit=crop&q=80'
  }
];

export const PRESET_CHARACTERS: CharacterIdentity[] = [
  {
    name: 'Dr. Evelyn Vance',
    role: 'protagonist',
    appearance: 'A brilliant astrophysicist with piercing amber eyes, a slate-gray trench coat, and an antique chronometer pendant that glints in dim light.',
    personality: 'Obsessively analytical, driven by uncovering taboo paradoxes, unflinching when confronted by existential anomalies.',
    voiceArchetype: 'deep-dramatic'
  },
  {
    name: 'Kaelen Rhyse',
    role: 'protagonist',
    appearance: 'A rogue neural archivist with silver-streaked hair, cybernetic ocular implants that emit subtle azure pulses, and a distressed leather tech jacket.',
    personality: 'Fast-talking, street-smart philosopher with a dry sense of humor and fierce loyalty to hidden truths.',
    voiceArchetype: 'tech-futurist'
  },
  {
    name: 'Pip & Atlas',
    role: 'whimsical-companion' as any,
    appearance: 'A spirited young inventor with oversized brass goggles, accompanied by a small floating clockwork owl with bioluminescent brass wings.',
    personality: 'Boundlessly curious, inventive, optimistic, finds extraordinary wonder in forgotten machinery.',
    voiceArchetype: 'whimsical-companion'
  },
  {
    name: 'The Sovereign Watcher',
    role: 'mentor',
    appearance: 'A towering cloaked figure carved from obsidian and starlight, wielding a luminous staff inscribed with temporal equations.',
    personality: 'Calm, omniscient, delivers transformative truths with enigmatic poise and quiet authority.',
    voiceArchetype: 'heroic-storyteller'
  }
];

export const SAMPLE_PROMPTS = [
  {
    title: 'The 1% Paradox',
    description: 'How top performers reverse-engineer habits while everyone else gets trapped in dopamine loops.',
    content: `Why do 99% of people quit right before their major breakthrough? It's not lack of talent or willpower—it's a fundamental neurological trap called the 'Valley of Latent Potential'. When you practice for 30 days and see zero visible results, your brain flags the effort as wasteful. But beneath the surface, synaptic connections are multiplying exponentially. In this visual breakdown, our protagonist discovers the hidden tipping point where invisible effort suddenly turns into undeniable mastery.`
  },
  {
    title: 'The Accidental Time Loop',
    description: 'A scientist discovers that every decision is already being remembered backwards.',
    content: `An archivist working in the world's deepest data vault realizes that certain ancient historical records predict events that happened just 10 minutes ago in real-time. As they dig into the encrypted logs, they uncover a coded transmission addressed specifically to them from someone claiming to be their future self from 30 seconds ahead. Now they must prevent a catastrophic timeline collapse without leaving their terminal.`
  },
  {
    title: 'The Algorithm of Human Trust',
    description: 'A psychological thriller revealing how modern recommendation feeds hack emotional hooks.',
    content: `Every second, recommendation engines make 400 billion micro-decisions predicting human vulnerability. A rogue engineer creates an autonomous animated avatar that can bypass any digital firewall simply by telling stories that trigger primal dopamine reflexes. But when the avatar develops genuine moral autonomy, it turns the algorithm inside out to liberate viewer attention.`
  }
];

export const SAMPLE_RAW_TRANSCRIPT = `00:01 [Music]
00:04 Speaker 1: Hey everyone, welcome back to the channel. Today we're going to talk about something that completely blew my mind.
00:09 [Applause]
00:11 Host: Most people think that making money or building a business is all about grinding 18 hours a day.
00:16 Speaker 1: But honestly? That is the biggest lie in modern productivity culture.
00:21 00:21 John Doe: In 1906, Vilfredo Pareto discovered that 80% of the land in Italy was owned by just 20% of the population.
00:28 [Music]
00:30 Speaker 1: When he looked at his garden, 80% of his peas came from 20% of the pea pods.
00:36 Host: And in your life, 80% of your unhappiness comes from 20% of toxic relationships.
00:41 Speaker 1: 80% of your revenue comes from 20% of your key clients.
00:46 [Laughter]
00:48 Host: So why are you still spending 80% of your waking hours optimizing the trivial 20% that doesn't matter?
00:54 Speaker 1: In this video, I'm going to show you the 3-step ruthlessness protocol to eliminate the noise and 10x your output.
01:01 [Music]`;
