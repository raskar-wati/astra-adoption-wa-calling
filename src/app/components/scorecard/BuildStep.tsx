import React, { useState, useCallback } from 'react';
import {
  ChevronDown, ChevronUp, Trash2, Plus, Sparkles,
  AlertTriangle, Lightbulb, X, GripVertical
} from 'lucide-react';
import { Switch } from '../ui/switch';
import {
  ScorecardDraft, ScorecardSection, QuestionDef,
  AnswerType, MatchingMethod, CriticalFailMode,
  makeQuestion, makeSection, uid
} from './types';

interface BuildStepProps {
  draft: ScorecardDraft;
  onChange: (updates: Partial<ScorecardDraft>) => void;
}

const METHOD_LABELS: Record<MatchingMethod, string> = {
  keyword: 'Keyword',
  llm: 'LLM',
  hybrid: 'Hybrid',
};

const totalQuestions = (sections: ScorecardSection[]) =>
  sections.reduce((a, s) => a + s.questions.length, 0);

const maxScore = (sections: ScorecardSection[]) =>
  sections.reduce((total, s) =>
    total + s.questions.reduce((st, q) => {
      if (q.answerType === 'binary') return st + (Number(q.yesScore) || 0);
      return st + (Number(q.score2Points) || 0);
    }, 0), 0);

// ─── Keyword chip input ────────────────────────────────────────────────────

function KeywordInput({
  keywords,
  onChange,
}: {
  keywords: string[];
  onChange: (kws: string[]) => void;
}) {
  const [input, setInput] = useState('');

  const add = () => {
    const kw = input.trim();
    if (kw && !keywords.includes(kw)) onChange([...keywords, kw]);
    setInput('');
  };

  return (
    <div className="flex flex-wrap gap-1.5 p-2 rounded-lg border border-gray-200 bg-gray-50 min-h-[38px]">
      {keywords.map(kw => (
        <span key={kw} className="flex items-center gap-1 bg-white border border-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
          {kw}
          <button onClick={() => onChange(keywords.filter(k => k !== kw))} className="text-gray-400 hover:text-red-500">
            <X className="w-2.5 h-2.5" />
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); } }}
        onBlur={add}
        placeholder={keywords.length === 0 ? 'Type keyword and press Enter…' : ''}
        className="flex-1 min-w-24 bg-transparent outline-none text-xs text-gray-700 placeholder:text-gray-400"
      />
    </div>
  );
}

// ─── Question card ─────────────────────────────────────────────────────────

interface QuestionCardProps {
  question: QuestionDef;
  index: number;
  sectionId: string;
  onUpdate: (sectionId: string, qId: string, patch: Partial<QuestionDef>) => void;
  onDelete: (sectionId: string, qId: string) => void;
  canDelete: boolean;
}

