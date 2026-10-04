import { z } from 'zod';
import { Project, PitchAnalysis, PitchDeck, Slide, ExecutiveSummary } from '@/types';
import { qwenClient } from './qwenClient';
import { DEMO_PITCH_DECK, DEMO_EXECUTIVE_SUMMARY } from '@/data/demoProject';
import { populateDeckWithImages } from '@/services/media/imageGenerator';

const SlideDeliverySchema = z.object({
  tone: z.string(),
  energy: z.enum(['High', 'Medium', 'Punchy', 'Calm']),
  pauseAfter: z.string().optional(),
  emphasis: z.string().optional(),
  transition: z.string().optional(),
}).optional();

export const SlideSchema = z.object({
  slideNumber: z.number(),
  title: z.string(),
  objective: z.string(),
  keyPoints: z.array(z.string()),
  visualSuggestion: z.string(),
  speakerScript: z.string(),
  durationSeconds: z.number(),
  deliveryNotes: SlideDeliverySchema,
  imageUrl: z.string().optional(),
  visualPrompt: z.string().optional(),
});

export const PitchDeckSchema = z.object({
  title: z.string(),
  tagline: z.string(),
  slides: z.array(SlideSchema),
  totalDurationSeconds: z.number(),
  slideCount: z.number(),
});

export const ExecutiveSummarySchema = z.object({
  projectName: z.string(),
  tagline: z.string(),
  problem: z.string(),
  solution: z.string(),
  targetMarket: z.string(),
  differentiation: z.string(),
  technology: z.string(),
  businessModel: z.string(),
  impact: z.string(),
  currentStatus: z.string(),
  nextMilestone: z.string(),
});

export async function generatePitchDeck(
  project: Project,
  analysis: PitchAnalysis,
  slideCount = 10
): Promise<PitchDeck> {
  if (!qwenClient.isConfigured()) {
    if (project.id === 'proj-bug-triage-demo' || project.isDemo) {
      return populateDeckWithImages(DEMO_PITCH_DECK, project.name);
    }
    return populateDeckWithImages(generateSmartMockDeck(project, analysis, slideCount), project.name);
  }

  const systemPrompt = `You are Qwen, a world-class pitch deck designer and storytelling coach at PitchForge.
Generate a structured pitch deck narrative tailored for hackathons, investor meetings, and product showcases.

DEFAULT 10-SLIDE STORYTELLING STRUCTURE:
1. Hook (Relatable, high-tension problem scenario)
2. Problem (Systemic cost & chronic friction)
3. Why Existing Approaches Fail (Rule-based, static, or generic tools)
4. Target User (Laser-focused initial entry wedge)
5. Solution (Hero reveal & core value proposition)
6. How It Works (Clear 3-4 step pipeline)
7. Technology & Architecture (Deep reasoning, data safety, reliability fallbacks)
8. Business Impact & Traction (Empirical metrics, pilot results, verified benchmarks)
9. Competitive Advantage & Moat (Cross-system orchestration, why incumbents can't copy)
10. Closing & Call to Action (Next milestone, clear invitation)

CRITICAL RULES:
- Never fabricate stats. Use the project's real context or realistic pilot testing hypotheses.
- Each slide MUST have a rich speakerScript with natural spoken cadence.
- Include deliveryNotes (tone, energy: High/Medium/Punchy/Calm, pauseAfter, emphasis, transition).
- Return ONLY valid JSON matching the PitchDeckSchema.`;

  const userPrompt = `Create a ${slideCount}-slide pitch deck for:

PROJECT: ${project.name}
PROBLEM: ${project.problemStatement}
TARGET AUDIENCE: ${project.targetAudience}
SOLUTION: ${project.solutionDescription}

PITCH ANALYSIS INSIGHTS:
Value Prop: ${analysis.valueProposition}
Differentiators: ${analysis.differentiators.join(', ')}
Technical Feasibility: ${analysis.technicalFeasibility.reasoning}
Strengths: ${analysis.strengths.join(', ')}
Weaknesses to Address: ${analysis.weaknesses.join(', ')}

Total desired slides: ${slideCount}. Return JSON.`;

  try {
    const rawResult = await qwenClient.chatCompletionJson<PitchDeck>([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ], { temperature: 0.6 });

    const validated = PitchDeckSchema.parse(rawResult);
    return populateDeckWithImages(validated, project.name);
  } catch (error: any) {
    console.warn('Qwen API deck error or schema validation failure, falling back to smart deck:', error.message);
    return populateDeckWithImages(generateSmartMockDeck(project, analysis, slideCount), project.name);
  }
}

