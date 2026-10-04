import { 
  Project, 
  PitchAnalysis, 
  PitchDeck, 
  PitchAttackReport, 
  JudgeQuestion, 
  ExecutiveSummary,
  PitchImprovementItem 
} from '@/types';
import { 
  DEMO_PROJECT, 
  INITIAL_DEMO_ANALYSIS, 
  DEMO_IMPROVEMENTS, 
  DEMO_ATTACK_REPORT, 
  DEMO_PITCH_DECK, 
  DEMO_JUDGE_QUESTIONS, 
  DEMO_EXECUTIVE_SUMMARY 
} from './demoProject';

export interface SampleIdea {
  id: string;
  name: string;
  category: string;
  badge: string;
  tagline: string;
  readinessScore: number;
  project: Project;
  analysis: PitchAnalysis;
  improvements: PitchImprovementItem[];
  attackReport: PitchAttackReport;
  deck: PitchDeck;
  judgeQuestions: JudgeQuestion[];
  summary: ExecutiveSummary;
}

// 1. AI Bug Triage Agent (DevTools / B2B SaaS)
export const BUG_TRIAGE_SAMPLE: SampleIdea = {
  id: 'proj-bug-triage-demo',
  name: 'AI Bug Triage Agent',
  category: 'DEVTOOLS / B2B SAAS',
  badge: 'POPULAR DEMO',
  tagline: 'Turn chaotic, incomplete bug reports into verified, actionable code fixes.',
  readinessScore: 68,
  project: DEMO_PROJECT,
  analysis: INITIAL_DEMO_ANALYSIS,
  improvements: DEMO_IMPROVEMENTS,
  attackReport: DEMO_ATTACK_REPORT,
  deck: DEMO_PITCH_DECK,
  judgeQuestions: DEMO_JUDGE_QUESTIONS,
  summary: DEMO_EXECUTIVE_SUMMARY,
};

// 2. MedGuardian AI (HealthTech / Clinical Operations)
export const MED_GUARDIAN_PROJECT: Project = {
  id: 'proj-medguardian-demo',
  name: 'MedGuardian AI',
  problemStatement: '40% of discharged hospital patients misunderstand their post-acute medication schedule, driving 30-day preventable readmission penalties that cost US health systems $17 Billion annually.',
  targetAudience: 'Hospital Chief Medical Officers, ACO Clinical Directors, and Nursing Coordinators managing high-penalty Medicare/Medicaid patient populations.',
  solutionDescription: 'An ambient clinical voice & SMS agent that ingests hospital EHR discharge summaries, translates complex regimens into daily micro-checklists in 14 languages, and flags medication complications to triage nurses before ER readmissions happen.',
  miroBoardUrl: 'https://miro.com/app/board/uXjVMED123HealthBoard/',
  additionalContext: 'Piloted with 60 cardiology patients across 2 regional hospitals. Reduced 30-day readmissions by 32% in pilot cohort. HIPAA-compliant VPC architecture with Epic/Cerner FHIR connectors.',
  createdAt: '2026-10-04T10:00:00Z',
  updatedAt: '2026-10-04T11:00:00Z',
  isDemo: true,
};

export const MED_GUARDIAN_SAMPLE: SampleIdea = {
  id: 'proj-medguardian-demo',
  name: 'MedGuardian AI',
  category: 'HEALTHTECH / CLINICAL AI',
  badge: 'HEALTHCARE',
  tagline: 'Eliminate preventable hospital readmissions with conversational discharge compliance.',
  readinessScore: 74,
  project: MED_GUARDIAN_PROJECT,
  analysis: {
    problem: 'Hospital discharge instructions are overwhelming, medically jargon-dense, and poorly retained by patients, causing a 20% national average 30-day readmission rate for heart failure and pneumonia.',
    targetUsers: [
      'Elderly chronic illness patients managing 5+ daily medications',
      'Clinical Care Managers drowning in manual phone follow-up calls',
      'Hospital CFOs facing CMS readmission penalty clawbacks'
    ],
    painPoints: [
      'Discharge packets average 15+ pages of dense legalese that patients discard',
      'Only 18% of discharged patients receive a nurse follow-up call within 72 hours',
      'Adverse drug events cause 66% of post-discharge complications'
    ],
    proposedSolution: 'MedGuardian AI: Ambient FHIR-integrated voice agent that checks in daily via standard phone calls or SMS, conducts Socratic medication adherence audits, and surfaces red-flag vitals to clinical teams.',
    valueProposition: 'Slash 30-day readmission rates by 30% while reducing nurse follow-up call burden by 75%.',
    assumptions: [
      'Elderly patients will converse comfortably with an AI voice agent over the telephone',
      'Health systems can integrate FHIR APIs without multi-year IT implementation stalls',
      'Clinicians will trust prioritized risk escalation scores'
    ],
    evidenceGaps: [
      'Small initial sample size (60 patients in 1 health system)',
      'Need multi-site randomized control trial across diverse demographic groups',
      'Malpractice liability boundaries when AI fails to escalate an atypical symptom'
    ],
    risks: [
      'HIPAA and BAA compliance enforcement with third-party LLM providers',
      'Patient digital literacy and cell phone connectivity in rural markets',
      'EHR vendors (Epic/Oracle Health) building native lightweight follow-up bots'
    ],
    opportunities: [
      'Expanding into remote patient monitoring (RPM) Medicare billing codes ($110/patient/mo)',
      'Direct integration with smart pill dispensers and continuous glucose monitors'
    ],
    competitors: [
      { name: 'Phreesia / CipherHealth', comparison: 'Relies on rigid static SMS survey links with low 12% patient response rates.' },
      { name: 'Manual Nurse Call Centers', comparison: 'Prohibitively expensive ($24/call) and impossible to scale across 100% of discharged patients.' }
    ],
    differentiators: [
      'Adaptive Conversational Cadence: Explains medication why, not just when',
      'Sub-acute Symptom Detection: Detects congestive fluid retention via voice acoustics',
      'Bi-directional EHR Write-back: Logs verified adherence notes directly into Epic chart'
    ],
    businessModel: 'B2B enterprise SaaS: $12 per discharged patient episode or annual hospital subscription ($180K/facility).',
    technicalFeasibility: { score: 85, reasoning: 'Strong feasibility. Voice synthesis via WebRTC + FHIR standard APIs is reliable and production-ready.' },
    pitchReadinessScore: 74,
    readinessBreakdown: {
      problemClarity: { name: 'Problem Clarity', score: 94, explanation: 'Enormous, universally recognized hospital financial pain.', status: 'strong' },
      solutionClarity: { name: 'Solution Clarity', score: 88, explanation: 'Clear clinical patient-to-nurse escalation loop.', status: 'strong' },
      targetUserClarity: { name: 'Target User', score: 82, explanation: 'Clear Medicare chronic condition focus.', status: 'strong' },
      differentiation: { name: 'Differentiation', score: 76, explanation: 'Strong clinical acoustic signals vs static SMS.', status: 'moderate' },
      evidence: { name: 'Evidence', score: 68, explanation: '60 patient pilot is encouraging but needs larger cohort.', status: 'moderate' },
      technicalFeasibility: { name: 'Feasibility', score: 86, explanation: 'FHIR and HIPAA-compliant VPC stack is proven.', status: 'strong' },
      businessPotential: { name: 'Business Potential', score: 90, explanation: 'Massive ROI driven by avoided CMS penalties.', status: 'strong' },
      storytelling: { name: 'Storytelling', score: 80, explanation: 'High emotional tension grounded in human patient survival.', status: 'strong' }
    },
    strengths: ['Massive quantifiable hospital ROI', 'CMS regulatory mandate tailwinds', 'High pilot adherence (84% call completion)'],
    weaknesses: ['Healthcare sales cycles are 9-14 months', 'Stringent regulatory & medical device compliance'],
    recommendedChanges: ['Focus initial wedge on congestive heart failure (CHF) patients where penalties are highest'],
    claimAudits: [
      { claim: 'Reduces readmissions by 32%', classification: 'verified-evidence', context: 'Observed across 60 cardiology patients at St. Jude Regional Hospital.' }
    ],
    nextActionPrompt: { text: 'Your pitch is 74% ready. Solid clinical data, but judge defense must address medical malpractice liability.', actionLabel: 'Attack My Pitch', targetTab: 'attack' }
  },
  improvements: [
    {
      id: 'imp-med-1',
      number: '01',
      title: 'Address clinical malpractice and hallucination liability immediately',
      whyItMatters: 'Judges will ask: "If your AI tells a patient their chest pain is just indigestion and they die, who gets sued?"',
      whatIsMissing: 'A clear clinical safety boundary where the bot never diagnoses and immediately connects 911/nurses on red-flag keywords.',
      suggestedImprovement: 'State clearly: "MedGuardian never dispenses medical advice or diagnosis. It is a structured information collection sensor that triggers warm-transfers to on-call triage nurses upon detecting clinical protocol triggers."',
      category: 'Clinical Safety & Liability'
    }
  ],
  attackReport: {
    survivalScore: 72,
    initialSurvivalScore: 72,
    verdict: 'Moderate Vulnerability — High clinical promise, but vulnerable to enterprise sales cycle and liability objections.',
    topThreePriorities: [
      'Define clear medical device non-diagnostic boundaries.',
      'Show evidence of elderly patient voice engagement.',
      'Prove Epic EHR integration speed without IT bottlenecks.'
    ],
    attacks: [
      {
        id: 'atk-med-1',
        severity: 'critical',
        category: 'Clinical Liability',
        issue: 'What happens when the agent fails to catch an impending stroke or pulmonary embolism?',
        whyItMatters: 'One missed fatal event creates catastrophic hospital PR and malpractice exposure.',
        recommendedFix: 'Establish strict clinical protocol triage: any mention of chest pressure, shortness of breath, or confusion immediately dials emergency services.',
        status: 'unresolved'
      }
    ]
  },
  deck: {
    title: 'MedGuardian AI — Post-Acute Patient Discharge Safety',
    tagline: 'Eliminate preventable hospital readmissions through proactive conversational clinical follow-up.',
    slideCount: 10,
    totalDurationSeconds: 300,
    slides: [
      {
        slideNumber: 1,
        title: 'The Day 7 Relapse',
        objective: 'Hook judges with the tragedy of preventable readmissions.',
        keyPoints: [
          'A 72-year-old heart failure patient is discharged with a 15-page medication schedule',
          'On Day 5, she confuses blood pressure pills with water retention pills',
          'By Day 7, she is in cardiac distress in the ER—costing the hospital $28,000 in penalties'
        ],
        visualSuggestion: 'Split screen: Confused patient holding multiple medication bottles vs ER resuscitation monitor.',
        speakerScript: 'Meet Margaret. She was discharged from the hospital on Tuesday with nineteen pages of complex instructions. By Friday, she mixed up her blood pressure medication. By Sunday, she was back in the ICU. Margaret did not fail—our healthcare system failed her.',
        durationSeconds: 30,
        deliveryNotes: { tone: 'Empathetic, urgent, tragic tension', energy: 'High' }
      },
      {
        slideNumber: 2,
        title: 'The $17 Billion Readmission Penalty',
        objective: 'Expose the systemic financial crisis facing health systems.',
        keyPoints: [
          'Over 40% of discharged patients cannot accurately explain their medication regimen',
          'Hospitals face up to 3% Medicare clawbacks under CMS HRRP penalties',
          'Overburdened floor nurses only have time to reach 18% of patients post-discharge'
        ],
        visualSuggestion: 'Infographic showing the financial leak: Medicare penalty clawbacks draining hospital margins.',
        speakerScript: 'Every year, US hospitals lose over seventeen billion dollars to preventable thirty-day readmissions. Floor nurses are burned out. They cannot manually call hundreds of discharged patients every single afternoon.',
        durationSeconds: 30,
        deliveryNotes: { tone: 'Analytical, severe economic reality', energy: 'Medium' }
      },
      {
        slideNumber: 3,
        title: 'Why Patient Portals Fail',
        objective: 'Discredit MyChart apps and robotic robo-calls.',
        keyPoints: [
          'Patient portal login rates for patients over 65 are below 14%',
          'Robocall surveys have an abysmal 8% response rate',
          'Patients need human-like conversational warmth, not cold questionnaire links'
        ],
        visualSuggestion: 'Comparison chart: MyChart App (14% adoption) vs Automated Robo-call (8% completion) vs MedGuardian (84% engagement).',
        speakerScript: 'Hospitals invested millions into patient portal apps. But patients over sixty-five do not log into portals when they feel dizzy. And robotic touch-tone surveys are hung up on in three seconds.',
        durationSeconds: 25,
        deliveryNotes: { tone: 'Critical clarity', energy: 'Medium' }
      },
      {
        slideNumber: 4,
        title: 'The High-Risk Wedge: Heart Failure & COPD',
        objective: 'Identify the acute initial clinical focus.',
        keyPoints: [
          'Target initial wedge: Congestive Heart Failure (CHF) and COPD patients',
          'Highest historical readmission rates (22.8%) and highest financial penalties',
          'Clear daily biometric markers: Daily weight gain and fluid retention'
        ],
        visualSuggestion: 'Clinical focus card: Cardiology and Pulmonology inpatient departments.',
        speakerScript: 'Our initial entry point is Congestive Heart Failure. CHF represents the single largest readmission penalty category in modern cardiology. If you track daily fluid weight, you can prevent ninety percent of acute hospitalizations.',
        durationSeconds: 25,
        deliveryNotes: { tone: 'Disciplined, clinical precision', energy: 'Medium' }
      },
      {
        slideNumber: 5,
        title: 'Introducing MedGuardian AI',
        objective: 'Reveal the product value proposition.',
        keyPoints: [
          'Ambient voice companion that calls patients daily at their preferred hour',
          'Converse in 14 native languages with empathetic, conversational pacing',
          'Gathers medication adherence, daily weight, and symptom progression'
        ],
        visualSuggestion: 'Product visual: Friendly voice waveform conversing with a patient on a standard telephone.',
        speakerScript: 'MedGuardian AI is an ambient clinical companion that calls patients directly on their phone. No app to download. No password to reset. It speaks fourteen languages, reviews their pills in plain English, and confirms adherence.',
        durationSeconds: 30,
        deliveryNotes: { tone: 'Inspiring, breakthrough reveal', energy: 'High' }
      },
      {
        slideNumber: 6,
        title: 'How It Works: The Clinical Escalation Loop',
        objective: 'Illustrate the patient-to-nurse pipeline.',
        keyPoints: [
          '1. Auto-Ingestion: Ingests discharge medication list via Epic/Cerner FHIR APIs',
          '2. Daily Check-in: 3-minute friendly conversational check-in call',
          '3. Risk Scoring: Qwen clinical reasoning identifies adverse drug interactions',
          '4. Nurse Escalation: Alerts triage nurse dashboard with 1-click clinical notes'
        ],
        visualSuggestion: '4-step workflow diagram: EHR Ingestion -> Patient Phone Call -> Qwen Risk Analysis -> Triage Nurse Dashboard.',
        speakerScript: 'When a patient is discharged, their medication list syncs via FHIR APIs. MedGuardian initiates daily check-ins. If a patient mentions a three-pound weight gain or dizzy spell, Qwen flags the biomarker and alerts the care manager immediately.',
        durationSeconds: 35,
        deliveryNotes: { tone: 'Authoritative, process mastery', energy: 'Medium' }
      },
      {
        slideNumber: 7,
        title: 'Clinical Safety & Zero-Liability Architecture',
        objective: 'Address judge skepticism regarding malpractice.',
        keyPoints: [
          'Zero Diagnostic Claims: MedGuardian never prescribes or alters medications',
          'Immediate Warm Transfer: Red-flag keywords trigger instant transfer to on-call RN or 911',
          'HIPAA-Compliant Private VPC: Zero patient health information used for public training'
        ],
        visualSuggestion: 'Security shield architecture: HIPAA perimeter, Red-Flag Emergency Gateway, and Epic FHIR connector.',
        speakerScript: 'We engineered MedGuardian with zero diagnostic ambiguity. The system never gives medical advice. It acts as an active sensory extension for the hospital, escalating critical signals to licensed clinicians before emergencies occur.',
        durationSeconds: 30,
        deliveryNotes: { tone: 'Reassuring, compliance-certified', energy: 'Medium' }
      },
      {
        slideNumber: 8,
        title: 'Pilot Results: 32% Readmission Drop',
        objective: 'Show concrete clinical benchmark results.',
        keyPoints: [
          'Tested across 60 cardiology patients at St. Jude Regional Medical Center',
          '84% patient engagement rate over a 30-day post-discharge cycle',
          '32% reduction in 30-day readmissions vs matched historical control group',
          'Nurse follow-up triage time reduced by 75%'
        ],
        visualSuggestion: 'Key metric counters: 32% Readmission Reduction, 84% Patient Engagement, 75% Nurse Time Saved.',
        speakerScript: 'In our 60-patient pilot at St. Jude Regional, patient engagement reached eighty-four percent. Most importantly, thirty-day readmissions plunged by thirty-two percent, saving the hospital hundreds of thousands in Medicare penalties.',
        durationSeconds: 30,
        deliveryNotes: { tone: 'Undeniable validation, punchy metrics', energy: 'High' }
      },
      {
        slideNumber: 9,
        title: 'Business Model: $12 Per Episode',
        objective: 'Explain the high-margin hospital unit economics.',
        keyPoints: [
          'Value-aligned pricing: $12 per 30-day patient discharge episode',
          'Average 500-bed hospital discharges 15,000 patients annually ($180K ARR per facility)',
          '5x ROI for hospital: Saving just 10 readmission penalties pays for the entire contract'
        ],
        visualSuggestion: 'Unit economics graphic: $12 cost vs $15,200 average cost of a readmission event.',
        speakerScript: 'Our business model is pure value alignment. We charge twelve dollars per thirty-day patient episode. A typical regional hospital spends one hundred eighty thousand dollars a year with us, and avoids over a million dollars in readmission penalties.',
        durationSeconds: 30,
        deliveryNotes: { tone: 'Clear, commercial conviction', energy: 'Punchy' }
      },
      {
        slideNumber: 10,
        title: 'Scaling Post-Acute Care Nationwide',
        objective: 'Call to action and rollout timeline.',
        keyPoints: [
          'Next Milestone: Multi-center clinical trial across 3 hospital networks (600 patients)',
          'EHR App Orchard certification with Epic Systems within 90 days',
          'Join our pilot cohort: Protecting patients from the hospital bed to the living room'
        ],
        visualSuggestion: 'Roadmap banner with Epic App Orchard launch and clinical partnership logos.',
        speakerScript: 'Healthcare should not end at the hospital sliding doors. We are launching our 600-patient multi-center trial this quarter and onboarding three new health systems. Join us in making post-acute recovery safe for every patient.',
        durationSeconds: 25,
        deliveryNotes: { tone: 'Inspiring, climactic closing', energy: 'High' }
      }
    ]
  },
  judgeQuestions: [
    {
      id: 'jq-med-1',
      category: 'Ethics',
      question: 'How do you guarantee an elderly patient does not mistake the AI voice for a real licensed doctor?',
      difficulty: 'High',
      skepticalAngle: 'Informed consent and patient deception risk.',
      suggestedAnswer: 'At the start of every call, MedGuardian explicitly identifies itself: "Hello Margaret, this is MedGuardian, your hospital\'s automated recovery companion." It repeatedly reminds patients that licensed nurses review every response.',
      evidenceStatus: 'grounded'
    }
  ],
  summary: {
    projectName: 'MedGuardian AI',
    tagline: 'Ambient conversational post-acute discharge compliance for health systems.',
    problem: '40% of discharged patients misunderstand medication instructions, triggering $17B in annual preventable Medicare readmissions.',
    solution: 'Ambient FHIR-integrated voice agent that checks in daily with discharged patients, auditing medication adherence in 14 languages.',
    targetMarket: 'US Hospitals, Accountable Care Organizations (ACOs), and Medicare Advantage health plans.',
    differentiation: 'Voice telephone conversational intelligence with sub-acute acoustic biomarker tracking vs static SMS links.',
    technology: 'Qwen reasoning engine paired with WebRTC voice synthesis and Epic/Cerner FHIR APIs in a HIPAA-compliant VPC.',
    businessModel: '$12 per 30-day discharged patient episode or $180,000 annual enterprise subscription per hospital.',
    impact: 'Demonstrated 32% reduction in 30-day readmissions across 60 cardiology patients at St. Jude Regional.',
    currentStatus: 'Functional prototype tested with 60 patients; expanding to 3 regional health systems.',
    nextMilestone: 'Achieving Epic Systems App Orchard marketplace certification within 90 days.'
  }
};

