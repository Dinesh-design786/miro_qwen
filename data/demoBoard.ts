import { BoardContext, BoardItem, BoardFrame } from '@/types';

export const DEMO_BOARD_ITEMS: BoardItem[] = [
  // Frame 1: Problem & User Pain
  {
    id: 'item-f1',
    type: 'frame',
    text: 'Frame: Problem Space & Daily Friction',
    position: { x: 50, y: 50 },
    metadata: { width: 520, height: 420 },
  },
  {
    id: 'item-1',
    type: 'sticky_note',
    text: 'Bug reports from users and QA are chronically incomplete (missing OS, logs, repro steps)',
    position: { x: 80, y: 110 },
    color: '#FEF08A', // Yellow
    author: 'DevLead (Sarah)',
    frameTitle: 'Problem Space & Daily Friction',
    tags: ['pain-point', 'verified'],
  },
  {
    id: 'item-2',
    type: 'sticky_note',
    text: 'Senior engineers waste 15-20% of sprint time manually triaging and asking for basic repro details',
    position: { x: 300, y: 110 },
    color: '#FEF08A',
    author: 'StaffEngineer (Kiran)',
    frameTitle: 'Problem Space & Daily Friction',
    tags: ['cost', 'unverified-claim'],
  },
  {
    id: 'item-3',
    type: 'sticky_note',
    text: 'Duplicate issues are common across repos; 30% of new issues already exist in some form',
    position: { x: 80, y: 240 },
    color: '#FED7AA', // Orange
    author: 'QA Lead (Alex)',
    frameTitle: 'Problem Space & Daily Friction',
    tags: ['duplicates', 'assumption'],
  },
  {
    id: 'item-4',
    type: 'sticky_note',
    text: 'Critical severity bugs get lost in the backlog noise during weekend deployments',
    position: { x: 300, y: 240 },
    color: '#FECDD3', // Rose
    author: 'SRE (Marcus)',
    frameTitle: 'Problem Space & Daily Friction',
    tags: ['severity-risk'],
  },

  // Frame 2: Solution & Desired Capabilities
  {
    id: 'item-f2',
    type: 'frame',
    text: 'Frame: AI Triage Agent Architecture',
    position: { x: 620, y: 50 },
    metadata: { width: 520, height: 420 },
  },
  {
    id: 'item-5',
    type: 'sticky_note',
    text: 'Automatic issue classification (Bug vs Feature vs Config error) using Qwen reasoning',
    position: { x: 650, y: 110 },
    color: '#BAE6FD', // Sky Blue
    author: 'ML Architect (Dave)',
    frameTitle: 'AI Triage Agent Architecture',
    tags: ['solution', 'ai-inference'],
  },
  {
    id: 'item-6',
    type: 'sticky_note',
    text: 'Component prediction: Map stack traces & error keywords to git code owners and sub-teams',
    position: { x: 870, y: 110 },
    color: '#BAE6FD',
    author: 'Backend Lead',
    frameTitle: 'AI Triage Agent Architecture',
    tags: ['routing'],
  },
  {
    id: 'item-7',
    type: 'sticky_note',
    text: 'Missing Information Detection: Bot politely prompts reporter for specific missing logs or crash dumps immediately',
    position: { x: 650, y: 240 },
    color: '#BBF7D0', // Emerald Green
    author: 'Product Mgr (Elena)',
    frameTitle: 'AI Triage Agent Architecture',
    tags: ['interactive', 'verified-win'],
  },
  {
    id: 'item-8',
    type: 'sticky_note',
    text: 'Vector semantic deduplication: Link similar issues with cosine similarity and diff analysis',
    position: { x: 870, y: 240 },
    color: '#DDD6FE', // Purple
    author: 'ML Architect (Dave)',
    frameTitle: 'AI Triage Agent Architecture',
    tags: ['vector-db'],
  },

  // Frame 3: Assumptions & Unverified Claims (Critical for PitchForge reasoning!)
  {
    id: 'item-f3',
    type: 'frame',
    text: 'Frame: Assumptions, Claims & Competitors',
    position: { x: 50, y: 510 },
    metadata: { width: 520, height: 380 },
  },
  {
    id: 'item-9',
    type: 'sticky_note',
    text: 'Claim: "Teams will save 70% of triage time in month 1 and accelerate release velocity"',
    position: { x: 80, y: 570 },
    color: '#FECDD3', // Red/Rose
    author: 'Founder',
    frameTitle: 'Assumptions, Claims & Competitors',
    tags: ['unverified-claim', 'needs-evidence'],
  },
  {
    id: 'item-10',
    type: 'sticky_note',
    text: 'Assumption: Developers will trust an autonomous bot to assign severity and ping engineers directly',
    position: { x: 300, y: 570 },
    color: '#FED7AA',
    author: 'Product Mgr (Elena)',
    frameTitle: 'Assumptions, Claims & Competitors',
    tags: ['assumption', 'trust-barrier'],
  },
  {
    id: 'item-11',
    type: 'sticky_note',
    text: 'Competitors: GitHub Copilot issues (too generic), Jira Auto-triage (rigid rule-based, regex regex regex)',
    position: { x: 80, y: 700 },
    color: '#FEF08A',
    author: 'Founder',
    frameTitle: 'Assumptions, Claims & Competitors',
    tags: ['competition'],
  },
  {
    id: 'item-12',
    type: 'sticky_note',
    text: 'Differentiation: Multi-modal code understanding + proactive back-and-forth automated clarification loop',
    position: { x: 300, y: 700 },
    color: '#BBF7D0',
    author: 'DevLead (Sarah)',
    frameTitle: 'Assumptions, Claims & Competitors',
    tags: ['differentiation'],
  },

  // Frame 4: Business Model & Traction Gaps
  {
    id: 'item-f4',
    type: 'frame',
    text: 'Frame: Go-to-Market & Validation Gaps',
    position: { x: 620, y: 510 },
    metadata: { width: 520, height: 380 },
  },
  {
    id: 'item-13',
    type: 'sticky_note',
    text: 'Pricing: $29/seat/month or GitHub Marketplace usage tier based on resolved triage tickets',
    position: { x: 650, y: 570 },
    color: '#E0E7FF',
    author: 'Founder',
    frameTitle: 'Go-to-Market & Validation Gaps',
    tags: ['business-model'],
  },
  {
    id: 'item-14',
    type: 'sticky_note',
    text: 'Evidence Gap: Have not run a formal benchmark measuring hallucination rate on code bug assignment',
    position: { x: 870, y: 570 },
    color: '#FBCFE8',
    author: 'ML Architect (Dave)',
    frameTitle: 'Go-to-Market & Validation Gaps',
    tags: ['evidence-gap', 'critical'],
  },
  {
    id: 'item-15',
    type: 'text',
    text: 'Target Pilot: 5 mid-market engineering teams (50-200 devs) using GitHub Enterprise and Linear',
    position: { x: 650, y: 720 },
    author: 'Founder',
    frameTitle: 'Go-to-Market & Validation Gaps',
    tags: ['target-audience'],
  },
  {
    id: 'item-16',
    type: 'connector',
    text: 'Extracts Stack Trace -> Feeds Qwen Reasoning -> Identifies Root File',
    position: { x: 450, y: 350 },
    metadata: { from: 'item-1', to: 'item-6' },
  }
];

