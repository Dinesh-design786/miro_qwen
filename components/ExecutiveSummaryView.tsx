'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  ArrowRight,
  Printer
} from 'lucide-react';
import { ExecutiveSummary } from '@/types';
import { exportSummaryAsMarkdown } from '@/services/export/pptxExport';

interface ExecutiveSummaryViewProps {
  summary: ExecutiveSummary;
  onProceedToPackage: () => void;
}

export function ExecutiveSummaryView({
  summary,
  onProceedToPackage,
}: ExecutiveSummaryViewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const md = exportSummaryAsMarkdown(summary);
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const md = exportSummaryAsMarkdown(summary);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${summary.projectName.replace(/\s+/g, '_')}_Executive_Summary.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const sections = [
    { title: 'The Problem', content: summary.problem, color: 'text-rose-400' },
    { title: 'The Solution', content: summary.solution, color: 'text-indigo-400' },
    { title: 'Target Market & Wedge', content: summary.targetMarket, color: 'text-amber-400' },
    { title: 'Competitive Differentiation', content: summary.differentiation, color: 'text-emerald-400' },
    { title: 'Technology & Architecture', content: summary.technology, color: 'text-cyan-400' },
    { title: 'Business Model', content: summary.businessModel, color: 'text-violet-400' },
    { title: 'Measurable Impact', content: summary.impact, color: 'text-emerald-400' },
    { title: 'Current Status', content: summary.currentStatus, color: 'text-slate-300' },
    { title: 'Next Milestone', content: summary.nextMilestone, color: 'text-amber-300' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">
            1-PAGE BRIEFING
          </span>
          <h2 className="text-xl font-extrabold text-white tracking-tight mt-0.5">
            Executive Summary
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            A concise, high-density briefing for angel investors, hackathon judges, and engineering leads.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0">
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center space-x-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Summary'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center space-x-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Markdown</span>
          </button>
        </div>
      </div>

      {/* 1-Page Document Container */}
      <div className="max-w-4xl mx-auto glass-panel p-8 sm:p-12 rounded-3xl border border-slate-700/80 shadow-2xl space-y-8 bg-[#0D1322]">
        {/* Document Header */}
        <div className="border-b border-slate-800 pb-6">
          <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest block mb-1">
            CONFIDENTIAL BRIEFING • PITCHFORGE STUDIO
          </span>
          <h1 className="text-3xl font-black text-white tracking-tight">
            {summary.projectName}
          </h1>
          <p className="text-sm font-medium text-slate-300 mt-1 italic">
            &ldquo;{summary.tagline}&rdquo;
          </p>
        </div>

        {/* 2-Column High-Density Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((sec, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80">
              <span className={`text-[11px] font-bold uppercase tracking-wider block mb-1 ${sec.color}`}>
                {sec.title}
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-normal">
                {sec.content}
              </p>
            </div>
          ))}
        </div>

        {/* Footer Attribution */}
        <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Synthesized by Qwen Reasoning Engine • Miro Collaborative Ground Truth</span>
          <span className="font-mono">PitchForge Verification Verified</span>
        </div>
      </div>
    </div>
  );
}