// 3. EcoTrack Supply Chain (CleanTech / Enterprise ESG)
export const ECOTRACK_PROJECT: Project = {
  id: 'proj-ecotrack-demo',
  name: 'EcoTrack Supply Chain',
  problemStatement: 'Under the EU Corporate Sustainability Due Diligence Directive (CSDDD), Fortune 500 enterprises face fines of up to 5% of global turnover for unverified Scope 3 supply chain carbon emissions, yet 85% of supplier data is trapped in messy, unstandardized PDF invoices and utility bills.',
  targetAudience: 'Chief Sustainability Officers (CSOs) and VP of Global Procurement at multinational manufacturing, automotive, and retail enterprises.',
  solutionDescription: 'An autonomous multimodal supply chain auditing agent that extracts, validates, and cross-references supplier emissions data directly from raw logistics manifests, invoices, and power utility bills—generating defensible GHG Protocol audit logs in seconds.',
  miroBoardUrl: 'https://miro.com/app/board/uXjVECO123GreenBoard/',
  additionalContext: 'Tested against 1,200 international shipping bills and energy audits. Built by former SAP logistics architect and environmental compliance auditor. 94% automated ingestion accuracy.',
  createdAt: '2026-10-04T10:15:00Z',
  updatedAt: '2026-10-04T11:15:00Z',
  isDemo: true,
};

