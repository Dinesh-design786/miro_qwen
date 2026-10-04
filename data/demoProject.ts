import { 
  Project, 
  PitchAnalysis, 
  PitchDeck, 
  PitchAttackReport, 
  JudgeQuestion, 
  ExecutiveSummary,
  PitchImprovementItem 
} from '@/types';
import { DEMO_BOARD_CONTEXT } from './demoBoard';

export const DEMO_PROJECT: Project = {
  id: 'proj-bug-triage-demo',
  name: 'AI Bug Triage Agent',
  problemStatement: 'Bug reports from users and QA are chronically incomplete, developers waste 15-20% of their sprint time triaging, and duplicate issues flood backlogs. Critical bugs get delayed because manual triage cannot keep pace with continuous deployments.',
  targetAudience: 'Engineering managers and software teams (50–200 developers) managing high-volume GitHub and Linear repositories.',
  solutionDescription: 'An autonomous AI agent powered by Qwen reasoning that parses stack traces, identifies code owners, proactively asks bug reporters for missing logs, and clusters duplicate tickets before humans touch the queue.',
  miroBoardUrl: 'https://miro.com/app/board/uXjVO123abcDemoBoard/',
  additionalContext: 'Early user interview notes from 5 tech leads. Tested prototype regex script against 200 historical GitHub issues. Team has 2 ex-Stripe infrastructure engineers.',
  createdAt: '2026-10-04T09:00:00Z',
  updatedAt: '2026-10-04T10:30:00Z',
  isDemo: true,
};

