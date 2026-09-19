import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Server, Cloud, ExternalLink } from 'lucide-react';

interface DeploymentGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeploymentGuideModal: React.FC<DeploymentGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const localRunCode = `# 1. Clone or open workspace in VS Code
cd ai-video-remaker

# 2. Install all dependencies
npm install

# 3. Create .env file with your Gemini API key
echo "GEMINI_API_KEY=your_key_here" > .env

# 4. Start the full-stack server
npm run dev

# Open http://localhost:3000 in your browser`;

  const cloudRunCode = `# 1. Build production bundle
npm run build

# 2. Deploy to Google Cloud Run
gcloud run deploy video-remaker-studio \\
  --source . \\
  --platform managed \\
  --region us-central1 \\
  --allow-unauthenticated \\
  --set-env-vars GEMINI_API_KEY="your_actual_key"`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-3xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-zinc-800 text-zinc-200 border border-zinc-700">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white tracking-tight">
                Deployment &amp; Local Setup Guide
              </h2>
              <p className="text-xs text-zinc-400">
                Run locally with VS Code or deploy to production container runtimes.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Section 1: Local VS Code */}
          <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-white flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-zinc-400" />
                Local Development (VS Code + Node.js)
              </h3>
              <button
                type="button"
                onClick={() => handleCopy(localRunCode, 'local')}
                className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white"
              >
                {copiedCode === 'local' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 rounded bg-zinc-900/80 border border-zinc-800 text-zinc-300 font-mono text-[11px] overflow-x-auto leading-relaxed">
              {localRunCode}
            </pre>
          </div>

          {/* Section 2: Google Cloud Run */}
          <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-white flex items-center gap-2">
                <Cloud className="w-3.5 h-3.5 text-zinc-400" />
                Google Cloud Run Container Deployment
              </h3>
              <button
                type="button"
                onClick={() => handleCopy(cloudRunCode, 'cloud')}
                className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white"
              >
                {copiedCode === 'cloud' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 rounded bg-zinc-900/80 border border-zinc-800 text-zinc-300 font-mono text-[11px] overflow-x-auto leading-relaxed">
              {cloudRunCode}
            </pre>
          </div>

          {/* Section 3: 100% Free AI Video Workflows */}
          <div className="p-4 rounded-lg bg-zinc-950 border border-emerald-500/20 space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold">
              <ExternalLink className="w-4 h-4 text-emerald-400" />
              <span>How to Generate AI Videos Completely Free (No Paid API)</span>
            </div>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              You don&apos;t need to purchase any expensive API keys. Here is how you can render your scene videos for $0 using free web credits:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="p-3 rounded bg-zinc-900 border border-zinc-800 space-y-1">
                <span className="font-semibold text-sky-400">1. Luma Dream Machine (lumalabs.ai)</span>
                <p className="text-zinc-400 text-[10px]">
                  Provides ~30 free video generations/month directly on the web. Copy the visual prompt from Step 3 in this app and paste it into the prompt box at <span className="text-zinc-200">lumalabs.ai/dream-machine</span>.
                </p>
              </div>
              <div className="p-3 rounded bg-zinc-900 border border-zinc-800 space-y-1">
                <span className="font-semibold text-purple-400">2. Kling AI (klingai.com)</span>
                <p className="text-zinc-400 text-[10px]">
                  Refreshes with 66 free daily credits every 24 hours. Excellent for character facial consistency and cinematic action.
                </p>
              </div>
              <div className="p-3 rounded bg-zinc-900 border border-zinc-800 space-y-1">
                <span className="font-semibold text-amber-400">3. Haiper.ai (Free Daily)</span>
                <p className="text-zinc-400 text-[10px]">
                  Free tier gives daily HD generation tokens without requiring a credit card.
                </p>
              </div>
              <div className="p-3 rounded bg-zinc-900 border border-zinc-800 space-y-1">
                <span className="font-semibold text-emerald-400">4. RunwayML Free Tier</span>
                <p className="text-zinc-400 text-[10px]">
                  Includes 125 free one-time credits to test Gen-2 / Gen-3 Alpha motions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
