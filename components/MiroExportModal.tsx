'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  RotateCcw,
  PlusCircle,
  Video,
  Presentation,
  Volume2,
  ChevronDown,
  Check,
  Key,
  ShieldCheck
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
  const [boardIdInput, setBoardIdInput] = useState('uXjVEervL50=');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [availableBoards, setAvailableBoards] = useState<{ id: string; name: string; description?: string; viewLink?: string }[]>([
    { id: 'uXjVEervL50=', name: 'qwen', viewLink: 'https://miro.com/app/board/uXjVEervL50=' }
  ]);
  const [boardFetchError, setBoardFetchError] = useState<string | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);

  // Direct Token Management
  const [customTokenInput, setCustomTokenInput] = useState('');
  const [isSavingToken, setIsSavingToken] = useState(false);
  const [tokenSaveSuccess, setTokenSaveSuccess] = useState(false);
  const [showTokenSettings, setShowTokenSettings] = useState(false);

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
    warning?: string;
  } | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setSuccessResult(null);
      setNeedsConfirmation(false);
      setErrorMessage(null);
      return;
    }

    if (project?.miroBoardUrl) {
      const extracted = extractBoardIdFromUrl(project.miroBoardUrl) || project.miroBoardUrl;
      setBoardIdInput(extracted);
    }

    checkAuthStatus();
  }, [isOpen, project]);

  const checkAuthStatus = async () => {
    setIsCheckingAuth(true);
    setBoardFetchError(null);
    try {
      const res = await fetch('/api/miro/status');
      const data = await res.json();
      const connected = Boolean(data.connected);
      setIsConnected(connected);

      try {
        const boardsRes = await fetch('/api/miro/boards');
        const boardsData = await boardsRes.json();
        if (boardsRes.ok && boardsData.boards && boardsData.boards.length > 0) {
          setAvailableBoards(boardsData.boards);
          const currentId = boardIdInput || (project?.miroBoardUrl ? extractBoardIdFromUrl(project.miroBoardUrl) : '');
          const matched = boardsData.boards.find((b: any) => b.id === currentId);
          if (matched) {
            setBoardIdInput(matched.id);
          } else {
            setBoardIdInput(boardsData.boards[0].id);
          }
        } else {
          // Keep connected default fallback
          setAvailableBoards([{ id: 'uXjVEervL50=', name: 'qwen', viewLink: 'https://miro.com/app/board/uXjVEervL50=' }]);
          if (!boardIdInput) setBoardIdInput('uXjVEervL50=');
        }
      } catch (bErr: any) {
        console.warn('Failed to fetch Miro boards:', bErr);
        setAvailableBoards([{ id: 'uXjVEervL50=', name: 'qwen', viewLink: 'https://miro.com/app/board/uXjVEervL50=' }]);
        if (!boardIdInput) setBoardIdInput('uXjVEervL50=');
      }
    } catch (e) {
      console.warn('Failed to check Miro status:', e);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const handleSaveToken = async (tokenVal?: string) => {
    const val = (tokenVal || customTokenInput).trim();
    if (!val) return;
    setIsSavingToken(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/miro/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: val }),
      });
      const data = await res.json();
      if (res.ok) {
        setTokenSaveSuccess(true);
        setIsConnected(true);
        setShowTokenSettings(false);
        setCustomTokenInput('');
        setTimeout(() => setTokenSaveSuccess(false), 5000);
        await checkAuthStatus();
      } else {
        setErrorMessage(data.message || 'Failed to save Miro token');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save token');
    } finally {
      setIsSavingToken(false);
    }
  };

  const handleConnectMiro = () => {
    setShowTokenSettings(true);
  };

  const handleSendToMiro = async (options?: { replaceExisting?: boolean; createVersion?: boolean }) => {
    const rawBoardId = boardIdInput.trim();
    if (!rawBoardId) {
      setErrorMessage('Please select or enter a Miro Board.');
      return;
    }

    const cleanBoardId = extractBoardIdFromUrl(rawBoardId) || rawBoardId;

    setIsSubmitting(true);
    setErrorMessage(null);
    setStepStatus('Inspecting Miro canvas and positioning PitchForge items...');

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
        setErrorMessage(data.message || 'Unable to access this Miro board. You can enter or update your Miro Access Token below.');
        setShowTokenSettings(true);
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
        warning: data.warning,
      });
    } catch (err: any) {
      console.error('Error writing to Miro:', err);
      setErrorMessage(err.message || 'Unable to access this Miro board.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const checklistItems = [
    'Pitch Frame',
    'Problem Analysis',
    'Solution',
    'Pitch Score',
    'Attack My Pitch',
    'Speaker Script',
    'Judge Questions',
    'Architecture',
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#0B0B0B] border border-white/[0.08] rounded-xs shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Flame Accent Line */}
        <div className="h-[2px] w-full bg-gradient-to-r from-[#FF6A00] via-[#FF4D00] to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-[#0E0E0E]">
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 rounded-xs bg-[#141414] border border-[#FF4D00]/40 flex items-center justify-center text-[#FF4D00] font-mono font-bold text-xs shadow-flame-sm">
              M
            </div>
            <div>
              <h2 className="text-sm font-mono font-black text-white tracking-widest uppercase">
                SEND PITCH TO MIRO
              </h2>
              <span className="text-[10px] font-mono text-[#FF6A00]">
                REAL MIRO BOARD WRITE-BACK
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1 rounded-xs text-zinc-500 hover:text-white hover:bg-white/[0.06] transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 rounded-xs bg-red-950/20 border border-red-500/30 text-red-300 text-xs flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#FF2D00]" />
              <div className="flex-1">
                <span>{errorMessage}</span>
                <div className="mt-2.5 flex items-center space-x-2">
                  <button
                    onClick={() => setShowTokenSettings(true)}
                    className="px-3 py-1 bg-[#FF4D00] text-black font-mono font-bold rounded-xs text-[11px] shadow-sm hover:bg-[#FF6A00] transition-colors flex items-center space-x-1"
                  >
                    <Key className="w-3 h-3" />
                    <span>ENTER ACCESS TOKEN</span>
                  </button>
                  <button
                    onClick={() => setErrorMessage(null)}
                    className="px-2 py-1 text-zinc-400 hover:text-white font-mono text-[11px]"
                  >
                    DISMISS
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Submitting Animation */}
          {isSubmitting ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full border-4 border-[#FF4D00]/20 border-t-[#FF4D00] animate-spin flex items-center justify-center shadow-flame">
                <Sparkles className="w-5 h-5 text-[#FF6A00] animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white uppercase font-mono tracking-wider">
                  CREATING REAL MIRO WORKSPACE
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  {stepStatus || 'Generating frame, sticky notes, architecture flow & judge defenses...'}
                </p>
              </div>
              <div className="text-[10px] text-[#FF6A00] bg-[#FF4D00]/10 py-1 px-3 rounded-xs border border-[#FF4D00]/30 inline-block font-mono tracking-widest uppercase">
                MIRO REST API V2 • LIVE GRID POSITIONING
              </div>
            </div>
          ) : successResult ? (
            /* Success State */
            <div className="py-4 space-y-5">
              <div className="p-5 rounded-xs bg-emerald-950/20 border border-emerald-500/30 text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-extrabold text-white uppercase font-mono tracking-wide">
                  ✓ Pitch Generated on Your Miro Board
                </h3>
                <p className="text-xs text-zinc-300">
                  Created frame <strong>&ldquo;{successResult.frameTitle}&rdquo;</strong> with {successResult.itemsCreatedCount} structured items.
                </p>
              </div>

              <div className="space-y-2.5">
                <a
                  href={successResult.boardUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-flame w-full py-3 rounded-xs font-mono font-extrabold flex items-center justify-center space-x-2 text-xs"
                >
                  <span>OPEN IN MIRO CANVAS</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateTab('overview');
                    }}
                    className="p-2.5 rounded-xs bg-[#121212] hover:bg-[#1A1A1A] border border-white/[0.08] text-xs font-mono font-semibold text-zinc-300 flex items-center justify-center space-x-1.5"
                  >
                    <span>VIEW BOARD</span>
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onNavigateTab('presentation');
                    }}
                    className="p-2.5 rounded-xs bg-[#121212] hover:bg-[#1A1A1A] border border-white/[0.08] text-xs font-mono font-semibold text-zinc-300 flex items-center justify-center space-x-1.5"
                  >
                    <span>PITCH DECK</span>
                  </button>
                </div>
              </div>
            </div>
          ) : needsConfirmation ? (
            /* Duplicate Prompt State */
            <div className="p-5 rounded-xs bg-[#111111] border border-[#FF4D00]/40 space-y-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-[#FF6A00] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    PitchForge already generated a pitch on this board.
                  </h4>
                  <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                    Existing frame <strong>&ldquo;{existingFrameTitle}&rdquo;</strong> was found. Would you like to update the existing frame or create a new version?
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  onClick={() => handleSendToMiro({ replaceExisting: true })}
                  className="flex-1 py-2.5 px-3 rounded-xs text-xs font-mono font-bold text-white bg-[#181818] hover:bg-[#222222] border border-white/[0.1] flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#FF6A00]" />
                  <span>[Update Existing]</span>
                </button>

                <button
                  onClick={() => handleSendToMiro({ createVersion: true })}
                  className="btn-flame flex-1 py-2.5 px-3 rounded-xs text-xs font-mono font-extrabold flex items-center justify-center space-x-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>[Create New Version {nextVersion}]</span>
                </button>
              </div>
            </div>
          ) : (
            /* Main Form Input State */
            <div className="space-y-4">
              {/* Status Banner */}
              <div className="p-3.5 rounded-xs bg-[#101010] border border-white/[0.08] flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-[#FF4D00]'}`} />
                  <span className="font-mono text-zinc-200 font-bold uppercase tracking-wider">
                    {isCheckingAuth 
                      ? 'CHECKING MIRO CONNECTION...' 
                      : isConnected 
                      ? '🟢 MIRO CONNECTED' 
                      : '🟡 MIRO NOT CONNECTED'}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowTokenSettings(!showTokenSettings)}
                    className="text-[11px] font-mono text-zinc-400 hover:text-white bg-[#141414] hover:bg-[#1A1A1A] border border-white/[0.08] px-2.5 py-1 rounded-xs flex items-center space-x-1 transition-colors"
                  >
                    <Key className="w-3 h-3 text-[#FF4D00]" />
                    <span>{showTokenSettings ? 'HIDE TOKEN' : '⚙️ ACCESS TOKEN'}</span>
                  </button>

                  {!isConnected && !isCheckingAuth && (
                    <button
                      onClick={handleConnectMiro}
                      className="text-xs font-mono font-bold text-black bg-[#FF4D00] hover:bg-[#FF6A00] px-3 py-1 rounded-xs transition-colors"
                    >
                      CONNECT MIRO
                    </button>
                  )}
                </div>
              </div>

              {/* Direct Token Settings Panel */}
              {(showTokenSettings || (!isConnected && !isCheckingAuth)) && (
                <div className="p-4 rounded-xs bg-[#101010] border border-[#FF4D00]/30 space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-zinc-200 uppercase flex items-center space-x-1.5">
                      <Key className="w-3.5 h-3.5 text-[#FF4D00]" />
                      <span>DIRECT MIRO ACCESS TOKEN</span>
                    </span>
                    {tokenSaveSuccess && (
                      <span className="text-[10px] font-mono text-emerald-400 flex items-center space-x-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>SAVED & ACTIVATED</span>
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="password"
                      value={customTokenInput}
                      onChange={(e) => setCustomTokenInput(e.target.value)}
                      placeholder="Paste Miro token (e.g. eyJtaXJv...)"
                      className="flex-1 bg-[#141414] border border-white/[0.1] rounded-xs px-3 py-1.5 text-xs font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF4D00]"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveToken()}
                      disabled={isSavingToken || !customTokenInput.trim()}
                      className="px-3.5 py-1.5 bg-[#FF4D00] hover:bg-[#FF6A00] text-black font-mono font-bold text-xs rounded-xs disabled:opacity-40 transition-colors shrink-0"
                    >
                      {isSavingToken ? 'SAVING...' : 'SAVE TOKEN'}
                    </button>
                  </div>
                  <p className="text-[10px] font-mono text-zinc-500">
                    Connects directly without OAuth redirect. Saved to secure environment for write-back.
                  </p>
                </div>
              )}

              {/* Board Selector */}
              {isConnected && (
                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">
                    SELECT MIRO BOARD <span className="text-[#FF4D00]">*</span>
                  </label>

                  {boardFetchError ? (
                    <div className="p-3 rounded-xs bg-[#121212] border border-white/[0.08] text-xs text-zinc-300">
                      {boardFetchError}
                    </div>
                  ) : availableBoards.length > 0 ? (
                    <div className="relative">
                      <select
                        value={boardIdInput}
                        onChange={(e) => setBoardIdInput(e.target.value)}
                        className="w-full appearance-none bg-[#121212] border border-white/[0.1] hover:border-[#FF4D00]/50 focus:border-[#FF4D00] rounded-xs px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none transition-colors pr-9"
                      >
                        {availableBoards.map((b) => (
                          <option key={b.id} value={b.id} className="bg-[#121212] text-white">
                            {b.name} ({b.id})
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  ) : (
                    <div className="p-3 rounded-xs bg-[#121212] border border-white/[0.08] text-xs font-mono text-zinc-400">
                      No accessible Miro boards were found.
                    </div>
                  )}

                  {/* Advanced Fallback */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setShowManualInput(!showManualInput)}
                      className="text-[11px] font-mono text-zinc-500 hover:text-zinc-300 underline"
                    >
                      {showManualInput ? '− Hide manual ID fallback' : '+ Or enter custom Board ID / URL'}
                    </button>

                    {showManualInput && (
                      <input
                        type="text"
                        value={boardIdInput}
                        onChange={(e) => setBoardIdInput(e.target.value)}
                        placeholder="e.g. uXjVO... or https://miro.com/app/board/uXjVO.../"
                        className="w-full mt-1.5 bg-[#121212] border border-white/[0.1] rounded-xs px-3 py-2 text-xs font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF4D00]"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Generated Content Checklist */}
              <div className="p-4 rounded-xs bg-[#0F0F0F] border border-white/[0.06] space-y-2">
                <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-zinc-400 block">
                  GENERATED CONTENT TO BE WRITTEN ON BOARD:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono text-zinc-300">
                  {checklistItems.map((item) => (
                    <div key={item} className="flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 text-[#FF4D00] shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] font-mono text-zinc-500">
                  Creates native Miro frames, text & shapes.
                </span>

                <div className="flex space-x-2">
                  <button
                    onClick={onClose}
                    className="px-3.5 py-2 text-xs font-mono text-zinc-500 hover:text-white"
                  >
                    CANCEL
                  </button>

                  <button
                    onClick={() => handleSendToMiro()}
                    disabled={!isConnected && !boardIdInput}
                    className="btn-flame px-5 py-2.5 rounded-xs text-xs font-mono font-extrabold flex items-center space-x-1.5 disabled:opacity-40"
                  >
                    <span>✦ SEND TO MIRO</span>
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
