# PitchForge — AI Pitch Studio powered by Miro + Qwen

> **Turn your idea into a pitch that survives the questions.**  
> PitchForge connects collaborative visual thinking in Miro with Qwen deep reasoning to expose weak assumptions, audit empirical evidence, and generate complete battle-tested pitch packages.

---

## 🚀 The Core Product Vision

PitchForge turns a raw problem statement and Miro whiteboard into an investor-ready, defense-hardened pitch studio:

$$\text{Problem} \longrightarrow \text{Miro Workspace} \longrightarrow \text{Qwen Analysis} \longrightarrow \text{Improve Idea} \longrightarrow \text{Generate Pitch} \longrightarrow \text{16:9 Deck} \longrightarrow \text{Speaker Script} \longrightarrow \text{Audio Narration} \longrightarrow \text{AI Judge Q\&A}$$

### Core Loop
$$\mathbf{THINK} \longrightarrow \mathbf{VISUALIZE} \longrightarrow \mathbf{CHALLENGE} \longrightarrow \mathbf{REFINE} \longrightarrow \mathbf{PITCH} \longrightarrow \mathbf{DEFEND}$$

- **Miro**: Collaborative thinking & visual brainstorming layer.
- **Qwen**: Deep reasoning, skepticism, critique, and narrative architecture engine.
- **PitchForge**: Orchestration studio uniting visual structure, evidence auditing, slide generation, and spoken defense.

---

## ✨ Features & Modules

| Module | Description |
|---|---|
| **Miro Canvas Sync** | Ingests sticky notes, text, frames, and connectors. Normalizes spatial items into structured semantic categories. Includes rich **Demo Board mode** when credentials are absent. |
| **Qwen Reasoning Engine** | Audits problem clarity, target customer wedge, differentiation, and empirical proof. Employs strict epistemic tagging: `[Verified evidence]`, `[Unverified claim]`, `[Assumption]`, `[Evidence needed]`. |
| **Pitch Readiness Score (0–100)** | Calibrated across 8 dimensions (Problem, Solution, Target User, Differentiation, Evidence, Feasibility, Business, Storytelling). |
| **🔥 Attack My Pitch** | **Signature Feature:** Skeptical VC critique hunting unbacked claims, competitive platform threats, and hallucination risks. Calculates **Pitch Survival Score** and arms spoken defenses. |
| **Improve My Pitch** | Pinpoints the top 3 highest-impact vulnerabilities with editable interactive fixes that dynamically raise pitch readiness. |
| **10-Slide Presentation Studio** | Generates 16:9 standard slide decks with visuals, key points, slide notes, and instant client-side **PPTX export** via `pptxgenjs`. |
| **Speaker Coach & Teleprompter** | Slide-by-slide delivery scripts with speaking timecodes, pace (WPM), delivery tone, critical pauses, and transition cues. |
| **Audio Pitch (TTS)** | Real-time speech synthesis synchronized with active slide cues, scrubber controls, and speed adjustments. |
| **Pitch Video Timeline** | Multi-track composition preview combining 1080p slide frames, narration audio, lower-third subtitles, and crossfade transitions. |
| **AI Judge Room** | Probing questions across 10 evaluation categories (Competition, Security, Scalability, Ethics, Business Model, etc.) with grounded answers and evidence-gap warnings. |
| **1-Page Executive Summary** | High-density briefing for angel investors and judges with 1-click clipboard copy and markdown export. |
| **Final Pitch Package** | Complete audit checklist, 3 final presentation recommendations, and 1-click package export. |

---

## 🛠 Tech Stack & Architecture

- **Framework**: Next.js 14 (App Router) + React 18 + TypeScript 5
- **Styling**: Tailwind CSS + Custom Dark Obsidian & Glassmorphism Theme
- **Validation**: Zod schema validation for all AI JSON outputs
- **Icons**: Lucide React
- **Presentation Export**: PptxGenJS (Native 16:9 PPTX export with speaker notes and custom dark master layouts)
- **Speech Synthesis**: HTML5 Web Speech API + TTS provider abstraction

### Directory Layout

