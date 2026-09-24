export type AnswerType = 'binary' | 'likert';
export type MatchingMethod = 'keyword' | 'llm' | 'hybrid';
export type CallDirection = 'inbound' | 'outbound' | 'both';
export type CriticalFailMode = 'zero-section' | 'zero-scorecard';
export type TemplateId = 'scratch' | 'sales' | 'support' | 'product';

export interface QuestionDef {
  id: string;
  text: string;
  answerType: AnswerType;
  matchingMethod: MatchingMethod;
  keywords: string[];
  yesDefinition: string;
  noDefinition: string;
  yesScore: number | string;
  noScore: number | string;
  score0Definition: string;
  score1Definition: string;
  score2Definition: string;
  score0Points: number | string;
  score1Points: number | string;
  score2Points: number | string;
  criticalFail: boolean;
  criticalFailMode: CriticalFailMode;
  naEligible: boolean;
  isExpanded: boolean;
}

export interface ScorecardSection {
  id: string;
  name: string;
  description: string;
  questions: QuestionDef[];
}

export interface ScorecardDraft {
  templateId: TemplateId | null;
  name: string;
  description: string;
  direction: CallDirection;
  minDuration: string;
  maxDuration: string;
  sections: ScorecardSection[];
}

export interface ValidationIssue {
  type: 'error' | 'warning';
  message: string;
  sectionId?: string;
  questionId?: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

let _id = 0;
export const uid = (prefix = 'id') => `${prefix}-${++_id}-${Date.now()}`;

export const makeQuestion = (overrides: Partial<QuestionDef> = {}): QuestionDef => ({
  id: uid('q'),
  text: '',
  answerType: 'binary',
  matchingMethod: 'hybrid',
  keywords: [],
  yesDefinition: '',
  noDefinition: '',
  yesScore: 5,
  noScore: 0,
  score0Definition: '',
  score1Definition: '',
  score2Definition: '',
  score0Points: 0,
  score1Points: 1,
  score2Points: 2,
  criticalFail: false,
  criticalFailMode: 'zero-section',
  naEligible: true,
  isExpanded: true,
  ...overrides,
});

export const makeSection = (overrides: Partial<ScorecardSection> = {}): ScorecardSection => ({
  id: uid('sec'),
  name: 'New Section',
  description: '',
  questions: [makeQuestion()],
  ...overrides,
});

export const DEFAULT_DRAFT: ScorecardDraft = {
  templateId: null,
  name: '',
  description: '',
  direction: 'both',
  minDuration: '30',
  maxDuration: '',
  sections: [],
};

// ─── Template definitions ────────────────────────────────────────────────────

const bq = (
  id: string,
  text: string,
  method: MatchingMethod,
  keywords: string[],
  yesDef: string,
  noDef: string,
  yScore = 5,
  nScore = 0,
  critical = false
): QuestionDef => makeQuestion({
  id,
  text,
  answerType: 'binary',
  matchingMethod: method,
  keywords,
  yesDefinition: yesDef,
  noDefinition: noDef,
  yesScore: yScore,
  noScore: nScore,
  criticalFail: critical,
  criticalFailMode: critical ? 'zero-section' : 'zero-section',
  isExpanded: false,
});

export const TEMPLATE_SECTIONS: Record<Exclude<TemplateId, 'scratch'>, ScorecardSection[]> = {
  sales: [
    {
      id: 'sales-s1', name: 'Opening & Rapport', description: 'How the agent opens the call and establishes trust',
      questions: [
        bq('sales-q1', 'Did the agent greet the customer professionally and introduce themselves?', 'hybrid', ['hello', 'hi', 'good morning', 'my name is'], 'Agent used a warm, professional greeting and stated their name clearly.', 'Agent failed to greet or introduce themselves.', 5, 0, true),
        bq('sales-q2', 'Did the agent confirm the customer\'s name and use it during the call?', 'keyword', ['is this', 'am i speaking with', 'your name'], 'Agent confirmed and used the customer\'s name at least once.', 'Agent did not confirm or use the customer\'s name.', 3, 0),
        bq('sales-q3', 'Did the agent clearly state the purpose of the call?', 'llm', [], 'Agent explained the reason for the call within the first minute.', 'Agent did not explain the purpose of the call.', 4, 0),
      ]
    },
    {
      id: 'sales-s2', name: 'Needs Discovery', description: 'Understanding the customer\'s needs and pain points',
      questions: [
        bq('sales-q4', 'Did the agent ask open-ended questions to uncover the customer\'s needs?', 'llm', [], 'Agent asked at least two open-ended questions.', 'Agent relied only on yes/no questions.', 5, 0),
        bq('sales-q5', 'Did the agent actively listen and acknowledge the customer\'s responses?', 'llm', [], 'Agent acknowledged and reflected back key points from the customer.', 'Agent moved on without acknowledging the customer\'s input.', 4, 0),
        bq('sales-q6', 'Did the agent identify and address the customer\'s primary pain point?', 'llm', [], 'Agent explicitly named the pain point and offered a targeted solution.', 'Agent did not identify or failed to address the pain point.', 5, 0),
        bq('sales-q7', 'Did the agent summarize the customer\'s requirements before presenting a solution?', 'hybrid', ['so what you\'re looking for', 'let me confirm', 'to summarize'], 'Agent summarized requirements accurately before pitching.', 'Agent pitched without summarizing the customer\'s needs.', 3, 0),
      ]
    },
    {
      id: 'sales-s3', name: 'Closing & Next Steps', description: 'How the agent drives toward commitment and closes the call',
      questions: [
        bq('sales-q8', 'Did the agent present a solution that matched the customer\'s stated needs?', 'llm', [], 'The proposed solution directly addressed the identified needs.', 'The solution was generic or did not match the stated needs.', 5, 0),
        bq('sales-q9', 'Did the agent handle objections confidently without being pushy?', 'llm', [], 'Agent acknowledged objections and offered clear, calm responses.', 'Agent ignored, dismissed, or became defensive about objections.', 4, 0),
        bq('sales-q10', 'Did the agent confirm clear next steps before ending the call?', 'hybrid', ['next step', 'follow up', 'send you', 'will contact'], 'Agent clearly stated what happens next and set a timeline.', 'Agent ended the call without establishing next steps.', 4, 0, true),
      ]
    },
  ],

  support: [
    {
      id: 'sup-s1', name: 'Problem Identification', description: 'How effectively the agent identifies the issue',
      questions: [
        bq('sup-q1', 'Did the agent let the customer fully explain the issue without interrupting?', 'llm', [], 'Agent allowed the customer to finish before responding.', 'Agent interrupted or cut the customer short.', 4, 0, true),
        bq('sup-q2', 'Did the agent ask relevant clarifying questions to fully understand the problem?', 'llm', [], 'Agent asked at least one targeted clarifying question.', 'Agent proceeded without seeking clarification.', 4, 0),
        bq('sup-q3', 'Did the agent confirm their understanding of the issue before troubleshooting?', 'hybrid', ['so the issue is', 'let me confirm', 'i understand that'], 'Agent restated the issue for confirmation before proceeding.', 'Agent jumped into troubleshooting without confirming.', 3, 0),
      ]
    },
    {
      id: 'sup-s2', name: 'Troubleshooting Process', description: 'Quality of the resolution approach',
      questions: [
        bq('sup-q4', 'Did the agent follow the standard troubleshooting process in the correct order?', 'llm', [], 'Agent followed the correct steps in the prescribed sequence.', 'Agent skipped steps or followed them out of order.', 5, 0),
        bq('sup-q5', 'Did the agent explain each troubleshooting step to the customer as they worked?', 'llm', [], 'Agent narrated each action before or while performing it.', 'Agent worked silently without explaining steps.', 3, 0),
        bq('sup-q6', 'Did the agent verify that the solution resolved the issue before closing?', 'hybrid', ['does that work', 'is the issue resolved', 'can you check'], 'Agent confirmed resolution with the customer before ending the call.', 'Agent closed the call without confirming the fix worked.', 5, 0, true),
        bq('sup-q7', 'Did the agent offer alternative solutions when the initial approach failed?', 'llm', [], 'Agent pivoted and provided a backup solution when needed.', 'Agent gave up or escalated without attempting alternatives.', 4, 0),
      ]
    },
    {
      id: 'sup-s3', name: 'Resolution & Follow-up', description: 'Ensuring customer satisfaction and proper case handling',
      questions: [
        bq('sup-q8', 'Was the customer\'s issue fully resolved during the call?', 'llm', [], 'Issue was confirmed resolved before the call ended.', 'Issue remained unresolved at the end of the call.', 5, 0),
        bq('sup-q9', 'Did the agent inform the customer of follow-up actions and timelines?', 'hybrid', ['you will receive', 'within', 'follow up', 'ticket number'], 'Agent provided clear follow-up information before ending.', 'Agent ended the call without explaining follow-up steps.', 3, 0),
        bq('sup-q10', 'Did the agent express empathy and maintain a positive tone throughout?', 'llm', [], 'Agent used empathetic language and stayed calm throughout.', 'Agent was dismissive, impatient, or used a negative tone.', 4, 0),
      ]
    },
  ],

  product: [
    {
      id: 'prod-s1', name: 'Product Knowledge', description: 'Accuracy and depth of product information shared',
      questions: [
        bq('prod-q1', 'Did the agent demonstrate accurate knowledge of the product features?', 'llm', [], 'All product information shared was accurate and up to date.', 'Agent provided inaccurate or outdated product information.', 5, 0, true),
        bq('prod-q2', 'Did the agent tailor product information to the customer\'s specific use case?', 'llm', [], 'Agent linked product features to the customer\'s stated needs.', 'Agent provided a generic product pitch without personalizing.', 4, 0),
        bq('prod-q3', 'Did the agent answer technical questions accurately without hesitation?', 'llm', [], 'Technical answers were correct and delivered confidently.', 'Agent hesitated, guessed, or gave incorrect technical answers.', 4, 0),
      ]
    },
    {
      id: 'prod-s2', name: 'Customer Engagement', description: 'How well the agent engages and qualifies the prospect',
      questions: [
        bq('prod-q4', 'Did the agent understand the customer\'s budget and timeline constraints?', 'llm', [], 'Agent asked about budget and timeline and factored them into the pitch.', 'Agent never asked about budget or timeline.', 4, 0),
        bq('prod-q5', 'Did the agent present product benefits in terms of business value to the customer?', 'llm', [], 'Agent framed features as customer outcomes and benefits.', 'Agent listed features without connecting them to business value.', 5, 0),
        bq('prod-q6', 'Did the agent professionally address questions about competitor products?', 'llm', [], 'Agent acknowledged competition while confidently positioning the product.', 'Agent avoided the question, disparaged competitors, or was unsure.', 3, 0),
      ]
    },
    {
      id: 'prod-s3', name: 'Follow-up Actions', description: 'Ensuring continuity and next steps are in place',
      questions: [
        bq('prod-q7', 'Did the agent offer to send product documentation or demo materials?', 'hybrid', ['send you', 'brochure', 'demo', 'documentation', 'link'], 'Agent proactively offered supporting materials.', 'Agent did not offer any follow-up materials.', 3, 0),
        bq('prod-q8', 'Did the agent schedule a follow-up call or product demo?', 'hybrid', ['schedule', 'book', 'demo', 'follow up', 'next week'], 'A concrete follow-up was agreed upon with a date/time.', 'No follow-up was scheduled or offered.', 4, 0),
        bq('prod-q9', 'Did the agent capture the customer\'s preferred contact method for follow-up?', 'hybrid', ['email', 'phone', 'whatsapp', 'best way to reach'], 'Agent confirmed how and when the customer prefers to be contacted.', 'Agent did not ask about contact preferences.', 3, 0),
      ]
    },
  ],
};

export const TEMPLATE_META: Array<{
  id: TemplateId;
  title: string;
  description: string;
  questionCount: number;
  sectionCount: number;
  emoji: string;
  direction: CallDirection;
  tags: string[];
}> = [
  { id: 'scratch', title: 'Start from scratch', description: 'Build your scorecard exactly as you need it, question by question.', questionCount: 0, sectionCount: 0, emoji: '✦', direction: 'both', tags: ['Custom'] },
  { id: 'sales', title: 'Sales call', description: 'Rapport, needs discovery, and closing — optimised for outbound sales.', questionCount: 10, sectionCount: 3, emoji: '💼', direction: 'outbound', tags: ['Outbound', '10 questions'] },
  { id: 'support', title: 'Support call', description: 'Problem identification, troubleshooting, and resolution quality.', questionCount: 10, sectionCount: 3, emoji: '🛠', direction: 'inbound', tags: ['Inbound', '10 questions'] },
  { id: 'product', title: 'Product inquiry', description: 'Product knowledge, engagement, and follow-up for prospect calls.', questionCount: 9, sectionCount: 3, emoji: '📦', direction: 'both', tags: ['9 questions'] },
];
