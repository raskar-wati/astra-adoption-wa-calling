import React, { useState } from 'react';
import { Check, Upload, ChevronDown, ChevronUp } from 'lucide-react';
import {
  ScorecardDraft,
  TemplateId,
  TEMPLATE_META,
  TEMPLATE_SECTIONS,
  makeSection,
} from './types';

interface SetupStepProps {
  draft: ScorecardDraft;
  onChange: (updates: Partial<ScorecardDraft>) => void;
}

type Direction = 'inbound' | 'outbound' | 'both';

export function SetupStep({ draft, onChange }: SetupStepProps) {
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleTemplateSelect = (id: TemplateId) => {
    if (id === draft.templateId) return;

    let sections = draft.sections;
    if (id === 'scratch') {
      sections = draft.sections.length === 0 ? [makeSection()] : draft.sections;
    } else {
      sections = TEMPLATE_SECTIONS[id as keyof typeof TEMPLATE_SECTIONS].map(s => ({
        ...s,
        id: `${s.id}-${Date.now()}`,
        questions: s.questions.map(q => ({ ...q, id: `${q.id}-${Date.now()}` })),
      }));
    }

    const meta = TEMPLATE_META.find(m => m.id === id)!;
    onChange({
      templateId: id,
      sections,
      direction: id === 'scratch' ? draft.direction : meta.direction,
    });
    setPreviewOpen(false);
  };

  const selectedMeta = TEMPLATE_META.find(m => m.id === draft.templateId);
  const previewSections =
    draft.templateId && draft.templateId !== 'scratch'
      ? TEMPLATE_SECTIONS[draft.templateId as keyof typeof TEMPLATE_SECTIONS]
      : null;

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-gray-900">Set up your scorecard</h1>
          <p className="text-gray-500 mt-1">Choose a starting point, then configure the details below.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ── Left: Template picker ── */}
          <div className="space-y-3">
            <p className="text-sm text-gray-600 font-medium uppercase tracking-wide">Starting point</p>

            {TEMPLATE_META.map(tmpl => {
              const isSelected = draft.templateId === tmpl.id;
              return (
                <button
                  key={tmpl.id}
                  onClick={() => handleTemplateSelect(tmpl.id)}
                  className={`w-full text-left flex items-start gap-3 p-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'border-primary bg-green-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl mt-0.5">{tmpl.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900 font-medium text-sm">{tmpl.title}</span>
                      {tmpl.tags.map(tag => (
                        <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{tmpl.description}</p>
                  </div>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </span>
                  )}
                </button>
              );
            })}

            {/* Import stub */}
            <button
              onClick={() => {}}
              className="w-full text-left flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-gray-200 bg-white hover:border-gray-300 transition-all opacity-70"
            >
              <Upload className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-gray-700 font-medium text-sm">Import from CSV / Excel</span>
                  <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">1 AI credit</span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">Upload a spreadsheet to auto-populate questions</p>
              </div>
            </button>

            {/* Template preview toggle */}
            {selectedMeta && previewSections && (
              <button
                onClick={() => setPreviewOpen(v => !v)}
                className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors px-1"
              >
                {previewOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {previewOpen ? 'Hide' : 'Preview'} template questions
              </button>
            )}

            {previewOpen && previewSections && (
              <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4 max-h-72 overflow-y-auto">
                {previewSections.map((section, si) => (
                  <div key={section.id}>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                      {si + 1}. {section.name}
                    </p>
                    <ul className="space-y-1.5">
                      {section.questions.map((q, qi) => (
                        <li key={q.id} className="flex items-start gap-2">
                          <span className="text-xs text-gray-400 mt-0.5 w-4 flex-shrink-0">
                            {qi + 1}.
                          </span>
                          <span className="text-xs text-gray-700">{q.text}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded ml-auto flex-shrink-0 ${
                            q.matchingMethod === 'hybrid'
                              ? 'bg-purple-50 text-purple-600'
                              : q.matchingMethod === 'llm'
                              ? 'bg-blue-50 text-blue-600'
                              : 'bg-gray-50 text-gray-500'
                          }`}>
                            {q.matchingMethod === 'hybrid' ? 'Hybrid' : q.matchingMethod === 'llm' ? 'LLM' : 'Keyword'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Config form ── */}
          <div className="space-y-5">
            <p className="text-sm text-gray-600 font-medium uppercase tracking-wide">Configuration</p>

            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">
                  Scorecard name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={draft.name}
                  onChange={e => onChange({ name: e.target.value })}
                  placeholder="e.g. Q2 Sales Quality Review"
                  className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors ${
                    draft.name === '' && draft.templateId
                      ? 'border-red-300 bg-red-50 focus:border-red-400'
                      : 'border-gray-200 bg-gray-50 focus:border-primary focus:bg-white'
                  }`}
                />
                {draft.name === '' && draft.templateId && (
                  <p className="text-xs text-red-500 mt-1">Name is required</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">
                  Description <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={draft.description}
                  onChange={e => onChange({ description: e.target.value })}
                  placeholder="What is this scorecard for?"
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm outline-none focus:border-primary focus:bg-white transition-colors resize-none"
                />
              </div>

              {/* Call direction */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">Call direction</label>
                <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                  {(['inbound', 'outbound', 'both'] as Direction[]).map((dir, i) => (
                    <button
                      key={dir}
                      onClick={() => onChange({ direction: dir })}
                      className={`flex-1 py-2 text-sm capitalize transition-colors ${
                        i > 0 ? 'border-l border-gray-200' : ''
                      } ${
                        draft.direction === dir
                          ? 'bg-primary text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {dir}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">Call duration filter</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Min duration (seconds)</label>
                    <input
                      type="number"
                      value={draft.minDuration}
                      onChange={e => onChange({ minDuration: e.target.value })}
                      placeholder="30"
                      min={0}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm outline-none focus:border-primary focus:bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Max duration <span className="text-gray-400">(optional)</span></label>
                    <input
                      type="number"
                      value={draft.maxDuration}
                      onChange={e => onChange({ maxDuration: e.target.value })}
                      placeholder="No limit"
                      min={0}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm outline-none focus:border-primary focus:bg-white transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tip */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-xs text-blue-700">
                <span className="font-medium">Tip:</span> Scorecards with 15 or fewer questions produce the most reliable AI grading results. You can always refine after activating.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
