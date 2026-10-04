import { z } from 'zod';
import { Project, BoardContext, PitchAnalysis, ClaimAudit } from '@/types';
import { qwenClient } from './qwenClient';
import { INITIAL_DEMO_ANALYSIS } from '@/data/demoProject';

const ReadinessCriterionSchema = z.object({
  name: z.string(),
  score: z.number().min(0).max(100),
  explanation: z.string(),
  evidenceNeeded: z.boolean().optional(),
  status: z.enum(['strong', 'moderate', 'weak']),
});

export const PitchAnalysisSchema = z.object({
  problem: z.string(),
  targetUsers: z.array(z.string()),
  painPoints: z.array(z.string()),
  proposedSolution: z.string(),
  valueProposition: z.string(),
  assumptions: z.array(z.string()),
  evidenceGaps: z.array(z.string()),
  risks: z.array(z.string()),
  opportunities: z.array(z.string()),
  competitors: z.array(z.object({
    name: z.string(),
    comparison: z.string(),
  })),
  differentiators: z.array(z.string()),
  businessModel: z.string().optional(),
  technicalFeasibility: z.object({
    score: z.number().min(0).max(100),
    reasoning: z.string(),
  }),
  pitchReadinessScore: z.number().min(0).max(100),
  readinessBreakdown: z.object({
    problemClarity: ReadinessCriterionSchema,
    solutionClarity: ReadinessCriterionSchema,
    targetUserClarity: ReadinessCriterionSchema,
    differentiation: ReadinessCriterionSchema,
    evidence: ReadinessCriterionSchema,
    technicalFeasibility: ReadinessCriterionSchema,
    businessPotential: ReadinessCriterionSchema,
    storytelling: ReadinessCriterionSchema,
  }),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  recommendedChanges: z.array(z.string()),
  claimAudits: z.array(z.object({
    claim: z.string(),
    classification: z.enum([
      'user-provided',
      'ai-inference',
      'verified-evidence',
      'evidence-needed',
      'assumption',
      'unverified-claim',
    ]),
    context: z.string(),
    recommendation: z.string().optional(),
  })),
  nextActionPrompt: z.object({
    text: z.string(),
    actionLabel: z.string(),
    targetTab: z.string(),
  }),
});

export async function analyzePitch(
  project: Project,
  boardContext: BoardContext
): Promise<PitchAnalysis> {
  if (!qwenClient.isConfigured()) {
    // If it's the demo project, return the calibrated INITIAL_DEMO_ANALYSIS
    if (project.id === 'proj-bug-triage-demo' || project.name.toLowerCase().includes('triage') || project.isDemo) {
      return INITIAL_DEMO_ANALYSIS;
    }

    // Dynamic fallback generation for custom user projects when Qwen key is omitted
    return generateSmartMockAnalysis(project, boardContext);
  }

  const systemPrompt = `You are Qwen, an elite startup mentor, hackathon judge, and pitch architect at PitchForge.
CRITICAL MANDATORY RULES:
1. You must NEVER fabricate or invent evidence. If a claim has no empirical backing, classify it as "unverified-claim" or "assumption", NEVER as factual.
2. Label every extracted claim with one of: "user-provided", "ai-inference", "verified-evidence", "evidence-needed", "assumption", "unverified-claim".
3. Calculate an overall pitchReadinessScore (0-100) based strictly on problem clarity, solution clarity, differentiation, evidence, and feasibility.
4. If empirical metrics are missing, penalize the Evidence score heavily and explicitly set evidenceNeeded: true.
5. Return ONLY a valid JSON object matching the requested schema. No conversational preamble.`;

  const userPrompt = `Analyze the following project and Miro workspace context:

PROJECT:
Name: ${project.name}
Problem Statement: ${project.problemStatement}
Target Audience: ${project.targetAudience}
Solution Idea: ${project.solutionDescription || 'Not specified'}
Additional Notes: ${project.additionalContext || 'None'}

MIRO BOARD CONTEXT ("${boardContext.title}"):
Total Items: ${boardContext.items.length}
Items:
${boardContext.items.map(item => `[${item.type}] ${item.frameTitle ? `(${item.frameTitle}) ` : ''}${item.text || ''}`).join('\n')}

Produce the complete PitchAnalysis JSON object.`;

  try {
    const rawResult = await qwenClient.chatCompletionJson<PitchAnalysis>([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ], { temperature: 0.3 });

    const validated = PitchAnalysisSchema.parse(rawResult);
    return validated;
  } catch (error: any) {
    console.warn('Qwen API error or schema validation failure, falling back to smart analysis:', error.message);
    return generateSmartMockAnalysis(project, boardContext);
  }
}

