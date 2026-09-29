import { useCallback, useEffect, useRef, useState } from 'react';
import { CheckCircle2, Phone } from 'lucide-react';
import { AstraLogo } from './AstraLogo';
import { ChatBubble } from './ChatBubble';
import { ChatComposer } from './ChatComposer';
import { useAstraAdoption } from '../lib/AstraAdoptionContext';
import { ROUTING_COPY } from '../lib/astraAdoption';
import {
  AstraScriptContext,
  AstraTopic,
  detectTopic,
  hookLines,
  quickReplies,
  replyFor,
  statusChangeLines,
} from '../lib/astraChatScript';

// Where the pinned call-log row lands: a WhatsApp thread with Astra. It opens
// with the workspace's own missed calls as the hook, answers what the user
// asks, and every answer leans towards switching Astra on — the offer arrives
// as a card inside the conversation rather than as a page of marketing.

type ThreadItem =
  | { id: number; from: 'astra' | 'user'; kind: 'text'; text: string; at: string }
  | { id: number; from: 'astra'; kind: 'offer'; at: string };

const TYPING_MS = 900;
const GAP_MS = 250;

const wait = (ms: number) => new Promise((r) => window.setTimeout(r, ms));
const clock = () => new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

export function AstraConversation() {
  const adoption = useAstraAdoption();
  const { profile, segment, status, routingMode, callAstra } = adoption;

  const [items, setItems] = useState<ThreadItem[]>([]);
  const [typing, setTyping] = useState(false);
  const [asked, setAsked] = useState<Set<AstraTopic>>(new Set());

  const nextId = useRef(0);
  const queue = useRef<Promise<void>>(Promise.resolve());
  // Bumped when the thread restarts, so a script still playing out stops.
  const generation = useRef(0);
  const offerShown = useRef(false);
  const endRef = useRef<HTMLDivElement>(null);

  // Read through a ref so queued replies use the numbers at send time.
  const ctxRef = useRef<AstraScriptContext>({ profile, segment, status, routingMode });
  ctxRef.current = { profile, segment, status, routingMode };

  const push = useCallback((item: Omit<ThreadItem, 'id' | 'at'>) => {
    setItems((prev) => [...prev, { ...item, id: nextId.current++, at: clock() } as ThreadItem]);
  }, []);

  // Astra "types" each line before it lands, one after another.
  const say = useCallback((lines: string[], withOffer = false) => {
    const gen = generation.current;
    queue.current = queue.current.then(async () => {
      for (const text of lines) {
        if (gen !== generation.current) return;
        setTyping(true);
        await wait(TYPING_MS);
        if (gen !== generation.current) return;
        setTyping(false);
        push({ from: 'astra', kind: 'text', text });
        await wait(GAP_MS);
      }
      if (withOffer && gen === generation.current) {
        offerShown.current = true;
        push({ from: 'astra', kind: 'offer' });
      }
    });
  }, [push]);

  // The hook: open with what the user has been missing.
  useEffect(() => {
    generation.current += 1;
    offerShown.current = false;
    setItems([]);
    setTyping(false);
    setAsked(new Set());
    queue.current = Promise.resolve();
    say(hookLines(ctxRef.current));
  }, [say]);

  // Starting the trial or switching Astra on from the card gets a reply in-thread.
  const prevStatus = useRef(status);
  useEffect(() => {
    if (prevStatus.current === status) return;
    prevStatus.current = status;
    const reply = statusChangeLines(status, ctxRef.current);
    if (reply) say(reply.lines, reply.offer);
  }, [status, say]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [items, typing]);

  const respond = (text: string, topic: AstraTopic = detectTopic(text)) => {
    push({ from: 'user', kind: 'text', text });
    setAsked((prev) => new Set(prev).add(topic));
    const reply = replyFor(topic, ctxRef.current);
    // One offer card is enough to act on; repeat it only when they ask to go ahead.
    const showCard = reply.offer && (!offerShown.current || topic === 'yes' || topic === 'cost');
    say(reply.lines, showCard);
  };

  const suggestions = typing ? [] : quickReplies(status, asked);

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="h-14 shrink-0 flex items-center gap-2.5 px-4 border-b border-[#e7e9e8]">
        <div className="w-8 h-8 rounded-full bg-white border border-astra-blue/20 flex items-center justify-center">
          <AstraLogo className="w-5 h-5" variant="brand" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold text-astra-ink leading-5">Astra</p>
          <p className="text-[12px] text-[#848a86] leading-4">
            {typing ? 'typing…' : 'Voice AI agent for WhatsApp calls'}
          </p>
        </div>
        <button
          onClick={callAstra}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-wati-green text-white text-[13px] font-medium hover:bg-wati-green-dark transition-colors"
        >
          <Phone className="w-3.5 h-3.5" />
          Talk to Astra
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 lg:p-6 min-h-0">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className={`flex ${item.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              {item.kind === 'offer' ? (
                <AstraOfferCard />
              ) : (
                <ChatBubble sender={item.from === 'user' ? 'agent' : 'customer'} channel="WhatsApp" timestamp={item.at}>
                  {item.text}
                </ChatBubble>
              )}
            </div>
          ))}

          {typing && (
            <div className="flex justify-start">
              <ChatBubble sender="customer" channel="WhatsApp">
                <span className="inline-flex gap-1 py-1" aria-label="Astra is typing">
                  {[0, 0.2, 0.4].map((d) => (
                    <span
                      key={d}
                      className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-[blink_1.4s_infinite]"
                      style={{ animationDelay: `${d}s` }}
                    />
                  ))}
                </span>
              </ChatBubble>
            </div>
          )}
          <div ref={endRef} />
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className="flex flex-wrap justify-end gap-1.5 px-4 pb-3">
          {suggestions.map((q) => (
            <button
              key={q.label}
              onClick={() => respond(q.label, q.topic)}
              className={`px-3 py-1 rounded-full border text-[13px] transition-colors ${
                q.topic === 'yes'
                  ? 'border-wati-green bg-wati-green text-white hover:bg-wati-green-dark'
                  : 'border-wati-green/40 text-wati-green hover:bg-wati-green/10'
              }`}
            >
              {q.label}
            </button>
          ))}
        </div>
      )}

      <ChatComposer channel="WhatsApp" onSend={(text) => respond(text)} placeholder="Reply to Astra…" />
    </div>
  );
}

