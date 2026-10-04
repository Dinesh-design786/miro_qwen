'use client';

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Tag, 
  ExternalLink, 
  Plus, 
  Filter, 
  Layers, 
  AlertTriangle, 
  CheckCircle, 
  HelpCircle,
  Sparkles,
  Search
} from 'lucide-react';
import { BoardContext, BoardItem } from '@/types';

interface MiroBoardViewerProps {
  boardContext: BoardContext;
  isDemo?: boolean;
  onAnalyzeIdea?: () => void;
  onAddItem?: (item: Partial<BoardItem>) => void;
}

export function MiroBoardViewer({
  boardContext,
  isDemo,
  onAnalyzeIdea,
  onAddItem,
}: MiroBoardViewerProps) {
  const [filterTag, setFilterTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<BoardItem | null>(null);

  // Derive unique tags
  const allTags = Array.from(
    new Set(boardContext.items.flatMap(i => i.tags || []))
  );

  const filteredItems = boardContext.items.filter(item => {
    if (filterTag !== 'all' && (!item.tags || !item.tags.includes(filterTag))) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = (item.text || '').toLowerCase().includes(q);
      const matchAuthor = (item.author || '').toLowerCase().includes(q);
      const matchFrame = (item.frameTitle || '').toLowerCase().includes(q);
      return matchText || matchAuthor || matchFrame;
    }
    return true;
  });

  const stickyCount = boardContext.items.filter(i => i.type === 'sticky_note').length;
  const frameCount = boardContext.frames?.length || 4;

  const handleAddQuickSticky = () => {
    const text = prompt('Enter text for new Miro sticky note:');
    if (text && text.trim() && onAddItem) {
      onAddItem({
        id: `item-${Date.now()}`,
        type: 'sticky_note',
        text: text.trim(),
        color: '#FEF08A',
        author: 'User (Live)',
        frameTitle: 'User Brainstorm',
        tags: ['user-note'],
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Integration Context */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#FFD02F] text-[#050038] flex items-center justify-center font-black text-xl shadow-lg">
            M
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-white tracking-tight">
                {boardContext.title}
              </h2>
              {isDemo && (
                <span className="text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
                  Demo Workspace Canvas
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5 max-w-xl">
              {boardContext.description || 'Normalized Miro board context fed into Qwen reasoning engine.'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleAddQuickSticky}
            className="text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Add Sticky Note</span>
          </button>

          {onAnalyzeIdea && (
            <button
              onClick={onAnalyzeIdea}
              className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 px-3.5 py-1.5 rounded-lg flex items-center space-x-1.5 shadow-md shadow-indigo-600/30 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Analyze with Qwen</span>
            </button>
          )}
        </div>
      </div>

      {/* Metrics & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center space-x-3 text-xs text-slate-400">
          <span className="flex items-center space-x-1 text-slate-300 font-medium">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>{boardContext.items.length} Elements</span>
          </span>
          <span>•</span>
          <span>{stickyCount} Sticky Notes</span>
          <span>•</span>
          <span>{frameCount} Frames</span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto">
          <div className="relative">
            <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search board..."
              className="bg-slate-800/90 border border-slate-700/80 rounded-md pl-7 pr-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={() => setFilterTag('all')}
            className={`text-[11px] font-medium px-2.5 py-1 rounded-md transition-colors ${
              filterTag === 'all'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white bg-slate-800'
            }`}
          >
            All
          </button>
          {allTags.slice(0, 4).map(tag => (
            <button
              key={tag}
              onClick={() => setFilterTag(tag)}
              className={`text-[11px] font-medium px-2.5 py-1 rounded-md transition-colors capitalize ${
                filterTag === tag
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white bg-slate-800'
              }`}
            >
              {tag.replace(/-/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Miro Sticky Notes Canvas Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.map((item) => {
          const isSticky = item.type === 'sticky_note';
          const isFrame = item.type === 'frame';
          const isConnector = item.type === 'connector';

          if (isFrame) {
            return (
              <div
                key={item.id}
                className="col-span-full py-2 px-4 rounded-lg bg-indigo-950/30 border border-indigo-500/20 flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">
                    FRAME
                  </span>
                  <span className="text-sm font-semibold text-slate-200">
                    {item.text}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  Coordinates: X:{item.position?.x} Y:{item.position?.y}
                </span>
              </div>
            );
          }

          if (isConnector) {
            return (
              <div
                key={item.id}
                className="col-span-full p-2.5 rounded-lg bg-slate-900/40 border border-dashed border-slate-700 flex items-center justify-between text-xs text-slate-400"
              >
                <span className="font-mono text-[11px] text-indigo-400">↳ Visual Flow Connector:</span>
                <span className="text-slate-300 italic">{item.text}</span>
              </div>
            );
          }

          return (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              style={{
                borderLeftColor: item.color || '#FEF08A',
                borderLeftWidth: '4px',
              }}
              className="group relative bg-[#111827] border border-slate-800 rounded-xl p-4 shadow-md hover:border-slate-700 hover:shadow-xl hover:translate-y-[-2px] transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Note Header / Meta */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    {item.frameTitle || 'Miro Canvas'}
                  </span>
                  {item.author && (
                    <span className="text-[10px] text-slate-400 font-mono">
                      {item.author}
                    </span>
                  )}
                </div>

                {/* Content */}
                <p className="text-xs font-medium text-slate-200 leading-relaxed">
                  {item.text}
                </p>
              </div>

              {/* Tags & Classification */}
              <div className="mt-3.5 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {item.tags?.map(t => (
                    <span
                      key={t}
                      className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                <div 
                  className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: item.color || '#FEF08A' }}
                  title="Canvas color"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Item Modal Detail */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[#0F172A] border border-slate-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3.5 h-3.5 rounded-full"
                  style={{ backgroundColor: selectedItem.color || '#FEF08A' }}
                />
                <h3 className="text-sm font-bold text-white">
                  Miro Board Element Detail
                </h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Content:</span>
                <p className="text-sm text-slate-200 mt-1 font-medium bg-slate-900 p-3 rounded-lg border border-slate-800">
                  {selectedItem.text}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                <div>
                  <span className="text-[10px] uppercase font-semibold">Author:</span>
                  <p className="text-slate-200">{selectedItem.author || 'Unknown'}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold">Frame:</span>
                  <p className="text-slate-200">{selectedItem.frameTitle || 'Root Canvas'}</p>
                </div>
              </div>

              {selectedItem.tags && selectedItem.tags.length > 0 && (
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Tags:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {selectedItem.tags.map(t => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-500/30 text-indigo-300">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