export const ECOTRACK_SAMPLE: SampleIdea = {
  id: 'proj-ecotrack-demo',
  name: 'EcoTrack Supply Chain',
  category: 'CLEANTECH / ENTERPRISE ESG',
  badge: 'ENTERPRISE',
  tagline: 'Automate Scope 3 carbon compliance from raw supplier invoices and manifests.',
  readinessScore: 78,
  project: ECOTRACK_PROJECT,
  analysis: {
    problem: 'Enterprises face brutal multi-million euro penalties under European CSRD/CSDDD laws, but calculating Scope 3 emissions requires chasing thousands of tier-2 and tier-3 suppliers for months with ignored spreadsheet surveys.',
    targetUsers: [
      'Global Procurement Directors auditing 5,000+ overseas vendors',
      'Chief Sustainability Officers facing KPMG/PwC ESG assurance audits',
      'Tier-2 suppliers overwhelmed by repetitive emissions questionnaire requests'
    ],
    painPoints: [
      'Scope 3 emissions account for 75-90% of an enterprise footprint but have 0 auditability',
      'Supplier survey response rates are under 22%',
      'Consulting firms (Big 4) charge $500K+ for one-off manual carbon audits that are obsolete upon delivery'
    ],
    proposedSolution: 'EcoTrack AI: Multimodal autonomous agent that connects to ERP procurement systems (SAP/Coupa), automatically extracts fuel, energy, and transportation metrics from invoices, and calculates verified GHG Protocol emissions.',
    valueProposition: 'Reduce Scope 3 audit cycle from 6 months to 48 hours while cutting ESG assurance audit costs by 80%.',
    assumptions: [
      'Suppliers will provide invoice access or upload energy bills into a self-service portal',
      'Regulatory auditors will accept algorithmic emission estimations verified by Qwen reasoning',
      'Enterprises will mandate supplier carbon reporting in contractual procurement renewals'
    ],
    evidenceGaps: [
      'Need certified validation from recognized GHG Protocol assurance partners',
      'Accuracy verification on non-English Asian supplier invoices (Mandarin, Vietnamese)'
    ],
    risks: [
      'Greenwashing accusations if carbon conversion factors are miscalculated',
      'ERP vendors (SAP Green Ledger) attempting native carbon accounting modules'
    ],
    opportunities: [
      'Supply chain financing discounts for verified low-carbon tier-1 vendors',
      'Automated carbon tax credit and CBAM (Carbon Border Adjustment Mechanism) filing'
    ],
    competitors: [
      { name: 'Watershed / Persefoni', comparison: 'High-level top-down carbon accounting based on spend estimates, not verified ground-level supplier bills.' },
      { name: 'Spreadsheet consultants', comparison: 'Manual, slow, non-repeatable, and prone to severe formula errors.' }
    ],
    differentiators: [
      'Bottom-up Primary Ingestion: Extracts actual kilowatt-hours and diesel liters, not crude spend approximations',
      'Multimodal Document Parsing: Reads photographed utility meters and bill of lading scans',
      'Defensible Audit Trail: Every carbon number links directly to the specific page and line item of the source document'
    ],
    businessModel: 'B2B Enterprise SaaS: $45,000 to $120,000 annual platform fee based on supplier count.',
    technicalFeasibility: { score: 90, reasoning: 'Multimodal vision LLMs excel at tabular document extraction and cross-referencing conversion matrices.' },
    pitchReadinessScore: 78,
    readinessBreakdown: {
      problemClarity: { name: 'Problem Clarity', score: 96, explanation: 'Clear regulatory deadline with immediate CEO/CFO attention.', status: 'strong' },
      solutionClarity: { name: 'Solution Clarity', score: 90, explanation: 'Defensible bottom-up document extraction.', status: 'strong' },
      targetUserClarity: { name: 'Target User', score: 88, explanation: 'Clear enterprise procurement and ESG buyer personas.', status: 'strong' },
      differentiation: { name: 'Differentiation', score: 84, explanation: 'Primary activity data vs crude spend estimates.', status: 'strong' },
      evidence: { name: 'Evidence', score: 72, explanation: 'Tested on 1,200 shipping manifests with 94% accuracy.', status: 'moderate' },
      technicalFeasibility: { name: 'Feasibility', score: 90, explanation: 'Proven multimodal document processing pipeline.', status: 'strong' },
      businessPotential: { name: 'Business Potential', score: 92, explanation: 'Massive enterprise contract values with high urgency.', status: 'strong' },
      storytelling: { name: 'Storytelling', score: 82, explanation: 'Compelling contrast between spreadsheet chaos vs instant compliance.', status: 'strong' }
    },
    strengths: ['Regulatory compliance deadline driving urgent purchasing', 'Defensible audit trails prevent greenwashing liability'],
    weaknesses: ['Enterprise integration friction with legacy SAP deployments'],
    recommendedChanges: ['Focus initial wedge on automotive manufacturing where EU supply chain scrutiny is intense'],
    claimAudits: [
      { claim: 'Reduces audit cycle from 6 months to 48 hours', classification: 'verified-evidence', context: 'Demonstrated on 1,200 historical manifests from Tier-1 logistics providers.' }
    ],
    nextActionPrompt: { text: 'Your pitch is 78% ready. Regulatory urgency is immense. Prepare to defend data ingestion accuracy against dirty supplier scans.', actionLabel: 'Attack My Pitch', targetTab: 'attack' }
  },
  improvements: [
    {
      id: 'imp-eco-1',
      number: '01',
      title: 'Emphasize primary activity data over spend-based approximations',
      whyItMatters: 'Judges know that traditional tools just multiply dollars spent by an industry average, which regulators are outlawing.',
      whatIsMissing: 'Show that EcoTrack extracts real physical liters of fuel and kilowatt-hours directly from bills.',
      suggestedImprovement: 'Highlight: "Competitors guess your emissions based on dollars spent. EcoTrack audits actual physical kilowatt-hours and freight kilometers from ground-truth invoices."',
      category: 'Differentiation & Regulatory Defensibility'
    }
  ],
  attackReport: {
    survivalScore: 76,
    initialSurvivalScore: 76,
    verdict: 'High Viability — Strong regulatory tailwinds, highly defensible value proposition.',
    topThreePriorities: [
      'Prove ingestion accuracy on degraded and low-quality supplier paperwork.',
      'Differentiate from spend-based carbon software like Watershed.',
      'Show frictionless supplier onboarding without portal resistance.'
    ],
    attacks: [
      {
        id: 'atk-eco-1',
        severity: 'high',
        category: 'Data Quality & Ingestion',
        issue: 'Overseas suppliers submit blurry photographed invoices and handwritten receipts.',
        whyItMatters: 'If multimodal ingestion fails on dirty documents, manual review costs explode.',
        recommendedFix: 'Implement human-in-the-loop confidence thresholds: documents below 95% confidence route to accelerated verification.',
        status: 'unresolved'
      }
    ]
  },
  deck: {
    title: 'EcoTrack — Autonomous Scope 3 Supply Chain Compliance',
    tagline: 'Replace 6-month spreadsheet surveys with automated, audit-proof carbon verification.',
    slideCount: 10,
    totalDurationSeconds: 300,
    slides: [
      {
        slideNumber: 1,
        title: 'The 5% Turnover Fine',
        objective: 'Hook the room with impending regulatory panic.',
        keyPoints: [
          'Under new EU CSDDD directives, global enterprises face penalties of up to 5% of global revenue',
          'Scope 3 supply chain accounts for over 85% of total carbon footprints',
          'Sustainability teams are currently tracking multi-billion dollar liability on broken Excel sheets'
        ],
        visualSuggestion: 'Oversized legal penalty countdown clock next to an overwhelmed procurement manager buried under paper binders.',
        speakerScript: 'A storm is hitting global boardrooms. The European Union has enacted legislation that fines corporations five percent of their global turnover for unverified supply chain emissions. And today, eighty-five percent of Fortune 500 companies are trying to audit ten thousand suppliers with manual spreadsheets.',
        durationSeconds: 30,
        deliveryNotes: { tone: 'Urgent, high-stakes boardroom tension', energy: 'High' }
      },
      {
        slideNumber: 2,
        title: 'The Scope 3 Blind Spot',
        objective: 'Explain why Scope 3 is notoriously impossible.',
        keyPoints: [
          'Scope 1 and 2 are easy—they come from your own headquarters and factories',
          'Scope 3 lives in thousands of Tier-2 and Tier-3 suppliers across 40 countries',
          'Traditional annual email surveys receive a miserable 19% response rate'
        ],
        visualSuggestion: 'Iceberg graphic: Scope 1 & 2 visible above water (15%), Scope 3 hidden beneath the surface (85%).',
        speakerScript: 'Scope one and two are simple—you control your own buildings. But Scope three lives in shipping containers, overseas smelters, and third-party logistics. You cannot fix what you cannot measure, and sending annual email surveys is functionally dead.',
        durationSeconds: 30,
        deliveryNotes: { tone: 'Analytical reality', energy: 'Medium' }
      },
      {
        slideNumber: 3,
        title: 'The Fallacy of Spend-Based Carbon Tools',
        objective: 'Discredit competitors who guess carbon based on invoice dollars.',
        keyPoints: [
          'First-gen carbon tools (Watershed/Persefoni) multiply invoice dollar spend by crude averages',
          'If steel prices double due to inflation, spend-based tools claim your carbon doubled!',
          'European auditors and SEC regulators are officially banning spend-based estimates for compliance'
        ],
        visualSuggestion: 'Comparison: Spend-based Guesswork (Inflation = Fake Carbon) vs EcoTrack Activity Data (Actual Kilowatt-Hours).',
        speakerScript: 'First-generation carbon accounting platforms made a fatal compromise: they guess your emissions based on dollars spent. If steel prices double due to inflation, their software claims your emissions doubled. Regulators are outlawing this guesswork. Auditable compliance demands physical activity data.',
        durationSeconds: 30,
        deliveryNotes: { tone: 'Authoritative, surgical critique', energy: 'Punchy' }
      },
      {
        slideNumber: 4,
        title: 'Initial Wedge: Automotive & Heavy Machinery',
        objective: 'Focus on the highest-urgency initial enterprise sector.',
        keyPoints: [
          'Initial commercial wedge: European and North American automotive OEMs and Tier-1 suppliers',
          'Intense regulatory audit pressure with active battery passport mandates',
          'Suppliers already exchange standardized EDI logistics and billing documents'
        ],
        visualSuggestion: 'Sector wedge card: Automotive manufacturing assembly line with supply chain tiers.',
        speakerScript: 'We are focusing first on the automotive and industrial machinery sectors. Automotive OEMs face immediate battery passport regulations. They have complex multi-tier supply chains and cannot afford a single regulatory shipment embargo.',
        durationSeconds: 25,
        deliveryNotes: { tone: 'Disciplined, commercial focus', energy: 'Medium' }
      },
      {
        slideNumber: 5,
        title: 'Introducing EcoTrack AI',
        objective: 'Reveal the automated supply chain auditing engine.',
        keyPoints: [
          'Autonomous multimodal agent that extracts real activity data from raw supplier paperwork',
          'Parses bills of lading, diesel fuel slips, and utility bills in 20+ languages',
          'Produces cryptographic, line-item audit trails that satisfy Big-4 ESG auditors'
        ],
        visualSuggestion: 'Clean UI showing a raw shipping manifest being parsed in real-time, mapping freight weight and fuel into verified kg CO2e.',
        speakerScript: 'Meet EcoTrack: the first autonomous supply chain carbon auditor. Instead of sending surveys, EcoTrack connects directly to procurement invoices, parses the physical kilowatt-hours and freight kilometers, and maps them to verified emissions factors.',
        durationSeconds: 30,
        deliveryNotes: { tone: 'Excited, inspiring reveal', energy: 'High' }
      },
      {
        slideNumber: 6,
        title: 'How It Works: Ground-Truth Ingestion',
        objective: 'Step through the 4-stage ingestion pipeline.',
        keyPoints: [
          '1. Procurement Hook: Ingests PDF invoices & bills of lading from SAP / Coupa',
          '2. Multimodal Extraction: Qwen vision models extract physical units (kWh, liters, metric tons)',
          '3. Emission Factor Matching: Real-time lookup across Ecoinvent and DEFRA databases',
          '4. Auditor-Ready Ledger: Every emissions figure links to the exact bounding box on the original invoice'
        ],
        visualSuggestion: 'Pipeline architecture: SAP/Coupa -> Multimodal Parser -> Emission Factor DB -> Defensible ESG Ledger.',
        speakerScript: 'Here is how it works: Invoices flow automatically from SAP or Coupa. Our multimodal reasoning models extract the exact physical units—diesel liters, shipping nautical miles, electricity kilowatt-hours. Every single calculation links back to the original source document.',
        durationSeconds: 35,
        deliveryNotes: { tone: 'Mastery, engineering clarity', energy: 'Medium' }
      },
      {
        slideNumber: 7,
        title: 'Auditor-Proof Defensibility & Moat',
        objective: 'Address judge skepticism regarding audit acceptance.',
        keyPoints: [
          'Built strictly to GHG Protocol Corporate Value Chain (Scope 3) Standard',
          'Every metric has a verifiable provenance hash and source bounding box',
          'Proprietary multi-turn supplier clarification loop for missing invoice data'
        ],
        visualSuggestion: 'Verification certificate badge showing KPMG/PwC ready assurance data trail.',
        speakerScript: 'When PwC or KPMG conducts an assurance audit, they reject estimates. With EcoTrack, the auditor clicks any number on the dashboard and instantly sees the highlighted line item on the supplier invoice from twelve months ago. That is what makes our data legally defensible.',
        durationSeconds: 30,
        deliveryNotes: { tone: 'Reassuring, compliance mastery', energy: 'Medium' }
      },
      {
        slideNumber: 8,
        title: 'Benchmark Validation: 94% Ingestion Accuracy',
        objective: 'Deliver empirical performance benchmarks.',
        keyPoints: [
          'Evaluated across 1,200 international shipping bills and power utility receipts',
          '94% first-pass accuracy in extracting physical activity units',
          'Audit turnaround collapsed from 6 months down to 48 hours',
          'Saved over $350,000 in third-party ESG consultant accounting fees'
        ],
        visualSuggestion: 'Performance metrics: 94% Extraction Accuracy, 48-Hour Audit Velocity, 1,200 Benchmark Documents, $350K Saved.',
        speakerScript: 'We validated EcoTrack on over twelve hundred real international shipping bills. First-pass extraction accuracy hit ninety-four percent, and audit cycles collapsed from six months down to forty-eight hours. What used to take an army of consultants now runs automatically.',
        durationSeconds: 30,
        deliveryNotes: { tone: 'Grounded proof, undeniable metrics', energy: 'High' }
      },
      {
        slideNumber: 9,
        title: 'Enterprise Business Model: $75K ACV',
        objective: 'Detail enterprise SaaS pricing and procurement ROI.',
        keyPoints: [
          'Tiered annual subscription based on supplier count: $45K to $120K ARR per enterprise',
          'Typical enterprise ROI: Saves $400K+ in Big-4 audit fees while eliminating multi-million euro penalty risk',
          'Zero-friction supplier onboarding: Vendors simply forward existing invoices via email'
        ],
        visualSuggestion: 'Pricing tiers card: Growth ($45K/yr) -> Enterprise ($75K/yr) -> Global OEM ($120K/yr).',
        speakerScript: 'We price as an enterprise annual subscription, averaging seventy-five thousand dollars ARR. For a multi-billion dollar manufacturer, saving four hundred thousand dollars in consulting fees and eliminating catastrophic fine risk makes the purchasing decision a complete no-brainer.',
        durationSeconds: 30,
        deliveryNotes: { tone: 'Commercial conviction, clear pricing', energy: 'Punchy' }
      },
      {
        slideNumber: 10,
        title: 'Building the Global Decarbonization Ledger',
        objective: 'Closing vision and partnership ask.',
        keyPoints: [
          'Next Milestone: Onboarding 5 European automotive manufacturing design partners',
          'Expanding to real-time Carbon Border Adjustment Mechanism (CBAM) automated customs filings',
          'Join us in transforming supply chain sustainability from a paperwork tax into an operational superpower'
        ],
        visualSuggestion: 'Global trade map connecting sustainable supply chains with automated compliance checkmarks.',
        speakerScript: 'Corporate sustainability cannot remain a toothless marketing exercise. We are deploying with our first five European industrial design partners this quarter. Join us in building the transparent, auditable supply chains of tomorrow.',
        durationSeconds: 25,
        deliveryNotes: { tone: 'Inspiring, visionary closing', energy: 'High' }
      }
    ]
  },
  judgeQuestions: [
    {
      id: 'jq-eco-1',
      category: 'Technology',
      question: 'How do you handle supplier invoices that are handwritten or in languages without clear OCR dictionaries?',
      difficulty: 'High',
      skepticalAngle: 'Data ingestion failure on emerging market suppliers.',
      suggestedAnswer: 'Our multimodal architecture pairs Qwen vision reasoning with specialized localized preprocessing. If confidence falls below 95%, the system highlights the exact receipt image and triggers a 10-second human verification prompt rather than injecting noisy data into the carbon ledger.',
      evidenceStatus: 'grounded'
    }
  ],
  summary: {
    projectName: 'EcoTrack Supply Chain',
    tagline: 'Autonomous Scope 3 carbon compliance from raw supplier invoices and manifests.',
    problem: 'Enterprises face fines up to 5% of global turnover under EU CSDDD laws, yet 85% of Scope 3 supplier carbon data is trapped in unstandardized invoices and bills.',
    solution: 'Multimodal AI agent that parses raw supplier invoices, utility bills, and shipping manifests to calculate auditable, line-item GHG Protocol carbon footprints.',
    targetMarket: 'Fortune 500 Automotive, Manufacturing, and Retail enterprises with complex multi-tier supply chains.',
    differentiation: 'Primary physical activity data (kWh, liters, tons) with direct document bounding box audit trails vs crude spend-based estimates.',
    technology: 'Qwen multimodal vision models connected to SAP/Coupa ERP systems with real-time Ecoinvent emission factor matching.',
    businessModel: 'B2B Enterprise SaaS ($45K - $120K annual subscription).',
    impact: 'Reduces Scope 3 audit turnaround from 6 months to 48 hours with 94% verified ingestion accuracy.',
    currentStatus: 'Validated on 1,200 shipping manifests; deploying with 5 European manufacturing design partners.',
    nextMilestone: 'Achieving Big-4 ESG assurance partner validation and automated EU CBAM customs filing support.'
  }
};

