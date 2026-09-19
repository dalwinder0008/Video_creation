# Backend Architecture & Services

This directory contains the entire backend API layer, server services, and generative AI orchestration modules.

## Directory Structure

- **`routes/api.ts`**: Express router exposing all `/api/*` endpoints:
  - `POST /api/clean-transcript`: Cleans raw YouTube transcript (removes timestamps, speaker labels, filler).
  - `POST /api/generate-script`: Generates 5-stage narrative arc screenplay and scene breakdowns using Gemini 2.5.
  - `POST /api/generate-seo`: Generates 3 high-CTR titles, mobile-friendly description, chapters, and tags.
  - `POST /api/orchestrate-pipeline`: Full 4-step pipeline orchestration endpoint.
  - `GET /api/templates/prompts`: Exposes internal backend prompt templates for transparency and prompt auditing.
- **`services/`**:
  - `transcriptCleaner.ts`: Regex-based and heuristic transcript parsing engine.
  - `scriptEngine.ts`: Screenplay generator producing cinematic visual diffusion prompts and character actions.
  - `seoEngine.ts`: High-CTR YouTube metadata generator.
  - `videoSynthesizer.ts`: Modular video generation payloads for Runway Gen-3, Luma Dream Machine, Kling AI, and FFmpeg stitching commands.
  - `ttsService.ts`: Voiceover and emotion tag modulation engine.
- **`gemini.ts`**: Centralized, secure `@google/genai` SDK client initialization.
- **`prompts.ts`**: Production prompt templates with system instructions and JSON schemas.

## Running the Backend

In VS Code terminal:
```bash
# Run backend with live file reload
npm run dev:backend

# Or run full-stack (backend + frontend together)
npm run dev
```
