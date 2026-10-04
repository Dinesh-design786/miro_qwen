export type BoardItemType = 
  | 'sticky_note' 
  | 'text' 
  | 'frame' 
  | 'shape' 
  | 'connector' 
  | 'card' 
  | 'image'
  | 'link';

export type BoardItem = {
  id: string;
  type: BoardItemType;
  text?: string;
  position?: {
    x: number;
    y: number;
  };
  parentId?: string;
  metadata?: Record<string, unknown>;
  color?: string;
  author?: string;
  frameTitle?: string;
  tags?: string[];
};

export type BoardFrame = {
  id: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  itemIds: string[];
};

export type BoardContext = {
  boardId: string;
  title: string;
  description?: string;
  lastModified?: string;
  items: BoardItem[];
  frames?: BoardFrame[];
};

export type EvidenceClassification = 
  | 'user-provided'
  | 'ai-inference'
  | 'verified-evidence'
  | 'evidence-needed'
  | 'assumption'
  | 'unverified-claim';

export type ClaimAudit = {
  claim: string;
  classification: EvidenceClassification;
  context: string;
  recommendation?: string;
};

export type ReadinessCriterion = {
  name: string;
  score: number; // 0 - 100
  explanation: string;
  evidenceNeeded?: boolean;
  status: 'strong' | 'moderate' | 'weak';
};

export type PitchAnalysis = {
  problem: string;
  targetUsers: string[];
  painPoints: string[];
  proposedSolution: string;
  valueProposition: string;
  assumptions: string[];
  evidenceGaps: string[];
  risks: string[];
  opportunities: string[];
  competitors: {
    name: string;
    comparison: string;
  }[];
  differentiators: string[];
  businessModel?: string;
  technicalFeasibility: {
    score: number;
    reasoning: string;
  };
  pitchReadinessScore: number;
  readinessBreakdown: {
    problemClarity: ReadinessCriterion;
    solutionClarity: ReadinessCriterion;
    targetUserClarity: ReadinessCriterion;
    differentiation: ReadinessCriterion;
    evidence: ReadinessCriterion;
    technicalFeasibility: ReadinessCriterion;
    businessPotential: ReadinessCriterion;
    storytelling: ReadinessCriterion;
  };
  strengths: string[];
  weaknesses: string[];
  recommendedChanges: string[];
  claimAudits: ClaimAudit[];
  nextActionPrompt: {
    text: string;
    actionLabel: string;
    targetTab: string;
  };
};

export type PitchImprovementItem = {
  id: string;
  number: string;
  title: string;
  whyItMatters: string;
  whatIsMissing: string;
  suggestedImprovement: string;
  userFix?: string;
  isApplied?: boolean;
  category: string;
};

export type SlideDelivery = {
  tone: string;
  energy: 'High' | 'Medium' | 'Punchy' | 'Calm';
  pauseAfter?: string;
  emphasis?: string;
  transition?: string;
};

export type Slide = {
  slideNumber: number;
  title: string;
  objective: string;
  keyPoints: string[];
  visualSuggestion: string;
  speakerScript: string;
  durationSeconds: number;
  deliveryNotes?: SlideDelivery;
  imageUrl?: string;
  visualPrompt?: string;
};

export type PitchDeck = {
  title: string;
  tagline: string;
  slides: Slide[];
  totalDurationSeconds: number;
  slideCount: number;
};

export type AttackSeverity = 'critical' | 'high' | 'medium' | 'low';

export type PitchAttackItem = {
  id: string;
  severity: AttackSeverity;
  category: string;
  issue: string;
  whyItMatters: string;
  recommendedFix: string;
  userDefense?: string;
  status: 'unresolved' | 'addressed';
};

export type PitchAttackReport = {
  survivalScore: number;
  initialSurvivalScore: number;
  verdict: string;
  attacks: PitchAttackItem[];
  topThreePriorities: string[];
};

export type JudgeCategory = 
  | 'Problem' 
  | 'Product' 
  | 'Technology' 
  | 'AI usage' 
  | 'Competition' 
  | 'Business model' 
  | 'Scalability' 
  | 'Security' 
  | 'Ethics' 
  | 'Go-to-market';

export type JudgeDifficulty = 'Low' | 'Medium' | 'High' | 'Brutal';

export type JudgeQuestion = {
  id: string;
  category: JudgeCategory;
  question: string;
  difficulty: JudgeDifficulty;
  suggestedAnswer: string;
  evidenceStatus: 'grounded' | 'evidence-needed' | 'partial';
  evidenceNeeded?: string;
  skepticalAngle: string;
};

export type ExecutiveSummary = {
  projectName: string;
  tagline: string;
  problem: string;
  solution: string;
  targetMarket: string;
  differentiation: string;
  technology: string;
  businessModel: string;
  impact: string;
  currentStatus: string;
  nextMilestone: string;
};

export type Project = {
  id: string;
  name: string;
  problemStatement: string;
  targetAudience: string;
  solutionDescription?: string;
  miroBoardUrl?: string;
  additionalContext?: string;
  createdAt: string;
  updatedAt: string;
  isDemo?: boolean;
};

export type PitchPackageState = {
  project: Project;
  boardContext: BoardContext;
  analysis?: PitchAnalysis;
  improvements?: PitchImprovementItem[];
  deck?: PitchDeck;
  attackReport?: PitchAttackReport;
  judgeQuestions?: JudgeQuestion[];
  summary?: ExecutiveSummary;
  audioGenerated?: boolean;
  videoReady?: boolean;
};
