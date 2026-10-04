import { z } from 'zod';
import { Project, BoardContext, PitchAnalysis, PitchAttackReport, PitchAttackItem } from '@/types';
import { qwenClient } from './qwenClient';
import { DEMO_ATTACK_REPORT } from '@/data/demoProject';

const PitchAttackItemSchema = z.object({
  id: z.string(),
  severity: z.enum(['critical', 'high', 'medium', 'low']),
  category: z.string(),
  issue: z.string(),
  whyItMatters: z.string(),
  recommendedFix: z.string(),
  status: z.enum(['unresolved', 'addressed']).default('unresolved'),
  userDefense: z.string().optional(),
});

export const PitchAttackReportSchema = z.object({
  survivalScore: z.number().min(0).max(100),
  initialSurvivalScore: z.number().min(0).max(100),
  verdict: z.string(),
  topThreePriorities: z.array(z.string()),
  attacks: z.array(PitchAttackItemSchema),
});

export async function attackPitch(
  project: Project,
  analysis: PitchAnalysis,
  boardContext: BoardContext
): Promise<PitchAttackReport> {
  if (!qwenClient.isConfigured()) {
    if (project.id === 'proj-bug-triage-demo' || project.isDemo) {
      return DEMO_ATTACK_REPORT;
    }
    return generateSmartMockAttacks(project, analysis);
  }

  const systemPrompt = `You are a brutally honest, skeptical Silicon Valley venture capitalist and seasoned hackathon lead judge.
Your role in PitchForge "ATTACK MY PITCH" is to aggressively expose every fatal flaw, unsupported claim, weak assumption, technical vulnerability, and competitive blindspot in the project.

MANDATORY ATTACK PRIORITIES:
1. Tear apart any claim that sounds like an unbacked statistic (e.g. "users save 50%", "10x faster").
2. Question competitive defensibility: "Why won't the platform incumbent (Google/Microsoft/GitHub/OpenAI) crush this in 3 months?"
3. Challenge technical feasibility, hallucination rates, privacy risks, and developer trust.
4. Call out fuzzy target audiences and unvalidated pricing models.
5. Provide actionable, concrete fixes for each attack.
6. Calculate a PITCH SURVIVAL SCORE between 50 and 75 (pitches almost never score above 75 initially under real scrutiny).
7. List the top 3 critical issues that MUST be fixed before presenting.
Return ONLY valid JSON matching the schema.`;

  const userPrompt = `Rigorously attack this pitch:

PROJECT NAME: ${project.name}
PROBLEM: ${project.problemStatement}
TARGET AUDIENCE: ${project.targetAudience}
SOLUTION: ${project.solutionDescription}

ANALYSIS FINDINGS:
Current Readiness: ${analysis.pitchReadinessScore}/100
Weaknesses: ${analysis.weaknesses.join('; ')}
Assumptions: ${analysis.assumptions.join('; ')}
Evidence Gaps: ${analysis.evidenceGaps.join('; ')}
Risks: ${analysis.risks.join('; ')}

MIRO BOARD SIGNALS:
${boardContext.items.slice(0, 15).map(i => `- ${i.text}`).join('\n')}

Produce the complete PitchAttackReport JSON object.`;

  try {
    const rawResult = await qwenClient.chatCompletionJson<PitchAttackReport>([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ], { temperature: 0.4 });

    const validated = PitchAttackReportSchema.parse(rawResult);
    // Sort attacks: critical first, then high, medium, low
    const order: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
    validated.attacks.sort((a, b) => (order[a.severity] ?? 99) - (order[b.severity] ?? 99));
    return validated;
  } catch (error: any) {
    console.warn('Qwen API attack error or schema validation failure, falling back to smart attacks:', error.message);
    return generateSmartMockAttacks(project, analysis);
  }
}

function generateSmartMockAttacks(project: Project, analysis: PitchAnalysis): PitchAttackReport {
  const attacks: PitchAttackItem[] = [
    {
      id: 'atk-1',
      severity: 'critical',
      category: 'Unsupported Claims & Evidence',
      issue: 'The core efficiency improvement claims lack empirical pilot benchmarks.',
      whyItMatters: 'Judges immediately discount unverified productivity gains as hand-waving marketing, damaging credibility for the entire product.',
      recommendedFix: 'Reframe with a specific historical evaluation baseline: e.g. "Tested across 50 sample workflows with verified 80%+ accuracy."',
      status: 'unresolved',
    },
    {
      id: 'atk-2',
      severity: 'critical',
      category: 'Competitive Moat',
      issue: 'Vulnerability to platform incumbents bundling similar AI features natively.',
      whyItMatters: 'If the tool only acts as a thin LLM wrapper around existing tools, users will abandon it the moment incumbents release native features.',
      recommendedFix: 'Articulate an active multi-system orchestration moat and proprietary contextual memory that single-vendor platforms cannot replicate.',
      status: 'unresolved',
    },
    {
      id: 'atk-3',
      severity: 'high',
      category: 'Technical Reliability & Trust',
      issue: 'Absence of an explicit confidence fallback gate for automated AI decisions.',
      whyItMatters: 'When the AI makes an erroneous routing or classification decision, users will lose confidence and disable the integration.',
      recommendedFix: 'Implement an explicit safety threshold: decisions with <85% confidence trigger a lightweight human verification loop.',
      status: 'unresolved',
    },
    {
      id: 'atk-4',
      severity: 'high',
      category: 'Customer Acquisition Wedge',
      issue: 'Target customer persona is too diffuse across multiple company sizes.',
      whyItMatters: 'Attempting to satisfy enterprise compliance and solo developer workflows simultaneously stalls early go-to-market traction.',
      recommendedFix: 'Focus on a single, high-urgency buyer profile (e.g. 50-150 person teams with high workflow volume).',
      status: 'unresolved',
    },
    {
      id: 'atk-5',
      severity: 'medium',
      category: 'Business Model Friction',
      issue: 'Proposed monetization model may trigger procurement resistance.',
      whyItMatters: 'In a cost-conscious software environment, per-seat licensing is scrutinized by budget holders.',
      recommendedFix: 'Offer a usage or repository-based tier tied directly to verified hours or tickets resolved.',
      status: 'unresolved',
    },
  ];

  return {
    survivalScore: 68,
    initialSurvivalScore: 68,
    verdict: 'High Vulnerability — Critical unbacked claims and incumbent risks will be challenged by judges in the first 2 minutes.',
    topThreePriorities: [
      'Provide empirical pilot data to substantiate efficiency claims.',
      'Defend against platform incumbent competition with cross-tool orchestration.',
      'Define a confidence fallback threshold to address trust and hallucination concerns.',
    ],
    attacks,
  };
}
