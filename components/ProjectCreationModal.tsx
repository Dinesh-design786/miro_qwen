'use client';

import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Play, 
  HelpCircle, 
  Layers, 
  Loader2, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Project } from '@/types';

interface ProjectCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (projectData: Partial<Project>) => void;
  onLoadDemo: () => void;
  isLoading: boolean;
  loadingStepText?: string;
}

export function ProjectCreationModal({
  isOpen,
  onClose,
  onSubmit,
  onLoadDemo,
  isLoading,
  loadingStepText,
}: ProjectCreationModalProps) {
  const [name, setName] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [solutionDescription, setSolutionDescription] = useState('');
  const [miroBoardUrl, setMiroBoardUrl] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');
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

  const handleFillSample = () => {
    setName('AI Resume Intelligence');
    setProblemStatement('Students and early-career developers struggle to understand whether their GitHub projects actually demonstrate the skills required for their target tech jobs.');
    setTargetAudience('College CS seniors and self-taught developers applying for junior software engineering roles.');
    setSolutionDescription('An automated resume auditor that analyzes actual GitHub code repositories against live job descriptions, generating skill validation badges and project gap recommendations.');
    setMiroBoardUrl('https://miro.com/app/board/uXjVOResumeIntelligenceDemo/');
    setAdditionalContext('Surveyed 45 CS students at hackathon; 82% stated they get zero feedback on why their portfolio was rejected.');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0E1526] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0B101D]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Step 1 of 2
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Tell us about your idea
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Loading Overlay when processing Qwen analysis */}
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-5 text-center">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Qwen Reasoning in Progress
              </h3>
              <p className="text-sm text-slate-400 mt-1 max-w-md">
                {loadingStepText || 'Extracting Miro workspace items, auditing claims, and evaluating pitch readiness...'}
              </p>
            </div>
            <div className="flex items-center space-x-2 text-xs text-amber-400/90 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
              <span>Auditing for unsupported statistics and platform risks</span>
            </div>
          </div>
        ) : (
          /* Form Body */
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Quick Fill Toolbar */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <span className="text-xs text-slate-400">Want to test quickly?</span>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={handleFillSample}
                  className="text-[11px] font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded border border-slate-700 transition-colors"
                >
                  Insert Sample Idea
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onLoadDemo();
                  }}
                  className="text-[11px] font-semibold text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded border border-amber-500/30 transition-colors flex items-center space-x-1"
                >
                  <Play className="w-3 h-3 fill-amber-300" />
                  <span>Load Full Demo</span>
                </button>
              </div>
            </div>

            {/* Project Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Project Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. AI Resume Intelligence"
                className="w-full bg-slate-900/90 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Problem Statement */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Problem Statement <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={3}
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                placeholder="What painful friction or bottleneck do users face today?"
                className="w-full bg-slate-900/90 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Audience <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g. Students & early developers, Engineering Managers at SaaS scaleups"
                className="w-full bg-slate-900/90 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Optional Solution */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Proposed Solution <span className="text-slate-500 font-normal">(Optional)</span>
              </label>
              <textarea
                rows={2}
                value={solutionDescription}
                onChange={(e) => setSolutionDescription(e.target.value)}
                placeholder="How does your technology resolve this pain?"
                className="w-full bg-slate-900/90 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Miro Board URL */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Miro Board URL <span className="text-slate-500 font-normal">(Optional)</span>
                </label>
                <span className="text-[11px] text-amber-400/90">
                  Leave empty to auto-load realistic Miro board
                </span>
              </div>
              <input
                type="url"
                value={miroBoardUrl}
                onChange={(e) => setMiroBoardUrl(e.target.value)}
                placeholder="https://miro.com/app/board/uXjV..."
                className="w-full bg-slate-900/90 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Additional Context */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Additional Notes or Team Context <span className="text-slate-500 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
                placeholder="e.g. 5 user interviews conducted, 2 prototype repos built"
                className="w-full bg-slate-900/90 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Footer Submit */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Qwen will audit your claims against empirical evidence.
              </span>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 flex items-center space-x-1.5 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Analyze My Idea</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
