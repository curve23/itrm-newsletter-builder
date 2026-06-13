import { useState } from 'react';

const SYSTEM_PROMPT = `You are a newsletter content parser for "Skye's Sundae Scoops" by In The Room Media — a New York City political newsletter.

Skye will paste a raw draft of her newsletter. Parse it and return ONLY valid JSON (no markdown, no explanation) matching this exact shape:

{
  "issueDetails": {
    "issueNumber": "",
    "date": "",
    "publication": "In The Room Media",
    "headerImageUrl": "",
    "openingQuote": "",
    "quoteAttribution": "",
    "introParagraphs": ""
  },
  "scene": { "stories": [], "bridges": [] },
  "cityHall": { "stories": [], "bridges": [] },
  "albanyRadar": { "stories": [], "bridges": [] },
  "theRooms": { "stories": [], "bridges": [] },
  "spotted": { "sightings": [], "photoCount": 0, "photos": [] },
  "overheard": { "quotes": [] },
  "moversShakers": { "stories": [], "bridges": [] },
  "comingUp": { "events": [] },
  "skyelights": { "text": "", "photo": null }
}

Rules:
- Each story object: { "id": <unique number>, "tag": "", "headline": "<story headline>", "body": "<full story body text>", "photos": [] }
- Each bridge object: { "id": <unique number>, "text": "<transition text>" }
- Each quote object: { "id": <unique number>, "text": "<quote without quotation marks>", "attribution": "<speaker name and title>" }
- Each event object: { "id": <unique number>, "date": "<date string>", "title": "<event name>", "details": "<details>" }
- Each sighting: { "id": <unique number>, "text": "<who was spotted where>" }
- Use unique incrementing numbers for all ids (e.g. 1001, 1002, 1003...)
- Map content to sections by topic: The Scene = general NYC political news; City Hall = mayoral/city government; Albany Radar = state legislature/governor; The Rooms = parties, events, gatherings, social scenes; Movers & Shakers = personnel moves, appointments, endorsements; Spotted = celebrity/politician sightings; Overheard = direct quotes; Coming Up = future events/dates; Skyelights = Skye's personal reflection/closing thoughts
- If content is ambiguous, make your best judgment on section placement
- Extract issue number (e.g. "#112"), date, and opening quote if present
- Preserve full body text — do not summarize or truncate
- Return ONLY the JSON object, nothing else`;

const SECTION_LABELS = {
  issueDetails: '⚙️ Issue Details',
  scene: '🎬 The Scene',
  cityHall: '🏛️ City Hall',
  albanyRadar: '🗳️ Albany Radar',
  theRooms: '🍸 The Rooms',
  spotted: '📍 Spotted',
  overheard: '💬 Overheard',
  moversShakers: '🎯 Movers & Shakers',
  comingUp: '📅 Coming Up',
  skyelights: '💡 Skyelights',
};

function countSection(key, val) {
  if (key === 'issueDetails') {
    return val?.issueNumber || val?.introParagraphs ? '✓ filled' : null;
  }
  if (key === 'scene' || key === 'cityHall' || key === 'albanyRadar' || key === 'theRooms' || key === 'moversShakers') {
    const n = val?.stories?.length || 0;
    return n > 0 ? `${n} stor${n === 1 ? 'y' : 'ies'}` : null;
  }
  if (key === 'spotted') return (val?.sightings?.length || 0) > 0 ? `${val.sightings.length} sighting${val.sightings.length === 1 ? '' : 's'}` : null;
  if (key === 'overheard') return (val?.quotes?.length || 0) > 0 ? `${val.quotes.length} quote${val.quotes.length === 1 ? '' : 's'}` : null;
  if (key === 'comingUp') return (val?.events?.length || 0) > 0 ? `${val.events.length} event${val.events.length === 1 ? '' : 's'}` : null;
  if (key === 'skyelights') return val?.text ? '✓ filled' : null;
  return null;
}

