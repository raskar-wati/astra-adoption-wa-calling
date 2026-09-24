import React, { useState } from 'react';
import {
  ChevronDown, ChevronUp, AlertCircle, AlertTriangle,
  CheckCircle2, Clock, Phone, Sparkles
} from 'lucide-react';
import { ScorecardDraft, ScorecardSection, QuestionDef, ValidationIssue } from './types';

interface PreviewStepProps {
  draft: ScorecardDraft;
  onClose: () => void;
}

// ─── Validation ────────────────────────────────────────────────────────────

function validate(draft: ScorecardDraft): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!draft.name.trim()) {
    issues.push({ type: 'error', message: 'Scorecard name is required. Go back to Setup to add one.' });
  }
  if (draft.sections.length === 0) {
    issues.push({ type: 'error', message: 'At least one section with questions is required.' });
  }

  draft.sections.forEach(section => {
    if (section.questions.length === 0) {
      issues.push({ type: 'error', message: `Section "${section.name}" has no questions.`, sectionId: section.id });
    }
    section.questions.forEach(q => {
      if (!q.text.trim()) {
        issues.push({ type: 'error', message: `A question in "${section.name}" has no text.`, sectionId: section.id, questionId: q.id });
      }
      if (q.answerType === 'binary') {
        if (!q.yesDefinition.trim()) {
          issues.push({ type: 'error', message: `Missing "Yes" definition in "${section.name}".`, sectionId: section.id, questionId: q.id });
        }
        if (!q.noDefinition.trim()) {
          issues.push({ type: 'error', message: `Missing "No" definition in "${section.name}".`, sectionId: section.id, questionId: q.id });
        }
        if (q.yesScore === '' || q.yesScore === undefined) {
          issues.push({ type: 'error', message: `Missing "Yes" score in "${section.name}".`, sectionId: section.id, questionId: q.id });
        }
      } else {
        if (!q.score0Definition.trim() || !q.score1Definition.trim() || !q.score2Definition.trim()) {
          issues.push({ type: 'error', message: `Incomplete Likert definitions in "${section.name}".`, sectionId: section.id, questionId: q.id });
        }
      }

      // Warnings
      const text = q.text.toLowerCase();
      if (/\band\b|\bor\b/.test(text)) {
        issues.push({ type: 'warning', message: `Compound question detected (contains "and"/"or"): "${q.text.slice(0, 60)}…"`, sectionId: section.id, questionId: q.id });
      }
      const subjectiveWords = ['professional', 'appropriate', 'good', 'bad', 'effectively', 'properly'];
      if (subjectiveWords.some(w => text.includes(w))) {
        issues.push({ type: 'warning', message: `Subjective language detected in: "${q.text.slice(0, 60)}…"`, sectionId: section.id, questionId: q.id });
      }
    });
  });

  return issues;
}

// ─── Score helpers ─────────────────────────────────────────────────────────

const sectionMaxScore = (section: ScorecardSection) =>
  section.questions.reduce((t, q) =>
    t + (q.answerType === 'binary' ? Number(q.yesScore) || 0 : Number(q.score2Points) || 0), 0);

const totalMaxScore = (sections: ScorecardSection[]) =>
  sections.reduce((t, s) => t + sectionMaxScore(s), 0);

// ─── Question preview card ─────────────────────────────────────────────────

