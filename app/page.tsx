'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { PipelineProgress } from '@/components/PipelineProgress';
import { LandingHero } from '@/components/LandingHero';
import { ProjectCreationModal } from '@/components/ProjectCreationModal';
import { OverviewView } from '@/components/OverviewView';
import { MiroBoardViewer } from '@/components/MiroBoardViewer';
import { AnalysisDashboard } from '@/components/AnalysisDashboard';
import { ImprovementView } from '@/components/ImprovementView';
import { AttackMyPitchView } from '@/components/AttackMyPitchView';
import { PresentationViewer } from '@/components/PresentationViewer';
import { SpeakerCoachView } from '@/components/SpeakerCoachView';
import { AudioPitchView } from '@/components/AudioPitchView';
import { VideoTimelineView } from '@/components/VideoTimelineView';
import { JudgeModeView } from '@/components/JudgeModeView';
import { ExecutiveSummaryView } from '@/components/ExecutiveSummaryView';
import { FinalPackageView } from '@/components/FinalPackageView';
import { MiroExportModal } from '@/components/MiroExportModal';

import { 
  Project, 
  BoardContext, 
  BoardItem,
  PitchAnalysis, 
  PitchDeck, 
  Slide,
  PitchAttackReport, 
  JudgeQuestion, 
  ExecutiveSummary,
  PitchImprovementItem 
} from '@/types';

import { DEMO_BOARD_CONTEXT } from '@/data/demoBoard';
import { 
  DEMO_PROJECT, 
  INITIAL_DEMO_ANALYSIS, 
  DEMO_IMPROVEMENTS, 
  DEMO_ATTACK_REPORT, 
  DEMO_PITCH_DECK, 
  DEMO_JUDGE_QUESTIONS, 
  DEMO_EXECUTIVE_SUMMARY 
} from '@/data/demoProject';

import { exportPitchDeckToPPTX, exportSummaryAsMarkdown, downloadBlob } from '@/services/export/pptxExport';
import { populateDeckWithImages } from '@/services/media/imageGenerator';

