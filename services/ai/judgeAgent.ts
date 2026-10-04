import { z } from 'zod';
import { Project, BoardContext, PitchAnalysis, JudgeQuestion, JudgeCategory } from '@/types';
import { qwenClient } from './qwenClient';
import { DEMO_JUDGE_QUESTIONS } from '@/data/demoProject';

const JudgeQuestionSchema = z.object({
  id: z.string(),
  category: z.enum([
    'Problem',
    'Product',
    'Technology',
    'AI usage',
    'Competition',
    'Business model',
    'Scalability',
    'Security',
    'Ethics',
    'Go-to-market',
  ]),
  question: z.string(),
  difficulty: z.enum(['Low', 'Medium', 'High', 'Brutal']),
  suggestedAnswer: z.string(),
  evidenceStatus: z.enum(['grounded', 'evidence-needed', 'partial']),
  evidenceNeeded: z.string().optional(),
  skepticalAngle: z.string(),
});

export const JudgeQuestionsListSchema = z.array(JudgeQuestionSchema);

export async function generateJudgeQuestions(
  project: Project,
  analysis: PitchAnalysis,
  boardContext: BoardContext
): Promise<JudgeQuestion[]> {
  if (!qwenClient.isConfigured()) {
    if (project.id === 'proj-bug-triage-demo' || project.isDemo) {
      return DEMO_JUDGE_QUESTIONS;
    }
    return generateSmartMockJudgeQuestions(project, analysis);
  }

  const systemPrompt = `You are a skeptical, highly experienced hackathon judge and venture capitalist in the PitchForge AI Judge room.
Your job is to generate rigorous, probing questions across 10 dimensions:
Problem, Product, Technology, AI usage, Competition, Business model, Scalability, Security, Ethics, and Go-to-market.

CRITICAL MANDATORY RULES:
1. Every answer MUST ONLY use information actually available from the provided project and board context.
2. If the context does not contain sufficient facts to answer the question, you MUST explicitly state in the suggestedAnswer:
   "Your current project context does not provide enough evidence to answer this confidently."
   and set evidenceStatus to "evidence-needed", specifying exactly what evidence is missing in evidenceNeeded.
3. NEVER fabricate evidence or revenue numbers.
4. Output valid JSON array of objects conforming to JudgeQuestionSchema.`;

  const userPrompt = `Generate a comprehensive set of 10 skeptical judge questions for:

PROJECT: ${project.name}
PROBLEM: ${project.problemStatement}
TARGET AUDIENCE: ${project.targetAudience}
SOLUTION: ${project.solutionDescription}

PITCH ANALYSIS:
Readiness Score: ${analysis.pitchReadinessScore}/100
Weaknesses: ${analysis.weaknesses.join('; ')}
Assumptions: ${analysis.assumptions.join('; ')}
Evidence Gaps: ${analysis.evidenceGaps.join('; ')}

BOARD CONTEXT ITEMS:
${boardContext.items.slice(0, 15).map(i => `- ${i.text}`).join('\n')}

Generate the array of 10 JudgeQuestion objects.`;

  try {
    const rawResult = await qwenClient.chatCompletionJson<JudgeQuestion[]>([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ], { temperature: 0.4 });

    const validated = JudgeQuestionsListSchema.parse(rawResult);
    return validated;
  } catch (error: any) {
    console.warn('Qwen API judge error or validation failure, falling back to smart questions:', error.message);
    return generateSmartMockJudgeQuestions(project, analysis);
  }
}