function QuestionCard({ question: q, index, sectionId, onUpdate, onDelete, canDelete }: QuestionCardProps) {
  const upd = (patch: Partial<QuestionDef>) => onUpdate(sectionId, q.id, patch);
  const isExpanded = q.isExpanded;

  const hasError = !q.text || (q.answerType === 'binary' && (!q.yesDefinition || !q.noDefinition || q.yesScore === '')) ||
    (q.answerType === 'likert' && (!q.score0Definition || !q.score1Definition || !q.score2Definition));

  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${isExpanded ? 'border-primary/30 shadow-sm' : 'border-gray-200'}`}>
      {/* Card header */}
      <div
        className={`flex items-center gap-3 px-4 py-3 cursor-pointer select-none ${isExpanded ? 'bg-green-50/60' : 'bg-white hover:bg-gray-50'}`}
        onClick={() => upd({ isExpanded: !isExpanded })}
      >
        <GripVertical className="w-4 h-4 text-gray-300 flex-shrink-0" />
        <span className="text-xs font-medium text-gray-400 w-5 flex-shrink-0">Q{index + 1}</span>
        <span className={`flex-1 text-sm truncate ${q.text ? 'text-gray-800' : 'text-gray-400 italic'}`}>
          {q.text || 'Untitled question…'}
        </span>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {hasError && <span className="w-2 h-2 rounded-full bg-red-400" title="Incomplete" />}
          {q.criticalFail && (
            <span className="text-xs bg-red-50 text-red-600 border border-red-200 px-1.5 py-0.5 rounded-full">Critical</span>
          )}
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${
            q.answerType === 'binary' ? 'bg-gray-100 text-gray-600' : 'bg-purple-50 text-purple-600'
          }`}>
            {q.answerType === 'binary' ? 'Yes/No' : 'Likert'}
          </span>
          {canDelete && (
            <button
              onClick={e => { e.stopPropagation(); onDelete(sectionId, q.id); }}
              className="p-1 hover:bg-red-50 rounded text-gray-300 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </div>

      {/* Card body */}
      {isExpanded && (
        <div className="p-4 bg-white border-t border-gray-100 space-y-4">
          {/* Question text */}
          <div>
            <label className="block text-xs text-gray-600 mb-1.5 font-medium">Question</label>
            <textarea
              value={q.text}
              onChange={e => upd({ text: e.target.value })}
              placeholder="e.g. Did the agent greet the customer professionally?"
              rows={2}
              className={`w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none transition-colors ${
                !q.text ? 'border-red-300 bg-red-50 focus:border-red-400' : 'border-gray-200 bg-gray-50 focus:border-primary focus:bg-white'
              }`}
            />
            {!q.text && <p className="text-xs text-red-500 mt-1">Question text is required</p>}
          </div>

          {/* Answer type + Matching method */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1.5 font-medium">Answer type</label>
              <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                {(['binary', 'likert'] as AnswerType[]).map((t, i) => (
                  <button
                    key={t}
                    onClick={() => upd({ answerType: t })}
                    className={`flex-1 py-1.5 text-xs transition-colors ${i > 0 ? 'border-l border-gray-200' : ''} ${
                      q.answerType === t ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {t === 'binary' ? 'Yes / No' : 'Likert (0–2)'}
                  </button>
                ))}
              </div>
            </div>

            {q.answerType === 'binary' && (
              <div>
                <label className="block text-xs text-gray-600 mb-1.5 font-medium">Matching method</label>
                <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                  {(['keyword', 'llm', 'hybrid'] as MatchingMethod[]).map((m, i) => (
                    <button
                      key={m}
                      onClick={() => upd({ matchingMethod: m })}
                      className={`flex-1 py-1.5 text-xs transition-colors ${i > 0 ? 'border-l border-gray-200' : ''} ${
                        q.matchingMethod === m ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {METHOD_LABELS[m]}
                      {m === 'hybrid' && q.matchingMethod !== m && (
                        <span className="ml-0.5 text-primary text-[10px]">★</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Keywords */}
          {q.answerType === 'binary' && (q.matchingMethod === 'keyword' || q.matchingMethod === 'hybrid') && (
            <div>
              <label className="block text-xs text-gray-600 mb-1.5 font-medium">
                Keywords <span className="text-gray-400 font-normal">(press Enter to add)</span>
              </label>
              <KeywordInput keywords={q.keywords} onChange={kws => upd({ keywords: kws })} />
            </div>
          )}

          {/* Definitions + Scores */}
          {q.answerType === 'binary' ? (
            <div className="grid grid-cols-2 gap-4">
              {/* Yes */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-gray-600 font-medium">Yes — when this is true</label>
                  <div className="flex items-center gap-1.5">
                    <label className="text-xs text-gray-500">Points</label>
                    <input
                      type="number"
                      value={q.yesScore}
                      onChange={e => upd({ yesScore: e.target.value })}
                      className="w-14 px-2 py-1 rounded border border-gray-200 bg-gray-50 text-xs outline-none focus:border-primary text-center"
                    />
                  </div>
                </div>
                <textarea
                  value={q.yesDefinition}
                  onChange={e => upd({ yesDefinition: e.target.value })}
                  placeholder="Describe what a 'Yes' answer looks like in the transcript…"
                  rows={2}
                  className={`w-full px-3 py-2 rounded-lg border text-xs outline-none resize-none transition-colors ${
                    !q.yesDefinition ? 'border-red-300 bg-red-50 focus:border-red-400' : 'border-gray-200 bg-gray-50 focus:border-primary focus:bg-white'
                  }`}
                />
              </div>
              {/* No */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-gray-600 font-medium">No — when this is true</label>
                  <div className="flex items-center gap-1.5">
                    <label className="text-xs text-gray-500">Points</label>
                    <input
                      type="number"
                      value={q.noScore}
                      onChange={e => upd({ noScore: e.target.value })}
                      className="w-14 px-2 py-1 rounded border border-gray-200 bg-gray-50 text-xs outline-none focus:border-primary text-center"
                    />
                  </div>
                </div>
                <textarea
                  value={q.noDefinition}
                  onChange={e => upd({ noDefinition: e.target.value })}
                  placeholder="Describe what a 'No' answer looks like in the transcript…"
                  rows={2}
                  className={`w-full px-3 py-2 rounded-lg border text-xs outline-none resize-none transition-colors ${
                    !q.noDefinition ? 'border-red-300 bg-red-50 focus:border-red-400' : 'border-gray-200 bg-gray-50 focus:border-primary focus:bg-white'
                  }`}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {([0, 1, 2] as const).map(score => {
                const defKey = `score${score}Definition` as keyof QuestionDef;
                const ptKey = `score${score}Points` as keyof QuestionDef;
                const labels = ['0 — Not observed', '1 — Partially met', '2 — Fully met'];
                const colors = ['text-red-600 bg-red-50', 'text-amber-600 bg-amber-50', 'text-green-600 bg-green-50'];
                return (
                  <div key={score} className="flex items-start gap-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded mt-2 flex-shrink-0 ${colors[score]}`}>
                      {labels[score]}
                    </span>
                    <textarea
                      value={q[defKey] as string}
                      onChange={e => upd({ [defKey]: e.target.value })}
                      placeholder={`Describe score ${score}…`}
                      rows={1}
                      className={`flex-1 px-3 py-2 rounded-lg border text-xs outline-none resize-none transition-colors ${
                        !q[defKey] ? 'border-red-300 bg-red-50 focus:border-red-400' : 'border-gray-200 bg-gray-50 focus:border-primary focus:bg-white'
                      }`}
                    />
                    <div className="flex items-center gap-1.5 mt-2">
                      <label className="text-xs text-gray-500">pts</label>
                      <input
                        type="number"
                        value={q[ptKey] as number | string}
                        onChange={e => upd({ [ptKey]: e.target.value })}
                        className="w-14 px-2 py-1 rounded border border-gray-200 bg-gray-50 text-xs outline-none focus:border-primary text-center"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom toggles */}
          <div className="flex flex-wrap items-start gap-6 pt-2 border-t border-gray-100">
            {/* Critical fail */}
            <div className="flex items-start gap-2">
              <Switch
                checked={q.criticalFail}
                onCheckedChange={v => upd({ criticalFail: v })}
                className="mt-0.5"
              />
              <div>
                <label className="text-xs font-medium text-gray-700">Critical fail</label>
                {q.criticalFail && (
                  <div className="flex gap-3 mt-1.5">
                    {(['zero-section', 'zero-scorecard'] as CriticalFailMode[]).map(m => (
                      <label key={m} className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name={`cf-${q.id}`}
                          checked={q.criticalFailMode === m}
                          onChange={() => upd({ criticalFailMode: m })}
                          className="accent-primary"
                        />
                        <span className="text-xs text-gray-600">
                          {m === 'zero-section' ? 'Zero this section' : 'Zero entire scorecard'}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* N/A eligible */}
            <div className="flex items-center gap-2">
              <Switch
                checked={q.naEligible}
                onCheckedChange={v => upd({ naEligible: v })}
              />
              <label className="text-xs font-medium text-gray-700">N/A eligible</label>
            </div>

            {/* Refine with AI */}
            <button
              onClick={() => {}}
              className="ml-auto flex items-center gap-1.5 text-xs border border-primary text-primary px-3 py-1.5 rounded-lg hover:bg-green-50 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Refine with AI
              <span className="text-gray-400">· 0.5 credits</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main BuildStep ────────────────────────────────────────────────────────

export function BuildStep({ draft, onChange }: BuildStepProps) {
  const [activeSectionId, setActiveSectionId] = useState<string>(
    draft.sections[0]?.id ?? ''
  );
  const [showTips, setShowTips] = useState(false);

  const totalQ = totalQuestions(draft.sections);
  const maxPts = maxScore(draft.sections);

  const updateSections = (sections: ScorecardSection[]) => onChange({ sections });

  const updateSection = useCallback((sectionId: string, patch: Partial<ScorecardSection>) => {
    updateSections(draft.sections.map(s => s.id === sectionId ? { ...s, ...patch } : s));
  }, [draft.sections]);

  const addSection = () => {
    const sec = makeSection();
    updateSections([...draft.sections, sec]);
    setActiveSectionId(sec.id);
  };

  const deleteSection = (sectionId: string) => {
    const updated = draft.sections.filter(s => s.id !== sectionId);
    updateSections(updated);
    if (activeSectionId === sectionId) {
      setActiveSectionId(updated[0]?.id ?? '');
    }
  };

  const updateQuestion = useCallback((sectionId: string, qId: string, patch: Partial<QuestionDef>) => {
    updateSections(draft.sections.map(s =>
      s.id === sectionId
        ? { ...s, questions: s.questions.map(q => q.id === qId ? { ...q, ...patch } : q) }
        : s
    ));
  }, [draft.sections]);

  const addQuestion = (sectionId: string) => {
    const q = makeQuestion();
    updateSections(draft.sections.map(s =>
      s.id === sectionId ? { ...s, questions: [...s.questions, q] } : s
    ));
  };

  const deleteQuestion = useCallback((sectionId: string, qId: string) => {
    updateSections(draft.sections.map(s =>
      s.id === sectionId
        ? { ...s, questions: s.questions.filter(q => q.id !== qId) }
        : s
    ));
  }, [draft.sections]);

  const activeSection = draft.sections.find(s => s.id === activeSectionId);

  if (draft.sections.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No sections yet. Go back to Setup and choose a template or start from scratch.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex overflow-hidden bg-gray-50">
      {/* ── Left sidebar: sections ── */}
      <div className="w-56 flex-shrink-0 flex flex-col bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Sections</p>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {draft.sections.map((section, idx) => {
            const isActive = section.id === activeSectionId;
            const hasEmpty = section.questions.some(q => !q.text);
            return (
              <button
                key={section.id}
                onClick={() => setActiveSectionId(section.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-all group ${
                  isActive ? 'bg-green-50 border border-primary/30' : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className="flex items-start justify-between gap-1">
                  <span className={`text-sm font-medium truncate ${isActive ? 'text-primary' : 'text-gray-700'}`}>
                    {section.name}
                  </span>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {hasEmpty && <span className="w-1.5 h-1.5 rounded-full bg-red-400" />}
                    {draft.sections.length > 1 && (
                      <button
                        onClick={e => { e.stopPropagation(); deleteSection(section.id); }}
                        className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-red-50 rounded text-gray-300 hover:text-red-500 transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{section.questions.length} question{section.questions.length !== 1 ? 's' : ''}</p>
              </button>
            );
          })}
        </div>

        <div className="p-3 border-t border-gray-200 space-y-3">
          <button
            onClick={addSection}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-green-50 rounded-lg transition-colors border border-dashed border-primary/40"
          >
            <Plus className="w-4 h-4" />
            Add section
          </button>

          {/* Score summary */}
          <div className="bg-gray-50 rounded-lg p-3 space-y-1.5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Summary</p>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Sections</span>
              <span className="text-gray-800 font-medium">{draft.sections.length}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Questions</span>
              <span className={`font-medium ${totalQ > 15 ? 'text-amber-600' : 'text-gray-800'}`}>{totalQ}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Max score</span>
              <span className="text-primary font-medium">{maxPts} pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Warning banner */}
        {totalQ > 15 && (
          <div className="flex items-center gap-2 px-5 py-2.5 bg-amber-50 border-b border-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <p className="text-sm text-amber-700">
              Scorecards with 15+ questions may reduce AI grading accuracy. Consider splitting into multiple scorecards.
            </p>
          </div>
        )}

        {activeSection ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Section header */}
            <div className="flex items-start gap-4">
              <div className="flex-1 space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1.5 font-medium">Section name</label>
                  <input
                    type="text"
                    value={activeSection.name}
                    onChange={e => updateSection(activeSection.id, { name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1.5 font-medium">
                    Description <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={activeSection.description}
                    onChange={e => updateSection(activeSection.id, { description: e.target.value })}
                    placeholder="What does this section evaluate?"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <button
                onClick={() => setShowTips(v => !v)}
                className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border transition-colors flex-shrink-0 mt-5 ${
                  showTips ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5" />
                Writing tips
              </button>
            </div>

            {/* Tips panel */}
            {showTips && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
                <p className="text-xs font-medium text-amber-800 uppercase tracking-wide">Best practices</p>
                <ul className="space-y-1.5 text-xs text-amber-700 list-disc list-inside">
                  <li>Ask one thing per question — avoid "and" or "or"</li>
                  <li>Write in present tense and active voice</li>
                  <li>Use observable, specific behaviours — not "acted professionally"</li>
                  <li>Definitions should not repeat the question text verbatim</li>
                  <li>Avoid subjective words like "good", "bad", "appropriate"</li>
                  <li>Hybrid matching is recommended for most questions</li>
                </ul>
              </div>
            )}

            {/* Questions */}
            <div className="space-y-3">
              {activeSection.questions.map((q, idx) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  index={idx}
                  sectionId={activeSection.id}
                  onUpdate={updateQuestion}
                  onDelete={deleteQuestion}
                  canDelete={activeSection.questions.length > 1}
                />
              ))}
            </div>

            {/* Add question */}
            <button
              onClick={() => addQuestion(activeSection.id)}
              className="w-full flex items-center justify-center gap-2 py-3 text-sm text-primary border border-dashed border-primary/40 rounded-xl hover:bg-green-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add question
            </button>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
            Select a section to edit
          </div>
        )}
      </div>
    </div>
  );
}
