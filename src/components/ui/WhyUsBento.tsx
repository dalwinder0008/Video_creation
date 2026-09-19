import * as React from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Layers,
  Film,
  Globe,
  Rocket,
  ChevronRight,
  Cpu,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { cn } from "../../lib/utils.js";

const DEFAULT_TEAM_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
];

const PIPELINE_STEPS = [
  { id: "01", label: "INGEST", Icon: Sparkles },
  { id: "02", label: "REMIX", Icon: Cpu },
  { id: "03", label: "VOICE", Icon: Layers },
  { id: "04", label: "SYNTH", Icon: Film },
  { id: "05", label: "LAUNCH", Icon: Rocket },
];

export interface WhyUsBentoProps {
  className?: string;
  teamAvatars?: string[];
}

export function WhyUsBento({
  className,
  teamAvatars = DEFAULT_TEAM_AVATARS,
}: WhyUsBentoProps) {
  return (
    <section className={cn("py-4 relative z-10 w-full", className)}>
      <div className="flex flex-col gap-3 sm:gap-4">
        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-3.5 auto-rows-auto">
          {/* 01: AI & Automation (Wide) */}
          <motion.div 
            initial="initial"
            whileHover="hover"
            className="col-span-1 md:col-span-2 row-span-1 rounded-xl bg-[#0D0F16] border border-white/[0.08] p-5 sm:p-6 md:p-7 relative overflow-hidden group transition-colors duration-500 flex flex-col justify-center min-h-[150px] sm:min-h-[170px] shadow-sm"
          >
            {/* Visual: Geometric Blueprint on the right */}
            <div className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-36 sm:w-48 md:w-60 z-10 hidden sm:block pointer-events-none opacity-25 group-hover:opacity-40 transition-opacity">
              <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                <polygon points="100,10 190,60 190,140 100,190 10,140 10,60" stroke="currentColor" strokeWidth="1.5" className="text-zinc-400" />
                <polygon points="100,40 160,75 160,125 100,160 40,125 40,75" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-zinc-500" />
                <circle cx="100" cy="100" r="30" stroke="currentColor" strokeWidth="1.5" className="text-zinc-300" />
                <line x1="100" y1="10" x2="100" y2="190" stroke="currentColor" strokeWidth="1" className="text-zinc-600" />
              </svg>
            </div>

            <div className="relative z-30 w-full sm:w-3/5 md:w-3/5">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1.5 sm:mb-2 relative overflow-hidden flex flex-wrap">
                <span className="flex">
                  {"Autonomous AI Video Engine".split("").map((l, i) => (
                    <motion.span
                      key={i}
                      className="inline-block"
                      variants={{
                        initial: { y: 0 },
                        hover: { y: "-100%" },
                      }}
                      transition={{ duration: 0.3, delay: i * 0.02, ease: [0.33, 1, 0.68, 1] }}
                    >
                      {l === " " ? "\u00A0" : l}
                    </motion.span>
                  ))}
                </span>
                <span className="absolute inset-0 flex text-sky-400 pointer-events-none" aria-hidden>
                  {"Autonomous AI Video Engine".split("").map((l, i) => (
                    <motion.span
                      key={i}
                      className="inline-block"
                      variants={{
                        initial: { y: "100%" },
                        hover: { y: 0 },
                      }}
                      transition={{ duration: 0.3, delay: i * 0.02, ease: [0.33, 1, 0.68, 1] }}
                    >
                      {l === " " ? "\u00A0" : l}
                    </motion.span>
                  ))}
                </span>
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm md:text-base leading-relaxed">
                Transform long-form transcripts into viral, copyright-safe screenplays with camera direction, emotion-synced voiceovers, and ready-to-render multi-engine video payloads.
              </p>
            </div>
          </motion.div>

          {/* 02: Pipeline Execution (Tall & Dark) */}
          <div className="col-span-1 md:col-span-1 row-span-1 md:row-span-2 rounded-xl border border-white/[0.08] bg-[#0A0C11] p-5 sm:p-6 md:p-7 relative overflow-hidden group transition-all duration-500 flex flex-col justify-between text-white min-h-[310px] sm:min-h-[350px]">
            {/* Visual: Stacked Cards */}
            <div className="relative z-10 w-full flex flex-col items-center justify-center min-h-[140px] sm:min-h-[160px] mb-3 sm:mb-4 translate-x-2">
              <div className="relative w-full max-w-[170px] sm:max-w-[200px] aspect-4/3 group-hover:-translate-y-2 group-hover:scale-105 transition-all duration-300 ease-out">
                {/* Back card 4 */}
                <div className="absolute inset-0 bg-zinc-800 rounded-xl border border-zinc-700/50 transform -rotate-12 -translate-x-3 translate-y-3 shadow-xl transition-all duration-300 ease-out group-hover:rotate-[-20deg] group-hover:-translate-x-6 group-hover:translate-y-6" />
                {/* Back card 3 */}
                <div className="absolute inset-0 bg-zinc-700 rounded-xl border border-zinc-600/50 transform -rotate-9 -translate-x-2.5 translate-y-2.5 shadow-xl transition-all duration-300 ease-out group-hover:rotate-[-15deg] group-hover:-translate-x-5 group-hover:translate-y-5" />
                {/* Back card 2 */}
                <div className="absolute inset-0 bg-zinc-600 rounded-xl border border-zinc-500/50 transform -rotate-6 -translate-x-1.5 translate-y-1.5 shadow-xl transition-all duration-300 ease-out group-hover:rotate-[-10deg] group-hover:-translate-x-3 group-hover:translate-y-3" />
                {/* Back card 1 */}
                <div className="absolute inset-0 bg-zinc-500 rounded-xl border border-zinc-400/50 transform -rotate-3 -translate-x-1 translate-y-1 shadow-xl transition-all duration-300 ease-out group-hover:-rotate-5 group-hover:-translate-x-1.5 group-hover:translate-y-1.5" />

                {/* Front card */}
                <div
                  className="absolute inset-0 bg-zinc-950 rounded-xl p-3.5 sm:p-4 flex flex-col justify-between text-white shadow-2xl border border-white/20"
                >
                  <div className="flex gap-1 items-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-400">STUDIO CORE</span>
                  </div>

                  <div className="font-mono text-[14px] sm:text-[17px] font-bold leading-[1.15] tracking-tight mt-auto mb-2 text-zinc-100">
                    Transcript.
                    <br />
                    Storyboard.
                    <br />
                    Broadcast.
                  </div>

                  <div className="font-mono text-[8px] text-sky-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <span>&gt; 4K RENDER READY</span>
                    <span className="animate-pulse">_</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5">
                From Raw Clip to Broadcast
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                Feed any YouTube URL or prompt. Our automated pipeline handles transcript cleaning, persona styling, emotion audio, and SEO viral tags.
              </p>
            </div>
            {/* Watermark Number */}
            <div className="absolute -right-6 -bottom-12 text-[9rem] sm:text-[12rem] font-bold text-white/[0.03] pointer-events-none group-hover:scale-105 transition-transform duration-700 leading-none select-none">
              02
            </div>
          </div>

          {/* 03: Multi-Engine Synthesis */}
          <motion.div 
            initial="initial"
            whileHover="hover"
            className="col-span-1 md:col-span-1 row-span-1 rounded-xl bg-[#0D0F16] border border-white/[0.08] p-5 sm:p-6 md:p-7 relative overflow-hidden group transition-colors duration-500 flex flex-col justify-between min-h-[150px] sm:min-h-[170px]"
          >
            {/* Stacked avatars */}
            <div className="flex items-center relative z-10 mb-3 h-8 sm:h-10">
              {teamAvatars.map((src, i) => (
                <motion.div
                  key={i}
                  className="relative w-7 h-7 sm:w-9 sm:h-9 rounded-full overflow-hidden ring-2 ring-zinc-900 shadow-sm"
                  style={{
                    marginLeft: i === 0 ? 0 : "-9px",
                    zIndex: teamAvatars.length - i,
                  }}
                  variants={{
                    initial: { x: 0, y: 0, rotate: 0, scale: 1 },
                    hover: {
                      x: i * 12,
                      y: i % 2 === 0 ? -4 : 4,
                      rotate: (i - 2) * 5,
                      scale: 1.1,
                    },
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                    bounce: 0,
                  }}
                >
                  <img
                    src={src}
                    alt="team member"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />
                </motion.div>
              ))}
            </div>

            <div className="relative z-10">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                Multi-Engine Dispatch
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                Seamlessly target Runway Gen-3, Luma Dream Machine, Kling AI, and Midjourney with tailor-formatted camera prompts.
              </p>
            </div>
            <div className="absolute -right-3 -bottom-8 text-[6rem] sm:text-[8rem] font-bold text-white/[0.03] pointer-events-none group-hover:scale-105 transition-transform duration-700 leading-none select-none">
              03
            </div>
          </motion.div>

          {/* 04: Zero-Friction Pipeline */}
          <motion.div 
            initial="initial"
            whileHover="hover"
            className="col-span-1 md:col-span-1 row-span-1 rounded-xl bg-[#0D0F16] border border-white/[0.08] p-5 sm:p-6 md:p-7 relative overflow-hidden group transition-colors duration-500 flex flex-col justify-between min-h-[150px] sm:min-h-[170px]"
          >
            {/* Pipeline visual */}
            <div className="relative z-10 w-full mb-3">
              <div className="flex items-start justify-between">
                {PIPELINE_STEPS.map(({ id, label, Icon }, i) => (
                  <React.Fragment key={id}>
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="relative p-1 rounded-md bg-[#161A26] border border-white/[0.06]">
                        <Icon className="w-3.5 h-3.5 text-zinc-300" />
                        {i === PIPELINE_STEPS.length - 1 && (
                          <span className="absolute -inset-0.5 rounded-full bg-sky-500/30 animate-ping" />
                        )}
                      </div>
                      <span className="text-[7px] text-zinc-400 font-mono font-bold tracking-widest mt-1">
                        {label}
                      </span>
                    </div>

                    {i < PIPELINE_STEPS.length - 1 && (
                      <div className="mt-1 text-zinc-600 group-hover:text-zinc-300 transition-colors duration-300">
                        <ChevronRight className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="relative z-10">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Copyright Safe
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                Dynamic structural transformation rewrites the core thesis into an entirely original perspective, avoiding Content ID strikes.
              </p>
            </div>
            <div className="absolute -right-3 -bottom-8 text-[6rem] sm:text-[8rem] font-bold text-white/[0.03] pointer-events-none group-hover:scale-105 transition-transform duration-700 leading-none select-none">
              04
            </div>
          </motion.div>

          {/* 05: Deep Engineering (Wide Bottom) */}
          <motion.div 
            initial="initial"
            whileHover="hover"
            className="col-span-1 md:col-span-3 row-span-1 md:row-span-1 min-h-[140px] sm:min-h-[150px] rounded-xl bg-[#0D0F16] border border-white/[0.08] p-5 sm:p-6 md:p-7 relative overflow-hidden group transition-colors duration-500 flex flex-col justify-center shadow-sm"
          >
            <div className="relative z-30 w-full sm:w-3/5 md:w-3/5">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1.5 sm:mb-2 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-sky-400" />
                Gemini 2.5 Flash + Real-time Audio Architecture
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm md:text-base leading-relaxed md:max-w-xl">
                Combines high-retention cinematic screenplays, custom visual diffusion modifiers, synchronized audio previews, and SEO metadata into a unified creator studio.
              </p>
            </div>
            
            {/* Watermark Number */}
            <div className="absolute -right-6 -bottom-12 text-[8rem] sm:text-[11rem] font-bold text-white/[0.03] pointer-events-none group-hover:scale-105 transition-transform duration-700 leading-none select-none z-10">
              05
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default WhyUsBento;