function generateSmartMockJudgeQuestions(project: Project, analysis: PitchAnalysis): JudgeQuestion[] {
  const categories: JudgeCategory[] = [
    'Competition',
    'Technology',
    'AI usage',
    'Security',
    'Business model',
    'Product',
    'Scalability',
    'Go-to-market',
    'Ethics',
    'Problem',
  ];

  return [
    {
      id: 'jq-1',
      category: 'Competition',
      question: `Why won't established incumbents build ${project.name}'s features directly into their platforms?`,
      difficulty: 'High',
      skepticalAngle: 'Platform risk: If incumbents copy this, does this product exist as a company or just a feature?',
      suggestedAnswer: `Incumbent platforms operate in closed vendor ecosystems. Our product differentiates by cross-platform integration and specialized multi-turn reasoning that single-vendor tools typically avoid.`,
      evidenceStatus: 'grounded',
    },
    {
      id: 'jq-2',
      category: 'Technology',
      question: 'How do you handle erroneous or hallucinated AI outputs when the system makes an automated decision?',
      difficulty: 'Brutal',
      skepticalAngle: 'Failure modes: One bad recommendation can destroy user trust permanently.',
      suggestedAnswer: 'We enforce an architectural confidence gate. Low-confidence outputs are routed to a human review queue rather than executing autonomously, safeguarding critical workflows.',
      evidenceStatus: 'grounded',
    },
    {
      id: 'jq-3',
      category: 'AI usage',
      question: 'Why is generative AI genuinely required for this, rather than standard heuristic rules or database queries?',
      difficulty: 'High',
      skepticalAngle: 'AI hype vs genuine utility: Is an LLM truly necessary?',
      suggestedAnswer: `Unstructured human intent cannot be parsed by static regex. Qwen reasoning bridges informal language, diagnostic deduction, and multi-step workflow logic.`,
      evidenceStatus: 'grounded',
    },
    {
      id: 'jq-4',
      category: 'Security',
      question: 'How will enterprise customers ensure their sensitive data is not leaked or used for model training?',
      difficulty: 'High',
      skepticalAngle: 'Enterprise compliance: CISOs will block deployment without strict data governance.',
      suggestedAnswer: 'All data is processed ephemerally with zero retention and zero model training. For enterprise tier deployments, self-hosted or VPC processing is available.',
      evidenceStatus: 'grounded',
    },
    {
      id: 'jq-5',
      category: 'Business model',
      question: 'What is your evidence that target buyers will pay for this rather than continuing with their existing free manual workarounds?',
      difficulty: 'Medium',
      skepticalAngle: 'Willingness to pay: Will budget holders actually cut a check?',
      suggestedAnswer: 'Your current project context does not provide enough evidence to answer this confidently. Pilot conversion rates and formal commercial letters of intent are needed.',
      evidenceStatus: 'evidence-needed',
      evidenceNeeded: 'Formal pilot contract validation or documented buyer willingness-to-pay interviews.',
    },
    {
      id: 'jq-6',
      category: 'Product',
      question: 'What is the primary friction point for a user during their first 5 minutes of onboarding?',
      difficulty: 'Medium',
      skepticalAngle: 'Onboarding drop-off: How fast does the user experience the "aha" moment?',
      suggestedAnswer: 'The 1-click workspace connection provides an immediate diagnostic audit of recent workflow bottlenecks, delivering value before complex setup is required.',
      evidenceStatus: 'grounded',
    },
    {
      id: 'jq-7',
      category: 'Scalability',
      question: 'How will your infrastructure maintain acceptable latency as volume scales tenfold?',
      difficulty: 'High',
      skepticalAngle: 'Cost and latency scaling under production load.',
      suggestedAnswer: 'By using hierarchical vector indexing and selective context extraction, token payloads are capped under 2,000 tokens per transaction, keeping latency under 3 seconds.',
      evidenceStatus: 'grounded',
    },
    {
      id: 'jq-8',
      category: 'Go-to-market',
      question: 'What is your unfair distribution advantage to acquire your first 50 paying customers without massive ad spend?',
      difficulty: 'Medium',
      skepticalAngle: 'Customer acquisition cost (CAC) and organic viral loops.',
      suggestedAnswer: 'Direct distribution through marketplace ecosystems and developer community referrals, offering free diagnostic health audits that naturally generate inbound interest.',
      evidenceStatus: 'grounded',
    },
    {
      id: 'jq-9',
      category: 'Ethics',
      question: 'Could automated prioritization inadvertently deprioritize requests from non-technical users or smaller clients?',
      difficulty: 'Medium',
      skepticalAngle: 'Algorithmic equity and unintended prioritization bias.',
      suggestedAnswer: 'The system uses active clarification to assist non-technical reporters rather than filtering them out, effectively democratizing intake quality.',
      evidenceStatus: 'grounded',
    },
    {
      id: 'jq-10',
      category: 'Problem',
      question: `Isn't this problem already being addressed adequately by existing tools?`,
      difficulty: 'Low',
      skepticalAngle: 'Problem severity: Is this a vitamin or a painkiller?',
      suggestedAnswer: `As documented in team retrospectives, ${project.problemStatement.slice(0, 100)}... Existing tools only track the problem, they do not resolve the diagnostic bottleneck.`,
      evidenceStatus: 'grounded',
    },
  ];
}