export default function PasteSortModal({ onApply, onClose }) {
  const [rawText, setRawText] = useState('');
  const [loading, setLoading] = useState(false);
  const [parsed, setParsed] = useState(null);
  const [error, setError] = useState('');
  const [stage, setStage] = useState('input'); // 'input' | 'preview'

  const handleSort = async () => {
    if (!rawText.trim()) return;
    setLoading(true);
    setError('');
    setParsed(null);

    try {
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
      if (!apiKey) throw new Error('VITE_ANTHROPIC_API_KEY is not set.');

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5',
          max_tokens: 8192,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: rawText }],
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `API error ${res.status}`);
      }

      const data = await res.json();
      const text = data?.content?.[0]?.text || '';

      // Strip any accidental markdown fences
      const jsonText = text.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim();
      const result = JSON.parse(jsonText);
      setParsed(result);
      setStage('preview');
    } catch (e) {
      setError(e.message || 'Something went wrong. Check the API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!parsed) return;
    if (confirm('This will replace your current draft. Continue?')) {
      onApply(parsed);
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        background: '#0f1a2e', border: '1px solid #2a3a5c', borderRadius: 12,
        width: '100%', maxWidth: 760, maxHeight: '90vh',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px 16px', borderBottom: '1px solid #2a3a5c',
          display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
        }}>
          <span style={{ fontSize: 22 }}>✨</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'League Spartan', fontWeight: 700, fontSize: 18, color: '#fff' }}>
              Paste & Sort
            </div>
            <div style={{ fontFamily: 'DM Mono', fontSize: 10, color: '#8899bb', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2 }}>
              AI-powered draft parser
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#8899bb', fontSize: 22, cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          {stage === 'input' && (
            <>
              <p style={{ fontFamily: 'Helvetica Neue, sans-serif', fontSize: 14, color: '#8899bb', marginBottom: 16, lineHeight: 1.6 }}>
                Paste your full raw newsletter draft below. Claude will read it and automatically sort your content into the right sections — stories, quotes, events, sightings, and more.
              </p>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste your full newsletter draft here…"
                style={{
                  width: '100%', minHeight: 340, background: '#1a2740',
                  border: '1px solid #2a3a5c', borderRadius: 8, color: '#e8eaf6',
                  fontFamily: 'Helvetica Neue, sans-serif', fontSize: 14, lineHeight: 1.7,
                  padding: '14px 16px', resize: 'vertical',
                }}
                autoFocus
              />
              {error && (
                <div style={{ marginTop: 12, background: '#2a1020', border: '1px solid #ff3366', borderRadius: 8, padding: '10px 14px', fontFamily: 'DM Mono', fontSize: 12, color: '#ff6688' }}>
                  ⚠ {error}
                </div>
              )}
            </>
          )}

          {stage === 'preview' && parsed && (
            <>
              <div style={{ marginBottom: 16, fontFamily: 'League Spartan', fontSize: 15, color: '#ff009d', fontWeight: 700 }}>
                ✓ Parsed successfully — here's what Claude found:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {Object.entries(SECTION_LABELS).map(([key, label]) => {
                  const count = countSection(key, parsed[key]);
                  return (
                    <div key={key} style={{
                      background: '#1a2740', borderRadius: 8, padding: '12px 16px',
                      border: `1px solid ${count ? '#ff009d44' : '#2a3a5c'}`,
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                      <span style={{ fontFamily: 'League Spartan', fontSize: 13, color: count ? '#e8eaf6' : '#4a5a7c' }}>{label}</span>
                      {count
                        ? <span style={{ fontFamily: 'DM Mono', fontSize: 11, color: '#ff009d' }}>{count}</span>
                        : <span style={{ fontFamily: 'DM Mono', fontSize: 11, color: '#4a5a7c' }}>empty</span>
                      }
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: 16, background: '#1a2740', borderRadius: 8, padding: '12px 16px', border: '1px solid #2a3a5c' }}>
                <div style={{ fontFamily: 'DM Mono', fontSize: 10, color: '#8899bb', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Not happy? Go back and re-paste</div>
                <button
                  onClick={() => { setStage('input'); setParsed(null); setError(''); }}
                  className="btn-secondary"
                  style={{ fontSize: 12, padding: '4px 12px' }}
                >← Back to editor</button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px', borderTop: '1px solid #2a3a5c',
          display: 'flex', gap: 10, justifyContent: 'flex-end', flexShrink: 0,
        }}>
          <button className="btn-secondary" onClick={onClose} style={{ fontSize: 13 }}>Cancel</button>
          {stage === 'input' && (
            <button
              className="btn-primary"
              onClick={handleSort}
              disabled={loading || !rawText.trim()}
              style={{ fontSize: 13, opacity: loading || !rawText.trim() ? 0.6 : 1, minWidth: 140 }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ display: 'inline-block', width: 12, height: 12, border: '2px solid #fff4', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  Sorting…
                </span>
              ) : '✨ Sort with AI'}
            </button>
          )}
          {stage === 'preview' && parsed && (
            <button className="btn-primary" onClick={handleApply} style={{ fontSize: 13 }}>
              ✓ Apply to Builder
            </button>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