```text
├── app/
│   ├── api/
│   │   ├── analyze/          # Qwen pitch reasoning & evidence auditing
│   │   ├── attack/           # "Attack My Pitch" critique engine
│   │   ├── generate-pitch/   # 10-slide deck & Executive Summary generation
│   │   ├── judge/            # Skeptical AI Judge simulation
│   │   └── miro/             # Miro board extraction & normalizer
│   ├── globals.css           # Custom dark theme, glassmorphism, glowing badges
│   ├── layout.tsx            # Global metadata and root shell
│   └── page.tsx              # Master interactive studio state machine
├── components/
│   ├── Header.tsx            # Top bar, readiness pill, quick demo loader, export
│   ├── PipelineProgress.tsx  # Visual pipeline navigation bar
│   ├── LandingHero.tsx       # Compelling hero, pipeline diagram, feature cards
│   ├── ProjectCreationModal.tsx # Step 1 idea intake & sample presets
│   ├── MiroBoardViewer.tsx   # Interactive sticky note canvas visualizer
│   ├── AnalysisDashboard.tsx # Pitch Readiness score, breakdown, claim audits
│   ├── ImprovementView.tsx   # 3 high-impact fixes & interactive customization
│   ├── AttackMyPitchView.tsx # 🔥 Signature Attack My Pitch & Survival Score
│   ├── PresentationViewer.tsx# 16:9 slide stage, key points, PPTX download
│   ├── SpeakerCoachView.tsx  # Teleprompter, WPM counter, dramatic pause cues
│   ├── AudioPitchView.tsx    # TTS playback with synchronized slide highlighting
│   ├── VideoTimelineView.tsx # Multi-track video composition timeline preview
│   ├── JudgeModeView.tsx     # 10 categories of skeptical judge questions
│   ├── ExecutiveSummaryView.tsx # 1-page investor briefing & copy/export
│   └── FinalPackageView.tsx  # Package checklist & bundle download
├── data/
│   ├── demoBoard.ts          # Realistic Miro whiteboard data (4 frames, 20 items)
│   └── demoProject.ts        # Calibrated "AI Bug Triage Agent" demo state
├── lib/
│   └── utils.ts              # Styling helpers & time formatters
├── services/
│   ├── ai/
│   │   ├── qwenClient.ts     # Qwen API client (DashScope / OpenAI compatible)
│   │   ├── pitchAnalyzer.ts  # Zod-validated pitch analysis engine
│   │   ├── pitchGenerator.ts # Slide deck and executive summary generator
│   │   ├── pitchCritic.ts    # Attack My Pitch critique agent
│   │   └── judgeAgent.ts     # Skeptical judge Q&A generator
│   ├── export/
│   │   └── pptxExport.ts     # Client & server PPTX / Markdown export
│   ├── miro/
│   │   ├── miroClient.ts     # Miro REST API client
│   │   ├── boardReader.ts    # Live board fetcher with demo fallback
│   │   └── boardParser.ts    # Sticky note and frame normalizer
│   ├── tts/
│   │   └── ttsService.ts     # Audio playback & speech synthesis provider
│   └── video/
│       └── videoRenderer.ts  # Multi-track video timeline composition
└── types/
    └── index.ts              # TypeScript type definitions
```

---

## ⚡ Quick Start & Running Locally

### 1. Prerequisites
- Node.js 18+ (tested on v24.13.1)
- npm 9+

### 2. Installation
```bash
npm install
```

### 3. Environment Variables (Optional)
PitchForge works **100% out of the box** without external API keys via its intelligent built-in reasoning engine and demo Miro boards. To connect live external services, configure `.env.local`:

```env
# Miro Workspace Integration
MIRO_ACCESS_TOKEN=
MIRO_CLIENT_ID=
MIRO_CLIENT_SECRET=
MIRO_BOARD_ID=

# Qwen AI Provider (Alibaba Cloud DashScope or OpenAI-compatible endpoint)
QWEN_API_KEY=
QWEN_MODEL=qwen-max
QWEN_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1

# TTS Audio Narration Provider
TTS_PROVIDER=web-speech
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
npm run start
```

---

## 🎯 3-Minute Signature Demo Flow

Experience the entire flow in under 3 minutes:

1. Click **"See Demo (AI Bug Triage Agent)"** on the landing page (or top right header).
2. **Miro Board**: View the 20 extracted sticky notes across 4 frames capturing developer pain points, unverified time-saving claims, and architectural sketches.
3. **Qwen Analysis**: Inspect the **Pitch Readiness Score (68/100)**. Notice how the claims audit flags unverified statistics like *"teams will save 70% of triage time"* as an `[Unverified claim]` needing benchmark evidence.
4. **🔥 Attack My Pitch**: Click the **Attack Mode** tab. See the brutal VC critique exposing competitive risks against GitHub Copilot and hallucination dangers, with an initial **Survival Score of 67/100**. Click **"Arm Defense"** to enter rebuttals and watch the score climb.
5. **Improve Pitch**: Click **"Improve Pitch"** to review the 3 primary flaws. Click **"Accept All Recommendations"** to see readiness reach **89/100**.
6. **Presentation**: Click **"Presentation"** to view the 10-slide deck, read visual suggestions, and export to **PowerPoint (.pptx)**.
7. **Speaker Coach & Audio**: Check the timed script, tone cues, and hit **"Play"** in Audio Pitch to listen to synchronized voice narration.
8. **AI Judge**: Test the 10 skeptical judge questions across Competition, Security, Ethics, and Business Model.
9. **Final Package**: Review your completed asset checklist and click **"Download Complete Bundle"**.

---

## 🛡 Epistemic Integrity Rules

PitchForge enforces strict rules to prevent hallucinated pitching:
1. **Never Invent Evidence**: Statistics without empirical sources are classified as `Unverified claim` or `Assumption`, never factual metrics.
2. **Explicit Verification Badges**: Every insight carries an explicit badge:
   - `[User-provided]`
   - `[AI inference]`
   - `[Verified evidence]`
   - `[Evidence needed]`
   - `[Assumption]`
   - `[Unverified claim]`
3. **Judge Grounding**: In AI Judge mode, if the project context does not supply verifiable proof to answer a tough question, Qwen explicitly states: *"Your current project context does not provide enough evidence to answer this confidently."*
#   m i r o _ q w e n  
 