export async function generateExecutiveSummary(
  project: Project,
  analysis: PitchAnalysis
): Promise<ExecutiveSummary> {
  if (!qwenClient.isConfigured()) {
    if (project.id === 'proj-bug-triage-demo' || project.isDemo) {
      return DEMO_EXECUTIVE_SUMMARY;
    }
  }

  const systemPrompt = `You are Qwen at PitchForge. Generate a clean, 1-page executive summary for an investor or hackathon briefing. Return ONLY valid JSON matching ExecutiveSummarySchema.`;
  const userPrompt = `PROJECT: ${project.name}
PROBLEM: ${project.problemStatement}
AUDIENCE: ${project.targetAudience}
SOLUTION: ${project.solutionDescription}
VALUE PROP: ${analysis.valueProposition}
DIFFERENTIATORS: ${analysis.differentiators.join('; ')}
FEASIBILITY: ${analysis.technicalFeasibility.reasoning}
BUSINESS MODEL: ${analysis.businessModel || 'B2B SaaS'}`;

  try {
    if (qwenClient.isConfigured()) {
      const raw = await qwenClient.chatCompletionJson<ExecutiveSummary>([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ], { temperature: 0.3 });
      return ExecutiveSummarySchema.parse(raw);
    }
  } catch (error) {
    console.warn('Qwen executive summary generation fallback:', error);
  }

  return {
    projectName: project.name,
    tagline: `Next-generation AI orchestration for ${project.targetAudience}`,
    problem: project.problemStatement,
    solution: project.solutionDescription || analysis.proposedSolution,
    targetMarket: project.targetAudience,
    differentiation: analysis.differentiators[0] || 'Multi-platform intelligent orchestration with verified reasoning gates.',
    technology: analysis.technicalFeasibility.reasoning,
    businessModel: analysis.businessModel || 'Freemium SaaS with usage-based enterprise tier.',
    impact: 'Accelerates workflow turnaround by over 60% while reducing manual cognitive overload.',
    currentStatus: 'Functional prototype tested with early design partners.',
    nextMilestone: 'Deploying beta pilot with 10 commercial design partners within 60 days.',
  };
}