export const INITIAL_DEMO_ANALYSIS: PitchAnalysis = {
  problem: 'Software engineering teams spend 15–20% of weekly capacity diagnosing ambiguous, poorly documented bug reports and manually routing tickets across repos.',
  targetUsers: [
    'Engineering Managers overwhelmed by noisy bug backlogs',
    'Staff/Senior Engineers acting as manual triage gatekeepers',
    'QA Leads spending hours re-testing duplicate tickets',
    'Open-source maintainers drowning in issue triage'
  ],
  painPoints: [
    'Missing reproductive steps and crash logs in 60%+ of filed bug reports',
    'Duplicate issues filed under different phrasing that waste dev testing time',
    'Context switching: high-value engineers pulled from deep feature work to triage',
    'P1/P0 regressions buried under trivial cosmetic issues on weekends'
  ],
  proposedSolution: 'PitchForge-analyzed Bug Triage Agent: An intelligent GitHub/Linear bot that combines AST repository parsing with Qwen deep reasoning to validate bug reports, auto-request missing logs from submitters, deduplicate vectors, and route directly to code owners.',
  valueProposition: 'Reduce developer triage overhead by 65% while slashing time-to-first-response from hours to seconds.',
  assumptions: [
    'Bug reporters will respond constructively to an AI bot prompting for missing logs',
    'Engineering leads will trust automated component tagging without micromanaging',
    'Teams are willing to grant repository code reading permissions to the agent',
    'Vector embeddings alone can distinguish nuanced software bugs'
  ],
  evidenceGaps: [
    'Zero benchmark metrics verifying false-positive routing rate on real-world repos',
    'The claimed "70% triage time savings" is an unverified estimate, not empirical data',
    'No willingness-to-pay validation for the proposed $29/seat/month model',
    'No measured user completion rate when the bot requests additional crash dumps'
  ],
  risks: [
    'GitHub or Linear launching native lightweight AI triage, eroding pure classification moats',
    'Hallucinated component assignments causing developer frustration and notification fatigue',
    'Enterprise security policies rejecting third-party source-code indexing bots',
    'Reporters ignoring the bot when asked for logs, leaving issues in limbo'
  ],
  opportunities: [
    'Expanding from triage to automated PR drafting (suggested hotfix generation)',
    'Enterprise compliance and SOC2 compliant on-prem / VPC deployment mode',
    'Telemetry integration with Datadog and Sentry for end-to-end incident linking'
  ],
  competitors: [
    {
      name: 'GitHub Copilot / Workspace',
      comparison: 'Native developer trust, but currently focuses on code generation rather than automated ticket interrogation and triage routing.'
    },
    {
      name: 'Linear Insights / Jira Automation',
      comparison: 'Great issue tracking UI, but relies on rigid regex and static rule-engines without semantic code understanding.'
    },
    {
      name: 'Generic LLM wrappers',
      comparison: 'Lack repository architecture context and cannot perform multi-turn clarification with external reporters.'
    }
  ],
  differentiators: [
    'Autonomous Multi-turn Clarification: Actually interviews bug reporters for missing logs before human dev assignment',
    'Code-Aware Context: Deep integration with git blame, codeowners, and directory change frequency',
    'Semantic Deduplication: Unifies disparate bug phrasings and stack-trace signatures'
  ],
  businessModel: 'B2B SaaS with a freemium GitHub marketplace app (free for open source, $29/seat/mo for growth teams, enterprise custom pricing for VPC deployment).',
  technicalFeasibility: {
    score: 88,
    reasoning: 'High feasibility. LLM reasoning combined with tree-sitter AST parsers and vector DBs (e.g. pgvector/Pinecone) is proven architecture with manageable latency.'
  },
  pitchReadinessScore: 68,
  readinessBreakdown: {
    problemClarity: {
      name: 'Problem Clarity',
      score: 92,
      explanation: 'Clear, universally acknowledged pain point with well-defined symptoms in software engineering workflows.',
      status: 'strong'
    },
    solutionClarity: {
      name: 'Solution Clarity',
      score: 84,
      explanation: 'Well-articulated agent pipeline from ingestion to clarification bot and repository code routing.',
      status: 'strong'
    },
    targetUserClarity: {
      name: 'Target User Clarity',
      score: 75,
      explanation: 'Target audience (50-200 dev teams) is reasonable, but needs a sharper initial wedge (e.g. fast-shipping SaaS vs regulated enterprise).',
      status: 'moderate'
    },
    differentiation: {
      name: 'Differentiation',
      score: 62,
      explanation: 'Differentiating against GitHub native features requires stronger proof of unique interactive clarification moat.',
      evidenceNeeded: true,
      status: 'moderate'
    },
    evidence: {
      name: 'Empirical Evidence',
      score: 48,
      explanation: 'Evidence needed: Claimed 70% productivity gain is unverified. Lacks benchmark test data on triage accuracy.',
      evidenceNeeded: true,
      status: 'weak'
    },
    technicalFeasibility: {
      name: 'Technical Feasibility',
      score: 90,
      explanation: 'Architecture is realistic with modern LLMs and webhook infrastructure. API rate limits and token costs are manageable.',
      status: 'strong'
    },
    businessPotential: {
      name: 'Business Potential',
      score: 64,
      explanation: 'SaaS pricing needs pilot validation. Per-seat pricing may encounter resistance compared to ticket-volume or ROI-based pricing.',
      status: 'moderate'
    },
    storytelling: {
      name: 'Storytelling & Hook',
      score: 74,
      explanation: 'Relatable developer narrative, but currently leans too heavily on technical specs rather than the emotional pain of interrupted sprints.',
      status: 'moderate'
    }
  },
  strengths: [
    'Viscerally felt problem for every judge who has built software',
    'Interactive clarification bot is a memorable and tangible product mechanic',
    'Clear architectural understanding of AST code parsing and vector search'
  ],
  weaknesses: [
    'Unverified efficiency claim (70% time savings) invites skeptical judge questions',
    'Competitor defense against GitHub Copilot needs sharper justification',
    'Target audience too broad across both open source and mid-market without a wedge'
  ],
  recommendedChanges: [
    'Replace unverified "70% savings" claim with pilot metric: "Tested across 200 historical issues with 84% first-time routing accuracy"',
    'Emphasize the automated reporter clarification loop as the core moat against static tools',
    'Focus go-to-market wedge specifically on teams using GitHub + Linear with 50+ monthly incoming bugs'
  ],
  claimAudits: [
    {
      claim: 'Bug reports from users and QA are chronically incomplete',
      classification: 'verified-evidence',
      context: 'Supported by industry studies and team interviews with 5 lead developers.',
    },
    {
      claim: 'Senior engineers waste 15-20% of sprint time manually triaging',
      classification: 'user-provided',
      context: 'Estimated from team observations during sprint retrospectives.',
      recommendation: 'Cite specific team calendar audits or historical ticket logs.'
    },
    {
      claim: 'Teams will save 70% of triage time in month 1 and accelerate release velocity',
      classification: 'unverified-claim',
      context: 'Found on Miro board sticky note without supporting empirical benchmark.',
      recommendation: 'Reframe as targeted pilot hypothesis: "Targeting 50% triage cycle reduction, validated on 200 benchmark tickets."'
    },
    {
      claim: '30% of new issues already exist as duplicates in some form',
      classification: 'assumption',
      context: 'Based on anecdotal developer gut feeling across multiple repos.',
      recommendation: 'Run semantic clustering on past 500 closed issues to obtain exact duplicate percentage.'
    }
  ],
  nextActionPrompt: {
    text: 'Your pitch is 68% ready. The biggest vulnerability is unsupported claims that skeptical judges will attack.',
    actionLabel: 'Attack My Pitch',
    targetTab: 'attack'
  }
};

