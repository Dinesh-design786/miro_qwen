'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Sparkles, 
  Loader2, 
  ChevronRight,
  RotateCcw,
  PlusCircle,
  Video,
  Presentation,
  Volume2
} from 'lucide-react';
import { 
  Project, 
  PitchAnalysis, 
  PitchDeck, 
  PitchAttackReport, 
  JudgeQuestion, 
  ExecutiveSummary 
} from '@/types';
import { extractBoardIdFromUrl } from '@/services/miro/boardParser';

interface MiroExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  analysis: PitchAnalysis;
  deck: PitchDeck;
  attackReport: PitchAttackReport;
  judgeQuestions: JudgeQuestion[];
  summary: ExecutiveSummary;
  onNavigateTab: (tab: string) => void;
}

export function MiroExportModal({
  isOpen,
  onClose,
  project,
  analysis,
  deck,
  attackReport,
  judgeQuestions,
  summary,
  onNavigateTab,
}: MiroExportModalProps) {
  const [boardIdInput, setBoardIdInput] = useState('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [availableBoards, setAvailableBoards] = useState<{ id: string; name: string; viewLink: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepStatus, setStepStatus] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Duplicate prompt state
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [existingFrameTitle, setExistingFrameTitle] = useState<string>('');
  const [nextVersion, setNextVersion] = useState<number>(2);

  // Success state
  const [successResult, setSuccessResult] = useState<{
    boardUrl: string;
    frameTitle: string;
    itemsCreatedCount: number;
  } | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setSuccessResult(null);
      setNeedsConfirmation(false);
      setErrorMessage(null);
      return;
    }

    // Default board ID from project
    if (project?.miroBoardUrl) {
      const extracted = extractBoardIdFromUrl(project.miroBoardUrl) || project.miroBoardUrl;
      setBoardIdInput(extracted);
    }

    checkAuthStatus();
  }, [isOpen, project]);

  const checkAuthStatus = async () => {
    setIsCheckingAuth(true);
    try {
      const res = await fetch('/api/miro/auth-status');
      const data = await res.json();
      setIsAuthenticated(data.isAuthenticated);
      if (data.boards && data.boards.length > 0) {
        setAvailableBoards(data.boards);
        if (!boardIdInput && data.boards[0]?.id) {
          setBoardIdInput(data.boards[0].id);
        }
      }
    } catch (e) {
      console.warn('Failed to check Miro auth status:', e);
      setIsAuthenticated(false);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const handleConnectMiro = () => {
    // Redirect to Miro OAuth
    window.location.href = '/api/miro/oauth/authorize?state=pitchforge';
  };

  const handleSendToMiro = async (options?: { replaceExisting?: boolean; createVersion?: boolean }) => {
    const rawBoardId = boardIdInput.trim();
    if (!rawBoardId) {
      setErrorMessage('Please enter a Miro Board ID or Board URL.');
      return;
    }

    const cleanBoardId = extractBoardIdFromUrl(rawBoardId) || rawBoardId;

    setIsSubmitting(true);
    setErrorMessage(null);
    setStepStatus('Connecting to Miro board and checking workspace frames...');

    try {
      const res = await fetch('/api/miro/export-pitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          boardId: cleanBoardId,
          project,
          analysis,
          deck,
          attackReport,
          judgeQuestions,
          summary,
          replaceExisting: options?.replaceExisting,
          createVersion: options?.createVersion,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === 'MIRO_AUTH_REQUIRED') {
          setIsAuthenticated(false);
          setErrorMessage('Miro session expired or authentication required. Please connect your Miro account.');
        } else {
          setErrorMessage(data.message || 'Failed to write pitch to Miro.');
        }
        return;
      }

      if (data.needsConfirmation) {
        setNeedsConfirmation(true);
        setExistingFrameTitle(data.existingFrameTitle || '🚀 PitchForge AI Pitch');
        setNextVersion(data.nextVersion || 2);
        return;
      }

      // Success
      setNeedsConfirmation(false);
      setSuccessResult({
        boardUrl: data.boardUrl,
        frameTitle: data.frameTitle,
        itemsCreatedCount: data.itemsCreatedCount,
      });
    } catch (err: any) {
      console.error('Error writing to Miro:', err);
      setErrorMessage(err.message || 'An unexpected error occurred while communicating with Miro.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#0D1322] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0A0F1D]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FFD02F] text-[#050038] flex items-center justify-center font-black text-base shadow-md">
              M
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Send Pitch to Miro
              </h2>
              <span className="text-[10px] text-amber-400 font-medium">
                Real Workspace Write-Back Engine
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span>{errorMessage}</span>
                {!isAuthenticated && (
                  <div className="mt-2">
                    <button
                      onClick={handleConnectMiro}
                      className="px-3 py-1 bg-amber-400 text-slate-950 font-bold rounded text-[11px] shadow-sm hover:bg-amber-300"
                    >
                      Connect with Miro OAuth
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Loading Submitting State */}
          {isSubmitting ? (
            <div className="py-10 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full border-4 border-amber-400/20 border-t-amber-400 animate-spin flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Creating Real Miro Workspace
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {stepStatus || 'Generating frame, sticky notes, architecture flow & judge defenses...'}
                </p>
              </div>
              <div className="text-[11px] text-amber-300/80 bg-amber-500/10 py-1 px-3 rounded-full border border-amber-500/20 inline-block font-mono">
                Miro REST API v2 • Safe Grid Layout
              </div>
            </div>
          ) : successResult ? (
            /* Success State */
            <div className="py-4 space-y-5">
              <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-extrabold text-white">
                  ✓ Pitch generated on your Miro board
                </h3>
                <p className="text-xs text-emerald-200">
                  Created frame <strong>&ldquo;{successResult.frameTitle}&rdquo;</strong> with {successResult.itemsCreatedCount} structured items.
                </p>
              </div>

              {/* Action Buttons Required */}
              <div className="space-y-2.5">
                <a
                  href={successResult.boardUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl font-bold text-slate-950 bg-[#FFD02F] hover:bg-[#F2C425] shadow-lg flex items-center justify-center space-x-2 text-xs transition-all"
                >
                  <span>Open in Miro</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateTab('overview');
                    }}
                    className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center space-x-1.5"
                  >
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    <span>View Pitch</span>
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onNavigateTab('presentation');
                    }}
                    className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center space-x-1.5"
                  >
                    <Presentation className="w-3.5 h-3.5 text-amber-400" />
                    <span>Generate PPT</span>
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onNavigateTab('audio');
                    }}
                    className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center space-x-1.5"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-pink-400" />
                    <span>Generate Audio</span>
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onNavigateTab('video');
                    }}
                    className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center space-x-1.5"
                  >
                    <Video className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Generate Video</span>
                  </button>
                </div>
              </div>
            </div>
          ) : needsConfirmation ? (
            /* Duplicate Confirmation State */
            <div className="p-4 rounded-xl bg-slate-900 border border-amber-500/40 space-y-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Existing Pitch Frame Detected
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    PitchForge already has a generated pitch frame (<strong>&ldquo;{existingFrameTitle}&rdquo;</strong>) on this board. Replace it or create a new version?
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  onClick={() => handleSendToMiro({ replaceExisting: true })}
                  className="flex-1 py-2.5 px-3 rounded-lg text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                  <span>Update Existing Frame</span>
                </button>

                <button
                  onClick={() => handleSendToMiro({ createVersion: true })}
                  className="flex-1 py-2.5 px-3 rounded-lg text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 flex items-center justify-center space-x-1.5 transition-all shadow-md"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Create Version {nextVersion}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Main Form Input State */
            <div className="space-y-4">
              {/* Auth Status Banner */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${isAuthenticated ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  <span className="text-slate-300 font-medium">
                    {isCheckingAuth 
                      ? 'Checking Miro connection...' 
                      : isAuthenticated 
                      ? 'Connected via Miro OAuth' 
                      : 'Miro Account Not Connected'}
                  </span>
                </div>

                {!isAuthenticated && !isCheckingAuth && (
                  <button
                    onClick={handleConnectMiro}
                    className="text-[11px] font-bold text-amber-300 hover:text-amber-200 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/30"
                  >
                    Connect Miro
                  </button>
                )}
              </div>

              {/* Board Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Target Miro Board ID or URL <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={boardIdInput}
                  onChange={(e) => setBoardIdInput(e.target.value)}
                  placeholder="e.g. uXjVO... or https://miro.com/app/board/uXjVO.../"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              {/* Available User Boards Dropdown if authenticated */}
              {availableBoards.length > 0 && (
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                    Or Select from Your Boards:
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1">
                    {availableBoards.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setBoardIdInput(b.id)}
                        className={`text-[11px] px-2.5 py-1 rounded-md border text-left truncate max-w-[200px] transition-colors ${
                          boardIdInput === b.id
                            ? 'bg-amber-400/20 text-amber-300 border-amber-400/60'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                        }`}
                      >
                        {b.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* What will be written */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5 text-xs text-slate-400">
                <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider block">
                  Items to be placed inside &ldquo;🚀 PitchForge AI Pitch&rdquo; frame:
                </span>
                <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-300">
                  <span>• Problem & Target Users</span>
                  <span>• Pain Points & Solution</span>
                  <span>• Value Prop & Differentiation</span>
                  <span>• Technical Architecture Nodes</span>
                  <span>• Pitch Readiness Score (8 breakdown bars)</span>
                  <span>• 🔥 Attack My Pitch Critique</span>
                  <span>• 10-Slide Pitch Speaker Scripts</span>
                  <span>• AI Judge Defense Questions</span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Real items created via Miro API.
                </span>

                <div className="flex space-x-2">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => handleSendToMiro()}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-[#FFD02F] hover:bg-[#F2C425] shadow-lg shadow-amber-500/20 flex items-center space-x-1.5 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Send Pitch to Miro</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
