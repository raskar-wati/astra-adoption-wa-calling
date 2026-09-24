import React, { useState, useEffect, useCallback } from 'react';
import { X, Check, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { SetupStep } from './SetupStep';
import { BuildStep } from './BuildStep';
import { PreviewStep } from './PreviewStep';
import { ScorecardDraft, DEFAULT_DRAFT } from './types';

const STEPS = ['Setup', 'Build', 'Preview'] as const;
const DRAFT_KEY = 'wati-scorecard-draft';

interface ScorecardBuilderProps {
  onClose: () => void;
}

// Wati wordmark
const WatiLogo = () => (
  <svg viewBox="0 0 60 20" className="h-5 w-auto fill-primary" aria-label="Wati">
    <text x="0" y="16" fontFamily="sans-serif" fontWeight="700" fontSize="18">wati</text>
  </svg>
);

export function ScorecardBuilder({ onClose }: ScorecardBuilderProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const [draft, setDraft] = useState<ScorecardDraft>(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Only restore if it looks like a real draft (has a name or template)
        if (parsed.templateId || parsed.name) return parsed;
      }
    } catch {}
    return { ...DEFAULT_DRAFT };
  });

  // Auto-save (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      setLastSaved(new Date());
    }, 800);
    return () => clearTimeout(timer);
  }, [draft]);

  const handleDraftChange = useCallback((updates: Partial<ScorecardDraft>) => {
    setDraft(prev => ({ ...prev, ...updates }));
  }, []);

  const canNavigateTo = (step: number) => {
    if (step <= currentStep) return true;
    return completedSteps.has(step - 1);
  };

  const handleNext = () => {
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleStepClick = (step: number) => {
    if (canNavigateTo(step)) setCurrentStep(step);
  };

  const canProceedFromSetup =
    draft.templateId !== null && draft.name.trim().length > 0;

  const isNextDisabled =
    currentStep === 1 && !canProceedFromSetup;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col" style={{ fontFamily: 'inherit' }}>
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-white flex-shrink-0">
        {/* Left: logo + title + save indicator */}
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-primary font-bold text-xl tracking-tight leading-none">wati</span>
          <span className="text-gray-200 text-lg">|</span>
          <span className="text-gray-800 font-medium text-sm">Scorecard Builder</span>
          {lastSaved && (
            <span className="hidden sm:flex items-center gap-1 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>

        {/* Centre: step indicator */}
        <div className="flex items-center gap-1">
          {STEPS.map((label, idx) => {
            const step = idx + 1;
            const isCompleted = completedSteps.has(step);
            const isCurrent = currentStep === step;
            const clickable = canNavigateTo(step);

            return (
              <React.Fragment key={label}>
                {idx > 0 && (
                  <div className={`w-8 h-px transition-colors ${completedSteps.has(idx) ? 'bg-primary' : 'bg-gray-200'}`} />
                )}
                <button
                  onClick={() => handleStepClick(step)}
                  disabled={!clickable}
                  title={label}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs transition-all ${
                    isCurrent
                      ? 'bg-primary text-white shadow-sm'
                      : isCompleted
                      ? 'text-primary hover:bg-green-50 cursor-pointer'
                      : 'text-gray-400 cursor-default'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isCurrent
                      ? 'bg-white/30 text-white'
                      : isCompleted
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {isCompleted && !isCurrent
                      ? <Check className="w-2.5 h-2.5" />
                      : <span className="text-[10px]">{step}</span>}
                  </span>
                  <span className={`hidden sm:inline ${isCurrent ? 'font-medium' : ''}`}>{label}</span>
                </button>
              </React.Fragment>
            );
          })}
        </div>

        {/* Right: plan badge + close */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="hidden sm:flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
            4/10 active ·
            <span className="text-primary font-medium ml-0.5">Pro</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 overflow-hidden">
        {currentStep === 1 && <SetupStep draft={draft} onChange={handleDraftChange} />}
        {currentStep === 2 && <BuildStep draft={draft} onChange={handleDraftChange} />}
        {currentStep === 3 && <PreviewStep draft={draft} onClose={onClose} />}
      </div>

      {/* ── Footer navigation ── */}
      {currentStep < 3 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 bg-white flex-shrink-0">
          <button
            onClick={currentStep === 1 ? onClose : handleBack}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {currentStep === 1 ? (
              'Cancel'
            ) : (
              <><ChevronLeft className="w-4 h-4" /> Back</>
            )}
          </button>

          <span className="text-xs text-gray-400">Step {currentStep} of 3</span>

          <button
            onClick={handleNext}
            disabled={isNextDisabled}
            title={isNextDisabled ? 'Choose a template and add a scorecard name to continue' : undefined}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isNextDisabled
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary/90'
            }`}
          >
            {currentStep === 2 ? 'Preview scorecard' : 'Continue'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