export const DEMO_BOARD_FRAMES: BoardFrame[] = [
  {
    id: 'frame-1',
    title: 'Problem Space & Daily Friction',
    x: 50,
    y: 50,
    width: 520,
    height: 420,
    itemIds: ['item-1', 'item-2', 'item-3', 'item-4'],
  },
  {
    id: 'frame-2',
    title: 'AI Triage Agent Architecture',
    x: 620,
    y: 50,
    width: 520,
    height: 420,
    itemIds: ['item-5', 'item-6', 'item-7', 'item-8'],
  },
  {
    id: 'frame-3',
    title: 'Assumptions, Claims & Competitors',
    x: 50,
    y: 510,
    width: 520,
    height: 380,
    itemIds: ['item-9', 'item-10', 'item-11', 'item-12'],
  },
  {
    id: 'frame-4',
    title: 'Go-to-Market & Validation Gaps',
    x: 620,
    y: 510,
    width: 520,
    height: 380,
    itemIds: ['item-13', 'item-14', 'item-15'],
  },
];

export const DEMO_BOARD_CONTEXT: BoardContext = {
  boardId: 'demo-miro-bug-triage-v1',
  title: 'Bug Triage Agent — Miro Brainstorm & Discovery Canvas',
  description: 'Team whiteboard capturing developer pain points, triage bottlenecks, architecture concepts, and unvalidated pricing assumptions.',
  lastModified: '2026-10-04T10:15:00Z',
  items: DEMO_BOARD_ITEMS,
  frames: DEMO_BOARD_FRAMES,
};