export default function Home() {
  const [project, setProject] = useState<Project | null>(null);
  const [boardContext, setBoardContext] = useState<BoardContext>(DEMO_BOARD_CONTEXT);
  const [analysis, setAnalysis] = useState<PitchAnalysis | null>(null);
  const [improvements, setImprovements] = useState<PitchImprovementItem[]>([]);
  const [deck, setDeck] = useState<PitchDeck | null>(null);
  const [attackReport, setAttackReport] = useState<PitchAttackReport | null>(null);
  const [judgeQuestions, setJudgeQuestions] = useState<JudgeQuestion[]>([]);
  const [summary, setSummary] = useState<ExecutiveSummary | null>(null);

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMiroModalOpen, setIsMiroModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStepText, setLoadingStepText] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Check URL parameters for Miro OAuth redirect callbacks
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('miro') === 'connected' || params.get('miro_connected') === 'true') {
        showToast('🟢 Miro Account Connected! Ready to send pitches to your boards.');
        window.history.replaceState({}, '', window.location.pathname);
      } else if (params.get('miro_error')) {
        let rawErr = params.get('miro_error') || '';
        let cleanNotice = rawErr;
        if (rawErr.includes('secretKeyNotFound') || rawErr.includes('ClientSecret does not exist')) {
          cleanNotice = 'Miro OAuth secret key mismatch. You can paste your Miro Access Token directly in the Send to Miro dialog.';
        } else if (rawErr.includes('401') || rawErr.startsWith('{')) {
          cleanNotice = 'Miro authorization notice: You can use your direct Miro Access Token in the Send to Miro dialog.';
        }
        showToast(`Miro Notice: ${cleanNotice}`);
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, []);

  // Instant 1-Click Demo Loader
  const handleLoadDemo = () => {
    setProject(DEMO_PROJECT);
    setBoardContext(DEMO_BOARD_CONTEXT);
    setAnalysis(INITIAL_DEMO_ANALYSIS);
    setImprovements(DEMO_IMPROVEMENTS);
    setAttackReport(DEMO_ATTACK_REPORT);
    setDeck(populateDeckWithImages(DEMO_PITCH_DECK, DEMO_PROJECT.name));
    setJudgeQuestions(DEMO_JUDGE_QUESTIONS);
    setSummary(DEMO_EXECUTIVE_SUMMARY);
    setActiveTab('analysis');
    setIsModalOpen(false);
    showToast('Loaded Demo Project: AI Bug Triage Agent (Pitch Readiness: 68/100)');
  };

  // Handle Project Creation & Qwen Analysis Workflow
  const handleCreateProject = async (projectData: Partial<Project>) => {
    setIsLoading(true);
    setLoadingStepText('1/4 Connecting to Miro Workspace and normalizing board context...');

    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name: projectData.name || 'Untitled Project',
      problemStatement: projectData.problemStatement || '',
      targetAudience: projectData.targetAudience || '',
      solutionDescription: projectData.solutionDescription || '',
      miroBoardUrl: projectData.miroBoardUrl || '',
      additionalContext: projectData.additionalContext || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDemo: false,
    };

    try {
      // 1. Fetch Miro Board
      let currentBoard = boardContext;
      try {
        const miroRes = await fetch('/api/miro', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ boardUrlOrId: newProj.miroBoardUrl }),
        });
        if (miroRes.ok) {
          const miroData = await miroRes.json();
          currentBoard = miroData.boardContext;
          setBoardContext(currentBoard);
        }
      } catch (err) {
        console.warn('Miro read error:', err);
      }

      // 2. Run Qwen Analysis Engine
      setLoadingStepText('2/4 Qwen analyzing thesis, auditing claims & computing Pitch Readiness Score...');
      const analyzeRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project: newProj, boardContext: currentBoard }),
      });
      const analyzeData = await analyzeRes.json();
      const currentAnalysis: PitchAnalysis = analyzeData.analysis || INITIAL_DEMO_ANALYSIS;
      setAnalysis(currentAnalysis);

      // 3. Run Attack My Pitch critique engine
      setLoadingStepText('3/4 Simulating skeptical judges and hunting weak assumptions...');
      const attackRes = await fetch('/api/attack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project: newProj, analysis: currentAnalysis, boardContext: currentBoard }),
      });
      const attackData = await attackRes.json();
      const currentAttacks: PitchAttackReport = attackData.attackReport || DEMO_ATTACK_REPORT;
      setAttackReport(currentAttacks);

      // 4. Generate 10-slide deck, Executive Summary & AI Judge Q&A
      setLoadingStepText('4/4 Generating 10-slide presentation, speaker notes, and judge defense...');
      const [pitchRes, judgeRes] = await Promise.all([
        fetch('/api/generate-pitch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ project: newProj, analysis: currentAnalysis, slideCount: 10 }),
        }),
        fetch('/api/judge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ project: newProj, analysis: currentAnalysis, boardContext: currentBoard }),
        }),
      ]);

      const pitchData = await pitchRes.json();
      const judgeData = await judgeRes.json();

      const finalDeck = pitchData.deck || DEMO_PITCH_DECK;
      setDeck(populateDeckWithImages(finalDeck, newProj.name));
      setSummary(pitchData.summary || DEMO_EXECUTIVE_SUMMARY);
      setJudgeQuestions(judgeData.judgeQuestions || DEMO_JUDGE_QUESTIONS);

      // Generate initial 3 improvement recommendations based on analysis weaknesses
      const initialImps: PitchImprovementItem[] = currentAnalysis.weaknesses.slice(0, 3).map((w, idx) => ({
        id: `imp-${idx + 1}`,
        number: `0${idx + 1}`,
        title: w,
        whyItMatters: 'Judges will scrutinize this point in the first 2 minutes of Q&A.',
        whatIsMissing: 'Concrete validation or pilot evidence.',
        suggestedImprovement: currentAnalysis.recommendedChanges[idx] || `Address ${w} with verifiable ground truth.`,
        isApplied: false,
        category: 'Readiness Factor',
      }));
      setImprovements(initialImps.length > 0 ? initialImps : DEMO_IMPROVEMENTS);

      setProject(newProj);
      setIsModalOpen(false);
      setActiveTab('analysis');
      showToast(`Pitch Analysis Complete! Readiness Score: ${currentAnalysis.pitchReadinessScore}/100`);
    } catch (err: any) {
      console.error('Workflow error:', err);
      showToast('Error during analysis, loaded resilient demo state.');
      handleLoadDemo();
    } finally {
      setIsLoading(false);
    }
  };

  // Add Item to Miro Board
  const handleAddMiroItem = (newItem: Partial<BoardItem>) => {
    setBoardContext(prev => ({
      ...prev,
      items: [newItem as BoardItem, ...prev.items],
    }));
    showToast('New sticky note added to visual workspace canvas.');
  };

  // Apply Single Improvement
  const handleApplyImprovement = (id: string, userFixText: string) => {
    setImprovements(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, isApplied: true, userFix: userFixText };
      }
      return item;
    }));

    if (analysis) {
      const updatedScore = Math.min(100, analysis.pitchReadinessScore + 7);
      setAnalysis({
        ...analysis,
        pitchReadinessScore: updatedScore,
      });
      showToast(`Applied improvement! Pitch Readiness increased to ${updatedScore}/100.`);
    }
  };

  // Apply All Improvements
  const handleApplyAllImprovements = () => {
    setImprovements(prev => prev.map(item => ({ ...item, isApplied: true })));
    if (analysis) {
      setAnalysis({
        ...analysis,
        pitchReadinessScore: 89,
      });
      showToast('All 3 improvements applied! Readiness increased to 89/100.');
    }
  };

  // Address Attack Defense
  const handleAddressAttack = (attackId: string, defenseNote: string) => {
    if (!attackReport) return;

    const updatedAttacks = attackReport.attacks.map(atk => {
      if (atk.id === attackId) {
        return { ...atk, status: 'addressed' as const, userDefense: defenseNote };
      }
      return atk;
    });

    const addressedCount = updatedAttacks.filter(a => a.status === 'addressed').length;
    const newSurvivalScore = Math.min(100, attackReport.initialSurvivalScore + addressedCount * 8);

    setAttackReport({
      ...attackReport,
      attacks: updatedAttacks,
      survivalScore: newSurvivalScore,
    });

    if (analysis) {
      setAnalysis({
        ...analysis,
        pitchReadinessScore: Math.min(100, analysis.pitchReadinessScore + 6),
      });
    }

    showToast(`Defense locked in! Pitch Survival Score raised to ${newSurvivalScore}/100.`);
  };

  // Update Slide
  const handleUpdateSlide = (updatedSlide: Slide) => {
    if (!deck) return;
    setDeck({
      ...deck,
      slides: deck.slides.map(s => s.slideNumber === updatedSlide.slideNumber ? updatedSlide : s),
    });
    showToast(`Slide ${updatedSlide.slideNumber} saved.`);
  };

  // Global Export Handler
  const handleGlobalExport = async () => {
    if (!deck) return;
    showToast('Exporting complete pitch bundle...');
    const blob = await exportPitchDeckToPPTX(deck);
    if (blob) {
      downloadBlob(blob, `${deck.title.replace(/\s+/g, '_')}_Deck.pptx`);
    }
    if (summary) {
      const md = exportSummaryAsMarkdown(summary);
      const mdBlob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
      downloadBlob(mdBlob, `${summary.projectName.replace(/\s+/g, '_')}_Executive_Summary.md`);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-[#EDEDED] flex flex-col font-sans relative selection:bg-[#FF4D00] selection:text-black bg-grid-editorial">
      {/* Background Subtle Atmosphere Glow */}
      <div className="fixed top-[-100px] left-1/3 w-[600px] h-[600px] bg-gradient-to-b from-[#FF4D00]/06 to-transparent blur-[140px] pointer-events-none -z-10" />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#121212] border border-[#FF4D00]/50 text-white text-xs font-mono px-4 py-3 rounded-xs shadow-flame flex items-center space-x-2 animate-in slide-in-from-bottom duration-200">
          <span className="w-2 h-2 rounded-full bg-[#FF4D00] animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <Header
        project={project}
        analysis={analysis}
        deck={deck}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewProject={() => setIsModalOpen(true)}
        onLoadDemo={handleLoadDemo}
        onExportAll={handleGlobalExport}
        onSendToMiro={() => setIsMiroModalOpen(true)}
        isAnalyzing={isLoading}
      />

      {/* Pipeline Navigation Bar */}
      {project && (
        <PipelineProgress
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          hasAnalysis={Boolean(analysis)}
          hasDeck={Boolean(deck)}
          hasAttack={Boolean(attackReport)}
          hasAudio={Boolean(deck)}
        />
      )}

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {!project ? (
          <LandingHero
            onStartBuilding={() => setIsModalOpen(true)}
            onSeeDemo={handleLoadDemo}
          />
        ) : (
          <div className="space-y-6">
            {activeTab === 'overview' && (
              <OverviewView
                project={project}
                boardContext={boardContext}
                analysis={analysis}
                onNavigateTab={setActiveTab}
                onAnalyzeIdea={() => handleCreateProject(project)}
              />
            )}

            {activeTab === 'miro' && (
              <MiroBoardViewer
                boardContext={boardContext}
                isDemo={project.isDemo}
                onAnalyzeIdea={() => handleCreateProject(project)}
                onAddItem={handleAddMiroItem}
              />
            )}

            {activeTab === 'analysis' && analysis && (
              <AnalysisDashboard
                analysis={analysis}
                onNavigateTab={setActiveTab}
                onAttackMode={() => setActiveTab('attack')}
                onImprovePitch={() => setActiveTab('improve')}
                onGeneratePitch={() => setActiveTab('presentation')}
                onSendToMiro={() => setIsMiroModalOpen(true)}
              />
            )}

            {activeTab === 'improve' && (
              <ImprovementView
                improvements={improvements}
                onApplyImprovement={handleApplyImprovement}
                onApplyAll={handleApplyAllImprovements}
                onProceedToDeck={() => setActiveTab('presentation')}
                onLaunchAttack={() => setActiveTab('attack')}
                currentScore={analysis?.pitchReadinessScore || 70}
              />
            )}

            {activeTab === 'attack' && attackReport && (
              <AttackMyPitchView
                attackReport={attackReport}
                onAddressAttack={handleAddressAttack}
                onProceedToPitch={() => setActiveTab('presentation')}
              />
            )}

            {activeTab === 'presentation' && deck && (
              <PresentationViewer
                deck={deck}
                onUpdateSlide={handleUpdateSlide}
                onRegenerateEntirePitch={() => handleCreateProject(project)}
                onNavigateToScript={() => setActiveTab('script')}
                onSendToMiro={() => setIsMiroModalOpen(true)}
              />
            )}

            {activeTab === 'script' && deck && (
              <SpeakerCoachView
                deck={deck}
                onProceedToJudge={() => setActiveTab('judge')}
              />
            )}

            {activeTab === 'audio' && deck && (
              <AudioPitchView
                deck={deck}
                onProceedToVideo={() => setActiveTab('video')}
              />
            )}

            {activeTab === 'video' && deck && (
              <VideoTimelineView
                deck={deck}
                onProceedToJudge={() => setActiveTab('judge')}
              />
            )}

            {activeTab === 'judge' && (
              <JudgeModeView
                questions={judgeQuestions}
                onProceedToPackage={() => setActiveTab('package')}
              />
            )}

            {activeTab === 'package' && (
              <FinalPackageView
                deck={deck}
                summary={summary}
                attackReport={attackReport}
                judgeQuestions={judgeQuestions}
                analysis={analysis}
                onNavigateTab={setActiveTab}
                onPrepareForPitch={() => setActiveTab('presentation')}
                onSendToMiro={() => setIsMiroModalOpen(true)}
              />
            )}
          </div>
        )}
      </main>

      {/* Project Creation Modal */}
      <ProjectCreationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProject}
        onLoadDemo={handleLoadDemo}
        isLoading={isLoading}
        loadingStepText={loadingStepText}
      />

      {/* Real Miro Write-Back Modal */}
      {project && analysis && deck && summary && attackReport && (
        <MiroExportModal
          isOpen={isMiroModalOpen}
          onClose={() => setIsMiroModalOpen(false)}
          project={project}
          analysis={analysis}
          deck={deck}
          attackReport={attackReport}
          judgeQuestions={judgeQuestions}
          summary={summary}
          onNavigateTab={setActiveTab}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#070707] py-8 px-6 text-center text-xs font-mono text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-white tracking-widest uppercase">PITCHFORGE</span>
            <span className="text-zinc-700">•</span>
            <span className="text-zinc-400">AI PITCH WAR ROOM // MIRO + QWEN STRATEGY LAB</span>
          </div>
          <div>
            <span className="text-zinc-500">From raw canvas thinking to investor defense.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
