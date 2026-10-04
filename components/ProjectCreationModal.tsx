'use client';

import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Play, 
  Layers, 
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
    setMiroBoardUrl('https://miro.com/app/board/uXjVEervL50=/');
    setAdditionalContext('Surveyed 45 CS students at hackathon; 82% stated they get zero feedback on why their portfolio was rejected.');
    setError('');
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
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
            {error && (
              <div className="p-3 rounded-xs bg-red-950/20 border border-red-500/30 text-red-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#FF2D00]" />
                <span>{error}</span>
              </div>
            )}

            {/* Quick Fill Toolbar */}
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <span className="text-xs font-mono text-zinc-500">Want to test quickly?</span>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={handleFillSample}
                  className="text-[11px] font-mono text-zinc-300 hover:text-white bg-[#141414] hover:bg-[#1A1A1A] px-2.5 py-1 rounded-xs border border-white/[0.08] transition-colors"
                >
                  Insert Sample Idea
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onLoadDemo();
                  }}
                  className="text-[11px] font-mono font-bold text-[#FF6A00] hover:text-[#FF4D00] bg-[#FF4D00]/10 hover:bg-[#FF4D00]/20 px-2.5 py-1 rounded-xs border border-[#FF4D00]/30 transition-colors flex items-center space-x-1"
                >
                  <Play className="w-3 h-3 fill-[#FF6A00]" />
                  <span>Load Full Demo</span>
                </button>
              </div>
            </div>

            {/* Project Name */}
            <div>
              <label className="block text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider mb-1">
                Project Name <span className="text-[#FF4D00]">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. AI Bug Triage Agent"
                className="w-full bg-[#121212] border border-white/[0.1] rounded-xs px-3.5 py-2 text-xs font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF4D00]"
              />
            </div>

            {/* Problem Statement */}
            <div>
              <label className="block text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider mb-1">
                Problem Statement <span className="text-[#FF4D00]">*</span>
              </label>
              <textarea
                rows={3}
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                placeholder="What painful friction or bottleneck do users face today?"
                className="w-full bg-[#121212] border border-white/[0.1] rounded-xs p-3 text-xs font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF4D00]"
              />
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider mb-1">
                Target Customer Persona <span className="text-[#FF4D00]">*</span>
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g. Senior engineering managers at mid-sized SaaS startups"
                className="w-full bg-[#121212] border border-white/[0.1] rounded-xs px-3.5 py-2 text-xs font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF4D00]"
              />
            </div>

            {/* Solution Description */}
            <div>
              <label className="block text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider mb-1">
                Solution & Secret Sauce
              </label>
              <textarea
                rows={2}
                value={solutionDescription}
                onChange={(e) => setSolutionDescription(e.target.value)}
                placeholder="How does your product solve this in a uniquely defensible way?"
                className="w-full bg-[#121212] border border-white/[0.1] rounded-xs p-3 text-xs font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF4D00]"
              />
            </div>

            {/* Miro Board URL */}
            <div>
              <label className="block text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider mb-1">
                Miro Board URL or ID (Optional)
              </label>
              <input
                type="text"
                value={miroBoardUrl}
                onChange={(e) => setMiroBoardUrl(e.target.value)}
                placeholder="https://miro.com/app/board/uXjV.../"
                className="w-full bg-[#121212] border border-white/[0.1] rounded-xs px-3.5 py-2 text-xs font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF4D00]"
              />
            </div>

            {/* Additional Context */}
            <div>
              <label className="block text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider mb-1">
                Evidence, Traction & Metrics (Optional)
              </label>
              <textarea
                rows={2}
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
                placeholder="Any customer quotes, survey data, benchmarks, or pilot statistics..."
                className="w-full bg-[#121212] border border-white/[0.1] rounded-xs p-3 text-xs font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF4D00]"
              />
            </div>

            {/* Submit Toolbar */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-mono text-zinc-500 hover:text-white"
              >
                CANCEL
              </button>

              <button
                type="submit"
                className="btn-flame px-5 py-2.5 rounded-xs text-xs font-mono font-extrabold flex items-center space-x-1.5"
              >
                <span>✦ INITIATE WAR ROOM REASONING</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