export const DEMO_IMPROVEMENTS: PitchImprovementItem[] = [
  {
    id: 'imp-1',
    number: '01',
    title: 'Your claimed 70% productivity improvement has zero empirical evidence',
    whyItMatters: 'Judges immediately discount unverified round percentages. If you claim 70% without data, they will question all your other claims.',
    whatIsMissing: 'A concrete pilot test or historical benchmark comparing manual triage hours vs agent-assisted triage.',
    suggestedImprovement: 'Replace with: "In our benchmark evaluation across 200 historical GitHub issues, BugTriage correctly identified missing logs in 89% of cases and predicted the correct code owner with 84% accuracy, cutting initial triage time from 4.2 hours to 8 minutes."',
    userFix: 'Validated on 200 historical repo issues with 84% code owner routing accuracy and 8-minute turnaround.',
    isApplied: false,
    category: 'Evidence & Validation'
  },
  {
    id: 'imp-2',
    number: '02',
    title: 'Your differentiation against GitHub Copilot is not clearly established',
    whyItMatters: 'Every investor and hackathon judge will ask: "Why wouldn\'t GitHub just ship this as a checkbox next month?"',
    whatIsMissing: 'A sharp mechanical distinction between generic autocomplete and our multi-turn interactive interrogation loop.',
    suggestedImprovement: 'Frame BugTriage not as an LLM summarizer, but as an active investigator that converses with the human reporter to collect stack traces, inspects runtime telemetry, and checks cross-repo dependency graphs that single-repo copilot tools ignore.',
    userFix: 'Highlight the autonomous multi-turn bug reporter interview loop and cross-repo dependency intelligence.',
    isApplied: false,
    category: 'Differentiation & Moat'
  },
  {
    id: 'imp-3',
    number: '03',
    title: 'Your target customer wedge is too broad',
    whyItMatters: 'Trying to serve open-source maintainers, 50-person startups, and 200-person enterprises simultaneously dilutes your go-to-market narrative.',
    whatIsMissing: 'A single, high-urgency buyer persona who feels the pain right now and has the authority to install the app.',
    suggestedImprovement: 'Position the initial wedge on Fast-Growing SaaS Engineering Teams (50–150 devs) using Linear + GitHub who ship weekly and lose track of regression bugs.',
    userFix: 'Focus initial wedge on 50-150 dev scaleups using Linear + GitHub Enterprise with weekly release cycles.',
    isApplied: false,
    category: 'Target Audience'
  }
];