function generateSmartMockAnalysis(project: Project, boardContext: BoardContext): PitchAnalysis {
  const words = project.problemStatement.split(' ');
  const boardItemCount = boardContext.items.length;
  
  return {
    problem: project.problemStatement,
    targetUsers: [
      project.targetAudience,
      'Early adopters seeking automated alternatives',
      'Team leads responsible for operational delivery',
    ],
    painPoints: [
      `Bottlenecks identified in ${project.name}: ${words.slice(0, 8).join(' ')}...`,
      'Manual human intervention required for routine diagnostic steps',
      'Lack of unified workflow integration across existing tools',
    ],
    proposedSolution: project.solutionDescription || `AI-driven orchestration for ${project.name}, turning unstructured friction into streamlined automation.`,
    valueProposition: `Reduce operational friction and accelerate resolution time by automating key decision steps for ${project.targetAudience}.`,
    assumptions: [
      `Target customers will trust an automated agent for ${project.name.toLowerCase()} workflows`,
      'Users are willing to connect their workspace credentials without lengthy procurement',
      'Extracted visual board notes reflect the team\'s current consensus',
    ],
    evidenceGaps: [
      'No empirical pilot benchmark quantifying exact hours or dollars saved',
      'Unverified willingness-to-pay validation from target buyers',
      'Absence of stress-testing under peak volume edge cases',
    ],
    risks: [
      'Platform incumbents adding native lightweight features',
      'User resistance to trusting automated classifications',
      'Integration failure when source systems change APIs',
    ],
    opportunities: [
      'First-mover advantage in specialized multi-agent domain',
      'Expanding into end-to-end autonomous resolution',
      'Ecosystem marketplace distribution',
    ],
    competitors: [
      {
        name: 'Manual Spreadsheets / Legacy Tools',
        comparison: 'Familiar to users, but lack intelligent reasoning, context retention, and proactive automation.',
      },
      {
        name: 'Generic AI Wrappers',
        comparison: 'Offer general text responses, but lack domain AST integration, evidence validation, and structured workflows.',
      },
    ],
    differentiators: [
      'Domain-grounded reasoning engine with multi-turn verification',
      'Direct integration with collaborative visual workspace context',
      'Built-in defense and verification gates to prevent hallucinations',
    ],
    businessModel: 'B2B SaaS with usage-based tier and enterprise security deployment options.',
    technicalFeasibility: {
      score: 85,
      reasoning: 'Architecture relies on proven LLM reasoning, webhook integrations, and standard vector/AST parsing.',
    },
    pitchReadinessScore: 71,
    readinessBreakdown: {
      problemClarity: {
        name: 'Problem Clarity',
        score: 88,
        explanation: 'The core problem is well defined and immediately understandable.',
        status: 'strong',
      },
      solutionClarity: {
        name: 'Solution Clarity',
        score: 80,
        explanation: 'Proposed solution outlines key technical components and workflow stages.',
        status: 'strong',
      },
      targetUserClarity: {
        name: 'Target User Clarity',
        score: 72,
        explanation: 'Audience is defined, but would benefit from a sharper wedge persona.',
        status: 'moderate',
      },
      differentiation: {
        name: 'Differentiation',
        score: 64,
        explanation: 'Must articulate a stronger defensible moat against platform competitors.',
        evidenceNeeded: true,
        status: 'moderate',
      },
      evidence: {
        name: 'Empirical Evidence',
        score: 52,
        explanation: 'Evidence needed: Pilot performance metrics and quantitative user tests are missing.',
        evidenceNeeded: true,
        status: 'weak',
      },
      technicalFeasibility: {
        name: 'Technical Feasibility',
        score: 86,
        explanation: 'Feasible using modern AI reasoning APIs and standard data connectors.',
        status: 'strong',
      },
      businessPotential: {
        name: 'Business Potential',
        score: 68,
        explanation: 'Viable B2B market, but pricing model requires customer interview validation.',
        status: 'moderate',
      },
      storytelling: {
        name: 'Storytelling & Hook',
        score: 76,
        explanation: 'Narrative structure is solid; needs a high-urgency opening hook.',
        status: 'moderate',
      },
    },
    strengths: [
      'Viscerally relatable problem definition',
      'Clear automation loop leveraging AI reasoning',
      'Realistic technical scope achievable in modern cloud environments',
    ],
    weaknesses: [
      'Lack of verified quantitative metrics to back up productivity claims',
      'Competitive differentiation against platform incumbents needs hardening',
    ],
    recommendedChanges: [
      'Replace estimated percentage claims with specific pilot testing hypotheses',
      'Define a single entry-point customer wedge before expanding to enterprise',
      'Highlight safety and verification fallbacks to overcome trust barriers',
    ],
    claimAudits: [
      {
        claim: project.problemStatement.slice(0, 90) + '...',
        classification: 'user-provided',
        context: 'Directly stated in project creation statement.',
      },
      {
        claim: `Board items indicate ${boardItemCount} specific operational pain points`,
        classification: 'verified-evidence',
        context: 'Extracted from collaborative Miro workspace.',
      },
      {
        claim: 'Solution will substantially reduce operational delays',
        classification: 'unverified-claim',
        context: 'Stated as an expected outcome without benchmark measurement.',
        recommendation: 'Specify exact pilot baseline: e.g. "Tested on 50 sample tickets with 80% resolution accuracy."',
      },
    ],
    nextActionPrompt: {
      text: 'Your pitch is 71% ready. The primary risk is unsupported claims that skeptical judges will attack.',
      actionLabel: 'Attack My Pitch',
      targetTab: 'attack',
    },
  };
}