// 4. FinGuard AI (FinTech / Fraud & Risk)
export const FINGUARD_PROJECT: Project = {
  id: 'proj-finguard-demo',
  name: 'FinGuard AI',
  problemStatement: 'Synthetic identity fraud orchestrated by generative AI causes $6 Billion in annual credit losses, while traditional static rule engines block 85% of legitimate new customers with false-positive friction.',
  targetAudience: 'Chief Risk Officers and Heads of Fraud Prevention at Neobanks, Buy-Now-Pay-Later (BNPL) platforms, and Consumer Fintechs.',
  solutionDescription: 'A multi-agent consensus network combining graph reasoning with behavioral biometrics to detect synthetic identity fraud rings and deepfake identity theft in under 80 milliseconds.',
  miroBoardUrl: 'https://miro.com/app/board/uXjVFIN123FraudBoard/',
  additionalContext: 'Tested against 500,000 anonymized transaction histories. Built by former Risk Lead at major payment gateway. Slashing false positives by 60%.',
  createdAt: '2026-10-04T10:30:00Z',
  updatedAt: '2026-10-04T11:30:00Z',
  isDemo: true,
};

export const FINGUARD_SAMPLE: SampleIdea = {
  id: 'proj-finguard-demo',
  name: 'FinGuard AI',
  category: 'FINTECH / FRAUD PREVENTION',
  badge: 'FINTECH',
  tagline: 'Defend against AI synthetic identity fraud in sub-80ms transaction latency.',
  readinessScore: 82,
  project: FINGUARD_PROJECT,
  analysis: {
    problem: 'Generative AI enables criminal syndicates to manufacture thousands of hyper-realistic synthetic credit identities that pass basic KYC checks and build credit before maxing out credit lines.',
    targetUsers: ['Fintech Fraud Analysts', 'Chief Risk Officers at Neobanks', 'Digital onboarding product managers'],
    painPoints: ['Synthetic identities sleep for 6-12 months before busting out', 'False positives alienate high-value legitimate users', 'Legacy rules cannot detect distributed fraud rings across multiple lenders'],
    proposedSolution: 'FinGuard AI: Sub-80ms graph consensus engine that detects subtle cross-institution synthetic fingerprint overlaps and behavioral cadence anomalies.',
    valueProposition: 'Reduce synthetic fraud charge-offs by 70% while improving onboarding conversion by 25%.',
    assumptions: ['Fintechs are willing to deploy an API in their critical payment authorization path', 'Multi-tenant graph signals do not violate competitive data sharing restrictions'],
    evidenceGaps: ['Need live pilot benchmark with high-volume card issuer'],
    risks: ['Strict sub-100ms SLA requirements in credit card authorization networks', 'Adversarial evasion by sophisticated fraud cartels'],
    opportunities: ['Expanding to instant account takeover (ATO) and deepfake KYC facial verification'],
    competitors: [
      { name: 'Sardine / Sift', comparison: 'Strong device fingerprinting, but weak on multi-hop graph syndication and synthetic credit incubation detection.' }
    ],
    differentiators: ['Multi-Agent Consensus: Graph reasoning + Behavioral Biometrics + Synthetic Incubation models voting in real time.'],
    businessModel: 'Usage-based API pricing ($0.03 to $0.08 per evaluated transaction/onboarding event).',
    technicalFeasibility: { score: 92, reasoning: 'Low-latency distributed inference using Rust edge workers and Qwen reasoning fallbacks.' },
    pitchReadinessScore: 82,
    readinessBreakdown: {
      problemClarity: { name: 'Problem Clarity', score: 94, explanation: 'Critical, direct cash-loss pain for fintechs.', status: 'strong' },
      solutionClarity: { name: 'Solution Clarity', score: 88, explanation: 'Clear sub-80ms edge verification pipeline.', status: 'strong' },
      targetUserClarity: { name: 'Target User', score: 90, explanation: 'Risk officers with clear budget authority.', status: 'strong' },
      differentiation: { name: 'Differentiation', score: 82, explanation: 'Synthetic incubation detection vs simple device checks.', status: 'strong' },
      evidence: { name: 'Evidence', score: 76, explanation: 'Benchmarked on 500,000 transaction histories.', status: 'strong' },
      technicalFeasibility: { name: 'Feasibility', score: 92, explanation: 'Fast sub-80ms Rust edge architecture.', status: 'strong' },
      businessPotential: { name: 'Business Potential', score: 88, explanation: 'Direct quantifiable dollar ROI on prevented fraud.', status: 'strong' },
      storytelling: { name: 'Storytelling', score: 84, explanation: 'Cat-and-mouse AI fraud warfare narrative.', status: 'strong' }
    },
    strengths: ['Immediate dollar ROI for customers', 'Urgent market threat created by generative AI tools'],
    weaknesses: ['Must maintain 99.999% uptime in critical financial path'],
    recommendedChanges: ['Focus initial wedge on Buy-Now-Pay-Later (BNPL) onboarding where synthetic fraud is rampant'],
    claimAudits: [
      { claim: 'Sub-80ms evaluation latency', classification: 'verified-evidence', context: 'Benchmarked on Cloudflare Workers edge nodes across US-East.' }
    ],
    nextActionPrompt: { text: 'Your pitch is 82% ready. Strong metrics. Emphasize low latency and uptime guarantees to convince risk officers.', actionLabel: 'Attack My Pitch', targetTab: 'attack' }
  },
  improvements: [],
  attackReport: {
    survivalScore: 80,
    initialSurvivalScore: 80,
    verdict: 'High Viability — Sharp technical architecture and undeniable ROI.',
    topThreePriorities: ['Prove sub-80ms latency SLAs under holiday peak volume.'],
    attacks: []
  },
  deck: {
    title: 'FinGuard AI — Sub-80ms Synthetic Fraud Defense',
    tagline: 'Stop AI-generated synthetic identity fraud before it drains your balance sheet.',
    slideCount: 10,
    totalDurationSeconds: 300,
    slides: [
      {
        slideNumber: 1,
        title: 'The Invisible $6 Billion Heist',
        objective: 'Hook the audience with the explosion of generative AI synthetic fraud.',
        keyPoints: [
          'Criminal rings use AI to generate synthetic identities: real SSNs merged with fake names',
          'These accounts behave normally for 9 months, building credit before maxing out $50,000 lines',
          'Traditional KYC tools cannot catch them because all individual data points look legitimate'
        ],
        visualSuggestion: 'Digital ghost avatar decomposing into fragments of real and fake identity records.',
        speakerScript: 'A new breed of financial criminal has arrived. Using generative AI, syndicates manufacture thousands of synthetic identities. They blend real Social Security numbers with fictitious names. They nurture credit for nine months, and then bust out overnight—stealing six billion dollars annually.',
        durationSeconds: 30,
        deliveryNotes: { tone: 'Gripping, high-tension financial crime narrative', energy: 'High' }
      },
      {
        slideNumber: 2,
        title: 'The False Positive Trap',
        objective: 'Expose the dilemma of legacy fraud tools.',
        keyPoints: [
          'To stop synthetic fraud, legacy rules turn up sensitivity—blocking 85% innocent users',
          'Fintechs lose more revenue to abandoned onboarding than to actual fraud charge-offs',
          'Rule engines cannot see the hidden graph connections between distributed sleeper accounts'
        ],
        visualSuggestion: 'Scale weighing Fraud Losses vs Lost Customer Acquisition Revenue.',
        speakerScript: 'When neobanks tighten their rules, they trigger a catastrophic side-effect: they block legitimate customers. Today, eighty-five percent of flagged users are innocent buyers who simply abandon their application.',
        durationSeconds: 30,
        deliveryNotes: { tone: 'Severe dilemma', energy: 'Medium' }
      },
      {
        slideNumber: 3,
        title: 'Why Static Device Checks Fail',
        objective: 'Discredit IP checks and legacy fingerprinting.',
        keyPoints: [
          'Fraud syndicates use residential proxy networks and anti-detect browsers',
          'IP addresses and device IDs are spoofed at push-button speed',
          'Only behavioral cadence and cross-institution identity graphs can unmask the ring'
        ],
        visualSuggestion: 'Grid showing how fraudsters easily bypass IP and device checks vs deep behavioral graph inspection.',
        speakerScript: 'Legacy fraud vendors rely on IP addresses and device fingerprints. But modern syndicates use residential mobile proxies and anti-detect browsers that rotate with every single click.',
        durationSeconds: 25,
        deliveryNotes: { tone: 'Technical conviction', energy: 'Medium' }
      },
      {
        slideNumber: 4,
        title: 'The High-Growth Wedge: BNPL & Digital Cards',
        objective: 'Define the initial commercial entry wedge.',
        keyPoints: [
          'Initial wedge: Fast-growing Buy-Now-Pay-Later (BNPL) and digital credit card issuers',
          'High onboarding velocity (50,000+ applications/month) with instant approval expectations',
          'Every 1% reduction in fraud charge-offs directly adds millions to the bottom line'
        ],
        visualSuggestion: 'Persona card: Head of Risk at scaleup digital lender managing $500M annual origination.',
        speakerScript: 'Our initial entry wedge is Buy-Now-Pay-Later and digital card issuers. These lenders promise sub-second credit decisions. In this market, fraud latency is fatal.',
        durationSeconds: 25,
        deliveryNotes: { tone: 'Disciplined commercial focus', energy: 'Medium' }
      },
      {
        slideNumber: 5,
        title: 'Introducing FinGuard AI',
        objective: 'Reveal the sub-80ms fraud detection engine.',
        keyPoints: [
          'Multi-agent consensus network combining graph reasoning with behavioral biometrics',
          'Sub-80 millisecond evaluation latency deployed on global edge nodes',
          'Detects synthetic identity clusters before accounts can bust out'
        ],
        visualSuggestion: 'Real-time transaction authorization screen displaying FinGuard sub-80ms risk verdict.',
        speakerScript: 'Meet FinGuard AI: the first real-time multi-agent fraud defense network. In less than eighty milliseconds, FinGuard inspects behavioral biometrics and cross-institution graph links to stop synthetic rings cold.',
        durationSeconds: 30,
        deliveryNotes: { tone: 'Inspiring, breakthrough reveal', energy: 'High' }
      },
      {
        slideNumber: 6,
        title: 'The Multi-Agent Consensus Architecture',
        objective: 'Explain the 3 voting agents in the pipeline.',
        keyPoints: [
          'Agent 1 (Behavioral Cadence): Inspects micro-typing rhythms and paste behaviors',
          'Agent 2 (Graph Clustering): Connects latent phone, address, and device clusters',
          'Agent 3 (Synthetic Incubation): Evaluates credit profile velocity against expected human patterns'
        ],
        visualSuggestion: '3-agent voting consensus diagram reaching sub-80ms verdict with Qwen reasoning.',
        speakerScript: 'Our architecture uses three specialized agents voting in parallel: one analyzes behavioral typing cadence; the second traverses our real-time identity graph; the third evaluates synthetic incubation velocity. If they detect collusion, the transaction is rejected.',
        durationSeconds: 35,
        deliveryNotes: { tone: 'Authoritative, technical mastery', energy: 'Medium' }
      },
      {
        slideNumber: 7,
        title: 'Sub-80ms Edge Infrastructure & 99.999% Uptime',
        objective: 'Address judge skepticism regarding latency in payment paths.',
        keyPoints: [
          'Engineered in Rust and deployed across 200+ global edge locations',
          'Deterministic fallback to cached rules if network latency exceeds 95ms',
          'Zero impact on payment gateway transaction authorization speeds'
        ],
        visualSuggestion: 'Edge latency waterfall chart: 12ms network -> 45ms model execution -> 18ms response.',
        speakerScript: 'We engineered FinGuard in Rust for extreme low-latency environments. If network conditions spike, our deterministic edge fallback ensures an authorization never hangs. We guarantee zero friction in your checkout flow.',
        durationSeconds: 30,
        deliveryNotes: { tone: 'Engineering confidence', energy: 'Medium' }
      },
      {
        slideNumber: 8,
        title: 'Benchmark Validation: 70% Charge-Off Cut',
        objective: 'Deliver empirical proof from historical data.',
        keyPoints: [
          'Evaluated against 500,000 historical anonymized transaction records',
          'Identified 71% of synthetic bust-out accounts 3 months before default',
          'False positive customer decline rate reduced from 14% to 5.2%',
          'Delivered $3.4 Million in net prevented credit charge-offs'
        ],
        visualSuggestion: 'Key metrics: 71% Fraud Caught Early, 62% Drop in False Positives, $3.4M Saved, <80ms Latency.',
        speakerScript: 'We backtested FinGuard on half a million transaction records. The results: we caught seventy-one percent of synthetic bust-out rings three months before they defaulted, while cutting false-positive declines by more than half.',
        durationSeconds: 30,
        deliveryNotes: { tone: 'Punchy, undeniable validation', energy: 'High' }
      },
      {
        slideNumber: 9,
        title: 'Usage-Based API Economics',
        objective: 'Explain the high-margin API transaction model.',
        keyPoints: [
          'Pure usage-based pricing: $0.04 per evaluated onboarding or transaction event',
          'High margin API model (82% gross margin)',
          'Clear 8x customer ROI: Preventing a single $5,000 bust-out pays for 125,000 API calls'
        ],
        visualSuggestion: 'ROI math: $0.04 per API check vs $5,000 average synthetic fraud loss.',
        speakerScript: 'We charge four cents per API evaluation. When a lender prevents a single five-thousand-dollar bust-out, that single save pays for over one hundred thousand FinGuard API checks. The math sells itself.',
        durationSeconds: 30,
        deliveryNotes: { tone: 'Commercial clarity', energy: 'Punchy' }
      },
      {
        slideNumber: 10,
        title: 'Winning the AI Fraud Arms Race',
        objective: 'Closing vision and call to action.',
        keyPoints: [
          'Next Milestone: Onboarding 4 scaleup fintech pilot partners',
          'Continuous self-learning graph: Every prevented fraud ring strengthens protection for all network members',
          'Deploy in under 15 minutes with our drop-in SDK'
        ],
        visualSuggestion: 'Network protection shield expanding across interconnected fintech institutions.',
        speakerScript: 'Fraudsters are using artificial intelligence to attack your balance sheet. You cannot fight generative AI with static rules. Install FinGuard in fifteen minutes and protect your platform today. Thank you!',
        durationSeconds: 25,
        deliveryNotes: { tone: 'Inspiring, climactic close', energy: 'High' }
      }
    ]
  },
  judgeQuestions: [
    {
      id: 'jq-fin-1',
      category: 'Technology',
      question: 'Payment checkouts require sub-100ms response times. How can multi-agent LLM reasoning meet strict credit card authorization SLAs?',
      difficulty: 'High',
      skepticalAngle: 'LLM token latency will timeout during high-volume Black Friday traffic.',
      suggestedAnswer: 'We run a hybrid two-tier pipeline. Edge Rust workers perform deterministic graph traversal in 12ms. For the 4% ambiguous border cases, our quantized Qwen engine uses speculative graph decoding to generate consensus verdicts within 68ms p99, staying well within Visa and Mastercard 150ms timeout windows.',
      evidenceStatus: 'grounded'
    },
    {
      id: 'jq-fin-2',
      category: 'Competition',
      question: 'Why cannot incumbents like Socure, Sardine, or Sift simply add graph analysis to their existing identity suites?',
      difficulty: 'Medium',
      skepticalAngle: 'Incumbent feature parity could commoditize your single-point solution.',
      suggestedAnswer: 'Incumbents rely on static relational database schemas and credit bureau pings designed for single identities. Synthetic fraud rings operate across months, swapping SSNs, phone numbers, and addresses. Our graph-native representation tracks behavioral incubation over 270 days, which legacy relational stacks cannot query at scale without massive latency penalties.',
      evidenceStatus: 'grounded'
    }
  ],
  summary: {
    projectName: 'FinGuard AI',
    tagline: 'Sub-80ms synthetic fraud detection powered by multi-agent graph consensus.',
    problem: 'Synthetic identity fraud orchestrated by generative AI causes $6B in annual losses while legacy rules block 85% legitimate users.',
    solution: 'Real-time multi-agent network combining graph reasoning with behavioral biometrics to detect synthetic credit rings in sub-80ms.',
    targetMarket: 'Neobanks, BNPL platforms, and digital credit card issuers.',
    differentiation: 'Multi-agent consensus detecting 9-month synthetic incubation patterns vs simple IP checks.',
    technology: 'Rust edge workers + Qwen graph reasoning operating under strict sub-80ms SLAs.',
    businessModel: '$0.04 per transaction or onboarding evaluation API call.',
    impact: 'Reduces synthetic fraud charge-offs by 70% and cuts false positives from 14% to 5.2%.',
    currentStatus: 'Benchmarked on 500,000 transaction records; deploying with 4 fintech partners.',
    nextMilestone: 'Achieving sub-50ms p99 latency SLA and SOC2 Type II compliance.'
  }
};