export const DEMO_ATTACK_REPORT: PitchAttackReport = {
  survivalScore: 67,
  initialSurvivalScore: 67,
  verdict: 'High Vulnerability — A technical judge or seasoned investor will expose unverified claims and competitive exposure within 90 seconds.',
  topThreePriorities: [
    'Fix the unsubstantiated 70% time savings claim with concrete benchmark metrics.',
    'Differentiate decisively against GitHub Copilot native issue triaging.',
    'Explain how the agent prevents hallucinated misrouting from annoying senior engineers.'
  ],
  attacks: [
    {
      id: 'atk-1',
      severity: 'critical',
      category: 'Unsupported Claims & Evidence',
      issue: 'The 70% triage time savings claim will be immediately torn apart as fantasy.',
      whyItMatters: 'Skeptical judges hunt for manufactured marketing claims. Stating 70% without pilot logs destroys credibility for the entire technical architecture.',
      recommendedFix: 'Rephrase to: "Benchmarked on 200 historical repository tickets: 84% accuracy in component prediction, reducing median time-to-first-response from 4.2 hours to 8 minutes."',
      status: 'unresolved'
    },
    {
      id: 'atk-2',
      severity: 'critical',
      category: 'Competitive Moat',
      issue: 'Why doesn\'t GitHub / Microsoft just build this directly into GitHub Issues next month?',
      whyItMatters: 'If your entire product can be replicated by a system prompt update from the platform owner, you have a feature, not a company.',
      recommendedFix: 'Showcase that your agent is multi-platform (syncs Linear, Jira, Sentry, and Slack) and performs active multi-turn interviews with users, which platform-bound tools do not do.',
      status: 'unresolved'
    },
    {
      id: 'atk-3',
      severity: 'high',
      category: 'Technical Reliability & Trust',
      issue: 'Hallucinated routing will alienate staff engineers if the bot assigns tickets to the wrong team 20% of the time.',
      whyItMatters: 'Developer tools live or die on trust. One noisy bot tagging the wrong VP of Engineering gets uninstalled immediately.',
      recommendedFix: 'Add a confidence threshold fallback: if Qwen confidence is below 85%, route to a lightweight human review triage queue instead of spamming engineers.',
      status: 'unresolved'
    },
    {
      id: 'atk-4',
      severity: 'high',
      category: 'Security & Enterprise Adoption',
      issue: 'No enterprise security team will permit an autonomous bot to read proprietary code without strict data boundaries.',
      whyItMatters: 'Your B2B buyer is the Engineering Manager, but the blocker is InfoSec. Lack of SOC2/data privacy answers kills enterprise pilots.',
      recommendedFix: 'State explicitly that AST metadata and embeddings are processed ephemerally with zero model retraining on customer code, offering VPC/on-prem deployment options.',
      status: 'unresolved'
    },
    {
      id: 'atk-5',
      severity: 'medium',
      category: 'Business Model & Pricing',
      issue: 'Per-seat pricing ($29/dev/mo) will face brutal friction in a tightening software budget climate.',
      whyItMatters: 'Companies are currently cutting developer seat licenses. Charging per developer rather than per resolved ticket or active repo creates unnecessary purchase resistance.',
      recommendedFix: 'Pivot to usage-based pricing or a flat repository tier ($199/month per active production repo) with unlimited developer viewers.',
      status: 'unresolved'
    },
    {
      id: 'atk-6',
      severity: 'low',
      category: 'Storytelling & Hook',
      issue: 'The pitch opens with dry workflow diagrams instead of the emotional reality of an engineer being woken up by an untriaged P0 bug.',
      whyItMatters: 'Judges remember stories and tension, not flowchart architecture slides.',
      recommendedFix: 'Open with a concrete scenario: A customer reports a critical payment outage on Saturday at 2 AM, but the report only says "doesn\'t work" with zero logs.',
      status: 'unresolved'
    }
  ]
};

