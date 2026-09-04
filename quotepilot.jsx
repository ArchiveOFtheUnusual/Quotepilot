import React, { useState, useEffect } from 'react';
import { Sparkles, Trash2, Plus } from 'lucide-react';

const TRADES = ['General', 'Plumbing', 'Electrical', 'Flooring', 'Roofing', 'HVAC'];
const STORAGE_KEY = 'quotepilot-quotes';

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function calcPricing(materials, laborHours, laborRate, markupPercent) {
  const materialsNum = parseFloat(materials) || 0;
  const laborHoursNum = parseFloat(laborHours) || 0;
  const laborRateNum = parseFloat(laborRate) || 0;
  const markupNum = parseFloat(markupPercent) || 0;

  const laborTotal = laborHoursNum * laborRateNum;
  const subtotal = materialsNum + laborTotal;
  const markupAmount = subtotal * (markupNum / 100);
  const total = subtotal + markupAmount;

  return { materialsNum, laborTotal, subtotal, markupAmount, total };
}

function formatCurrency(num) {
  return '$' + (Number.isFinite(num) ? num : 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function QuotePilot() {
  const [view, setView] = useState('new');
  const [customerName, setCustomerName] = useState('');
  const [trade, setTrade] = useState('General');
  const [jobDescription, setJobDescription] = useState('');
  const [scopeItems, setScopeItems] = useState([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState(null);
  const [savedQuotes, setSavedQuotes] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [saveStatus, setSaveStatus] = useState('idle');
  const [materials, setMaterials] = useState('');
  const [laborHours, setLaborHours] = useState('');
  const [laborRate, setLaborRate] = useState('');
  const [markupPercent, setMarkupPercent] = useState('20');

  const pricing = calcPricing(materials, laborHours, laborRate, markupPercent);

  useEffect(() => {
    async function loadQuotes() {
      try {
        const result = await window.storage.get(STORAGE_KEY, false);
        if (result && result.value) {
          setSavedQuotes(JSON.parse(result.value));
        }
      } catch (e) {
        // no saved quotes yet
      } finally {
        setLoadingSaved(false);
      }
    }
    loadQuotes();
  }, []);

  async function persistQuotes(next) {
    setSavedQuotes(next);
    try {
      await window.storage.set(STORAGE_KEY, JSON.stringify(next), false);
    } catch (e) {
      console.error('Failed to save', e);
    }
  }

  async function extractScope() {
    if (!jobDescription.trim()) {
      setError('Add a job description first.');
      return;
    }
    setError(null);
    setIsExtracting(true);
    try {
      const prompt = `You are helping a ${trade === 'General' ? 'general contractor' : trade.toLowerCase() + ' contractor'} turn a customer's message into a clear scope of work.

Customer's message:
"""${jobDescription}"""

Return ONLY a JSON array of short scope line items (strings), nothing else. No markdown, no code fences, no explanation. Each item should be a concrete task (e.g. "Remove existing flooring", "Install 600 sq ft of new flooring"). Keep between 3 and 8 items.`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!response.ok) {
        throw new Error('Request failed (' + response.status + ')');
      }

      const data = await response.json();
      const textBlock = (data.content || []).find((b) => b.type === 'text');
      if (!textBlock) throw new Error('No response text returned.');

      let cleaned = textBlock.text.trim();
      cleaned = cleaned.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/, '').trim();

      let items;
      try {
        items = JSON.parse(cleaned);
      } catch (parseErr) {
        throw new Error('Could not read the AI response as a scope list.');
      }

      if (!Array.isArray(items)) throw new Error('Unexpected response format.');

      setScopeItems(items.map((text) => ({ id: uid(), text })));
    } catch (e) {
      setError(e.message || 'Something went wrong extracting the scope.');
    } finally {
      setIsExtracting(false);
    }
  }

  function updateScopeItem(id, text) {
    setScopeItems((items) => items.map((it) => (it.id === id ? { ...it, text } : it)));
  }

  function removeScopeItem(id) {
    setScopeItems((items) => items.filter((it) => it.id !== id));
  }

  function addScopeItem() {
    setScopeItems((items) => [...items, { id: uid(), text: '' }]);
  }

  async function saveQuote() {
    if (!customerName.trim()) {
      setError('Add a customer name before saving.');
      return;
    }
    setSaveStatus('saving');
    const quote = {
      id: uid(),
      customerName,
      trade,
      jobDescription,
      scopeItems,
      materials,
      laborHours,
      laborRate,
      markupPercent,
      createdAt: new Date().toISOString(),
    };
    const next = [quote, ...savedQuotes];
    await persistQuotes(next);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 1800);
  }

  function openSavedQuote(quote) {
    setCustomerName(quote.customerName);
    setTrade(quote.trade || 'General');
    setJobDescription(quote.jobDescription);
    setScopeItems(quote.scopeItems || []);
    setMaterials(quote.materials || '');
    setLaborHours(quote.laborHours || '');
    setLaborRate(quote.laborRate || '');
    setMarkupPercent(quote.markupPercent || '20');
    setView('new');
  }

  function deleteSavedQuote(id) {
    const next = savedQuotes.filter((q) => q.id !== id);
    persistQuotes(next);
  }

  function startNewQuote() {
    setCustomerName('');
    setTrade('General');
    setJobDescription('');
    setScopeItems([]);
    setMaterials('');
    setLaborHours('');
    setLaborRate('');
    setMarkupPercent('20');
    setError(null);
    setView('new');
  }

  const colors = {
    bg: '#101B2E',
    surface: '#17223A',
    border: '#283A57',
    textPrimary: '#EEF2FA',
    textSecondary: '#8492AD',
    accent: '#F5B942',
    success: '#6FBF8B',
    danger: '#E2574C',
  };

  return (
    <div style={{ background: colors.bg, color: colors.textPrimary, minHeight: '100%', fontFamily: 'Inter, sans-serif', padding: '28px 20px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@600;700&family=Inter:wght@400;500;600&display=swap');
        .qp-input, .qp-textarea, .qp-select {
          width: 100%;
          background: ${colors.surface};
          border: 1px solid ${colors.border};
          border-radius: 6px;
          color: ${colors.textPrimary};
          padding: 10px 12px;
          font-family: Inter, sans-serif;
          font-size: 14px;
          box-sizing: border-box;
        }
        .qp-input:focus, .qp-textarea:focus, .qp-select:focus {
          outline: none;
          border-color: ${colors.accent};
        }
        .qp-btn {
          font-family: Inter, sans-serif;
          font-weight: 600;
          border-radius: 6px;
          padding: 10px 16px;
          font-size: 14px;
          cursor: pointer;
          border: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .qp-btn:disabled { opacity: 0.55; cursor: not-allowed; }
      `}</style>

      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28, borderBottom: `1px solid ${colors.border}`, paddingBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 700, fontSize: 34, letterSpacing: '0.01em', margin: 0, lineHeight: 1 }}>QUOTEPILOT</h1>
            <p style={{ color: colors.textSecondary, fontSize: 13, margin: '6px 0 0' }}>Turn a customer's message into a scoped estimate.</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="qp-btn"
              onClick={startNewQuote}
              style={{ background: view === 'new' ? colors.accent : 'transparent', color: view === 'new' ? colors.bg : colors.textSecondary, border: `1px solid ${view === 'new' ? colors.accent : colors.border}` }}
            >
              New quote
            </button>
            <button
              className="qp-btn"
              onClick={() => setView('saved')}
              style={{ background: view === 'saved' ? colors.accent : 'transparent', color: view === 'saved' ? colors.bg : colors.textSecondary, border: `1px solid ${view === 'saved' ? colors.accent : colors.border}` }}
            >
              Saved ({savedQuotes.length})
            </button>
          </div>
        </header>

        {view === 'saved' ? (
          <div>
            {loadingSaved ? (
              <p style={{ color: colors.textSecondary }}>Loading saved quotes…</p>
            ) : savedQuotes.length === 0 ? (
              <div style={{ border: `1px dashed ${colors.border}`, borderRadius: 8, padding: 32, textAlign: 'center', color: colors.textSecondary }}>
                No saved quotes yet. Start a new one and save it once the scope looks right.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {savedQuotes.map((q) => {
                  const qPricing = calcPricing(q.materials, q.laborHours, q.laborRate, q.markupPercent);
                  return (
                    <div key={q.id} style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 8, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{q.customerName}</div>
                        <div style={{ color: colors.textSecondary, fontSize: 13 }}>{q.trade} · {(q.scopeItems || []).length} scope items · {formatCurrency(qPricing.total)} · {new Date(q.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="qp-btn" onClick={() => openSavedQuote(q)} style={{ background: 'transparent', border: `1px solid ${colors.border}`, color: colors.textPrimary }}>Open</button>
                        <button className="qp-btn" onClick={() => deleteSavedQuote(q.id)} style={{ background: 'transparent', border: `1px solid ${colors.border}`, color: colors.danger }}>Delete</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 1fr) minmax(260px, 1.1fr)', gap: 20 }}>
            <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20 }}>
              <label style={{ display: 'block', fontSize: 12, color: colors.textSecondary, marginBottom: 6 }}>Customer name</label>
              <input className="qp-input" style={{ marginBottom: 14 }} value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Mike R." />

              <label style={{ display: 'block', fontSize: 12, color: colors.textSecondary, marginBottom: 6 }}>Trade</label>
              <select className="qp-select" style={{ marginBottom: 14 }} value={trade} onChange={(e) => setTrade(e.target.value)}>
                {TRADES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>

              <label style={{ display: 'block', fontSize: 12, color: colors.textSecondary, marginBottom: 6 }}>Customer's request</label>
              <textarea
                className="qp-textarea"
                style={{ marginBottom: 14, minHeight: 120, resize: 'vertical' }}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder='e.g. "Need 600 sq ft of flooring installed. Remove old floor. Baseboards need replacing."'
              />

              {error && (
                <div style={{ background: 'rgba(226,87,76,0.14)', border: `1px solid ${colors.danger}`, color: '#F3A99E', borderRadius: 6, padding: '8px 10px', fontSize: 13, marginBottom: 14 }}>
                  {error}
                </div>
              )}

              <button className="qp-btn" style={{ width: '100%', background: colors.accent, color: colors.bg }} onClick={extractScope} disabled={isExtracting}>
                <Sparkles size={16} />
                {isExtracting ? 'Reading the job…' : 'Extract scope'}
              </button>
            </div>

            <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ fontSize: 12, color: colors.textSecondary }}>Scope of work</span>
                {scopeItems.length > 0 && (
                  <button className="qp-btn" onClick={addScopeItem} style={{ background: 'transparent', color: colors.accent, padding: '4px 8px', fontSize: 13 }}>
                    <Plus size={14} /> Add item
                  </button>
                )}
              </div>

              {scopeItems.length === 0 ? (
                <div style={{ border: `1px dashed ${colors.border}`, borderRadius: 8, padding: 28, textAlign: 'center', color: colors.textSecondary, fontSize: 13 }}>
                  Describe the job on the left and click "Extract scope" — the list will show up here, ready to edit before pricing.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                  {scopeItems.map((item) => (
                    <div key={item.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <input
                        className="qp-input"
                        value={item.text}
                        onChange={(e) => updateScopeItem(item.id, e.target.value)}
                      />
                      <button onClick={() => removeScopeItem(item.id)} style={{ background: 'transparent', border: 'none', color: colors.textSecondary, cursor: 'pointer', padding: 4 }} aria-label="Remove item">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {scopeItems.length > 0 && (
                <button className="qp-btn" style={{ width: '100%', background: 'transparent', border: `1px solid ${colors.accent}`, color: colors.accent }} onClick={saveQuote} disabled={saveStatus === 'saving'}>
                  {saveStatus === 'saved' ? 'Saved ✓' : saveStatus === 'saving' ? 'Saving…' : 'Save quote'}
                </button>
              )}
            </div>
          </div>
        )}

        {view === 'new' && scopeItems.length > 0 && (
          <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20, marginTop: 20, display: 'grid', gridTemplateColumns: 'minmax(220px, 1fr) minmax(240px, 1fr)', gap: 24 }}>
            <div>
              <span style={{ fontSize: 12, color: colors.textSecondary, display: 'block', marginBottom: 14 }}>Pricing</span>

              <label style={{ display: 'block', fontSize: 12, color: colors.textSecondary, marginBottom: 6 }}>Materials ($)</label>
              <input className="qp-input" style={{ marginBottom: 12 }} type="number" min="0" step="0.01" value={materials} onChange={(e) => setMaterials(e.target.value)} placeholder="0.00" />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: colors.textSecondary, marginBottom: 6 }}>Labor hours</label>
                  <input className="qp-input" type="number" min="0" step="0.5" value={laborHours} onChange={(e) => setLaborHours(e.target.value)} placeholder="0" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: colors.textSecondary, marginBottom: 6 }}>Rate ($/hr)</label>
                  <input className="qp-input" type="number" min="0" step="0.01" value={laborRate} onChange={(e) => setLaborRate(e.target.value)} placeholder="0.00" />
                </div>
              </div>

              <label style={{ display: 'block', fontSize: 12, color: colors.textSecondary, marginBottom: 6 }}>Markup (%)</label>
              <input className="qp-input" type="number" min="0" step="1" value={markupPercent} onChange={(e) => setMarkupPercent(e.target.value)} placeholder="20" />
            </div>

            <div>
              <span style={{ fontSize: 12, color: colors.textSecondary, display: 'block', marginBottom: 14 }}>Breakdown</span>
              <table style={{ width: '100%', fontSize: 14, borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '5px 0', color: colors.textSecondary }}>Materials</td>
                    <td style={{ padding: '5px 0', textAlign: 'right' }}>{formatCurrency(pricing.materialsNum)}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '5px 0', color: colors.textSecondary }}>Labor ({laborHours || 0}h × {formatCurrency(parseFloat(laborRate) || 0)}/hr)</td>
                    <td style={{ padding: '5px 0', textAlign: 'right' }}>{formatCurrency(pricing.laborTotal)}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '5px 0', color: colors.textSecondary, borderTop: `1px solid ${colors.border}` }}>Subtotal</td>
                    <td style={{ padding: '5px 0', textAlign: 'right', borderTop: `1px solid ${colors.border}` }}>{formatCurrency(pricing.subtotal)}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '5px 0', color: colors.textSecondary }}>Markup ({markupPercent || 0}%)</td>
                    <td style={{ padding: '5px 0', textAlign: 'right' }}>{formatCurrency(pricing.markupAmount)}</td>
                  </tr>
                </tbody>
              </table>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 12, paddingTop: 12, borderTop: `1px solid ${colors.border}` }}>
                <span style={{ fontWeight: 600 }}>Total</span>
                <span style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 700, fontSize: 26 }}>{formatCurrency(pricing.total)}</span>
              </div>
            </div>
          </div>
        )}

        <p style={{ marginTop: 24, fontSize: 12, color: colors.textSecondary }}>
          Sections 1–2 of 4 — PDF export and email send come next.
        </p>
      </div>
    </div>
  );
}
