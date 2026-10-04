'use client';

import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Play, 
  Layers, 
  AlertCircle,
  Lightbulb,
  Check,
  ChevronRight,
  Zap
} from 'lucide-react';
import { Project } from '@/types';
import { ALL_SAMPLE_IDEAS, SampleIdea } from '@/data/sampleProjects';

interface ProjectCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (projectData: Partial<Project>) => void;
  onLoadDemo: () => void;
  onLoadSampleIdea?: (sample: SampleIdea) => void;
  isLoading: boolean;
  loadingStepText?: string;
}

export function ProjectCreationModal({
  isOpen,
  onClose,
  onSubmit,
  onLoadDemo,
  onLoadSampleIdea,
  isLoading,
  loadingStepText,
}: ProjectCreationModalProps) {
  const [name, setName] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [solutionDescription, setSolutionDescription] = useState('');
  const [miroBoardUrl, setMiroBoardUrl] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a project name.');
      return;
    }
    if (!problemStatement.trim()) {
      setError('Please describe the problem you are solving.');
      return;
    }
    if (!targetAudience.trim()) {
      setError('Please specify your target audience or primary user.');
      return;
    }

    setError('');
    onSubmit({
      name: name.trim(),
      problemStatement: problemStatement.trim(),
      targetAudience: targetAudience.trim(),
      solutionDescription: solutionDescription.trim(),
      miroBoardUrl: miroBoardUrl.trim(),
      additionalContext: additionalContext.trim(),
    });
  };

  const handleSelectSample = (sample: SampleIdea) => {
    setSelectedSampleId(sample.id);
    setName(sample.project.name || '');
    setProblemStatement(sample.project.problemStatement || '');
    setTargetAudience(sample.project.targetAudience || '');
    setSolutionDescription(sample.project.solutionDescription || '');
    setMiroBoardUrl(sample.project.miroBoardUrl || '');
    setAdditionalContext(sample.project.additionalContext || '');
    setError('');
  };

  const handleInstantLaunchSample = (sample: SampleIdea) => {
    if (onLoadSampleIdea) {
      onLoadSampleIdea(sample);
      onClose();
    } else {
      handleSelectSample(sample);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0B0B0B] border border-white/[0.08] rounded-xs shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Flame Accent Line */}
        <div className="h-[2px] w-full bg-gradient-to-r from-[#FF6A00] via-[#FF4D00] to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-[#0E0E0E]">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#FF4D00]">
              STAGE 01 // THESIS INGESTION
            </span>
            <h2 className="text-base font-black text-white uppercase tracking-wide font-sans">
              INITIATE PITCH PROJECT
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1 rounded-xs text-zinc-500 hover:text-white hover:bg-white/[0.06] transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Loading Overlay when processing Qwen analysis */}
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-5 text-center">
            <div className="w-16 h-16 rounded-full border-4 border-[#FF4D00]/20 border-t-[#FF4D00] animate-spin flex items-center justify-center shadow-flame">
              <Sparkles className="w-6 h-6 text-[#FF6A00] animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase font-mono tracking-wider">
                QWEN REASONING IN PROGRESS
              </h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-md">
                {loadingStepText || 'Extracting Miro workspace items, auditing claims, and evaluating pitch readiness...'}
              </p>
            </div>
            <div className="text-[10px] text-[#FF6A00] bg-[#FF4D00]/10 py-1 px-3 rounded-xs border border-[#FF4D00]/30 inline-block font-mono tracking-widest uppercase">
              AUDITING FOR UNBACKED CLAIMS & ROOM ATTACKS
            </div>
          </div>
        ) : (
          /* Form Body */
          <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
            {error && (
              <div className="p-3 rounded-xs bg-red-950/20 border border-red-500/30 text-red-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#FF2D00]" />
                <span>{error}</span>
              </div>
            )}

            {/* Quick Demo Sample Ideas Selector */}
            <div className="space-y-2 p-3.5 rounded-xs bg-[#111111] border border-white/[0.06]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF6A00] flex items-center space-x-1.5">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>DEMO SAMPLE IDEAS (CLICK TO FILL)</span>
                </span>
                <span className="text-[10px] font-mono text-zinc-500">{ALL_SAMPLE_IDEAS.length} CURATED TEMPLATES</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
                {ALL_SAMPLE_IDEAS.map((sample) => {
                  const isSelected = selectedSampleId === sample.id;
                  return (
                    <div
                      key={sample.id}
                      onClick={() => handleSelectSample(sample)}
                      className={`p-2.5 rounded-xs border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#1A1A1A] border-[#FF4D00] shadow-sm'
                          : 'bg-[#141414] hover:bg-[#181818] border-white/[0.06] hover:border-white/[0.15]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] font-mono font-bold text-[#FF6A00] uppercase truncate">
                          {sample.category}
                        </span>
                        {isSelected && <Check className="w-3 h-3 text-[#FF4D00]" />}
                      </div>
                      <div className="text-xs font-bold text-white truncate font-sans">
                        {sample.name}
                      </div>
                      <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                        {sample.tagline}
                      </p>
                      
                      {onLoadSampleIdea && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInstantLaunchSample(sample);
                          }}
                          className="mt-2 w-full py-1 rounded-xs text-[9px] font-mono font-bold text-zinc-300 hover:text-white bg-white/[0.04] hover:bg-[#FF4D00]/20 border border-white/[0.08] hover:border-[#FF4D00]/40 flex items-center justify-center space-x-1 transition-all"
                        >
                          <Zap className="w-2.5 h-2.5 text-[#FF6A00]" />
                          <span>1-Click Full Demo</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Field 1: Project Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
                Project Name <span className="text-[#FF4D00]">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. AI Bug Triage Agent"
                className="w-full bg-[#121212] border border-white/[0.1] rounded-xs px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-hidden focus:border-[#FF4D00] font-sans"
              />
            </div>

            {/* Field 2: Problem Statement */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
                The Problem <span className="text-[#FF4D00]">*</span>
              </label>
              <textarea
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                rows={3}
                placeholder="What broken workflow, painful cost, or chronic friction are you solving?"
                className="w-full bg-[#121212] border border-white/[0.1] rounded-xs px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-hidden focus:border-[#FF4D00] font-sans leading-relaxed"
              />
            </div>

            {/* Field 3: Target Audience */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
                Target User / Audience <span className="text-[#FF4D00]">*</span>
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g. Engineering managers and tech leads at 50-200 dev scaleups"
                className="w-full bg-[#121212] border border-white/[0.1] rounded-xs px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-hidden focus:border-[#FF4D00] font-sans"
              />
            </div>

            {/* Field 4: Solution Description */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
                Proposed Solution
              </label>
              <textarea
                value={solutionDescription}
                onChange={(e) => setSolutionDescription(e.target.value)}
                rows={2}
                placeholder="How does your product solve this? What is your core value prop?"
                className="w-full bg-[#121212] border border-white/[0.1] rounded-xs px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-hidden focus:border-[#FF4D00] font-sans leading-relaxed"
              />
            </div>

            {/* Field 5: Miro Board URL */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center justify-between">
                <span>Miro Board URL / ID</span>
                <span className="text-[10px] text-zinc-500 font-normal">Optional</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={miroBoardUrl}
                  onChange={(e) => setMiroBoardUrl(e.target.value)}
                  placeholder="https://miro.com/app/board/uXjVO123abc="
                  className="w-full bg-[#121212] border border-white/[0.1] rounded-xs px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-hidden focus:border-[#FF4D00] font-mono"
                />
                <div className="absolute right-3 top-2.5 text-zinc-500 pointer-events-none">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Field 6: Additional Context & Claims */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center justify-between">
                <span>Validation Proof & Claims</span>
                <span className="text-[10px] text-zinc-500 font-normal">Optional</span>
              </label>
              <textarea
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
                rows={2}
                placeholder="Any customer interview data, pilot benchmarks, or claims to audit?"
                className="w-full bg-[#121212] border border-white/[0.1] rounded-xs px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-hidden focus:border-[#FF4D00] font-sans leading-relaxed"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn-flame px-6 py-2.5 rounded-xs text-xs font-mono font-extrabold flex items-center space-x-2"
              >
                <span>✦ INITIATE PITCHFORGE AUDIT</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