// The offer, matched to the segment, as a message in the thread. It reads the
// live status, so a card sent earlier updates once Astra is switched on.
function AstraOfferCard() {
  const { profile, segment, status, routingMode, startAstraTrial, enableAstra } = useAstraAdoption();

  if (status === 'subscribed-on') {
    return (
      <div className="max-w-xs lg:max-w-md flex items-start gap-2.5 rounded-lg rounded-tl-none border border-wati-green/30 bg-wati-green/5 px-4 py-3">
        <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-wati-green" />
        <p className="text-sm font-medium text-gray-900">Astra is on — {ROUTING_COPY[routingMode].label}</p>
      </div>
    );
  }

  const mode = profile.recommended;
  return (
    <div className="max-w-xs lg:max-w-md rounded-lg rounded-tl-none border border-gray-200 bg-white overflow-hidden">
      <div className="px-4 py-3">
        <p className="text-sm font-medium text-gray-900">{ROUTING_COPY[mode].label}</p>
        <p className="text-xs text-gray-600 leading-relaxed mt-1">{ROUTING_COPY[mode].blurb}</p>
        {segment === 2 && (
          <p className="text-[11px] text-gray-500 mt-2">Your team keeps answering first — Astra only picks up what they cannot.</p>
        )}
      </div>
      <button
        onClick={() =>
          status === 'not-set-up' ? startAstraTrial('call_log_pinned') : enableAstra(mode, 'call_log_pinned')
        }
        className="w-full px-4 py-2.5 border-t border-gray-100 text-sm font-medium text-wati-green hover:bg-wati-green/5 transition-colors"
      >
        {status === 'not-set-up' ? 'Start 7-day free trial' : `Turn on ${ROUTING_COPY[mode].label}`}
      </button>
    </div>
  );
}

export default AstraConversation;
