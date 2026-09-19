# AI Video Remaker & SEO Studio

Full-stack production application to transform custom prompts and YouTube transcripts into animated multi-scene video scripts, orchestrate video synthesis pipelines, and generate viral YouTube SEO metadata.

---

## 📁 Project Folder Structure (Frontend & Backend Alag Alag Folders)

```text
├── backend/                       # ⚙️ BACKEND (Express + Gemini AI + API Endpoints)
│   ├── routes/
│   │   └── api.ts                 # /api/clean-transcript, /api/generate-script, /api/generate-seo, etc.
│   ├── services/
│   │   ├── transcriptCleaner.ts   # Transcript cleaning logic (removes 00:14 timestamps & speaker tags)
│   │   ├── scriptEngine.ts        # 5-stage narrative arc screenplay generator
│   │   ├── seoEngine.ts           # 3 high-CTR titles (<60 chars), description, tags, hashtags
│   │   ├── videoSynthesizer.ts    # Runway Gen-3, Luma, Kling, and FFmpeg video pipeline
│   │   └── ttsService.ts          # Voiceover planning with emotion tags
│   ├── gemini.ts                  # @google/genai SDK wrapper
│   ├── prompts.ts                 # Production prompt templates & schemas
│   └── README.md
│
├── src/                           # 🎨 FRONTEND (React 19 + Vite + Tailwind CSS)
│   ├── components/
│   │   ├── Navbar.tsx             # Navigation header, reset button, modal openers
│   │   ├── DualInputMode.tsx      # Mode A (Prompt) & Mode B (YouTube Transcript Cleaner)
│   │   ├── CharacterCustomizer.tsx# Visual style & character archetype selector
│   │   ├── PipelineStepper.tsx    # 4-stage interactive progress stepper
│   │   ├── ScriptSceneViewer.tsx  # Step 1: Screenplay narrative arc & scene cards
│   │   ├── VoiceoverPanel.tsx     # Step 2: Interactive TTS audition with speed & emotion tags
│   │   ├── VideoSynthesisPanel.tsx# Step 3: Runway / Luma / Kling config & API payload generator
│   │   ├── VideoPlayerOutput.tsx  # Step 4: High-definition animated canvas video player + MP4 download
│   │   ├── ViralSeoBox.tsx        # 3 High-CTR titles, rich description, chapters, tags (1-click copy)
│   │   ├── PromptTemplatesModal.tsx # Internal prompt inspection modal
│   │   └── DeploymentGuideModal.tsx # Cloud Run & Docker deployment guide modal
│   ├── data/
│   │   └── presets.ts             # Visual styles, character presets, sample prompts
│   ├── types.ts                   # Shared TypeScript interfaces & types
│   ├── App.tsx                    # Main application orchestrator
│   ├── main.tsx                   # React client entry point
│   └── index.css                  # Tailwind CSS root
│
├── .vscode/                       # 💻 VS CODE CONFIGURATION
│   ├── launch.json                # F5 Debugger configurations (Full-Stack, Backend, Frontend)
│   └── tasks.json                 # Automatic VS Code build & dev tasks
│
├── server.ts                      # Full-stack entry point (Express + Vite middleware on Port 3000)
├── package.json                   # All dependencies and npm scripts
├── vite.config.ts                 # Vite bundler configuration
└── .env.example                   # Environment variable template
```

---

## 🚀 How to Run Locally in VS Code (Local Setup Guide)

### Hindi / Hinglish Instructions:
1. **Repository ko VS Code me open karein:**
   VS Code open karein aur project folder ko select karein (`File > Open Folder...` ya terminal me `code .`).

2. **Terminal open karein:**
   VS Code me `Ctrl + ~` (Windows/Linux) ya `Cmd + ~` (Mac) daba kar integrated terminal open karein.

3. **Dependencies install karein:**
   ```bash
   npm install
   ```

4. **Environment variable file banayein:**
   Root folder me `.env` naam ki file create karein aur apna Gemini API key add karein:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```
   *(Aap Google AI Studio se free Gemini API key le sakte hain)*.

5. **Project run karein (`npm run dev`):**
   ```bash
   npm run dev
   ```
   Yeh single command **Backend Express API** aur **Frontend React Vite** dono ko ek saath start kar deta hai!

6. **Browser me open karein:**
   Browser me `http://localhost:3000` open karein. Aapka app live ho jayega!

---

### English Instructions:

1. **Open project in VS Code:**
   Open VS Code and navigate to the project directory:
   ```bash
   cd ai-video-remaker
   code .
   ```

2. **Install all dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env` and add your Gemini API key:
   ```bash
   cp .env.example .env
   ```
   Add your key inside `.env`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   This launches the unified Express server with Vite middleware on port 3000.

5. **Access the Application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Available NPM Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| **Full-Stack Dev** | `npm run dev` | Runs both Backend API and Frontend simultaneously on port 3000 |
| **Backend Only** | `npm run dev:backend` | Runs the Express backend server with file watching |
| **Frontend Only** | `npm run dev:frontend` | Runs Vite frontend directly |
| **Production Build** | `npm run build` | Builds frontend assets (`dist/`) and compiles backend (`dist/server.cjs`) |
| **Production Start** | `npm run start` | Runs the compiled production server |
| **Type Check / Lint** | `npm run lint` | Validates TypeScript syntax without emitting files |