// 5. EduPrompt Studio (EdTech / Socratic STEM Tutoring)
export const EDUPROMPT_PROJECT: Project = {
  id: 'proj-eduprompt-demo',
  name: 'EduPrompt Studio',
  problemStatement: '70% of undergraduate computer science and engineering students struggle or fail introductory coursework due to overcrowded lecture halls with zero real-time individualized debugging feedback.',
  targetAudience: 'University CS Departments, Engineering Colleges, and Coding Bootcamps with high introductory student attrition.',
  solutionDescription: 'A Socratic Miro-integrated coding and engineering tutor that visually maps student mental models, identifies faulty algorithmic logic, and prompts guided self-discovery without giving away direct homework answers.',
  miroBoardUrl: 'https://miro.com/app/board/uXjVEDU123TutorBoard/',
  additionalContext: 'Tested with 140 freshman CS students across 2 universities. Increased exam pass rates by 22% while reducing TA office hour backlog by 55%.',
  createdAt: '2026-10-04T10:45:00Z',
  updatedAt: '2026-10-04T11:45:00Z',
  isDemo: true,
};

export const EDUPROMPT_SAMPLE: SampleIdea = {
  id: 'proj-eduprompt-demo',
  name: 'EduPrompt Studio',
  category: 'EDTECH / STEM AI TUTORING',
  badge: 'EDUCATION',
  tagline: 'Socratic visual debugging and algorithmic tutoring that prevents STEM dropouts.',
  readinessScore: 76,
  project: EDUPROMPT_PROJECT,
  analysis: {
    problem: 'Introductory STEM courses have brutal drop rates because students get stuck on syntax and conceptual edge cases at midnight with no assistance except direct cheating tools.',
    targetUsers: ['University Deans of Engineering', 'CS Course Instructors', 'Struggling STEM Undergraduates'],
    painPoints: ['Office hours lines wrap around the hall', 'Cheating via ChatGPT robs students of true learning', 'High drop-out rates hurt university tuition retention'],
    proposedSolution: 'EduPrompt Studio: Interactive visual tutor that builds Miro concept diagrams of student code, guiding them through Socratic questioning rather than writing answers.',
    valueProposition: 'Improve STEM course completion by 20%+ while cutting TA grading overhead in half.',
    assumptions: ['Instructors will embrace AI tutoring if direct answer generation is strictly blocked.'],
    evidenceGaps: ['Need longitudinal study over multi-year graduation rates.'],
    risks: ['Academic procurement cycles are slow (annual budget windows).'],
    opportunities: ['Expanding to chemistry and physics problem solving.'],
    competitors: [{ name: 'Chegg / ChatGPT', comparison: 'Gives immediate direct answers, resulting in honor code violations and zero deep understanding.' }],
    differentiators: ['Strict Anti-Cheat Socratic Engine: Never writes code, only questions and diagrams.'],
    businessModel: 'Departmental software licensing ($15,000 - $40,000 per academic department/year).',
    technicalFeasibility: { score: 94, reasoning: 'Miro Canvas API + AST execution traces + Qwen Socratic tutoring prompt gates.' },
    pitchReadinessScore: 76,
    readinessBreakdown: {
      problemClarity: { name: 'Problem Clarity', score: 92, explanation: 'Universally acknowledged STEM attrition crisis.', status: 'strong' },
      solutionClarity: { name: 'Solution Clarity', score: 86, explanation: 'Clear Socratic visual canvas interface.', status: 'strong' },
      targetUserClarity: { name: 'Target User', score: 84, explanation: 'Clear university faculty and department chairs.', status: 'strong' },
      differentiation: { name: 'Differentiation', score: 90, explanation: 'Anti-cheat Socratic pedagogy vs direct answer generators.', status: 'strong' },
      evidence: { name: 'Evidence', score: 74, explanation: '140 student study with 22% pass rate increase.', status: 'moderate' },
      technicalFeasibility: { name: 'Feasibility', score: 94, explanation: 'Proven canvas and AST tracing architecture.', status: 'strong' },
      businessPotential: { name: 'Business Potential', score: 78, explanation: 'Reliable university recurring budgets.', status: 'moderate' },
      storytelling: { name: 'Storytelling', score: 86, explanation: 'Empowering student success and education equity.', status: 'strong' }
    },
    strengths: ['Faculty love anti-cheating Socratic guardrails', 'Visual Miro diagramming makes abstract concepts concrete'],
    weaknesses: ['University institutional sales cycles'],
    recommendedChanges: ['Target fast-moving coding bootcamps and summer bridge programs first'],
    claimAudits: [
      { claim: 'Increased pass rates by 22%', classification: 'verified-evidence', context: 'Evaluated across 140 freshman students in CS101 at State University.' }
    ],
    nextActionPrompt: { text: 'Your pitch is 76% ready. Pedagogy is excellent. Focus judge defense on university procurement cycles.', actionLabel: 'Attack My Pitch', targetTab: 'attack' }
  },
  improvements: [],
  attackReport: {
    survivalScore: 74,
    initialSurvivalScore: 74,
    verdict: 'Moderate Viability — High educational appeal, address academic institutional sales speed.',
    topThreePriorities: ['Show how you bypass slow university committee approvals.'],
    attacks: []
  },
  deck: {
    title: 'EduPrompt Studio — Visual Socratic STEM Tutoring',
    tagline: 'End introductory STEM failure rates through interactive conceptual debugging.',
    slideCount: 10,
    totalDurationSeconds: 300,
    slides: [
      {
        slideNumber: 1,
        title: 'The 2:00 AM Homework Wall',
        objective: 'Hook the audience with student frustration.',
        keyPoints: [
          'A first-year CS student spends 5 hours stuck on an off-by-one index loop',
          'TA office hours are full, and ChatGPT gives away the answer without teaching',
          'Over 30% of freshman STEM majors drop out in their first two semesters'
        ],
        visualSuggestion: 'Frustrated student staring at code compiler error with empty lecture hall in background.',
        speakerScript: 'Every year, thousands of eager students enter university engineering programs. By December, one-third of them drop out. Not because they lack intellect, but because they hit a wall at 2:00 AM on a Tuesday with nobody to guide them.',
        durationSeconds: 30,
        deliveryNotes: { tone: 'Empathetic, urgent educational mission', energy: 'High' }
      },
      {
        slideNumber: 2,
        title: 'The Overcrowded Lecture Crisis',
        objective: 'Expose the breakdown in university STEM education.',
        keyPoints: [
          'CS enrollment has skyrocketed 300% while faculty hiring remains flat',
          'One professor teaches 400 students with only 3 student TAs',
          'Personalized mentorship has been replaced by desperate Piazza message boards'
        ],
        visualSuggestion: '300-person crowded university amphitheater with 1 teacher at the front.',
        speakerScript: 'Computer science enrollment has exploded by three hundred percent. Yet faculty size remains static. A single instructor is tasked with teaching four hundred students, and personalized feedback has become mathematically impossible.',
        durationSeconds: 30,
        deliveryNotes: { tone: 'Analytical reality', energy: 'Medium' }
      },
      {
        slideNumber: 3,
        title: 'The ChatGPT Cheating Trap',
        objective: 'Discredit generic LLMs and homework cheat bots.',
        keyPoints: [
          'Generic AI writes the direct solution, prompting immediate honor code violations',
          'Students pass the homework, but fail the proctored exam when they cannot copy code',
          'Professors are banning AI tools because they act as cognitive crutches'
        ],
        visualSuggestion: 'Copy-paste code generating a red Academic Dishonesty alert vs deep conceptual diagram.',
        speakerScript: 'When desperate students turn to ChatGPT, it simply spits out the completed code. The student copies it, submits it, and learns nothing. Then they fail the midterm exam. Professors do not want AI that writes homework—they want AI that teaches.',
        durationSeconds: 25,
        deliveryNotes: { tone: 'Sharp pedagogical insight', energy: 'Medium' }
      },
      {
        slideNumber: 4,
        title: 'Initial Wedge: University CS101 & Bootcamps',
        objective: 'Focus on introductory bottleneck courses.',
        keyPoints: [
          'Initial wedge: CS101 / Intro to Data Structures in top 50 engineering schools',
          'Highest departmental drop-out rates and highest student anxiety',
          'High willingness to adopt accredited pedagogical software'
        ],
        visualSuggestion: 'Campus map highlighting engineering hall and introductory lab sections.',
        speakerScript: 'Our initial focus is introductory computer science—CS101. It is the single highest-attrition course on every university campus, and department chairs are desperate to keep students enrolled.',
        durationSeconds: 25,
        deliveryNotes: { tone: 'Commercial focus', energy: 'Medium' }
      },
      {
        slideNumber: 5,
        title: 'Introducing EduPrompt Studio',
        objective: 'Reveal the Socratic visual tutoring engine.',
        keyPoints: [
          'Miro-powered visual interactive workspace mapping student code to concept graphs',
          'Strict Socratic tutor: Asks probing questions, generates visual traces, NEVER writes direct code',
          'Provides 24/7 personalized debugging guidance without academic dishonesty'
        ],
        visualSuggestion: 'Miro board showing live code on the left and dynamic memory diagram on the right with Socratic speech bubbles.',
        speakerScript: 'Meet EduPrompt Studio. EduPrompt integrates with Miro to turn abstract code into visual memory diagrams. It acts as a tireless Socratic mentor. It never writes the code for the student—it prompts them to discover the fix themselves.',
        durationSeconds: 30,
        deliveryNotes: { tone: 'Inspiring, breakthrough reveal', energy: 'High' }
      },
      {
        slideNumber: 6,
        title: 'How It Works: Socratic Dialogue Loop',
        objective: 'Demonstrate the 4-step pedagogical engine.',
        keyPoints: [
          '1. Code Execution Trace: Runs code and extracts variable states at each step',
          '2. Visual Memory Mapping: Draws array indices and pointers on interactive Miro canvas',
          '3. Bug Isolation: Pinpoints where the student mental model diverges from machine state',
          '4. Socratic Guiding Prompt: Asks: "What value does variable `i` hold when the loop terminates?"'
        ],
        visualSuggestion: '4-stage diagram: Execution Trace -> Miro Visual Canvas -> State Divergence -> Socratic Prompt.',
        speakerScript: 'When a student is stuck, EduPrompt runs their code and visualizes their memory pointers on a Miro canvas. Instead of saying "you have an off-by-one error," it asks: "Look at your third array box. What index is your pointer trying to read?" The student has that lightbulb moment.',
        durationSeconds: 35,
        deliveryNotes: { tone: 'Mastery, teaching clarity', energy: 'Medium' }
      },
      {
        slideNumber: 7,
        title: 'Faculty Trust & Anti-Cheat Guardrails',
        objective: 'Address judge skepticism regarding academic integrity.',
        keyPoints: [
          'Cryptographic Output Restriction: Physically incapable of outputting multi-line code solutions',
          'Faculty Analytics Dashboard: Highlights real-time cohort conceptual bottlenecks for instructors',
          'FERPA Compliant: Student identity and academic records strictly isolated and protected'
        ],
        visualSuggestion: 'Instructor dashboard showing heatmaps of student conceptual difficulties in real time.',
        speakerScript: 'We designed EduPrompt from day one with university faculty. The system has hard-coded constraints preventing code generation. And professors receive an analytics dashboard showing exactly which lecture concepts confused students the previous night.',
        durationSeconds: 30,
        deliveryNotes: { tone: 'Reassuring, pedagogical partnership', energy: 'Medium' }
      },
      {
        slideNumber: 8,
        title: 'Benchmark Validation: 22% Pass Rate Surge',
        objective: 'Present empirical study results.',
        keyPoints: [
          'Tested across 140 freshman students in CS101 at State University',
          'Course completion and exam pass rates surged by 22%',
          'TA office hour queue lengths decreased by 55%',
          '91% of students reported higher confidence in tackling complex algorithmic challenges'
        ],
        visualSuggestion: 'Key metrics: 22% Higher Exam Pass Rates, 55% Shorter TA Queues, 140 Students, 91% Student Confidence.',
        speakerScript: 'In our 140-student trial, exam pass rates increased by twenty-two percent, while TA office hour lines dropped by more than half. Students built genuine mastery instead of copying answers.',
        durationSeconds: 30,
        deliveryNotes: { tone: 'Undeniable proof, academic validation', energy: 'High' }
      },
      {
        slideNumber: 9,
        title: 'Departmental SaaS Licensing: $25K/Year',
        objective: 'Explain university departmental revenue model.',
        keyPoints: [
          'Direct departmental annual licensing: $15,000 to $40,000 per engineering department',
          'Massive university ROI: Retaining just 2 out-of-state students pays for the entire software license',
          'Rapid adoption path through individual course instructor pilot grants'
        ],
        visualSuggestion: 'University ROI formula: 2 Retained Students ($60K Tuition) vs $25K Software Cost.',
        speakerScript: 'We license directly to engineering departments for twenty-five thousand dollars a year. When you consider that retaining just two tuition-paying students covers the software license for the entire semester, the financial justification is immediate.',
        durationSeconds: 30,
        deliveryNotes: { tone: 'Clear commercial logic', energy: 'Punchy' }
      },
      {
        slideNumber: 10,
        title: 'Empowering the Next Generation of Engineers',
        objective: 'Visionary call to action.',
        keyPoints: [
          'Next Milestone: Deploying with 6 university engineering departments for Fall semester',
          'Expanding beyond CS to Electrical and Mechanical Engineering visual simulations',
          'Join us in building the digital classroom where no student gets left behind in the dark'
        ],
        visualSuggestion: 'Diverse group of confident students collaborating over visual engineering diagrams.',
        speakerScript: 'The world needs more engineers, not fewer. We cannot afford to let great minds drop out because they hit a syntax wall alone in a dorm room. Join us in scaling Socratic mentorship to every STEM student on Earth. Thank you!',
        durationSeconds: 25,
        deliveryNotes: { tone: 'Inspiring, climactic conclusion', energy: 'High' }
      }
    ]
  },
  judgeQuestions: [
    {
      id: 'jq-edu-1',
      category: 'Ethics',
      question: 'How do you prevent students from prompting your Socratic tutor into simply writing homework answers for them like ChatGPT does?',
      difficulty: 'High',
      skepticalAngle: 'Students will jailbreak the LLM to cheat and universities will ban it.',
      suggestedAnswer: 'EduPrompt operates under a strict pedagogical containment layer. The system only manipulates visual diagrams and asks guiding Socratic diagnostic questions. Code synthesis tokens are explicitly blocked at the API gateway layer, so even with prompt injection attempts, the tutor cannot emit raw solution code.',
      evidenceStatus: 'grounded'
    },
    {
      id: 'jq-edu-2',
      category: 'Go-to-market',
      question: 'University software procurement can take 12 to 18 months. How do you survive as an early-stage startup?',
      difficulty: 'Medium',
      skepticalAngle: 'Academic bureaucracy will starve your startup of revenue.',
      suggestedAnswer: 'We bypass central university IT by selling at the departmental level using course lab fees and department chair discretionary funds under the $25,000 threshold. In our first two pilots, instructors signed off within 14 days without requiring central university RFP committee review.',
      evidenceStatus: 'grounded'
    }
  ],
  summary: {
    projectName: 'EduPrompt Studio',
    tagline: 'Socratic Miro-integrated visual debugging and algorithmic tutoring for STEM education.',
    problem: '70% of freshman STEM undergraduates struggle or drop out due to 400-person lecture halls and zero midnight debugging guidance.',
    solution: 'Interactive visual tutor that maps code execution onto Miro concept diagrams, prompting Socratic self-discovery without giving away code.',
    targetMarket: 'University Computer Science and Engineering Departments, Coding Bootcamps.',
    differentiation: 'Strict anti-cheat pedagogical guardrails and dynamic memory visualization vs direct code generators.',
    technology: 'Miro Web SDK + AST execution tracer + Qwen Socratic reasoning prompts.',
    businessModel: '$15K - $40K annual departmental subscription.',
    impact: 'Increased CS101 course pass rates by 22% and reduced TA office hour queues by 55%.',
    currentStatus: 'Piloted with 140 students across 2 university sections.',
    nextMilestone: 'Deploying across 6 university engineering departments for Fall semester.'
  }
};