export const DEMO_PITCH_DECK: PitchDeck = {
  title: 'BugTriage AI — Autonomous Bug Investigation & Routing',
  tagline: 'Turn chaotic, incomplete bug reports into verified, actionable code fixes.',
  slideCount: 10,
  totalDurationSeconds: 300, // 5 minutes
  slides: [
    {
      slideNumber: 1,
      title: 'The Saturday 2:00 AM Disaster',
      objective: 'Hook the judges with a relatable, high-stakes developer nightmare.',
      keyPoints: [
        'A customer reports: "Payment button broken" with zero error logs or browser details',
        'Senior engineers spend 3 hours guessing before discovering a Safari iOS regression',
        'Thousands in lost revenue because the bug report lacked basic diagnostic context'
      ],
      visualSuggestion: 'Split screen: Left side shows panic Slack messages with a cryptic bug ticket; Right side shows a ticking clock and revenue loss counter.',
      speakerScript: 'Every engineer in this room knows the sinking feeling of a Saturday 2:00 AM alert. A customer files a ticket that simply says "Payment broken". No stack trace. No browser version. No reproduction steps. By the time a senior engineer wakes up and extracts the missing logs, thousands of dollars have been lost.',
      durationSeconds: 30,
      deliveryNotes: {
        tone: 'Dramatic, empathetic, high energy',
        energy: 'High',
        pauseAfter: 'thousands of dollars have been lost.',
        emphasis: 'No stack trace. No reproduction steps.',
        transition: 'And this is not an edge case—it is the daily reality of modern engineering teams.'
      }
    },
    {
      slideNumber: 2,
      title: 'The Triage Bottleneck',
      objective: 'Expose the systemic cost of manual bug triage across software teams.',
      keyPoints: [
        'Over 60% of filed bug reports lack the basic information needed to reproduce',
        'Senior developers waste 15% to 20% of their sprint time playing investigative detective',
        '30% of incoming tickets are duplicate variations of existing known issues'
      ],
      visualSuggestion: 'Infographic showing high-paid engineers trapped in a maze of incomplete tickets and back-and-forth email/Slack threads.',
      speakerScript: 'Across software teams worldwide, over sixty percent of filed bug reports are functionally useless on arrival. Staff engineers—your highest-paid problem solvers—waste nearly one-fifth of their sprint time acting as human intake clerks, pinging reporters for console logs and manually checking if the bug was already filed.',
      durationSeconds: 30,
      deliveryNotes: {
        tone: 'Frustrated, analytical',
        energy: 'Medium',
        pauseAfter: 'over sixty percent of filed bug reports are functionally useless on arrival.',
        emphasis: 'Staff engineers—your highest-paid problem solvers',
        transition: 'So why haven\'t current tools solved this?'
      }
    },
    {
      slideNumber: 3,
      title: 'Why Existing Approaches Fail',
      objective: 'Discredit regex rules, static Jira automation, and generic AI chatbots.',
      keyPoints: [
        'Static rule engines (Jira/Linear automation) only match keywords and break constantly',
        'Generic LLMs hallucinate code ownership because they lack repository AST context',
        'Nobody handles the missing information problem—they just categorize bad data'
      ],
      visualSuggestion: 'Comparison grid showing Rule Engines vs Generic Chatbots vs Autonomous Triage Agents.',
      speakerScript: 'Current solutions fail because they treat bug triage as a passive tagging exercise. Regex automation breaks with every sprint. Generic LLM wrappers hallucinate code ownership because they cannot parse repository syntax trees. Crucially, none of them fix the fundamental root cause: the missing information in the report itself.',
      durationSeconds: 30,
      deliveryNotes: {
        tone: 'Conviction, critical clarity',
        energy: 'Medium',
        pauseAfter: 'none of them fix the fundamental root cause: the missing information in the report itself.',
        emphasis: 'passive tagging exercise',
        transition: 'We built a system that actively investigates.'
      }
    },
    {
      slideNumber: 4,
      title: 'The High-Growth Wedge',
      objective: 'Define the laser-focused target customer persona.',
      keyPoints: [
        'Initial wedge: Fast-shipping SaaS scaleups with 50 to 150 engineers',
        'Operating on GitHub Enterprise + Linear with weekly or daily continuous deployment',
        'High ticket velocity: 80+ incoming bug reports per week where triage latency hurts'
      ],
      visualSuggestion: 'Target persona card: VP of Engineering / Dev Lead managing 10 microservice repos with high release frequency.',
      speakerScript: 'Our laser-focused entry wedge is fast-moving scaleup engineering teams with 50 to 150 developers. These teams ship daily to thousands of users. They already use Linear and GitHub Enterprise, and receiving eighty or more bugs a week means triage delays directly stall their sprint velocity.',
      durationSeconds: 25,
      deliveryNotes: {
        tone: 'Precise, commercially disciplined',
        energy: 'Medium',
        pauseAfter: 'triage delays directly stall their sprint velocity.',
        emphasis: 'laser-focused entry wedge',
        transition: 'Here is how BugTriage transforms their workflow.'
      }
    },
    {
      slideNumber: 5,
      title: 'Introducing BugTriage AI',
      objective: 'Reveal the product value proposition and hero capabilities.',
      keyPoints: [
        'The first autonomous agent that actively investigates bugs before devs ever see them',
        'Interviews the reporter automatically for missing crash logs and screen recordings',
        'Connects directly to your codebase AST to identify the exact file and author'
      ],
      visualSuggestion: 'Clean UI product screenshot showing BugTriage politely prompting a user for Safari console logs on GitHub and receiving them in 60 seconds.',
      speakerScript: 'Meet BugTriage AI: the first autonomous triage engineer that investigates bugs before developers ever open the queue. When an incomplete issue arrives, BugTriage doesn\'t just slap a label on it. It identifies exactly what is missing, politely replies to the reporter with tailored instructions, and collects the diagnostics.',
      durationSeconds: 35,
      deliveryNotes: {
        tone: 'Excited, inspiring, confident',
        energy: 'High',
        pauseAfter: 'investigates bugs before developers ever open the queue.',
        emphasis: 'doesn\'t just slap a label on it',
        transition: 'Let us take a look under the hood.'
      }
    },
    {
      slideNumber: 6,
      title: 'How It Works: The Autonomous Loop',
      objective: 'Walk through the 4-step end-to-end triage pipeline.',
      keyPoints: [
        '1. Ingestion: Webhook triggers from GitHub, Linear, or Sentry alerts',
        '2. Validation & Clarification: Qwen detects missing repro steps and asks the reporter',
        '3. Semantic Deduplication: Vector cosine clustering flags duplicate tickets',
        '4. Codeowner Routing: AST tree-sitter maps stack traces to git blame code owners'
      ],
      visualSuggestion: 'Interactive pipeline diagram showing incoming raw issue -> Clarification Agent -> AST Parser -> Routed PR/Ticket.',
      speakerScript: 'Here is the pipeline: When an issue arrives via webhook, our reasoning engine evaluates diagnostic completeness. If repro steps or logs are missing, it initiates an automated clarification loop. Simultaneously, vector embeddings cluster duplicate reports, while our tree-sitter AST parser maps the stack trace to the exact repository component and responsible code owner.',
      durationSeconds: 35,
      deliveryNotes: {
        tone: 'Authoritative, technical mastery',
        energy: 'Medium',
        pauseAfter: 'maps the stack trace to the exact repository component and responsible code owner.',
        emphasis: 'automated clarification loop',
        transition: 'The technical architecture ensures enterprise-grade security and speed.'
      }
    },
    {
      slideNumber: 7,
      title: 'Architecture & Technical Defense',
      objective: 'Address judge skepticism regarding hallucinations and privacy.',
      keyPoints: [
        'Hybrid Qwen Reasoning + Tree-Sitter AST parser + Vector similarity index',
        'Confidence Safety Fallback: Below 85% confidence, tickets escalate to human review queue',
        'Zero-retention ephemeral processing: Customer source code is never used to train public models'
      ],
      visualSuggestion: 'System architecture diagram highlighting ephemeral data boundary, confidence threshold gate, and multi-platform connectors.',
      speakerScript: 'We address developer trust head-on. Our architecture pairs deep Qwen reasoning with deterministic Tree-Sitter AST code parsing. If model confidence falls below eighty-five percent, the ticket routes to a quick human verification queue rather than misassigning engineers. And importantly for InfoSec: all repository parsing is ephemeral with zero model retraining.',
      durationSeconds: 30,
      deliveryNotes: {
        tone: 'Reassuring, robust, engineering-led',
        energy: 'Medium',
        pauseAfter: 'all repository parsing is ephemeral with zero model retraining.',
        emphasis: 'confidence falls below eighty-five percent',
        transition: 'And the benchmark results speak for themselves.'
      }
    },
    {
      slideNumber: 8,
      title: 'Traction & Empirical Validation',
      objective: 'Deliver the grounded metrics that prove the solution works.',
      keyPoints: [
        'Benchmarked on 200 real historical issues across 3 open and private repositories',
        '84% first-time accurate code owner routing and component tagging',
        'Time-to-first-investigation reduced from 4.2 hours to just 8 minutes',
        '3 pilot design partners actively testing in their staging environments'
      ],
      visualSuggestion: 'Clean metric counters: 84% Routing Accuracy, 8 Min Triage Lag, 200 Benchmark Tickets, 3 Active Pilots.',
      speakerScript: 'Rather than relying on unverified estimates, we benchmarked BugTriage on two hundred historical repository tickets. The results: eighty-four percent accurate first-time component routing, and median time-to-first-response collapsed from 4.2 hours down to eight minutes. Today, three pilot teams are actively running BugTriage in staging.',
      durationSeconds: 30,
      deliveryNotes: {
        tone: 'Grounded, punchy, undeniable proof',
        energy: 'High',
        pauseAfter: 'collapsed from 4.2 hours down to eight minutes.',
        emphasis: 'two hundred historical repository tickets',
        transition: 'Why will our moat endure against platform incumbents?'
      }
    },
    {
      slideNumber: 9,
      title: 'Competitive Moat & Ecosystem Advantage',
      objective: 'Solidify why competitors and platforms cannot easily copy this.',
      keyPoints: [
        'Cross-platform orchestration: Bridges GitHub, Linear, Jira, Sentry, and Slack simultaneously',
        'Multi-turn conversational memory with external bug reporters and QA testers',
        'Proprietary error-to-AST graph mapping that improves with every resolved ticket'
      ],
      visualSuggestion: 'Hub-and-spoke diagram with BugTriage at the center connecting fragmented developer tools.',
      speakerScript: 'GitHub and Jira are trapped in their own single-vendor silos. Engineering teams use Linear for issues, GitHub for PRs, Sentry for exceptions, and Slack for alerts. BugTriage sits at the cross-platform intersection, maintaining conversational memory across tools and building an error-to-AST knowledge graph that single-platform utilities cannot replicate.',
      durationSeconds: 30,
      deliveryNotes: {
        tone: 'Strategic, competitive edge',
        energy: 'Punchy',
        pauseAfter: 'single-platform utilities cannot replicate.',
        emphasis: 'cross-platform intersection',
        transition: 'Join us in eliminating developer triage fatigue forever.'
      }
    },
    {
      slideNumber: 10,
      title: 'The Future of Autonomous Engineering',
      objective: 'Compelling closing call-to-action with clear next milestone.',
      keyPoints: [
        'Next Milestone: Launching public GitHub Marketplace app with 15 beta design partners',
        'Vision: From autonomous triage to automated hotfix pull request generation',
        'Try our live demo today: Install on your staging repo in under 2 minutes'
      ],
      visualSuggestion: 'GitHub marketplace installation banner with QR code and contact details for early pilot access.',
      speakerScript: 'Developer time is too precious to spend interrogating bug reports. We are launching our public GitHub Marketplace app next month with our first fifteen design partners, taking the first step toward self-healing software repositories. Stop letting incomplete bugs derail your sprints. Install BugTriage today. Thank you!',
      durationSeconds: 25,
      deliveryNotes: {
        tone: 'Inspiring, memorable, climactic',
        energy: 'High',
        pauseAfter: 'Install BugTriage today. Thank you!',
        emphasis: 'Developer time is too precious',
        transition: 'Ready for Q&A.'
      }
    }
  ]
};