function QuestionPreview({ q, index }: { q: QuestionDef; index: number }) {
  const maxPts = q.answerType === 'binary' ? Number(q.yesScore) || 0 : Number(q.score2Points) || 0;
  const method = q.matchingMethod === 'hybrid' ? 'Hybrid' : q.matchingMethod === 'llm' ? 'LLM' : 'Keyword';
  const methodColors: Record<string, string> = {
    Hybrid: 'bg-purple-50 text-purple-600',
    LLM: 'bg-blue-50 text-blue-600',
    Keyword: 'bg-gray-50 text-gray-600',
  };

  return (
    <div className="py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-start gap-3">
        <span className="text-xs text-gray-400 mt-0.5 w-5 flex-shrink-0">Q{index + 1}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-800">{q.text || <span className="text-red-400 italic">No question text</span>}</p>
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
            <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
              {q.answerType === 'binary' ? 'Yes/No' : 'Likert 0–2'}
            </span>
            {q.answerType === 'binary' && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${methodColors[method]}`}>{method}</span>
            )}
            <span className="text-xs bg-green-50 text-green-700 px-1.5 py-0.5 rounded-full">{maxPts} pts max</span>
            {q.criticalFail && (
              <span className="text-xs bg-red-50 text-red-600 border border-red-200 px-1.5 py-0.5 rounded-full">Critical fail</span>
            )}
            {q.naEligible && (
              <span className="text-xs bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded-full">N/A eligible</span>
            )}
          </div>

          {/* Definitions */}
          {q.answerType === 'binary' ? (
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="bg-green-50 rounded-lg p-2">
                <p className="text-xs font-medium text-green-700 mb-0.5">Yes (+{q.yesScore} pts)</p>
                <p className="text-xs text-gray-600">{q.yesDefinition || <span className="text-red-400 italic">Missing definition</span>}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-2">
                <p className="text-xs font-medium text-red-600 mb-0.5">No ({q.noScore} pts)</p>
                <p className="text-xs text-gray-600">{q.noDefinition || <span className="text-red-400 italic">Missing definition</span>}</p>
              </div>
            </div>
          ) : (
            <div className="mt-2 grid grid-cols-3 gap-2">
              {[
                { label: `0 — ${q.score0Points}pts`, def: q.score0Definition, color: 'bg-red-50 text-red-600' },
                { label: `1 — ${q.score1Points}pts`, def: q.score1Definition, color: 'bg-amber-50 text-amber-600' },
                { label: `2 — ${q.score2Points}pts`, def: q.score2Definition, color: 'bg-green-50 text-green-600' },
              ].map(({ label, def, color }) => (
                <div key={label} className="bg-gray-50 rounded-lg p-2">
                  <p className={`text-xs font-medium mb-0.5 ${color.split(' ')[1]}`}>{label}</p>
                  <p className="text-xs text-gray-600">{def || <span className="text-red-400 italic">Missing</span>}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Section preview card ──────────────────────────────────────────────────

function SectionPreview({ section, index }: { section: ScorecardSection; index: number }) {
  const [expanded, setExpanded] = useState(true);
  const maxPts = sectionMaxScore(section);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">
            {index + 1}
          </span>
          <div className="text-left">
            <p className="text-sm font-medium text-gray-900">{section.name}</p>
            {section.description && (
              <p className="text-xs text-gray-500 mt-0.5">{section.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">{section.questions.length} questions</span>
          <span className="text-xs text-primary font-medium">{maxPts} pts max</span>
          {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      {expanded && (
        <div className="px-5 border-t border-gray-100">
          {section.questions.map((q, qi) => (
            <QuestionPreview key={q.id} q={q} index={qi} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main PreviewStep ──────────────────────────────────────────────────────

export function PreviewStep({ draft, onClose }: PreviewStepProps) {
  const issues = validate(draft);
  const errors = issues.filter(i => i.type === 'error');
  const warnings = issues.filter(i => i.type === 'warning');
  const hasErrors = errors.length > 0;
  const maxPts = totalMaxScore(draft.sections);
  const totalQ = draft.sections.reduce((t, s) => t + s.questions.length, 0);

  const directionLabel = draft.direction === 'both' ? 'Inbound & Outbound' :
    draft.direction === 'inbound' ? 'Inbound' : 'Outbound';

  const handleSave = (activate: boolean) => {
    // Stub — would save to backend
    const draftToSave = { ...draft, status: activate ? 'active' : 'paused', savedAt: new Date().toISOString() };
    localStorage.setItem('wati-scorecard-draft', JSON.stringify(draftToSave));
    onClose();
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Header card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-gray-900">{draft.name || <span className="text-red-400 italic">Untitled scorecard</span>}</h2>
              {draft.description && (
                <p className="text-gray-500 text-sm mt-1">{draft.description}</p>
              )}
            </div>
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs px-2.5 py-1 rounded-full flex-shrink-0">
              <Clock className="w-3.5 h-3.5" />
              Draft
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <Phone className="w-3.5 h-3.5 text-gray-400" />
              {directionLabel}
            </div>
            <div className="text-xs text-gray-300">·</div>
            <div className="text-xs text-gray-600">
              Min duration: <span className="font-medium">{draft.minDuration || 30}s</span>
            </div>
            {draft.maxDuration && (
              <>
                <div className="text-xs text-gray-300">·</div>
                <div className="text-xs text-gray-600">
                  Max duration: <span className="font-medium">{draft.maxDuration}s</span>
                </div>
              </>
            )}
            <div className="text-xs text-gray-300">·</div>
            <div className="text-xs text-gray-600">
              <span className="font-medium">{draft.sections.length}</span> sections &middot; <span className="font-medium">{totalQ}</span> questions &middot; <span className="font-medium text-primary">{maxPts} pts</span> max
            </div>
          </div>
        </div>

        {/* Validation panel */}
        {(errors.length > 0 || warnings.length > 0) && (
          <div className="space-y-2">
            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-sm font-medium text-red-700">{errors.length} error{errors.length > 1 ? 's' : ''} — must fix before saving</p>
                </div>
                <ul className="space-y-1 ml-6">
                  {errors.map((e, i) => (
                    <li key={i} className="text-xs text-red-600 list-disc">{e.message}</li>
                  ))}
                </ul>
              </div>
            )}
            {warnings.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <p className="text-sm font-medium text-amber-700">{warnings.length} warning{warnings.length > 1 ? 's' : ''} — consider reviewing</p>
                </div>
                <ul className="space-y-1 ml-6">
                  {warnings.map((w, i) => (
                    <li key={i} className="text-xs text-amber-700 list-disc">{w.message}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* All good */}
        {!hasErrors && errors.length === 0 && warnings.length === 0 && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl p-4">
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
            <p className="text-sm text-green-700">Scorecard looks good — ready to save!</p>
          </div>
        )}

        {/* Sections */}
        <div className="space-y-3">
          {draft.sections.map((section, si) => (
            <SectionPreview key={section.id} section={section} index={si} />
          ))}
        </div>

        {/* Save buttons */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-3">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">Ready to save?</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {hasErrors
                ? 'Fix the errors above before activating.'
                : 'Save as paused to configure later, or activate to start grading calls immediately.'}
            </p>
          </div>
          <button
            onClick={() => handleSave(false)}
            disabled={hasErrors}
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Save as paused
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={hasErrors}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-sm hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-4 h-4" />
            Save & activate
          </button>
        </div>
      </div>
    </div>
  );
}