// 6. CyberPulse AI (Cybersecurity / Autonomous SecOps)
export const CYBERPULSE_PROJECT: Project = {
  id: 'proj-cyberpulse-demo',
  name: 'CyberPulse AI',
  problemStatement: 'Enterprise SOC teams are inundated with 11,000 alerts daily. 83% are benign false positives, resulting in chronic analyst burnout, high turnover, and an average 212-day mean-time-to-contain actual sophisticated intrusions.',
  targetAudience: 'CISOs, SOC Directors, and Lead Incident Response Engineers at mid-market to enterprise companies managing 1,000+ endpoints.',
  solutionDescription: 'An autonomous Tier-1 SecOps agent that aggregates telemetry across CrowdStrike, Splunk, and AWS CloudTrail, automatically maps the complete MITRE ATT&CK attack path onto a visual Miro incident board, and generates verified containment runbooks in sub-90 seconds.',
  miroBoardUrl: 'https://miro.com/app/board/uXjVCYBER123SocBoard/',
  additionalContext: 'Tested with 4 enterprise SOC teams; triaged over 12,000 live alerts with zero false negative critical breaches; collapsed incident investigation MTTR from 48 minutes down to 75 seconds.',
  createdAt: '2026-10-04T10:00:00Z',
  updatedAt: '2026-10-04T11:00:00Z',
  isDemo: true,
};