export const DEMO_JUDGE_QUESTIONS: JudgeQuestion[] = [
  {
    id: 'jq-1',
    category: 'Competition',
    question: 'Why won\'t GitHub simply build this directly into GitHub Issues with Copilot Workspace?',
    difficulty: 'High',
    skepticalAngle: 'Platform risk: Microsoft owns GitHub and OpenAI. What is your defensibility?',
    suggestedAnswer: 'GitHub Copilot Workspace focuses on code generation within GitHub. Real engineering workflows are fragmented: bugs originate in customer support tools, are tracked in Linear or Jira, and link to Sentry exceptions. BugTriage functions as a cross-platform orchestrator and actively interrogates external non-developer reporters—a multi-platform interaction loop Microsoft has historically avoided.',
    evidenceStatus: 'grounded'
  },
  {
    id: 'jq-2',
    category: 'Technology',
    question: 'How do you prevent hallucinations from misrouting critical security bugs to the wrong team?',
    difficulty: 'Brutal',
    skepticalAngle: 'LLMs make mistakes. Misrouting a zero-day vulnerability is catastrophic.',
    suggestedAnswer: 'We enforce an architectural confidence gate. Every Qwen routing recommendation requires an internal confidence score above 85% paired with a verified Tree-Sitter AST codeowner match. If either check fails, the ticket is flagged as [Needs Human Confirmation] in an isolated triage inbox, never silently misrouted. Critical security keywords trigger an immediate hardcoded alert bypassing LLM inference.',
    evidenceStatus: 'grounded'
  },
  {
    id: 'jq-3',
    category: 'Security',
    question: 'How will you convince enterprise CISOs to allow an AI bot access to their proprietary source code?',
    difficulty: 'High',
    skepticalAngle: 'IP leakage and enterprise compliance barriers.',
    suggestedAnswer: 'Our architecture separates code analysis from model inference. The bot computes deterministic AST symbol trees and dependency graphs client-side or within a self-hosted Docker runner; only obfuscated stack traces and function signatures are sent to the reasoning engine under a zero-retention enterprise agreement. For regulated enterprises, we support VPC deployment via private models.',
    evidenceStatus: 'grounded'
  },
  {
    id: 'jq-4',
    category: 'Business model',
    question: 'Why charge $29/seat when developer tools are currently facing severe procurement consolidation?',
    difficulty: 'Medium',
    skepticalAngle: 'Seat-based pricing faces CFO scrutiny.',
    suggestedAnswer: 'Your current project context reflects that seat-based pricing was an initial assumption. In response to recent market feedback, we are testing repository-tier pricing ($199/month per active production repo with unlimited developer seats). This aligns pricing directly with software volume rather than head-count friction.',
    evidenceStatus: 'partial',
    evidenceNeeded: 'Formal pilot contract validation on repository-tier pricing.'
  },
  {
    id: 'jq-5',
    category: 'Product',
    question: 'What happens if the bug reporter completely ignores the bot\'s request for missing logs?',
    difficulty: 'Medium',
    skepticalAngle: 'Human failure mode in the interaction loop.',
    suggestedAnswer: 'If the reporter does not respond within 48 hours, BugTriage automatically applies a [Pending Reporter Info] tag and moves the issue to a stale queue with an automatic gentle reminder. This alone saves developers from having to remember to check back manually.',
    evidenceStatus: 'grounded'
  },
  {
    id: 'jq-6',
    category: 'AI usage',
    question: 'Why does this need Qwen reasoning instead of a basic keyword classifier like TF-IDF or regex?',
    difficulty: 'High',
    skepticalAngle: 'AI overkill: Is LLM reasoning genuinely necessary here?',
    suggestedAnswer: 'Keyword classifiers fail on colloquial human bug reports (e.g. "it crashed after I tapped checkout on my iPad"). Qwen performs multi-step deductive reasoning: mapping colloquial user descriptions to HTTP 422 errors, identifying missing repro headers, and formulating natural clarification questions that end users can understand without technical jargon.',
    evidenceStatus: 'grounded'
  },
  {
    id: 'jq-7',
    category: 'Scalability',
    question: 'How do you handle repositories with millions of lines of code without blowing through context windows and token budgets?',
    difficulty: 'High',
    skepticalAngle: 'Token cost and context limit scaling.',
    suggestedAnswer: 'We never dump raw code into the context window. We use Tree-Sitter to extract AST symbols, file headers, and CODEOWNERS maps into a hierarchical vector index. When a stack trace is parsed, only the top 3 relevant file signatures and dependency interfaces are injected into Qwen\'s context window, keeping inference under 2,000 tokens per ticket.',
    evidenceStatus: 'grounded'
  },
  {
    id: 'jq-8',
    category: 'Go-to-market',
    question: 'What is your customer acquisition wedge to get developers to install this on day one?',
    difficulty: 'Medium',
    skepticalAngle: 'Distribution hurdle: How do you overcome zero brand awareness?',
    suggestedAnswer: 'A 1-click GitHub Marketplace app offering a free "Triage Health Audit" on any public or private repository. In 60 seconds, it analyzes the last 100 closed issues and displays how many hours were wasted on incomplete reports and duplicates. This immediate diagnostic proof drives conversion to the active triage agent.',
    evidenceStatus: 'grounded'
  },
  {
    id: 'jq-9',
    category: 'Ethics',
    question: 'Could the agent introduce bias by deprioritizing bug reports from non-technical or ESL users who write poor English?',
    difficulty: 'Medium',
    skepticalAngle: 'Algorithmic bias against non-technical reporters.',
    suggestedAnswer: 'This is precisely why the automated clarification bot exists. Instead of rejecting or deprioritizing poorly worded reports, Qwen translates colloquial or multilingual descriptions into structured reproduction steps, actively democratizing bug reporting for non-technical users.',
    evidenceStatus: 'grounded'
  },
  {
    id: 'jq-10',
    category: 'Problem',
    question: 'Isn\'t the real solution just making bug reporting forms mandatory with required fields?',
    difficulty: 'Low',
    skepticalAngle: 'Low-tech alternative: Why not just use Jira form validation?',
    suggestedAnswer: 'Mandatory form fields create massive friction: users either abandon the report entirely or fill required fields with "asdf" and nonsense text just to bypass the form. BugTriage allows frictionless free-form reporting while dynamically retrieving the exact missing diagnostic context needed for that specific bug type.',
    evidenceStatus: 'grounded'
  }
];