function generateSmartMockDeck(project: Project, analysis: PitchAnalysis, slideCount: number): PitchDeck {
  const slides: Slide[] = [
    {
      slideNumber: 1,
      title: 'The Unseen Cost of Friction',
      objective: 'Hook the audience with a concrete, painful reality.',
      keyPoints: [
        `Every day, ${project.targetAudience} struggle with broken workflows`,
        'Critical time is lost on repetitive, manual diagnosis',
        'Traditional tools lack the intelligence to bridge the gap'
      ],
      visualSuggestion: 'High-contrast split visual comparing chaotic manual work vs streamlined AI clarity.',
      speakerScript: `Every day, teams face a silent drain on their momentum. ${project.problemStatement.slice(0, 140)}... When valuable hours are burned on low-level friction, innovation grinds to a halt.`,
      durationSeconds: 30,
      deliveryNotes: {
        tone: 'Empathetic, urgent, high clarity',
        energy: 'High',
        pauseAfter: 'innovation grinds to a halt.',
        emphasis: 'silent drain on their momentum',
        transition: 'Let us examine why this problem persists.'
      }
    },
    {
      slideNumber: 2,
      title: 'The Broken Status Quo',
      objective: 'Explain why existing methods and legacy software fail.',
      keyPoints: [
        'Static rule automation breaks whenever edge cases emerge',
        'Generic AI assistants lack verified domain context',
        'Users spend more time managing tools than solving real problems'
      ],
      visualSuggestion: 'Comparison grid showing static rule systems vs ad-hoc spreadsheets vs modern intelligence.',
      speakerScript: 'Current market solutions fail because they treat this as a static data problem. Static rules break constantly, and generic chatbots hallucinate answers because they lack ground truth context. None of them fix the underlying gap.',
      durationSeconds: 30,
      deliveryNotes: {
        tone: 'Critical, analytical',
        energy: 'Medium',
        pauseAfter: 'None of them fix the underlying gap.',
        emphasis: 'treat this as a static data problem',
        transition: 'We built a solution from the ground up.'
      }
    },
    {
      slideNumber: 3,
      title: `Introducing ${project.name}`,
      objective: 'Unveil the solution with confidence and clarity.',
      keyPoints: [
        project.solutionDescription || 'Autonomous intelligent orchestration',
        'Combines deep reasoning with verifiable safety gates',
        `Designed specifically for ${project.targetAudience}`
      ],
      visualSuggestion: 'Polished product UI mockup showing the end-to-end automated workflow.',
      speakerScript: `Meet ${project.name}: the intelligent studio designed to eliminate this friction entirely. By connecting directly to your team's visual workspaces and executing deep multi-step reasoning, we transform raw ambiguity into verified execution.`,
      durationSeconds: 35,
      deliveryNotes: {
        tone: 'Inspiring, authoritative',
        energy: 'High',
        pauseAfter: 'transform raw ambiguity into verified execution.',
        emphasis: project.name,
        transition: 'Here is how the system works.'
      }
    },
    {
      slideNumber: 4,
      title: 'How It Works: The 4-Step Pipeline',
      objective: 'Demystify the architecture and build technical credibility.',
      keyPoints: [
        '1. Ingestion: Extract unstructured data directly from collaborative workspaces',
        '2. Reasoning: Qwen analyzes context and audits assumptions',
        '3. Verification: Built-in safety gates cross-examine claims',
        '4. Execution: Generates actionable, presentation-ready deliverables'
      ],
      visualSuggestion: 'Clean horizontal pipeline flowchart highlighting data ingestion, reasoning engine, and verified outputs.',
      speakerScript: 'Our pipeline operates in four coordinated steps: First, we ingest raw canvas data from Miro. Second, Qwen parses intent and extracts latent patterns. Third, our verification gate audits every claim against empirical ground truth. Finally, we output production-ready assets in seconds.',
      durationSeconds: 35,
      deliveryNotes: {
        tone: 'Structured, confident, clear',
        energy: 'Medium',
        pauseAfter: 'output production-ready assets in seconds.',
        emphasis: 'four coordinated steps',
        transition: 'The technical architecture ensures privacy and reliability.'
      }
    },
    {
      slideNumber: 5,
      title: 'Technical Defensibility & Safety',
      objective: 'Address judge skepticism regarding hallucinations and data privacy.',
      keyPoints: [
        'Deterministic AST code parsing paired with LLM reasoning',
        'Confidence gate: Low-confidence actions trigger human verification',
        'Zero-retention ephemeral processing protects proprietary customer data'
      ],
      visualSuggestion: 'Architecture diagram showing the security boundary and verification threshold.',
      speakerScript: 'We prioritize trust above all else. By pairing neural reasoning with deterministic validation gates, decisions with confidence below 85% escalate for human review rather than executing blindly. Furthermore, customer data is processed ephemerally with zero model retraining.',
      durationSeconds: 30,
      deliveryNotes: {
        tone: 'Reassuring, technical, grounded',
        energy: 'Medium',
        pauseAfter: 'processed ephemerally with zero model retraining.',
        emphasis: 'trust above all else',
        transition: 'What makes our market opportunity defensible?'
      }
    },
    {
      slideNumber: 6,
      title: 'Market Opportunity & Focused Wedge',
      objective: 'Define the target market and initial customer entry point.',
      keyPoints: [
        `Primary target: ${project.targetAudience}`,
        'High-urgency buyer profile with daily workflow friction',
        'Expanding from early adopters to broader enterprise teams'
      ],
      visualSuggestion: 'Market sizing concentric circles showing serviceable obtainable market and wedge segment.',
      speakerScript: `Our initial wedge is laser-focused on ${project.targetAudience}. These teams have the highest workflow velocity and feel this pain point daily. By winning this passionate cohort, we establish a defensible foundation before expanding horizontally.`,
      durationSeconds: 25,
      deliveryNotes: {
        tone: 'Commercially disciplined, focused',
        energy: 'Medium',
        pauseAfter: 'defensible foundation before expanding horizontally.',
        emphasis: 'laser-focused',
        transition: 'Our competitive advantage is built to endure.'
      }
    },
    {
      slideNumber: 7,
      title: 'Competitive Advantage & Moat',
      objective: 'Demonstrate why platform competitors cannot easily replicate.',
      keyPoints: [
        'Cross-platform workflow orchestration across fragmented tools',
        'Active interrogation loop rather than passive text summarization',
        'Proprietary domain knowledge graph that improves with each interaction'
      ],
      visualSuggestion: 'Competitive positioning matrix showing PitchForge in the upper-right quadrant for both Intelligence and Integration.',
      speakerScript: 'Platform incumbents remain trapped in single-vendor ecosystems. We operate at the cross-platform intersection—connecting visual canvases, code repositories, and task trackers into a unified reasoning graph that single-platform utilities cannot replicate.',
      durationSeconds: 30,
      deliveryNotes: {
        tone: 'Sharp, punchy, competitive',
        energy: 'Punchy',
        pauseAfter: 'single-platform utilities cannot replicate.',
        emphasis: 'cross-platform intersection',
        transition: 'Here is what we have accomplished and what comes next.'
      }
    },
    {
      slideNumber: 8,
      title: 'Business Model & Unit Economics',
      objective: 'Demonstrate a clear, realistic path to revenue.',
      keyPoints: [
        analysis.businessModel || 'B2B SaaS with usage-based tier',
        'Transparent pricing aligned with customer value and ROI',
        'Low friction 1-click self-serve trial driving organic adoption'
      ],
      visualSuggestion: 'Pricing tier overview showing Self-serve, Team, and Enterprise custom options.',
      speakerScript: 'Our business model aligns directly with customer ROI. We offer a frictionless self-serve tier to drive organic bottom-up adoption, backed by scalable team tiers that grow alongside organizational usage and ticket volume.',
      durationSeconds: 25,
      deliveryNotes: {
        tone: 'Business-savvy, confident',
        energy: 'Medium',
        pauseAfter: 'grow alongside organizational usage and ticket volume.',
        emphasis: 'aligns directly with customer ROI',
        transition: 'Our milestones are clear.'
      }
    },
    {
      slideNumber: 9,
      title: 'Roadmap & Next Milestones',
      objective: 'Outline the execution plan for the next 90 days.',
      keyPoints: [
        'Phase 1: Private staging pilots with 5 partner teams',
        'Phase 2: Public beta release and marketplace distribution',
        'Phase 3: Expanded multi-agent autonomous action capabilities'
      ],
      visualSuggestion: 'Quarterly roadmap timeline with key release flags and user acquisition targets.',
      speakerScript: 'Over the next 90 days, we are completing private staging pilots with our first design partners, followed by a public marketplace rollout. Each milestone is focused on measurable time savings and user retention.',
      durationSeconds: 25,
      deliveryNotes: {
        tone: 'Execution-focused, disciplined',
        energy: 'Medium',
        pauseAfter: 'measurable time savings and user retention.',
        emphasis: 'focused on measurable time savings',
        transition: 'Join us on this journey.'
      }
    },
    {
      slideNumber: 10,
      title: 'Join Us in Shaping the Future',
      objective: 'Climactic call to action and closing impression.',
      keyPoints: [
        `Turn raw ideas into verified pitches with ${project.name}`,
        'Ready to deploy in your workspace in under 2 minutes',
        'Visit our demo today or reach out for early pilot access'
      ],
      visualSuggestion: 'Bold closing slide with project URL, QR code for live demo, and contact links.',
      speakerScript: `Teams should spend their time inventing the future, not fighting workflow chaos. ${project.name} turns your team's raw thinking into pitches and products that survive the toughest questions. Thank you, and we welcome your questions!`,
      durationSeconds: 30,
      deliveryNotes: {
        tone: 'Inspiring, climactic, memorable',
        energy: 'High',
        pauseAfter: 'Thank you, and we welcome your questions!',
        emphasis: 'inventing the future',
        transition: 'Ready for Q&A.'
      }
    }
  ];

  const sliced = slides.slice(0, slideCount);
  return {
    title: `${project.name} — Pitch Presentation`,
    tagline: `Turn raw thinking into a pitch that survives scrutiny`,
    slides: sliced,
    slideCount: sliced.length,
    totalDurationSeconds: sliced.reduce((acc, s) => acc + s.durationSeconds, 0),
  };
}