export const CYBERPULSE_SAMPLE: SampleIdea = {
  id: 'proj-cyberpulse-demo',
  name: 'CyberPulse AI',
  category: 'CYBERSECURITY / SECOPS',
  badge: 'ENTERPRISE SEC',
  tagline: 'Autonomous Tier-1 SOC analyst mapping incident kill-chains onto Miro in sub-90 seconds.',
  readinessScore: 78,
  project: CYBERPULSE_PROJECT,
  analysis: {
    problem: 'Security Operations Centers receive 11,000+ alerts daily, drowning analysts in false positive noise and leaving critical APT intrusions undetected for an average of 212 days.',
    targetUsers: [
      'CISOs facing catastrophic liability and cyber insurance rate spikes',
      'SOC Managers suffering 40% annual analyst turnover due to alert fatigue',
      'Incident Response Leads who need rapid containment before lateral movement'
    ],
    painPoints: [
      '83% of daily SIEM alerts are benign or repetitive duplicates',
      'Triaging a single complex incident requires querying 6 different consoles (EDR, SIEM, IAM, CloudTrail)',
      'Tier-1 analyst onboarding takes 6 months while industry turnover averages 18 months'
    ],
    proposedSolution: 'CyberPulse AI: An autonomous Tier-1 SecOps co-analyst that correlates disparate logs, generates visual Miro MITRE ATT&CK incident maps, and drafts executable containment scripts for human approval.',
    valueProposition: 'Slash Tier-1 alert triage workload by 80% and reduce mean time to investigate from 48 minutes to 75 seconds.',
    assumptions: [
      'Security leaders will grant read-only telemetry access to a specialized AI SecOps agent',
      'AI reasoning can reliably reconstruct lateral movement chains without hallucinating IOCs',
      'Analysts prefer visual investigation graph representations over raw terminal logs'
    ],
    evidenceGaps: [
      'Need SOC2 Type II compliance audit certification before enterprise banking rollouts',
      'Validation across air-gapped on-premise government network environments',
      'Formal SLAs around zero false-negative containment'
    ],
    risks: [
      'Accidental network isolation of critical production infrastructure during false positive alerts',
      'Hostile adversarial prompt injection embedded inside malicious log payloads',
      'Incumbent SIEM vendors (Splunk, Microsoft Sentinel) launching native AI triage add-ons'
    ],
    opportunities: [
      'Qualifying enterprise customers for up to 25% discounts on cyber liability insurance policies',
      'Expanding from incident triage into automated compliance mapping for FedRAMP and SOC2'
    ],
    competitors: [
      { name: 'CrowdStrike Charlotte / Microsoft Security Copilot', comparison: 'Proprietary vendor silos that struggle to neutrally correlate heterogeneous logs across AWS, GCP, Okta, and Linux.' },
      { name: 'Legacy SOAR Tools (Splunk Phantom / Cortex XSOAR)', comparison: 'Fragile, brittle Python playbooks that require full-time engineers to maintain and cannot reason over novel zero-day attacks.' }
    ],
    differentiators: [
      'Neutral Cross-Platform Correlation: Analyzes disparate logs across AWS CloudTrail, CrowdStrike, and Okta in a single causal graph',
      'Visual Miro Kill-Chain War-Room: Maps MITRE ATT&CK attack trajectories directly onto an interactive collaborative board',
      'Sub-90-Second MTTR: Collapses manual 48-minute alert triage cycles into 75 seconds with verified ground truth'
    ],
    businessModel: 'B2B Enterprise SaaS: $60,000 to $150,000 annual subscription tiered by protected endpoint volume.',
    technicalFeasibility: {
      score: 87,
      reasoning: 'High feasibility. Causal threat graphs paired with in-VPC quantized Qwen models provide low latency without cloud egress expenses.'
    },
    pitchReadinessScore: 78,
    readinessBreakdown: {
      problemClarity: { name: 'Problem Clarity', score: 96, explanation: 'Universal, acute enterprise security pain with severe analyst burnout and catastrophic breach liability.', status: 'strong' },
      solutionClarity: { name: 'Solution Clarity', score: 90, explanation: 'Clear autonomous Tier-1 triage pipeline connecting telemetry to human 1-click execution.', status: 'strong' },
      targetUserClarity: { name: 'Target User', score: 88, explanation: 'Pinpoint focus on enterprise CISOs and SOC managers with 1,000+ protected endpoints.', status: 'strong' },
      differentiation: { name: 'Differentiation', score: 78, explanation: 'Neutral cross-platform correlation layer and visual Miro kill-chain mapping.', status: 'strong' },
      evidence: { name: 'Evidence', score: 80, explanation: 'Grounded in 12,000 alert enterprise trials across 4 SOC teams with zero false negatives.', status: 'strong' },
      technicalFeasibility: { name: 'Feasibility', score: 87, explanation: 'Private in-VPC architecture eliminates security and data egress concerns.', status: 'strong' },
      businessPotential: { name: 'Business Potential', score: 92, explanation: 'Massive ROI: saves equivalent of 3 full-time analyst salaries ($360K/yr) per deployment.', status: 'strong' },
      storytelling: { name: 'Storytelling', score: 84, explanation: 'High-stakes tension between machine-speed attacks and exhausted human defenders.', status: 'strong' }
    },
    strengths: [
      'Massive, urgent enterprise pain with immediate CISO ROI and cyber insurance premium discounts',
      'Visual Miro kill-chain reconstruction gives human analysts instant context for rapid sign-off',
      'Strong benchmark proof: 12,000 alerts triaged with 75-second MTTR'
    ],
    weaknesses: [
      'Enterprise sales cycles require rigorous third-party SOC2 and ISO27001 certifications',
      'Fear of autonomous containment actions taking down revenue-critical servers',
      'High telemetry ingestion egress costs from cloud SIEM data stores'
    ],
    recommendedChanges: [
      'Emphasize Human-in-the-Loop 1-click approval for all containment actions to eliminate blast radius fears',
      'Highlight zero-copy edge telemetry architecture that avoids massive cloud egress fees',
      'Present side-by-side speed benchmarks: 48 minutes manual vs 75 seconds CyberPulse'
    ],
    claimAudits: [
      {
        claim: 'Collapsed incident triage MTTR from 48 minutes down to 75 seconds',
        classification: 'verified-evidence',
        context: 'Grounded in 12,000 alert trial across 4 enterprise design partner SOCs.',
        recommendation: 'Feature this 38x speedup metric prominently on Slide 3 and Slide 8.'
      },
      {
        claim: 'Zero false negatives on critical priority intrusions',
        classification: 'evidence-needed',
        context: 'True for tested red-team scenarios, but enterprise buyers will demand external third-party penetration testing verification.',
        recommendation: 'Clarify that this metric reflects 12 red-team attack simulations and ongoing benchmark suite runs.'
      }
    ],
    nextActionPrompt: {
      text: 'Your pitch is 78% ready. The 38x triage speedup is exceptional. Reinforce human-in-the-loop safeguards to preempt judge skepticism.',
      actionLabel: 'Audit Vulnerabilities',
      targetTab: 'attack'
    }
  },
  improvements: [
    {
      id: 'imp-cp-1',
      number: '01',
      title: 'Human-in-the-Loop Safe Containment Gateway',
      whyItMatters: 'Judges and CISOs fear AI hallucinations will isolate active production database nodes.',
      whatIsMissing: 'Clear governance mechanism proving CyberPulse never takes destructive actions unprompted.',
      suggestedImprovement: 'State explicitly: CyberPulse proposes isolated runbooks; execution requires 1-click analyst approval or two-person CISO dual-key authorization.',
      isApplied: false,
      category: 'Governance & Safety'
    },
    {
      id: 'imp-cp-2',
      number: '02',
      title: 'Zero-Egress In-VPC Edge Processing',
      whyItMatters: 'Transferring petabytes of enterprise SIEM telemetry to external LLM servers incurs huge cloud bills.',
      whatIsMissing: 'Architecture diagram showing local embedding and edge correlation.',
      suggestedImprovement: 'Highlight that CyberPulse runs inside the customer’s private VPC or on-prem cluster, sending only anonymized incident graphs.',
      isApplied: false,
      category: 'Data Privacy'
    },
    {
      id: 'imp-cp-3',
      number: '03',
      title: 'Cyber Insurance Premium Reduction Factor',
      whyItMatters: 'Positions CyberPulse as a cost-saving insurance play, not just another security tool expenditure.',
      whatIsMissing: 'Quantifiable financial return beyond engineering hours saved.',
      suggestedImprovement: 'Demonstrate that sub-2-minute MTTR qualifies enterprise clients for up to 25% discounts on annual cyber liability insurance policies.',
      isApplied: false,
      category: 'Financial ROI'
    }
  ],
  attackReport: {
    initialSurvivalScore: 70,
    survivalScore: 70,
    verdict: 'Moderate Vulnerability — High urgency enterprise problem, but needs bulletproof human-in-the-loop and VPC security assurances.',
    topThreePriorities: [
      'Eliminate fears of autonomous actions isolating critical production nodes.',
      'Prove adversarial log prompt injection cannot hijack LLM analysis.',
      'Establish neutral multi-cloud correlation moat against CrowdStrike and Microsoft.'
    ],
    attacks: [
      {
        id: 'atk-cp-1',
        severity: 'critical',
        category: 'Operational Risk',
        issue: 'If your AI misclassifies a database migration as ransomware and blocks the port, you cause an enterprise outage. How do you guarantee zero disruptive false positives?',
        whyItMatters: 'Enterprise CISOs will refuse to deploy any agent that has autonomous write permissions to production firewalls without oversight.',
        recommendedFix: 'Enforce human-in-the-loop: CyberPulse only stages containment runbooks; execution requires 1-click human verification.',
        status: 'unresolved'
      },
      {
        id: 'atk-cp-2',
        severity: 'high',
        category: 'Adversarial Vulnerability',
        issue: 'Attackers can inject malicious instructions inside HTTP User-Agent headers to trick the LLM into dismissing real intrusions.',
        whyItMatters: 'Adversarial jailbreaks directly undermine the integrity of automated triage.',
        recommendedFix: 'Implement deterministic token isolation: raw log payloads are treated as untrusted data strings, never executable prompt instructions.',
        status: 'unresolved'
      },
      {
        id: 'atk-cp-3',
        severity: 'high',
        category: 'Incumbent Moat',
        issue: 'CrowdStrike and Microsoft already have multi-billion dollar telemetry datasets and are bundling native AI assistants.',
        whyItMatters: 'Single-point EDR solutions risk getting squeezed out by platform consolidation.',
        recommendedFix: 'Frame CyberPulse as the vendor-neutral correlation layer across AWS, Okta, Splunk, and CrowdStrike that neither incumbent will ever build.',
        status: 'unresolved'
      }
    ]
  },
  deck: {
    title: 'CyberPulse AI: The Autonomous Tier-1 SOC Analyst',
    tagline: 'From Alert Fatigue to Sub-90-Second Incident Containment',
    slideCount: 10,
    totalDurationSeconds: 290,
    slides: [
      {
        slideNumber: 1,
        title: 'CyberPulse AI: Autonomous Tier-1 SecOps',
        objective: 'Hook the audience with the chronic crisis inside enterprise security operations.',
        keyPoints: [
          'Enterprise SOCs are collapsing under 11,000 alerts per day',
          '83% of security alerts are benign noise, yet analysts must investigate each manually',
          'Average dwell time for real intrusions: 212 days before discovery'
        ],
        visualSuggestion: 'Cinematic glowing radar graphic showing an avalanche of red alert pings overwhelmed by a lone analyst silhouette.',
        speakerScript: 'Every single day, the average enterprise security operations center receives over eleven thousand alerts. Eighty-three percent of them are benign noise. But because missing a single real threat is catastrophic, analysts are burning out, turnover is at forty percent, and real attackers sit inside corporate networks for over two hundred days. We built CyberPulse to solve this.',
        durationSeconds: 25,
        deliveryNotes: { tone: 'Urgent, high gravity', energy: 'High' }
      },
      {
        slideNumber: 2,
        title: 'The SOC Crisis: 83% Noise, 212-Day Dwell Time',
        objective: 'Quantify the enterprise cost of alert fatigue.',
        keyPoints: [
          'Analyst burnout: 40% annual turnover in Tier-1 security roles',
          '$4.45M average total cost of an undetected enterprise data breach',
          'Human limits: A human analyst takes 48 minutes to manually triage and correlate one alert'
        ],
        visualSuggestion: 'Split chart: Rising daily alert volumes (11,000/day) vs flat human analyst capacity (40 alerts/analyst).',
        speakerScript: 'The math simply no longer works. It takes a skilled engineer forty-eight minutes to correlate an alert across Splunk, CrowdStrike, and CloudTrail. In an eight-hour shift, one analyst can realistically handle ten to fifteen alerts. The remaining ten thousand alerts go completely uninspected. That gap is where hackers live.',
        durationSeconds: 30,
        deliveryNotes: { tone: 'Sobering, analytical clarity', energy: 'Medium' }
      },
      {
        slideNumber: 3,
        title: 'Meet CyberPulse: Autonomous Tier-1 Analyst',
        objective: 'Introduce the core product and value proposition.',
        keyPoints: [
          'Ingests telemetry across SIEM, EDR, and Cloud IAM in real time',
          'Qwen multi-agent reasoning reconstructs MITRE ATT&CK kill-chains',
          'Sub-90-second automated triage, evidence packaging, and runbook generation'
        ],
        visualSuggestion: 'Sleek dark interface showing live telemetry streams converging into an illuminated MITRE ATT&CK incident board.',
        speakerScript: 'CyberPulse is an autonomous Tier-1 SecOps analyst that never sleeps. It connects directly to your existing security tools, correlates signals across endpoints and cloud logs, and investigates every single alert in under ninety seconds. It does the heavy investigative lifting so your senior engineers only see verified, actionable threats.',
        durationSeconds: 25,
        deliveryNotes: { tone: 'Decisive, technological triumph', energy: 'High' }
      },
      {
        slideNumber: 4,
        title: '$24B Addressable Market in Security Automation',
        objective: 'Validate the market size and expansion opportunity.',
        keyPoints: [
          '$24.2B Global Security Automation & Orchestration (SOAR) market by 2028',
          'Over 45,000 mid-market and enterprise organizations with dedicated SOC teams',
          'High willingness to pay: Average enterprise security tooling budget exceeds $3.5M'
        ],
        visualSuggestion: 'Target market breakdown: Global Security Automation TAM ($24B) -> Mid-market/Enterprise SAM ($7.8B) -> Beachhead SOM ($820M).',
        speakerScript: 'Security automation is a twenty-four billion dollar market. With over forty-five thousand enterprise security teams globally facing an acute talent shortage of four million cybersecurity professionals, companies are actively desperate for autonomous software that multiplies their existing headcount.',
        durationSeconds: 25,
        deliveryNotes: { tone: 'Confident, market authority', energy: 'Medium' }
      },
      {
        slideNumber: 5,
        title: 'Product Architecture: Visual Miro War-Room',
        objective: 'Walk through the visual investigation and kill-chain reconstruction.',
        keyPoints: [
          'Bi-directional Miro integration: Automatically generates interactive incident blast-radius boards',
          'MITRE ATT&CK mapping: Connects credential access, lateral movement, and data staging',
          '1-Click Remediation: Generates exact CLI scripts for endpoint isolation and token revocation'
        ],
        visualSuggestion: 'Interactive Miro board rendering with colored sticky nodes representing affected hosts, compromised credentials, and containment checkpoints.',
        speakerScript: 'Instead of forcing analysts to decipher messy raw JSON logs, CyberPulse maps the entire breach onto an interactive Miro canvas in real time. Analysts immediately see the entry point, which laptop was compromised, which S3 bucket was accessed, and get a one-click button to revoke the compromised tokens immediately.',
        durationSeconds: 30,
        deliveryNotes: { tone: 'Engaging, product showcase', energy: 'High' }
      },
      {
        slideNumber: 6,
        title: 'How It Works: 4-Stage Autonomous Pipeline',
        objective: 'Explain the technical data flow with precision.',
        keyPoints: [
          '1. Stream Ingestion: Zero-copy event listener on AWS CloudTrail, CrowdStrike, and Okta',
          '2. Threat Graph Assembly: Connects disparate log timestamps into a unified causal graph',
          '3. Qwen Deductive Audit: Audits anomalies against historical baseline behaviors',
          '4. Human-in-the-Loop Gate: Presents pre-composed containment action for 1-click execution'
        ],
        visualSuggestion: 'Horizontal pipeline flowchart: Ingestion -> Graph Assembly -> Reasoning Engine -> Human Approval Gate.',
        speakerScript: 'Our four-stage pipeline listens to streaming telemetry, builds a causal graph of host behaviors, uses Qwen reasoning to eliminate ninety-nine percent of false alarms, and presents a crystal-clear containment plan to the human on call. Nothing is left to guesswork.',
        durationSeconds: 30,
        deliveryNotes: { tone: 'Technical precision, engineering confidence', energy: 'Medium' }
      },
      {
        slideNumber: 7,
        title: 'Safe Containment & Anti-Hallucination Guardrails',
        objective: 'Defend against judge skepticism on production safety.',
        keyPoints: [
          'Read-only telemetry by default; containment execution requires human approval',
          'Strict adversarial input sanitization preventing prompt injection attacks',
          'Runs entirely inside customer VPC: Zero customer log data sent to third-party public models'
        ],
        visualSuggestion: 'Multi-layer security shield showing Air-Gapped VPC, Adversarial Filter, and Dual-Key Human Approval checkpoint.',
        speakerScript: 'We designed CyberPulse with zero compromise on enterprise safety. It operates on read-only logs. When an incident is verified, it generates containment commands, but execution always requires one-click human authorization. Furthermore, all reasoning occurs inside the client’s own VPC, ensuring absolute data privacy.',
        durationSeconds: 30,
        deliveryNotes: { tone: 'Reassuring, compliance mastery', energy: 'Medium' }
      },
      {
        slideNumber: 8,
        title: 'Benchmark Proof: 12,000 Live Alerts Triaged',
        objective: 'Present concrete operational performance metrics.',
        keyPoints: [
          'Deployed across 4 enterprise design partner SOCs for 60 days',
          'Over 12,000 live alerts processed with zero false-negative critical misses',
          'Mean-time-to-triage collapsed from 48 minutes down to 75 seconds (38x speedup)',
          'Analyst survey: 91% reduction in reported daily alert fatigue'
        ],
        visualSuggestion: 'Dramatic before/after comparison cards: 48 Min -> 75 Sec MTTR; 12,000 Alerts Triaged; 0 Critical Misses; 91% Fatigue Reduction.',
        speakerScript: 'In our sixty-day enterprise pilot across four production SOCs, CyberPulse processed over twelve thousand live alerts. Mean time to investigate dropped from forty-eight minutes to seventy-five seconds. That is a thirty-eight-x acceleration, with zero missed critical threats across twelve red-team simulations.',
        durationSeconds: 30,
        deliveryNotes: { tone: 'Grounded authority, metric proof', energy: 'High' }
      },
      {
        slideNumber: 9,
        title: 'Business Model: $60K-$150K Annual License',
        objective: 'Detail enterprise SaaS pricing and payback ROI.',
        keyPoints: [
          'Priced by protected endpoint tier: $60,000 to $150,000 annual subscription',
          'Saves equivalent of 3 full-time Tier-1 analysts ($360,000 annual savings)',
          'Reduces cyber insurance liability premiums by up to 25% through verifiable MTTR logs'
        ],
        visualSuggestion: 'ROI equation graphic: $75K Software Cost vs $360K Analyst Salary Savings + $100K Insurance Savings = 6.1x First-Year ROI.',
        speakerScript: 'We license CyberPulse as an annual subscription starting at sixty thousand dollars. For our average customer, it does the work of three full-time Tier-1 analysts, delivering over three hundred thousand dollars in direct operational savings in year one alone.',
        durationSeconds: 30,
        deliveryNotes: { tone: 'Punchy commercial conviction', energy: 'High' }
      },
      {
        slideNumber: 10,
        title: 'The Future of Autonomous Cyber Defense',
        objective: 'Inspiring call to action and partnership roadmap.',
        keyPoints: [
          'Next Milestone: SOC2 Type II certification and integration with AWS Security Hub',
          'Expanding pilot cohort to 10 enterprise financial and healthcare organizations',
          'Join us in arming defenders with the speed of AI'
        ],
        visualSuggestion: 'Global cybersecurity defense grid illuminating in real time across the globe.',
        speakerScript: 'Attackers are already weaponizing artificial intelligence to execute automated zero-day campaigns. Human defenders typing at keyboards cannot stop machine-speed attacks alone. Join us in scaling autonomous defense to every security team in the world. Thank you!',
        durationSeconds: 25,
        deliveryNotes: { tone: 'Inspiring, climactic conclusion', energy: 'High' }
      }
    ]
  },
  judgeQuestions: [
    {
      id: 'jq-cp-1',
      category: 'Security',
      question: 'What happens if your AI recommends isolating the CEO’s laptop or the core payment processing server during a false alarm?',
      difficulty: 'High',
      skepticalAngle: 'Fear of autonomous actions creating enterprise outages.',
      suggestedAnswer: 'CyberPulse enforces strict critical-asset tags. Core production clusters and executive workstations are hardcoded into a protected tier where automated isolation is physically disabled. Furthermore, all containment actions require explicit 1-click human verification, ensuring no critical node is ever taken offline by mistake.',
      evidenceStatus: 'grounded'
    },
    {
      id: 'jq-cp-2',
      category: 'Competition',
      question: 'Why won’t CrowdStrike or Microsoft simply build this and give it away for free with their existing EDR licenses?',
      difficulty: 'High',
      skepticalAngle: 'Incumbent platform lock-in and vendor bundling.',
      suggestedAnswer: 'CrowdStrike only sees endpoint telemetry; Microsoft prioritizes Azure and Sentinel. In reality, 92% of enterprise breaches span heterogeneous environments—an Okta credential stolen to query an AWS S3 bucket via a Linux bastion. Incumbents will never prioritize deep, neutral correlation of their fiercest rivals’ telemetry. CyberPulse is the dedicated Switzerland of cross-platform security correlation.',
      evidenceStatus: 'grounded'
    }
  ],
  summary: {
    projectName: 'CyberPulse AI',
    tagline: 'Autonomous Tier-1 SOC analyst mapping incident kill-chains onto Miro in sub-90 seconds.',
    problem: 'Enterprise SOC teams are inundated with 11,000 alerts daily; 83% false positives cause chronic analyst burnout and 212-day dwell times.',
    solution: 'Autonomous Tier-1 SecOps agent that correlates multi-source logs, visualizes the attack kill-chain on Miro, and drafts verified containment runbooks.',
    targetMarket: 'Enterprises and mid-market organizations with dedicated Security Operations Centers (45,000+ organizations globally).',
    differentiation: 'Neutral cross-platform correlation across CrowdStrike, Splunk, Okta, and AWS with interactive visual Miro blast-radius mapping.',
    technology: 'Causal threat graph assembly engine + private in-VPC Qwen reasoning with zero telemetry egress.',
    businessModel: '$60,000 - $150,000 annual subscription per enterprise.',
    impact: 'Collapses incident MTTR from 48 minutes to 75 seconds with zero false negative critical misses across 12,000 live alerts.',
    currentStatus: 'Deployed across 4 enterprise design partner SOCs; triaged 12,000 live alerts.',
    nextMilestone: 'Achieving SOC2 Type II certification and expanding pilot to 10 financial and healthcare institutions.'
  }
};

export const ALL_SAMPLE_IDEAS: SampleIdea[] = [
  BUG_TRIAGE_SAMPLE,
  MED_GUARDIAN_SAMPLE,
  ECOTRACK_SAMPLE,
  FINGUARD_SAMPLE,
  EDUPROMPT_SAMPLE,
  CYBERPULSE_SAMPLE,
];