export const DEMO_EXECUTIVE_SUMMARY: ExecutiveSummary = {
  projectName: 'BugTriage AI',
  tagline: 'Autonomous AI triage agent that turns chaotic bug reports into verified, routed code fixes.',
  problem: 'Engineering teams lose 15–20% of sprint capacity to incomplete bug reports, duplicate backlog tickets, and manual triage delays. High-paid senior engineers are forced to act as diagnostic intake clerks.',
  solution: 'An autonomous GitHub and Linear agent powered by Qwen reasoning. BugTriage parses stack traces, actively interviews reporters for missing logs, deduplicates issues using semantic vector similarity, and routes tickets to code owners via AST parsing.',
  targetMarket: 'Fast-shipping B2B SaaS and scaleup engineering teams (50–150 developers) with high ticket velocity and daily release cycles.',
  differentiation: 'Unlike static regex rules or generic LLM chatbots, BugTriage operates cross-platform (GitHub, Linear, Jira, Sentry) and features an active multi-turn clarification loop that engages the human reporter before developers are interrupted.',
  technology: 'Deep Qwen reasoning combined with Tree-Sitter AST code parsing, pgvector semantic deduplication, and an 85% confidence safety gate with zero-retention ephemeral data handling.',
  businessModel: 'Freemium GitHub Marketplace app. Free for open source; $199/month per active production repository for commercial teams with unlimited developer seats.',
  impact: 'Demonstrated in 200 benchmark tickets: 84% first-time routing accuracy, reducing median triage investigation lag from 4.2 hours to 8 minutes.',
  currentStatus: 'Functional prototype integrated with GitHub webhooks and AST parser; currently in private staging pilot with 3 SaaS development teams.',
  nextMilestone: 'Public launch on GitHub Marketplace targeting 15 commercial design partners and $20k ARR within 90 days.'
};
